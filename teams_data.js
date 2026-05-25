// Automatically generated. Source of truth for Bandit Racing League Team Economy.
const teamsData = {
  "tracks": {
    "daytona": { "name": "Daytona International Speedway", "city": "Daytona Beach, FL", "distance": 400, "airport": "DAB" },
    "atlanta": { "name": "Atlanta Motor Speedway", "city": "Hampton, GA", "distance": 250, "airport": "ATL" },
    "charlotte": { "name": "Charlotte Motor Speedway", "city": "Concord, NC", "distance": 0, "airport": "CLT" },
    "bristol": { "name": "Bristol Motor Speedway", "city": "Bristol, TN", "distance": 150, "airport": "TRI" },
    "nashville": { "name": "Nashville Superspeedway", "city": "Lebanon, TN", "distance": 400, "airport": "BNA" },
    "pocono": { "name": "Pocono Raceway", "city": "Long Pond, PA", "distance": 550, "airport": "AVP" },
    "richmond": { "name": "Richmond Raceway", "city": "Richmond, VA", "distance": 280, "airport": "RIC" },
    "michigan": { "name": "Michigan International Speedway", "city": "Brooklyn, MI", "distance": 620, "airport": "DTW" },
    "gateway": { "name": "World Wide Technology Raceway", "city": "Madison, IL", "distance": 700, "airport": "STL" },
    "darlington": { "name": "Darlington Raceway", "city": "Darlington, SC", "distance": 120, "airport": "CAE" },
    "kansas": { "name": "Kansas Speedway", "city": "Kansas City, KS", "distance": 980, "airport": "MCI" },
    "texas": { "name": "Texas Motor Speedway", "city": "Fort Worth, TX", "distance": 1050, "airport": "DFW" },
    "vegas": { "name": "Las Vegas Motor Speedway", "city": "Las Vegas, NV", "distance": 2100, "airport": "LAS" },
    "watkins": { "name": "Watkins Glen International", "city": "Watkins Glen, NY", "distance": 630, "airport": "ELM" },
    "phoenix": { "name": "Phoenix Raceway", "city": "Avondale, AZ", "distance": 2150, "airport": "PHX" },
    "martinsville": { "name": "Martinsville Speedway", "city": "Martinsville, VA", "distance": 130, "airport": "GSO" },
    "talladega": { "name": "Talladega Superspeedway", "city": "Lincoln, AL", "distance": 380, "airport": "BHM" },
    "road_america": { "name": "Road America", "city": "Elkhart Lake, WI", "distance": 850, "airport": "MKE" },
    "homestead": { "name": "Homestead-Miami Speedway", "city": "Homestead, FL", "distance": 680, "airport": "MIA" }
  },
  "teams": [
    {
      "id": "outlaw-racing",
      "name": "Outlaw Racing Technologies",
      "owner": "Bill Harkins",
      "homeBase": "Concord, NC",
      "logo": "assets/main-logo.png",
      "balance": 1400000,
      "drivers": {
        "primary": ["BILL HARKINS", "LOGAN MURRAY", "NICK NICKERSON", "RICKY HART"],
        "backup": ["SEAN BRITT", "JONATHON PLATT"]
      },
      "trucks": [
        { "id": "truck-1", "make": "Chevrolet", "name": "Outlaw Silverado #12", "condition": 100 },
        { "id": "truck-2", "make": "Chevrolet", "name": "Outlaw Silverado #4", "condition": 100 },
        { "id": "truck-3", "make": "Chevrolet", "name": "Outlaw Silverado #2", "condition": 100 },
        { "id": "truck-4", "make": "Chevrolet", "name": "Outlaw Silverado #1", "condition": 100 }
      ],
      "ledger": [
        { "date": "2026-05-24", "description": "Starting Franchise Balance", "category": "income", "amount": 2000000 },
        { "date": "2026-05-24", "description": "Purchased Fleet of 4x Chevy Silverado Trucks", "category": "expense", "amount": -600000 }
      ]
    },
    {
      "id": "geezer-performance",
      "name": "Geezer Performance App Racing",
      "owner": "Nicole Kriesel",
      "homeBase": "Charlotte, NC",
      "logo": "assets/geezer-icon.png",
      "balance": 1400000,
      "drivers": {
        "primary": ["NICOLE KRIESEL", "VICTOR WEAVER", "BOB BERRY", "JASON GREENWELL"],
        "backup": ["DYLAN NICASTRO", "ETHAN SIKORSKI"]
      },
      "trucks": [
        { "id": "truck-1", "make": "Ford", "name": "Geezer F-150 #6", "condition": 100 },
        { "id": "truck-2", "make": "Ford", "name": "Geezer F-150 #18", "condition": 100 },
        { "id": "truck-3", "make": "Ford", "name": "Geezer F-150 #75", "condition": 100 },
        { "id": "truck-4", "make": "Ford", "name": "Geezer F-150 #83", "condition": 100 }
      ],
      "ledger": [
        { "date": "2026-05-24", "description": "Starting Franchise Balance", "category": "income", "amount": 2000000 },
        { "date": "2026-05-24", "description": "Purchased Fleet of 4x Ford F-150 Trucks", "category": "expense", "amount": -600000 }
      ]
    },
    {
      "id": "simtrax-motorsports",
      "name": "SimTrax Broadcasting Group",
      "owner": "Johnathon Platt",
      "homeBase": "Concord, NC",
      "logo": "assets/simtrax-logo.png",
      "balance": 1400000,
      "drivers": {
        "primary": ["JONATHON PLATT", "JASON ALLEGRINI", "MATT CROCKETT", "JOSH ADAMS"],
        "backup": ["MATT BAILEY", "NATHAN SANTOS"]
      },
      "trucks": [
        { "id": "truck-1", "make": "Toyota", "name": "SimTrax Tundra #13", "condition": 100 },
        { "id": "truck-2", "make": "Toyota", "name": "SimTrax Tundra #14", "condition": 100 },
        { "id": "truck-3", "make": "Toyota", "name": "SimTrax Tundra #15", "condition": 100 },
        { "id": "truck-4", "make": "Toyota", "name": "SimTrax Tundra #22", "condition": 100 }
      ],
      "ledger": [
        { "date": "2026-05-24", "description": "Starting Franchise Balance", "category": "income", "amount": 2000000 },
        { "date": "2026-05-24", "description": "Purchased Fleet of 4x Toyota Tundra Trucks", "category": "expense", "amount": -600000 }
      ]
    }
  ]
};
