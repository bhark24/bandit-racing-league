import os
import re
import json
import html
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def norm(name):
    if not name:
        return ""
    s = re.sub(r'[^A-Z0-9]', '', name.upper())
    return s

def main():
    with open(os.path.join(BASE_DIR, "live_standings_data.json"), "r", encoding="utf-8") as f:
        srh = json.load(f)

    with open(os.path.join(BASE_DIR, "roster_data.js"), "r", encoding="utf-8") as f:
        r_text = f.read()
    roster_data = json.loads(re.search(r'const\s+rosterData\s*=\s*({.*?});', r_text, re.DOTALL).group(1))

    with open(os.path.join(BASE_DIR, "teams_data.js"), "r", encoding="utf-8") as f:
        t_text = f.read()
    teams_data = json.loads(re.search(r'const\s+teamsData\s*=\s*({.*?});', t_text, re.DOTALL).group(1))

    # Build lookup from normalized driver name -> car number & status
    driver_to_car = {}
    for num, info in roster_data.items():
        dname = (info.get("driver") or "").strip()
        if dname and dname.lower() != "available":
            n = norm(dname)
            if n not in driver_to_car:
                driver_to_car[n] = {"car": num, "status": info.get("status", "full-time"), "display": dname.upper()}

    # Manual aliases for middle initials / suffixes in SimRacerHub
    aliases = {
        "BENJAMINILACY": "BENJAMINLACY",
        "JOSHUADAMS": "JOSHADAMS",
        "JOSHUALADAMS": "JOSHADAMS",
        "JOHNATHONPLATT": "JONATHONPLATT",
        "RICKYHARTJR": "RICKYHART",
        "LOGANAMURRAY": "LOGANMURRAY",
        "DAVIDWESTOVER": "DAVIDWESTOVERJR",
        "TERRYKONDAS": "TERRYKONDUS",
        "DIANTERODER": "DI0NTERADER",
        "DIONTERADER": "DI0NTERADER",
        "MARKBIVENS": "MARKALANBIVENS",
        "JOSHUAASUTHERLAND": "JOSHUASUTHERLAND",
        "JOSHUABILLITER": "JOSHBILLITER"
    }

    def resolve_car_info(raw_name):
        # raw_name in SRH rps might be "Lacy, Benjamin" or in drivers dict "Benjamin I Lacy"
        if "," in raw_name:
            parts = [p.strip() for p in raw_name.split(",", 1)]
            flipped = f"{parts[1]} {parts[0]}"
        else:
            flipped = raw_name
        k = norm(flipped)
        if k in driver_to_car:
            return driver_to_car[k]
        if k in aliases and aliases[k] in driver_to_car:
            return driver_to_car[aliases[k]]
        # Partial match fallback
        for rk, rval in driver_to_car.items():
            if rk in k or k in rk:
                return rval
        return {"car": "--", "status": "part-time", "display": flipped.upper()}

    # Build driver -> team lookup from active franchises
    driver_to_team = {}
    for tm in teams_data.get("teams", []):
        if tm.get("isForSale") or tm.get("isSuspended"):
            continue
        tname = tm.get("name")
        for d in tm.get("primaryDrivers", []):
            if d and d != "VACANT":
                driver_to_team[norm(d)] = tname
        for d in tm.get("backupDrivers", []):
            if d and d != "VACANT":
                driver_to_team[norm(d)] = f"{tname} (Backup)"

    drivers_meta = srh.get("drivers", {})
    rps = srh.get("rps", {})
    tracks_meta = srh.get("tracks", {})
    schedules = srh.get("schedules", [])

    # 1. Compile Season 16 Drivers
    compiled_drivers = []
    for d_id, stats in rps.items():
        meta = drivers_meta.get(str(d_id), {})
        full_name = meta.get("name") or stats.get("name") or str(d_id)
        if "," in full_name:
            p = [x.strip() for x in full_name.split(",", 1)]
            full_name = f"{p[1]} {p[0]}"
        full_name = re.sub(r'\d+$', '', full_name).strip()

        car_info = resolve_car_info(full_name)
        norm_disp = norm(car_info["display"])
        team_name = driver_to_team.get(norm_disp) or driver_to_team.get(norm(full_name)) or "Independent / Free Agent"

        # Compute avgStart, avgFinish, bestFinish from race entries in stats["races"]
        races_dict = stats.get("races", {})
        qual_positions = []
        fin_positions = []
        for r_id, r_entry in races_dict.items():
            if r_entry.get("session") == "RACE" and r_entry.get("finish_pos") is not None:
                try:
                    fp = int(r_entry["finish_pos"])
                    if fp > 0:
                        fin_positions.append(fp)
                except Exception:
                    pass
                try:
                    qp = int(r_entry.get("qualify_pos") or 0)
                    if qp > 0:
                        qual_positions.append(qp)
                except Exception:
                    pass

        starts = int(stats.get("starts") or len(fin_positions) or 0)
        avg_start = round(sum(qual_positions) / len(qual_positions), 1) if qual_positions else 0.0
        avg_finish = round(sum(fin_positions) / len(fin_positions), 1) if fin_positions else 0.0
        best_finish = min(fin_positions) if fin_positions else 0
        inc = int(stats.get("inc") or 0)
        inc_per_start = round(inc / starts, 2) if starts > 0 else 0.0
        rat_sum = float(stats.get("rat") or 0.0)
        avg_rating = round(rat_sum / starts, 1) if starts > 0 else 0.0

        compiled_drivers.append({
            "driverId": int(d_id),
            "name": full_name,
            "rosterName": car_info["display"],
            "carNumber": car_info["car"],
            "status": car_info["status"],
            "team": team_name,
            "points": int(stats.get("tpts") or 0),
            "racePoints": int(stats.get("rpts") or 0),
            "stagePoints": int(stats.get("spts") or 0),
            "bonusPoints": int(stats.get("bpts") or 0),
            "starts": starts,
            "wins": int(stats.get("wins") or 0),
            "stageWins": int(stats.get("swins") or 0),
            "poles": int(stats.get("poles") or 0),
            "top3": int(stats.get("t3") or 0),
            "top5": int(stats.get("t5") or 0),
            "top10": int(stats.get("t10") or 0),
            "laps": int(stats.get("laps") or 0),
            "lapsLed": int(stats.get("led") or 0),
            "miles": round(float(stats.get("miles") or 0.0), 1),
            "incidents": inc,
            "incPerStart": inc_per_start,
            "avgStart": avg_start,
            "avgFinish": avg_finish,
            "bestFinish": best_finish,
            "avgRating": avg_rating
        })

    # Sort by points desc, wins desc, top5 desc
    compiled_drivers.sort(key=lambda x: (x["points"], x["wins"], x["top5"], x["top10"]), reverse=True)
    for idx, d in enumerate(compiled_drivers, 1):
        d["rank"] = idx
        d["isChase"] = idx <= 10

    # Also add any active roster drivers who have 0 starts in Season 16 yet (like new signees) so they appear in dropdowns
    existing_norms = {norm(d["rosterName"]) for d in compiled_drivers} | {norm(d["name"]) for d in compiled_drivers}
    for num, info in roster_data.items():
        dname = (info.get("driver") or "").strip()
        if dname and dname.lower() != "available" and norm(dname) not in existing_norms:
            tname = driver_to_team.get(norm(dname), "Independent / Free Agent")
            compiled_drivers.append({
                "driverId": 0,
                "name": dname.title(),
                "rosterName": dname.upper(),
                "carNumber": num,
                "status": info.get("status", "full-time"),
                "team": tname,
                "points": 0,
                "racePoints": 0,
                "stagePoints": 0,
                "bonusPoints": 0,
                "starts": 0,
                "wins": 0,
                "stageWins": 0,
                "poles": 0,
                "top3": 0,
                "top5": 0,
                "top10": 0,
                "laps": 0,
                "lapsLed": 0,
                "miles": 0.0,
                "incidents": 0,
                "incPerStart": 0.0,
                "avgStart": 0.0,
                "avgFinish": 0.0,
                "bestFinish": 0,
                "avgRating": 0.0,
                "rank": len(compiled_drivers) + 1,
                "isChase": False
            })

    # 2. Compile Season 16 Schedule & Track Records (21 Races)
    # Default event names & lap counts for races where SRH event_name is None
    default_event_meta = {
        1: ("Geezer Authentics App 80", 80, "24 / 48", "Daytona International Speedway"),
        2: ("Perfect Shine Auto 110", 110, "33 / 66", "EchoPark Speedway (Atlanta)"),
        3: ("Matco Tools 120", 120, "36 / 72", "Charlotte Motor Speedway"),
        4: ("Honey's Sweet Treats 200", 200, "60 / 120", "Bristol Motor Speedway"),
        5: ("Honey's Sweet Treats 130", 130, "39 / 78", "Nashville Superspeedway"),
        6: ("Tricky Triangle 75", 75, "22 / 45", "Pocono Raceway"),
        7: ("Commonwealth Short Track 160", 160, "48 / 96", "Richmond Raceway"),
        8: ("Joka Creations 100", 100, "30 / 60", "Michigan International Speedway"),
        9: ("Gateway 140", 140, "42 / 84", "World Wide Technology Raceway (Gateway)"),
        10: ("Tame the Wild Wall 130", 130, "39 / 78", "Darlington Raceway"),
        11: ("Kevin Foster 110", 110, "33 / 66", "Kansas Speedway"),
        12: ("Er'things Bigger in Texas 120", 120, "36 / 72", "Texas Motor Speedway"),
        13: ("Viva Las Vegas 110", 110, "33 / 66", "Las Vegas Motor Speedway"),
        14: ("Go Bowling at The Glen 52", 52, "15 / 30", "Watkins Glen International"),
        15: ("Desert Diamond 140", 140, "42 / 84", "Phoenix Raceway"),
        16: ("Regular Season Finale 190", 190, "57 / 114", "Martinsville Speedway"),
        17: ("The Rolling Thunder 185 (Chase Round 1)", 73, "21 / 42", "Talladega Superspeedway"),
        18: ("Wendy Jo Memorial 110 (Chase Round 2)", 110, "33 / 66", "Kansas Speedway"),
        19: ("Road America Showdown (Chase Round 3)", 45, "14 / 28", "Road America"),
        20: ("Desert Elimination 140 (Chase Round 4)", 140, "42 / 84", "Phoenix Raceway"),
        21: ("Clear Low Communications Championship Finale", 110, "33 / 66", "Homestead-Miami Speedway")
    }

    driver_id_to_info = {str(d["driverId"]): d for d in compiled_drivers if d["driverId"]}

    compiled_schedule = []
    race_num = 0
    for s in schedules:
        sched_id = str(s.get("schedule_id"))
        if sched_id == "363235":
            # Skip non-race Chase seeding reset entry
            continue
        race_num += 1
        cfg_id = str(s.get("config_id"))
        t_meta = tracks_meta.get(cfg_id, {})
        def_title, def_laps, def_stages, def_track = default_event_meta.get(race_num, (f"Season 16 Race {race_num}", 100, "30 / 60", "BRL Speedway"))

        raw_ev = s.get("event_name")
        event_name = html.unescape(raw_ev).strip() if raw_ev else def_title
        track_name = (t_meta.get("track_name") or def_track).strip()
        config_name = (t_meta.get("config_name") or "Oval").strip()
        length_mi = float(t_meta.get("length") or 1.5)
        turns = int(t_meta.get("turns") or 4)
        track_img = t_meta.get("track_iracing_img") or ""

        ts = int(s.get("race_date") or 0)
        dt_obj = datetime.fromtimestamp(ts)
        date_str = dt_obj.strftime("%Y-%m-%d")
        date_fmt = dt_obj.strftime("%b %d, %Y")

        is_road = turns > 5
        fuel_cap = "100% Fuel" if is_road else "70% Fuel Cap"
        tire_sets = "2 Total Sets (Start + 1 Pit)" if is_road else "3 Total Sets (Start + 2 Pit)"

        race_ids_obj = s.get("race_id") or {}
        s_drivers = s.get("drivers") or {}

        main_race_id = race_ids_obj.get("0.0") if isinstance(race_ids_obj, dict) else None
        st1_race_id = race_ids_obj.get("-0.9") if isinstance(race_ids_obj, dict) else None
        st2_race_id = race_ids_obj.get("-0.8") if isinstance(race_ids_obj, dict) else None

        is_completed = bool(main_race_id and str(main_race_id) in s_drivers and len(s_drivers[str(main_race_id)]) > 0)

        entry = {
            "raceNum": race_num,
            "scheduleId": sched_id,
            "dateStr": date_str,
            "dateFormatted": date_fmt,
            "eventName": event_name,
            "trackName": track_name,
            "configName": config_name,
            "lengthMiles": length_mi,
            "turns": turns,
            "trackLogo": track_img,
            "isChase": race_num >= 17,
            "isCompleted": is_completed,
            "scheduledLaps": def_laps,
            "stageBreaks": def_stages,
            "fuelCap": fuel_cap,
            "tireSets": tire_sets
        }

        if is_completed:
            participants = list(s_drivers[str(main_race_id)].values())
            participants.sort(key=lambda p: int(p.get("finish_pos") or 999))

            def fmt_drv(d_id_str):
                info = driver_id_to_info.get(str(d_id_str))
                if info:
                    return f"#{info['carNumber']} {info['name']}"
                m = drivers_meta.get(str(d_id_str), {})
                nm = m.get("name") or str(d_id_str)
                return nm

            winner_p = participants[0] if len(participants) > 0 else {}
            p2_p = participants[1] if len(participants) > 1 else {}
            p3_p = participants[2] if len(participants) > 2 else {}

            actual_laps = int(winner_p.get("num_laps") or def_laps)
            entry["scheduledLaps"] = actual_laps
            entry["distanceMiles"] = round(actual_laps * length_mi, 1)
            entry["winner"] = fmt_drv(winner_p.get("driver_id"))
            entry["secondPlace"] = fmt_drv(p2_p.get("driver_id")) if p2_p else "--"
            entry["thirdPlace"] = fmt_drv(p3_p.get("driver_id")) if p3_p else "--"
            entry["totalStarters"] = len(participants)

            # Pole winner
            pole_p = next((p for p in participants if str(p.get("qualify_pos")) == "1"), None)
            entry["poleWinner"] = fmt_drv(pole_p.get("driver_id")) if pole_p else "--"

            # Most laps led
            most_led_p = max(participants, key=lambda p: int(p.get("laps_led") or 0))
            most_led_cnt = int(most_led_p.get("laps_led") or 0)
            entry["mostLapsLed"] = f"{fmt_drv(most_led_p.get('driver_id'))} ({most_led_cnt} laps)" if most_led_cnt > 0 else "--"

            # Stage 1 & Stage 2 winners
            st1_winner = "--"
            if st1_race_id and str(st1_race_id) in s_drivers:
                st1_list = list(s_drivers[str(st1_race_id)].values())
                w1 = next((p for p in st1_list if str(p.get("finish_pos")) == "1"), None)
                if w1:
                    st1_winner = fmt_drv(w1.get("driver_id"))
            st2_winner = "--"
            if st2_race_id and str(st2_race_id) in s_drivers:
                st2_list = list(s_drivers[str(st2_race_id)].values())
                w2 = next((p for p in st2_list if str(p.get("finish_pos")) == "1"), None)
                if w2:
                    st2_winner = fmt_drv(w2.get("driver_id"))

            entry["stage1Winner"] = st1_winner
            entry["stage2Winner"] = st2_winner
            entry["top5"] = [
                {
                    "pos": int(p.get("finish_pos") or idx + 1),
                    "driver": fmt_drv(p.get("driver_id")),
                    "start": int(p.get("qualify_pos") or 0),
                    "lapsLed": int(p.get("laps_led") or 0),
                    "inc": int(p.get("incidents") or 0)
                }
                for idx, p in enumerate(participants[:5])
            ]
        else:
            entry["distanceMiles"] = round(def_laps * length_mi, 1)
            scouting_map = {
                18: "Progressive banking (17–20°) makes the high lane against the outside wall dominant on long green-flag runs. Race 11 Kansas Winner: #47 Michael Rakes (40 laps led by #7 Benjamin Lacy).",
                19: "Massive 4.048-mile, 14-turn road course test! Heavy braking zones into Turns 1, 5, 8, and 12 (Canada Corner) with only 2 total tire sets allowed.",
                20: "Flat 1.0-mile desert tri-oval with the wide-open dogleg! Race 15 Phoenix Winner: #9 Dylan McDonald (with #7 Benjamin Lacy leading 57 laps).",
                21: "Season 16 Championship Finale! High-wear 1.5-mile oval with variable 18–20° banking where rim-riding inches from the wall crowns the Season 16 Champion."
            }
            entry["scoutingNotes"] = scouting_map.get(race_num, "Official Bandit Racing League Championship Event • SimTrax Live Broadcast @ 9:00 PM EST.")

        compiled_schedule.append(entry)

    out_payload = {
        "updatedAt": datetime.now().strftime("%b %d, %Y"),
        "drivers": compiled_drivers,
        "schedule": compiled_schedule
    }

    out_path = os.path.join(BASE_DIR, "season16_stats_data.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("const season16StatsData = " + json.dumps(out_payload, indent=2) + ";\n")

    print(f"[+] Wrote season16_stats_data.js with {len(compiled_drivers)} drivers and {len(compiled_schedule)} schedule races!")

if __name__ == "__main__":
    main()
