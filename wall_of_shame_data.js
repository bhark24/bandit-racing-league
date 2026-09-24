// BRL Stewards' Official Wall of Shame — Multi-Race Database

const BRL_RACES_DATA = {
    richmond: {
        id: "richmond",
        title: "Richmond Raceway",
        subtext: "America's Premier Short Track — 160 Laps",
        laps: 160,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 50 },
            { name: "Stage 2", lap: 100 },
            { name: "Final Stage", lap: 160 }
        ],
        mvp: {
            carNumber: "20",
            driverName: "Car #20 (Adam Tahan)",
            title: "Wall of Shame MVP",
            reason: "Multiple High-Dives into Turn Entry, Contact on #13 & Chop Across #31 Nose",
            totalIncidents: 3,
            totalPenalties: "Multiple EOL Penalties"
        },
        drivers: [
            { number: "20", name: "Driver #20 (Adam Tahan)", score: 95, level: "CRITICAL", badge: "MVP / Dive-Bomber", incidentsCount: 3, colors: ["#ff0055", "#111"] },
            { number: "50", name: "Driver #50", score: 80, level: "HIGH", badge: "Drive-Through Incident", incidentsCount: 2, colors: ["#ff5500", "#111"] },
            { number: "15", name: "Driver #15", score: 75, level: "HIGH", badge: "Rear-End Dump (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "75", name: "Driver #75", score: 70, level: "HIGH", badge: "Spin Dump (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "13", name: "Driver #13", score: 60, level: "MEDIUM", badge: "Caution Retaliation", incidentsCount: 2, colors: ["#e67e22", "#111"] },
            { number: "18", name: "Driver #18", score: 30, level: "LOW", badge: "Steering Failure", incidentsCount: 1, colors: ["#3498db", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 80, stage: 1, involved: ["4", "93"], primaryCar: "4", category: "racing_deal",
                title: "Mid-Pack Side Contact",
                summary: "Car 4 and car 93 made side contact exiting Turn 4.",
                ruling: "Racing Deal", location: "Turn 4 Exit",
                trackCoords: { x: 220, y: 80 },
                audioTranscript: "[STEWARDS] 'Side swipe exiting 4. Racing deal between 4 and 93.'"
            },
            {
                id: 2, lap: 87, stage: 2, involved: ["50", "47"], primaryCar: "50", category: "penalty",
                title: "Car 50 Drives Through 47",
                summary: "Car 50 missed braking point and drove straight into the rear of car 47.",
                ruling: "End of Line (EOL) Penalty (#50)", location: "Turn 1",
                trackCoords: { x: 670, y: 160 },
                audioTranscript: "[RACE CONTROL] 'Car 50 drove through 47. EOL penalty car 50.'"
            },
            {
                id: 3, lap: 104, stage: 3, involved: ["18"], primaryCar: "18", category: "racing_deal",
                title: "Steering Component Failure Wall Impact",
                summary: "Car 18 hit outside wall after mechanical steering failure, causing mid-pack checkup.",
                ruling: "Racing Deal (Mechanical Failure)", location: "Turn 2",
                trackCoords: { x: 650, y: 270 },
                audioTranscript: "[RADIO 18] 'Something in the steering just snapped! No control!'"
            },
            {
                id: 4, lap: 110, stage: 3, involved: ["20", "13"], primaryCar: "20", category: "penalty",
                title: "Deep Dive Entry Contact into Car 13",
                summary: "Car 20 drove in extremely deep into Turn 1, punting car 13 sideways.",
                ruling: "End of Line (EOL) Penalty (#20)", location: "Turn 1 Entry",
                trackCoords: { x: 610, y: 320 },
                audioTranscript: "[RADIO 13] '20 just drove in from 5 car lengths back and destroyed me!'"
            },
            {
                id: 5, lap: 115, stage: 3, involved: ["13", "20"], primaryCar: "13", category: "warning",
                title: "Caution Retaliation Side-Swipe",
                summary: "Car 13 side-swiped car 20 under yellow in retaliation for earlier contact.",
                ruling: "Official Warning / Unsportsmanlike Conduct", location: "Back Stretch",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Car 13, cut out the caution retaliation or you'll be parked!'"
            },
            {
                id: 6, lap: 130, stage: 3, involved: ["15", "00"], primaryCar: "15", category: "penalty",
                title: "Rear-End Punt & Save of the Night",
                summary: "Car 15 hit the rear of car 00, sending 00 sliding sideways across the track. Car 00 made a miraculous save.",
                ruling: "End of Line (EOL) Penalty (#15)", location: "Turn 3",
                trackCoords: { x: 130, y: 260 },
                audioTranscript: "[RADIO 00] 'How did I just save that?! 15 dumped me!' -> EOL car 15."
            },
            {
                id: 7, lap: 139, stage: 3, involved: ["50", "62", "9"], primaryCar: "50", category: "racing_deal",
                title: "Check-Up Chain Reaction",
                summary: "Cars 50 and 62 checked up suddenly; car 9 had zero reaction time and hit the stackup.",
                ruling: "Racing Deal (Accordion Reaction)", location: "Turn 4",
                trackCoords: { x: 160, y: 120 },
                audioTranscript: "[STEWARDS] 'Multi-car stackup Turn 4. No single driver at fault.'"
            },
            {
                id: 8, lap: 147, stage: 3, involved: ["00", "13"], primaryCar: "00", category: "racing_deal",
                title: "Blinking Interference Spin",
                summary: "Car 00 hit brakes as car 13 was blinking on connection. Car 13 had nowhere to go and spun.",
                ruling: "Racing Deal (Netcode / Connection Blinking)", location: "Turn 1",
                trackCoords: { x: 670, y: 200 },
                audioTranscript: "[RADIO 00] '13 was completely invisible blinking on my screen!' -> Racing deal."
            },
            {
                id: 9, lap: 153, stage: 3, involved: ["20", "31"], primaryCar: "20", category: "penalty",
                title: "Chop Across Car 31 Nose",
                summary: "Car 20 chopped down sharply across car 31's front bumper, turning himself around.",
                ruling: "End of Line (EOL) Penalty (#20)", location: "Turn 2",
                trackCoords: { x: 620, y: 280 },
                audioTranscript: "[RADIO 31] 'He came straight down across my nose! Nothing I could do!'"
            },
            {
                id: 10, lap: 158, stage: 3, involved: ["75", "29"], primaryCar: "75", category: "penalty",
                title: "Late Dump on Car 29",
                summary: "Car 75 dumped car 29 into a slide entering Turn 3.",
                ruling: "End of Line (EOL) Penalty (#75)", location: "Turn 3",
                trackCoords: { x: 220, y: 310 },
                audioTranscript: "[RACE CONTROL] 'Car 75 contact on 29. EOL penalty car 75.'"
            }
        ]
    },

    michigan: {
        id: "michigan",
        title: "Michigan International Speedway",
        subtext: "2.0-Mile D-Oval Superspeedway — 100 Laps",
        laps: 100,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 30 },
            { name: "Stage 2", lap: 60 },
            { name: "Final Stage", lap: 100 }
        ],
        mvp: {
            carNumber: "31",
            driverName: "Car #31 (Connor Gibson)",
            title: "Wall of Shame MVP",
            reason: "Multiple Wrecks & Running into #13 under Caution (Next Race EOL Penalty Issued!)",
            totalIncidents: 3,
            totalPenalties: "EOL Penalty + Next Race Starting Penalty"
        },
        drivers: [
            { number: "31", name: "Driver #31 (Connor Gibson)", score: 96, level: "CRITICAL", badge: "MVP / Caution Hitter", incidentsCount: 3, colors: ["#ff0055", "#111"] },
            { number: "0",  name: "Driver #0",  score: 82, level: "HIGH", badge: "Early Wreck (At Fault)", incidentsCount: 1, colors: ["#ff5500", "#111"] },
            { number: "08", name: "Driver #08", score: 70, level: "HIGH", badge: "Multiple Wrecks (EOL)", incidentsCount: 2, colors: ["#ffaa00", "#111"] },
            { number: "4",  name: "Driver #4",  score: 60, level: "MEDIUM", badge: "Caution Trigger (EOL)", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "9",  name: "Driver #9",  score: 55, level: "MEDIUM", badge: "Spin (EOL)", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "53", name: "Driver #53", score: 50, level: "MEDIUM", badge: "Spin (EOL)", incidentsCount: 1, colors: ["#e67e22", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 6, stage: 1, involved: ["0"], primaryCar: "0", category: "penalty",
                title: "Opening Segment Misjudge Wreck",
                summary: "Car 0 reviewed and determined to be at fault for early race spin.",
                ruling: "Incident Charged to Car 0", location: "Turn 1",
                trackCoords: { x: 670, y: 160 },
                audioTranscript: "[RACE CONTROL] 'Car 0 determined at fault for Lap 6 caution.'"
            },
            {
                id: 2, lap: 31, stage: 2, involved: ["31"], primaryCar: "31", category: "penalty",
                title: "Caution Wreck Trigger",
                summary: "Car 31 involved in major multi-car caution crash.",
                ruling: "End of Line (EOL) Penalty (#31)", location: "Turn 3 & 4",
                trackCoords: { x: 120, y: 220 },
                audioTranscript: "[RACE CONTROL] 'Caution out. EOL penalty issued to car 31.'"
            },
            {
                id: 3, lap: 31, stage: 2, involved: ["31", "13"], primaryCar: "31", category: "penalty",
                title: "Caution Flag Violation: Hit Car 13 Under Yellow!",
                summary: "Car 31 ran directly into car 13 while under yellow caution flag conditions.",
                ruling: "NEXT RACE EOL STARTING PENALTY (#31)", location: "Back Stretch / Caution",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Car 31 ran into 13 under yellow! Severe penalty: EOL start at next race!'"
            },
            {
                id: 4, lap: 31, stage: 2, involved: ["08", "2"], primaryCar: "08", category: "racing_deal",
                title: "Mid-Pack Side Contact",
                summary: "Contact between car 08 and car 2 reviewed and determined to be a racing deal.",
                ruling: "Racing Deal", location: "Front Stretch",
                trackCoords: { x: 450, y: 330 },
                audioTranscript: "[STEWARDS] '08 and 2 contact: Racing deal.'"
            },
            {
                id: 5, lap: 42, stage: 2, involved: ["4"], primaryCar: "4", category: "penalty",
                title: "Turn 2 Spin Trigger",
                summary: "Car 4 lost control and triggered caution exiting Turn 2.",
                ruling: "End of Line (EOL) Penalty (#4)", location: "Turn 2",
                trackCoords: { x: 620, y: 280 },
                audioTranscript: "[RACE CONTROL] 'Car 4 spin. EOL penalty car 4.'"
            },
            {
                id: 6, lap: 50, stage: 2, involved: ["9"], primaryCar: "9", category: "penalty",
                title: "Drafting Loss of Control",
                summary: "Car 9 lost air off rear spoiler in 3-wide draft and spun.",
                ruling: "End of Line (EOL) Penalty (#9)", location: "Turn 3",
                trackCoords: { x: 200, y: 310 },
                audioTranscript: "[RADIO 9] 'Lost the rear end in the draft!' -> EOL car 9."
            },
            {
                id: 7, lap: 65, stage: 3, involved: ["53"], primaryCar: "53", category: "penalty",
                title: "High-Speed Wall Impact Spin",
                summary: "Car 53 hit outside wall and bounced back into traffic.",
                ruling: "End of Line (EOL) Penalty (#53)", location: "Turn 1",
                trackCoords: { x: 670, y: 180 },
                audioTranscript: "[RACE CONTROL] 'Car 53 wall impact. EOL penalty car 53.'"
            },
            {
                id: 8, lap: 91, stage: 3, involved: ["31", "13"], primaryCar: "31", category: "infraction",
                title: "Turn 4 Exit Contact (2nd Incident of Night)",
                summary: "Car 31 made contact with car 13 coming off Turn 4 under green (31's 2nd incident of night).",
                ruling: "Second Incident Noted (#31)", location: "Turn 4 Exit",
                trackCoords: { x: 220, y: 70 },
                audioTranscript: "[STEWARDS] 'Noted as car 31's 2nd incident of the night.'"
            },
            {
                id: 9, lap: 93, stage: 3, involved: ["08"], primaryCar: "08", category: "penalty",
                title: "Late Race Single Car Spin",
                summary: "Car 08 spun on front stretch with 7 laps remaining.",
                ruling: "End of Line (EOL) Penalty (#08)", location: "Front Stretch",
                trackCoords: { x: 350, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Car 08 spin on front stretch. EOL penalty car 08.'"
            }
        ]
    },

    gateway: {
        id: "gateway",
        title: "Gateway Motorsports Park",
        subtext: "World Wide Technology Raceway — 140 Laps (Stages @ 42 & 84)",
        laps: 140,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 42 },
            { name: "Stage 2", lap: 84 },
            { name: "Final Stage", lap: 140 }
        ],
        mvp: {
            carNumber: "01",
            driverName: "Car #01 (Adam Tahan)",
            title: "Wall of Shame MVP",
            reason: "5+ Major Infractions, 7 Pit Stalls Run Through & Repeat Post-Race Disobedience (2nd Week in a Row!)",
            totalIncidents: 5,
            totalPenalties: "Drive Through + Disobedience Warning"
        },
        drivers: [
            { number: "01", name: "Driver #01 (Adam Tahan)", score: 98, level: "CRITICAL", badge: "MVP / Repeat Offender", incidentsCount: 5, colors: ["#ff0055", "#111"] },
            { number: "13", name: "Driver #13", score: 72, level: "HIGH", badge: "Chaos Magnet (4 Incidents)", incidentsCount: 4, colors: ["#ffaa00", "#111"] },
            { number: "54", name: "Driver #54", score: 65, level: "HIGH", badge: "Overdriver", incidentsCount: 2, colors: ["#ff5500", "#111"] },
            { number: "00", name: "Driver #00", score: 58, level: "MEDIUM", badge: "Drifter & VC Warrior", incidentsCount: 2, colors: ["#a020f0", "#111"] },
            { number: "50", name: "Driver #50", score: 50, level: "MEDIUM", badge: "Hardware Malfunction", incidentsCount: 2, colors: ["#00ccff", "#111"] },
            { number: "6",  name: "Driver #6",  score: 45, level: "MEDIUM", badge: "EOL Recipient", incidentsCount: 2, colors: ["#e67e22", "#111"] },
            { number: "31", name: "Driver #31", score: 20, level: "LOW", badge: "Victim of Circumstance", incidentsCount: 2, colors: ["#2ecc71", "#111"] },
            { number: "5",  name: "Driver #5",  score: 25, level: "LOW", badge: "Netcode Victim", incidentsCount: 3, colors: ["#3498db", "#111"] },
            { number: "2",  name: "Driver #2",  score: 30, level: "LOW", badge: "Wall Rider", incidentsCount: 1, colors: ["#9b59b6", "#111"] },
            { number: "29", name: "Driver #29", score: 15, level: "LOW", badge: "Radio Expressive", incidentsCount: 2, colors: ["#1abc9c", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 10, stage: 1, involved: ["50"], primaryCar: "50", category: "penalty",
                title: "Steering Wheel Disconnect Mid-Corner",
                summary: "Car 50's steering wheel disconnected in the middle of Turn 2.",
                ruling: "Drive Through Penalty (#50)", location: "Turn 2",
                trackCoords: { x: 675, y: 250 },
                audioTranscript: "[RADIO 50] 'My wheel just disconnected! I can't turn!' -> Stewards: Drive through car 50."
            },
            {
                id: 2, lap: 14, stage: 1, involved: ["31", "1", "63", "15"], primaryCar: "31", category: "racing_deal",
                title: "Restart Shenanigans & Accordion Grass Excursion",
                summary: "Car 31 lifted for 1, 63 tagged 31, and accordion effect sent car 15 through the grass.",
                ruling: "No Fault / Racing Deal", location: "Front Stretch",
                trackCoords: { x: 490, y: 330 },
                audioTranscript: "[RADIO 15] 'Grass mowing duty on lap 14! Thanks guys!' -> Stewards: No fault, restart accordion."
            },
            {
                id: 3, lap: 42, stage: 1, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 1 Official Finish",
                summary: "Stage 1 checkered flag at Lap 42.",
                ruling: "Stage 1 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Green-white checkered for Stage 1 complete! Standings locked.'"
            },
            {
                id: 4, lap: 46, stage: 2, involved: ["00", "13"], primaryCar: "00", category: "warning",
                title: "Heated Verbal Comms Under Caution",
                summary: "Car 00 and Car 13 had several spicy comments over Discord VC and race comms.",
                ruling: "Verbal Warning / Conduct Noted", location: "Pit Road / Caution",
                trackCoords: { x: 360, y: 290 },
                audioTranscript: "[RACE SCANNER] 'Bleep bleep! Take it to DMs fellas!' -> Stewards: Warning issued for comms language."
            },
            {
                id: 5, lap: 47, stage: 2, involved: ["01"], primaryCar: "01", category: "infraction",
                title: "Illegal Pace Car / Yellow Flag Overtake",
                summary: "Car 01 passed the race leader on the left under caution to improperly lead a yellow lap.",
                ruling: "Infraction Noted / Warning", location: "Front Stretch",
                trackCoords: { x: 310, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Car 01, you cannot pass the leader on the left under yellow!' -> Noted."
            },
            {
                id: 6, lap: 48, stage: 2, involved: ["6"], primaryCar: "6", category: "rescinded",
                title: "Assumed Passing Under Yellow Penalty Cleared",
                summary: "Race control reviewed and cleared an assumed yellow pass penalty for the #6 truck.",
                ruling: "Penalty Rescinded / Cleared", location: "Back Stretch",
                trackCoords: { x: 420, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Penalty for the 6 truck is CLEARED. Carry on, 6.'"
            },
            {
                id: 7, lap: 62, stage: 2, involved: ["54", "31"], primaryCar: "54", category: "infraction",
                title: "Turn 1 Overdrive & Shove",
                summary: "Car 54 severely overshot Turn 1 braking zone and shoved car 31 up the track.",
                ruling: "Overdrive Contact (#54 at Fault)", location: "Turn 1",
                trackCoords: { x: 675, y: 145 },
                audioTranscript: "[RADIO 31] 'The 54 completely blew the corner and ran me up to the wall!'"
            },
            {
                id: 8, lap: 63, stage: 2, involved: ["5", "13"], primaryCar: "5", category: "netcode",
                title: "Netcode Contact Launches Car 13",
                summary: "Severe netcode collision between car 5 and car 13 sends car 13 sliding up the track.",
                ruling: "Netcode Incident / Racing Deal", location: "Turn 3 & 4",
                trackCoords: { x: 100, y: 200 },
                audioTranscript: "[RADIO 13] 'Did we even hit?! Netcode just sent me flying!'"
            },
            {
                id: 9, lap: 81, stage: 2, involved: ["01", "5"], primaryCar: "01", category: "penalty",
                title: "Front Stretch Tap & Near-Wreck (4x)",
                summary: "Car 01 tapped car 5 on front stretch, nearly causing a catastrophic wreck and incurring a 4x.",
                ruling: "Car 01 At Fault (4x Penalty)", location: "Front Stretch",
                trackCoords: { x: 550, y: 330 },
                audioTranscript: "[RADIO 5] '01 just hooked my rear bumper on the front stretch! Almost destroyed us both!'"
            },
            {
                id: 10, lap: 84, stage: 2, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 2 Official Finish",
                summary: "Stage 2 checkered flag at Lap 84.",
                ruling: "Stage 2 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Stage 2 official finish. Final stage under green coming up.'"
            },
            {
                id: 11, lap: 89, stage: 3, involved: ["13"], primaryCar: "13", category: "racing_deal",
                title: "Late Lane Change & Heavy Braking Turn 1",
                summary: "Car 13 dove late to bottom lane and braked heavily for Turn 1. Deemed a missed shift.",
                ruling: "Car 13 Deemed Missed Shift", location: "Turn 1 Entry",
                trackCoords: { x: 610, y: 320 },
                audioTranscript: "[STEWARDS] 'Car 13 jumped down late and hit the brakes. Telemetry shows missed gear shift.'"
            },
            {
                id: 12, lap: 95, stage: 3, involved: ["13", "5"], primaryCar: "13", category: "racing_deal",
                title: "Turn 1 Entry Contact to Right Rear",
                summary: "Car 13 expected 5 to pinch down lower on entry and turned into car 5's right rear.",
                ruling: "Racing Deal", location: "Turn 1",
                trackCoords: { x: 695, y: 185 },
                audioTranscript: "[STEWARDS] 'Misjudged entry line between 13 and 5. Classified as racing deal.'"
            },
            {
                id: 13, lap: 98, stage: 3, involved: ["13", "12"], primaryCar: "13", category: "racing_deal",
                title: "Turn 4 Exit Squeeze & Contact",
                summary: "Contact exiting Turn 4 between 13 and 12. Met in the middle exiting Turn 4.",
                ruling: "Racing Deal", location: "Turn 4 Exit",
                trackCoords: { x: 175, y: 80 },
                audioTranscript: "[STEWARDS] 'Both cars converged on turn 4 exit. Standard racing incident.'"
            },
            {
                id: 14, lap: 99, stage: 3, involved: ["01", "29"], primaryCar: "01", category: "racing_deal",
                title: "Car 01 Wall Squeeze on 29",
                summary: "Car 01 squeezed car 29 into the outside wall. Car 29 voiced warning over comms.",
                ruling: "Racing Deal / Driver Warning On Air", location: "Back Stretch",
                trackCoords: { x: 290, y: 70 },
                audioTranscript: "[RADIO 29] '01! Don't EVER do that again! You pinched me straight into the wall!'"
            },
            {
                id: 15, lap: 102, stage: 3, involved: ["00", "5"], primaryCar: "00", category: "warning",
                title: "Wall Rebound Contact into Car 5",
                summary: "Car 00 came off the outside wall unexpectedly and slammed into car 5.",
                ruling: "Official Warning to Car 00", location: "Turn 2",
                trackCoords: { x: 635, y: 285 },
                audioTranscript: "[STEWARDS] 'Car 00 bounce off wall into 5. Official warning recorded for car 00.'"
            },
            {
                id: 16, lap: 104, stage: 3, involved: ["01", "29", "1"], primaryCar: "01", category: "racing_deal",
                title: "Mid-Corner Chop & Triple 4x Collision",
                summary: "Car 01 came down on 29's right rear, delivering 4x contact to 01, 29, and car 1.",
                ruling: "Racing Deal (3 Cars Incur 4x)", location: "Turn 3 & 4",
                trackCoords: { x: 140, y: 285 },
                audioTranscript: "[RADIO 1] 'I got a 4x just for existing behind 01 and 29!' -> Stewards: Racing deal."
            },
            {
                id: 17, lap: 113, stage: 3, involved: ["6", "14"], primaryCar: "6", category: "penalty",
                title: "Turn 2 Tank-Slapper Loose Slide",
                summary: "Car 6 got extremely loose exiting Turn 2 and nearly wiped out car 14.",
                ruling: "End of Line (EOL) Penalty for Car 6", location: "Turn 2 Exit",
                trackCoords: { x: 550, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Car 6 uncontrolled loss of grip. EOL penalty car 6 at next caution restart.'"
            },
            {
                id: 18, lap: 129, stage: 3, involved: ["01"], primaryCar: "01", category: "penalty",
                title: "Pit Lane Highway: 7 Pit Stalls Run Through!",
                summary: "Car 01 drove straight through SEVEN occupied pit stalls on pit road.",
                ruling: "Confirmed Drive Through Penalty (#01)", location: "Pit Road",
                trackCoords: { x: 440, y: 290 },
                audioTranscript: "[RACE CONTROL] 'Car 01 drove through 7 pit stalls! That is a confirmed drive through penalty!'"
            },
            {
                id: 19, lap: 136, stage: 3, involved: ["54", "50"], primaryCar: "54", category: "infraction",
                title: "Turn 3 Rear-End Punt & Brakecheck Accusation",
                summary: "Car 54 drove square into the back of 50 in Turn 3, claiming he was brakechecked.",
                ruling: "Aggressive Overdrive / Over-Aggressive Driving (#54)", location: "Turn 3",
                trackCoords: { x: 115, y: 245 },
                audioTranscript: "[RADIO 54] 'He brakechecked me!' -> [RADIO 50] 'Brakechecked?! You hit me full throttle in turn 3!'"
            },
            {
                id: 20, lap: 140, stage: 3, involved: ["2"], primaryCar: "2", category: "warning",
                title: "Extended Wall Ride Turns 3 & 4",
                summary: "Car 2 rode the outside wall through the entire first half of Turns 3 & 4.",
                ruling: "Wall Riding Noted", location: "Turn 3 & 4",
                trackCoords: { x: 115, y: 155 },
                audioTranscript: "[STEWARDS] 'Car 2 riding the fence like it's Homestead. Noted.'"
            },
            {
                id: 21, lap: 141, stage: 3, involved: ["00"], primaryCar: "00", category: "warning",
                title: "Post-Race Cooldown Drift Exhibition",
                summary: "Car 00 initiated unapproved drift maneuvers on the front stretch after checkered flag.",
                ruling: "Post-Race Conduct Warning (#00)", location: "Front Stretch",
                trackCoords: { x: 440, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Car 00, cool it down. Save the drifting for Formula Drift.'"
            },
            {
                id: 22, lap: 142, stage: 3, involved: ["01"], primaryCar: "01", category: "mvp",
                title: "WALL OF SHAME MVP: Disobeying Race Control Burnout Ban",
                summary: "Car 01 performed front stretch burnouts 5s after explicit radio command not to interfere (2nd week in a row!).",
                ruling: "WALL OF SHAME MVP AWARD / Major Penalty Pending", location: "Front Stretch / S/F Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Car 01 DO NOT DO BURNOUTS... [5 SECONDS LATER] *Tire Smoke Screeching* ... Unbelievable. 2nd week in a row.'"
            }
        ]
    },

    darlington: {
        id: "darlington",
        title: "Darlington Raceway",
        subtext: "The Track Too Tough to Tame — 95 Laps (Stages @ 36 & 72)",
        laps: 95,
        trackType: "darlington_egg",
        stages: [
            { name: "Stage 1", lap: 36 },
            { name: "Stage 2", lap: 72 },
            { name: "Final Stage", lap: 95 }
        ],
        mvp: {
            carNumber: "62",
            driverName: "Car #62",
            title: "Wall of Shame MVP",
            reason: "Opening Lap Contact, ARCA Braking into Wrecks & Punt on Car #13",
            totalIncidents: 3,
            totalPenalties: "Drive Through + ARCA Brake Probation Warning"
        },
        drivers: [
            { number: "62", name: "Driver #62", score: 95, level: "CRITICAL", badge: "MVP / ARCA Braker", incidentsCount: 3, colors: ["#ff0055", "#111"] },
            { number: "22", name: "Driver #22", score: 75, level: "HIGH", badge: "Spin Initiator (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "11", name: "Driver #11", score: 70, level: "HIGH", badge: "Wall Rebounder (EOL)", incidentsCount: 1, colors: ["#ff5500", "#111"] },
            { number: "31", name: "Driver #31", score: 68, level: "HIGH", badge: "Correction Incident (EOL)", incidentsCount: 1, colors: ["#ff5500", "#111"] },
            { number: "36", name: "Driver #36", score: 60, level: "MEDIUM", badge: "Self Spin (EOL)", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "9",  name: "Driver #9",  score: 55, level: "MEDIUM", badge: "Pit Road Crash & Victim", incidentsCount: 4, colors: ["#a020f0", "#111"] },
            { number: "01", name: "Driver #01 (Adam Tahan)", score: 40, level: "MEDIUM", badge: "Missed Shift Stackup", incidentsCount: 2, colors: ["#00ccff", "#111"] },
            { number: "4",  name: "Driver #4",  score: 35, level: "LOW", badge: "Illegal Yellow Lead", incidentsCount: 1, colors: ["#3498db", "#111"] },
            { number: "5",  name: "Driver #5",  score: 30, level: "LOW", badge: "Money Shift Victim", incidentsCount: 1, colors: ["#2ecc71", "#111"] },
            { number: "1",  name: "Driver #1",  score: 25, level: "LOW", badge: "Spin Victim", incidentsCount: 1, colors: ["#1abc9c", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 1, stage: 1, involved: ["62", "15"], primaryCar: "62", category: "penalty",
                title: "Lap 1 Loose Slide into Car 15",
                summary: "Car 62 got loose on the opening lap and slid directly down into car 15.",
                ruling: "Drive Through Penalty (#62)", location: "Turn 1 / 2",
                trackCoords: { x: 670, y: 150 },
                audioTranscript: "[RADIO 15] 'Lap 1 and 62 already came down into me!' -> Stewards: Drive through car 62."
            },
            {
                id: 2, lap: 7, stage: 1, involved: ["29", "14"], primaryCar: "29", category: "infraction",
                title: "Turn 3 Entry Drift Contact",
                summary: "Car 29 drifted up into car 14 entering Turn 3.",
                ruling: "Racing Contact / Noted", location: "Turn 3 Entry",
                trackCoords: { x: 280, y: 310 },
                audioTranscript: "[RADIO 14] '29 ran right up into me entering 3!'"
            },
            {
                id: 3, lap: 27, stage: 1, involved: ["22", "9"], primaryCar: "22", category: "penalty",
                title: "Car 22 Sends Car 9 Around",
                summary: "Car 22 got into the rear of car 9 and turned him around exiting Turn 4.",
                ruling: "End of Line (EOL) Penalty (#22)", location: "Turn 4 Exit",
                trackCoords: { x: 210, y: 80 },
                audioTranscript: "[RACE CONTROL] 'Car 22 dump on car 9. EOL penalty car 22 at next restart.'"
            },
            {
                id: 4, lap: 31, stage: 1, involved: ["01"], primaryCar: "01", category: "racing_deal",
                title: "Missed Shift Inside Line Stackup",
                summary: "Prior to Stage 1 yellow, Car 01 (Adam Tahan) seemingly missed a shift, causing the inside lane to stack up.",
                ruling: "Racing Deal (Missed Shift)", location: "Front Stretch",
                trackCoords: { x: 480, y: 330 },
                audioTranscript: "[STEWARDS] 'Inside line checked up heavy. Telemetry indicates car 01 missed gear shift.'"
            },
            {
                id: 5, lap: 35, stage: 1, involved: ["1", "18", "9"], primaryCar: "1", category: "racing_deal",
                title: "Turn 2 Exit Multi-Car Spin",
                summary: "Cars 1 and 18 spun off Turn 2. Car 1 self-spun while car 18 received contact from car 9.",
                ruling: "Racing Incident (No Single Driver at Fault)", location: "Turn 2 Exit",
                trackCoords: { x: 570, y: 70 },
                audioTranscript: "[STEWARDS] 'Multiple spinning vehicles off Turn 2. No individual driver deemed sole causer.'"
            },
            {
                id: 6, lap: 36, stage: 1, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 1 Official Finish",
                summary: "Stage 1 checkered flag at Lap 36.",
                ruling: "Stage 1 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Checkered flag for Stage 1. Stage 1 complete!'"
            },
            {
                id: 7, lap: 41, stage: 2, involved: ["31", "01", "62"], primaryCar: "31", category: "penalty",
                title: "Car 31 Snap Correction into 01 & ARCA Brake Suspect",
                summary: "Car 31 snapped loose and corrected directly up into car 01. Car 62 suspected of ARCA braking into the incident.",
                ruling: "End of Line (EOL) Penalty (#31)", location: "Turn 1 / 2",
                trackCoords: { x: 670, y: 220 },
                audioTranscript: "[RADIO 01] '31 snapped up into me, and 62 came in full speed!' -> EOL car 31."
            },
            {
                id: 8, lap: 62, stage: 2, involved: ["62", "13"], primaryCar: "62", category: "infraction",
                title: "ARCA Brake Punt: Car 62 Slammed Rear of 13",
                summary: "Car 62 failed to decelerate and drove full throttle into the rear bumper of car 13 under check-up.",
                ruling: "ARCA Braking Warning / Infraction (#62)", location: "Turn 1 Entry",
                trackCoords: { x: 620, y: 320 },
                audioTranscript: "[RADIO 13] '62 just ARCA braked straight into my rear bumper!' -> Stewards warning #62."
            },
            {
                id: 9, lap: 72, stage: 2, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 2 Official Finish",
                summary: "Stage 2 checkered flag at Lap 72.",
                ruling: "Stage 2 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Stage 2 official finish. Final green flag segment coming up.'"
            },
            {
                id: 10, lap: 80, stage: 3, involved: ["11", "9"], primaryCar: "11", category: "penalty",
                title: "Wall Rebound Side-Swipe into Car 9",
                summary: "Car 11 bounced off the outside wall and slammed into car 9, despite car 9 leaving room on exit.",
                ruling: "End of Line (EOL) Penalty (#11)", location: "Turn 4 Exit",
                trackCoords: { x: 240, y: 70 },
                audioTranscript: "[RADIO 9] 'I left him plenty of room on exit and he bounced off the fence right into me!'"
            },
            {
                id: 11, lap: 84, stage: 3, involved: ["36"], primaryCar: "36", category: "penalty",
                title: "Car 36 Self-Spin off Turn 2",
                summary: "Car 36 lost control and self-spun exiting Turn 2.",
                ruling: "End of Line (EOL) Penalty (#36)", location: "Turn 2 Exit",
                trackCoords: { x: 550, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Car 36 single vehicle spin off 2. EOL penalty car 36.'"
            },
            {
                id: 12, lap: 89, stage: 3, involved: ["5"], primaryCar: "5", category: "racing_deal",
                title: "Money Shift Downshift Spin",
                summary: "Car 5 accidentally money-shifted (over-revved downshift) and spun on the front stretch.",
                ruling: "Racing Deal (Mechanical Driver Error)", location: "Front Stretch",
                trackCoords: { x: 340, y: 330 },
                audioTranscript: "[RADIO 5] 'Ouch! Money shifted down into 2nd gear and spun it!'"
            },
            {
                id: 13, lap: 90, stage: 3, involved: ["4"], primaryCar: "4", category: "infraction",
                title: "Unearned Yellow Flag Lap Lead",
                summary: "Car 4 failed to maintain pace car order and improperly led a lap under yellow.",
                ruling: "Unearned Lap Lead Noted (#4)", location: "Front Stretch / Caution",
                trackCoords: { x: 300, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Car 4 did not legitimately lead that lap under yellow. Noted.'"
            },
            {
                id: 14, lap: 95, stage: 3, involved: ["9"], primaryCar: "9", category: "warning",
                title: "Post-Race Pit Road Crash",
                summary: "Post-race cooldown: Car 9 lost control and wrecked himself on pit road.",
                ruling: "Post-Race Conduct Warning (#9)", location: "Pit Road",
                trackCoords: { x: 440, y: 290 },
                audioTranscript: "[RACE CONTROL] 'Car 9 just wrecked himself on pit road post-race. Park it, 9!'"
            }
        ]
    },

    kansas: {
        id: "kansas",
        title: "Kansas Speedway",
        subtext: "1.5-Mile Tri-Oval — 100 Laps (Stages @ 33 & 66)",
        laps: 100,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 33 },
            { name: "Stage 2", lap: 66 },
            { name: "Final Stage", lap: 100 }
        ],
        mvp: {
            carNumber: "9",
            driverName: "Car #9",
            title: "Wall of Shame MVP (DISQUALIFIED)",
            reason: "Admitted Intentional Wrecking into #91: Disqualified, Stripped of All Event Points, 3-Week Probation & 3-Week EOL Starts",
            totalIncidents: 1,
            totalPenalties: "DQ + 0 Pts + 3-Wk Probation + 3-Wk EOL Starts"
        },
        drivers: [
            { number: "9", name: "Driver #9", score: 100, level: "CRITICAL", badge: "DISQUALIFIED / Intentional Wreck", incidentsCount: 1, colors: ["#ff0055", "#111"] },
            { number: "12", name: "Driver #12", score: 75, level: "HIGH", badge: "Clip & Spin (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "35", name: "Driver #35", score: 50, level: "MEDIUM", badge: "Stage Finish Contact", incidentsCount: 1, colors: ["#ffcc00", "#111"] },
            { number: "31", name: "Driver #31", score: 40, level: "MEDIUM", badge: "Contact Review Request", incidentsCount: 1, colors: ["#3498db", "#111"] },
            { number: "47", name: "Driver #47 (Michael Rakes)", score: 10, level: "LOW", badge: "Fuel Master / Winner", incidentsCount: 0, colors: ["#00ff00", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 23, stage: 1, involved: ["12", "1"], primaryCar: "12", category: "penalty",
                title: "Car 12 Clips Car 1 Spin Off Turn 4",
                summary: "Car 12 slightly came down and clipped car 1, sending car 1 spinning.",
                ruling: "End of Line (EOL) Penalty (#12)", location: "Turn 4 Exit",
                trackCoords: { x: 220, y: 80 },
                audioTranscript: "[RACE CONTROL] 'Car 12 clipped the 1 and sent him around off Turn 4. EOL penalty car 12.'"
            },
            {
                id: 2, lap: 33, stage: 1, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 1 Official Finish",
                summary: "Stage 1 yellow checkered flag at Lap 33.",
                ruling: "Stage 1 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Stage 1 yellow at Lap 33. Standings locked for Stage 1.'"
            },
            {
                id: 3, lap: 66, stage: 2, involved: ["35", "31"], primaryCar: "35", category: "infraction",
                title: "Stage 2 Finish Turn 4 Contact (Requested Review)",
                summary: "Coming to Stage 2 yellow, contact occurred between car 35 and car 31 off Turn 4. Requested to be reviewed by car 31.",
                ruling: "Stewards Review Completed / Racing Incident Noted", location: "Turn 4 Exit",
                trackCoords: { x: 210, y: 80 },
                audioTranscript: "[RADIO 31] 'Check the tape on Turn 4 coming to the stage yellow with 35.' -> Stewards: Reviewed as hard stage racing."
            },
            {
                id: 4, lap: 73, stage: 3, involved: ["9", "91"], primaryCar: "9", category: "mvp",
                title: "INTENTIONAL WRECKING: Car #9 Comes Down into Car #91 (Admitted Intent)",
                summary: "Car #9 came down directly into car #91. Race Control reviewed for intent. Upon quick discussion, the driver of #9 admitted it was intentional, and telemetry confirmed intentional wrecking.",
                ruling: "DISQUALIFICATION (#9) — Stripped of All Event Points + 3-Week Probation + 3-Week EOL Starts", location: "Back Stretch / Turn 3",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Car 9 came down into 91. After discussion, driver #9 admitted it was intentional. Intentional wreck confirmed after review. Car 9 is DISQUALIFIED, forfeits all event points, placed on 3-week probation, and starts EOL for the next 3 weeks!'"
            },
            {
                id: 5, lap: 100, stage: 3, involved: ["47", "2", "7"], primaryCar: "47", category: "racing_deal",
                title: "Fuel Mileage Strategy Thriller for the Win",
                summary: "The race win came down to extreme fuel mileage management. Front-runners saved fuel impeccably to take the checkered flag as competitor cars ran dry.",
                ruling: "Official Race Win Decided by Fuel Strategy", location: "Front Stretch / S/F Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RADIO 47] 'Sipping fuel through 3 and 4... we made it! Checkered flag!' -> Win decided on fuel mileage."
            }
        ]
    },

    texas: {
        id: "texas",
        title: "Texas Motor Speedway",
        subtext: "1.5-Mile High-Banked Quad-Oval — The Lone Star State 120 (Stages @ 36 & 72)",
        laps: 120,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 36 },
            { name: "Stage 2", lap: 72 },
            { name: "Final Stage", lap: 120 }
        ],
        mvp: {
            carNumber: "63",
            driverName: "Car #63",
            title: "Wall of Shame MVP",
            reason: "Lap 2 Early 3-Wide Chop Across #00 Nose (Drive-Thru Penalty)",
            totalIncidents: 1,
            totalPenalties: "Drive-Through Penalty"
        },
        drivers: [
            { number: "63", name: "Driver #63", score: 92, level: "CRITICAL", badge: "MVP / Drive-Thru Chop", incidentsCount: 1, colors: ["#ff0055", "#111"] },
            { number: "36", name: "Driver #36", score: 85, level: "HIGH", badge: "Post-Race Retaliation & Protest", incidentsCount: 2, colors: ["#ff5500", "#111"] },
            { number: "6",  name: "Driver #6",  score: 75, level: "HIGH", badge: "Quad-Oval Check-Up (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "17", name: "Driver #17", score: 70, level: "HIGH", badge: "Turn Contact (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "15", name: "Driver #15", score: 65, level: "MEDIUM", badge: "Wheel Failure (EOL)", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "54", name: "Driver #54", score: 55, level: "MEDIUM", badge: "Wall Hit & Pit Contact", incidentsCount: 2, colors: ["#a020f0", "#111"] },
            { number: "00", name: "Driver #00", score: 45, level: "MEDIUM", badge: "Wall Hit & 3-Wide Victim", incidentsCount: 2, colors: ["#3498db", "#111"] },
            { number: "69", name: "Driver #69", score: 40, level: "LOW", badge: "Lack of Avoidance", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "31", name: "Driver #31", score: 35, level: "LOW", badge: "Corner Exit Incident", incidentsCount: 1, colors: ["#2ecc71", "#111"] },
            { number: "24", name: "Driver #24", score: 30, level: "LOW", badge: "Check-Up & Post-Race Victim", incidentsCount: 2, colors: ["#1abc9c", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 2, stage: 1, involved: ["63", "00"], primaryCar: "63", category: "penalty",
                title: "Lap 2 3-Wide Chop Across Car 00 Nose",
                summary: "Car 63 attempted to leave room up top while in the middle 3-wide, but turned himself across the nose of car 00.",
                ruling: "Drive-Through Penalty (#63)", location: "Turn 1 / 2",
                trackCoords: { x: 670, y: 160 },
                audioTranscript: "[RACE CONTROL] 'Car 63 turned across the nose of the 00 in the middle of 3-wide. Drive-Through penalty car 63!'"
            },
            {
                id: 2, lap: 12, stage: 1, involved: ["54", "37", "69"], primaryCar: "69", category: "racing_deal",
                title: "Wall Scraping Chain Reaction (No Caution)",
                summary: "Car 54 scraped the wall, car 37 followed him into the fence and was hit by car 69 who did not lift or attempt to avoid.",
                ruling: "Racing Incident (No Caution Called)", location: "Turn 4 Exit",
                trackCoords: { x: 220, y: 80 },
                audioTranscript: "[STEWARDS] 'Car 54 into wall, 37 followed, 69 made contact without lifting. Green flag stays out.'"
            },
            {
                id: 3, lap: 23, stage: 1, involved: ["15"], primaryCar: "15", category: "penalty",
                title: "Mechanical Wheel Failure Wall Impact",
                summary: "Car 15 suffered a mechanical wheel hardware failure and lost control into the wall.",
                ruling: "End of Line (EOL) Penalty (#15)", location: "Turn 3",
                trackCoords: { x: 130, y: 260 },
                audioTranscript: "[RADIO 15] 'Wheel failure! Lost total force feedback!' -> EOL car 15."
            },
            {
                id: 4, lap: 36, stage: 1, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 1 Official Finish",
                summary: "Stage 1 green-white checkered flag at Lap 36.",
                ruling: "Stage 1 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Stage 1 complete at Lap 36! Standings locked.'"
            },
            {
                id: 5, lap: 56, stage: 2, involved: ["12", "54"], primaryCar: "54", category: "racing_deal",
                title: "Pit Entry Miscommunication Bumper Contact",
                summary: "Car 12 was braking to pit; car 54 missed the 'pitting in' message and could not react in time, tagging 12.",
                ruling: "Racing Deal (Pitting Miscommunication)", location: "Turn 4 / Pit Entry",
                trackCoords: { x: 280, y: 290 },
                audioTranscript: "[RADIO 54] 'Didn't see his pitting in call! He hit the brakes right in front of me!' -> Stewards: Racing deal."
            },
            {
                id: 6, lap: 62, stage: 2, involved: ["00", "47", "35", "93", "24"], primaryCar: "00", category: "racing_deal",
                title: "Multi-Car Tri-Oval Accordion Stackup",
                summary: "Car 00 hit wall in front of 47; 35 forced 93 into grass to avoid and checked up, causing car 24 to tag 35. Multiple simultaneous collisions.",
                ruling: "Racing Deal (Multi-Car Stackup / No Single Driver At Fault)", location: "Front Stretch / Tri-Oval",
                trackCoords: { x: 450, y: 330 },
                audioTranscript: "[STEWARDS] 'Multiple incidents occurred simultaneously off Turn 4. No single driver at fault.'"
            },
            {
                id: 7, lap: 72, stage: 2, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 2 Official Finish",
                summary: "Stage 2 green-white checkered flag at Lap 72.",
                ruling: "Stage 2 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Stage 2 complete at Lap 72. Final segment coming up.'"
            },
            {
                id: 8, lap: 79, stage: 3, involved: ["17", "50"], primaryCar: "17", category: "penalty",
                title: "Turn 2 Mid-Corner Drifting Contact",
                summary: "Car 50 and car 17 collided when car 17 drifted significantly more than 50 through the corner.",
                ruling: "End of Line (EOL) Penalty (#17)", location: "Turn 2",
                trackCoords: { x: 650, y: 250 },
                audioTranscript: "[RACE CONTROL] 'Car 17 drifted up into the 50. EOL penalty car 17.'"
            },
            {
                id: 9, lap: 84, stage: 3, involved: ["6", "24", "36"], primaryCar: "6", category: "penalty",
                title: "Quad-Oval Restart Check-Up Stackup",
                summary: "Car 6 checked up sharply on the quad-oval after the restart; car 24 had no time to react and slammed into 6. Car 36 filed formal protest.",
                ruling: "End of Line (EOL) Penalty (#6) — Protest Filed by #36", location: "Quad-Oval / Tri-Oval",
                trackCoords: { x: 380, y: 330 },
                audioTranscript: "[RADIO 36] 'I'm officially protesting the lap 84 restart incident with the 6!' -> Race Control: EOL car 6."
            },
            {
                id: 10, lap: 113, stage: 3, involved: ["31", "93"], primaryCar: "31", category: "racing_deal",
                title: "Turn 2 Corner Exit Quarter-Panel Squeeze",
                summary: "Car 31 exiting Turn 2; car 93 was barely on 31's right-rear quarter panel. 31 moved very little and contact occurred.",
                ruling: "Racing Deal", location: "Turn 2 Exit",
                trackCoords: { x: 580, y: 70 },
                audioTranscript: "[STEWARDS] 'Tight racing off 2 between 31 and 93. Classified as racing deal.'"
            },
            {
                id: 11, lap: 120, stage: 3, involved: ["36", "24"], primaryCar: "36", category: "warning",
                title: "POST-RACE INCIDENT: Car 36 Drives Into Car 24",
                summary: "After the checkered flag, car 36 intentionally drove into car 24 in retaliation for the Lap 84 restart wreck.",
                ruling: "Official Post-Race Warning Issued to Car 36", location: "Cool-Down Lap / Pit Lane",
                trackCoords: { x: 440, y: 290 },
                audioTranscript: "[RACE CONTROL] 'Car 36, driving into the 24 post-race is unacceptable. Official warning issued to car 36!'"
            }
        ]
    },

    las_vegas: {
        id: "las_vegas",
        title: "Las Vegas Motor Speedway",
        subtext: "Viva Las Vegas 110 — 110 Laps (Stages @ 33 & 66)",
        laps: 110,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 33 },
            { name: "Stage 2", lap: 66 },
            { name: "Final Stage", lap: 110 }
        ],
        mvp: {
            carNumber: "9 & 18",
            driverName: "Car #9 (Dylan McDonald) & Car #18 (Victor Weaver)",
            title: "Wall of Shame MVPs",
            reason: "Confirmed Post-Yellow Intentional Wrecking: Both Drivers DQ'd! #9 Suspended 1 Wk, ROS Probation & 3-Wk EOL/Drive-Thru; #18 3-Wk Probation & EOL Start",
            totalIncidents: 2,
            totalPenalties: "DOUBLE DISQUALIFICATION + Suspension + Probation"
        },
        drivers: [
            { number: "9",  name: "Driver #9 (Dylan McDonald)", score: 100, level: "CRITICAL", badge: "DISQUALIFIED / 1-Wk Suspension", incidentsCount: 2, colors: ["#ff0055", "#111"] },
            { number: "18", name: "Driver #18 (Victor Weaver)", score: 98, level: "CRITICAL", badge: "DISQUALIFIED / 3-Wk Probation", incidentsCount: 2, colors: ["#ff0055", "#111"] },
            { number: "36", name: "Driver #36 (Adam Tahan)", score: 75, level: "HIGH", badge: "Apron Chop / Turn Self (EOL)", incidentsCount: 2, colors: ["#ffaa00", "#111"] },
            { number: "14", name: "Driver #14 (Jason Allegrini)", score: 70, level: "HIGH", badge: "Wall Squeeze (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "24", name: "Driver #24", score: 70, level: "HIGH", badge: "Side-Swipe Crash (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "62", name: "Driver #62 (Ty Corino)", score: 45, level: "MEDIUM", badge: "Restart Line Warning", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "22", name: "Driver #22 (Joshua Adams)", score: 30, level: "LOW", badge: "Stage Finish Contact", incidentsCount: 1, colors: ["#3498db", "#111"] },
            { number: "91", name: "Driver #91", score: 20, level: "LOW", badge: "Cleared of Intent Wrecking", incidentsCount: 2, colors: ["#2ecc71", "#111"] },
            { number: "28", name: "Driver #28", score: 20, level: "LOW", badge: "Cleared of Intent Wrecking", incidentsCount: 2, colors: ["#2ecc71", "#111"] },
            { number: "99", name: "Driver #99", score: 10, level: "LOW", badge: "Yellow Penalty Cleared", incidentsCount: 1, colors: ["#00ff00", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 33, stage: 1, involved: [], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 1 Official Finish",
                summary: "Stage 1 yellow checkered flag at Lap 33.",
                ruling: "Stage 1 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Stage 1 yellow checkered flag at Lap 33! Standings locked.'"
            },
            {
                id: 2, lap: 66, stage: 2, involved: ["22", "01", "15"], primaryCar: "22", category: "racing_deal",
                title: "Stage 2 Finish Turn 4 Stackup",
                summary: "Incident between car 22, car 01, and car 15 off Turn 4 as yellow was being thrown.",
                ruling: "Confirmed Racing Deal", location: "Turn 4 Exit",
                trackCoords: { x: 220, y: 80 },
                audioTranscript: "[STEWARDS] 'Incident off Turn 4 on Stage 2 finish reviewed. Confirmed racing deal.'"
            },
            {
                id: 3, lap: 74, stage: 3, involved: ["91", "14"], primaryCar: "14", category: "penalty",
                title: "Loose Recovery Squeeze into Wall",
                summary: "Car 14 got loose in the corner and chased it up the track into car 91 on the outside, putting 91 in the wall.",
                ruling: "End of Line (EOL) Penalty (#14)", location: "Turn 1 / 2",
                trackCoords: { x: 670, y: 160 },
                audioTranscript: "[RADIO 91] '14 got loose and drove me straight into the wall!' -> Race Control: EOL car 14."
            },
            {
                id: 4, lap: 78, stage: 3, involved: ["62", "69", "31"], primaryCar: "62", category: "warning",
                title: "Restart Line Weave & Chain Reaction Stackup",
                summary: "Cars 62 and 69 met in the middle while getting up to speed. Car 31 had no time to react and hit car 62. Post-review found 62 failed to hold line on restart.",
                ruling: "Racing Deal / Official Warning to Car 62", location: "Front Stretch / Restart Zone",
                trackCoords: { x: 450, y: 330 },
                audioTranscript: "[STEWARDS] 'Car 62 started chain of events by not holding line on restart. Official warning issued to 62.'"
            },
            {
                id: 5, lap: 83, stage: 3, involved: ["36", "15", "9"], primaryCar: "36", category: "racing_deal",
                title: "Check-Up Loose Slide",
                summary: "Car 36 got loose while checking up for car 15; car 9 had no time to react.",
                ruling: "Racing Deal", location: "Turn 3 & 4",
                trackCoords: { x: 140, y: 220 },
                audioTranscript: "[STEWARDS] '36 got loose checking up for 15. Racing deal between 36 and 9.'"
            },
            {
                id: 6, lap: 85, stage: 3, involved: ["99"], primaryCar: "99", category: "rescinded",
                title: "Yellow Flag Wreck Black Flag Rescinded",
                summary: "Car 99 was wrecked under yellow conditions and required an immediate pit stop.",
                ruling: "Black Flag Cleared / Rescinded (#99)", location: "Pit Road",
                trackCoords: { x: 380, y: 290 },
                audioTranscript: "[RACE CONTROL] 'Car 99 was wrecked under yellow. Black flag cleared for car 99.'"
            },
            {
                id: 7, lap: 92, stage: 3, involved: ["12", "28", "91"], primaryCar: "12", category: "racing_deal",
                title: "Mid-Pack Converge & Intent Wreck Audit",
                summary: "Car 12 and 28 met in the middle. Stewards also audited 91 and 28 for potential intentional wrecking.",
                ruling: "Racing Deal / NO INTENTIONAL WRECK FOUND", location: "Back Stretch",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Reviewed 91 and 28 for intentional wrecking: NO INTENTIONAL WRECK FOUND. Racing deal.'"
            },
            {
                id: 8, lap: 96, stage: 3, involved: ["21", "63", "9", "18"], primaryCar: "18", category: "penalty",
                title: "Caution Trigger: Hook Contact Off Turn Exit",
                summary: "Contact between 21 and 63 checked up traffic. Car 9 left room up top; car 18 came up on exit and hooked car 9.",
                ruling: "End of Line (EOL) Penalty (#18)", location: "Turn 4 Exit",
                trackCoords: { x: 210, y: 80 },
                audioTranscript: "[RACE CONTROL] 'Car 18 hooked the 9 off Turn 4. Caution flag out. EOL penalty car 18.'"
            },
            {
                id: 9, lap: 96, stage: 3, involved: ["9", "18"], primaryCar: "9", category: "mvp",
                title: "DOUBLE DISQUALIFICATION: Post-Yellow Intentional Wrecking",
                summary: "Under caution, car 9 intentionally wrecked himself and car 18 drove straight into him. Telemetry & bot confirmed dual intentional wrecking.",
                ruling: "DOUBLE DISQUALIFICATION (#9 & #18) — #9: DQ + 1-Wk Suspension + ROS Probation + 3-Wk EOL & L1 Drive-Thru. #18: DQ + 3-Wk Probation + EOL Start.", location: "Back Stretch / Caution",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'After review, BOTH car 9 and car 18 confirmed for INTENTIONAL WRECKING! Car 9: DISQUALIFIED, 1-week suspension, probation rest of season, 3 weeks EOL + Lap 1 Drive-Through! Car 18: DISQUALIFIED, 3-week probation, EOL start next race!'"
            },
            {
                id: 10, lap: 101, stage: 3, involved: ["36", "47"], primaryCar: "36", category: "penalty",
                title: "Apron Force Attempt Self-Spin",
                summary: "Car 36 attempted to force car 47 onto the apron and spun himself around.",
                ruling: "End of Line (EOL) Penalty (#36)", location: "Front Stretch / Apron",
                trackCoords: { x: 480, y: 330 },
                audioTranscript: "[RADIO 47] '36 tried to squeeze me all the way onto the apron and spun himself out!' -> EOL car 36."
            },
            {
                id: 11, lap: 108, stage: 3, involved: ["24", "47"], primaryCar: "24", category: "penalty",
                title: "Late-Race Side Collision Wreck",
                summary: "Car 24 came up the track into car 47, triggering a major crash with 2 laps remaining.",
                ruling: "End of Line (EOL) Penalty (#24)", location: "Turn 3 & 4",
                trackCoords: { x: 130, y: 260 },
                audioTranscript: "[RADIO 47] '24 came straight up into my door!' -> Race Control: EOL car 24."
            }
        ]
    }
};


