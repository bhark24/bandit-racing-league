const SOCKET_URL = (window.location.protocol === "http:" || window.location.protocol === "https:") ? (window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + "/ws" : "ws://127.0.0.1:8765/ws";
let socket;
let mockModeState = 0; // 0 = Off, 1 = Driving, 2 = Pit Road

// DOM Elements mapped to UI
const dom = {
    // Top Row
    incidents: document.getElementById('val-incidents'),
    maxIncidents: document.getElementById('val-max-incidents'),
    flagsBox: document.getElementById('flag-display'),
    
    // Middle Row
    trackName: document.getElementById('val-trackName'),
    lap: document.getElementById('val-lap'),
    distance: document.getElementById('val-distance'), 
    trackTemp: document.getElementById('val-trackTemp'),
    airTemp: document.getElementById('val-airTemp'),
    brakeBias: document.getElementById('val-brakeBias'),
    position: document.getElementById('val-position'),
    clock: document.getElementById('val-clock'),
    
    currentLap: document.getElementById('val-current-lap'),
    bestLap: document.getElementById('val-best-lap'),
    lapStint: document.getElementById('lap-stint'),
    prevStint: document.getElementById('prev-stint'),
    tireStint: document.getElementById('val-tire-stint'),
    delta: document.getElementById('val-delta'),
    
    fuelCurrentGal: document.getElementById('fuel-current-gal'),
    fuelMaxGal: document.getElementById('fuel-max-gal'),
    
    // Bottom Row
    relativeList: document.getElementById('relative-list'),
    relRemaining: document.getElementById('val-rel-remaining'),
    leadersList: document.getElementById('leaders-list'),
    
    // NEW Vitals DOM Elements
    gear: document.getElementById('val-gear'),
    speed: document.getElementById('val-speed'),
    rpmBar: document.getElementById('val-rpm-bar'),
    throttle: document.getElementById('val-throttle'),
    throttlePct: document.getElementById('val-throttle-pct'),
    brake: document.getElementById('val-brake'),
    brakePct: document.getElementById('val-brake-pct'),
    waterTemp: document.getElementById('val-waterTemp'),
    oilTemp: document.getElementById('val-oilTemp'),
    rpmVal: document.getElementById('val-rpm'),
    currentStint: document.getElementById('val-current-stint')
};

// Start the real-time clock
setInterval(() => {
    const now = new Date();
    dom.clock.textContent = now.toLocaleTimeString('en-US', { hour12: true });
}, 1000);

// Relative gaps state tracker
let lastGaps = {};
let lastTrends = {};

let currentLanIp = "127.0.0.1";
let qrCodeObj = null;

document.getElementById('btn-qr-connect').addEventListener('click', () => {
    document.getElementById('qr-modal').style.display = 'flex';
    const targetUrl = "http://" + currentLanIp + ":8765/";
    if (!qrCodeObj && window.QRCode) {
        qrCodeObj = new QRCode(document.getElementById("qrcode"), {
            text: targetUrl,
            width: 250,
            height: 250,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } else if (qrCodeObj) {
        qrCodeObj.clear();
        qrCodeObj.makeCode(targetUrl);
    }
});

document.getElementById('btn-close-qr').addEventListener('click', () => {
    document.getElementById('qr-modal').style.display = 'none';
});

function connect() {
    socket = new WebSocket(SOCKET_URL);

    socket.onopen = () => console.log("[WS] Connected to Geezer Bridge");

    socket.onclose = () => {
        console.log("[WS] Disconnected. Reconnecting in 3 seconds...");
        setTimeout(connect, 3000);
    };

    socket.onerror = (err) => console.error("[WS] Socket error", err);

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (mockModeState === 0) {
                processData(data);
            }
        } catch (e) {
            if (dom.trackName) dom.trackName.textContent = "JSON ERROR: " + e.message;
            console.error("Failed to parse message", e);
        }
    };
}

let currentAvgFuel = 0;

// Beep Audio engine
let audioCtx = null;
function beep(freq, duration, vol, type="square") {
    if(!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

document.addEventListener('click', () => {
    if(!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    if(audioCtx.state === 'suspended') { audioCtx.resume(); }
});

let lastPitBeep = 0;
let globalBestLap = 0;
let fuelWarned = false;
let tireWarned = false;
let pitSpeedWarned = false;
let lastIncidentSpoken = 0;

let stintLapTimes = [];
let stintFuelUsage = [];
let stintTireWear = [];
let stintApexSpeeds = [];
let stintLapTraces = [];
let currentLapSamples = [];
let historicalStints = [];
let historicalStintFuel = [];
let historicalStintTires = [];
let historicalStintApexes = [];
let historicalStintTraces = [];
let activeOverlays = new Set();
let currentGraphMode = 'pace';
let paceZoomEnabled = true;
let selectedTraceLapIdx = 0;
let selectedCompareLapIdx = -1;
let traceHoverPct = null;
let lastRecordedLap = -1;
let wasOnPitRoad = false;
let currentRepairsAvail = 1;
let isSpeakingPlan = false;

function getCrewChiefVoice(eventType, data = {}) {
    const personalityEl = document.getElementById('crew-chief-personality');
    const personality = personalityEl ? personalityEl.value : 'off';
    
    const phrases = {
        speeding: {
            raunchy: [
                "What the fuck, you gotta be kidding me, enjoy that penalty driver.",
                "Are you fucking blind? Read the damn dash and slow down!",
                "Get your foot off the fucking gas, you're gonna get us a penalty!",
                "Jesus Christ, did you forget where the brake pedal is? Speeding!",
                "Pull your head out of your ass and slow the fuck down on pit road!"
            ],
            sarcastic: [
                "Hey, the race is out there on the track, not here on pit road. Slow down.",
                "Did you mistake the pit speed limit sign for a suggestion?",
                "I know you're eager to see us, but try not to run us over. Speeding.",
                "If you wanted a drive-through penalty, you could have just asked.",
                "Wow, what a great time to practice qualifying laps... right down pit lane."
            ],
            nice: [
                "Please watch your speed, driver, we don't want to get a penalty.",
                "Careful on the throttle there, buddy, you're just a bit over the limit.",
                "Hey friend, let's ease off the gas, we're speeding on pit road.",
                "Just a friendly heads-up: we need to slow down a little bit in the pit lane.",
                "Take a deep breath and gently ease off the throttle. Let's keep it safe."
            ]
        },
        fuel: {
            raunchy: [
                "Hey Shit for Brains, you're about to run out of fuel!",
                "Get your ass into the pits, the tank is drier than a popcorn fart!",
                "We're running on fucking fumes here! Get in the pits before we're pushing this damn car!",
                "Fuel is critical! Bring it in before you dry-hump the engine to a stop!"
            ],
            sarcastic: [
                "I hate to bring this up, but cars actually require gasoline to move. We have none left.",
                "Your fuel tank is empty. Unless you plan on Fred Flintstone-ing this thing, you should pit.",
                "We're running out of gas. Don't worry, pushing the car builds great character.",
                "Is there a weight-saving strategy I wasn't told about, or did you just forget to fuel up?"
            ],
            nice: [
                "Pitting time is coming up, driver. We are getting low on fuel.",
                "Hey buddy, our fuel is running low. Let's plan to pit soon.",
                "We're going to need to top off the tank pretty soon, let's bring it in.",
                "Great job out there! Let's pit this lap for some fuel, we are running low."
            ]
        },
        incidents: {
            raunchy: [
                `Are you freaking kidding me! ${data.pts} incident points, enjoy that drive thru penalty!`,
                "What the fuck are you doing out there? Quit hitting everything but the lottery!",
                "Keep this up and we're getting disqualified. Keep your shit together and stop wrecking!",
                "Are we trying to set a record for incident points? Get your head out of your ass!"
            ],
            sarcastic: [
                "Great job out there, the wall is definitely feeling very loved today.",
                "I see we're collecting incident points. Is there a prize at the end I don't know about?",
                "If you hit one more thing, I'm going to start charging you for paint by the minute.",
                "Excellent target practice out there. Unfortunately, this is a race, not bumper cars."
            ],
            nice: [
                "Let's keep it clean out there, driver. You're doing great, just stay safe.",
                "Hey friend, we've got a couple of incident points, let's keep it on the track.",
                "Take it easy out there, buddy. Let's focus on smooth, clean corners.",
                "Let's keep our nose clean and avoid any contact. We got this!"
            ]
        },
        tires: {
            raunchy: [
                "Warning. Your tires are absolutely fucked. Pit now.",
                "You're driving on the fucking cords, get your ass in here for new rubber!",
                "The tires are slicker than snot on a doorknob. Get in the box!",
                "You've burned the tires off this bitch! Pit now before we blow one!"
            ],
            sarcastic: [
                "I know you like drifting, but we actually need tread to turn corners. Tires are shot.",
                "Your tires are below fifty percent. I assume you're planning to fly instead?",
                "If you wanted racing slicks, you've got them. Too bad we're on a dirt track. Pit now.",
                "Congratulations, your tires are now smoother than a baby's backside. Pit for tires."
            ],
            nice: [
                "Warning: our tire wear is dropping below fifty percent. Let's swap them soon.",
                "Tires are starting to wear down a bit, buddy. Let's be gentle on the next few turns.",
                "Hey friend, tires are getting a little thin. Let's plan to pit for fresh rubber.",
                "Our tires are wearing out, driver. Let's keep it steady until we can change them."
            ]
        }
    };
    
    const cat = phrases[eventType];
    if (!cat) return "";
    const list = cat[personality] || cat['raunchy'];
    return list[Math.floor(Math.random() * list.length)];
}

function debugLog(msg) {
    console.log(msg);
}

let speechQueue = [];
let ttsSpeaking = false;

function playTTS(text, onEndCallback = null) {
    if (!('speechSynthesis' in window)) return;
    
    debugLog("playTTS requested: " + text);
    ttsSpeaking = true;
    
    setTimeout(() => {
        debugLog("Calling speak(): " + text);
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const andrewVoice = voices.find(v => v.name.toLowerCase().includes('andrew'));
        if (andrewVoice) {
            utterance.voice = andrewVoice;
        }
        
        utterance.onstart = () => {
            debugLog("Speech started: " + text);
        };
        utterance.onend = () => {
            debugLog("Speech finished: " + text);
            ttsSpeaking = false;
            if (onEndCallback) onEndCallback();
            processQueue();
        };
        utterance.onerror = (e) => {
            debugLog("Speech error: " + text + " | Code: " + e.error);
            ttsSpeaking = false;
            if (onEndCallback) onEndCallback();
            processQueue();
        };
        
        window.speechSynthesis.speak(utterance);
    }, 100);
}

function processQueue() {
    debugLog("processQueue. ttsSpeaking: " + ttsSpeaking + " | queue length: " + speechQueue.length);
    if (ttsSpeaking || speechQueue.length === 0) return;
    const next = speechQueue.shift();
    playTTS(next.text, next.onEnd);
}

function speakPhrase(text, forceQueue = false) {
    const personalityEl = document.getElementById('crew-chief-personality');
    const personality = personalityEl ? personalityEl.value : 'off';
    if (personality === 'off') {
        debugLog("speakPhrase skipped (crew chief is off): " + text);
        return;
    }
    const queue = forceQueue || isSpeakingPlan;
    debugLog("speakPhrase: " + text + " | queue: " + queue + " | isSpeakingPlan: " + isSpeakingPlan);
    
    if (!queue) {
        debugLog("speakPhrase immediate. Canceling old speech.");
        window.speechSynthesis.cancel();
        speechQueue = [];
        ttsSpeaking = false;
        isSpeakingPlan = false;
        playTTS(text);
    } else {
        debugLog("speakPhrase queued.");
        speechQueue.push({ text: text, onEnd: null });
        processQueue();
    }
}

function speakPitRoadPlan() {
    const cb4Tires = document.getElementById('pit-4tires');
    const cbRsTires = document.getElementById('pit-rstires');
    const cbLsTires = document.getElementById('pit-lstires');
    const cbFastRepair = document.getElementById('pit-fastrepair');
    const cbAutoFuel = document.getElementById('pit-autofuel');
    const personalityEl = document.getElementById('crew-chief-personality');
    const personality = personalityEl ? personalityEl.value : 'off';
    if (personality === 'off') {
        debugLog("speakPitRoadPlan skipped (crew chief is off)");
        return;
    }

    let plan = [];
    
    // Check Fast Repair
    if (cbFastRepair && cbFastRepair.checked) {
        if (personality === 'nice') {
            plan.push("use the fast repair");
        } else if (personality === 'sarcastic') {
            plan.push("use our magic fast repair");
        } else {
            plan.push("use the fucking fast repair");
        }
    }
    
    // Check Tires
    if (cb4Tires && cb4Tires.checked) {
        if (personality === 'nice') {
            plan.push("change all four tires");
        } else if (personality === 'sarcastic') {
            plan.push("swap out all four tires");
        } else {
            plan.push("change all four goddamn tires");
        }
    } else {
        if (cbRsTires && cbRsTires.checked) {
            plan.push("change the right side tires only");
        }
        if (cbLsTires && cbLsTires.checked) {
            plan.push("change the left side tires only");
        }
    }
    
    // Check Fuel
    if (cbAutoFuel && cbAutoFuel.checked) {
        if (personality === 'nice') {
            plan.push("top off the fuel");
        } else if (personality === 'sarcastic') {
            plan.push("throw some fuel in");
        } else {
            plan.push("fill the fucking tank");
        }
    }
    
    // Add "clean windshield" if any work is planned
    if (plan.length > 0) {
        if (personality === 'nice') {
            plan.push("clean your windshield");
        } else if (personality === 'sarcastic') {
            plan.push("attempt to clean the windshield");
        } else {
            plan.push("clean the windshield");
        }
    }
    
    // Build and speak sentence
    let phrase = "";
    if (plan.length === 0) {
        if (personality === 'nice') {
            phrase = "Looks like a drive through this time, friend. Just keep it steady.";
        } else if (personality === 'sarcastic') {
            phrase = "Just a drive through? Excellent, I'll tell the crew to keep napping.";
        } else {
            phrase = "Just a goddamn drive through? Don't waste my fucking time!";
        }
    } else {
        let actionsStr = "";
        if (plan.length === 1) {
            actionsStr = plan[0];
        } else if (plan.length === 2) {
            actionsStr = `${plan[0]} and ${plan[1]}`;
        } else {
            let last = plan.pop();
            actionsStr = `${plan.join(', ')}, and ${last}`;
        }
        
        if (personality === 'nice') {
            phrase = `Alright buddy, here is the plan: we'll ${actionsStr}. Let's keep it safe.`;
        } else if (personality === 'sarcastic') {
            phrase = `Alright driver, here's the master plan: we'll actually attempt to ${actionsStr}. Try not to miss the pit box.`;
        } else {
            phrase = `Alright driver, here's the plan: we're gonna ${actionsStr}! Let's get this shit done!`;
        }
    }
    
    if (!('speechSynthesis' in window)) return;
    
    debugLog("speakPitRoadPlan triggered. Phrase: " + phrase);
    
    // Plan is always played immediately and blocks cancellations
    window.speechSynthesis.cancel();
    speechQueue = [];
    ttsSpeaking = false;
    isSpeakingPlan = true;
    
    playTTS(phrase, () => {
        isSpeakingPlan = false;
    });
}

function processData(data) {
    try {
        if (data.lanIp) currentLanIp = data.lanIp;

        // Auto-Update Notifier
        if (data.updateAvailable && !window.updateDismissed && document.getElementById('update-banner').style.display === 'none') {
            document.getElementById('update-banner').style.display = 'block';
            window.updateLink = data.updateLink;
        }

        // 1. Incidents & Other Top Row Items
        if(dom.incidents && data.incidents !== undefined) dom.incidents.textContent = data.incidents;
        if(dom.maxIncidents && data.maxIncidents !== undefined) dom.maxIncidents.textContent = data.maxIncidents;
        
        const incBox = document.getElementById('incident-container');
        if (incBox && data.incidents !== undefined && data.maxIncidents !== undefined) {
            let pts = parseInt(data.incidents) || 0;
            let dq = parseInt(data.maxIncidents);
            if (isNaN(dq)) dq = 999;
            let initialWarn = parseInt(data.incWarn);
            if (isNaN(initialWarn)) initialWarn = 999;
            let step = parseInt(data.incStep) || 0;
            
            let isBlackFlag = (data.flagState && data.flagState.toLowerCase() === 'black');
            
            let nextPenalty = dq;
            if (pts < initialWarn) {
                nextPenalty = initialWarn;
            } else if (step > 0) {
                let cycles = Math.floor((pts - initialWarn) / step) + 1;
                nextPenalty = initialWarn + (cycles * step);
                if (nextPenalty > dq) nextPenalty = dq;
            } else {
                nextPenalty = dq;
            }

            let remaining = nextPenalty - pts;
            
            let hitLimit = false;
            if (pts > 0) {
                if (pts === initialWarn || pts === dq) hitLimit = true;
                else if (step > 0 && pts > initialWarn && (pts - initialWarn) % step === 0) hitLimit = true;
            }
            
            incBox.classList.remove('incident-warn', 'incident-danger');
            
            if (isBlackFlag || hitLimit) {
                incBox.classList.add('incident-danger');
            } else if (remaining <= 4 && remaining > 0) {
                incBox.classList.add('incident-warn');
            }

            if (hitLimit && pts > lastIncidentSpoken) {
                lastIncidentSpoken = pts;
                const text = getCrewChiefVoice('incidents', { pts: pts });
                speakPhrase(text);
            }
        }

        if (data.repairsAvail !== undefined) {
            currentRepairsAvail = data.repairsAvail;
            if (document.getElementById('val-repairs-avail')) {
                document.getElementById('val-repairs-avail').textContent = data.repairsAvail;
            }
        }
        if(document.getElementById('val-repairs-used') && data.repairsUsed !== undefined) document.getElementById('val-repairs-used').textContent = data.repairsUsed;
        if(document.getElementById('val-tires-avail') && data.tiresAvail !== undefined) document.getElementById('val-tires-avail').textContent = data.tiresAvail;

        // 2. Middle Row
        if(dom.trackName && data.trackName !== undefined) dom.trackName.textContent = data.trackName.toUpperCase();
        if(dom.lap && data.lap !== undefined) dom.lap.textContent = data.lap;
        if(dom.position && data.position !== undefined) dom.position.textContent = data.position;
        if(data.lapsRemaining !== undefined) {
            if(dom.distance) dom.distance.textContent = data.lapsRemaining;
            if(dom.relRemaining) dom.relRemaining.textContent = data.lapsRemaining;
        }
        if(dom.trackTemp && data.trackTemp !== undefined) dom.trackTemp.textContent = data.trackTemp;
        if(dom.airTemp && data.airTemp !== undefined) dom.airTemp.textContent = data.airTemp;
        if(dom.brakeBias && data.brakeBias !== undefined) {
            dom.brakeBias.textContent = data.brakeBias === 0 ? "N/A" : data.brakeBias.toFixed(1);
            let biasSlider = document.getElementById('val-bias-slider');
            if (biasSlider && data.brakeBias > 0) {
                let pct = (data.brakeBias - 40) / 20 * 100;
                if (pct < 0) pct = 0;
                if (pct > 100) pct = 100;
                biasSlider.style.width = pct + '%';
            }
        }

        // Lap Times
        if(dom.currentLap && data.lapCurrent !== undefined) dom.currentLap.textContent = data.lapCurrent.toFixed(3);
        if(dom.bestLap && data.lapBest !== undefined) {
            dom.bestLap.textContent = data.lapBest.toFixed(3);
            if (globalBestLap > 0 && data.lapBest < globalBestLap) {
                dom.bestLap.classList.remove('flash-lap');
                void dom.bestLap.offsetWidth; 
                dom.bestLap.classList.add('flash-lap');
            }
            if (data.lapBest > 0) globalBestLap = data.lapBest;
        }
        
        // Continuous Telemetry Sampling for Input Traces (Pedals & Steering)
        if (data.lapDistPct !== undefined && !data.onPitRoad) {
            let pct = Math.max(0, Math.min(1, data.lapDistPct));
            let thr = typeof data.throttle === 'number' ? data.throttle : 0;
            let brk = typeof data.brake === 'number' ? data.brake : 0;
            let str = typeof data.steering === 'number' ? data.steering : 0;
            let spd = typeof data.speed === 'number' ? data.speed : 0;

            let last = currentLapSamples[currentLapSamples.length - 1];
            if (!last || Math.abs(pct - last.pct) >= 0.002 || (pct < last.pct && currentLapSamples.length > 50)) {
                currentLapSamples.push({ pct, throttle: thr, brake: brk, steering: str, speed: spd });
            }
        }
        
        // Analytics
        if (data.lap !== undefined && data.lapCurrent !== undefined) {
            if (lastRecordedLap === -1 || data.lap < lastRecordedLap) {
                lastRecordedLap = data.lap;
                currentLapSamples = [];
            } else if (data.lap > lastRecordedLap) {
                if (data.lapCurrent > 0) {
                    stintLapTimes.push(data.lapCurrent);
                    stintFuelUsage.push(data.avgFuel || 0);

                    // Compute Tire Wear %
                    let avgWear = 98.0;
                    if (data.lfWear !== undefined && data.rfWear !== undefined && data.lrWear !== undefined && data.rrWear !== undefined) {
                        let wears = [data.lfWear, data.rfWear, data.lrWear, data.rrWear].filter(w => typeof w === 'number' && w > 0);
                        if (wears.length > 0) avgWear = wears.reduce((a, b) => a + b, 0) / wears.length;
                    } else if (stintTireWear.length > 0) {
                        avgWear = Math.max(20.0, stintTireWear[stintTireWear.length - 1] - (1.2 + Math.random() * 0.8));
                    }
                    stintTireWear.push(Number(avgWear.toFixed(1)));

                    // Extract Apex Speeds from telemetry samples or fallback
                    let t1Apex = 118.0;
                    let t3Apex = 118.0;
                    if (currentLapSamples.length >= 20) {
                        let t1Samples = currentLapSamples.filter(s => s.pct >= 0.18 && s.pct <= 0.35);
                        let t3Samples = currentLapSamples.filter(s => s.pct >= 0.64 && s.pct <= 0.82);
                        if (t1Samples.length > 0) t1Apex = Math.min(...t1Samples.map(s => s.speed));
                        if (t3Samples.length > 0) t3Apex = Math.min(...t3Samples.map(s => s.speed));
                    }
                    stintApexSpeeds.push({ t1: Number(t1Apex.toFixed(1)), t3: Number(t3Apex.toFixed(1)) });

                    if (currentLapSamples.length >= 20) {
                        currentLapSamples.sort((a, b) => a.pct - b.pct);
                        stintLapTraces.push({
                            lap: stintLapTimes.length,
                            time: data.lapCurrent,
                            samples: [...currentLapSamples]
                        });
                    } else {
                        stintLapTraces.push(generateRealisticTrace(data.lapCurrent, stintLapTimes.length));
                    }
                    currentLapSamples = [];
                    updateAnalyticsUI();
                }
                lastRecordedLap = data.lap;
            }
        }
        
        if (data.onPitRoad !== undefined) {
            if (!data.onPitRoad && wasOnPitRoad) {
                if (stintLapTimes.length > 0) {
                    historicalStints.push([...stintLapTimes]);
                    historicalStintFuel.push([...stintFuelUsage]);
                    historicalStintTires.push([...stintTireWear]);
                    historicalStintApexes.push([...stintApexSpeeds]);
                    historicalStintTraces.push([...stintLapTraces]);
                }
                stintLapTimes = [];
                stintFuelUsage = [];
                stintTireWear = [];
                stintApexSpeeds = [];
                stintLapTraces = [];
                currentLapSamples = [];
                activeOverlays.clear();
                updateAnalyticsUI();
            }
            if (data.onPitRoad && !wasOnPitRoad) {
                speakPitRoadPlan();
            }
            wasOnPitRoad = data.onPitRoad;
        }

        if(dom.lapStint && data.lapStint !== undefined) {
            dom.lapStint.textContent = data.lapStint;
            const stintCenter = document.getElementById('val-stint-laps-center');
            if (stintCenter) stintCenter.textContent = data.lapStint;
        }
        if(dom.prevStint && data.prevStint !== undefined) {
            dom.prevStint.textContent = data.prevStint;
            const prevCenter = document.getElementById('val-prev-stint-center');
            if (prevCenter) prevCenter.textContent = data.prevStint;
        }
        if(dom.tireStint && data.prevStint !== undefined) {
            dom.tireStint.textContent = data.prevStint;
        }
        if(dom.delta && data.lapDelta !== undefined) {
            let deltaVal = data.lapDelta;
            dom.delta.textContent = deltaVal > 0 ? "+" + deltaVal.toFixed(3) : deltaVal.toFixed(3);
            dom.delta.style.color = deltaVal > 0 ? "var(--neon-red)" : "var(--neon-green)";
        }

        // Fuel
        if (data.fuel !== undefined) {
            if (dom.fuelCurrentGal) dom.fuelCurrentGal.textContent = data.fuel.toFixed(1);
            if (dom.fuelMaxGal && data.fuelCapacity !== undefined) dom.fuelMaxGal.textContent = data.fuelCapacity.toFixed(1);
            
            const estLapsToGo = data.estLapsToGo !== undefined ? data.estLapsToGo : 0.0;
            const fuelWorst = data.fuelWorst !== undefined ? data.fuelWorst : 0.0;
            const fuel2Lap = data.fuel2Lap !== undefined ? data.fuel2Lap : 0.0;
            const fuelCapacity = data.fuelCapacity !== undefined ? data.fuelCapacity : 0.0;

            const worst = fuelWorst > 0 ? fuelWorst : data.avgFuel;
            const avg2 = fuel2Lap > 0 ? fuel2Lap : data.avgFuel;
            
            currentAvgFuel = data.avgFuel;
            
            // Worst
            const worstToFinish = worst > 0 ? estLapsToGo * worst : 0;
            const worstNeeded = Math.max(0, worstToFinish - data.fuel);
            const worstPitStops = fuelCapacity > 0 ? Math.ceil(worstNeeded / fuelCapacity) : 0;
            const worstAdding = worstNeeded > 0 ? (worstNeeded + 1.0) : 0.0;
            const worstLapsInTank = worst > 0 ? data.fuel / worst : 0;
            const worstPerTank = worst > 0 ? fuelCapacity / worst : 0;

            // 2 Lap
            const avg2ToFinish = avg2 > 0 ? estLapsToGo * avg2 : 0;
            const avg2Needed = Math.max(0, avg2ToFinish - data.fuel);
            const avg2PitStops = fuelCapacity > 0 ? Math.ceil(avg2Needed / fuelCapacity) : 0;
            const avg2Adding = avg2Needed > 0 ? (avg2Needed + 1.0) : 0.0;
            const avg2LapsInTank = avg2 > 0 ? data.fuel / avg2 : 0;
            const avg2PerTank = avg2 > 0 ? fuelCapacity / avg2 : 0;

            const setVal = (id, val, prec = 1) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val.toFixed(prec);
            };

            setVal('fuel-worst-togo', estLapsToGo);
            setVal('fuel-worst-intank', worstLapsInTank);
            setVal('fuel-worst-pertank', worstPerTank);
            setVal('fuel-worst-tofinish', worstToFinish);
            setVal('fuel-worst-intankgal', data.fuel);
            setVal('fuel-worst-needed', worstNeeded);
            setVal('fuel-worst-adding', worstAdding);
            setVal('fuel-worst-pitstops', worstPitStops, 0);

            setVal('fuel-2lap-togo', estLapsToGo);
            setVal('fuel-2lap-intank', avg2LapsInTank);
            setVal('fuel-2lap-pertank', avg2PerTank);
            setVal('fuel-2lap-tofinish', avg2ToFinish);
            setVal('fuel-2lap-intankgal', data.fuel);
            setVal('fuel-2lap-needed', avg2Needed);
            setVal('fuel-2lap-adding', avg2Adding);
            setVal('fuel-2lap-pitstops', avg2PitStops, 0);
            
            // DDU Fuel Dashboard Updates
            const elLapsToGo = document.getElementById('val-laps-togo');
            if (elLapsToGo) {
                elLapsToGo.textContent = estLapsToGo > 0 ? estLapsToGo.toFixed(1) : '-.-';
            }
            const elFuelLaps = document.getElementById('val-fuel-laps');
            if (elFuelLaps) {
                elFuelLaps.textContent = avg2LapsInTank > 0 ? avg2LapsInTank.toFixed(1) : '-.-';
            }
            const elFuelBar = document.getElementById('val-fuel-bar');
            if (elFuelBar && fuelCapacity > 0) {
                let fuelPct = Math.min(100, Math.max(0, (data.fuel / fuelCapacity) * 100));
                elFuelBar.style.width = fuelPct + '%';
            }
            const elFuelMarginBox = document.getElementById('fuel-margin-box');
            const elFuelMarginText = document.getElementById('val-fuel-margin-text');
            if (elFuelMarginBox && elFuelMarginText) {
                if (estLapsToGo <= 0 || avg2LapsInTank <= 0) {
                    elFuelMarginBox.className = 'fuel-margin-alert safe';
                    elFuelMarginText.textContent = 'AWAITING RUN DATA';
                } else {
                    let margin = avg2LapsInTank - estLapsToGo;
                    if (margin >= 0) {
                        elFuelMarginBox.className = 'fuel-margin-alert safe';
                        elFuelMarginText.textContent = `FUEL SAFE: +${margin.toFixed(1)} LAPS`;
                    } else {
                        elFuelMarginBox.className = 'fuel-margin-alert critical';
                        elFuelMarginText.textContent = `⚠️ PIT REQUIRED: ${margin.toFixed(1)} LAPS ⚠️`;
                    }
                }
            }
            
            const wInTankEl = document.getElementById('fuel-worst-intank');
            if (wInTankEl) {
                if (worstLapsInTank < estLapsToGo && worstLapsInTank > 0 && worstLapsInTank < 3.0) {
                    wInTankEl.style.background = 'rgba(255,0,0,0.8)';
                } else {
                    wInTankEl.style.background = 'rgba(255,0,0,0.3)';
                }
            }
            
            const wNeededEl = document.getElementById('fuel-worst-needed');
            if (wNeededEl) {
                wNeededEl.style.background = worstNeeded > 0 ? 'rgba(255,0,0,0.8)' : 'rgba(255,0,0,0.3)';
                document.getElementById('fuel-worst-adding').style.background = worstNeeded > 0 ? 'rgba(255,0,0,0.8)' : 'rgba(255,0,0,0.3)';
            }

            const a2NeededEl = document.getElementById('fuel-2lap-needed');
            if (a2NeededEl) {
                a2NeededEl.style.background = avg2Needed > 0 ? 'rgba(255,0,0,0.8)' : 'rgba(255,0,0,0.3)';
                document.getElementById('fuel-2lap-adding').style.background = avg2Needed > 0 ? 'rgba(255,0,0,0.8)' : 'rgba(255,0,0,0.3)';
            }
            
            if (worstLapsInTank < 3.0 && worstLapsInTank > 0 && worstNeeded > 0) {
                if (!fuelWarned) {
                    fuelWarned = true;
                    const text = getCrewChiefVoice('fuel');
                    speakPhrase(text);
                }
            } else if (worstLapsInTank > 3.5 || worstNeeded === 0) {
                fuelWarned = false;
            }
        }
        
        // Vitals
        if(dom.currentStint && data.lapStint !== undefined) dom.currentStint.textContent = data.lapStint;
        
        if(dom.gear) {
            if(data.gear === -1) dom.gear.textContent = "R";
            else if (data.gear === 0) dom.gear.textContent = "N";
            else dom.gear.textContent = data.gear;
        }
        if(dom.speed && data.speed !== undefined) dom.speed.textContent = data.speed;
        
        // Pit Road Overlay
        const layerDriving = document.getElementById('mod-relative');
        const layerPitroad = document.getElementById('mod-pitroad-center');
        if (data.onPitRoad) {
            if(layerDriving) layerDriving.style.display = 'none';
            if(layerPitroad) layerPitroad.style.display = 'flex';
            
            let pLimit = data.pitSpeedLimit || 45;
            let pSpeed = data.speed || 0;
            
            if(document.getElementById('val-pit-gear')) {
                if(data.gear === -1) document.getElementById('val-pit-gear').textContent = "R";
                else if (data.gear === 0) document.getElementById('val-pit-gear').textContent = "N";
                else document.getElementById('val-pit-gear').textContent = data.gear;
            }
            if(document.getElementById('val-pit-limit')) document.getElementById('val-pit-limit').textContent = pLimit;
            if(document.getElementById('val-pit-speed')) document.getElementById('val-pit-speed').textContent = pSpeed;
            
            // Update Linear Track String markers
            if (data.lapDistPct !== undefined) {
                const markerYou = document.getElementById('ts-marker-you');
                if (markerYou) {
                    markerYou.style.left = `calc(${(data.lapDistPct * 100).toFixed(1)}% - 9px)`;
                }
                
                let leaderDist = -1;
                let paceDist = -1;
                if (data.allDrivers) {
                    const leader = data.allDrivers.find(d => d.pos === 1);
                    if (leader) leaderDist = leader.pct;
                    
                    const paceCar = data.allDrivers.find(d => d.carNum === "-1" || (d.name && d.name.toLowerCase().includes("pace")));
                    if (paceCar) paceDist = paceCar.pct;
                }
                
                const markerLeader = document.getElementById('ts-marker-leader');
                if (markerLeader) {
                    if (leaderDist >= 0) {
                        markerLeader.style.display = 'flex';
                        markerLeader.style.left = `calc(${(leaderDist * 100).toFixed(1)}% - 9px)`;
                    } else {
                        markerLeader.style.display = 'none';
                    }
                }
                
                const markerPace = document.getElementById('ts-marker-pace');
                const statusText = document.getElementById('val-track-string-status');
                if (markerPace) {
                    if (paceDist >= 0) {
                        markerPace.style.display = 'flex';
                        markerPace.style.left = `calc(${(paceDist * 100).toFixed(1)}% - 9px)`;
                        if (statusText) statusText.textContent = "TRACKING PACE CAR";
                    } else {
                        markerPace.style.display = 'none';
                        if (statusText) statusText.textContent = "TRACKING FIELD";
                    }
                }
            }
            
            let sBox = document.getElementById('pit-speed-box');
            if(sBox) {
                let now = Date.now();
                
                if (pSpeed >= pLimit + 1) {
                    if (!pitSpeedWarned) {
                        pitSpeedWarned = true;
                        const text = getCrewChiefVoice('speeding');
                        speakPhrase(text);
                    }
                }
                
                if(pSpeed > pLimit) {
                    sBox.className = 'pit-limit-danger';
                    if(now - lastPitBeep > 300) { beep(1000, 0.1, 0.15, 'square'); lastPitBeep = now; }
                } else if (pSpeed >= pLimit - 3) {
                    sBox.className = 'pit-limit-warn';
                    if(now - lastPitBeep > 500) { beep(800, 0.25, 0.1, 'square'); lastPitBeep = now; }
                } else if (pSpeed >= pLimit - 10) {
                    sBox.className = 'pit-limit-warn';
                    let diff = pLimit - pSpeed;
                    let interval = diff * 150;
                    if(now - lastPitBeep > interval) { beep(400, 0.1, 0.1, 'square'); lastPitBeep = now; }
                } else {
                    sBox.className = 'pit-limit-safe';
                }
            }
        } else {
            pitSpeedWarned = false;
            if(layerDriving) layerDriving.style.display = '';
            if(layerPitroad) layerPitroad.style.display = 'none';
        }
        
        if(dom.waterTemp && data.waterTemp !== undefined) {
            dom.waterTemp.textContent = data.waterTemp;
            const barWater = document.getElementById('bar-waterTemp');
            if (barWater) {
                let pct = Math.min(100, Math.max(0, ((data.waterTemp - 100) / 160) * 100));
                barWater.style.width = pct + '%';
                if (data.waterWarn || data.waterTemp > 230) {
                    barWater.style.background = 'var(--neon-red)';
                } else if (data.waterTemp > 220) {
                    barWater.style.background = 'var(--neon-yellow)';
                } else {
                    barWater.style.background = 'var(--neon-green)';
                }
            }
            if (data.waterWarn) {
                dom.waterTemp.parentElement.parentElement.classList.add('danger-strobe');
            } else {
                dom.waterTemp.parentElement.parentElement.classList.remove('danger-strobe');
            }
        }
        if(dom.oilTemp && data.oilTemp !== undefined) {
            dom.oilTemp.textContent = data.oilTemp;
            const barOil = document.getElementById('bar-oilTemp');
            if (barOil) {
                let pct = Math.min(100, Math.max(0, ((data.oilTemp - 100) / 200) * 100));
                barOil.style.width = pct + '%';
                if (data.oilWarn || data.oilTemp > 265) {
                    barOil.style.background = 'var(--neon-red)';
                } else if (data.oilTemp > 250) {
                    barOil.style.background = 'var(--neon-yellow)';
                } else {
                    barOil.style.background = 'var(--neon-green)';
                }
            }
            if (data.oilWarn) {
                dom.oilTemp.parentElement.parentElement.classList.add('danger-strobe');
            } else {
                dom.oilTemp.parentElement.parentElement.classList.remove('danger-strobe');
            }
        }
        if(dom.rpmVal && data.rpm !== undefined) dom.rpmVal.textContent = Math.round(data.rpm);
        
        if(dom.throttle && data.throttle !== undefined) {
            let tPct = Math.round(data.throttle * 100);
            dom.throttle.style.height = tPct + "%";
        }
        if(dom.brake && data.brake !== undefined) {
            let bPct = Math.round(data.brake * 100);
            dom.brake.style.height = bPct + "%";
        }
        
        if(dom.rpmBar && data.rpm !== undefined && data.maxRpm !== undefined) {
            let rpmPct = (data.rpm / data.maxRpm) * 100;
            if(rpmPct > 100) rpmPct = 100;
            dom.rpmBar.style.width = rpmPct + "%";
        }

        // Relative List
        if(dom.relativeList && data.relative && Array.isArray(data.relative)) {
            dom.relativeList.innerHTML = '';
            
            let playerIdx = data.relative.findIndex(d => d.highlight === true);
            if (playerIdx === -1) playerIdx = 0;

            let renderRows = [];
            for (let i = -3; i <= 3; i++) {
                let target = playerIdx + i;
                if (target >= 0 && target < data.relative.length) {
                    renderRows.push(data.relative[target]);
                } else {
                    renderRows.push(null);
                }
            }

            renderRows.forEach(driver => {
                let row = document.createElement('div');
                row.className = 'standings-row-grid';
                
                if (!driver) {
                    row.style.background = 'transparent';
                    row.innerHTML = `<span class="standings-pos">&nbsp;</span> <span class="standings-name">&nbsp;</span>`;
                    let gapsContainer = document.createElement('div');
                    gapsContainer.style.display = 'flex';
                    gapsContainer.style.justifyContent = 'flex-end';
                    gapsContainer.style.alignItems = 'center';
                    let gapSpan = document.createElement('span');
                    gapSpan.className = 'standings-val';
                    gapSpan.innerHTML = "&nbsp;";
                    gapSpan.style.minWidth = "95px";
                    gapsContainer.appendChild(gapSpan);
                    row.appendChild(gapsContainer);
                    dom.relativeList.appendChild(row);
                    return;
                }

                if (driver.highlight) {
                    row.classList.add('player');
                }
                
                let gapSpan = document.createElement('span');
                gapSpan.className = 'standings-val';
                gapSpan.textContent = driver.gap > 0 ? "+" + driver.gap.toFixed(2) : driver.gap.toFixed(2);
                
                if (lastGaps[driver.car] !== undefined) {
                    let prior = lastGaps[driver.car];
                    if(driver.gap < prior) { lastTrends[driver.car] = 'gap-gain'; }
                    else if(driver.gap > prior) { lastTrends[driver.car] = 'gap-lose'; }
                    
                    if (lastTrends[driver.car]) {
                        gapSpan.classList.add(lastTrends[driver.car]);
                    }
                }
                lastGaps[driver.car] = driver.gap;

                row.innerHTML = `<span class="standings-pos">P${driver.pos}</span> <span class="standings-name">${driver.name}</span>`;
                
                let gapsContainer = document.createElement('div');
                gapsContainer.style.display = 'flex';
                gapsContainer.style.justifyContent = 'flex-end';
                gapsContainer.style.alignItems = 'center';
                
                if (driver.lapDiff !== 0 && !driver.highlight) {
                    let lapSpan = document.createElement('span');
                    let s = driver.lapDiff > 0 ? "+" : "";
                    lapSpan.textContent = s + driver.lapDiff + "L";
                    lapSpan.style.color = "#FFF";
                    lapSpan.style.marginRight = "15px";
                    gapsContainer.appendChild(lapSpan);
                }
                
                let bestLapStr = (driver.bestLap !== undefined && driver.bestLap > 0) ? driver.bestLap.toFixed(3) : '-.---';
                let bestLapSpan = document.createElement('span');
                bestLapSpan.className = "standings-val best";
                bestLapSpan.textContent = bestLapStr;
                bestLapSpan.style.fontWeight = "700";
                bestLapSpan.style.marginRight = "15px";
                bestLapSpan.style.width = "90px";
                bestLapSpan.style.textAlign = "right";
                gapsContainer.appendChild(bestLapSpan);
                
                let lastLapStr = (driver.lastLap !== undefined && driver.lastLap > 0) ? driver.lastLap.toFixed(3) : '-.---';
                let lapTimeSpan = document.createElement('span');
                lapTimeSpan.className = "standings-val";
                lapTimeSpan.textContent = lastLapStr;
                lapTimeSpan.style.fontWeight = "700";
                lapTimeSpan.style.marginRight = "15px";
                lapTimeSpan.style.width = "90px";
                lapTimeSpan.style.textAlign = "right";
                gapsContainer.appendChild(lapTimeSpan);
                
                gapSpan.style.minWidth = "95px"; 
                gapSpan.style.textAlign = "right"; 
                gapsContainer.appendChild(gapSpan);
                
                row.appendChild(gapsContainer);
                dom.relativeList.appendChild(row);
            });
        }

        // Top 3 / Leaders
        if(dom.leadersList && data.top3 && Array.isArray(data.top3)) {
            dom.leadersList.innerHTML = '';
            
            data.top3.forEach((driver, index) => {
                if (index === 3) {
                    let separator = document.createElement('div');
                    separator.style.height = '1.5px';
                    separator.style.background = 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)';
                    separator.style.margin = '4px 15px';
                    separator.style.opacity = '0.9';
                    dom.leadersList.appendChild(separator);
                }
                
                let row = document.createElement('div');
                row.className = 'standings-row-grid';
                if (driver.isPlayer) {
                    row.classList.add('player');
                }
                
                let diffStr = '--.---';
                if (driver.pos === 1 && driver.lastLap > 0) {
                    diffStr = 'LEADER';
                } else if (driver.paceDiff !== undefined && driver.lastLap > 0) {
                    if (driver.paceDiff === 0.0) {
                        diffStr = '0.000';
                    } else {
                        diffStr = driver.paceDiff > 0 ? `+${driver.paceDiff.toFixed(3)}` : driver.paceDiff.toFixed(3);
                    }
                }
                
                row.innerHTML = `
                    <span class="standings-pos">P${driver.pos}</span> 
                    <span class="standings-name">${driver.name}</span>
                    <span class="standings-val best">${(driver.bestLap !== undefined && driver.bestLap > 0) ? driver.bestLap.toFixed(3) : '-.---'}</span>
                    <span class="standings-val">${driver.lastLap > 0 ? driver.lastLap.toFixed(3) : '-.---'}</span>
                    <span class="standings-val" style="color: ${driver.paceDiff < 0 ? 'var(--neon-green)' : (driver.paceDiff > 0 ? 'var(--neon-red)' : '#FFF')}">${diffStr}</span>
                `;
                dom.leadersList.appendChild(row);
            });

            if (data.top3.length === 0) {
                let emptyRow = document.createElement('div');
                emptyRow.className = 'standings-row-grid';
                emptyRow.innerHTML = `<span class="standings-pos">--</span> <span class="standings-name">Waiting for data...</span> <span class="standings-val best">--.---</span> <span class="standings-val">--.---</span> <span class="standings-val">--.---</span>`;
                dom.leadersList.appendChild(emptyRow);
            }
        }

        // Tires
        if(data.tires) {
            let minWear = 100;
            ['LF', 'RF', 'LR', 'RR'].forEach(corner => {
                const tireData = data.tires[corner];
                if (!tireData) return;
                
                let w = tireData.wear;
                if (w < minWear) minWear = w;
                
                let wears = tireData.wears || [w, w, w];
                let temps = tireData.temps || [0, 0, 0];
                
                const isLeft = (corner === 'LF' || corner === 'LR');
                
                // Map based on left/right side physics:
                // Left side: index 0 = O, index 1 = M, index 2 = I
                // Right side: index 0 = I, index 1 = M, index 2 = O
                let wear_O = isLeft ? wears[0] : wears[2];
                let wear_M = wears[1];
                let wear_I = isLeft ? wears[2] : wears[0];
                
                let temp_O = isLeft ? temps[0] : temps[2];
                let temp_M = temps[1];
                let temp_I = isLeft ? temps[2] : temps[0];
                
                const updateCol = (suffix, wearVal, tempVal) => {
                    const idWear = `val-${corner.toLowerCase()}-wear-${suffix}`;
                    const idTemp = `val-${corner.toLowerCase()}-temp-${suffix}`;
                    
                    const elWear = document.getElementById(idWear);
                    const elTemp = document.getElementById(idTemp);
                    
                    if (elWear) {
                        elWear.textContent = wearVal + '%';
                        elWear.className = 'tire-wear';
                        if (wearVal < 50) elWear.classList.add('wear-danger');
                        else if (wearVal <= 70) elWear.classList.add('wear-warn');
                    }
                    if (elTemp) {
                        elTemp.textContent = tempVal + '°';
                    }
                };
                
                updateCol('o', wear_O, temp_O);
                updateCol('m', wear_M, temp_M);
                updateCol('i', wear_I, temp_I);
                
                let svgTire = document.getElementById(`svg-${corner.toLowerCase()}`);
                if (svgTire) {
                    let rect = svgTire.querySelector('rect');
                    let lines = svgTire.querySelectorAll('line');
                    let color = 'var(--neon-green)';
                    if (w < 50) color = 'var(--neon-red)';
                    else if (w <= 70) color = 'var(--neon-yellow)';
                    
                    if (rect) rect.setAttribute('stroke', color);
                    lines.forEach(line => line.setAttribute('stroke', color));
                    svgTire.style.filter = `drop-shadow(0 0 4px ${color})`;
                }
            });
            
            if (minWear < 50 && !tireWarned) {
                tireWarned = true;
                const text = getCrewChiefVoice('tires');
                speakPhrase(text);
            } else if (minWear > 90) {
                tireWarned = false;
            }
        }

        // Flag alert banner & borders
        if(data.flagState !== undefined) {
            const stateStr = data.flagState.toLowerCase();
            
            // Update DDU top alert banner
            const flagAlertBanner = document.getElementById('flag-alert-banner');
            const flagAlertText = document.getElementById('flag-alert-text');
            if (flagAlertBanner && flagAlertText) {
                flagAlertBanner.className = 'flag-banner ' + stateStr;
                let textVal = stateStr.toUpperCase() + " FLAG";
                if (stateStr === 'green') textVal = "GREEN FLAG RACING";
                else if (stateStr === 'yellow') textVal = "⚠️ CAUTION - PACING ⚠️";
                else if (stateStr === 'checkered') textVal = "🏁 CHECKERED FLAG - FINISH 🏁";
                else if (stateStr === 'white') textVal = "🏳️ WHITE FLAG - FINAL LAP 🏳️";
                else if (stateStr === 'red') textVal = "🛑 RED FLAG - SESSION HALTED 🛑";
                else if (stateStr === 'black') textVal = "🏴 BLACK FLAG - PENALTY 🏴";
                flagAlertText.textContent = textVal;
            }
            
            const allPanels = document.querySelectorAll('.glass-panel');
            allPanels.forEach(p => {
                p.classList.remove('theme-green', 'theme-yellow', 'theme-red', 'theme-blue', 'theme-white', 'theme-orange', 'theme-checkered', 'theme-black');
                p.classList.add('theme-' + stateStr);
            });
        }
    } catch (e) {
        if(dom.trackName) dom.trackName.textContent = "GUI EXEC ERROR: " + e.message;
        console.error("Dashboard Render Error:", e);
    }
}

// Pit Macros
function sendPitCmd(action, value) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: action, value: value }));
    }
}

