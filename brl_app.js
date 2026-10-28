// Bandit Racing League — Mobile App (PWA) & Real-Time Push Alert Engine
(function () {
    const BRL_SUPABASE_URL = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL)
        ? SUPABASE_URL
        : "https://iydgkfvfukaimhxyhdzq.supabase.co";
    const BRL_SUPABASE_KEY = (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY)
        ? SUPABASE_KEY
        : "sb_publishable_Zu-OJndOV2JZB0_C9_REnQ_oVCKo4u8";

    const STORAGE_KEYS = {
        ALERTS_ENABLED: 'brl_app_alerts_enabled_v1',
        PREF_SITE_UPDATES: 'brl_app_pref_site_v1',
        PREF_RACE_LIVE: 'brl_app_pref_race_v1',
        PREF_DRIVER_ALERTS: 'brl_app_pref_driver_enabled_v1',
        PREF_DRIVER_TARGET: 'brl_app_pref_driver_target_v1',
        PREF_TEAM_ALERTS: 'brl_app_pref_team_enabled_v1',
        PREF_TEAM_TARGET: 'brl_app_pref_team_target_v1',
        LAST_NOTIF_ID: 'brl_app_last_notif_id_v1',
        LAST_READ_ID: 'brl_app_last_read_id_v1',
        LAST_AUTO_LIVE_DATE: 'brl_app_auto_live_date_v1'
    };

    const DEFAULT_DRIVERS = [
        ["ADAM CLARK", "64"], ["ADAM TAHAN", "01"], ["BENJAMIN LACY", "7"], ["BILL HARKINS", "12"],
        ["BOB BERRY", "75"], ["BRANDON GEERS", "73"], ["BRANDON JACKSON", "91"], ["BRET GUZIK", "04"],
        ["CARTER PHILLIPS", "30"], ["CHAD HARTLE", "37"], ["CODY WELCH", "85"], ["COLLIN ANDERSON", "36"],
        ["CONNOR GIBSON", "31"], ["CORDELL MCFARLIN", "10"], ["CURTIS YANCEY", "51"], ["DALTON KILROE", "41"],
        ["DAVID LEAKEY", "84"], ["DAVID WESTOVER JR", "88"], ["DAVIS CARROLL", "50"], ["DI0NTE RADER", "33"],
        ["DONALD KIGHT", "66"], ["DYLAN MCDONALD", "9"], ["DYLAN NICASTRO", "23"], ["EDDIE HAGIGH", "97"],
        ["ETHAN SIKORSKI", "24"], ["GARRET BOBO", "29"], ["HUNTER SENIOR", "20"], ["JACKSON DUKE", "08"],
        ["JACKSON KNAAK", "00"], ["JACKSON MUMMERT", "52"], ["JASON ALLEGRINI", "14"], ["JASON GREENWELL", "83"],
        ["JOEY CRUZ", "28"], ["JON OSBORNE", "11"], ["JONATHON PLATT", "13"], ["JOSH ADAMS", "22"],
        ["JOSH BILLITER", "99"], ["JOSHUA SUTHERLAND", "16"], ["JUSTIN ZIEMIECKI", "03"], ["KEVIN FOSTER", "8"],
        ["KOREY DENSON", "17"], ["LOGAN MURRAY", "4"], ["LUCAS WILSON", "96"], ["MARK ALAN BIVENS", "76"],
        ["MARK GALLOWAY", "3"], ["MASON PHLEGAR", "72"], ["MATT BAILEY", "54"], ["MATT CROCKETT", "15"],
        ["MICHAEL RAKES", "47"], ["MICHAEL RAMOS", "27"], ["NATHAN SANTOS", "21"], ["NICK NICKERSON", "2"],
        ["NICOLE KRIESEL", "6"], ["NOLAN GROSS", "02"], ["PAUL WILSON", "82"], ["PETER MURPHY", "38"],
        ["REAGAN FRUGE", "25"], ["RICKY HART", "1"], ["RYAN PERRONE", "53"], ["SCOTT SANDERSON", "93"],
        ["SEAN BRITT", "5"], ["TERRY KONDUS", "32"], ["TRE ELLIS", "63"], ["TY CORINO", "62"],
        ["TYSON KOPF", "77"], ["VICTOR WEAVER", "18"], ["WES FULLER", "35"]
    ];

    const DEFAULT_TEAMS = [
        ["roundy-motorsports", "Roundy Motorsports"],
        ["937-racing", "937 Racing"],
        ["wrists-up-racing", "ChainedGraboid Racing Team"],
        ["gfr-racing", "GFR Racing"],
        ["legacy-racing", "Legacy Racing"],
        ["zerofoxtrot", "ZeroFoxtrot"],
        ["esr", "ESR"],
        ["carter-phillips-racing", "Carter Phillips Racing"],
        ["salt-city-performance", "Salt City Performance"],
        ["title-town-racing", "Title Town Racing"],
        ["pop-motorsports", "POP Motorsports"],
        ["middle-aged-gunz-motorsports", "Middle Aged Gunz Motorsports"]
    ];

    const UPCOMING_RACES = [
        { date: '2026-10-28', track: 'Kansas Speedway', round: 'Chase Round 2 — Heart of America 120' },
        { date: '2026-11-04', track: 'Mid-Ohio Sports Car Course', round: 'Chase Round 3 — Road Course Showdown' },
        { date: '2026-11-11', track: 'Martinsville Speedway', round: 'Chase Round 4 — Paperclip Elimination' },
        { date: '2026-11-18', track: 'Homestead-Miami Speedway', round: 'Season 16 Championship Finale' }
    ];

    let deferredInstallPrompt = null;
    let swRegistration = null;
    let cachedNotifications = [];
    let isDrawerOpen = false;

    function getActiveDriversList() {
        if (typeof rosterData !== 'undefined' && rosterData) {
            const map = new Map();
            for (const [num, info] of Object.entries(rosterData)) {
                if (info && info.driver && info.driver.trim() && info.driver.trim().toLowerCase() !== 'available') {
                    const name = info.driver.trim().toUpperCase();
                    if (!map.has(name)) map.set(name, num);
                }
            }
            if (map.size > 0) {
                return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
            }
        }
        return DEFAULT_DRIVERS;
    }

    function getActiveTeamsList() {
        if (typeof teamsData !== 'undefined' && teamsData && Array.isArray(teamsData.teams)) {
            const list = teamsData.teams
                .filter(t => !t.isForSale)
                .map(t => [t.id, t.name]);
            if (list.length > 0) return list;
        }
        return DEFAULT_TEAMS;
    }

    // 1. Ensure PWA head tags exist on every page
    function injectPwaHeadTags() {
        if (!document.querySelector('link[rel="manifest"]')) {
            const manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            manifestLink.href = '/manifest.json';
            document.head.appendChild(manifestLink);
        }
        if (!document.querySelector('link[rel="apple-touch-icon"]')) {
            const appleIcon = document.createElement('link');
            appleIcon.rel = 'apple-touch-icon';
            appleIcon.href = '/assets/apple-touch-icon.png';
            document.head.appendChild(appleIcon);
        }
        if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
            const m1 = document.createElement('meta');
            m1.name = 'apple-mobile-web-app-capable';
            m1.content = 'yes';
            document.head.appendChild(m1);

            const m2 = document.createElement('meta');
            m2.name = 'apple-mobile-web-app-status-bar-style';
            m2.content = 'black-translucent';
            document.head.appendChild(m2);

            const m3 = document.createElement('meta');
            m3.name = 'apple-mobile-web-app-title';
            m3.content = 'BRL App';
            document.head.appendChild(m3);
        }
    }

    // 2. Register Service Worker
    async function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            } catch (err) {
                console.warn('BRL Service Worker registration note:', err);
            }
        }
    }

    // 3. Preference Helpers
    function isAlertsEnabled() {
        return localStorage.getItem(STORAGE_KEYS.ALERTS_ENABLED) === 'true' &&
               ('Notification' in window) &&
               Notification.permission === 'granted';
    }
    function prefSiteUpdates() {
        const val = localStorage.getItem(STORAGE_KEYS.PREF_SITE_UPDATES);
        return val === null ? true : val === 'true';
    }
    function prefRaceLive() {
        const val = localStorage.getItem(STORAGE_KEYS.PREF_RACE_LIVE);
        return val === null ? true : val === 'true';
    }
    function prefDriverEnabled() {
        const val = localStorage.getItem(STORAGE_KEYS.PREF_DRIVER_ALERTS);
        return val === null ? true : val === 'true';
    }
    function prefDriverTarget() {
        return localStorage.getItem(STORAGE_KEYS.PREF_DRIVER_TARGET) || 'ALL';
    }
    function prefTeamEnabled() {
        const val = localStorage.getItem(STORAGE_KEYS.PREF_TEAM_ALERTS);
        return val === null ? true : val === 'true';
    }
    function prefTeamTarget() {
        return localStorage.getItem(STORAGE_KEYS.PREF_TEAM_TARGET) || 'ALL';
    }

    // Determine whether an incoming notification should alert this user based on their toggles
    function shouldNotifyUserForAlert(notif) {
        if (!notif) return false;
        const textUpper = ((notif.title || '') + ' ' + (notif.body || '')).toUpperCase();

        // Check if this is a Driver-targeted alert or mentions the user's selected driver
        const notifDriver = (notif.driver || '').trim().toUpperCase();
        const userDriverTarget = prefDriverTarget().toUpperCase();

        if (notif.category === 'driver_alert' || notifDriver) {
            if (!prefDriverEnabled()) return false;
            if (userDriverTarget === 'ALL') return true;
            return notifDriver === userDriverTarget || textUpper.includes(userDriverTarget);
        }

        // Check if this is a Team-targeted alert or mentions the user's selected team
        const notifTeam = (notif.team || '').trim().toUpperCase();
        const userTeamTarget = prefTeamTarget().toUpperCase();

        if (notif.category === 'team_alert' || notifTeam) {
            if (!prefTeamEnabled()) return false;
            if (userTeamTarget === 'ALL') return true;
            return notifTeam === userTeamTarget || textUpper.includes(userTeamTarget);
        }

        // Also check if a general update happens to mention the user's specifically followed driver or team!
        if (prefDriverEnabled() && userDriverTarget !== 'ALL' && textUpper.includes(userDriverTarget)) {
            return true;
        }
        if (prefTeamEnabled() && userTeamTarget !== 'ALL' && textUpper.includes(userTeamTarget)) {
            return true;
        }

        if (notif.category === 'race_live') {
            return prefRaceLive();
        }
        return prefSiteUpdates();
    }

    // 4. Trigger Native OS Notification via Service Worker or Notification API
    async function triggerNativeNotification(title, body, url, tag) {
        if (!('Notification' in window)) return false;
        if (Notification.permission !== 'granted') return false;

        try {
            if (swRegistration && swRegistration.active) {
                swRegistration.active.postMessage({
                    type: 'SHOW_BRL_NOTIFICATION',
                    title,
                    body,
                    url: url || '/index.html',
                    tag: tag || ('brl-' + Date.now())
                });
                return true;
            } else if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SHOW_BRL_NOTIFICATION',
                    title,
                    body,
                    url: url || '/index.html',
                    tag: tag || ('brl-' + Date.now())
                });
                return true;
            } else {
                const n = new Notification(title, {
                    body,
                    icon: '/assets/app-icon-192.png',
                    badge: '/assets/app-icon-192.png',
                    tag: tag || ('brl-' + Date.now())
                });
                n.onclick = function () {
                    window.focus();
                    if (url) window.location.href = url;
                };
                return true;
            }
        } catch (e) {
            console.warn('Notification error:', e);
            return false;
        }
    }

    // 5. Show sleek in-app toast alert banner at top of screen
    function showInAppToast(notif) {
        const existing = document.getElementById('brl-live-toast');
        if (existing) existing.remove();

        const isLive = notif.category === 'race_live';
        const isDriver = notif.category === 'driver_alert' || !!notif.driver;
        const isTeam = notif.category === 'team_alert' || !!notif.team;

        let borderCol = '#39ff14';
        let badgeBg = 'rgba(57,255,20,0.2)';
        let badgeColor = '#39ff14';
        let badgeLabel = '🔄 WEBSITE UPDATED';

        if (isLive) {
            borderCol = '#ff1744';
            badgeBg = '#ff1744';
            badgeColor = '#fff';
            badgeLabel = '🔴 RACE GOING LIVE';
        } else if (isDriver) {
            borderCol = '#00d4ff';
            badgeBg = 'rgba(0,212,255,0.2)';
            badgeColor = '#00d4ff';
            badgeLabel = `🏎️ DRIVER ALERT${notif.driver ? ' • ' + notif.driver : ''}`;
        } else if (isTeam) {
            borderCol = '#ffcc00';
            badgeBg = 'rgba(255,204,0,0.2)';
            badgeColor = '#ffcc00';
            badgeLabel = `🏁 TEAM ALERT${notif.team ? ' • ' + notif.team : ''}`;
        }

        const toast = document.createElement('div');
        toast.id = 'brl-live-toast';
        toast.style.cssText = `
            position: fixed;
            top: 18px;
            right: 18px;
            left: 18px;
            max-width: 460px;
            margin: 0 auto;
            background: rgba(12, 14, 20, 0.98);
            border: 2px solid ${borderCol};
            border-radius: 12px;
            padding: 14px 16px;
            z-index: 99999;
            box-shadow: 0 12px 35px rgba(0,0,0,0.85), 0 0 25px rgba(57,255,20,0.22);
            color: #fff;
            font-family: 'Roboto', sans-serif;
            display: flex;
            flex-direction: column;
            gap: 8px;
            animation: brlToastSlideIn 0.3s ease;
        `;
        toast.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="background:${badgeBg}; color:${badgeColor}; border:1px solid ${borderCol}; font-size:0.7rem; font-weight:900; padding:2px 8px; border-radius:20px; letter-spacing:1px; text-transform:uppercase;">
                    ${badgeLabel}
                </span>
                <button id="brl-toast-close" style="background:none; border:none; color:#999; font-size:1.1rem; cursor:pointer; padding:0 4px;">✕</button>
            </div>
            <div style="font-weight:900; font-size:0.98rem; color:#fff;">${notif.title}</div>
            <div style="font-size:0.86rem; color:#ccc; line-height:1.4;">${notif.body}</div>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:4px;">
                <a href="${notif.url || '/index.html'}" style="background:${borderCol}; color:${isLive ? '#fff' : '#000'}; text-decoration:none; font-weight:900; font-size:0.78rem; padding:6px 14px; border-radius:6px; text-transform:uppercase; letter-spacing:0.5px;">
                    Open Now &rarr;
                </a>
            </div>
        `;
        document.body.appendChild(toast);
        document.getElementById('brl-toast-close').onclick = () => toast.remove();
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 12000);
    }

    // 6. Fetch Official Notifications from Supabase (league_data?id=eq.2 -> data.appNotifications)
    async function fetchAndProcessNotifications(isInitialLoad) {
        try {
            const resp = await fetch(`${BRL_SUPABASE_URL}/rest/v1/league_data?id=eq.2`, {
                headers: {
                    'apikey': BRL_SUPABASE_KEY,
                    'Authorization': `Bearer ${BRL_SUPABASE_KEY}`
                }
            });
            if (!resp.ok) return;
            const rows = await resp.json();
            if (!rows || !rows.length || !rows[0].data) return;

            const notifs = Array.isArray(rows[0].data.appNotifications)
                ? rows[0].data.appNotifications
                : [];
            cachedNotifications = notifs.slice().sort((a, b) => (b.id || 0) - (a.id || 0));

            updateBadgeCount();
            if (isDrawerOpen) renderNotificationList();

            if (cachedNotifications.length === 0) return;

            const latest = cachedNotifications[0];
            const lastSeenId = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_NOTIF_ID) || '0', 10);

            if (!lastSeenId) {
                localStorage.setItem(STORAGE_KEYS.LAST_NOTIF_ID, String(latest.id));
                return;
            }

            if (latest.id > lastSeenId) {
                localStorage.setItem(STORAGE_KEYS.LAST_NOTIF_ID, String(latest.id));

                if (shouldNotifyUserForAlert(latest)) {
                    showInAppToast(latest);
                    if (isAlertsEnabled()) {
                        await triggerNativeNotification(
                            latest.title,
                            latest.body,
                            latest.url || '/index.html',
                            'brl-notif-' + latest.id
                        );
                    }
                }
            }
        } catch (err) {
            // Silent network retry next cycle
        }
    }

    // 7. Automatic Wednesday Night "Race Going Live" Check (8:45 PM - 10:30 PM ET)
    function checkWednesdayRaceLiveWindow() {
        try {
            const now = new Date();
            const etParts = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).formatToParts(now);

            const map = {};
            etParts.forEach(p => { map[p.type] = p.value; });
            const dateStr = `${map.year}-${map.month}-${map.day}`;
            const hour = parseInt(map.hour, 10);
            const minute = parseInt(map.minute, 10);
            const totalMins = hour * 60 + minute;

            const scheduledRace = UPCOMING_RACES.find(r => r.date === dateStr);
            if (!scheduledRace) return;

            if (totalMins >= 20 * 60 + 45 && totalMins <= 22 * 60 + 30) {
                const alreadyFired = localStorage.getItem(STORAGE_KEYS.LAST_AUTO_LIVE_DATE);
                if (alreadyFired !== dateStr && prefRaceLive()) {
                    localStorage.setItem(STORAGE_KEYS.LAST_AUTO_LIVE_DATE, dateStr);
                    const liveNotif = {
                        id: Date.now(),
                        category: 'race_live',
                        title: `🔴 LIVE NOW: BRL at ${scheduledRace.track}!`,
                        body: `${scheduledRace.round} is going LIVE! Tap to watch the SimTrax broadcast.`,
                        url: '/simtrax.html'
                    };
                    showInAppToast(liveNotif);
                    if (isAlertsEnabled()) {
                        triggerNativeNotification(liveNotif.title, liveNotif.body, liveNotif.url, 'brl-race-live-' + dateStr);
                    }
                }
            }
        } catch (e) {}
    }

    // 8. Build Floating BRL App Button & Drawer UI
    function buildAppWidgetUI() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes brlToastSlideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes brlPulseGlow {
                0%, 100% { box-shadow: 0 6px 24px rgba(0,0,0,0.8), 0 0 14px rgba(57, 255, 20, 0.35); }
                50% { box-shadow: 0 6px 28px rgba(0,0,0,0.9), 0 0 24px rgba(57, 255, 20, 0.7); }
            }
            #brl-app-fab {
                position: fixed;
                bottom: 22px;
                right: 22px;
                z-index: 9998;
                background: linear-gradient(135deg, #10141d 0%, #090b10 100%);
                color: #fff;
                border: 2px solid #39ff14;
                border-radius: 50px;
                padding: 10px 18px;
                font-family: 'Outfit', sans-serif;
                font-weight: 900;
                font-size: 0.86rem;
                letter-spacing: 0.8px;
                text-transform: uppercase;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: brlPulseGlow 3s infinite ease-in-out;
                transition: transform 0.2s ease;
            }
            #brl-app-fab:hover {
                transform: translateY(-3px) scale(1.03);
            }
            #brl-app-fab-badge {
                background: #ff1744;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 900;
                min-width: 20px;
                height: 20px;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 0 5px;
                box-shadow: 0 0 8px rgba(255,23,68,0.8);
            }
            #brl-app-drawer-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.75);
                backdrop-filter: blur(5px);
                z-index: 99990;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
            }
            #brl-app-drawer {
                background: linear-gradient(145deg, #12151f 0%, #090b10 100%);
                border: 2px solid #39ff14;
                border-radius: 16px;
                width: 100%;
                max-width: 540px;
                max-height: 92vh;
                overflow-y: auto;
                padding: 24px;
                color: #fff;
                font-family: 'Roboto', sans-serif;
                box-shadow: 0 20px 60px rgba(0,0,0,0.95), 0 0 35px rgba(57,255,20,0.2);
                position: relative;
            }
            .brl-app-section {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
            }
            .brl-app-btn {
                width: 100%;
                padding: 12px 16px;
                border-radius: 8px;
                font-family: 'Outfit', sans-serif;
                font-weight: 900;
                font-size: 0.92rem;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                cursor: pointer;
                border: none;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .brl-app-btn-green {
                background: #39ff14;
                color: #000;
                box-shadow: 0 0 15px rgba(57,255,20,0.35);
            }
            .brl-app-btn-green:hover {
                background: #52ff33;
            }
            .brl-app-btn-outline {
                background: rgba(255,255,255,0.05);
                color: #fff;
                border: 1px solid rgba(255,255,255,0.25);
            }
            .brl-app-btn-outline:hover {
                border-color: #39ff14;
                color: #39ff14;
            }
            .brl-app-select {
                width: 100%;
                padding: 8px 10px;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.22);
                background: #0b0e15;
                color: #fff;
                font-size: 0.82rem;
                font-family: 'Roboto', sans-serif;
                margin-top: 6px;
            }
        `;
        document.head.appendChild(style);

        // Floating Action Button
        const fab = document.createElement('button');
        fab.id = 'brl-app-fab';
        fab.title = 'Install BRL Mobile App & Manage Live Alerts';
        fab.innerHTML = `
            <span style="font-size:1.1rem;">📲</span>
            <span>BRL App &amp; Alerts</span>
            <span id="brl-app-fab-badge">0</span>
        `;
        fab.onclick = openAppDrawer;
        document.body.appendChild(fab);

        // Build Driver & Team option lists
        const driversList = getActiveDriversList();
        const driverOptionsHtml = driversList
            .map(([name, num]) => `<option value="${name}">#${num} — ${name}</option>`)
            .join('');

        const teamsList = getActiveTeamsList();
        const teamOptionsHtml = teamsList
            .map(([id, name]) => `<option value="${name}">${name}</option>`)
            .join('');

        // Modal Backdrop & Drawer
        const backdrop = document.createElement('div');
        backdrop.id = 'brl-app-drawer-backdrop';
        backdrop.onclick = (e) => {
            if (e.target === backdrop) closeAppDrawer();
        };

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        backdrop.innerHTML = `
            <div id="brl-app-drawer">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(57,255,20,0.25); padding-bottom:14px; margin-bottom:18px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="/assets/app-icon-192.png" alt="BRL App" style="width:46px; height:46px; border-radius:10px; border:1px solid #39ff14;">
                        <div>
                            <h3 style="margin:0; font-family:'Outfit',sans-serif; font-size:1.35rem; font-style:italic; text-transform:uppercase; color:#fff;">
                                BANDIT <span style="color:#39ff14;">MOBILE APP</span> &amp; ALERTS
                            </h3>
                            <span style="font-size:0.78rem; color:#aaa;">Direct Website App &bull; Free for Android, iPhone &amp; PC</span>
                        </div>
                    </div>
                    <button id="brl-app-close-btn" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; width:34px; height:34px; border-radius:8px; cursor:pointer; font-size:1rem;">✕</button>
                </div>

                <!-- STEP 1: INSTALL APP TO HOME SCREEN -->
                <div class="brl-app-section" style="border-color: rgba(57,255,20,0.35);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:900; color:#39ff14; text-transform:uppercase; letter-spacing:1px;">
                            📲 Step 1 &bull; Install BRL App to Your Phone
                        </span>
                        <span id="brl-install-status-pill" style="font-size:0.7rem; padding:2px 8px; border-radius:12px; background:${isStandalone ? 'rgba(57,255,20,0.2)' : 'rgba(255,204,0,0.15)'}; color:${isStandalone ? '#39ff14' : '#ffcc00'}; font-weight:700;">
                            ${isStandalone ? '✓ App Installed' : 'No App Store Needed'}
                        </span>
                    </div>
                    <p style="color:#ccc; font-size:0.86rem; line-height:1.45; margin:0 0 12px 0;">
                        Add the official <strong>Bandit Racing League App</strong> directly to your phone's home screen for 1-tap full-screen access and lock-screen push notifications.
                    </p>
                    <button id="brl-install-app-btn" class="brl-app-btn brl-app-btn-green" style="${isStandalone ? 'display:none;' : ''}">
                        📲 Install BRL App Now
                    </button>
                    <div id="brl-ios-install-guide" style="display:${isIOS && !isStandalone ? 'block' : 'none'}; margin-top:10px; padding:12px; border-radius:8px; background:rgba(0,212,255,0.1); border:1px solid rgba(0,212,255,0.35); font-size:0.83rem; color:#e5e7eb; line-height:1.5;">
                        <strong style="color:#00d4ff; display:block; margin-bottom:4px;">🍏 How to Install on iPhone / iPad (iOS):</strong>
                        1. Tap the <strong>Share</strong> button <span style="background:rgba(255,255,255,0.15); padding:1px 6px; border-radius:4px;">⎋</span> at the bottom of Safari.<br>
                        2. Scroll down and tap <strong>"Add to Home Screen"</strong> <span style="background:rgba(255,255,255,0.15); padding:1px 6px; border-radius:4px;">＋</span>.<br>
                        3. Open the <strong>BRL Outlaw</strong> icon from your home screen and enable alerts below!
                    </div>
                </div>

                <!-- STEP 2: PUSH NOTIFICATION CONTROLS (INCLUDING INDIVIDUAL DRIVER & TEAM TOGGLES) -->
                <div class="brl-app-section" style="border-color: rgba(255,204,0,0.35);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:900; color:#ffcc00; text-transform:uppercase; letter-spacing:1px;">
                            🔔 Step 2 &bull; Live Push Alert Settings
                        </span>
                        <span id="brl-notif-status-pill" style="font-size:0.7rem; padding:2px 8px; border-radius:12px; font-weight:700;"></span>
                    </div>
                    <p style="color:#ccc; font-size:0.84rem; line-height:1.45; margin:0 0 12px 0;">
                        Choose which alerts you want sent to your phone—including <strong>Individual Driver</strong> and <strong>Franchise Team</strong> notifications!
                    </p>

                    <button id="brl-toggle-alerts-btn" class="brl-app-btn brl-app-btn-green" style="margin-bottom:12px;">
                        🔔 Enable Lock-Screen Alerts
                    </button>

                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:12px; padding:12px; background:rgba(0,0,0,0.45); border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
                        <!-- Toggle 1: Website Updates -->
                        <label style="display:flex; align-items:center; gap:10px; font-size:0.85rem; color:#eee; cursor:pointer;">
                            <input type="checkbox" id="brl-chk-site-updates" style="accent-color:#39ff14; width:17px; height:17px;">
                            <span><strong>🔄 Website Update Alerts</strong> (Standings, Fantasy &amp; Recaps)</span>
                        </label>

                        <!-- Toggle 2: Race Going Live -->
                        <label style="display:flex; align-items:center; gap:10px; font-size:0.85rem; color:#eee; cursor:pointer;">
                            <input type="checkbox" id="brl-chk-race-live" style="accent-color:#ff1744; width:17px; height:17px;">
                            <span><strong>🔴 "Race Going Live" Alerts</strong> (Wednesday Night SimTrax Broadcasts)</span>
                        </label>

                        <!-- Toggle 3: Individual Driver Notifications -->
                        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
                            <label style="display:flex; align-items:center; gap:10px; font-size:0.85rem; color:#eee; cursor:pointer;">
                                <input type="checkbox" id="brl-chk-driver-alerts" style="accent-color:#00d4ff; width:17px; height:17px;">
                                <span><strong style="color:#00d4ff;">🏎️ Individual Driver Notifications</strong> (Roster, Stats &amp; Race Alerts)</span>
                            </label>
                            <div id="brl-driver-select-wrap" style="padding-left:27px;">
                                <select id="brl-select-driver-target" class="brl-app-select">
                                    <option value="ALL">🌟 All Drivers (Notify for Any Driver Update)</option>
                                    ${driverOptionsHtml}
                                </select>
                            </div>
                        </div>

                        <!-- Toggle 4: Individual Franchise Team Notifications -->
                        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
                            <label style="display:flex; align-items:center; gap:10px; font-size:0.85rem; color:#eee; cursor:pointer;">
                                <input type="checkbox" id="brl-chk-team-alerts" style="accent-color:#ffcc00; width:17px; height:17px;">
                                <span><strong style="color:#ffcc00;">🏁 Franchise Team Notifications</strong> (Garage, Economy &amp; Team News)</span>
                            </label>
                            <div id="brl-team-select-wrap" style="padding-left:27px;">
                                <select id="brl-select-team-target" class="brl-app-select">
                                    <option value="ALL">🏆 All Franchise Teams (Notify for Any Team Update)</option>
                                    ${teamOptionsHtml}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button id="brl-test-alert-btn" class="brl-app-btn brl-app-btn-outline" style="font-size:0.8rem; padding:9px 12px;">
                        📨 Send Test Notification to My Device
                    </button>
                    <div id="brl-alert-feedback" style="display:none; margin-top:8px; font-size:0.82rem; color:#39ff14; text-align:center; font-weight:bold;"></div>
                </div>

                <!-- STEP 3: RECENT LEAGUE ALERTS FEED -->
                <div class="brl-app-section">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-family:'Outfit',sans-serif; font-size:0.85rem; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:1px;">
                            📡 Recent League Alerts &amp; Broadcasts
                        </span>
                        <span style="font-size:0.72rem; color:#39ff14;">● Live Sync</span>
                    </div>
                    <div id="brl-notif-feed-list" style="display:flex; flex-direction:column; gap:8px; max-height:210px; overflow-y:auto;">
                        <div style="color:#888; font-size:0.84rem; text-align:center; padding:14px;">Loading live league alerts...</div>
                    </div>
                </div>

                <!-- STEP 4: COMMISSIONER PUSH BROADCAST CONSOLE -->
                <details style="background:rgba(255,23,68,0.06); border:1px solid rgba(255,23,68,0.3); border-radius:10px; padding:12px;">
                    <summary style="font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:900; color:#ff4d6d; text-transform:uppercase; letter-spacing:1px; cursor:pointer;">
                        🔒 Commissioner Push Console (Send League, Driver or Team Alert)
                    </summary>
                    <div style="margin-top:12px; display:flex; flex-direction:column; gap:9px;">
                        <input type="password" id="brl-admin-push-pass" placeholder="Commissioner Passcode" style="padding:9px 12px; border-radius:6px; border:1px solid #333; background:#090b10; color:#fff; font-size:0.85rem;">
                        <button type="button" id="brl-admin-go-live-btn" class="brl-app-btn" style="background:#ff1744; color:#fff; font-size:0.8rem; padding:10px;">
                            🔴 Broadcast "Race Going Live NOW!" Alert
                        </button>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:4px;">
                            <div>
                                <span style="font-size:0.72rem; color:#00d4ff; font-weight:bold; text-transform:uppercase;">Target Driver (Optional)</span>
                                <select id="brl-admin-target-driver" class="brl-app-select" style="margin-top:3px;">
                                    <option value="">— Any / None —</option>
                                    ${driverOptionsHtml}
                                </select>
                            </div>
                            <div>
                                <span style="font-size:0.72rem; color:#ffcc00; font-weight:bold; text-transform:uppercase;">Target Team (Optional)</span>
                                <select id="brl-admin-target-team" class="brl-app-select" style="margin-top:3px;">
                                    <option value="">— Any / None —</option>
                                    ${teamOptionsHtml}
                                </select>
                            </div>
                        </div>

                        <input type="text" id="brl-admin-custom-title" placeholder="Alert Title (e.g. #12 Bill Harkins P10 Charge!)" style="padding:9px 12px; border-radius:6px; border:1px solid #333; background:#090b10; color:#fff; font-size:0.85rem;">
                        <input type="text" id="brl-admin-custom-body" placeholder="Alert Message Body..." style="padding:9px 12px; border-radius:6px; border:1px solid #333; background:#090b10; color:#fff; font-size:0.85rem;">
                        <input type="text" id="brl-admin-custom-url" placeholder="Target Page (e.g. /drivers.html or /teams.html)" value="/index.html" style="padding:9px 12px; border-radius:6px; border:1px solid #333; background:#090b10; color:#fff; font-size:0.85rem;">
                        <button type="button" id="brl-admin-send-custom-btn" class="brl-app-btn brl-app-btn-green" style="font-size:0.8rem; padding:10px;">
                            📢 Push Alert to App Users
                        </button>
                        <div id="brl-admin-push-msg" style="font-size:0.8rem; text-align:center; display:none;"></div>
                    </div>
                </details>
            </div>
        `;
        document.body.appendChild(backdrop);

        // Wire Drawer Events
        document.getElementById('brl-app-close-btn').onclick = closeAppDrawer;
        document.getElementById('brl-install-app-btn').onclick = handleInstallClick;
        document.getElementById('brl-toggle-alerts-btn').onclick = handleToggleAlerts;
        document.getElementById('brl-test-alert-btn').onclick = handleTestAlert;

        const chkSite = document.getElementById('brl-chk-site-updates');
        const chkRace = document.getElementById('brl-chk-race-live');
        const chkDriver = document.getElementById('brl-chk-driver-alerts');
        const selDriver = document.getElementById('brl-select-driver-target');
        const chkTeam = document.getElementById('brl-chk-team-alerts');
        const selTeam = document.getElementById('brl-select-team-target');

        chkSite.checked = prefSiteUpdates();
        chkRace.checked = prefRaceLive();
        chkDriver.checked = prefDriverEnabled();
        selDriver.value = prefDriverTarget();
        chkTeam.checked = prefTeamEnabled();
        selTeam.value = prefTeamTarget();

        document.getElementById('brl-driver-select-wrap').style.opacity = chkDriver.checked ? '1' : '0.45';
        document.getElementById('brl-team-select-wrap').style.opacity = chkTeam.checked ? '1' : '0.45';

        chkSite.onchange = () => localStorage.setItem(STORAGE_KEYS.PREF_SITE_UPDATES, String(chkSite.checked));
        chkRace.onchange = () => localStorage.setItem(STORAGE_KEYS.PREF_RACE_LIVE, String(chkRace.checked));
        chkDriver.onchange = () => {
            localStorage.setItem(STORAGE_KEYS.PREF_DRIVER_ALERTS, String(chkDriver.checked));
            document.getElementById('brl-driver-select-wrap').style.opacity = chkDriver.checked ? '1' : '0.45';
        };
        selDriver.onchange = () => localStorage.setItem(STORAGE_KEYS.PREF_DRIVER_TARGET, selDriver.value);

        chkTeam.onchange = () => {
            localStorage.setItem(STORAGE_KEYS.PREF_TEAM_ALERTS, String(chkTeam.checked));
            document.getElementById('brl-team-select-wrap').style.opacity = chkTeam.checked ? '1' : '0.45';
        };
        selTeam.onchange = () => localStorage.setItem(STORAGE_KEYS.PREF_TEAM_TARGET, selTeam.value);

        // Auto-fill target URL when Commissioner picks a driver or team
        const adminDrv = document.getElementById('brl-admin-target-driver');
        const adminTeam = document.getElementById('brl-admin-target-team');
        const adminUrl = document.getElementById('brl-admin-custom-url');
        const adminTitle = document.getElementById('brl-admin-custom-title');

        adminDrv.onchange = () => {
            if (adminDrv.value) {
                adminUrl.value = '/drivers.html';
                if (!adminTitle.value.trim()) {
                    adminTitle.value = `🏎️ Driver Alert: ${adminDrv.value}`;
                }
            }
        };
        adminTeam.onchange = () => {
            if (adminTeam.value) {
                adminUrl.value = '/teams.html';
                if (!adminTitle.value.trim()) {
                    adminTitle.value = `🏁 Team Alert: ${adminTeam.value}`;
                }
            }
        };

        document.getElementById('brl-admin-go-live-btn').onclick = () => sendCommissionerPush(true);
        document.getElementById('brl-admin-send-custom-btn').onclick = () => sendCommissionerPush(false);

        refreshAlertUIState();
    }

    function openAppDrawer() {
        isDrawerOpen = true;
        const backdrop = document.getElementById('brl-app-drawer-backdrop');
        if (backdrop) backdrop.style.display = 'flex';
        if (cachedNotifications.length > 0) {
            localStorage.setItem(STORAGE_KEYS.LAST_READ_ID, String(cachedNotifications[0].id));
            updateBadgeCount();
        }
        refreshAlertUIState();
        renderNotificationList();
    }

    window.openBrlAppModal = openAppDrawer;

    function closeAppDrawer() {
        isDrawerOpen = false;
        const backdrop = document.getElementById('brl-app-drawer-backdrop');
        if (backdrop) backdrop.style.display = 'none';
    }

    function updateBadgeCount() {
        const badge = document.getElementById('brl-app-fab-badge');
        if (!badge) return;
        const lastRead = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_READ_ID) || '0', 10);
        const unread = cachedNotifications.filter(n => (n.id || 0) > lastRead && shouldNotifyUserForAlert(n)).length;
        if (unread > 0) {
            badge.style.display = 'inline-flex';
            badge.textContent = unread > 9 ? '9+' : String(unread);
        } else {
            badge.style.display = 'none';
        }
    }

    function refreshAlertUIState() {
        const pill = document.getElementById('brl-notif-status-pill');
        const btn = document.getElementById('brl-toggle-alerts-btn');
        if (!pill || !btn) return;

        const enabled = isAlertsEnabled();
        if (enabled) {
            pill.textContent = '🟢 Alerts Active';
            pill.style.background = 'rgba(57,255,20,0.2)';
            pill.style.color = '#39ff14';
            btn.textContent = '🔕 Disable Lock-Screen Alerts';
            btn.className = 'brl-app-btn brl-app-btn-outline';
        } else {
            pill.textContent = '⚪ Alerts Off';
            pill.style.background = 'rgba(255,255,255,0.1)';
            pill.style.color = '#aaa';
            btn.textContent = '🔔 Enable Lock-Screen Alerts';
            btn.className = 'brl-app-btn brl-app-btn-green';
        }
    }

    async function handleInstallClick() {
        const guide = document.getElementById('brl-ios-install-guide');
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredInstallPrompt = null;
                document.getElementById('brl-install-app-btn').style.display = 'none';
            }
        } else {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (guide) {
                guide.style.display = 'block';
                guide.style.background = 'rgba(57, 255, 20, 0.14)';
                guide.style.border = '2px solid #39ff14';
                if (isIOS) {
                    guide.innerHTML = `
                        <strong style="color:#39ff14; font-size:0.95rem; display:block; margin-bottom:6px;">📲 PUT THE BRL ICON ON YOUR IPHONE HOME SCREEN:</strong>
                        1. Make sure you opened <strong>banditracingleague.net</strong> in <strong>Safari</strong>.<br>
                        2. Tap the <strong>Share button</strong> <span style="background:rgba(255,255,255,0.2); padding:2px 7px; border-radius:4px;">⎋</span> at the bottom of the screen.<br>
                        3. Scroll down and tap <strong>"Add to Home Screen"</strong> &rarr; tap <strong>"Add"</strong> in the top-right corner!
                    `;
                } else {
                    guide.innerHTML = `
                        <strong style="color:#39ff14; font-size:0.95rem; display:block; margin-bottom:6px;">📲 PUT THE BRL ICON ON YOUR ANDROID HOME SCREEN:</strong>
                        1. Tap the <strong>3 dots menu (⋮)</strong> in the <strong>top-right corner</strong> of your screen.<br>
                        2. If you are inside a chat app, tap <strong>"Open in Chrome"</strong> first.<br>
                        3. In Chrome, tap the <strong>3 dots (⋮)</strong> at top-right &rarr; tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>!
                    `;
                }
                guide.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    async function handleToggleAlerts() {
        const fb = document.getElementById('brl-alert-feedback');
        if (isAlertsEnabled()) {
            localStorage.setItem(STORAGE_KEYS.ALERTS_ENABLED, 'false');
            refreshAlertUIState();
            if (fb) {
                fb.style.display = 'block';
                fb.style.color = '#aaa';
                fb.textContent = 'Lock-screen alerts paused. You can re-enable them anytime.';
            }
            return;
        }

        if (!('Notification' in window)) {
            if (fb) {
                fb.style.display = 'block';
                fb.style.color = '#ffcc00';
                fb.textContent = 'To enable lock-screen alerts on iPhone, first tap Share -> Add to Home Screen, then open the BRL App from your home screen!';
            }
            return;
        }

        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
            localStorage.setItem(STORAGE_KEYS.ALERTS_ENABLED, 'true');
            refreshAlertUIState();
            if (fb) {
                fb.style.display = 'block';
                fb.style.color = '#39ff14';
                fb.textContent = '✅ BRL Live Alerts Enabled! Sending confirmation notification...';
            }
            await triggerNativeNotification(
                '🏁 Bandit Racing League Alerts Active!',
                'You will now be notified for Website Updates, Live Races, and your followed Drivers & Teams!',
                '/index.html',
                'brl-welcome-notif'
            );
        } else {
            if (fb) {
                fb.style.display = 'block';
                fb.style.color = '#ff4d6d';
                fb.textContent = 'Notification permission was blocked by your browser settings.';
            }
        }
    }

    async function handleTestAlert() {
        const fb = document.getElementById('brl-alert-feedback');
        if ('Notification' in window && Notification.permission !== 'granted') {
            await handleToggleAlerts();
        }
        const drv = prefDriverTarget();
        const tm = prefTeamTarget();
        const subInfo = (drv !== 'ALL' || tm !== 'ALL')
            ? `Following: ${drv !== 'ALL' ? drv : 'All Drivers'} | ${tm !== 'ALL' ? tm : 'All Teams'}.`
            : 'Following League-Wide Updates, Drivers & Teams.';

        const testObj = {
            id: Date.now(),
            category: drv !== 'ALL' ? 'driver_alert' : (tm !== 'ALL' ? 'team_alert' : 'race_live'),
            driver: drv !== 'ALL' ? drv : undefined,
            team: tm !== 'ALL' ? tm : undefined,
            title: '🔴 TEST ALERT: Bandit Racing League App!',
            body: `Your BRL App notifications are active! ${subInfo}`,
            url: '/simtrax.html'
        };
        showInAppToast(testObj);
        const sent = await triggerNativeNotification(testObj.title, testObj.body, testObj.url, 'brl-test-' + Date.now());
        if (fb) {
            fb.style.display = 'block';
            fb.style.color = '#39ff14';
            fb.textContent = sent
                ? '✅ Test notification sent to your device lock screen & banner!'
                : '✅ In-app alert banner triggered! (Enable browser notifications above for lock-screen alerts.)';
        }
    }

    function renderNotificationList() {
        const container = document.getElementById('brl-notif-feed-list');
        if (!container) return;

        if (!cachedNotifications || cachedNotifications.length === 0) {
            container.innerHTML = `<div style="color:#888; font-size:0.84rem; text-align:center; padding:12px;">No recent alerts yet.</div>`;
            return;
        }

        container.innerHTML = cachedNotifications.slice(0, 10).map(n => {
            const isLive = n.category === 'race_live';
            const isDriver = n.category === 'driver_alert' || !!n.driver;
            const isTeam = n.category === 'team_alert' || !!n.team;

            let badgeCol = '#39ff14';
            let badgeText = '🔄 SITE UPDATE';
            if (isLive) {
                badgeCol = '#ff1744';
                badgeText = '🔴 RACE LIVE';
            } else if (isDriver) {
                badgeCol = '#00d4ff';
                badgeText = `🏎️ DRIVER${n.driver ? ' • ' + n.driver : ''}`;
            } else if (isTeam) {
                badgeCol = '#ffcc00';
                badgeText = `🏁 TEAM${n.team ? ' • ' + n.team : ''}`;
            }

            return `
                <a href="${n.url || '/index.html'}" style="text-decoration:none; background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.1); border-left:3px solid ${badgeCol}; border-radius:8px; padding:10px 12px; display:block; transition:background 0.2s;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <span style="font-size:0.68rem; font-weight:900; color:${badgeCol}; letter-spacing:0.8px;">${badgeText}</span>
                        <span style="font-size:0.7rem; color:#888;">${n.dateLabel || ''}</span>
                    </div>
                    <div style="font-size:0.88rem; font-weight:700; color:#fff; margin-bottom:2px;">${n.title}</div>
                    <div style="font-size:0.8rem; color:#bbb; line-height:1.35;">${n.body}</div>
                </a>
            `;
        }).join('');
    }

    // 9. Commissioner Push Broadcast (Supports League-Wide, Driver-Specific, or Team-Specific Alerts)
    async function sendCommissionerPush(isQuickLive) {
        const pass = (document.getElementById('brl-admin-push-pass').value || '').trim();
        const msgEl = document.getElementById('brl-admin-push-msg');
        msgEl.style.display = 'block';

        if (pass.toLowerCase() !== 'bandit24' && pass.toLowerCase() !== 'bhark24') {
            msgEl.style.color = '#ff4d6d';
            msgEl.textContent = '❌ Invalid Commissioner Passcode.';
            return;
        }

        const targetDriver = (document.getElementById('brl-admin-target-driver').value || '').trim();
        const targetTeam = (document.getElementById('brl-admin-target-team').value || '').trim();

        let title, body, url, category;
        if (isQuickLive) {
            title = '🔴 LIVE NOW: Bandit Racing League Race Broadcast!';
            body = 'The cars are on track! Tap now to watch the live SimTrax broadcast on banditracingleague.net.';
            url = '/simtrax.html';
            category = 'race_live';
        } else {
            title = (document.getElementById('brl-admin-custom-title').value || '').trim();
            body = (document.getElementById('brl-admin-custom-body').value || '').trim();
            url = (document.getElementById('brl-admin-custom-url').value || '/index.html').trim();
            category = targetDriver ? 'driver_alert' : (targetTeam ? 'team_alert' : 'website_update');
            if (!title || !body) {
                msgEl.style.color = '#ffcc00';
                msgEl.textContent = 'Please enter both a title and message body.';
                return;
            }
        }

        msgEl.style.color = '#39ff14';
        msgEl.textContent = '⏳ Broadcasting push alert to BRL App users...';

        try {
            const getResp = await fetch(`${BRL_SUPABASE_URL}/rest/v1/league_data?id=eq.2`, {
                headers: {
                    'apikey': BRL_SUPABASE_KEY,
                    'Authorization': `Bearer ${BRL_SUPABASE_KEY}`
                }
            });
            const rows = await getResp.json();
            const rowData = (rows && rows[0] && rows[0].data) ? rows[0].data : {};
            const list = Array.isArray(rowData.appNotifications) ? rowData.appNotifications : [];

            const nowStr = new Date().toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
            });

            const newAlert = {
                id: Date.now(),
                category,
                title,
                body,
                url,
                dateLabel: nowStr
            };
            if (!isQuickLive && targetDriver) newAlert.driver = targetDriver;
            if (!isQuickLive && targetTeam) newAlert.team = targetTeam;

            list.unshift(newAlert);
            rowData.appNotifications = list.slice(0, 25);

            await fetch(`${BRL_SUPABASE_URL}/rest/v1/league_data?id=eq.2`, {
                method: 'PATCH',
                headers: {
                    'apikey': BRL_SUPABASE_KEY,
                    'Authorization': `Bearer ${BRL_SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    data: rowData,
                    updated_at: new Date().toISOString()
                })
            });

            msgEl.style.color = '#39ff14';
            msgEl.textContent = '✅ Alert broadcasted live to BRL App users!';
            await fetchAndProcessNotifications(false);
        } catch (err) {
            msgEl.style.color = '#ff4d6d';
            msgEl.textContent = 'Error broadcasting alert: ' + err.message;
        }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        const btn = document.getElementById('brl-install-app-btn');
        if (btn) btn.style.display = 'flex';
    });

    function initBrlApp() {
        injectPwaHeadTags();
        registerServiceWorker();
        buildAppWidgetUI();
        fetchAndProcessNotifications(true);
        checkWednesdayRaceLiveWindow();

        setInterval(() => {
            fetchAndProcessNotifications(false);
            checkWednesdayRaceLiveWindow();
        }, 30000);

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                fetchAndProcessNotifications(false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBrlApp);
    } else {
        initBrlApp();
    }
})();
