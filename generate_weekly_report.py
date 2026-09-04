import os
import re
import json
import urllib.request
import argparse
from PIL import Image, ImageDraw, ImageFont

# Path Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BRAIN_DIR = r"C:\Users\Bill\.gemini\antigravity\brain\1a56f90d-0b29-49e3-8288-0c94833c786b"
TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "s16_shame.jpg")
TEAMS_DATA_PATH = os.path.join(BASE_DIR, "teams_data.js")
ROSTER_DATA_PATH = os.path.join(BASE_DIR, "roster_data.js")

def fetch_html(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"[!] Error fetching {url}: {e}")
        return ""

def load_roster_data():
    if not os.path.exists(ROSTER_DATA_PATH):
        return {}
    with open(ROSTER_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'const\s+rosterData\s*=\s*({.*?});', content, re.DOTALL)
    if not match:
        return {}
    try:
        data = json.loads(match.group(1))
        # Map name -> car
        mapping = {}
        for num, info in data.items():
            name = info.get("driver")
            if name:
                mapping[name.upper().strip()] = num
        return mapping
    except Exception as e:
        print(f"[!] Error parsing roster data: {e}")
        return {}

def load_latest_race_results():
    if not os.path.exists(TEAMS_DATA_PATH):
        print(f"[!] teams_data.js not found at {TEAMS_DATA_PATH}")
        return []
    with open(TEAMS_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'const\s+teamsData\s*=\s*({.*?});', content, re.DOTALL)
    if not match:
        print("[!] Could not extract teamsData")
        return []
    try:
        data = json.loads(match.group(1))
        latest = data.get("latestRace", {})
        return latest.get("results", [])
    except Exception as e:
        print(f"[!] Error parsing teamsData: {e}")
        return []

def parse_car_numbers_from_html(html):
    # Parse drivers dictionary
    drivers = {}
    driver_matches = re.finditer(r'"(\d+)":\s*\{\s*"driver_id"\s*:\s*"\d+"\s*,\s*"name"\s*:\s*"([^"]+)"', html)
    for m in driver_matches:
        drivers[m.group(1)] = m.group(2)
        
    # Map name -> car number
    name_to_car = {}
    result_matches = re.finditer(
        r'\{[^{}]*"driver_id"\s*:\s*"(\d+)"[^{}]*"driver_number"\s*:\s*"([^"]+)"', 
        html
    )
    for m in result_matches:
        d_id = m.group(1)
        num = m.group(2)
        name = drivers.get(d_id)
        if name:
            name_to_car[name.upper().strip()] = num
            
    return name_to_car

def get_race_details(html):
    # Parse track and date
    track_match = re.search(r"<span class='track-name'[^>]*>(.*?)</span>", html)
    track_name = track_match.group(1).strip() if track_match else "Unknown Track"
    # Clean up track name suffix
    track_name_clean = re.sub(r'\s+(Raceway|Speedway|International Speedway|Motor Speedway|Motorsports Park)', '', track_name)
    
    date_match = re.search(r"<span class='race-details'[^>]*>(.*?)</span>", html)
    if date_match:
        race_date = date_match.group(1).split('&#183;')[0].strip()
    else:
        meta_match = re.search(r"<div class='track-meta'[^>]*>(.*?)<span>", html)
        race_date = meta_match.group(1).strip() if meta_match else "Unknown Date"

    return track_name_clean, race_date