const cbNone = document.getElementById('pit-none');
const cb4Tires = document.getElementById('pit-4tires');
const cbRsTires = document.getElementById('pit-rstires');
const cbLsTires = document.getElementById('pit-lstires');
const cbFastRepair = document.getElementById('pit-fastrepair');
const cbFastRepairDisable = document.getElementById('pit-fastrepair-disable');

if (cbNone) {
    cbNone.addEventListener('change', (e) => {
        if (e.target.checked) {
            cb4Tires.checked = false;
            cbRsTires.checked = false;
            cbLsTires.checked = false;
            cbFastRepair.checked = false;
            if (cbFastRepairDisable) cbFastRepairDisable.checked = true;
            
            // Sync center elements programmatically
            const c4 = document.getElementById('pit-4tires-center'); if (c4) c4.checked = false;
            const crs = document.getElementById('pit-rstires-center'); if (crs) crs.checked = false;
            const cls = document.getElementById('pit-lstires-center'); if (cls) cls.checked = false;
            const cfr = document.getElementById('pit-fastrepair-center'); if (cfr) cfr.checked = false;
            const cfrd = document.getElementById('pit-fastrepair-disable-center'); if (cfrd) cfrd.checked = true;
            
            sendPitCmd("pit_clear");
            speakPhrase("clear all pit options");
        }
    });
}
if (cb4Tires) {
    cb4Tires.addEventListener('change', (e) => {
        if (e.target.checked) {
            cbNone.checked = false;
            cbRsTires.checked = true;
            cbLsTires.checked = true;
            
            const cNone = document.getElementById('pit-none'); if (cNone) cNone.checked = false;
            const crs = document.getElementById('pit-rstires-center'); if (crs) crs.checked = true;
            const cls = document.getElementById('pit-lstires-center'); if (cls) cls.checked = true;
            const c4 = document.getElementById('pit-4tires-center'); if (c4) c4.checked = true;
            
            sendPitCommand();
            speakPhrase("change all four tires");
        } else {
            cbRsTires.checked = false;
            cbLsTires.checked = false;
            const crs = document.getElementById('pit-rstires-center'); if (crs) crs.checked = false;
            const cls = document.getElementById('pit-lstires-center'); if (cls) cls.checked = false;
            const c4 = document.getElementById('pit-4tires-center'); if (c4) c4.checked = false;
            
            sendPitCommand();
            speakPhrase("change tires off");
        }
    });
}
if (cbRsTires) {
    cbRsTires.addEventListener('change', (e) => {
        if (cbNone) cbNone.checked = false;
        const cNone = document.getElementById('pit-none'); if (cNone) cNone.checked = false;
        
        if (e.target.checked && cbLsTires && cbLsTires.checked) {
            cb4Tires.checked = true;
            const c4 = document.getElementById('pit-4tires-center'); if (c4) c4.checked = true;
        } else {
            cb4Tires.checked = false;
            const c4 = document.getElementById('pit-4tires-center'); if (c4) c4.checked = false;
        }
        
        const crs = document.getElementById('pit-rstires-center');
        if (crs) crs.checked = e.target.checked;
        
        sendPitCommand();
        if (e.target.checked) {
            speakPhrase("change right side tires only");
        } else {
            speakPhrase("change right side tires off");
        }
    });
}
if (cbLsTires) {
    cbLsTires.addEventListener('change', (e) => {
        if (cbNone) cbNone.checked = false;
        const cNone = document.getElementById('pit-none'); if (cNone) cNone.checked = false;
        
        if (e.target.checked && cbRsTires && cbRsTires.checked) {
            cb4Tires.checked = true;
            const c4 = document.getElementById('pit-4tires-center'); if (c4) c4.checked = true;
        } else {
            cb4Tires.checked = false;
            const c4 = document.getElementById('pit-4tires-center'); if (c4) c4.checked = false;
        }
        
        const cls = document.getElementById('pit-lstires-center');
        if (cls) cls.checked = e.target.checked;
        
        sendPitCommand();
        if (e.target.checked) {
            speakPhrase("change left side tires only");
        } else {
            speakPhrase("change left side tires off");
        }
    });
}
if (cbFastRepair) {
    cbFastRepair.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (cbNone) cbNone.checked = false;
            const cNone = document.getElementById('pit-none'); if (cNone) cNone.checked = false;
            
            if (cbFastRepairDisable) {
                cbFastRepairDisable.checked = false;
                const centerFRD = document.getElementById('pit-fastrepair-disable-center');
                if (centerFRD) centerFRD.checked = false;
            }
            const centerFR = document.getElementById('pit-fastrepair-center');
            if (centerFR) centerFR.checked = true;
            
            sendPitCommand();
            speakPhrase("fast repair is turned on");
        } else {
            sendPitCommand();
            speakPhrase("fast repair off");
        }
    });
}
if (cbFastRepairDisable) {
    cbFastRepairDisable.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (cbFastRepair) cbFastRepair.checked = false;
            const centerFR = document.getElementById('pit-fastrepair-center');
            if (centerFR) centerFR.checked = false;
            
            const centerFRD = document.getElementById('pit-fastrepair-disable-center');
            if (centerFRD) centerFRD.checked = true;
            
            sendPitCommand();
            speakPhrase("fast repair disabled");
        } else {
            sendPitCommand();
        }
    });
}

