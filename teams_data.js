// Automatically generated. Source of truth for Bandit Racing League Team Economy.
const teamsData = {
  "tracks": {
    "irp": { "name": "Lucas Oil Indianapolis Raceway Park", "city": "Indianapolis, IN", "distance": 500, "airport": "IND", "lat": 39.8114, "lon": -86.3422 },
    "daytona": { "name": "Daytona International Speedway", "city": "Daytona Beach, FL", "distance": 400, "airport": "DAB", "lat": 29.2108, "lon": -81.0228 },
    "atlanta": { "name": "Atlanta Motor Speedway", "city": "Hampton, GA", "distance": 250, "airport": "ATL", "lat": 33.4076, "lon": -84.2831 },
    "charlotte": { "name": "Charlotte Motor Speedway", "city": "Concord, NC", "distance": 0, "airport": "CLT", "lat": 35.3516, "lon": -80.6867 },
    "bristol": { "name": "Bristol Motor Speedway", "city": "Bristol, TN", "distance": 150, "airport": "TRI", "lat": 36.5156, "lon": -82.2569 },
    "nashville": { "name": "Nashville Superspeedway", "city": "Lebanon, TN", "distance": 400, "airport": "BNA", "lat": 36.1486, "lon": -86.4022 },
    "pocono": { "name": "Pocono Raceway", "city": "Long Pond, PA", "distance": 550, "airport": "AVP", "lat": 41.0544, "lon": -75.5114 },
    "richmond": { "name": "Richmond Raceway", "city": "Richmond, VA", "distance": 280, "airport": "RIC", "lat": 37.5925, "lon": -77.4194 },
    "michigan": { "name": "Michigan International Speedway", "city": "Brooklyn, MI", "distance": 620, "airport": "DTW", "lat": 42.0664, "lon": -84.2406 },
    "gateway": { "name": "World Wide Technology Raceway", "city": "Madison, IL", "distance": 700, "airport": "STL", "lat": 38.6492, "lon": -90.1364 },
    "darlington": { "name": "Darlington Raceway", "city": "Darlington, SC", "distance": 120, "airport": "CAE", "lat": 34.2953, "lon": -79.9056 },
    "kansas": { "name": "Kansas Speedway", "city": "Kansas City, KS", "distance": 980, "airport": "MCI", "lat": 39.1156, "lon": -94.8311 },
    "texas": { "name": "Texas Motor Speedway", "city": "Fort Worth, TX", "distance": 1050, "airport": "DFW", "lat": 33.0267, "lon": -97.2825 },
    "vegas": { "name": "Las Vegas Motor Speedway", "city": "Las Vegas, NV", "distance": 2100, "airport": "LAS", "lat": 36.2714, "lon": -115.0114 },
    "watkins": { "name": "Watkins Glen International", "city": "Watkins Glen, NY", "distance": 630, "airport": "ELM", "lat": 42.3372, "lon": -76.9244 },
    "phoenix": { "name": "Phoenix Raceway", "city": "Avondale, AZ", "distance": 2150, "airport": "PHX", "lat": 33.3747, "lon": -112.3111 },
    "martinsville": { "name": "Martinsville Speedway", "city": "Martinsville, VA", "distance": 130, "airport": "GSO", "lat": 36.6342, "lon": -79.8517 },
    "talladega": { "name": "Talladega Superspeedway", "city": "Lincoln, AL", "distance": 380, "airport": "BHM", "lat": 33.5672, "lon": -86.0658 },
    "road_america": { "name": "Road America", "city": "Elkhart Lake, WI", "distance": 850, "airport": "MKE", "lat": 43.7997, "lon": -87.9947 },
    "homestead": { "name": "Homestead-Miami Speedway", "city": "Homestead, FL", "distance": 680, "airport": "MIA", "lat": 25.4619, "lon": -80.4789 }
  },
  "driverLocations": {
    "BILL HARKINS": { "city": "Concord, NC", "lat": 35.4088, "lon": -80.5795 },
    "LOGAN MURRAY": { "city": "Charlotte, NC", "lat": 35.2271, "lon": -80.8431 },
    "NICK NICKERSON": { "city": "Orlando, FL", "lat": 28.5383, "lon": -81.3792 },
    "RICKY HART": { "city": "Atlanta, GA", "lat": 33.7490, "lon": -84.3880 },
    "SEAN BRITT": { "city": "Greensboro, NC", "lat": 36.0726, "lon": -79.7920 },
    "JONATHON PLATT": { "city": "Concord, NC", "lat": 35.4088, "lon": -80.5795 },
    "NICOLE KRIESEL": { "city": "Charlotte, NC", "lat": 35.2271, "lon": -80.8431 },
    "VICTOR WEAVER": { "city": "Daytona Beach, FL", "lat": 29.2108, "lon": -81.0228 },
    "BOB BERRY": { "city": "Richmond, VA", "lat": 37.5407, "lon": -77.4360 },
    "JASON GREENWELL": { "city": "Indianapolis, IN", "lat": 39.7684, "lon": -86.1581 },
    "DYLAN NICASTRO": { "city": "Concord, NC", "lat": 35.4088, "lon": -80.5795 },
    "ETHAN SIKORSKI": { "city": "Charlotte, NC", "lat": 35.2271, "lon": -80.8431 },
    "JASON ALLEGRINI": { "city": "Nashville, TN", "lat": 36.1627, "lon": -86.7816 },
    "MATT CROCKETT": { "city": "Roanoke, VA", "lat": 37.2710, "lon": -79.9414 },
    "JOSH ADAMS": { "city": "Charlotte, NC", "lat": 35.2271, "lon": -80.8431 },
    "MATT BAILEY": { "city": "Concord, NC", "lat": 35.4088, "lon": -80.5795 },
    "NATHAN SANTOS": { "city": "Spartanburg, SC", "lat": 34.9496, "lon": -81.9320 }
  },
  "teams": [
    {
      "id": "outlaw-racing",
      "name": "Outlaw Racing Technologies",
      "owner": "Bill Harkins",
      "homeBase": "Concord, NC",
      "logo": "assets/main-logo.png",
      "points": 0,
      "wins": 0,
      "balance": 1260000,
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
        { "date": "2026-05-24", "description": "Purchased Fleet of 4x Chevy Silverado Trucks", "category": "expense", "amount": -740000 }
      ]
    },
    {
      "id": "geezer-performance",
      "name": "Geezer Performance App Racing",
      "owner": "Nicole Kriesel",
      "homeBase": "Charlotte, NC",
      "logo": "assets/geezer-icon.png",
      "points": 0,
      "wins": 0,
      "balance": 1260000,
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
        { "date": "2026-05-24", "description": "Purchased Fleet of 4x Ford F-150 Trucks", "category": "expense", "amount": -740000 }
      ]
    },
    {
      "id": "simtrax-motorsports",
      "name": "SimTrax Broadcasting Group",
      "owner": "Johnathon Platt",
      "homeBase": "Concord, NC",
      "logo": "assets/simtrax-logo.png",
      "points": 0,
      "wins": 0,
      "balance": 1260000,
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
        { "date": "2026-05-24", "description": "Purchased Fleet of 4x Toyota Tundra Trucks", "category": "expense", "amount": -740000 }
      ]
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = teamsData;
}