def parse_race_control_notes(notes_path, driver_results):
    if not os.path.exists(notes_path):
        print(f"[!] Race control notes not found at {notes_path}")
        return []
        
    with open(notes_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Create car number to driver name mapping
    car_to_name = {r["car"]: r["name"] for r in driver_results}
    # Standardize single-digit car numbers with leading zeros if needed
    for car, name in list(car_to_name.items()):
        if len(car) == 1:
            car_to_name["0" + car] = name
            
    incidents = []
    current_incident = None
    
    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue
            
        # Ignore arca brake lines as requested
        if "arca brake" in line_str.lower():
            continue
            
        # Check if line indicates a new lap incident: "Lap X, ..."
        lap_match = re.match(r'^Lap\s+(\d+),\s*(.*)$', line_str, re.IGNORECASE)
        if lap_match:
            if current_incident:
                incidents.append(current_incident)
            lap_num = lap_match.group(1)
            desc = lap_match.group(2)
            
            # Find which cars were involved from the description
            cars_involved = re.findall(r'\b(?:car\s+)?(0\d|\d+)\b', desc, re.IGNORECASE)
            drivers_involved = []
            for c in cars_involved:
                c_clean = c.lstrip('0') if c != '00' and c != '08' and c != '02' and c != '04' else c
                if c_clean in car_to_name:
                    drivers_involved.append((c_clean, car_to_name[c_clean]))
                elif c in car_to_name:
                    drivers_involved.append((c, car_to_name[c]))
            
            current_incident = {
                "lap": lap_num,
                "description": desc,
                "rulings": [],
                "drivers": list(set(drivers_involved)) # deduplicate
            }
        elif current_incident:
            # Add rulings or notes to current incident
            current_incident["rulings"].append(line_str)
            
    if current_incident:
        incidents.append(current_incident)
        
    return incidents

def generate_report_markdown(track_clean, race_date, incidents, results):
    high_concern = []
    medium_concern = []
    low_concern = []
    
    # Track drivers who got penalized
    penalized_drivers = set()
    
    for inc in incidents:
        # Determine gravity of incident
        description_lower = inc["description"].lower()
        rulings_joined = " ".join(inc["rulings"]).lower()
        
        is_retaliation = "retaliation" in description_lower or "retaliation" in rulings_joined
        is_racing_deal = "racing deal" in description_lower or "racing deal" in rulings_joined
        
        # Check if any EOL is specified for a specific car
        eol_cars = re.findall(r'eol\s+(\d+|00|08|02|04)', rulings_joined)
        
        for car, name in inc["drivers"]:
            driver_info = {
                "name": name,
                "car": car,
                "lap": inc["lap"],
                "desc": inc["description"],
                "ruling": ", ".join(inc["rulings"]) if inc["rulings"] else "No official ruling"
            }
            
            # Was this specific driver penalized?
            is_driver_eol = (car in eol_cars) or (car.lstrip('0') in eol_cars)
            if "eol" in rulings_joined and len(inc["drivers"]) == 1:
                is_driver_eol = True
                
            if is_retaliation or is_driver_eol:
                high_concern.append(driver_info)
                penalized_drivers.add(name)
            elif is_racing_deal:
                low_concern.append(driver_info)
            elif len(eol_cars) > 0 and not is_driver_eol:
                # They were the victim of an EOL penalty, NOT the cause
                low_concern.append(driver_info)
            else:
                # No EOL was specified, but there was contact that wasn't a racing deal
                medium_concern.append(driver_info)
                
    # Filter out drivers in high concern from medium/low concern lists to keep it clean
    high_names = {x["name"] for x in high_concern}
    medium_concern = [x for x in medium_concern if x["name"] not in high_names]
    
    # Group low concern (racing deals / innocent victims)
    clean_low_concern = []
    for x in low_concern:
        if x["name"] not in high_names and len([y for y in clean_low_concern if y["name"] == x["name"] and y["lap"] == x["lap"]]) == 0:
            clean_low_concern.append(x)
            
    # Find safest drivers (low incidents in Sim Hub, and NOT in high_concern/penalized)
    clean_drivers = []
    for r in results:
        if r["name"] not in penalized_drivers and r["incidents"] <= 4:
            clean_drivers.append(r)
    clean_drivers.sort(key=lambda x: (x["incidents"], x["finish"]))
    
    # Generate Markdown
    md = []
    banner_filename = f"wall_of_shame_banner_{track_clean.lower()}.jpg"
    md.append(f"![BRL Wall of Shame Banner]({BRAIN_DIR}/{banner_filename})\n")
    md.append(f"# Discord Wall of Shame - {track_clean} (Season 16, {race_date})\n")
    md.append("This report breaks down the incident logs and caution triggers to identify safety hazards, medium-concern incidents, and the cleanest drivers of the week.\n")
    md.append("--- \n")
    
    # Count how many incidents each driver was involved in (from race control logs)
    incident_counts = {}
    for inc in incidents:
        for car, name in inc["drivers"]:
            incident_counts[name] = incident_counts.get(name, 0) + 1

    md.append("## 🚨 Watch Out For (High Concern / Safety Hazard)\n")
    if high_concern:
        by_driver = {}
        for item in high_concern:
            by_driver.setdefault(item["name"], []).append(item)
            
        # Sort by total incident involvement count descending
        sorted_high = sorted(by_driver.items(), key=lambda x: incident_counts.get(x[0], 0), reverse=True)
        
        for name, items in sorted_high:
            car = items[0]["car"]
            inv_count = incident_counts.get(name, 1)
            md.append(f"### 🔴 {name} (Car #{car}) — Involved in {inv_count} {'Incidents' if inv_count > 1 else 'Incident'}")
            for item in items:
                md.append(f"- **Lap {item['lap']}**: {item['desc']}")
                md.append(f"  - **Ruling**: {item['ruling']}")
            md.append("")
    else:
        md.append("*No drivers in high concern category this week.*\n")
        
    md.append("--- \n")
    md.append("## ⚠️ Medium Concern (Incident Triggers)\n")
    if medium_concern:
        by_driver = {}
        for item in medium_concern:
            by_driver.setdefault(item["name"], []).append(item)
            
        # Sort by total incident involvement count descending
        sorted_medium = sorted(by_driver.items(), key=lambda x: incident_counts.get(x[0], 0), reverse=True)
        
        for name, items in sorted_medium:
            car = items[0]["car"]
            inv_count = incident_counts.get(name, 1)
            md.append(f"### 🟡 {name} (Car #{car}) — Involved in {inv_count} {'Incidents' if inv_count > 1 else 'Incident'}")
            for item in items:
                md.append(f"- **Lap {item['lap']}**: {item['desc']}")
                md.append(f"  - **Ruling**: {item['ruling']}")
            md.append("")
    else:
        md.append("*No drivers in medium concern category this week.*\n")
        
    md.append("--- \n")
    md.append("## 🟢 Safe / Racing Deals (Low Concern)\n")
    if clean_low_concern:
        for item in clean_low_concern:
            md.append(f"- **{item['name']} (Car #{item['car']}) — Lap {item['lap']}**: {item['desc']}")
            md.append(f"  - **Ruling**: {item['ruling']}")
        md.append("")
    else:
        md.append("*No racing deal incidents logged this week.*\n")
        
    md.append("--- \n")
    md.append("## 🏆 Safest Drivers of the Week (Clean Sheet)\n")
    md.append("These drivers stayed out of trouble, avoided all penalties, and maintained clean incident records:\n")
    md.append("| Position | Driver | Car Number | Incidents |")
    md.append("| :--- | :--- | :---: | :---: |")
    for r in clean_drivers[:6]:
        md.append(f"| **P{r['finish']}** | **{r['name']}** | #{r['car']} | **{r['incidents']}** |")
        
    return "\n".join(md)

def draw_banner_text(track_clean):
    if not os.path.exists(TEMPLATE_PATH):
        print(f"[!] Base banner template not found at {TEMPLATE_PATH}")
        return
        
    img = Image.open(TEMPLATE_PATH)
    draw = ImageDraw.Draw(img)
    
    font_path = r"C:\Windows\Fonts\impact.ttf"
    if not os.path.exists(font_path):
        font_path = "arial.ttf"
        
    text = f"POST {track_clean.upper()} REPORT"
    font = ImageFont.truetype(font_path, 42)
    
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    
    x = (img.size[0] - text_width) // 2
    y = 530
    
    draw.text((x+2, y+2), text, fill=(0, 0, 0), font=font)
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    output_filename = f"wall_of_shame_banner_{track_clean.lower()}.jpg"
    
    output_path = os.path.join(BASE_DIR, "assets", "S16_SHAME", output_filename)
    img.save(output_path, "JPEG", quality=95)
    print(f"[+] Final banner generated successfully in assets: {output_path}")
    
    try:
        brain_path = os.path.join(BRAIN_DIR, output_filename)
        img.save(brain_path, "JPEG", quality=95)
        print(f"[+] Synced banner to brain: {brain_path}")
    except Exception as e:
        print(f"[!] Warning: Failed to sync banner to brain: {e}")

def main():
    parser = argparse.ArgumentParser(description="Generate Weekly Wall of Shame Report")
    parser.add_argument("--schedule_id", type=str, required=True, help="SimRacerHub schedule ID for the race")
    parser.add_argument("--notes", type=str, default="race_control_notes.txt", help="Path to race control notes text file")
    
    args = parser.parse_args()
    
    print("[*] Fetching SimRacerHub schedule data...")
    url = f"https://simracerhub.com/season_race.php?schedule_id={args.schedule_id}"
    html = fetch_html(url)
    if not html:
        print("[!] Failed to fetch HTML from SimRacerHub.")
        return
        
    print("[*] Loading database and roster files...")
    raw_results = load_latest_race_results()
    roster_mapping = load_roster_data()
    html_car_mapping = parse_car_numbers_from_html(html)
    
    # Process results with correct final positions, incidents, and car numbers
    processed_results = []
    for r in raw_results:
        driver_name = r.get("name", "").strip().upper()
        # Find car number
        car_num = html_car_mapping.get(driver_name)
        if not car_num:
            car_num = roster_mapping.get(driver_name, "N/A")
            
        processed_results.append({
            "name": r.get("name"),
            "car": car_num,
            "finish": r.get("finish"),
            "incidents": r.get("incidents")
        })
        
    track_clean, race_date = get_race_details(html)
    print(f"[+] Race: {track_clean} on {race_date}")
    print(f"[+] Processed {len(processed_results)} drivers from latest race database.")
    
    print("[*] Parsing race control notes...")
    notes_path = os.path.join(BASE_DIR, args.notes)
    incidents = parse_race_control_notes(notes_path, processed_results)
    print(f"[+] Parsed {len(incidents)} incidents from race control.")
    
    print("[*] Generating report Markdown...")
    report_md = generate_report_markdown(track_clean, race_date, incidents, processed_results)
    
    report_filename = f"discord_wall_of_shame_{track_clean.lower()}.md"
    
    report_path = os.path.join(BASE_DIR, "assets", "S16_SHAME", report_filename)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_md)
    print(f"[+] Report generated successfully locally: {report_path}")
    
    try:
        brain_report_path = os.path.join(BRAIN_DIR, report_filename)
        with open(brain_report_path, "w", encoding="utf-8") as f:
            f.write(report_md)
        print(f"[+] Synced report to brain: {brain_report_path}")
    except Exception as e:
        print(f"[!] Warning: Failed to sync report to brain: {e}")
        
    print("[*] Drawing customized track name on banner...")
    draw_banner_text(track_clean)
    
    print("=" * 60)
    print("                 WEEKLY REPORT COMPLETED!")
    print(f"Local Report: {report_path}")
    print(f"Local Banner: {os.path.join(BASE_DIR, 'assets', 'S16_SHAME', f'wall_of_shame_banner_{track_clean.lower()}.jpg')}")
    print("=" * 60)

if __name__ == "__main__":
    main()
