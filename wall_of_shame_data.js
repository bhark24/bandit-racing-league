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
            carNumber: "18",
            driverName: "Car #18 (Victor Weaver)",
            title: "Wall of Shame MVP",
            reason: "Decision to Suspend Upheld: Post-Yellow Intentional Wrecking! #18 Disqualified, Suspended 1-Wk, 3-Wk Probation & EOL Start. Dylan McDonald (#9) Penalty Rescinded on Appeal.",
            totalIncidents: 1,
            totalPenalties: "DISQUALIFICATION + 1-Wk Suspension + 3-Wk Probation"
        },
        drivers: [
            { number: "18", name: "Driver #18 (Victor Weaver)", score: 100, level: "CRITICAL", badge: "DISQUALIFIED / 1-Wk Suspension (Upheld)", incidentsCount: 2, colors: ["#ff0055", "#111"] },
            { number: "36", name: "Driver #36 (Adam Tahan)", score: 75, level: "HIGH", badge: "Apron Chop / Turn Self (EOL)", incidentsCount: 2, colors: ["#ffaa00", "#111"] },
            { number: "14", name: "Driver #14 (Jason Allegrini)", score: 70, level: "HIGH", badge: "Wall Squeeze (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "24", name: "Driver #24", score: 70, level: "HIGH", badge: "Side-Swipe Crash (EOL)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "62", name: "Driver #62 (Ty Corino)", score: 45, level: "MEDIUM", badge: "Restart Line Warning", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "22", name: "Driver #22 (Joshua Adams)", score: 30, level: "LOW", badge: "Stage Finish Contact", incidentsCount: 1, colors: ["#3498db", "#111"] },
            { number: "9",  name: "Driver #9 (Dylan McDonald)", score: 0, level: "CLEARED", badge: "Penalty Rescinded on Appeal", incidentsCount: 0, colors: ["#00ff00", "#111"] },
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
                id: 9, lap: 96, stage: 3, involved: ["9", "18"], primaryCar: "18", category: "mvp",
                title: "DISQUALIFICATION & SUSPENSION UPHELD: Post-Yellow Intentional Wrecking",
                summary: "Under caution, car 18 drove straight into traffic after hooking car 9. Stewards upheld the 1-week suspension and disqualification for Car 18. Dylan McDonald (Car 9) penalty was rescinded on official appeal after telemetry review.",
                ruling: "CAR #18 SUSPENSION UPHELD: Disqualified + 1-Wk Suspension + 3-Wk Probation + EOL Start. CAR #9 PENALTY RESCINDED ON APPEAL: Cleared of all penalties.", location: "Back Stretch / Caution",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Official Appeal Ruling: Car 18 suspension is UPHELD for intentional wrecking! Car 9 (Dylan McDonald) penalty is RESCINDED on appeal — all penalties removed and cleared!'"
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
    },
    watkins_glen: {
        id: "watkins_glen",
        title: "Watkins Glen International",
        subtext: "The Glen Road Course Showdown — 45 Laps",
        laps: 45,
        trackType: "road_course",
        stages: [
            { name: "Stage 1", lap: 15 },
            { name: "Stage 2", lap: 30 },
            { name: "Final Stage", lap: 45 }
        ],
        mvp: {
            carNumber: "31",
            driverName: "Car #31 (Connor Gibson)",
            title: "Wall of Shame MVP — Great White North PC Meltdown 🇨🇦🖥️",
            reason: "PC system crashed as the green flag dropped! Classic Canadian dial-up & freezing router meltdown at Lap 1. Crowned Wall of Shame MVP for total PC system failure before Turn 1!",
            totalIncidents: "PC Crash / Hardware Melt",
            totalPenalties: "DNS / Canadian Dial-Up Penalty",
            image: "assets/truck images/truck_image_connor_gibson.png"
        },
        drivers: [
            { number: "31", name: "Driver #31 (Connor Gibson)", score: 100, level: "CRITICAL", badge: "MVP / Canadian PC Meltdown 🍁🖥️", incidentsCount: 8, colors: ["#ff0055", "#111"], image: "assets/truck images/truck_image_connor_gibson.png" },
            { number: "54", name: "Driver #54 (Matthew Bailey)", score: 95, level: "CRITICAL", badge: "19 Incidents / Destruction Derby", incidentsCount: 19, colors: ["#ff0055", "#111"] },
            { number: "6", name: "Driver #6 (Nicole Kriesel)", score: 90, level: "CRITICAL", badge: "18 Incidents / Chicane Lawn Mowing", incidentsCount: 18, colors: ["#ff5500", "#111"] },
            { number: "37", name: "Driver #37 (Chad Hartle)", score: 80, level: "HIGH", badge: "13 Incidents / Bus Stop Assault", incidentsCount: 13, colors: ["#ff5500", "#111"] },
            { number: "50", name: "Driver #50 (Davis Carroll)", score: 80, level: "HIGH", badge: "13 Incidents / Off-Track Excursions", incidentsCount: 13, colors: ["#ffaa00", "#111"] },
            { number: "22", name: "Driver #22 (Joshua Adams)", score: 75, level: "HIGH", badge: "12 Incidents / Apex Misses", incidentsCount: 12, colors: ["#ffaa00", "#111"] },
            { number: "99", name: "Driver #99 (Joshua Billiter)", score: 70, level: "MEDIUM", badge: "11 Incidents / Barrier Kiss", incidentsCount: 11, colors: ["#e67e22", "#111"] },
            { number: "4", name: "Driver #4 (Logan Murray)", score: 65, level: "MEDIUM", badge: "10 Incidents / Off-Track Limits", incidentsCount: 10, colors: ["#e67e22", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 1, stage: 1, involved: ["31"], primaryCar: "31", category: "mvp",
                title: "GREAT WHITE NORTH RIG MELTDOWN: Connor Gibson (#31) PC Blue-Screens At Green Flag!",
                summary: "As the green flag dropped at Watkins Glen, Connor Gibson's rig experienced an immediate, catastrophic PC crash. Stewards confirmed: 'Classic Canadian dial-up router freezing up in the snowbank.' Connor Gibson (#31) takes home the Wall of Shame MVP crown!",
                ruling: "WALL OF SHAME MVP: System Failure / Canadian Rig Crash", location: "Front Stretch / Green Flag",
                trackCoords: { x: 450, y: 330 },
                audioTranscript: "[RADIO #31] 'Guys my PC just froze... absolute blue screen! It's freezing up here in Canada eh!' -> RACE CONTROL: 'Connor Gibson #31 Wall of Shame MVP!'"
            },
            {
                id: 2, lap: 12, stage: 1, involved: ["54", "6"], primaryCar: "54", category: "penalty",
                title: "Bus Stop Chicane Lawn Mowing & Heavy Contact",
                summary: "Car 54 (Matthew Bailey - 19 Incidents) and Car 6 (Nicole Kriesel - 18 Incidents) engaged in a wild battle through the Bus Stop chicane, racking up 37 total incident points between off-track turf cuts and barrier slashes.",
                ruling: "Incidents Recorded / High Incident Count Warning", location: "The Bus Stop Chicane",
                trackCoords: { x: 150, y: 80 },
                audioTranscript: "[STEWARDS] 'Car 54 and 6 mowing the lawn through the Bus Stop! 19 and 18 incident points logged.'"
            },
            {
                id: 3, lap: 28, stage: 2, involved: ["37", "50"], primaryCar: "37", category: "warning",
                title: "Carousel Corner Side Contact & Off-Track Excursions",
                summary: "Car 37 (Chad Hartle - 13 Inc) and Car 50 (Davis Carroll - 13 Inc) traded paint through the Carousel, both drivers accumulating 13 incident points each on gravel traps.",
                ruling: "Official Incident Warning (13 Incidents Each)", location: "The Carousel",
                trackCoords: { x: 370, y: 110 },
                audioTranscript: "[STEWARDS] 'Car 37 and 50 side contact in the Carousel. 13 incident points total for both trucks.'"
            },
            {
                id: 4, lap: 41, stage: 3, involved: ["22", "99"], primaryCar: "22", category: "racing_deal",
                title: "Late-Race Elevation Drop Barrier Contact",
                summary: "Car 22 (Joshua Adams - 12 Inc) and Car 99 (Joshua Billiter - 11 Inc) checked up down the downhill sweeps, resulting in barrier contact.",
                ruling: "Racing Deal / High Incident Audit", location: "The Chute & Downhill Sweeps",
                trackCoords: { x: 280, y: 250 },
                audioTranscript: "[STEWARDS] 'Car 22 and 99 side contact on downhill section. Racing deal, heavy incident tally.'"
            }
        ]
    },

    phoenix: {
        id: "phoenix",
        title: "Phoenix Raceway",
        subtext: "Desert Showdown — 135 Laps",
        laps: 135,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 42 },
            { name: "Stage 2", lap: 84 },
            { name: "Final Stage", lap: 135 }
        ],
        mvp: {
            carNumber: "36",
            driverName: "Car #36 (Korey Denson)",
            title: "Wall of Shame MVP — Intentional Wreck & Incident Spree 💥🏁",
            reason: "Flagrant intentional wreck into Car #62 (Ty Corino), Lap 131 solo spin caution, and Lap 135 accordion crash into #31 & #63. Crowned Wall of Shame MVP for unsportsmanlike retaliation!",
            totalIncidents: 3,
            totalPenalties: "Confirmed Intentional Wrecking Penalty + EOL",
            image: "assets/BCast Banners/phoenix_s16.png"
        },
        drivers: [
            { number: "36", name: "Driver #36 (Korey Denson)", score: 100, level: "CRITICAL", badge: "MVP / Intentional Wreck into #62", incidentsCount: 3, colors: ["#ff0055", "#111"] },
            { number: "54", name: "Driver #54 (Matthew Bailey)", score: 90, level: "CRITICAL", badge: "Drive-Through (Probation Violation)", incidentsCount: 1, colors: ["#ff0055", "#111"] },
            { number: "69", name: "Driver #69 (Collin Anderson)", score: 80, level: "HIGH", badge: "EOL (Illegal Restart Lane Change)", incidentsCount: 1, colors: ["#ff5500", "#111"] },
            { number: "99", name: "Driver #99 (Joshua Billiter)", score: 75, level: "HIGH", badge: "EOL (Wheelspin Solo Spin)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "01", name: "Driver #01 (Adam Tahan)", score: 75, level: "HIGH", badge: "EOL (Blinking Contact into #21)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "2", name: "Driver #2 (Nick Nickerson)", score: 70, level: "HIGH", badge: "EOL (Loose Slide into #36)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "31", name: "Driver #31 (Connor Gibson)", score: 70, level: "HIGH", badge: "EOL (Stage 2 Ender into #13)", incidentsCount: 2, colors: ["#e67e22", "#111"] },
            { number: "93", name: "Driver #93 (Scott Sanderson)", score: 60, level: "MEDIUM", badge: "Official Warning (Post-Race Door Slam)", incidentsCount: 1, colors: ["#3498db", "#111"] },
            { number: "5", name: "Driver #5 (Sean Britt)", score: 55, level: "MEDIUM", badge: "Chat Conduct Warning & Rage Quit", incidentsCount: 1, colors: ["#3498db", "#111"] },
            { number: "18", name: "Driver #18 (Victor Weaver)", score: 40, level: "LOW", badge: "Penalty Served (EOL 1 of 3)", incidentsCount: 0, colors: ["#2ecc71", "#111"] },
            { number: "63", name: "Driver #63 (Tre Ellis)", score: 30, LOW: "LOW", badge: "Cleared (Black Flag Rescinded)", incidentsCount: 0, colors: ["#2ecc71", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 1, stage: 1, involved: ["22", "6"], primaryCar: "22", category: "racing_deal",
                title: "Lap 1 Opening Turn Pinch",
                summary: "Contact between Car 22 (Joshua Adams) and Car 6 (Nicole Kriesel). Car 22 came down after an aggressive 3-wide move before the line while Car 6 did not descend as far as anticipated. Both cars running at the tail of the field; deemed early-race racing deal.",
                ruling: "Racing Deal (Opening Lap Real Estate)", location: "Turn 1 Entry",
                trackCoords: { x: 670, y: 160 },
                audioTranscript: "[STEWARDS] 'Lap 1 contact at the tail of the pack between 22 and 6. 3-wide into 1. Racing deal.'"
            },
            {
                id: 2, lap: 28, stage: 1, involved: ["5", "38"], primaryCar: "5", category: "warning",
                title: "Mid-Track Contact & Chat Rage Quit",
                summary: "Car 5 (Sean Britt) and Car 38 (Peter Murphy) made contact, meeting in the middle. Following contact, Car 5 dropped profanity in in-game text chat ('fuck you peter') before abruptly quitting the session.",
                ruling: "Racing Deal (Contact) / Official Warning (Chat Conduct & Rage Quit)", location: "Turn 4 Exit",
                trackCoords: { x: 220, y: 80 },
                audioTranscript: "[CHAT LOG] Car 5: 'fuck you peter' -> Car 5 disconnected -> [STEWARDS] 'Official warning for chat conduct.'"
            },
            {
                id: 3, lap: 33, stage: 1, involved: ["54", "36"], primaryCar: "54", category: "penalty",
                title: "Car 54 Overdrives Turn 1 & Runs Over Car 36",
                summary: "Car 54 (Matthew Bailey) completely ran over Car 36 (Korey Denson) into Turn 1. No caution flew, but Car 54 was 100% at fault. Because Car 54 is on probation/watch without improvement, stewards assessed an escalated Drive-Through.",
                ruling: "Drive-Through Penalty (Probation Escalation)", location: "Turn 1",
                trackCoords: { x: 670, y: 160 },
                audioTranscript: "[RACE CONTROL] 'Car 54 ran the 36 over in Turn 1. Driver on probation with no improvement: Drive-Through Penalty car 54.'"
            },
            {
                id: 4, lap: 42, stage: 1, involved: ["ALL"], primaryCar: "7", category: "stage_finish",
                title: "Stage 1 Conclusion (Stage Yellow)",
                summary: "Stage 1 concludes on Lap 42 under scheduled yellow flag conditions.",
                ruling: "Official Stage Yellow", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Yellow flag, yellow flag! Stage 1 complete on Lap 42.'"
            },
            {
                id: 5, lap: 48, stage: 2, involved: ["69", "8", "13", "38"], primaryCar: "69", category: "penalty",
                title: "Illegal Restart Lane Change & Nose Chop",
                summary: "Car 69 (Collin Anderson) made an illegal lane change before the start/finish line and chopped down across the nose of Car 8 (Kevin Foster). Resulted in heavy ARCA braking stack-up behind involving Car 13 and Car 38.",
                ruling: "End of Line (EOL) Penalty (#69)", location: "Front Stretch / Turn 1",
                trackCoords: { x: 500, y: 330 },
                audioTranscript: "[STEWARDS] '69 changed lanes before the line and chopped the 8 nose. Stack-up behind. EOL penalty car 69.'"
            },
            {
                id: 6, lap: 56, stage: 2, involved: ["63"], primaryCar: "63", category: "racing_deal",
                title: "Black Flag Rescinded for Car 63",
                summary: "Race Control cleared and rescinded the black flag penalty assessed to Car 63 (Tre Ellis).",
                ruling: "Black Flag Cleared / Rescinded", location: "Pit Road",
                trackCoords: { x: 400, y: 290 },
                audioTranscript: "[RACE CONTROL] 'Clearing the black flag for Car 63 on lap 56. Good to go.'"
            },
            {
                id: 7, lap: 62, stage: 2, involved: ["22", "93", "38"], primaryCar: "22", category: "racing_deal",
                title: "Three-Wide Pinch Entering Corner",
                summary: "Car 22 (Joshua Adams) made a move to get under Car 93 (Scott Sanderson). The door closed as Car 38 arrived on the outside, pinching the 22.",
                ruling: "Racing Deal (Pinched)", location: "Turn 3 Entry",
                trackCoords: { x: 130, y: 260 },
                audioTranscript: "[STEWARDS] '22 tried to dive under 93, 38 filled the hole, 22 got pinched. Racing deal.'"
            },
            {
                id: 8, lap: 66, stage: 2, involved: ["99", "2"], primaryCar: "99", category: "penalty",
                title: "Claimed Wheelspin Solo Spin Caution",
                summary: "Car 99 (Joshua Billiter) claimed the yellow flag after losing control on claimed wheelspin, leaving Car 2 (Nick Nickerson) with nowhere to go.",
                ruling: "End of Line (EOL) Penalty (#99)", location: "Turn 2 Exit",
                trackCoords: { x: 650, y: 270 },
                audioTranscript: "[RACE CONTROL] 'Car 99 claiming the yellow on wheelspin. Car 2 had nowhere to go. EOL car 99.'"
            },
            {
                id: 9, lap: 73, stage: 2, involved: ["2", "36"], primaryCar: "2", category: "penalty",
                title: "Car 2 Slides Up Into Car 36",
                summary: "Car 2 (Nick Nickerson) got loose in the corner and slid up the track into Car 36 (Korey Denson).",
                ruling: "End of Line (EOL) Penalty (#2)", location: "Turn 4",
                trackCoords: { x: 160, y: 120 },
                audioTranscript: "[STEWARDS] 'Car 2 got loose and washed up into the 36. EOL penalty car 2.'"
            },
            {
                id: 10, lap: 77, stage: 2, involved: ["01", "21"], primaryCar: "01", category: "penalty",
                title: "Blinking Interference Turns Car 21",
                summary: "Car 01 (Adam Tahan) started blinking heavily and completely disappeared from server telemetry, turning Car 21 (Nathan Santos) while invisible.",
                ruling: "End of Line (EOL) Penalty (#01)", location: "Turn 1",
                trackCoords: { x: 670, y: 180 },
                audioTranscript: "[RADIO 21] '01 was blinking and completely vanished, then wrecked me!' -> RACE CONTROL: 'EOL car 01.'"
            },
            {
                id: 11, lap: 83, stage: 2, involved: ["31", "13"], primaryCar: "31", category: "penalty",
                title: "Stage 2 Ender: Car 31 Spins Car 13",
                summary: "Coming to the Stage 2 green-checkered finish, Car 31 (Connor Gibson) slid up slightly into Car 13 (Johnathon Platt) and sent him around, ending the stage under yellow.",
                ruling: "End of Line (EOL) Penalty (#31)", location: "Turn 3 & 4",
                trackCoords: { x: 130, y: 260 },
                audioTranscript: "[RACE CONTROL] 'Stage ender! Car 31 slid up into 13 and turned him. Stage 2 yellow is out, EOL penalty car 31.'"
            },
            {
                id: 12, lap: 125, stage: 3, involved: ["31", "14"], primaryCar: "31", category: "racing_deal",
                title: "Mid-Corner Real Estate Contest",
                summary: "Car 31 (Connor Gibson) turned into the corner while Car 14 (Jason Allegrini) entered the middle; both went for the identical patch of track.",
                ruling: "Racing Deal (Contested Space)", location: "Turn 1 Entry",
                trackCoords: { x: 610, y: 320 },
                audioTranscript: "[STEWARDS] '31 turned in, 14 entered middle, went for same spot. Racing deal.'"
            },
            {
                id: 13, lap: 131, stage: 3, involved: ["36", "7"], primaryCar: "36", category: "penalty",
                title: "Unforced Solo Spin Caution",
                summary: "Car 36 (Korey Denson) got loose solo with no contact from Car 7 (Benjamin Lacy) and spun around, triggering a full-course yellow.",
                ruling: "End of Line (EOL) Penalty (#36)", location: "Turn 2",
                trackCoords: { x: 650, y: 270 },
                audioTranscript: "[RACE CONTROL] 'Car 36 lost it solo off Turn 2. No contact from the 7. Yellow is out. EOL penalty car 36.'"
            },
            {
                id: 14, lap: 135, stage: 3, involved: ["36", "31", "12", "63"], primaryCar: "36", category: "penalty",
                title: "Rear-End Check-Up Pileup",
                summary: "Car 31 touched Car 12 which checked him up. Car 36 tried to force a run and rammed the 31, sending #31 into Car 63 and around. Initially racing deal live; post-race review confirms 36 at fault.",
                ruling: "At-Fault Incident (Should have been EOL car 36)", location: "Turn 3",
                trackCoords: { x: 130, y: 260 },
                audioTranscript: "[STEWARDS REVIEW] '31 checked up behind 12, 36 just rammed him into 63. Deemed at-fault incident on car 36.'"
            },
            {
                id: 15, lap: 136, stage: 3, involved: ["36", "62"], primaryCar: "36", category: "mvp",
                title: "RETALIATION & INTENTIONAL WRECK: Car 36 Wrecks Car 62",
                summary: "Car 36 (Korey Denson) intentionally wrecked into Car 62 (Ty Corino). Direct retaliation and flagrant breach of league regulations. Confirmed Intentional Wrecking Penalty.",
                ruling: "CONFIRMED INTENTIONAL WRECKING PENALTY (#36)", location: "Front Stretch",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Confirmed intentional wreck by Car 36 into the 62. Disciplinary action confirmed. Wall of Shame MVP.'"
            },
            {
                id: 16, lap: 137, stage: 3, involved: ["93", "91"], primaryCar: "93", category: "warning",
                title: "Post-Race Frustration Door Slam",
                summary: "On the cool-down lap, Car 93 (Scott Sanderson) doored Car 91 (Brandon Jackson) showing frustration for an earlier incident. Car 91 barely caught it.",
                ruling: "Official Warning Issued (#93)", location: "Cool-Down Lap / Backstretch",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Car 93 doored 91 on the cool down lap. Official warning issued to car 93 for post-race contact.'"
            }
        ]
    },

    martinsville: {
        id: "martinsville",
        title: "Martinsville Speedway",
        subtext: "The Paperclip Chaos Showdown — 190 Laps (Stages @ 57 & 114)",
        laps: 190,
        trackType: "gateway_oval",
        stages: [
            { name: "Stage 1", lap: 57 },
            { name: "Stage 2", lap: 114 },
            { name: "Final Stage", lap: 190 }
        ],
        mvp: {
            carNumber: "69",
            driverName: "Car #69 (Collin Anderson) & Full Field",
            title: "Wall of Shame MVP — Paperclip Brake-Check & 3x EOL Spree 🛑💥",
            reason: "Assessed 3 separate EOL penalties (Laps 44, 64, 97), slammed on brakes on the active racing surface after an EOL call (collecting #6 Nicole Kriesel), brake-checked #54 under caution on Lap 76, and ARCA-braked on Lap 186! Plus a League-Wide Caution Warning issued to the entire field!",
            totalIncidents: 6,
            totalPenalties: "3x EOL Penalties + Final Session Removal Warning (Brake-Checking)",
            image: "assets/tracks/Track Logos/Martinsville.jpg"
        },
        drivers: [
            { number: "69", name: "Driver #69 (Collin Anderson)", score: 100, level: "CRITICAL", badge: "MVP / 3x EOL + Brake-Checking", incidentsCount: 6, colors: ["#ff0055", "#111"] },
            { number: "36", name: "Driver #36 (Korey Denson)", score: 92, level: "CRITICAL", badge: "Drive-Thru (15-Lap Rule) + VC Warning", incidentsCount: 3, colors: ["#ff0055", "#111"] },
            { number: "12", name: "Driver #12 (Bill Harkins)", score: 85, level: "HIGH", badge: "2x EOL Penalties (L110 & L186)", incidentsCount: 5, colors: ["#ff5500", "#111"] },
            { number: "31", name: "Driver #31 (Connor Gibson)", score: 75, level: "HIGH", badge: "EOL (Stage 1 Ender on #15)", incidentsCount: 2, colors: ["#ffaa00", "#111"] },
            { number: "9",  name: "Driver #9 (Dylan McDonald)", score: 72, level: "HIGH", badge: "EOL (Lap 68 Dive on #12)", incidentsCount: 2, colors: ["#ffaa00", "#111"] },
            { number: "7",  name: "Driver #7 (Benjamin Lacy)", score: 70, level: "HIGH", badge: "Post-Race Admin EOL (#15 Checkup)", incidentsCount: 1, colors: ["#ffaa00", "#111"] },
            { number: "15", name: "Driver #15 (Matt Crockett)", score: 70, level: "HIGH", badge: "EOL (Lap 133 Punt on #24)", incidentsCount: 3, colors: ["#ffaa00", "#111"] },
            { number: "62", name: "Driver #62 (Ty Corino)", score: 68, level: "HIGH", badge: "EOL (Lap 117 Hot Entry on #50)", incidentsCount: 1, colors: ["#e67e22", "#111"] },
            { number: "54", name: "Driver #54 (Matthew Bailey)", score: 65, level: "MEDIUM", badge: "EOL (Lap 169 Curb Self-Spin)", incidentsCount: 3, colors: ["#e67e22", "#111"] },
            { number: "4",  name: "Driver #4 (Logan Murray)", score: 62, level: "MEDIUM", badge: "EOL (Lap 181 Restart Spin)", incidentsCount: 2, colors: ["#e67e22", "#111"] },
            { number: "1",  name: "Driver #1 (Ricky Hart Jr)", score: 50, level: "MEDIUM", badge: "Lap 186 ARCA Brakes Note", incidentsCount: 1, colors: ["#3498db", "#111"] },
            { number: "18", name: "Driver #18 (Victor Weaver)", score: 35, level: "LOW", badge: "Served EOL 2 of 3", incidentsCount: 1, colors: ["#2ecc71", "#111"] }
        ],
        incidents: [
            {
                id: 1, lap: 1, stage: 1, involved: ["18", "36"], primaryCar: "18", category: "racing_deal",
                title: "Pre-Race Probation & EOL Penalties Served (#18 & #36)",
                summary: "Cars #18 (Victor Weaver) and #36 (Korey Denson) dropped to the rear at the start to serve scheduled EOL penalties. This marked Car #18's 2nd EOL of 3 and Car #36's 1st EOL of 3.",
                ruling: "Probation EOL Penalties Served (#18: 2 of 3 | #36: 1 of 3)", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Cars 18 and 36 serving pre-race EOL penalties at the tail of the field. 18 on 2 of 3, 36 on 1 of 3.'"
            },
            {
                id: 2, lap: 2, stage: 1, involved: ["12", "82", "63"], primaryCar: "12", category: "racing_deal",
                title: "Lap 2 Curb Check-Up & Accordion Spin",
                summary: "Car #12 (Bill Harkins) checked up to avoid hitting Car #82 (Paul Wilson) and clipped the inside curbing. Car #63 (Tre Ellis) had zero time to react behind and turned Car #12.",
                ruling: "Racing Deal (No Reaction Time)", location: "Turn 2",
                trackCoords: { x: 650, y: 260 },
                audioTranscript: "[STEWARDS] '12 checked up for 82 and hit the curb, 63 had nowhere to go. Racing deal.'"
            },
            {
                id: 3, lap: 11, stage: 1, involved: ["36"], primaryCar: "36", category: "penalty",
                title: "Turn 4 Unforced Self-Spin (15-Lap Rule Drive-Through)",
                summary: "Car #36 (Korey Denson) self-spun coming out of Turn 4 on Lap 11. Under the league's opening 15-lap caution rule, an automatic Drive-Through penalty was assessed.",
                ruling: "Drive-Through Penalty (#36 — 15-Lap Rule)", location: "Turn 4 Exit",
                trackCoords: { x: 220, y: 80 },
                audioTranscript: "[RACE CONTROL] 'Car 36 solo spin off Turn 4 inside the first 15 laps. Drive-Through penalty on the 36.'"
            },
            {
                id: 4, lap: 21, stage: 1, involved: ["18", "12"], primaryCar: "12", category: "racing_deal",
                title: "Bottom-Groove Heavy Braking Check-Up",
                summary: "Car #18 (Victor Weaver) struggled to hold the bottom groove and got on the brakes harder than Car #12 (Bill Harkins) anticipated. Car #12 ran out of talent trying to check up with no time to react and turned the #18.",
                ruling: "Racing Deal (Unexpected Braking Check-Up)", location: "Turn 1 & 2",
                trackCoords: { x: 670, y: 180 },
                audioTranscript: "[STEWARDS] '18 hit the binders hard trying to hold the bottom, 12 had no time to react. Racing deal.'"
            },
            {
                id: 5, lap: 33, stage: 1, involved: ["22", "9"], primaryCar: "22", category: "racing_deal",
                title: "Late Bumper Tag Turns Car 9",
                summary: "Car #22 (Joshua L. Adams) got to the bumper of Car #9 (Dylan McDonald) late entering the corner and turned him around.",
                ruling: "Racing Deal", location: "Turn 3",
                trackCoords: { x: 140, y: 240 },
                audioTranscript: "[STEWARDS] '22 got to the rear of the 9 late into the corner. Deemed a racing deal.'"
            },
            {
                id: 6, lap: 39, stage: 1, involved: ["ALL"], primaryCar: "ALL", category: "racing_deal",
                title: "Turn 1 Outside Lane Restart Accordion Pileup",
                summary: "On the restart, the outside lane checked up entering Turn 1 and the accordion effect cascaded rapidly through the pack.",
                ruling: "Racing Deal (Multi-Car Restart Stackup)", location: "Turn 1 Entry",
                trackCoords: { x: 610, y: 320 },
                audioTranscript: "[RACE CONTROL] 'Huge accordion stackup on the outside line into Turn 1! Racing deal.'"
            },
            {
                id: 7, lap: 44, stage: 1, involved: ["69", "4"], primaryCar: "69", category: "penalty",
                title: "Inside Lane Dive Into Occupied Space (Admin Review Confirmed)",
                summary: "Car #69 (Collin Anderson) tried to force his way to the bottom groove when Car #4 (Logan Murray) was already occupying the lane. Car #69 requested a review; Admins audited the replay and confirmed the EOL on #69 was 100% the correct call.",
                ruling: "End of Line (EOL) Penalty (#69 — Upheld on Admin Review)", location: "Turn 3",
                trackCoords: { x: 130, y: 260 },
                audioTranscript: "[ADMIN REVIEW] 'Car 69 requested review on Lap 44. Car 4 was clearly there on the bottom. EOL on 69 confirmed.'"
            },
            {
                id: 8, lap: 57, stage: 1, involved: ["31", "15"], primaryCar: "31", category: "penalty",
                title: "Stage 1 Ender: Late Dive Into Closing Gap",
                summary: "Coming to the end of Stage 1, Car #31 (Connor Gibson) made a late move into a rapidly closing gap and collided with Car #15 (Matt Crockett), ending Stage 1 early under caution.",
                ruling: "End of Line (EOL) Penalty (#31 — Stage 1 Ended Early)", location: "Turn 3 & 4",
                trackCoords: { x: 150, y: 150 },
                audioTranscript: "[RACE CONTROL] '31 tried to force a closing gap on the 15. Stage 1 ends under yellow. EOL penalty car 31.'"
            },
            {
                id: 9, lap: 64, stage: 2, involved: ["69", "31", "6"], primaryCar: "69", category: "mvp",
                title: "Right-Hook on #31 & Stopping Dead on Active Track in Front of #6!",
                summary: "Car #69 (Collin Anderson) came down a hair and right-hooked Car #31 (Connor Gibson) to draw an EOL penalty. Immediately after being issued the EOL, Car #69 slammed on the brakes and stopped dead on the active racing surface, leaving Car #6 (Nicole Kriesel) with nowhere to go! Race Control Directive: NEVER stop dead on an active track when given a penalty — blend to the apron/bottom and maintain a safe slow pace.",
                ruling: "End of Line (EOL) Penalty (#69) + Severe Track Safety Directive", location: "Back Stretch / Turn 3",
                trackCoords: { x: 400, y: 70 },
                audioTranscript: "[RACE CONTROL] 'EOL on 69 for right-hooking 31! And 69 just slammed on his brakes dead on the track in front of the 6! Never stop on an active track!'"
            },
            {
                id: 10, lap: 68, stage: 2, involved: ["9", "12"], primaryCar: "9", category: "penalty",
                title: "Hot Turn 3 Entry Contact on Car 12",
                summary: "Car #9 (Dylan McDonald) drove into Turn 3 way too hot and plowed into Car #12 (Bill Harkins).",
                ruling: "End of Line (EOL) Penalty (#9)", location: "Turn 3 Entry",
                trackCoords: { x: 200, y: 70 },
                audioTranscript: "[RACE CONTROL] 'Car 9 went into Turn 3 hot and hit the 12. EOL penalty car 9.'"
            },
            {
                id: 11, lap: 76, stage: 2, involved: ["36", "28", "69", "54"], primaryCar: "69", category: "warning",
                title: "Late Block Check-Up & Caution Flag Brake-Check by Car #69 on #54!",
                summary: "Car #36 (Korey Denson) got into the back of Car #28 (Joey Cruz) after #28 made a late defensive move to cover him off and immediately started braking (deemed Racing Deal). Under the ensuing caution flag, Car #69 (Collin Anderson) appeared to intentionally brake-check Car #54 (Matthew Bailey)!",
                ruling: "Racing Deal (#36/#28) | FINAL WARNING (#69): Next Pace-Lap Brake-Check = Parked / Removed from Session", location: "Front Stretch / Caution",
                trackCoords: { x: 450, y: 330 },
                audioTranscript: "[RACE CONTROL] '36 and 28 is a racing deal on a late block. Car 69: do NOT brake-check the 54 under yellow! One more stunt like that and you are removed from the session!'"
            },
            {
                id: 12, lap: 84, stage: 2, involved: ["7", "15"], primaryCar: "7", category: "penalty",
                title: "Outside Line Check-Up Punt (Post-Race Admin Review: Should Be EOL #7)",
                summary: "A check-up on the outside lane resulted in Car #15 (Matt Crockett) getting hit and spun by Car #7 (Benjamin Lacy). Originally called a racing deal live, post-race Admin audit confirmed this should have been an EOL penalty on Car #7.",
                ruling: "Post-Race Admin Audit: Confirmed At-Fault EOL on Car #7 (Called Racing Deal Live)", location: "Turn 1",
                trackCoords: { x: 670, y: 160 },
                audioTranscript: "[ADMIN AUDIT] 'Reviewed Lap 84 outside check-up between 7 and 15 post-race. Admins confirmed this should have been an EOL penalty on Car 7.'"
            },
            {
                id: 13, lap: 97, stage: 2, involved: ["69", "28", "36", "31"], primaryCar: "69", category: "warning",
                title: "Car #69 3rd EOL (Dumps #28) + Car #36 Voice Chat Conduct Warning!",
                summary: "Car #69 (Collin Anderson) ran into Car #28 (Joey Cruz), shoved him up the banking, and then hooked his left-rear to spin him out (69's 3rd EOL of the night!). Under caution, Car #36 (Korey Denson) snapped on voice chat at Car #31 (Connor Gibson), saying 'we don't like questions here' and 'why don't you learn how to drive before you open your mouth.'",
                ruling: "EOL Penalty (#69) + Official Verbal Warning (#36 — Next VC Violation = Voice Chat Mute)", location: "Turn 2",
                trackCoords: { x: 620, y: 280 },
                audioTranscript: "[RADIO #36] 'Why don't you learn how to drive before you open your mouth!' -> [RACE CONTROL] 'EOL on 69! And 36, consider this your verbal warning—repeat that conduct and your voice chat is gone!'"
            },
            {
                id: 14, lap: 110, stage: 2, involved: ["12", "50"], primaryCar: "12", category: "penalty",
                title: "Turn 3 Drift-Up Contact Into Car 50",
                summary: "Car #12 (Bill Harkins) drifted up the track into Car #50 (Davis Carroll), making heavy contact entering Turn 3 while contesting the same real estate.",
                ruling: "End of Line (EOL) Penalty (#12)", location: "Turn 3 Entry",
                trackCoords: { x: 180, y: 80 },
                audioTranscript: "[RACE CONTROL] 'Car 12 drifted up into the 50 entering Turn 3. EOL penalty car 12.'"
            },
            {
                id: 15, lap: 114, stage: 2, involved: ["ALL"], primaryCar: "STAGE", category: "stage_finish",
                title: "Stage 2 Official Finish",
                summary: "Stage 2 concludes at Lap 114.",
                ruling: "Stage 2 Complete", location: "Start / Finish Line",
                trackCoords: { x: 400, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Stage 2 complete at Lap 114! Standings locked for Stage 2.'"
            },
            {
                id: 16, lap: 117, stage: 3, involved: ["62", "50"], primaryCar: "62", category: "penalty",
                title: "Overdriven Turn 1 Entry Into Car 50",
                summary: "Car #62 (Ty Corino) sailed into Turn 1 way too hot after the restart and clobbered Car #50 (Davis Carroll).",
                ruling: "End of Line (EOL) Penalty (#62)", location: "Turn 1",
                trackCoords: { x: 670, y: 150 },
                audioTranscript: "[RACE CONTROL] 'Car 62 went into Turn 1 hot and hit the 50. EOL penalty car 62.'"
            },
            {
                id: 17, lap: 124, stage: 3, involved: ["8", "63"], primaryCar: "8", category: "racing_deal",
                title: "Corner Exit Converge Between #8 & #63",
                summary: "Car #8 (Kevin Foster) and Car #63 (Tre Ellis) made contact on corner exit; Car #8 was coming down slightly while Car #63 was tracking out of the corner, meeting in the middle.",
                ruling: "Racing Deal (Met in the Middle)", location: "Turn 2 Exit",
                trackCoords: { x: 560, y: 70 },
                audioTranscript: "[STEWARDS] '8 coming down slightly, 63 exiting corner, met in the middle. Racing deal.'"
            },
            {
                id: 18, lap: 133, stage: 3, involved: ["15", "24"], primaryCar: "15", category: "penalty",
                title: "Rear-End Punt Sends Both #15 & #24 Into Wall",
                summary: "Car #15 (Matt Crockett) drove squarely into the back of Car #24 (Ethan Sikorski), sending both trucks crashing hard into the outside wall.",
                ruling: "End of Line (EOL) Penalty (#15)", location: "Turn 3 & 4",
                trackCoords: { x: 120, y: 220 },
                audioTranscript: "[RACE CONTROL] 'Car 15 got into the back of 24 and sent them both into the fence. EOL penalty car 15.'"
            },
            {
                id: 19, lap: 139, stage: 3, involved: ["28", "54"], primaryCar: "28", category: "racing_deal",
                title: "Lapped Traffic Miscommunication Contact",
                summary: "Car #28 (Joey Cruz) and Car #54 (Matthew Bailey) made contact; Car #54 was trying to yield room to let leaders by while Car #28 thought he was already clear.",
                ruling: "Racing Deal (Clearance Miscommunication)", location: "Turn 4",
                trackCoords: { x: 200, y: 310 },
                audioTranscript: "[STEWARDS] '54 trying to let guys by, 28 thought he was clear. Racing deal.'"
            },
            {
                id: 20, lap: 169, stage: 3, involved: ["54"], primaryCar: "54", category: "penalty",
                title: "Inside Curb Self-Spin While Yielding",
                summary: "While trying to stay out of the leaders' way on the bottom, Car #54 (Matthew Bailey) clipped the inside curb and self-spun to bring out the caution.",
                ruling: "End of Line (EOL) Penalty (#54)", location: "Turn 1 & 2 Curb",
                trackCoords: { x: 640, y: 230 },
                audioTranscript: "[RACE CONTROL] 'Car 54 spun on the inside curb trying to stay out of the way. Caution is out. EOL car 54.'"
            },
            {
                id: 21, lap: 181, stage: 3, involved: ["4"], primaryCar: "4", category: "penalty",
                title: "Late-Race Restart Tire-Spin Caution",
                summary: "On the Lap 181 restart, Car #4 (Logan Murray) lit up the rear tires on the throttle and spun out in front of the pack.",
                ruling: "End of Line (EOL) Penalty (#4)", location: "Front Stretch / Restart Zone",
                trackCoords: { x: 430, y: 330 },
                audioTranscript: "[RACE CONTROL] 'Car 4 spun the tires on the restart and looped it! EOL penalty car 4.'"
            },
            {
                id: 22, lap: 186, stage: 3, involved: ["12", "47", "1", "69"], primaryCar: "12", category: "penalty",
                title: "Wall Pinch on #47 & Double ARCA Brake by #1 & #69!",
                summary: "With 4 laps to go, Car #12 (Bill Harkins) pinched Car #47 (Michael Rakes) hard into the outside wall (12's 2nd EOL of the race). Behind the wreck, both Car #1 (Ricky Hart Jr) and Car #69 (Collin Anderson) failed to slow down and ARCA-braked straight into the scene! Race Control Note: Everyone who participated in this race holds responsibility for the excessive caution count and must clean up their racecraft.",
                ruling: "EOL Penalty (#12) + ARCA Brake Infraction (#1 & #69) + Full-Field Racecraft Warning", location: "Turn 3 & 4 Wall",
                trackCoords: { x: 140, y: 120 },
                audioTranscript: "[RACE CONTROL] '12 pinched 47 into the wall—EOL 12! And massive ARCA brakes by the 1 and 69! Everyone in this field needs to clean up their racecraft before next week!'"
            }
        ]
    }

};