function sendPitCommand() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    
    const cbNone = document.getElementById('pit-none');
    const isNone = cbNone ? cbNone.checked : false;

    const cb4T = document.getElementById('pit-4tires') || document.getElementById('pit-4tires-center');
    const cbLS = document.getElementById('pit-lstires') || document.getElementById('pit-lstires-center');
    const cbRS = document.getElementById('pit-rstires') || document.getElementById('pit-rstires-center');
    const cbFR = document.getElementById('pit-fastrepair') || document.getElementById('pit-fastrepair-center');
    const cbFRD = document.getElementById('pit-fastrepair-disable') || document.getElementById('pit-fastrepair-disable-center');
    const cbAF = document.getElementById('pit-autofuel') || document.getElementById('pit-autofuel-center');
    const inputFuel = document.getElementById('pit-fuel-amount');

    const is4T = !isNone && cb4T && cb4T.checked;
    const isLS = !isNone && cbLS && cbLS.checked;
    const isRS = !isNone && cbRS && cbRS.checked;
    const isFR = !isNone && cbFR && cbFR.checked && (!cbFRD || !cbFRD.checked);

    const cmdPayload = {
        action: "update_pit",
        tires: {
            lf: Boolean(is4T || isLS),
            rf: Boolean(is4T || isRS),
            lr: Boolean(is4T || isLS),
            rr: Boolean(is4T || isRS)
        },
        fuel: {
            auto: cbAF ? cbAF.checked : true,
            amount: inputFuel ? ((parseFloat(inputFuel.value) || 0) * (typeof currentAvgFuel === 'number' ? currentAvgFuel : 0.45)) : 0
        },
        fast_repair: Boolean(isFR)
    };
    socket.send(JSON.stringify(cmdPayload));
}

