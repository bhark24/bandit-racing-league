
const teamsData = {
  "latestRace": {
    "track": "Daytona International Speedway",
    "date": "June 17, 2026",
    "isPreview": true
  },
  "tracks": {
    "irp": {
      "name": "Lucas Oil Indianapolis Raceway Park",
      "city": "Indianapolis, IN",
      "distance": 500,
      "airport": "IND",
      "lat": 39.8114,
      "lon": -86.3422
    },
    "daytona": {
      "name": "Daytona International Speedway",
      "city": "Daytona Beach, FL",
      "distance": 400,
      "airport": "DAB",
      "lat": 29.2108,
      "lon": -81.0228
    },
    "atlanta": {
      "name": "Atlanta Motor Speedway",
      "city": "Hampton, GA",
      "distance": 250,
      "airport": "ATL",
      "lat": 33.4076,
      "lon": -84.2831
    },
    "charlotte": {
      "name": "Charlotte Motor Speedway",
      "city": "Concord, NC",
      "distance": 0,
      "airport": "CLT",
      "lat": 35.3516,
      "lon": -80.6867
    },
    "bristol": {
      "name": "Bristol Motor Speedway",
      "city": "Bristol, TN",
      "distance": 150,
      "airport": "TRI",
      "lat": 36.5156,
      "lon": -82.2569
    },
    "nashville": {
      "name": "Nashville Superspeedway",
      "city": "Lebanon, TN",
      "distance": 400,
      "airport": "BNA",
      "lat": 36.1486,
      "lon": -86.4022
    },
    "pocono": {
      "name": "Pocono Raceway",
      "city": "Long Pond, PA",
      "distance": 550,
      "airport": "AVP",
      "lat": 41.0544,
      "lon": -75.5114
    },
    "richmond": {
      "name": "Richmond Raceway",
      "city": "Richmond, VA",
      "distance": 280,
      "airport": "RIC",
      "lat": 37.5925,
      "lon": -77.4194
    },
    "michigan": {
      "name": "Michigan International Speedway",
      "city": "Brooklyn, MI",
      "distance": 620,
      "airport": "DTW",
      "lat": 42.0664,
      "lon": -84.2406
    },
    "gateway": {
      "name": "World Wide Technology Raceway",
      "city": "Madison, IL",
      "distance": 700,
      "airport": "STL",
      "lat": 38.6492,
      "lon": -90.1364
    },
    "darlington": {
      "name": "Darlington Raceway",
      "city": "Darlington, SC",
      "distance": 120,
      "airport": "CAE",
      "lat": 34.2953,
      "lon": -79.9056
    },
    "kansas": {
      "name": "Kansas Speedway",
      "city": "Kansas City, KS",
      "distance": 980,
      "airport": "MCI",
      "lat": 39.1156,
      "lon": -94.8311
    },
    "texas": {
      "name": "Texas Motor Speedway",
      "city": "Fort Worth, TX",
      "distance": 1050,
      "airport": "DFW",
      "lat": 33.0267,
      "lon": -97.2825
    },
    "vegas": {
      "name": "Las Vegas Motor Speedway",
      "city": "Las Vegas, NV",
      "distance": 2100,
      "airport": "LAS",
      "lat": 36.2714,
      "lon": -115.0114
    },
    "watkins": {
      "name": "Watkins Glen International",
      "city": "Watkins Glen, NY",
      "distance": 630,
      "airport": "ELM",
      "lat": 42.3372,
      "lon": -76.9244
    },
    "phoenix": {
      "name": "Phoenix Raceway",
      "city": "Avondale, AZ",
      "distance": 2150,
      "airport": "PHX",
      "lat": 33.3747,
      "lon": -112.3111
    },
    "martinsville": {
      "name": "Martinsville Speedway",
      "city": "Martinsville, VA",
      "distance": 130,
      "airport": "GSO",
      "lat": 36.6342,
      "lon": -79.8517
    },
    "talladega": {
      "name": "Talladega Superspeedway",
      "city": "Lincoln, AL",
      "distance": 380,
      "airport": "BHM",
      "lat": 33.5672,
      "lon": -86.0658
    },
    "road_america": {
      "name": "Road America",
      "city": "Elkhart Lake, WI",
      "distance": 850,
      "airport": "MKE",
      "lat": 43.7997,
      "lon": -87.9947
    },
    "homestead": {
      "name": "Homestead-Miami Speedway",
      "city": "Homestead, FL",
      "distance": 680,
      "airport": "MIA",
      "lat": 25.4619,
      "lon": -80.4789
    }
  },
  "driverLocations": {
    "BILL HARKINS": {
      "city": "Ashtabula, OH",
      "lat": 41.8651,
      "lon": -80.7898
    },
    "LOGAN MURRAY": {
      "city": "West Plains, MO",
      "lat": 36.7281,
      "lon": -91.8515
    },
    "NICK NICKERSON": {
      "city": "Phoenix, AZ",
      "lat": 33.4484,
      "lon": -112.074
    },
    "RICKY HART": {
      "city": "West Chester, PA",
      "lat": 39.9607,
      "lon": -75.6055
    },
    "SEAN BRITT": {
      "city": "Greensboro, NC",
      "lat": 36.0726,
      "lon": -79.792
    },
    "JONATHON PLATT": {
      "city": "Concord, NC",
      "lat": 35.4088,
      "lon": -80.5795
    },
    "NICOLE KRIESEL": {
      "city": "Charlotte, NC",
      "lat": 35.2271,
      "lon": -80.8431
    },
    "VICTOR WEAVER": {
      "city": "Dayton, OH",
      "lat": 39.7589,
      "lon": -84.1916
    },
    "BOB BERRY": {
      "city": "Fort Worth, TX",
      "lat": 32.7555,
      "lon": -97.3308
    },
    "JASON GREENWELL": {
      "city": "Plymouth, MI",
      "lat": 42.3714,
      "lon": -83.4702
    },
    "DYLAN NICASTRO": {
      "city": "Cleveland, OH",
      "lat": 41.4993,
      "lon": -81.6944
    },
    "ETHAN SIKORSKI": {
      "city": "Charlotte, NC",
      "lat": 35.2271,
      "lon": -80.8431
    },
    "REAGAN FRUGE": {
      "city": "Keenesburg, CO",
      "lat": 40.1088,
      "lon": -104.5202
    },
    "JASON ALLEGRINI": {
      "city": "Nashville, TN",
      "lat": 36.1627,
      "lon": -86.7816
    },
    "MATT CROCKETT": {
      "city": "Salt Lake City, UT",
      "lat": 40.7608,
      "lon": -111.8911
    },
    "JOSH ADAMS": {
      "city": "Springboro, OH",
      "lat": 39.5523,
      "lon": -84.2333
    },
    "MATT BAILEY": {
      "city": "Xenia, OH",
      "lat": 39.6848,
      "lon": -83.9297
    },
    "NATHAN SANTOS": {
      "city": "Spartanburg, SC",
      "lat": 34.9496,
      "lon": -81.932
    },
    "DIONTE RADER": {
      "city": "Miamisburg, OH",
      "lat": 39.6428,
      "lon": -84.2866
    },
    "DAVID LEAKEY": {
      "city": "Crestview, FL",
      "lat": 30.7621,
      "lon": -86.5694
    },
    "CONOR GIBSON": {
      "city": "Halifax, NS",
      "lat": 44.6488,
      "lon": -63.5752
    },
    "CURTIS YANCEY": {
      "city": "Clearwater, FL",
      "lat": 27.9659,
      "lon": -82.8001
    },
    "JACKSON KNAAK": {
      "city": "Concord, NC",
      "lat": 35.4088,
      "lon": -80.5795
    },
    "KEVIN FOSTER": {
      "city": "Katy, TX",
      "lat": 29.7858,
      "lon": -95.8244
    },
    "DAVID WESTOVER JR": {
      "city": "Ashtabula, OH",
      "lat": 41.8651,
      "lon": -80.7898
    },
    "CARTER PHILLIPS": {
      "city": "Columbia, SC",
      "lat": 34.0007,
      "lon": -81.0348
    },
    "EDDIE HAGIGH": {
      "city": "Severna Park, MD",
      "lat": 39.0696,
      "lon": -76.5452
    },
    "BENJAMIN LACY": {
      "city": "Loma Linda, CA",
      "lat": 34.0483,
      "lon": -117.2612
    },
    "LUCAS WILSON": {
      "city": "Toronto, Ontario",
      "lat": 43.6532,
      "lon": -79.3832
    },
    "DAVIS CARROLL": {
      "city": "TBD",
      "lat": 35.4088,
      "lon": -80.5795
    },
    "DYLAN MCDONALD": {
      "city": "TBD",
      "lat": 35.4088,
      "lon": -80.5795
    },
    "JOSH BILLITER": {
      "city": "Coal Run Village, KY",
      "lat": 37.5132,
      "lon": -82.5585
    },
    "MICHAEL RAKES": {
      "city": "Roanoke, VA",
      "lat": 37.271,
      "lon": -79.9414
    },
    "WES FULLER": {
      "city": "Kansas City, KS",
      "lat": 39.1156,
      "lon": -94.8311
    },
    "RICKY GONZALES": {
      "city": "Kansas City, KS",
      "lat": 39.1156,
      "lon": -94.8311
    },
    "JACKSON DUKE": {
      "city": "Athens, AL",
      "lat": 34.8029,
      "lon": -86.9717
    },
    "GARRET BOBO": {
      "city": "Shreveport, LA",
      "lat": 32.514,
      "lon": -93.7477
    },
    "CORDELL MCFARLIN": {
      "city": "Oklahoma City, OK",
      "lat": 35.4676,
      "lon": -97.5164
    }
  },
  "teams": [
    {
      "id": "roundy-motorsports",
      "name": "Roundy Motorsports",
      "owner": "Bill Harkins",
      "homeBase": "Cleveland, OH",
      "logo": "assets/roundy-motorsports-logo.png",
      "points": 0,
      "wins": 0,
      "balance": 1860000,
      "loan": 0,
      "drivers": {
        "primary": [
          "BILL HARKINS",
          "LOGAN MURRAY",
          "MATT CROCKETT",
          "TERRY KONDUS"
        ],
        "backup": [
          "VACANT",
          "VACANT"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Ford",
          "name": "Roundy F-150 #12",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Ford",
          "name": "Roundy F-150 #4",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Ford",
          "name": "Roundy F-150 #15",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Ford",
          "name": "Roundy F-150 #32",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Ford F-150 Trucks",
          "category": "expense",
          "amount": -740000
        },
        {
          "date": "Jun 02, 2026",
          "description": "Signed Driver: TERRY KONDAS (Signing Bonus)",
          "category": "expense",
          "amount": -50000
        },
        {
          "date": "Jun 02, 2026",
          "description": "Signed Driver: LOGAN MURRAY (Signing Bonus)",
          "category": "expense",
          "amount": -50000
        },
        {
          "date": "Jun 02, 2026",
          "description": "Signed Driver: MATT CROCKETT (Signing Bonus)",
          "category": "expense",
          "amount": -50000
        }
      ],
      "sponsors": [
        "Roundy Motorsports",
        "Ford Performance",
        "Craftsman Tools"
      ],
      "passcodeHash": "e7faa8b075ab5b412691a8b097ebfee4bb5fd87c448bfffc35ed519a449702ce"
    },
    {
      "id": "937-racing",
      "name": "937 Racing",
      "owner": "Victor Weaver",
      "homeBase": "Dayton, OH",
      "logo": "assets/937-racing-logo.png",
      "points": 0,
      "wins": 0,
      "balance": 1775000,
      "loan": 0,
      "drivers": {
        "primary": [
          "VICTOR WEAVER",
          "JOSH ADAMS",
          "MICHAEL RAKES",
          "VACANT"
        ],
        "backup": [
          "DIONTE RADER",
          "MATT BAILEY"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Toyota",
          "name": "937 Tundra #18",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Toyota",
          "name": "937 Tundra #22",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Toyota",
          "name": "937 Tundra #47",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Toyota",
          "name": "937 Tundra #17",
          "condition": 100
        },
        {
          "id": "truck-5",
          "make": "Toyota",
          "name": "937 Tundra #54",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Toyota Tundra Trucks",
          "category": "expense",
          "amount": -740000
        },
        {
          "date": "Jun 03, 2026",
          "description": "Signed Driver: MICHAEL RAKES (Signing Bonus)",
          "category": "expense",
          "amount": -50000
        },
        {
          "date": "Jun 04, 2026",
          "description": "Purchased Fleet Truck: 937 Tundra #47",
          "category": "expense",
          "amount": -185000
        }
      ],
      "sponsors": [
        "937 Racing",
        "Toyota Racing Development",
        "Craftsman Tools"
      ],
      "passcodeHash": "5932cb6e58ef979208d6b91fcfe0d47c278d78451e733978d35f8b14db88c305"
    },
    {
      "id": "wrists-up-racing",
      "name": "Wrist's Up Racing",
      "owner": "Dylan Nicastro",
      "homeBase": "Cleveland, OH",
      "logo": "assets/wrists-up-racing-logo.png",
      "points": 0,
      "wins": 0,
      "balance": 2010000,
      "loan": 0,
      "drivers": {
        "primary": [
          "VACANT",
          "VACANT",
          "VACANT",
          "REAGAN FRUGE"
        ],
        "backup": [
          "DYLAN NICASTRO",
          "DAVID WESTOVER JR"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Chevrolet",
          "name": "Wrist's Up Silverado #23",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Chevrolet",
          "name": "Wrist's Up Silverado #88",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Chevrolet",
          "name": "Wrist's Up Silverado #24",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Chevrolet",
          "name": "Wrist's Up Silverado #25",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Chevrolet Silverado Trucks",
          "category": "expense",
          "amount": -740000
        }
      ],
      "sponsors": [
        "Wrist's Up Racing",
        "Chevrolet Accessories",
        "Craftsman Tools"
      ],
      "passcodeHash": "858a794b9a1df6e2fa1e6258cafa1f3df7f31ff877c887107e245163fa52fbdc"
    },
    {
      "id": "zerofoxtrot",
      "name": "ZeroFoxtrot",
      "owner": "David Leakey",
      "homeBase": "Weeki Wachee, FL",
      "logo": "assets/zerofoxtrot-logo.jpg",
      "points": 0,
      "wins": 0,
      "balance": 1960000,
      "loan": 0,
      "drivers": {
        "primary": [
          "DAVID LEAKEY",
          "CONOR GIBSON",
          "MICHAEL RAMOS",
          "VACANT"
        ],
        "backup": [
          "CURTIS YANCEY",
          "VACANT"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Chevrolet",
          "name": "ZeroFoxtrot Silverado #84",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Chevrolet",
          "name": "ZeroFoxtrot Silverado #31",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Chevrolet",
          "name": "ZeroFoxtrot Silverado #51",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Chevrolet",
          "name": "ZeroFoxtrot Silverado #27",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Chevrolet Silverado Trucks",
          "category": "expense",
          "amount": -740000
        },
        {
          "date": "2026-06-01",
          "description": "Signed Driver: MICHAEL RAMOS (Signing Bonus)",
          "category": "expense",
          "amount": -50000
        }
      ],
      "sponsors": [
        "ZeroFoxtrot",
        "Chevrolet Accessories",
        "Craftsman Tools"
      ],
      "passcodeHash": "13b92326aee45b686501b518930032a92c937945b258b461840f4b2572ed9d68"
    },
    {
      "id": "carter-phillips-racing",
      "name": "Carter Phillips Racing",
      "owner": "Carter Phillips",
      "homeBase": "Columbia, SC",
      "logo": "assets/carter-phillips-racing-logo.jpg",
      "points": 0,
      "wins": 0,
      "balance": 2010000,
      "loan": 0,
      "drivers": {
        "primary": [
          "EDDIE HAGIGH",
          "JASON GREENWELL",
          "CARTER PHILLIPS",
          "VACANT"
        ],
        "backup": [
          "VACANT",
          "VACANT"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Chevrolet",
          "name": "Carter Phillips Silverado #97",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Chevrolet",
          "name": "Carter Phillips Silverado #83",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Chevrolet",
          "name": "Carter Phillips Silverado #30",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Chevrolet",
          "name": "Carter Phillips Silverado #4",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Chevrolet Silverado Trucks",
          "category": "expense",
          "amount": -740000
        }
      ],
      "sponsors": [
        "Carter Phillips Racing"
      ],
      "passcodeHash": "ec2d220d50cb8f49dd8aa4981ca2322b010b778ab71573d91983bca49e8cc91c"
    },
    {
      "id": "gfr-racing",
      "name": "GFR Racing",
      "owner": "Kevin Foster",
      "homeBase": "Katy, TX",
      "logo": "assets/gfr.png",
      "points": 0,
      "wins": 0,
      "balance": 1775000,
      "loan": 0,
      "drivers": {
        "primary": [
          "KEVIN FOSTER",
          "NICK NICKERSON",
          "RICKY HART",
          "BENJAMIN LACY"
        ],
        "backup": [
          "JONATHON PLATT",
          "VACANT"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Chevrolet",
          "name": "GFR Silverado #8",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Chevrolet",
          "name": "GFR Silverado #2",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Chevrolet",
          "name": "GFR Silverado #1",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Chevrolet",
          "name": "GFR Silverado #7",
          "condition": 100
        },
        {
          "id": "truck-5",
          "make": "Chevrolet",
          "name": "GFR Silverado #13",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Chevrolet Silverado Trucks",
          "category": "expense",
          "amount": -740000
        },
        {
          "date": "Jun 03, 2026",
          "description": "Signed Driver: JONATHON PLATT (Signing Bonus)",
          "category": "expense",
          "amount": -50000
        },
        {
          "date": "Jun 04, 2026",
          "description": "Purchased Fleet Truck: GFR Silverado #13",
          "category": "expense",
          "amount": -185000
        }
      ],
      "sponsors": [
        "GFR Racing",
        "Chevrolet Accessories",
        "Craftsman Tools"
      ],
      "passcodeHash": "d52640dd8dcaf61ea13dc1484e97ea8078e2a06bdf0f81d747e84fe7ccd6d785"
    },
    {
      "id": "striped-maple-racing",
      "name": "Striped Maple Racing",
      "owner": "Lucas Wilson",
      "homeBase": "Toronto, Ontario",
      "logo": "assets/Striped-maple-racing.png",
      "points": 0,
      "wins": 0,
      "balance": 2010000,
      "loan": 0,
      "drivers": {
        "primary": [
          "DAVIS CARROLL",
          "JOSH BILLITER",
          "VACANT",
          "VACANT"
        ],
        "backup": [
          "DYLAN MCDONALD",
          "LUCAS WILSON"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Chevrolet",
          "name": "Striped Maple Silverado #50",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Chevrolet",
          "name": "Striped Maple Silverado #63",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Chevrolet",
          "name": "Striped Maple Silverado #96",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Chevrolet",
          "name": "Striped Maple Silverado #99",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Chevrolet Silverado Trucks",
          "category": "expense",
          "amount": -740000
        }
      ],
      "sponsors": [
        "Striped Maple Racing",
        "Chevrolet Accessories",
        "Craftsman Tools"
      ],
      "passcodeHash": "11350e39f388ba27644fd1786929177fa12eb31ab4fc28429ebb53f520333b54"
    },
    {
      "id": "title-town-racing",
      "name": "Title Town Racing",
      "owner": "Wes Fuller & Ricky Gonzales",
      "homeBase": "Kansas City, KS",
      "logo": "assets/Title_Town_racing.png",
      "points": 0,
      "wins": 0,
      "balance": 2010000,
      "loan": 0,
      "drivers": {
        "primary": [
          "WES FULLER",
          "RICKY GONZALES",
          "VACANT",
          "VACANT"
        ],
        "backup": [
          "VACANT",
          "VACANT"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "RAM",
          "name": "Title Town Ram #35",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "RAM",
          "name": "Title Town Ram #82",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "RAM",
          "name": "Title Town Ram #TBD",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "RAM",
          "name": "Title Town Ram #TBD",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x RAM Trucks",
          "category": "expense",
          "amount": -740000
        }
      ],
      "sponsors": [
        "Title Town Racing",
        "RAM Trucks",
        "Craftsman Tools"
      ],
      "passcodeHash": "7c80456012d9a93fbfd574ba3b0204b364d3e52c7370b8921f7fa69fd70bddfa"
    },
    {
      "id": "pop-motorsports",
      "name": "POP Motorsports",
      "owner": "Jackson Duke & Garret Bobo",
      "homeBase": "Athens, AL",
      "logo": "assets/pop-motorsports.png",
      "points": 0,
      "wins": 0,
      "balance": 2010000,
      "loan": 0,
      "drivers": {
        "primary": [
          "JACKSON DUKE",
          "CORDELL MCFARLIN",
          "VACANT",
          "VACANT"
        ],
        "backup": [
          "GARRET BOBO",
          "VACANT"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Chevrolet",
          "name": "POP Silverado #08",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Chevrolet",
          "name": "POP Silverado #10",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Chevrolet",
          "name": "POP Silverado #29",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Chevrolet",
          "name": "POP Silverado #TBD",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Chevrolet Silverado Trucks",
          "category": "expense",
          "amount": -740000
        }
      ],
      "sponsors": [
        "POP Motorsports",
        "Chevrolet Accessories",
        "Craftsman Tools"
      ],
      "passcodeHash": "06d4e8be5b07a51c4a0349a2a6f8b9f71c4222049e0c326e5e8e819b35bc456e"
    },
    {
      "id": "esr",
      "name": "ESR",
      "owner": "Ethan Sikorski",
      "homeBase": "New York, New York (it's currently on fire)",
      "logo": "assets/esr.png",
      "points": 0,
      "wins": 0,
      "balance": 2010000,
      "loan": 0,
      "drivers": {
        "primary": [
          "JACKSON KNAAK",
          "VACANT",
          "VACANT",
          "VACANT"
        ],
        "backup": [
          "ETHAN SIKORSKI",
          "NATHAN SANTOS"
        ]
      },
      "trucks": [
        {
          "id": "truck-1",
          "make": "Chevrolet",
          "name": "ESR Silverado #24",
          "condition": 100
        },
        {
          "id": "truck-2",
          "make": "Chevrolet",
          "name": "ESR Silverado #00",
          "condition": 100
        },
        {
          "id": "truck-3",
          "make": "Chevrolet",
          "name": "ESR Silverado #21",
          "condition": 100
        },
        {
          "id": "truck-4",
          "make": "Chevrolet",
          "name": "ESR Silverado #TBD",
          "condition": 100
        }
      ],
      "ledger": [
        {
          "date": "2026-05-24",
          "description": "Starting Franchise Balance",
          "category": "income",
          "amount": 2750000
        },
        {
          "date": "2026-05-24",
          "description": "Purchased Fleet of 4x Chevrolet Silverado Trucks",
          "category": "expense",
          "amount": -740000
        }
      ],
      "sponsors": [
        "ESR",
        "Chevrolet Accessories",
        "Craftsman Tools"
      ],
      "passcodeHash": "8350242b2df439d296a664c7c59b117507d0b3c537fa293304c84d84eb85cc43"
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = teamsData;
}
