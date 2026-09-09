// BRL Wall of Shame Hub — Application Controller

document.addEventListener("DOMContentLoaded", () => {
    // Current Active State
    let currentRaceKey = "gateway";
    let currentRaceData = BRL_RACES_DATA.gateway;
    let currentFilter = "all";
    let searchQuery = "";
    let isAudioEnabled = true;
    let isSimPlaying = false;
    let simInterval = null;
    let activeIncidentId = null;

    // Web Audio Context
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
    }

    function playSoundEffect(type) {
        if (!isAudioEnabled) return;
        try {
            initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;

            if (type === 'beep') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'penalty') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.setValueAtTime(240, now + 0.12);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'stage') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.1);
                osc.frequency.setValueAtTime(783.99, now + 0.2);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            }
        } catch (e) {
            console.log("Audio FX error:", e);
        }
    }

    // --------------------------------------------------------------------------
    // DOM ELEMENTS
    // --------------------------------------------------------------------------
    const raceWeekSelect = document.getElementById("raceWeekSelect");
    const audioToggleBtn = document.getElementById("audioToggleBtn");
    const audioStatusText = document.getElementById("audioStatusText");
    const exportDiscordBtn = document.getElementById("exportDiscordBtn");
    
    const trackNameDisplay = document.getElementById("trackNameDisplay");
    const trackSubtextDisplay = document.getElementById("trackSubtextDisplay");
    const totalIncidentsNum = document.getElementById("totalIncidentsNum");
    const penaltiesNum = document.getElementById("penaltiesNum");
    const warningsNum = document.getElementById("warningsNum");
    const racingDealsNum = document.getElementById("racingDealsNum");

    const mvpCarPlate = document.getElementById("mvpCarPlate");
    const mvpDriverName = document.getElementById("mvpDriverName");
    const mvpReason = document.getElementById("mvpReason");
    const mvpHighlights = document.getElementById("mvpHighlights");

    const driverLeaderboard = document.getElementById("driverLeaderboard");
    const lapRangeSlider = document.getElementById("lapRangeSlider");
    const currentLapDisplay = document.getElementById("currentLapDisplay");
    const stageMarkersContainer = document.getElementById("stageMarkersContainer");

    const playSimulationBtn = document.getElementById("playSimulationBtn");
    const prevIncidentBtn = document.getElementById("prevIncidentBtn");
    const nextIncidentBtn = document.getElementById("nextIncidentBtn");

    // Unified Live Telemetry Card Elements
    const liveTelemetryBanner = document.getElementById("liveTelemetryBanner");
    const telemetryBadge = document.getElementById("telemetryBadge");
    const telemetryCategory = document.getElementById("telemetryCategory");
    const telemetryTitle = document.getElementById("telemetryTitle");
    const telemetrySummary = document.getElementById("telemetrySummary");
    const telemetryRuling = document.getElementById("telemetryRuling");
    const telemetryAudio = document.getElementById("telemetryAudio");

    // SVG Map Elements
    const trackShapeGroup = document.getElementById("trackShapeGroup");
    const trackPinsGroup = document.getElementById("trackPinsGroup");
    const carMarkerDot = document.getElementById("carMarkerDot");

    const searchInput = document.getElementById("searchInput");
    const filterChips = document.getElementById("filterChips");
    const incidentGrid = document.getElementById("incidentGrid");
    const incidentCountSubtitle = document.getElementById("incidentCountSubtitle");

    // Modals
    const incidentModal = document.getElementById("incidentModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalCategoryBadge = document.getElementById("modalCategoryBadge");
    const modalLap = document.getElementById("modalLap");
    const modalTitle = document.getElementById("modalTitle");
    const modalInvolvedCars = document.getElementById("modalInvolvedCars");
    const modalDescription = document.getElementById("modalDescription");
    const modalRuling = document.getElementById("modalRuling");
    const modalAudioTranscript = document.getElementById("modalAudioTranscript");
    const playAudioSampleBtn = document.getElementById("playAudioSampleBtn");

    const discordModal = document.getElementById("discordModal");
    const discordCloseBtn = document.getElementById("discordCloseBtn");
    const discordMarkdownText = document.getElementById("discordMarkdownText");
    const copyMarkdownConfirmBtn = document.getElementById("copyMarkdownConfirmBtn");

    // --------------------------------------------------------------------------
    // LOAD RACE WEEK DATA
    // --------------------------------------------------------------------------
    function loadRaceWeek(raceKey) {
        currentRaceKey = raceKey;
        currentRaceData = BRL_RACES_DATA[raceKey];

        // Header Meta
        trackNameDisplay.innerText = currentRaceData.title;
        trackSubtextDisplay.innerText = currentRaceData.subtext;

        // Calculate Stats
        const incs = currentRaceData.incidents;
        totalIncidentsNum.innerText = incs.length;
        penaltiesNum.innerText = incs.filter(i => i.category === "penalty").length;
        warningsNum.innerText = incs.filter(i => i.category === "warning" || i.category === "infraction").length;
        racingDealsNum.innerText = incs.filter(i => i.category === "racing_deal").length;

        // MVP Card
        mvpCarPlate.innerText = `#${currentRaceData.mvp.carNumber}`;
        mvpDriverName.innerText = currentRaceData.mvp.driverName;
        mvpReason.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${currentRaceData.mvp.reason}`;
        
        mvpHighlights.innerHTML = `
            <li><i class="fa-solid fa-shield-cat"></i> ${currentRaceData.mvp.reason}</li>
            <li><i class="fa-solid fa-gavel"></i> Total Penalties Issued: <strong>${currentRaceData.mvp.totalPenalties}</strong></li>
        `;

        // Scrubber Slider Range
        lapRangeSlider.max = currentRaceData.laps + 2;
        lapRangeSlider.value = currentRaceData.incidents[0].lap || 1;

        // Stage Markers
        stageMarkersContainer.innerHTML = "";
        currentRaceData.stages.forEach(stg => {
            const pct = (stg.lap / currentRaceData.laps) * 100;
            const m = document.createElement("span");
            m.className = "marker";
            m.style.left = `${Math.min(pct, 95)}%`;
            m.innerText = `${stg.name} (Lap ${stg.lap})`;
            stageMarkersContainer.appendChild(m);
        });

        // Render Components
        renderLeaderboard();
        renderTrackShape();
        renderTrackPins();
        renderIncidents();
        updateScrubberLap(parseInt(lapRangeSlider.value));
    }

    // --------------------------------------------------------------------------
    // RENDER COMPONENTS
    // --------------------------------------------------------------------------
    function renderLeaderboard() {
        driverLeaderboard.innerHTML = "";
        currentRaceData.drivers.forEach(driver => {
            const card = document.createElement("div");
            card.className = `driver-card ${driver.level.toLowerCase()}`;
            card.innerHTML = `
                <div class="driver-card-top">
                    <div class="driver-number-plate" style="border-left: 4px solid ${driver.colors[0]};">
                        #${driver.number}
                    </div>
                    <span class="driver-badge">${driver.badge}</span>
                </div>
                <div class="infraction-bar-container">
                    <div class="infraction-bar-fill" style="width: ${driver.score}%;"></div>
                </div>
                <div class="driver-meta">
                    <span>${driver.name}</span>
                    <span><strong>${driver.incidentsCount}</strong> Incidents</span>
                </div>
            `;
            card.addEventListener("click", () => {
                searchInput.value = `#${driver.number}`;
                searchQuery = `#${driver.number}`;
                renderIncidents();
                playSoundEffect('beep');
            });
            driverLeaderboard.appendChild(card);
        });
    }

    // Render SVG Track Shapes (Gateway Oval vs Darlington Egg-Shape)
    function renderTrackShape() {
        let pathD = "M 230 70 L 570 70 A 130 130 0 0 1 570 330 L 230 330 A 130 130 0 0 1 230 70 Z";
        let turn12Label = "TURN 1 & 2";
        let turn34Label = "TURN 3 & 4";

        if (currentRaceData.trackType === "darlington_egg") {
            // Darlington Narrow Turn 1/2 (Right side) & Wide Turn 3/4 (Left side)
            pathD = "M 220 80 L 590 120 A 90 90 0 0 1 590 280 L 220 320 A 120 120 0 0 1 220 80 Z";
            turn12Label = "TURN 1 & 2 (NARROW)";
            turn34Label = "TURN 3 & 4 (SWEEPING)";
        }

        trackShapeGroup.innerHTML = `
            <path d="${pathD}" fill="none" stroke="#161826" stroke-width="58" stroke-linejoin="round" stroke-linecap="round"/>
            <path d="${pathD}" fill="none" stroke="#2a2e45" stroke-width="44" stroke-linejoin="round" stroke-linecap="round"/>
            <path id="trackCenterGroovePath" d="${pathD}" fill="none" stroke="#00e5ff" stroke-width="4" stroke-dasharray="10 8" opacity="0.8"/>
            <path d="M 270 290 L 530 290" fill="none" stroke="#ff9500" stroke-width="4" stroke-dasharray="6 4"/>
            <line x1="400" y1="305" x2="400" y2="355" stroke="#ffffff" stroke-width="5"/>
            <line x1="400" y1="305" x2="400" y2="355" stroke="#ff3b30" stroke-width="5" stroke-dasharray="6 6"/>
            <text x="710" y="205" fill="#8e8ea0" font-weight="800" font-size="12" text-anchor="middle">${turn12Label}</text>
            <text x="90" y="205" fill="#8e8ea0" font-weight="800" font-size="12" text-anchor="middle">${turn34Label}</text>
            <text x="400" y="38" fill="#8e8ea0" font-weight="800" font-size="13" text-anchor="middle">BACK STRETCH</text>
            <text x="400" y="385" fill="#8e8ea0" font-weight="800" font-size="13" text-anchor="middle">FRONT STRETCH / S/F</text>
            <text x="400" y="280" fill="#ff9500" font-weight="700" font-size="11" text-anchor="middle">PIT ROAD</text>
        `;
    }

    // Render Track Pins
    function renderTrackPins() {
        trackPinsGroup.innerHTML = "";
        const pinOffsets = {};

        currentRaceData.incidents.forEach(inc => {
            let cx = inc.trackCoords.x;
            let cy = inc.trackCoords.y;

            const gridKey = `${Math.round(cx / 25)}_${Math.round(cy / 25)}`;
            if (!pinOffsets[gridKey]) pinOffsets[gridKey] = 0;
            const count = pinOffsets[gridKey]++;

            if (count > 0) {
                if (cy > 300 || cy < 100) {
                    cx += (count % 2 === 1 ? count * 22 : -count * 22);
                } else {
                    cy += (count % 2 === 1 ? count * 22 : -count * 22);
                }
            }

            let pinColor = "#00e5ff";
            if (inc.category === "penalty") pinColor = "#ff3b30";
            if (inc.category === "warning" || inc.category === "infraction") pinColor = "#ffcc00";
            if (inc.category === "racing_deal") pinColor = "#2ecc71";
            if (inc.category === "mvp") pinColor = "#af52de";

            const pinGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            pinGroup.setAttribute("class", "map-pin");
            pinGroup.setAttribute("data-id", inc.id);

            pinGroup.innerHTML = `
                <circle cx="${cx}" cy="${cy}" r="14" fill="${pinColor}" opacity="0.35" filter="url(#nodeGlow)"/>
                <circle cx="${cx}" cy="${cy}" r="8" fill="${pinColor}" stroke="#ffffff" stroke-width="2"/>
                <text x="${cx}" y="${cy - 12}" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">L${inc.lap}</text>
            `;

            pinGroup.addEventListener("click", () => {
                openIncidentModal(inc);
            });

            trackPinsGroup.appendChild(pinGroup);
        });
    }

    // Render Incident Grid Cards
    function renderIncidents() {
        const filtered = currentRaceData.incidents.filter(inc => {
            if (currentFilter !== "all" && inc.category !== currentFilter) return false;
            if (searchQuery.trim() !== "") {
                const q = searchQuery.toLowerCase().trim();
                const matchInvolved = inc.involved.some(c => c.toLowerCase().includes(q.replace('#', '')));
                const matchTitle = inc.title.toLowerCase().includes(q);
                const matchSummary = inc.summary.toLowerCase().includes(q);
                const matchRuling = inc.ruling.toLowerCase().includes(q);
                const matchLocation = inc.location.toLowerCase().includes(q);
                const matchLap = `lap ${inc.lap}`.includes(q) || `l${inc.lap}`.includes(q);
                return matchInvolved || matchTitle || matchSummary || matchRuling || matchLocation || matchLap;
            }
            return true;
        });

        incidentCountSubtitle.innerText = `Showing ${filtered.length} of ${currentRaceData.incidents.length} incidents`;
        incidentGrid.innerHTML = "";

        if (filtered.length === 0) {
            incidentGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fa-solid fa-flag-checkered" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
                    <p>No incidents match the selected filter or search criteria.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(inc => {
            const card = document.createElement("div");
            card.className = "incident-card";
            card.setAttribute("data-id", inc.id);

            const carsHtml = inc.involved.map(c => `<span class="car-pill">#${c}</span>`).join("");

            card.innerHTML = `
                <div class="incident-card-header">
                    <span class="lap-tag"><i class="fa-solid fa-stopwatch"></i> LAP ${inc.lap}</span>
                    <span class="category-tag ${inc.category}">${inc.category.replace('_', ' ')}</span>
                </div>
                <h3 class="incident-title">${inc.title}</h3>
                <p class="incident-summary">${inc.summary}</p>
                <div class="incident-card-footer">
                    <div class="involved-cars-list">${carsHtml || '<span class="car-pill">STAGE</span>'}</div>
                    <span class="location-tag"><i class="fa-solid fa-location-dot"></i> ${inc.location}</span>
                </div>
            `;

            card.addEventListener("click", () => {
                openIncidentModal(inc);
            });

            incidentGrid.appendChild(card);
        });
    }

    // --------------------------------------------------------------------------
    // UNIFIED SCRUBBER & DYNAMIC LIVE TELEMETRY BANNER UPDATE
    // --------------------------------------------------------------------------
    function updateScrubberLap(lapValue) {
        lapRangeSlider.value = lapValue;

        let stageText = "Stage 1";
        if (lapValue > currentRaceData.stages[0].lap && lapValue <= currentRaceData.stages[1].lap) stageText = "Stage 2";
        if (lapValue > currentRaceData.stages[1].lap && lapValue <= currentRaceData.laps) stageText = "Stage 3";
        if (lapValue > currentRaceData.laps) stageText = "Post Race";

        currentLapDisplay.innerText = `Lap ${lapValue} / ${currentRaceData.laps} (${stageText})`;

        // Search for matching incident at or near this lap
        const inc = currentRaceData.incidents.find(i => i.lap === lapValue) ||
                    currentRaceData.incidents.find(i => Math.abs(i.lap - lapValue) <= 1);

        if (inc) {
            // Update Live Telemetry Banner with Real Incident Data
            liveTelemetryBanner.className = `live-telemetry-banner ${inc.category === 'penalty' || inc.category === 'mvp' ? 'danger' : (inc.category === 'warning' ? 'warning' : '')}`;
            telemetryBadge.innerText = `LAP ${inc.lap} — ${inc.location.toUpperCase()}`;
            telemetryCategory.innerText = inc.category.toUpperCase().replace('_', ' ');
            telemetryCategory.className = `category-tag ${inc.category}`;
            telemetryTitle.innerText = inc.title;
            telemetrySummary.innerText = inc.summary;
            telemetryRuling.innerText = inc.ruling;
            telemetryAudio.innerText = inc.audioTranscript || "No radio audio logged.";

            // Move Car Marker to Incident Track Location
            carMarkerDot.setAttribute("cx", inc.trackCoords.x);
            carMarkerDot.setAttribute("cy", inc.trackCoords.y);

            // Highlight Map Pin
            const pins = trackPinsGroup.querySelectorAll(".map-pin");
            pins.forEach(pin => {
                const id = parseInt(pin.getAttribute("data-id"));
                if (id === inc.id) {
                    pin.style.transform = "scale(1.8)";
                    pin.style.filter = "drop-shadow(0 0 12px #00e5ff)";
                } else {
                    pin.style.transform = "scale(1)";
                    pin.style.filter = "none";
                }
            });

            // Highlight Incident Card in Feed
            const cards = incidentGrid.querySelectorAll(".incident-card");
            cards.forEach(card => {
                if (parseInt(card.getAttribute("data-id")) === inc.id) {
                    card.style.borderColor = "var(--color-info)";
                    card.style.boxShadow = "0 0 20px var(--color-info-glow)";
                } else {
                    card.style.borderColor = "var(--border-color)";
                    card.style.boxShadow = "none";
                }
            });
        } else {
            // Quiet Lap Display
            liveTelemetryBanner.className = "live-telemetry-banner";
            telemetryBadge.innerText = `LAP ${lapValue} — GREEN FLAG`;
            telemetryCategory.innerText = "GREEN FLAG";
            telemetryCategory.className = "category-tag racing_deal";
            telemetryTitle.innerText = `Lap ${lapValue} Green Flag Racing`;
            telemetrySummary.innerText = `Green flag racing in progress. Clean track conditions logged.`;
            telemetryRuling.innerText = `No Active Incident`;
            telemetryAudio.innerText = `[RACE CONTROL] "Green flag is out! Keep it clean!"`;

            // Calculate Position Along SVG Path
            const path = document.getElementById("trackCenterGroovePath");
            if (path && path.getTotalLength) {
                const totalLen = path.getTotalLength();
                const progressPct = (lapValue % 10) / 10;
                const pt = path.getPointAtLength(progressPct * totalLen);
                carMarkerDot.setAttribute("cx", pt.x);
                carMarkerDot.setAttribute("cy", pt.y);
            }
        }
    }

    function togglePlaySimulation() {
        if (isSimPlaying) {
            clearInterval(simInterval);
            isSimPlaying = false;
            playSimulationBtn.innerHTML = `<i class="fa-solid fa-play"></i> Play Sim`;
        } else {
            isSimPlaying = true;
            playSimulationBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
            playSoundEffect('beep');

            simInterval = setInterval(() => {
                let currentVal = parseInt(lapRangeSlider.value);
                if (currentVal >= currentRaceData.laps + 2) {
                    currentVal = 1;
                } else {
                    currentVal += 1;
                }
                updateScrubberLap(currentVal);

                const inc = currentRaceData.incidents.find(i => i.lap === currentVal);
                if (inc) {
                    if (inc.category === "penalty" || inc.category === "mvp") {
                        playSoundEffect('penalty');
                    } else if (inc.category === "stage_finish") {
                        playSoundEffect('stage');
                    } else {
                        playSoundEffect('beep');
                    }
                }
            }, 350);
        }
    }

    // --------------------------------------------------------------------------
    // MODAL & DISCORD EXPORTER
    // --------------------------------------------------------------------------
    function openIncidentModal(inc) {
        activeIncidentId = inc.id;
        modalCategoryBadge.innerText = inc.category.toUpperCase().replace('_', ' ');
        modalCategoryBadge.className = `badge ${inc.category}`;
        modalLap.innerText = `LAP ${inc.lap} — ${inc.location}`;
        modalTitle.innerText = inc.title;

        modalInvolvedCars.innerHTML = inc.involved.map(c => `<span class="car-pill" style="font-size:1.1rem; padding:4px 12px;">#${c}</span>`).join(" ");
        modalDescription.innerText = inc.summary;
        modalRuling.innerText = inc.ruling;
        modalAudioTranscript.innerText = inc.audioTranscript;

        incidentModal.classList.add("active");

        if (inc.category === "penalty" || inc.category === "mvp") {
            playSoundEffect('penalty');
        } else if (inc.category === "stage_finish") {
            playSoundEffect('stage');
        } else {
            playSoundEffect('beep');
        }
    }

    function closeIncidentModal() {
        incidentModal.classList.remove("active");
    }

    function generateDiscordMarkdown() {
        let md = `🏁 **BANDIT RACING LEAGUE (BRL) — ${currentRaceData.title.toUpperCase()} STEWARDS' REPORT** 🏁\n`;
        md += `**Track:** ${currentRaceData.subtext}\n\n`;

        md += `🏆 **WEEKLY WALL OF SHAME MVP: CAR #${currentRaceData.mvp.carNumber}**\n`;
        md += `> ${currentRaceData.mvp.reason}\n\n`;

        md += `--- **OFFICIAL INCIDENT RULINGS** ---\n`;
        currentRaceData.incidents.forEach(inc => {
            const cars = inc.involved.length > 0 ? inc.involved.map(c => `#${c}`).join(', ') : 'FIELD';
            md += `• **Lap ${inc.lap}** [${inc.location}]: ${cars}\n`;
            md += `  └ *Incident:* ${inc.title}\n`;
            md += `  └ *Ruling:* **${inc.ruling}**\n\n`;
        });

        md += `*Interactive Web Dashboard:* https://banditracingleague.net/wall-of-shame.html\n`;
        md += `*Report generated by BRL Stewards Telemetry System.*`;
        return md;
    }

    function openDiscordModal() {
        discordMarkdownText.value = generateDiscordMarkdown();
        discordModal.classList.add("active");
        playSoundEffect('beep');
    }

    function closeDiscordModal() {
        discordModal.classList.remove("active");
    }

    // --------------------------------------------------------------------------
    // EVENT LISTENERS
    // --------------------------------------------------------------------------
    function setupEventListeners() {
        raceWeekSelect.addEventListener("change", (e) => {
            loadRaceWeek(e.target.value);
            playSoundEffect('beep');
        });

        audioToggleBtn.addEventListener("click", () => {
            isAudioEnabled = !isAudioEnabled;
            audioStatusText.innerText = isAudioEnabled ? "ON" : "OFF";
            audioToggleBtn.style.opacity = isAudioEnabled ? "1" : "0.5";
            if (isAudioEnabled) playSoundEffect('beep');
        });

        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderIncidents();
        });

        filterChips.querySelectorAll(".chip").forEach(chip => {
            chip.addEventListener("click", () => {
                filterChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                currentFilter = chip.getAttribute("data-filter");
                renderIncidents();
                playSoundEffect('beep');
            });
        });

        lapRangeSlider.addEventListener("input", (e) => {
            updateScrubberLap(parseInt(e.target.value));
        });

        playSimulationBtn.addEventListener("click", togglePlaySimulation);

        prevIncidentBtn.addEventListener("click", () => {
            const curVal = parseInt(lapRangeSlider.value);
            const prevInc = currentRaceData.incidents.slice().reverse().find(i => i.lap < curVal);
            if (prevInc) updateScrubberLap(prevInc.lap);
        });

        nextIncidentBtn.addEventListener("click", () => {
            const curVal = parseInt(lapRangeSlider.value);
            const nextInc = currentRaceData.incidents.find(i => i.lap > curVal);
            if (nextInc) updateScrubberLap(nextInc.lap);
        });

        modalCloseBtn.addEventListener("click", closeIncidentModal);
        incidentModal.addEventListener("click", (e) => { if (e.target === incidentModal) closeIncidentModal(); });

        exportDiscordBtn.addEventListener("click", openDiscordModal);
        discordCloseBtn.addEventListener("click", closeDiscordModal);
        discordModal.addEventListener("click", (e) => { if (e.target === discordModal) closeDiscordModal(); });

        copyMarkdownConfirmBtn.addEventListener("click", () => {
            discordMarkdownText.select();
            navigator.clipboard.writeText(discordMarkdownText.value);
            copyMarkdownConfirmBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
            playSoundEffect('beep');
            setTimeout(() => { copyMarkdownConfirmBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy to Clipboard`; }, 2000);
        });

        playAudioSampleBtn.addEventListener("click", () => {
            const inc = currentRaceData.incidents.find(i => i.id === activeIncidentId);
            if (inc) {
                if (inc.category === "penalty" || inc.category === "mvp") {
                    playSoundEffect('penalty');
                } else if (inc.category === "stage_finish") {
                    playSoundEffect('stage');
                } else {
                    playSoundEffect('beep');
                }
            }
        });
    }

    // Initialize Race Week
    loadRaceWeek("gateway");
    setupEventListeners();
});