document.getElementById('pit-autofuel').addEventListener('change', (e) => {
    if(e.target.checked) document.getElementById('pit-fuel-amount').disabled = true;
    sendPitCommand();
    if (e.target.checked) {
        speakPhrase("auto fuel on");
    } else {
        speakPhrase("auto fuel off");
    }
});
document.getElementById('pit-manualfuel').addEventListener('change', (e) => {
    if(e.target.checked) document.getElementById('pit-fuel-amount').disabled = false;
    sendPitCommand();
});
document.getElementById('pit-fuel-amount').addEventListener('change', sendPitCommand);

// Initialize WebSocket
connect();

function toggleModule(moduleId, btnEl) {
    const el = document.getElementById(moduleId);
    if (!el) return;
    const isCollapsed = el.classList.toggle('collapsed');
    if (btnEl) {
        btnEl.textContent = isCollapsed ? '+' : '-';
    }
    localStorage.setItem('geezer_redesign_pref_' + moduleId, isCollapsed ? 'closed' : 'open');
}

document.addEventListener('DOMContentLoaded', () => {
    const modules = ['mod-raceinfo', 'mod-vitals', 'mod-relative', 'mod-laptimes', 'mod-tireinfo', 'mod-fuel', 'mod-pitinfo'];
    modules.forEach(modId => {
        const savedState = localStorage.getItem('geezer_redesign_pref_' + modId);
        if (savedState === 'closed') {
            const el = document.getElementById(modId);
            if (el) {
                el.classList.add('collapsed');
                const btn = el.querySelector('.collapse-btn');
                if (btn) btn.textContent = '+';
            }
        }
    });

    // Proportional dashboard scaling to fit screen resolution
    // Disabled to prevent conflicts with scaleCanvas zoom scaling in HTML
    /*
    function autoScaleDashboard() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('module')) return;

        const dashboard = document.getElementById('dashboard-grid');
        if (!dashboard) return;
        
        const targetWidth = 1920;
        const targetHeight = 1080;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const scaleX = windowWidth / targetWidth;
        const scaleY = windowHeight / targetHeight;
        const scale = Math.min(scaleX, scaleY);
        
        dashboard.style.transform = `scale(${scale})`;
        dashboard.style.transformOrigin = 'top left';
        
        const scaledWidth = targetWidth * scale;
        const scaledHeight = targetHeight * scale;
        const offsetX = (windowWidth - scaledWidth) / 2;
        const offsetY = (windowHeight - scaledHeight) / 2;
        
        dashboard.style.position = 'absolute';
        dashboard.style.left = `${Math.max(0, offsetX)}px`;
        dashboard.style.top = `${Math.max(0, offsetY)}px`;
    }
    
    window.addEventListener('resize', autoScaleDashboard);
    autoScaleDashboard();
    */

    // Synchronize center pit road controls with right-column controls
    const syncPairs = [
        ['pit-autofuel-center', 'pit-autofuel'],
        ['pit-lstires-center', 'pit-lstires'],
        ['pit-rstires-center', 'pit-rstires'],
        ['pit-4tires-center', 'pit-4tires'],
        ['pit-fastrepair-center', 'pit-fastrepair'],
        ['pit-fastrepair-disable-center', 'pit-fastrepair-disable']
    ];
    syncPairs.forEach(([centerId, rightId]) => {
        const centerEl = document.getElementById(centerId);
        const rightEl = document.getElementById(rightId);
        if (centerEl && rightEl) {
            // Initialize matching state
            centerEl.checked = rightEl.checked;
            
            centerEl.addEventListener('change', () => {
                if (rightEl.checked !== centerEl.checked) {
                    rightEl.checked = centerEl.checked;
                    rightEl.dispatchEvent(new Event('change'));
                }
            });
            rightEl.addEventListener('change', () => {
                if (centerEl.checked !== rightEl.checked) {
                    centerEl.checked = rightEl.checked;
                }
            });
        }
    });
});

// Custom Scale-Aware Grid Drag and Drop System
document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.dash-column');
    const modules = document.querySelectorAll('.module');

    // Load saved layout
    const savedLayoutRaw = localStorage.getItem('geezer_redesign_grid_layout_v2');
    if (savedLayoutRaw) {
        try {
            const savedLayout = JSON.parse(savedLayoutRaw);
            columns.forEach((col, index) => {
                const colIds = savedLayout[index];
                if (colIds) {
                    colIds.forEach(id => {
                        const el = document.getElementById(id);
                        if (el) col.appendChild(el);
                    });
                }
            });
        } catch (e) {
            console.error('Error loading layout', e);
        }
    }

    // Load saved module sizes
    const savedSizesRaw = localStorage.getItem('geezer_redesign_module_sizes_v2');
    if (savedSizesRaw) {
        try {
            const savedSizes = JSON.parse(savedSizesRaw);
            modules.forEach(mod => {
                if (savedSizes[mod.id]) {
                    mod.style.width = savedSizes[mod.id].width;
                    mod.style.height = savedSizes[mod.id].height;
                }
            });
        } catch (e) {
            console.error('Error loading module sizes', e);
        }
    }

    let resizeTimeout;
    
    function applyProportionalScale(mod) {
        const contents = mod.querySelectorAll('.module-content');
        contents.forEach(content => {
            content.style.width = '100%';
            content.style.height = 'auto';
            content.style.transform = 'none';
        });
    }

    const resizeObserver = new ResizeObserver(entries => {
        clearTimeout(resizeTimeout);
        
        entries.forEach(entry => {
            const mod = entry.target;
            applyProportionalScale(mod);
        });
        
        resizeTimeout = setTimeout(() => {
            const currentSizes = JSON.parse(localStorage.getItem('geezer_redesign_module_sizes_v2') || '{}');
            let updated = false;
            
            entries.forEach(entry => {
                const mod = entry.target;
                if (mod.classList.contains('collapsed')) return;
                
                if (mod.id && (mod.style.width || mod.style.height)) {
                    currentSizes[mod.id] = {
                        width: mod.style.width,
                        height: mod.style.height
                    };
                    updated = true;
                }
            });
            
            if (updated) {
                localStorage.setItem('geezer_redesign_module_sizes_v2', JSON.stringify(currentSizes));
            }
        }, 500);
    });

    modules.forEach(mod => {
        resizeObserver.observe(mod);
    });

    // Custom Resizing Engine
    let activeResizeMod = null;
    let resizeType = ''; 
    let resStartWidth = 0, resStartHeight = 0;
    let resStartX = 0, resStartY = 0;
    
    modules.forEach(mod => {
        const rightHandle = document.createElement('div');
        rightHandle.className = 'resizer-right';
        const bottomHandle = document.createElement('div');
        bottomHandle.className = 'resizer-bottom';
        const cornerHandle = document.createElement('div');
        cornerHandle.className = 'resizer-corner';
        
        mod.appendChild(rightHandle);
        mod.appendChild(bottomHandle);
        mod.appendChild(cornerHandle);
        
        rightHandle.addEventListener('mousedown', (e) => startResize(e, mod, 'right'));
        bottomHandle.addEventListener('mousedown', (e) => startResize(e, mod, 'bottom'));
        cornerHandle.addEventListener('mousedown', (e) => startResize(e, mod, 'corner'));
        
        rightHandle.addEventListener('touchstart', (e) => startResize(e, mod, 'right'), {passive: false});
        bottomHandle.addEventListener('touchstart', (e) => startResize(e, mod, 'bottom'), {passive: false});
        cornerHandle.addEventListener('touchstart', (e) => startResize(e, mod, 'corner'), {passive: false});
    });
    
    function startResize(e, mod, type) {
        if (e.type.includes('touch')) e.preventDefault();
        
        activeResizeMod = mod;
        resizeType = type;
        
        const rect = mod.getBoundingClientRect();
        let scale = parseFloat(document.body.style.zoom) || 1;
        
        resStartWidth = rect.width / scale;
        resStartHeight = rect.height / scale;
        
        resStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        resStartY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchmove', handleResize, {passive: false});
        document.addEventListener('touchend', stopResize);
        
        document.body.style.cursor = type === 'right' ? 'ew-resize' : (type === 'bottom' ? 'ns-resize' : 'nwse-resize');
        e.stopPropagation();
    }
    
    function handleResize(e) {
        if (!activeResizeMod) return;
        e.preventDefault();
        
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        let scale = parseFloat(document.body.style.zoom) || 1;
        
        let dx = (clientX - resStartX) / scale;
        let dy = (clientY - resStartY) / scale;
        
        if (resizeType === 'right' || resizeType === 'corner') {
            let newWidth = Math.max(300, resStartWidth + dx);
            activeResizeMod.style.width = newWidth + 'px';
        }
        
        if (resizeType === 'bottom' || resizeType === 'corner') {
            let newHeight = Math.max(150, resStartHeight + dy);
            activeResizeMod.style.height = newHeight + 'px';
        }
    }
    
    function stopResize() {
        activeResizeMod = null;
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', handleResize);
        document.removeEventListener('touchend', stopResize);
    }

    // Custom Drag and Drop Engine
    let activeDrag = null;
    let placeholder = null;
    let startX = 0, startY = 0;
    let initialRect = null;
    let dragOffsetX = 0, dragOffsetY = 0;

    document.querySelectorAll('.panel-title, .panel-header-row').forEach(header => {
        header.addEventListener('mousedown', dragStart);
        header.addEventListener('touchstart', dragStart, {passive: false});
    });

    function dragStart(e) {
        if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
        if (e.target.classList.contains('collapse-btn')) return;

        activeDrag = e.target.closest('.module');
        if (!activeDrag) return;

        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;
        
        let scale = parseFloat(document.body.style.zoom) || 1;
        initialRect = activeDrag.getBoundingClientRect();
        
        dragOffsetX = (clientX - initialRect.left) / scale;
        dragOffsetY = (clientY - initialRect.top) / scale;

        placeholder = document.createElement('div');
        placeholder.className = 'module placeholder';
        placeholder.style.width = (initialRect.width / scale) + 'px';
        placeholder.style.height = (initialRect.height / scale) + 'px';
        placeholder.style.border = '2px dashed var(--neon-blue)';
        placeholder.style.background = 'transparent';
        placeholder.style.borderRadius = '16px';
        
        activeDrag.parentNode.insertBefore(placeholder, activeDrag);

        activeDrag.classList.add('dragging');
        activeDrag.style.position = 'fixed';
        activeDrag.style.width = (initialRect.width / scale) + 'px';
        activeDrag.style.height = (initialRect.height / scale) + 'px';
        activeDrag.style.zIndex = '9999';
        activeDrag.style.left = (initialRect.left / scale) + 'px';
        activeDrag.style.top = (initialRect.top / scale) + 'px';
        activeDrag.style.pointerEvents = 'none';

        document.body.appendChild(activeDrag);

        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchmove', dragMove, {passive: false});
        document.addEventListener('touchend', dragEnd);

        if (!e.type.includes('touch')) e.preventDefault();
    }

    function dragMove(e) {
        if (!activeDrag || !placeholder) return;
        e.preventDefault();

        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        let scale = parseFloat(document.body.style.zoom) || 1;

        activeDrag.style.left = ((clientX / scale) - dragOffsetX) + 'px';
        activeDrag.style.top = ((clientY / scale) - dragOffsetY) + 'px';

        let target = document.elementFromPoint(clientX, clientY);
        if (!target) return;
        
        let col = target.closest('.dash-column');
        if (col) {
            const afterElement = getDragAfterElement(col, clientY);
            if (afterElement == null) {
                col.appendChild(placeholder);
            } else {
                col.insertBefore(placeholder, afterElement);
            }
        }
    }

    function dragEnd(e) {
        if (!activeDrag) return;
        
        placeholder.parentNode.insertBefore(activeDrag, placeholder);
        placeholder.remove();
        placeholder = null;

        activeDrag.classList.remove('dragging');
        activeDrag.style.position = '';
        activeDrag.style.width = '';
        activeDrag.style.height = '';
        activeDrag.style.zIndex = '';
        activeDrag.style.left = '';
        activeDrag.style.top = '';
        activeDrag.style.pointerEvents = '';

        const newLayout = [];
        columns.forEach(col => {
            const colItems = Array.from(col.querySelectorAll('.module')).map(m => m.id);
            newLayout.push(colItems);
        });
        localStorage.setItem('geezer_redesign_grid_layout_v2', JSON.stringify(newLayout));

        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('touchend', dragEnd);
        
        activeDrag = null;
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.module:not(.dragging):not(.placeholder)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});

// VR Mode Logic
document.addEventListener('DOMContentLoaded', () => {
    const vrBtn = document.getElementById('btn-vr-mode');
    const vrModal = document.getElementById('vr-modal');
    const btnCloseVr = document.getElementById('btn-close-vr');
    const btnVrFull = document.getElementById('btn-vr-full');
    
    if (localStorage.getItem('geezer_redesign_vr_mode') === 'true') {
        document.body.classList.add('vr-mode');
        if(btnVrFull) btnVrFull.textContent = "DISABLE FULL-SCREEN VR MODE";
    }
    
    if (vrBtn && vrModal && btnCloseVr && btnVrFull) {
        vrBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            vrModal.style.display = 'flex';
        });
        
        btnCloseVr.addEventListener('click', () => {
            vrModal.style.display = 'none';
        });
        
        btnVrFull.addEventListener('click', () => {
            const isActive = document.body.classList.toggle('vr-mode');
            localStorage.setItem('geezer_redesign_vr_mode', isActive ? 'true' : 'false');
            btnVrFull.textContent = isActive ? "DISABLE FULL-SCREEN VR MODE" : "ENABLE FULL-SCREEN VR MODE (BLACK BACKGROUND)";
        });
    }
});

// QR Connect Logic
document.addEventListener('DOMContentLoaded', () => {
    const btnQrConnect = document.getElementById('btn-qr-connect');
    const qrModal = document.getElementById('qr-modal');
    const btnCloseQr = document.getElementById('btn-close-qr');
    const qrCodeContainer = document.getElementById('qrcode');
    
    if (btnQrConnect && qrModal && btnCloseQr && qrCodeContainer) {
        btnQrConnect.addEventListener('click', (e) => {
            e.stopPropagation();
            qrModal.style.display = 'flex';
            
            if (qrCodeContainer.innerHTML === '') {
                new QRCode(qrCodeContainer, {
                    text: window.location.href,
                    width: 256,
                    height: 256,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }
        });
        
        btnCloseQr.addEventListener('click', () => {
            qrModal.style.display = 'none';
        });
    }
});

// Stint Analytics
const STINT_COLORS = ['#FF007F', '#FFD700', '#00FF00', '#FF8C00', '#B026FF'];

function generateRealisticTrace(lapTime, lapNum) {
    let samples = [];
    const numPoints = 200;
    const isSlowLap = (lapNum === 4 || lapTime > 34.8);

    for (let i = 0; i <= numPoints; i++) {
        let pct = i / numPoints;
        let thr = 1.0;
        let brk = 0.0;
        let str = 0.0;
        let spd = 150.0;

        if (pct < 0.16) {
            // Front Straight
            thr = 1.0;
            brk = 0.0;
            str = 0.0;
            spd = 142.0 + (pct / 0.16) * 14.0;
        } else if (pct < 0.24) {
            // Turn 1 Braking & Turn-in
            let t = (pct - 0.16) / 0.08;
            thr = 0.0;
            brk = Math.sin(t * Math.PI) * (isSlowLap ? 0.95 : 0.85);
            str = -Math.sin(t * (Math.PI / 2)) * 32.0;
            spd = 156.0 - t * 38.0;
        } else if (pct < 0.36) {
            // Turn 1-2 Apex & Exit
            let t = (pct - 0.24) / 0.12;
            brk = 0.0;
            str = -32.0 * (1.0 - t * 0.85);
            thr = Math.min(1.0, Math.pow(t, 1.2) * (isSlowLap ? 0.9 : 1.0));
            spd = 118.0 + t * 22.0;
        } else if (pct < 0.62) {
            // Backstretch
            let t = (pct - 0.36) / 0.26;
            thr = 1.0;
            brk = 0.0;
            str = 0.0;
            spd = 140.0 + t * 18.0;
        } else if (pct < 0.70) {
            // Turn 3 Braking & Turn-in
            let t = (pct - 0.62) / 0.08;
            thr = 0.0;
            brk = Math.sin(t * Math.PI) * (isSlowLap ? 0.92 : 0.82);
            str = -Math.sin(t * (Math.PI / 2)) * (isSlowLap ? 38.0 : 30.0);
            spd = 158.0 - t * 40.0;
        } else if (pct < 0.84) {
            // Turn 3-4 Apex & Exit
            let t = (pct - 0.70) / 0.14;
            brk = 0.0;
            str = -30.0 * (1.0 - t * 0.9);
            if (isSlowLap && t > 0.3 && t < 0.6) {
                // Slight countersteer wiggle on slow lap
                str += 6.0;
            }
            thr = Math.min(1.0, Math.pow(t, isSlowLap ? 1.8 : 1.1));
            spd = 118.0 + t * 24.0;
        } else {
            // Frontstretch to S/F
            let t = (pct - 0.84) / 0.16;
            thr = 1.0;
            brk = 0.0;
            str = 0.0;
            spd = 142.0 + t * 10.0;
        }

        samples.push({
            pct: Number(pct.toFixed(4)),
            throttle: Number(Math.max(0, Math.min(1, thr)).toFixed(3)),
            brake: Number(Math.max(0, Math.min(1, brk)).toFixed(3)),
            steering: Number(str.toFixed(1)),
            speed: Number(spd.toFixed(1))
        });
    }

    return {
        lap: lapNum,
        time: lapTime,
        samples: samples
    };
}

function updateAnalyticsUI() {
    let countEl = document.getElementById('stat-laps-count');
    let avgEl = document.getElementById('stat-avg-lap');
    let consEl = document.getElementById('stat-consistency');
    if (countEl) countEl.textContent = stintLapTimes.length;
    
    if (stintLapTimes.length > 0) {
        let sum = stintLapTimes.reduce((a, b) => a + b, 0);
        let avg = sum / stintLapTimes.length;
        
        if (stintLapTimes.length > 1) {
            let varianceSum = stintLapTimes.reduce((a, b) => a + Math.pow(b - avg, 2), 0);
            let stdDev = Math.sqrt(varianceSum / (stintLapTimes.length - 1));
            let consistency = Math.max(0, 100 - ((stdDev / avg) * 100));
            if (consEl) consEl.textContent = consistency.toFixed(1) + "%";
        } else {
            if (consEl) consEl.textContent = "100.0%";
        }
        if (avgEl) {
            let m = Math.floor(avg / 60);
            let s = Math.floor(avg % 60);
            let ms = Math.floor((avg % 1) * 1000);
            if (m > 0) {
                avgEl.textContent = `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
            } else {
                avgEl.textContent = `${s}.${ms.toString().padStart(3, '0')}`;
            }
        }
    } else {
        if (avgEl) avgEl.textContent = "--:--.---";
        if (consEl) consEl.textContent = "--%";
    }
    
    let togglesDiv = document.getElementById('stint-toggles');
    if (togglesDiv) {
        togglesDiv.innerHTML = '';
        historicalStints.forEach((stint, index) => {
            let color = STINT_COLORS[index % STINT_COLORS.length];
            let label = document.createElement('label');
            label.className = "custom-checkbox";
            label.style.display = "flex";
            label.style.alignItems = "center";
            label.style.fontSize = "14px";
            label.style.color = "#FFF";
            label.style.cursor = "pointer";
            
            let cb = document.createElement('input');
            cb.type = "checkbox";
            cb.checked = activeOverlays.has(index);
            cb.style.marginRight = "10px";
            cb.onchange = (e) => {
                if(e.target.checked) activeOverlays.add(index);
                else activeOverlays.delete(index);
                drawAnalyticsChart();
            };
            
            let colorDot = document.createElement('span');
            colorDot.style.width = "12px";
            colorDot.style.height = "12px";
            colorDot.style.borderRadius = "50%";
            colorDot.style.backgroundColor = color;
            colorDot.style.display = "inline-block";
            colorDot.style.marginRight = "8px";
            
            let textNode = document.createTextNode(`Stint ${index + 1} (${stint.length} Laps)`);
            
            label.appendChild(cb);
            label.appendChild(colorDot);
            label.appendChild(textNode);
            togglesDiv.appendChild(label);
        });
        if (historicalStints.length === 0) {
            togglesDiv.innerHTML = '<span style="color: #666; font-size: 12px; text-align: center; display: block;">No past stints yet</span>';
        }
    }

    // Populate Trace Select Dropdowns
    let selectLap = document.getElementById('select-trace-lap');
    let selectCompare = document.getElementById('select-trace-compare');
    if (selectLap && selectCompare) {
        let bestLapTime = stintLapTimes.length > 0 ? Math.min(...stintLapTimes) : 0;
        let bestIdx = stintLapTimes.indexOf(bestLapTime);
        if (selectedTraceLapIdx < 0 || selectedTraceLapIdx >= stintLapTimes.length) {
            selectedTraceLapIdx = bestIdx >= 0 ? bestIdx : 0;
        }

        selectLap.innerHTML = '';
        stintLapTimes.forEach((time, idx) => {
            let opt = document.createElement('option');
            opt.value = idx;
            let isBest = (idx === bestIdx);
            opt.textContent = `Lap ${idx + 1} (${time.toFixed(2)}s${isBest ? ' - BEST' : ''})`;
            if (idx === selectedTraceLapIdx) opt.selected = true;
            selectLap.appendChild(opt);
        });

        selectCompare.innerHTML = '';
        let noneOpt = document.createElement('option');
        noneOpt.value = "-1";
        noneOpt.textContent = "None (Single Lap)";
        if (selectedCompareLapIdx === -1) noneOpt.selected = true;
        selectCompare.appendChild(noneOpt);

        stintLapTimes.forEach((time, idx) => {
            let opt = document.createElement('option');
            opt.value = idx;
            let isBest = (idx === bestIdx);
            opt.textContent = `Lap ${idx + 1} (${time.toFixed(2)}s${isBest ? ' - BEST' : ''})`;
            if (idx === selectedCompareLapIdx) opt.selected = true;
            selectCompare.appendChild(opt);
        });

        selectLap.onchange = (e) => {
            selectedTraceLapIdx = parseInt(e.target.value, 10);
            drawAnalyticsChart();
        };

        selectCompare.onchange = (e) => {
            selectedCompareLapIdx = parseInt(e.target.value, 10);
            drawAnalyticsChart();
        };
    }
    
    drawAnalyticsChart();
}

function getInterpolatedTraceValues(traceObj, pct) {
    if (!traceObj || !traceObj.samples || traceObj.samples.length === 0) {
        return { throttle: 0, brake: 0, steering: 0, speed: 0 };
    }
    let samples = traceObj.samples;
    if (pct <= samples[0].pct) return { ...samples[0] };
    if (pct >= samples[samples.length - 1].pct) return { ...samples[samples.length - 1] };

    for (let i = 0; i < samples.length - 1; i++) {
        if (pct >= samples[i].pct && pct <= samples[i + 1].pct) {
            let p1 = samples[i];
            let p2 = samples[i + 1];
            let factor = (p2.pct - p1.pct) === 0 ? 0 : (pct - p1.pct) / (p2.pct - p1.pct);
            return {
                pct: pct,
                throttle: p1.throttle + (p2.throttle - p1.throttle) * factor,
                brake: p1.brake + (p2.brake - p1.brake) * factor,
                steering: p1.steering + (p2.steering - p1.steering) * factor,
                speed: p1.speed + (p2.speed - p1.speed) * factor
            };
        }
    }
    return { ...samples[samples.length - 1] };
}

function drawAnalyticsChart() {
    let canvas = document.getElementById('analytics-chart');
    if (!canvas || canvas.offsetParent === null) return;
    
    let container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let controlsBar = document.getElementById('trace-controls-bar');
    if (controlsBar) {
        controlsBar.style.display = currentGraphMode === 'traces' ? 'flex' : 'none';
    }

    if (currentGraphMode === 'traces') {
        drawTraceAnalytics(ctx, canvas);
    } else if (currentGraphMode === 'tire') {
        drawTireDegradationAnalytics(ctx, canvas);
    } else if (currentGraphMode === 'apex') {
        drawApexSpeedAnalytics(ctx, canvas);
    } else if (currentGraphMode === 'fuel') {
        drawFuelAnalytics(ctx, canvas);
    } else {
        drawPaceAnalytics(ctx, canvas);
    }
}

// ---------------- 1. LAP PACE GRAPH (Pace Zoom + Color-Coded Deltas + Rolling Trendline + Pace Corridor) ----------------
function drawPaceAnalytics(ctx, canvas) {
    let allDisplayedData = [stintLapTimes];
    activeOverlays.forEach(idx => {
        if (historicalStints[idx]) allDisplayedData.push(historicalStints[idx]);
    });
    
    let allTimes = [];
    allDisplayedData.forEach(stint => allTimes.push(...stint));
    
    if (allTimes.length < 2) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Not enough data to graph yet. Complete 2 laps.", canvas.width/2, canvas.height/2);
        return;
    }

    // PACE ZOOM / OUTLIER FILTERING
    let cleanTimes = [...allTimes];
    if (paceZoomEnabled && allTimes.length >= 3) {
        let sorted = [...allTimes].sort((a,b) => a - b);
        let median = sorted[Math.floor(sorted.length / 2)];
        cleanTimes = allTimes.filter(t => t <= median * 1.35 && t >= median * 0.6);
        if (cleanTimes.length < 2) cleanTimes = [...allTimes];
    }
    
    let minTime = Math.min(...cleanTimes);
    let maxTime = Math.max(...cleanTimes);
    let timeRange = maxTime - minTime;
    if (timeRange === 0) timeRange = 1;
    let yMin = Math.max(0, minTime - (timeRange * 0.15));
    let yMax = maxTime + (timeRange * 0.15);
    
    let paddingX = 55;
    let paddingY = 40;
    let graphWidth = canvas.width - (paddingX * 2);
    let graphHeight = canvas.height - (paddingY * 2);
    
    let maxLaps = Math.max(...allDisplayedData.map(s => s.length));
    if (maxLaps < 2) maxLaps = 2;
    
    // Draw Y Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.font = "11px 'Roboto Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
        let y = paddingY + (graphHeight * (i / 4));
        let val = yMax - (i / 4) * (yMax - yMin);
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(canvas.width - paddingX, y);
        ctx.stroke();
        ctx.fillText(val.toFixed(2) + "s", paddingX - 10, y + 4);
    }

    // X Grid lines (Laps)
    ctx.textAlign = "center";
    for (let i = 0; i < maxLaps; i++) {
        let x = paddingX + (i / Math.max(1, maxLaps - 1)) * graphWidth;
        ctx.fillText("L" + (i + 1), x, canvas.height - 12);
    }

    // PACE CORRIDOR BAND (Avg ± 1 StdDev)
    let avg = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
    let varSum = allTimes.reduce((a, b) => a + Math.pow(b - avg, 2), 0);
    let stdDev = Math.sqrt(varSum / Math.max(1, allTimes.length - 1));
    let yBandTop = paddingY + graphHeight - (((avg + stdDev) - yMin) / (yMax - yMin) * graphHeight);
    let yBandBot = paddingY + graphHeight - (((avg - stdDev) - yMin) / (yMax - yMin) * graphHeight);
    ctx.fillStyle = "rgba(0, 229, 255, 0.07)";
    ctx.fillRect(paddingX, Math.max(paddingY, yBandTop), graphWidth, Math.min(graphHeight, yBandBot - yBandTop));

    // Draw Overlay Stints (Historical)
    activeOverlays.forEach(idx => {
        if (historicalStints[idx]) {
            drawStintPaceLine(ctx, historicalStints[idx], STINT_COLORS[idx % STINT_COLORS.length], false, yMin, yMax, paddingX, paddingY, graphWidth, graphHeight, maxLaps);
        }
    });

    // Draw Current Stint with Color-Coded Segments & Rolling Avg
    drawStintPaceLine(ctx, stintLapTimes, "#00E5FF", true, yMin, yMax, paddingX, paddingY, graphWidth, graphHeight, maxLaps);
}

function drawStintPaceLine(ctx, dataArr, defaultColor, isCurrent, yMin, yMax, paddingX, paddingY, graphWidth, graphHeight, maxLaps) {
    if (dataArr.length < 1) return;

    let pts = dataArr.map((time, index) => {
        let x = paddingX + (index / Math.max(1, maxLaps - 1)) * graphWidth;
        let clampedTime = Math.max(yMin, Math.min(yMax, time));
        let normalizedY = (clampedTime - yMin) / (yMax - yMin);
        let y = paddingY + graphHeight - (normalizedY * graphHeight);
        return { x, y, time };
    });

    // Color-Coded Segments (Green for gain, Red for loss)
    for (let i = 0; i < pts.length - 1; i++) {
        let p1 = pts[i];
        let p2 = pts[i + 1];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = isCurrent ? 3.5 : 2;
        if (isCurrent) {
            ctx.strokeStyle = p2.time <= p1.time ? "#00E676" : "#FF1744"; // Green if faster, Red if slower
        } else {
            ctx.strokeStyle = defaultColor;
        }
        ctx.stroke();
    }

    // 3-Lap Rolling Average Curve
    if (isCurrent && pts.length >= 3) {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#FFD700"; // Gold Trendline
        ctx.setLineDash([4, 4]);
        for (let i = 0; i < pts.length; i++) {
            let startK = Math.max(0, i - 2);
            let slice = dataArr.slice(startK, i + 1);
            let rollingAvg = slice.reduce((a, b) => a + b, 0) / slice.length;
            let clampedRA = Math.max(yMin, Math.min(yMax, rollingAvg));
            let normY = (clampedRA - yMin) / (yMax - yMin);
            let ry = paddingY + graphHeight - (normY * graphHeight);
            let rx = pts[i].x;
            if (i === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw Data Point Badges
    pts.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isCurrent ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? "#FFF" : defaultColor;
        ctx.fill();
        ctx.strokeStyle = isCurrent ? "#00E5FF" : defaultColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (isCurrent) {
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.font = "bold 11px 'Roboto Mono', monospace";
            ctx.textAlign = "center";
            ctx.fillText(pt.time.toFixed(2), pt.x, pt.y - 10);
        }
    });
}

// ---------------- 2. TIRE DEGRADATION DUAL-AXIS GRAPH (Lap Time vs Tire Wear %) ----------------
function drawTireDegradationAnalytics(ctx, canvas) {
    if (stintLapTimes.length < 1) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("No lap data recorded yet.", canvas.width/2, canvas.height/2);
        return;
    }

    let paddingX = 60;
    let paddingY = 40;
    let graphWidth = canvas.width - (paddingX * 2);
    let graphHeight = canvas.height - (paddingY * 2);
    let maxLaps = Math.max(2, stintLapTimes.length);

    let minTime = Math.min(...stintLapTimes);
    let maxTime = Math.max(...stintLapTimes);
    let rangeTime = (maxTime - minTime) || 1;
    let yMinPace = Math.max(0, minTime - rangeTime * 0.1);
    let yMaxPace = maxTime + rangeTime * 0.1;

    // Grid & Left Y-Axis (Pace Cyan)
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.font = "11px 'Roboto Mono', monospace";
    for (let i = 0; i <= 4; i++) {
        let y = paddingY + (graphHeight * (i / 4));
        let paceVal = yMaxPace - (i / 4) * (yMaxPace - yMinPace);
        let tireVal = 100 - (i / 4) * 100;
        
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(canvas.width - paddingX, y);
        ctx.stroke();

        // Left Pace Label
        ctx.fillStyle = "#00E5FF";
        ctx.textAlign = "right";
        ctx.fillText(paceVal.toFixed(2) + "s", paddingX - 10, y + 4);

        // Right Tire Label
        ctx.fillStyle = "#FF9100";
        ctx.textAlign = "left";
        ctx.fillText(Math.round(tireVal) + "%", canvas.width - paddingX + 10, y + 4);
    }

    // Headers
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#00E5FF";
    ctx.fillText("■ LAP TIME (CYAN)", paddingX + 10, paddingY - 15);
    ctx.fillStyle = "#FF9100";
    ctx.fillText("■ TIRE WEAR % (ORANGE DASHED)", paddingX + 170, paddingY - 15);

    // Plot Lap Times Line
    ctx.beginPath();
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 3;
    stintLapTimes.forEach((time, index) => {
        let x = paddingX + (index / Math.max(1, maxLaps - 1)) * graphWidth;
        let normY = (time - yMinPace) / (yMaxPace - yMinPace);
        let y = paddingY + graphHeight - (normY * graphHeight);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Plot Tire Wear Line
    if (stintTireWear.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#FF9100";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        stintTireWear.forEach((wear, index) => {
            let x = paddingX + (index / Math.max(1, maxLaps - 1)) * graphWidth;
            let normY = Math.max(0, Math.min(1, wear / 100));
            let y = paddingY + graphHeight - (normY * graphHeight);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// ---------------- 3. CORNER APEX SPEED FLUCTUATION TRACKER ----------------
function drawApexSpeedAnalytics(ctx, canvas) {
    if (stintApexSpeeds.length < 1) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("No apex speed telemetry recorded yet.", canvas.width/2, canvas.height/2);
        return;
    }

    let paddingX = 55;
    let paddingY = 40;
    let graphWidth = canvas.width - (paddingX * 2);
    let graphHeight = canvas.height - (paddingY * 2);
    let maxLaps = Math.max(2, stintApexSpeeds.length);

    let allSpeeds = [];
    stintApexSpeeds.forEach(a => { allSpeeds.push(a.t1, a.t3); });
    let minSpd = Math.floor(Math.min(...allSpeeds) - 2);
    let maxSpd = Math.ceil(Math.max(...allSpeeds) + 2);
    let spdRange = (maxSpd - minSpd) || 10;

    // Grid Lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.font = "11px 'Roboto Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
        let y = paddingY + (graphHeight * (i / 4));
        let val = maxSpd - (i / 4) * spdRange;
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(canvas.width - paddingX, y);
        ctx.stroke();
        ctx.fillText(Math.round(val) + " MPH", paddingX - 10, y + 4);
    }

    // Legend Header
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#00E5FF";
    ctx.fillText("■ TURN 1/2 APEX SPEED", paddingX + 10, paddingY - 15);
    ctx.fillStyle = "#FFD700";
    ctx.fillText("■ TURN 3/4 APEX SPEED", paddingX + 180, paddingY - 15);

    // Plot Turn 1 Apex Speeds (Cyan)
    ctx.beginPath();
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 3;
    stintApexSpeeds.forEach((a, index) => {
        let x = paddingX + (index / Math.max(1, maxLaps - 1)) * graphWidth;
        let normY = (a.t1 - minSpd) / spdRange;
        let y = paddingY + graphHeight - (normY * graphHeight);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Plot Turn 3 Apex Speeds (Gold)
    ctx.beginPath();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    stintApexSpeeds.forEach((a, index) => {
        let x = paddingX + (index / Math.max(1, maxLaps - 1)) * graphWidth;
        let normY = (a.t3 - minSpd) / spdRange;
        let y = paddingY + graphHeight - (normY * graphHeight);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

// ---------------- 4. FUEL USAGE GRAPH ----------------
function drawFuelAnalytics(ctx, canvas) {
    let paddingX = 55;
    let paddingY = 40;
    let graphWidth = canvas.width - (paddingX * 2);
    let graphHeight = canvas.height - (paddingY * 2);
    let maxLaps = Math.max(2, stintFuelUsage.length);

    if (stintFuelUsage.length < 1) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("No fuel usage recorded yet.", canvas.width/2, canvas.height/2);
        return;
    }

    let minFuel = Math.min(...stintFuelUsage);
    let maxFuel = Math.max(...stintFuelUsage);
    let range = (maxFuel - minFuel) || 0.1;
    let yMin = Math.max(0, minFuel - range * 0.1);
    let yMax = maxFuel + range * 0.1;

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.font = "11px 'Roboto Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
        let y = paddingY + (graphHeight * (i / 4));
        let val = yMax - (i / 4) * (yMax - yMin);
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(canvas.width - paddingX, y);
        ctx.stroke();
        ctx.fillText(val.toFixed(2) + " gal", paddingX - 10, y + 4);
    }

    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#00E5FF";
    ctx.fillText("■ FUEL CONSUMPTION PER LAP (GAL)", paddingX + 10, paddingY - 15);

    ctx.beginPath();
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 3;
    stintFuelUsage.forEach((fuel, index) => {
        let x = paddingX + (index / Math.max(1, maxLaps - 1)) * graphWidth;
        let normY = (fuel - yMin) / (yMax - yMin);
        let y = paddingY + graphHeight - (normY * graphHeight);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

function drawTraceAnalytics(ctx, canvas) {
    if (stintLapTraces.length === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("No input trace telemetry recorded yet. Complete a lap.", canvas.width/2, canvas.height/2);
        return;
    }

    let primaryTrace = stintLapTraces[selectedTraceLapIdx] || stintLapTraces[0];
    let compareTrace = (selectedCompareLapIdx >= 0 && selectedCompareLapIdx !== selectedTraceLapIdx && stintLapTraces[selectedCompareLapIdx]) 
        ? stintLapTraces[selectedCompareLapIdx] 
        : null;

    if (!primaryTrace || !primaryTrace.samples || primaryTrace.samples.length === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Telemetry samples missing for selected lap.", canvas.width/2, canvas.height/2);
        return;
    }

    let padL = 60;
    let padR = 25;
    let padT = 20;
    let padB = 35;
    let totalW = canvas.width;
    let totalH = canvas.height;
    let plotW = totalW - padL - padR;
    let plotH = totalH - padT - padB;

    // 3 Sub-Tiers: Pedals (40%), Steering (30%), Speed (30%)
    let gap = 12;
    let hPedals = (plotH - gap * 2) * 0.40;
    let hSteer = (plotH - gap * 2) * 0.30;
    let hSpeed = (plotH - gap * 2) * 0.30;

    let yPedalsTop = padT;
    let yPedalsBottom = yPedalsTop + hPedals;

    let ySteerTop = yPedalsBottom + gap;
    let ySteerBottom = ySteerTop + hSteer;

    let ySpeedTop = ySteerBottom + gap;
    let ySpeedBottom = ySpeedTop + hSpeed;

    // Draw Grid Backgrounds
    function drawGrid(yTop, yBottom, labels, centerLine = false) {
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        labels.forEach(item => {
            let y = yBottom - (item.ratio * (yBottom - yTop));
            ctx.moveTo(padL, y);
            ctx.lineTo(padL + plotW, y);
            
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.font = "10px 'Roboto Mono', monospace";
            ctx.textAlign = "right";
            ctx.fillText(item.text, padL - 8, y + 3);
        });
        ctx.stroke();

        if (centerLine) {
            let yCenter = yTop + (yBottom - yTop) / 2;
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(padL, yCenter);
            ctx.lineTo(padL + plotW, yCenter);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    // Vertical Distance X-Axis Gridlines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
        let x = padL + (i / 4) * plotW;
        ctx.moveTo(x, padT);
        ctx.lineTo(x, padT + plotH);

        let distPctText = `${i * 25}%`;
        if (i === 0) distPctText = "0% (S/F)";
        else if (i === 1) distPctText = "25% (T1/T2)";
        else if (i === 2) distPctText = "50% (Back)";
        else if (i === 3) distPctText = "75% (T3/T4)";
        else if (i === 4) distPctText = "100% (S/F)";

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(distPctText, x, padT + plotH + 20);
    }
    ctx.stroke();

    // 1. PEDALS GRID
    drawGrid(yPedalsTop, yPedalsBottom, [
        { ratio: 1.0, text: "100%" },
        { ratio: 0.5, text: "50%" },
        { ratio: 0.0, text: "0%" }
    ]);

    // 2. STEERING GRID (Dynamic Auto-Scale up to 900° wheel lock / ±450°)
    let allSteers = [...primaryTrace.samples.map(s => Math.abs(s.steering))];
    if (compareTrace) allSteers.push(...compareTrace.samples.map(s => Math.abs(s.steering)));
    let maxSteerAbs = Math.max(...allSteers, 25);
    
    let steerLimit = 45;
    if (maxSteerAbs > 360) steerLimit = 450;
    else if (maxSteerAbs > 270) steerLimit = 360;
    else if (maxSteerAbs > 180) steerLimit = 270;
    else if (maxSteerAbs > 120) steerLimit = 180;
    else if (maxSteerAbs > 90) steerLimit = 120;
    else if (maxSteerAbs > 60) steerLimit = 90;
    else if (maxSteerAbs > 40) steerLimit = 60;
    else steerLimit = 45;

    drawGrid(ySteerTop, ySteerBottom, [
        { ratio: 1.0, text: `+${steerLimit}°` },
        { ratio: 0.5, text: "0°" },
        { ratio: 0.0, text: `-${steerLimit}°` }
    ], true);

    // 3. SPEED GRID
    let allSpeeds = [...primaryTrace.samples.map(s => s.speed)];
    if (compareTrace) allSpeeds.push(...compareTrace.samples.map(s => s.speed));
    let minSpeed = Math.floor(Math.min(...allSpeeds) / 10) * 10 - 5;
    let maxSpeed = Math.ceil(Math.max(...allSpeeds) / 10) * 10 + 5;
    if (maxSpeed <= minSpeed) maxSpeed = minSpeed + 50;
    let midSpeed = Math.round((minSpeed + maxSpeed) / 2);

    drawGrid(ySpeedTop, ySpeedBottom, [
        { ratio: 1.0, text: `${maxSpeed}` },
        { ratio: 0.5, text: `${midSpeed}` },
        { ratio: 0.0, text: `${minSpeed}` }
    ]);

    // Labels & Legends
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = "left";
    
    // Throttle & Brake Header
    ctx.fillStyle = "#00E676";
    ctx.fillText("■ THROTTLE", padL + 10, yPedalsTop + 14);
    ctx.fillStyle = "#FF1744";
    ctx.fillText("■ BRAKE", padL + 95, yPedalsTop + 14);

    // Steering Header
    ctx.fillStyle = "#00E5FF";
    ctx.fillText(`■ STEERING ANGLE (±${steerLimit}°)`, padL + 10, ySteerTop + 14);

    // Speed Header
    ctx.fillStyle = "#FFD700";
    ctx.fillText("■ SPEED (MPH)", padL + 10, ySpeedTop + 14);

    if (compareTrace) {
        ctx.fillStyle = "#E040FB";
        ctx.font = "italic 11px 'Inter', sans-serif";
        ctx.fillText(`- - VS Lap ${compareTrace.lap} (${compareTrace.time.toFixed(2)}s)`, padL + 160, yPedalsTop + 14);
    }

    // Helper functions to plot series
    function plotSeries(samples, getValue, yTop, yBottom, minV, maxV, strokeColor, lineWidth, isDashed = false, fillColor = null) {
        if (!samples || samples.length < 2) return;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        if (isDashed) ctx.setLineDash([5, 4]);
        else ctx.setLineDash([]);

        ctx.beginPath();
        samples.forEach((pt, i) => {
            let x = padL + pt.pct * plotW;
            let val = getValue(pt);
            let norm = (val - minV) / (maxV - minV);
            norm = Math.max(0, Math.min(1, norm));
            let y = yBottom - norm * (yBottom - yTop);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        if (fillColor && !isDashed) {
            ctx.lineTo(padL + samples[samples.length - 1].pct * plotW, yBottom);
            ctx.lineTo(padL + samples[0].pct * plotW, yBottom);
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        ctx.setLineDash([]);
    }

    // RENDER COMPARISON LAP (DASHED BACKGROUND)
    if (compareTrace) {
        plotSeries(compareTrace.samples, s => s.throttle, yPedalsTop, yPedalsBottom, 0, 1, "rgba(0, 230, 118, 0.45)", 2, true);
        plotSeries(compareTrace.samples, s => s.brake, yPedalsTop, yPedalsBottom, 0, 1, "rgba(255, 23, 68, 0.45)", 2, true);
        plotSeries(compareTrace.samples, s => s.steering, ySteerTop, ySteerBottom, -steerLimit, steerLimit, "rgba(224, 64, 251, 0.6)", 2, true);
        plotSeries(compareTrace.samples, s => s.speed, ySpeedTop, ySpeedBottom, minSpeed, maxSpeed, "rgba(255, 215, 0, 0.45)", 2, true);
    }

    // RENDER PRIMARY LAP (SOLID NEON)
    // Throttle fill gradient
    let thrGrad = ctx.createLinearGradient(0, yPedalsTop, 0, yPedalsBottom);
    thrGrad.addColorStop(0, "rgba(0, 230, 118, 0.25)");
    thrGrad.addColorStop(1, "rgba(0, 230, 118, 0.0)");
    plotSeries(primaryTrace.samples, s => s.throttle, yPedalsTop, yPedalsBottom, 0, 1, "#00E676", 2.5, false, thrGrad);

    // Brake fill gradient
    let brkGrad = ctx.createLinearGradient(0, yPedalsTop, 0, yPedalsBottom);
    brkGrad.addColorStop(0, "rgba(255, 23, 68, 0.3)");
    brkGrad.addColorStop(1, "rgba(255, 23, 68, 0.0)");
    plotSeries(primaryTrace.samples, s => s.brake, yPedalsTop, yPedalsBottom, 0, 1, "#FF1744", 2.5, false, brkGrad);

    // Steering Line
    plotSeries(primaryTrace.samples, s => s.steering, ySteerTop, ySteerBottom, -steerLimit, steerLimit, "#00E5FF", 2.5, false);

    // Speed Line
    plotSeries(primaryTrace.samples, s => s.speed, ySpeedTop, ySpeedBottom, minSpeed, maxSpeed, "#FFD700", 2.5, false);

    // INTERACTIVE HOVER SCRUBBER
    if (traceHoverPct !== null && traceHoverPct >= 0 && traceHoverPct <= 1) {
        let hoverX = padL + traceHoverPct * plotW;

        // Draw Scrubber Line
        ctx.strokeStyle = "rgba(0, 229, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(hoverX, padT);
        ctx.lineTo(hoverX, padT + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Get Interpolated Values
        let pVal = getInterpolatedTraceValues(primaryTrace, traceHoverPct);
        let cVal = compareTrace ? getInterpolatedTraceValues(compareTrace, traceHoverPct) : null;

        // Draw Tracker Dots
        function drawDot(val, minV, maxV, yTop, yBottom, color) {
            let norm = (val - minV) / (maxV - minV);
            norm = Math.max(0, Math.min(1, norm));
            let y = yBottom - norm * (yBottom - yTop);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(hoverX, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#FFF";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        drawDot(pVal.throttle, 0, 1, yPedalsTop, yPedalsBottom, "#00E676");
        if (pVal.brake > 0.01) drawDot(pVal.brake, 0, 1, yPedalsTop, yPedalsBottom, "#FF1744");
        drawDot(pVal.steering, -steerLimit, steerLimit, ySteerTop, ySteerBottom, "#00E5FF");
        drawDot(pVal.speed, minSpeed, maxSpeed, ySpeedTop, ySpeedBottom, "#FFD700");

        // Update Real-Time Live Readout
        let readout = document.getElementById('trace-live-readout');
        if (readout) {
            let strP = `Dist: ${(traceHoverPct * 100).toFixed(1)}% | Thr: ${(pVal.throttle * 100).toFixed(0)}% | Brk: ${(pVal.brake * 100).toFixed(0)}% | Steer: ${pVal.steering.toFixed(1)}° | Spd: ${pVal.speed.toFixed(0)} MPH`;
            if (cVal) {
                strP += ` <span style="color:#E040FB;">[VS Lap ${compareTrace.lap}: Thr ${(cVal.throttle * 100).toFixed(0)}%, Brk ${(cVal.brake * 100).toFixed(0)}%, Steer ${cVal.steering.toFixed(1)}°, Spd ${cVal.speed.toFixed(0)} MPH]</span>`;
            }
            readout.innerHTML = strP;
        }
    }
}

function clearAnalytics() {
    stintLapTimes = [];
    stintFuelUsage = [];
    stintTireWear = [];
    stintApexSpeeds = [];
    stintLapTraces = [];
    currentLapSamples = [];
    historicalStints = [];
    historicalStintFuel = [];
    historicalStintTires = [];
    historicalStintApexes = [];
    historicalStintTraces = [];
    activeOverlays.clear();
    updateAnalyticsUI();
}

document.addEventListener('DOMContentLoaded', () => {
    let btnOpen = document.getElementById('btn-analytics');
    let btnClose = document.getElementById('btn-close-analytics');
    let modal = document.getElementById('analytics-modal');
    
    if(btnOpen) btnOpen.addEventListener('click', () => {
        modal.style.display = 'flex';
        // Initialize demo traces if empty
        if (stintLapTimes.length === 0) {
            const demoTimes = [34.46, 34.53, 34.55, 35.02];
            const demoFuels = [0.45, 0.45, 0.46, 0.47];
            const demoTires = [98.5, 96.8, 95.1, 92.4];
            const demoApexes = [
                { t1: 118.2, t3: 118.5 },
                { t1: 117.8, t3: 118.1 },
                { t1: 117.6, t3: 118.0 },
                { t1: 115.1, t3: 114.8 }
            ];
            demoTimes.forEach((t, i) => {
                stintLapTimes.push(t);
                stintFuelUsage.push(demoFuels[i]);
                stintTireWear.push(demoTires[i]);
                stintApexSpeeds.push(demoApexes[i]);
                stintLapTraces.push(generateRealisticTrace(t, i + 1));
            });
            selectedTraceLapIdx = 0;
            selectedCompareLapIdx = 3; // Compare Best Lap (Lap 1) vs Slow Lap (Lap 4)
        }
        updateAnalyticsUI();
    });
    if(btnClose) btnClose.addEventListener('click', () => modal.style.display = 'none');
    
    window.addEventListener('resize', () => {
        if(modal && modal.style.display === 'flex') {
            drawAnalyticsChart();
        }
    });

    let btnPace = document.getElementById('btn-graph-pace');
    let btnTire = document.getElementById('btn-graph-tire');
    let btnApex = document.getElementById('btn-graph-apex');
    let btnFuel = document.getElementById('btn-graph-fuel');
    let btnTraces = document.getElementById('btn-graph-traces');
    let btnZoom = document.getElementById('btn-pace-zoom');

    function updateGraphModeButtons() {
        [btnPace, btnTire, btnApex, btnFuel, btnTraces].forEach(b => {
            if (!b) return;
            b.style.background = 'rgba(255, 255, 255, 0.05)';
            b.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            b.style.color = '#AAA';
        });
        if (currentGraphMode === 'pace' && btnPace) {
            btnPace.style.background = 'rgba(0, 229, 255, 0.2)';
            btnPace.style.borderColor = 'var(--neon-blue)';
            btnPace.style.color = '#FFF';
        } else if (currentGraphMode === 'tire' && btnTire) {
            btnTire.style.background = 'rgba(255, 145, 0, 0.2)';
            btnTire.style.borderColor = '#FF9100';
            btnTire.style.color = '#FFF';
        } else if (currentGraphMode === 'apex' && btnApex) {
            btnApex.style.background = 'rgba(255, 215, 0, 0.2)';
            btnApex.style.borderColor = '#FFD700';
            btnApex.style.color = '#FFF';
        } else if (currentGraphMode === 'fuel' && btnFuel) {
            btnFuel.style.background = 'rgba(0, 229, 255, 0.2)';
            btnFuel.style.borderColor = 'var(--neon-blue)';
            btnFuel.style.color = '#FFF';
        } else if (currentGraphMode === 'traces' && btnTraces) {
            btnTraces.style.background = 'rgba(0, 229, 255, 0.2)';
            btnTraces.style.borderColor = 'var(--neon-blue)';
            btnTraces.style.color = '#FFF';
        }

        if (btnZoom) {
            btnZoom.style.display = (currentGraphMode === 'pace') ? 'inline-block' : 'none';
            if (paceZoomEnabled) {
                btnZoom.textContent = '🔍 PACE ZOOM: ON';
                btnZoom.style.background = 'rgba(0, 255, 102, 0.2)';
                btnZoom.style.borderColor = 'var(--neon-green)';
                btnZoom.style.color = 'var(--neon-green)';
            } else {
                btnZoom.textContent = '🔍 PACE ZOOM: OFF';
                btnZoom.style.background = 'rgba(255, 255, 255, 0.05)';
                btnZoom.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                btnZoom.style.color = '#AAA';
            }
        }
    }

    if (btnPace) btnPace.addEventListener('click', () => {
        currentGraphMode = 'pace';
        updateGraphModeButtons();
        drawAnalyticsChart();
    });
    if (btnTire) btnTire.addEventListener('click', () => {
        currentGraphMode = 'tire';
        updateGraphModeButtons();
        drawAnalyticsChart();
    });
    if (btnApex) btnApex.addEventListener('click', () => {
        currentGraphMode = 'apex';
        updateGraphModeButtons();
        drawAnalyticsChart();
    });
    if (btnFuel) btnFuel.addEventListener('click', () => {
        currentGraphMode = 'fuel';
        updateGraphModeButtons();
        drawAnalyticsChart();
    });
    if (btnTraces) btnTraces.addEventListener('click', () => {
        currentGraphMode = 'traces';
        updateGraphModeButtons();
        drawAnalyticsChart();
    });
    if (btnZoom) btnZoom.addEventListener('click', () => {
        paceZoomEnabled = !paceZoomEnabled;
        updateGraphModeButtons();
        drawAnalyticsChart();
    });

    const canvas = document.getElementById('analytics-chart');
    if (canvas) {
        const handleScrub = (clientX) => {
            if (currentGraphMode !== 'traces') return;
            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const padL = 60;
            const padR = 25;
            const plotW = canvas.width - padL - padR;
            if (x >= padL && x <= padL + plotW) {
                traceHoverPct = (x - padL) / plotW;
                drawAnalyticsChart();
            }
        };

        canvas.addEventListener('mousemove', (e) => handleScrub(e.clientX));
        canvas.addEventListener('mouseleave', () => {
            if (currentGraphMode === 'traces') {
                traceHoverPct = null;
                let readout = document.getElementById('trace-live-readout');
                if (readout) readout.textContent = "Hover over trace to inspect data";
                drawAnalyticsChart();
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                handleScrub(e.touches[0].clientX);
            }
        }, { passive: true });
        canvas.addEventListener('touchend', () => {
            traceHoverPct = null;
            drawAnalyticsChart();
        });
    }

    const chartContainer = document.getElementById('analytics-chart');
    if (chartContainer && chartContainer.parentElement) {
        const modalResizeObserver = new ResizeObserver(() => {
            if (modal && modal.style.display === 'flex') {
                drawAnalyticsChart();
            }
        });
        modalResizeObserver.observe(chartContainer.parentElement);
    }
    
    // Mock Telemetry Data Definitions
    const mockDataDriving = {
        "lanIp": "192.168.1.50",
        "trackName": "Oswego Oval",
        "clock": "8:44 PM",
        "trackTemp": 73,
        "airTemp": 73,
        "position": 16,
        "lap": 12,
        "lapsRemaining": 38,
        "incidents": 2,
        "maxIncidents": 17,
        "repairsAvail": 1,
        "tiresAvail": 2,
        "speed": 153,
        "gear": 4,
        "throttle": 0.95,
        "brake": 0.0,
        "rpm": 7200,
        "maxRpm": 8000,
        "waterTemp": 210,
        "waterWarn": false,
        "oilTemp": 235,
        "oilWarn": false,
        "lapStint": 10,
        "prevStint": 12,
        "lapCurrent": 73.355,
        "lapBest": 83.867,
        "lapDelta": -0.0015,
        "fuel": 12.4,
        "fuelCapacity": 18.5,
        "estLapsToGo": 12.0,
        "avgFuel": 0.45,
        "fuelWorst": 0.48,
        "fuel2Lap": 0.46,
        "brakeBias": 54.5,
        "onPitRoad": false,
        "tires": {
            "LF": { "wear": 82, "wears": [82, 85, 88], "temps": [215, 210, 205] },
            "RF": { "wear": 78, "wears": [80, 78, 75], "temps": [220, 225, 230] },
            "LR": { "wear": 85, "wears": [85, 87, 89], "temps": [205, 200, 195] },
            "RR": { "wear": 80, "wears": [83, 81, 80], "temps": [210, 215, 220] }
        },
        "top3": [
            { "pos": 1, "name": "Driver Lead", "bestLap": 82.333, "lastLap": 141.542, "paceDiff": 0.0, "isPlayer": false },
            { "pos": 2, "name": "Driver Two", "bestLap": 82.533, "lastLap": 142.538, "paceDiff": 0.033, "isPlayer": false },
            { "pos": 3, "name": "Driver Three", "bestLap": 82.632, "lastLap": 142.565, "paceDiff": 0.037, "isPlayer": false }
        ],
        "relative": [
            { "pos": 15, "name": "Driver Ahead", "bestLap": 81.372, "lastLap": 143.208, "gap": -1.45, "highlight": false, "car": 15, "lapDiff": 0 },
            { "pos": 16, "name": "Bill Harkins", "bestLap": 83.573, "lastLap": 143.220, "gap": 0.0, "highlight": true, "car": 16, "lapDiff": 0 },
            { "pos": 17, "name": "Driver Behind", "bestLap": 83.475, "lastLap": 143.140, "gap": 1.82, "highlight": false, "car": 17, "lapDiff": 0 }
        ],
        "flagState": "green"
    };

    const mockDataPitRoad = {
        "lanIp": "192.168.1.50",
        "trackName": "Oswego Oval",
        "clock": "8:45 PM",
        "trackTemp": 73,
        "airTemp": 73,
        "position": 16,
        "lap": 12,
        "lapsRemaining": 38,
        "incidents": 2,
        "maxIncidents": 17,
        "repairsAvail": 1,
        "tiresAvail": 2,
        "speed": 48,
        "pitSpeedLimit": 45,
        "gear": 2,
        "throttle": 0.15,
        "brake": 0.0,
        "rpm": 3400,
        "maxRpm": 8000,
        "waterTemp": 210,
        "waterWarn": false,
        "oilTemp": 235,
        "oilWarn": false,
        "lapStint": 10,
        "prevStint": 12,
        "lapCurrent": 73.355,
        "lapBest": 83.867,
        "lapDelta": -0.0015,
        "fuel": 1.2,
        "fuelCapacity": 18.5,
        "estLapsToGo": 38.0,
        "avgFuel": 0.45,
        "fuelWorst": 0.48,
        "fuel2Lap": 0.46,
        "brakeBias": 54.5,
        "onPitRoad": true,
        "tires": {
            "LF": { "wear": 82, "wears": [82, 85, 88], "temps": [215, 210, 205] },
            "RF": { "wear": 78, "wears": [80, 78, 75], "temps": [220, 225, 230] },
            "LR": { "wear": 85, "wears": [85, 87, 89], "temps": [205, 200, 195] },
            "RR": { "wear": 80, "wears": [83, 81, 80], "temps": [210, 215, 220] }
        },
        "top3": [
            { "pos": 1, "name": "Driver Lead", "bestLap": 82.333, "lastLap": 141.542, "paceDiff": 0.0, "isPlayer": false },
            { "pos": 2, "name": "Driver Two", "bestLap": 82.533, "lastLap": 142.538, "paceDiff": 0.033, "isPlayer": false },
            { "pos": 3, "name": "Driver Three", "bestLap": 82.632, "lastLap": 142.565, "paceDiff": 0.037, "isPlayer": false }
        ],
        "relative": [
            { "pos": 15, "name": "Driver Ahead", "bestLap": 81.372, "lastLap": 143.208, "gap": -1.45, "highlight": false, "car": 15, "lapDiff": 0 },
            { "pos": 16, "name": "Bill Harkins", "bestLap": 83.573, "lastLap": 143.220, "gap": 0.0, "highlight": true, "car": 16, "lapDiff": 0 },
            { "pos": 17, "name": "Driver Behind", "bestLap": 83.475, "lastLap": 143.140, "gap": 1.82, "highlight": false, "car": 17, "lapDiff": 0 }
        ],
        "flagState": "green"
    };

    // Automatically load mock pitroad data if ?mock=true query is present (as fallback)
    const params = new URLSearchParams(window.location.search);
    if (params.get('mock') === 'true') {
        mockModeState = 2; // Default to pit road manager mock
        setTimeout(() => {
            processData(mockDataPitRoad);
        }, 150);
    }
});
