// Bandit Racing League — Mobile App (PWA), My BRL Profile, Outlaw Challenge Tracker & Real-Time Push Alert Engine
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
        PREF_PRACTICE_GATE: 'brl_app_pref_practice_gate_v1',
        PREF_RACE_LIVE: 'brl_app_pref_race_v1',
        PREF_DRIVER_ALERTS: 'brl_app_pref_driver_enabled_v1',
        PREF_DRIVER_TARGET: 'brl_app_pref_driver_target_v1',
        PREF_TEAM_ALERTS: 'brl_app_pref_team_enabled_v1',
        PREF_TEAM_TARGET: 'brl_app_pref_team_target_v1',
        LAST_NOTIF_ID: 'brl_app_last_notif_id_v1',
        LAST_READ_ID: 'brl_app_last_read_id_v1',
        LAST_AUTO_TUE_PRACTICE: 'brl_app_auto_tue_practice_v1',
        LAST_AUTO_WED_FANTASY: 'brl_app_auto_wed_fantasy_v1',
        LAST_AUTO_WED_PIT_GATE: 'brl_app_auto_wed_pit_gate_v1',
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
        ["pop-motorsports", "POP Motorsports"]
    ];

    const UPCOMING_RACES = [
        { tuesdayDate: '2026-10-27', date: '2026-10-28', track: 'Kansas Speedway', round: 'Chase Round 2 — Wendy Jo Memorial 110' },
        { tuesdayDate: '2026-11-03', date: '2026-11-04', track: 'Mid-Ohio Sports Car Course', round: 'Chase Round 3 — Road Course Showdown' },
        { tuesdayDate: '2026-11-10', date: '2026-11-11', track: 'Phoenix Raceway', round: 'Chase Round 4 — Desert Dogleg Elimination' },
        { tuesdayDate: '2026-11-17', date: '2026-11-18', track: 'Homestead-Miami Speedway', round: 'Season 16 Championship Finale' }
    ];

    let deferredInstallPrompt = null;
    let swRegistration = null;
    let cachedNotifications = [];
    let cachedOutlawStatus = null;
    let cachedDiscordWebhook = '';
    let isDrawerOpen = false;
    let dataScriptsLoaded = false;

    function normName(s) {
        return (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    // Dynamically load season16_stats_data.js & teams_data.js if the current page doesn't include them
    function ensureProfileDataScriptsLoaded(callback) {
        const needStats = typeof season16StatsData === 'undefined';
        const needTeams = typeof teamsData === 'undefined';
        if (!needStats && !needTeams) {
            if (callback) callback();
            return;
        }
        let pending = (needStats ? 1 : 0) + (needTeams ? 1 : 0);
        const done = () => {
            pending--;
            if (pending <= 0 && callback) callback();
        };
        if (needStats) {
            const s1 = document.createElement('script');
            s1.src = '/season16_stats_data.js?v=' + Date.now();
            s1.onload = done;
            s1.onerror = done;
            document.head.appendChild(s1);
        }
        if (needTeams) {
            const s2 = document.createElement('script');
            s2.src = '/teams_data.js?v=' + Date.now();
            s2.onload = done;
            s2.onerror = done;
            document.head.appendChild(s2);
        }
    }

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
                .filter(t => !t.isForSale && !t.isSuspended)
                .map(t => [t.id, t.name]);
            if (list.length > 0) return list;
        }
        return DEFAULT_TEAMS;
    }

    // 1. Ensure PWA head tags exist on every page & unlock screen rotation
    function injectPwaHeadTags() {
        try {
            if (window.screen && window.screen.orientation && typeof window.screen.orientation.unlock === 'function') {
                window.screen.orientation.unlock();
            }
        } catch (e) {}

        let manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) {
            manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            document.head.appendChild(manifestLink);
        }
        manifestLink.href = '/manifest.json?v=3';
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

    // 2. Register Service Worker & Periodic Background Sync
    async function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                swRegistration.update().catch(() => {});
                if (swRegistration.periodicSync) {
                    try {
                        await swRegistration.periodicSync.register('brl-check-alerts', {
                            minInterval: 15 * 60 * 1000
                        });
                    } catch (e) {}
                }
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
    function prefPracticeGate() {
        const val = localStorage.getItem(STORAGE_KEYS.PREF_PRACTICE_GATE);
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

    function shouldNotifyUserForAlert(notif) {
        if (!notif) return false;
        const textUpper = ((notif.title || '') + ' ' + (notif.body || '')).toUpperCase();

        const notifDriver = (notif.driver || '').trim().toUpperCase();
        const userDriverTarget = prefDriverTarget().toUpperCase();

        if (notif.category === 'driver_alert' || notifDriver) {
            if (!prefDriverEnabled()) return false;
            if (userDriverTarget === 'ALL') return true;
            return notifDriver === userDriverTarget || textUpper.includes(userDriverTarget);
        }

        const notifTeam = (notif.team || '').trim().toUpperCase();
        const userTeamTarget = prefTeamTarget().toUpperCase();

        if (notif.category === 'team_alert' || notifTeam) {
            if (!prefTeamEnabled()) return false;
            if (userTeamTarget === 'ALL') return true;
            return notifTeam === userTeamTarget || textUpper.includes(userTeamTarget);
        }

        if (prefDriverEnabled() && userDriverTarget !== 'ALL' && textUpper.includes(userDriverTarget)) {
            return true;
        }
        if (prefTeamEnabled() && userTeamTarget !== 'ALL' && textUpper.includes(userTeamTarget)) {
            return true;
        }

        if (notif.category === 'practice_open' || notif.category === 'pit_gate_open' || notif.category === 'fantasy_lock') {
            return prefPracticeGate();
        }

        if (notif.category === 'race_live' || notif.category === 'outlaw_challenge') {
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
        const isPractice = notif.category === 'practice_open';
        const isPitGate = notif.category === 'pit_gate_open';
        const isFantasy = notif.category === 'fantasy_lock';
        const isOutlaw = notif.category === 'outlaw_challenge';
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
        } else if (isOutlaw) {
            borderCol = '#ff0055';
            badgeBg = 'rgba(255,0,85,0.25)';
            badgeColor = '#ff4d88';
            badgeLabel = '🔥 BACK-ROW OUTLAW CHALLENGE';
        } else if (isFantasy) {
            borderCol = '#ff9100';
            badgeBg = 'rgba(255,145,0,0.25)';
            badgeColor = '#ffab40';
            badgeLabel = '⚠️ FANTASY PICKS LOCK REMINDER';
        } else if (isPractice) {
            borderCol = '#39ff14';
            badgeBg = 'rgba(57,255,20,0.25)';
            badgeColor = '#39ff14';
            badgeLabel = '🟢 TUESDAY PRACTICE OPEN';
        } else if (isPitGate) {
            borderCol = '#ffcc00';
            badgeBg = 'rgba(255,204,0,0.25)';
            badgeColor = '#ffcc00';
            badgeLabel = '🏁 WEDNESDAY PIT GATE OPEN';
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
                <a href="${notif.url || '/index.html'}" style="background:${borderCol}; color:${(isLive || isOutlaw) ? '#fff' : '#000'}; text-decoration:none; font-weight:900; font-size:0.78rem; padding:6px 14px; border-radius:6px; text-transform:uppercase; letter-spacing:0.5px;">
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

    // Mirror alert to Discord Webhook if configured
    async function postAlertToDiscordWebhook(webhookUrl, notif) {
        if (!webhookUrl || !webhookUrl.startsWith('https://discord')) return;
        try {
            const colorMap = {
                race_live: 0xFF1744,
                practice_open: 0x39FF14,
                pit_gate_open: 0xFFCC00,
                fantasy_lock: 0xFF9100,
                outlaw_challenge: 0xFF0055,
                driver_alert: 0x00D4FF,
                team_alert: 0xFFCC00,
                website_update: 0x39FF14
            };
            const relUrl = notif.url || '/index.html';
            const fullUrl = relUrl.startsWith('http')
                ? relUrl
                : `https://banditracingleague.net${relUrl.startsWith('/') ? relUrl : '/' + relUrl}`;

            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'BRL Outlaw App Alerts',
                    avatar_url: 'https://banditracingleague.net/assets/app-icon-192.png',
                    embeds: [{
                        title: notif.title,
                        description: `${notif.body}\n\n🔗 **[Open in BRL App / Website](${fullUrl})**`,
                        url: fullUrl,
                        color: colorMap[notif.category] || 0x39FF14,
                        thumbnail: { url: 'https://banditracingleague.net/assets/app-icon-192.png' },
                        footer: { text: `Bandit Racing League Mobile App • ${notif.dateLabel || ''}` }
                    }]
                })
            });
        } catch (e) {}
    }

    // 6. Fetch Official Notifications & Outlaw Challenge Status from Supabase (league_data?id=eq.2)
    async function fetchAndProcessNotifications(isInitialLoad) {
        try {
            const resp = await fetch(`${BRL_SUPABASE_URL}/rest/v1/league_data?id=eq.2`, {
                headers: {
                    'apikey': BRL_SUPABASE_KEY,
                    'Authorization': `Bearer ${BRL_SUPABASE_KEY}`
                },
                cache: 'no-store'
            });
            if (!resp.ok) return;
            const rows = await resp.json();
            if (!rows || !rows.length || !rows[0].data) return;

            const rowData = rows[0].data;
            const notifs = Array.isArray(rowData.appNotifications) ? rowData.appNotifications : [];
            cachedNotifications = notifs.slice().sort((a, b) => (b.id || 0) - (a.id || 0));

            if (rowData.outlawChallengeStatus) {
                cachedOutlawStatus = rowData.outlawChallengeStatus;
                renderOutlawChallengeBanner();
            }
            if (rowData.discordWebhookUrl) {
                cachedDiscordWebhook = rowData.discordWebhookUrl;
                const whInput = document.getElementById('brl-admin-discord-webhook');
                if (whInput && !whInput.value) whInput.value = cachedDiscordWebhook;
            }

            updateBadgeCount();
            if (isDrawerOpen) renderNotificationList();

            if (cachedNotifications.length === 0) return;

            const latest = cachedNotifications[0];
            const lastSeenId = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_NOTIF_ID) || '0', 10);

            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SYNC_LAST_SEEN_ID',
                    id: latest.id
                });
            }

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
        } catch (err) {}
    }

    async function autoPublishScheduledAlert(dedupKey, notifObj) {
        try {
            const getResp = await fetch(`${BRL_SUPABASE_URL}/rest/v1/league_data?id=eq.2`, {
                headers: {
                    'apikey': BRL_SUPABASE_KEY,
                    'Authorization': `Bearer ${BRL_SUPABASE_KEY}`
                },
                cache: 'no-store'
            });
            if (!getResp.ok) return;
            const rows = await getResp.json();
            const rowData = (rows && rows[0] && rows[0].data) ? rows[0].data : {};
            const autoKeys = (rowData.autoFiredKeys && typeof rowData.autoFiredKeys === 'object')
                ? rowData.autoFiredKeys
                : {};

            if (!autoKeys[dedupKey]) {
                autoKeys[dedupKey] = new Date().toISOString();
                rowData.autoFiredKeys = autoKeys;
                const list = Array.isArray(rowData.appNotifications) ? rowData.appNotifications : [];
                list.unshift(notifObj);
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
                if (rowData.discordWebhookUrl) {
                    postAlertToDiscordWebhook(rowData.discordWebhookUrl, notifObj);
                }
            }
        } catch (err) {}
    }

    // 7. Automatic Scheduled Alerts:
    //    - Tuesday Night Practice Open (Tuesday 8:00 PM - 10:30 PM ET)
    //    - Wednesday 7:30 PM Fantasy Picks Lock Reminder (Wednesday 7:30 PM - 7:59 PM ET)
    //    - Wednesday Night Pit Gate & Practice Open (Wednesday 8:00 PM - 8:59 PM ET)
    //    - Wednesday Night Race Broadcast Live (Wednesday 9:00 PM - 10:30 PM ET)
    async function checkScheduledRaceWindows() {
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

            // WINDOW A: Tuesday Night Practice Session Open (8:00 PM - 10:30 PM ET)
            const tuesdayRace = UPCOMING_RACES.find(r => r.tuesdayDate === dateStr);
            if (tuesdayRace && totalMins >= 20 * 60 && totalMins <= 22 * 60 + 30) {
                const alreadyFired = localStorage.getItem(STORAGE_KEYS.LAST_AUTO_TUE_PRACTICE);
                if (alreadyFired !== dateStr) {
                    localStorage.setItem(STORAGE_KEYS.LAST_AUTO_TUE_PRACTICE, dateStr);
                    const pracNotif = {
                        id: Date.now(),
                        category: 'practice_open',
                        title: `🟢 TUESDAY PRACTICE OPEN: ${tuesdayRace.track}!`,
                        body: `The pit gate for official Tuesday Night practice for tomorrow's ${tuesdayRace.round} at ${tuesdayRace.track} is now OPEN!`,
                        url: '/schedule.html',
                        dateLabel: 'Tuesday Practice'
                    };
                    await autoPublishScheduledAlert(`tue_practice_${dateStr}`, pracNotif);
                    if (prefPracticeGate()) {
                        showInAppToast(pracNotif);
                        if (isAlertsEnabled()) {
                            triggerNativeNotification(pracNotif.title, pracNotif.body, pracNotif.url, 'brl-tue-prac-' + dateStr);
                        }
                    }
                }
            }

            const wednesdayRace = UPCOMING_RACES.find(r => r.date === dateStr);
            if (!wednesdayRace) return;

            // WINDOW B1: Wednesday 7:30 PM Fantasy Picks Lock Reminder (7:30 PM - 7:59 PM ET)
            if (totalMins >= 19 * 60 + 30 && totalMins <= 19 * 60 + 59) {
                const alreadyFiredFantasy = localStorage.getItem(STORAGE_KEYS.LAST_AUTO_WED_FANTASY);
                if (alreadyFiredFantasy !== dateStr) {
                    localStorage.setItem(STORAGE_KEYS.LAST_AUTO_WED_FANTASY, dateStr);
                    const fanNotif = {
                        id: Date.now(),
                        category: 'fantasy_lock',
                        title: `⚠️ 90 MINS LEFT: Lock In Your ${wednesdayRace.track} Fantasy Picks!`,
                        body: `Fantasy picks for tonight's ${wednesdayRace.round} at ${wednesdayRace.track} lock at 9:00 PM EST! Tap now to submit your lineup.`,
                        url: '/fantasy.html',
                        dateLabel: 'Fantasy Lock Reminder'
                    };
                    await autoPublishScheduledAlert(`wed_fantasy_${dateStr}`, fanNotif);
                    if (prefPracticeGate()) {
                        showInAppToast(fanNotif);
                        if (isAlertsEnabled()) {
                            triggerNativeNotification(fanNotif.title, fanNotif.body, fanNotif.url, 'brl-wed-fantasy-' + dateStr);
                        }
                    }
                }
            }

            // WINDOW B2: Wednesday Night Pit Gate & Practice Open (8:00 PM - 8:59 PM ET)
            if (totalMins >= 20 * 60 && totalMins <= 20 * 60 + 59) {
                const alreadyFiredGate = localStorage.getItem(STORAGE_KEYS.LAST_AUTO_WED_PIT_GATE);
                if (alreadyFiredGate !== dateStr) {
                    localStorage.setItem(STORAGE_KEYS.LAST_AUTO_WED_PIT_GATE, dateStr);
                    const gateNotif = {
                        id: Date.now(),
                        category: 'pit_gate_open',
                        title: `🏁 PIT GATE OPEN: Wednesday Race Session at ${wednesdayRace.track}!`,
                        body: `The pit gate for tonight's ${wednesdayRace.round} at ${wednesdayRace.track} is officially OPEN and practice has begun!`,
                        url: '/index.html',
                        dateLabel: 'Pit Gate Open'
                    };
                    await autoPublishScheduledAlert(`wed_pit_gate_${dateStr}`, gateNotif);
                    if (prefPracticeGate()) {
                        showInAppToast(gateNotif);
                        if (isAlertsEnabled()) {
                            triggerNativeNotification(gateNotif.title, gateNotif.body, gateNotif.url, 'brl-wed-gate-' + dateStr);
                        }
                    }
                }
            }

            // WINDOW C: Wednesday Night Race Going Live (9:00 PM - 10:30 PM ET)
            if (totalMins >= 21 * 60 && totalMins <= 22 * 60 + 30) {
                const alreadyFiredLive = localStorage.getItem(STORAGE_KEYS.LAST_AUTO_LIVE_DATE);
                if (alreadyFiredLive !== dateStr) {
                    localStorage.setItem(STORAGE_KEYS.LAST_AUTO_LIVE_DATE, dateStr);
                    const liveNotif = {
                        id: Date.now(),
                        category: 'race_live',
                        title: `🔴 LIVE NOW: BRL at ${wednesdayRace.track}!`,
                        body: `${wednesdayRace.round} is going LIVE! Tap to watch the SimTrax broadcast.`,
                        url: '/simtrax.html',
                        dateLabel: 'Live Broadcast'
                    };
                    await autoPublishScheduledAlert(`wed_live_${dateStr}`, liveNotif);
                    if (prefRaceLive()) {
                        showInAppToast(liveNotif);
                        if (isAlertsEnabled()) {
                            triggerNativeNotification(liveNotif.title, liveNotif.body, liveNotif.url, 'brl-race-live-' + dateStr);
                        }
                    }
                }
            }
        } catch (e) {}
    }

    // Update live Fantasy Lock Countdown inside the App Drawer
    function updateFantasyCountdownBanner() {
        const el = document.getElementById('brl-fantasy-countdown-text');
        if (!el) return;
        const now = new Date();
        // Find next upcoming race Wednesday 9:00 PM ET
        let nextRace = null;
        let targetDate = null;
        for (const r of UPCOMING_RACES) {
            // 9:00 PM US/Eastern (EDT -04:00 through Oct 28; EST -05:00 in November)
            const tzOffset = r.date >= '2026-11-01' ? '-05:00' : '-04:00';
            const dt = new Date(`${r.date}T21:00:00${tzOffset}`);
            if (dt.getTime() + 2 * 3600 * 1000 > now.getTime()) {
                nextRace = r;
                targetDate = dt;
                break;
            }
        }
        if (!nextRace || !targetDate) {
            el.innerHTML = `Season 16 Weekly Viewer Fantasy League &bull; Lock in your picks before Green Flag!`;
            return;
        }
        const diffMs = targetDate.getTime() - now.getTime();
        if (diffMs <= 0) {
            el.innerHTML = `<strong style="color:#ff1744;">🔴 ${nextRace.track} Fantasy Lineups LOCKED (Race In Progress!)</strong>`;
            return;
        }
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
        const timeStr = days > 0 ? `${days}d ${hours}h ${mins}m` : `${hours}h ${mins}m`;
        el.innerHTML = `Next Lock: <strong style="color:#fff;">${nextRace.track}</strong> in <strong style="color:#ffab40;">${timeStr}</strong> (Wed 9:00 PM EST)`;
    }

    // Render "My BRL Profile" Quick-Dashboard inside the App Drawer (#2)
    function renderMyBrlProfileCard() {
        const container = document.getElementById('brl-my-profile-content');
        if (!container) return;

        ensureProfileDataScriptsLoaded(() => {
            const drvTarget = prefDriverTarget();
            const teamTarget = prefTeamTarget();

            let drvObj = null;
            if (typeof season16StatsData !== 'undefined' && Array.isArray(season16StatsData.drivers)) {
                if (drvTarget && drvTarget !== 'ALL') {
                    const targetNorm = normName(drvTarget);
                    drvObj = season16StatsData.drivers.find(
                        d => normName(d.rosterName) === targetNorm || normName(d.name) === targetNorm
                    );
                }
                if (!drvObj) {
                    drvObj = season16StatsData.drivers[0]; // Default to Championship Points Leader
                }
            }

            let teamObj = null;
            if (typeof teamsData !== 'undefined' && Array.isArray(teamsData.teams)) {
                const activeTeams = teamsData.teams.filter(t => !t.isForSale && !t.isSuspended);
                if (teamTarget && teamTarget !== 'ALL') {
                    const tNorm = normName(teamTarget);
                    teamObj = activeTeams.find(t => normName(t.name) === tNorm || normName(t.id) === tNorm);
                }
                if (!teamObj && drvObj && drvObj.team) {
                    const dtNorm = normName(drvObj.team.replace('(Backup)', ''));
                    teamObj = activeTeams.find(t => normName(t.name) === dtNorm);
                }
                if (!teamObj && activeTeams.length > 0) {
                    teamObj = activeTeams.slice().sort((a, b) => (b.points || 0) - (a.points || 0))[0];
                }
            }

            const drvHeaderLabel = (drvTarget && drvTarget !== 'ALL')
                ? '🏎️ MY FOLLOWED DRIVER'
                : '🏎️ FEATURED POINTS LEADER (Select Driver Below to Customize)';

            const teamHeaderLabel = (teamTarget && teamTarget !== 'ALL')
                ? '🏁 MY FOLLOWED FRANCHISE'
                : '🏁 FEATURED FRANCHISE TEAM (Select Team Below to Customize)';

            const drvHtml = drvObj ? `
                <div style="background:rgba(0,212,255,0.06); border:1px solid rgba(0,212,255,0.3); border-radius:8px; padding:10px 12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:0.68rem; font-weight:900; color:#00d4ff; letter-spacing:0.8px; text-transform:uppercase;">${drvHeaderLabel}</span>
                        <a href="/drivers.html" style="font-size:0.7rem; color:#00d4ff; text-decoration:none; font-weight:700;">Roster &amp; H2H &rarr;</a>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
                        <div style="font-family:'Outfit',sans-serif; font-weight:900; font-size:1.05rem; color:#fff;">
                            <span style="color:#39ff14;">#${drvObj.carNumber}</span> ${drvObj.name}
                            ${drvObj.isChase ? '<span style="background:#ffcc00; color:#000; font-size:0.62rem; padding:1px 6px; border-radius:4px; margin-left:6px; vertical-align:middle;">🏆 CHASE</span>' : ''}
                        </div>
                        <span style="font-size:0.78rem; color:#ccc; font-weight:700;">Rank: <strong style="color:#39ff14;">P${drvObj.rank}</strong> &bull; <strong style="color:#fff;">${drvObj.points.toLocaleString()} pts</strong></span>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; text-align:center; background:rgba(0,0,0,0.45); padding:6px; border-radius:6px;">
                        <div><div style="font-size:0.62rem; color:#888; text-transform:uppercase;">Starts</div><div style="font-size:0.82rem; font-weight:900; color:#fff;">${drvObj.starts}</div></div>
                        <div><div style="font-size:0.62rem; color:#888; text-transform:uppercase;">Wins</div><div style="font-size:0.82rem; font-weight:900; color:#39ff14;">${drvObj.wins}</div></div>
                        <div><div style="font-size:0.62rem; color:#888; text-transform:uppercase;">Top 5</div><div style="font-size:0.82rem; font-weight:900; color:#00d4ff;">${drvObj.top5}</div></div>
                        <div><div style="font-size:0.62rem; color:#888; text-transform:uppercase;">Top 10</div><div style="font-size:0.82rem; font-weight:900; color:#fff;">${drvObj.top10}</div></div>
                        <div><div style="font-size:0.62rem; color:#888; text-transform:uppercase;">Avg Fin</div><div style="font-size:0.82rem; font-weight:900; color:#ffcc00;">${drvObj.avgFinish || '--'}</div></div>
                    </div>
                </div>
            ` : '';

            const bankVal = teamObj && typeof teamObj.bankBalance === 'number'
                ? '$' + teamObj.bankBalance.toLocaleString()
                : '$0';
            const primaryList = teamObj && Array.isArray(teamObj.primaryDrivers)
                ? teamObj.primaryDrivers.filter(d => d && d !== 'VACANT').join(', ')
                : '--';

            const teamHtml = teamObj ? `
                <div style="background:rgba(255,204,0,0.06); border:1px solid rgba(255,204,0,0.3); border-radius:8px; padding:10px 12px; margin-top:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:0.68rem; font-weight:900; color:#ffcc00; letter-spacing:0.8px; text-transform:uppercase;">${teamHeaderLabel}</span>
                        <a href="/teams.html" style="font-size:0.7rem; color:#ffcc00; text-decoration:none; font-weight:700;">Franchise HQ &rarr;</a>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:4px;">
                        <div style="font-family:'Outfit',sans-serif; font-weight:900; font-size:1rem; color:#fff;">
                            ${teamObj.name} <span style="font-size:0.72rem; color:#aaa; font-weight:400;">(Owner: ${teamObj.owner || 'TBD'})</span>
                        </div>
                        <span style="font-size:0.8rem; font-weight:900; color:#39ff14;">Bank: ${bankVal}</span>
                    </div>
                    <div style="font-size:0.75rem; color:#bbb;">
                        <strong>Points:</strong> ${(teamObj.points || 0).toLocaleString()} &bull; <strong>Home:</strong> ${teamObj.homeLocation || 'USA'}<br>
                        <span style="color:#999;">Drivers: ${primaryList}</span>
                    </div>
                </div>
            ` : '';

            container.innerHTML = drvHtml + teamHtml;
        });
    }

    // Render Live Back-Row Outlaw Challenge Status Banner (#5)
    function renderOutlawChallengeBanner() {
        const el = document.getElementById('brl-outlaw-live-banner');
        const pageBanner = document.getElementById('season17-live-outlaw-banner');
        const st = cachedOutlawStatus || {
            pot: 3,
            challenger: 'TBD (Post-Qualifying)',
            status: 'AWAITING QUALIFYING OFFER',
            detail: 'Previous Race Winner & Pole Winner eligible after Qualifying (!eol)'
        };

        const html = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <span style="font-family:'Outfit',sans-serif; font-size:0.76rem; font-weight:900; color:#ff4d88; text-transform:uppercase; letter-spacing:0.8px;">
                    🔥 Back-Row Outlaw Challenge Live Tracker
                </span>
                <span style="background:rgba(255,0,85,0.22); border:1px solid #ff0055; color:#fff; font-size:0.7rem; font-weight:900; padding:2px 8px; border-radius:12px;">
                    Pot: +${st.pot} Bonus Pts
                </span>
            </div>
            <div style="font-size:0.83rem; color:#fff; font-weight:700; margin-top:4px;">
                Status: <span style="color:#ffcc00;">${st.status}</span> ${st.challenger ? ' &bull; ' + st.challenger : ''}
            </div>
            <div style="font-size:0.75rem; color:#bbb; margin-top:2px;">${st.detail || ''}</div>
        `;
        if (el) el.innerHTML = html;
        if (pageBanner) pageBanner.innerHTML = html;
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
                max-width: 560px;
                max-height: 92vh;
                overflow-y: auto;
                padding: 22px;
                color: #fff;
                font-family: 'Roboto', sans-serif;
                box-shadow: 0 20px 60px rgba(0,0,0,0.95), 0 0 35px rgba(57,255,20,0.2);
                position: relative;
            }
            .brl-app-section {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 14px 16px;
                margin-bottom: 14px;
            }
            .brl-app-btn {
                width: 100%;
                padding: 11px 16px;
                border-radius: 8px;
                font-family: 'Outfit', sans-serif;
                font-weight: 900;
                font-size: 0.9rem;
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

        const fab = document.createElement('button');
        fab.id = 'brl-app-fab';
        fab.title = 'Open BRL Mobile App, My Profile & Live Alerts';
        fab.innerHTML = `
            <span style="font-size:1.1rem;">📲</span>
            <span>BRL App &amp; Alerts</span>
            <span id="brl-app-fab-badge">0</span>
        `;
        fab.onclick = openAppDrawer;
        document.body.appendChild(fab);

        const driversList = getActiveDriversList();
        const driverOptionsHtml = driversList
            .map(([name, num]) => `<option value="${name}">#${num} — ${name}</option>`)
            .join('');

        const teamsList = getActiveTeamsList();
        const teamOptionsHtml = teamsList
            .map(([id, name]) => `<option value="${name}">${name}</option>`)
            .join('');

        const potOptionsHtml = Array.from({ length: 15 }, (_, i) => i + 3)
            .map(p => `<option value="${p}">+${p} Bonus Points Pot${p === 17 ? ' (Season 17 Max Cap)' : ''}</option>`)
            .join('');

        const backdrop = document.createElement('div');
        backdrop.id = 'brl-app-drawer-backdrop';
        backdrop.onclick = (e) => {
            if (e.target === backdrop) closeAppDrawer();
        };

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        backdrop.innerHTML = `
            <div id="brl-app-drawer">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(57,255,20,0.25); padding-bottom:12px; margin-bottom:14px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="/assets/app-icon-192.png" alt="BRL App" style="width:44px; height:44px; border-radius:10px; border:1px solid #39ff14;">
                        <div>
                            <h3 style="margin:0; font-family:'Outfit',sans-serif; font-size:1.3rem; font-style:italic; text-transform:uppercase; color:#fff;">
                                BANDIT <span style="color:#39ff14;">MOBILE APP</span> &amp; ALERTS
                            </h3>
                            <span style="font-size:0.76rem; color:#aaa;">Official League Companion &bull; Live Profile, Fantasy &amp; Push Alerts</span>
                        </div>
                    </div>
                    <button id="brl-app-close-btn" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; width:34px; height:34px; border-radius:8px; cursor:pointer; font-size:1rem;">✕</button>
                </div>

                <!-- LIVE FANTASY COUNTDOWN & 1-TAP PICK BUTTON (#1) -->
                <div style="background:linear-gradient(135deg, rgba(255,145,0,0.16), rgba(15,18,26,0.95)); border:1.5px solid #ff9100; border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div style="flex:1; min-width:200px;">
                        <div style="font-family:'Outfit',sans-serif; font-size:0.74rem; font-weight:900; color:#ffab40; text-transform:uppercase; letter-spacing:0.8px;">
                            🎯 Weekly Viewer Fantasy Lock Countdown (Auto-Reminder Wed @ 7:30 PM EST)
                        </div>
                        <div id="brl-fantasy-countdown-text" style="font-size:0.82rem; color:#ddd; margin-top:2px;">
                            Calculating next Wednesday 9:00 PM EST lock...
                        </div>
                    </div>
                    <a href="/fantasy.html" style="background:#ff9100; color:#000; text-decoration:none; font-family:'Outfit',sans-serif; font-weight:900; font-size:0.76rem; padding:7px 12px; border-radius:6px; text-transform:uppercase; white-space:nowrap;">
                        Make Picks &rarr;
                    </a>
                </div>

                <!-- MY BRL PROFILE QUICK-DASHBOARD (#2) -->
                <div class="brl-app-section" style="border-color: rgba(0,212,255,0.35);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:900; color:#00d4ff; text-transform:uppercase; letter-spacing:1px;">
                            🏆 My BRL Profile &amp; Live Standings Snapshot
                        </span>
                        <span style="font-size:0.68rem; color:#aaa;">Synced with SimRacerHub &amp; Franchise HQ</span>
                    </div>
                    <div id="brl-my-profile-content">
                        <div style="color:#888; font-size:0.82rem; text-align:center; padding:8px;">Loading driver &amp; franchise profile...</div>
                    </div>
                    <div id="brl-outlaw-live-banner" style="margin-top:8px; background:rgba(255,0,85,0.08); border:1px solid rgba(255,0,85,0.35); border-radius:8px; padding:9px 12px;"></div>
                </div>

                <!-- STEP 1: INSTALL APP TO HOME SCREEN -->
                <div class="brl-app-section" style="border-color: rgba(57,255,20,0.35); ${isStandalone ? 'display:none;' : ''}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:900; color:#39ff14; text-transform:uppercase; letter-spacing:1px;">
                            📲 Install BRL App to Your Phone
                        </span>
                        <span id="brl-install-status-pill" style="font-size:0.7rem; padding:2px 8px; border-radius:12px; background:rgba(255,204,0,0.15); color:#ffcc00; font-weight:700;">
                            No App Store Needed
                        </span>
                    </div>
                    <p style="color:#ccc; font-size:0.83rem; line-height:1.4; margin:0 0 10px 0;">
                        Add the <strong>Bandit Racing League App</strong> to your phone's home screen for 1-tap full-screen access and lock-screen push alerts.
                    </p>
                    <button id="brl-install-app-btn" class="brl-app-btn brl-app-btn-green">
                        📲 Install BRL App Now
                    </button>
                    <div id="brl-ios-install-guide" style="display:${isIOS && !isStandalone ? 'block' : 'none'}; margin-top:10px; padding:12px; border-radius:8px; background:rgba(0,212,255,0.1); border:1px solid rgba(0,212,255,0.35); font-size:0.82rem; color:#e5e7eb; line-height:1.5;">
                        <strong style="color:#00d4ff; display:block; margin-bottom:4px;">🍏 How to Install on iPhone / iPad (iOS):</strong>
                        1. Tap the <strong>Share</strong> button <span style="background:rgba(255,255,255,0.15); padding:1px 6px; border-radius:4px;">⎋</span> at the bottom of Safari.<br>
                        2. Scroll down and tap <strong>"Add to Home Screen"</strong> <span style="background:rgba(255,255,255,0.15); padding:1px 6px; border-radius:4px;">＋</span>.
                    </div>
                </div>

                <!-- STEP 2: PUSH NOTIFICATION CONTROLS & DRIVER/TEAM SELECTORS -->
                <div class="brl-app-section" style="border-color: rgba(255,204,0,0.35);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:900; color:#ffcc00; text-transform:uppercase; letter-spacing:1px;">
                            🔔 Live Push Alert &amp; Profile Settings
                        </span>
                        <span id="brl-notif-status-pill" style="font-size:0.7rem; padding:2px 8px; border-radius:12px; font-weight:700;"></span>
                    </div>

                    <button id="brl-toggle-alerts-btn" class="brl-app-btn brl-app-btn-green" style="margin-bottom:10px;">
                        🔔 Enable Lock-Screen Alerts
                    </button>

                    <div style="display:flex; flex-direction:column; gap:9px; margin-bottom:10px; padding:11px; background:rgba(0,0,0,0.45); border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
                        <label style="display:flex; align-items:center; gap:10px; font-size:0.84rem; color:#eee; cursor:pointer;">
                            <input type="checkbox" id="brl-chk-site-updates" style="accent-color:#39ff14; width:17px; height:17px;">
                            <span><strong>🔄 Website Update Alerts</strong> (Standings, Fantasy &amp; Recaps)</span>
                        </label>

                        <label style="display:flex; align-items:center; gap:10px; font-size:0.84rem; color:#eee; cursor:pointer;">
                            <input type="checkbox" id="brl-chk-practice-gate" style="accent-color:#39ff14; width:17px; height:17px;">
                            <span><strong>🟢 Practice, Pit Gate &amp; Fantasy Lock</strong> (Tue/Wed @ 7:30 &amp; 8:00 PM EST)</span>
                        </label>

                        <label style="display:flex; align-items:center; gap:10px; font-size:0.84rem; color:#eee; cursor:pointer;">
                            <input type="checkbox" id="brl-chk-race-live" style="accent-color:#ff1744; width:17px; height:17px;">
                            <span><strong>🔴 Live Broadcast &amp; Outlaw Challenge</strong> (Wed @ 9:00 PM EST)</span>
                        </label>

                        <!-- Individual Driver Notifications & Profile Selector -->
                        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
                            <label style="display:flex; align-items:center; gap:10px; font-size:0.84rem; color:#eee; cursor:pointer;">
                                <input type="checkbox" id="brl-chk-driver-alerts" style="accent-color:#00d4ff; width:17px; height:17px;">
                                <span><strong style="color:#00d4ff;">🏎️ Individual Driver Notifications &amp; Profile</strong></span>
                            </label>
                            <div id="brl-driver-select-wrap" style="padding-left:27px;">
                                <select id="brl-select-driver-target" class="brl-app-select">
                                    <option value="ALL">🌟 All Drivers (Notify for Any Driver Update)</option>
                                    ${driverOptionsHtml}
                                </select>
                            </div>
                        </div>

                        <!-- Individual Franchise Team Notifications & Profile Selector -->
                        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
                            <label style="display:flex; align-items:center; gap:10px; font-size:0.84rem; color:#eee; cursor:pointer;">
                                <input type="checkbox" id="brl-chk-team-alerts" style="accent-color:#ffcc00; width:17px; height:17px;">
                                <span><strong style="color:#ffcc00;">🏁 Franchise Team Notifications &amp; Profile</strong></span>
                            </label>
                            <div id="brl-team-select-wrap" style="padding-left:27px;">
                                <select id="brl-select-team-target" class="brl-app-select">
                                    <option value="ALL">🏆 All Franchise Teams (Notify for Any Team Update)</option>
                                    ${teamOptionsHtml}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button id="brl-test-alert-btn" class="brl-app-btn brl-app-btn-outline" style="font-size:0.78rem; padding:8px 12px;">
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
                    <div id="brl-notif-feed-list" style="display:flex; flex-direction:column; gap:8px; max-height:190px; overflow-y:auto;">
                        <div style="color:#888; font-size:0.84rem; text-align:center; padding:14px;">Loading live league alerts...</div>
                    </div>
                </div>

                <!-- STEP 4: COMMISSIONER PUSH CONSOLE (WITH OUTLAW CHALLENGE & DISCORD WEBHOOK SYNC) -->
                <details style="background:rgba(255,23,68,0.06); border:1px solid rgba(255,23,68,0.3); border-radius:10px; padding:12px;">
                    <summary style="font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:900; color:#ff4d6d; text-transform:uppercase; letter-spacing:1px; cursor:pointer;">
                        🔒 Commissioner Push Console (Alerts, Outlaw Challenge &amp; Discord Sync)
                    </summary>
                    <div style="margin-top:12px; display:flex; flex-direction:column; gap:9px;">
                        <input type="password" id="brl-admin-push-pass" placeholder="Commissioner Passcode" style="padding:9px 12px; border-radius:6px; border:1px solid #333; background:#090b10; color:#fff; font-size:0.85rem;">

                        <!-- Quick Session Broadcast Buttons -->
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px;">
                            <button type="button" id="brl-admin-tue-prac-btn" class="brl-app-btn" style="background:rgba(57,255,20,0.18); border:1px solid #39ff14; color:#39ff14; font-size:0.7rem; padding:8px 6px;">
                                🟢 Tue Practice
                            </button>
                            <button type="button" id="brl-admin-fantasy-lock-btn" class="brl-app-btn" style="background:rgba(255,145,0,0.18); border:1px solid #ff9100; color:#ffab40; font-size:0.7rem; padding:8px 6px;">
                                ⚠️ Fantasy Lock
                            </button>
                            <button type="button" id="brl-admin-wed-gate-btn" class="brl-app-btn" style="background:rgba(255,204,0,0.18); border:1px solid #ffcc00; color:#ffcc00; font-size:0.7rem; padding:8px 6px;">
                                🏁 Wed Pit Gate
                            </button>
                        </div>

                        <button type="button" id="brl-admin-go-live-btn" class="brl-app-btn" style="background:#ff1744; color:#fff; font-size:0.8rem; padding:10px;">
                            🔴 Broadcast "Race Going Live NOW!" Alert
                        </button>

                        <!-- Season 17 Back-Row Outlaw Challenge Live Broadcaster (#5) -->
                        <div style="background:rgba(255,0,85,0.08); border:1px solid rgba(255,0,85,0.35); border-radius:8px; padding:10px; margin-top:4px;">
                            <div style="font-family:'Outfit',sans-serif; font-size:0.75rem; font-weight:900; color:#ff4d88; text-transform:uppercase; margin-bottom:6px;">
                                🔥 Season 17 Back-Row Outlaw Challenge Live Tracker &amp; Alert
                            </div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                                <select id="brl-admin-outlaw-driver" class="brl-app-select" style="margin-top:0;">
                                    <option value="">Select Challenger...</option>
                                    ${driverOptionsHtml}
                                </select>
                                <select id="brl-admin-outlaw-pot" class="brl-app-select" style="margin-top:0;">
                                    ${potOptionsHtml}
                                </select>
                            </div>
                            <select id="brl-admin-outlaw-status" class="brl-app-select" style="margin-top:6px;">
                                <option value="ACCEPTED">🚨 CHALLENGE ACCEPTED! (Dropping to Tail via !eol)</option>
                                <option value="DECLINED">🛡️ CHALLENGE DECLINED (Keeping Start Spot — Pot Rolls Over +1 Pt)</option>
                                <option value="WON">🏆 OUTLAW CHALLENGE WON! (P1 Victory from the Back!)</option>
                                <option value="FAILED">💥 CHALLENGE FAILED (Finished P2 or Worse — Pot Freezes)</option>
                                <option value="MANDATORY">⚡ MANDATORY 3-PEAT OUTLAW CHALLENGE ISSUED!</option>
                            </select>
                            <button type="button" id="brl-admin-outlaw-btn" class="brl-app-btn" style="background:#ff0055; color:#fff; font-size:0.76rem; padding:9px; margin-top:8px;">
                                🔥 Broadcast Outlaw Challenge Alert &amp; Update Tracker
                            </button>
                        </div>

                        <!-- Custom Driver/Team/League Alert -->
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

                        <!-- Discord Webhook Auto-Sync URL (#8) -->
                        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
                            <span style="font-size:0.72rem; color:#5865F2; font-weight:bold; text-transform:uppercase;">🔗 Discord Webhook Auto-Sync URL (Optional — Mirrors All App Alerts to Discord)</span>
                            <input type="text" id="brl-admin-discord-webhook" placeholder="https://discord.com/api/webhooks/..." style="width:100%; box-sizing:border-box; margin-top:4px; padding:8px 10px; border-radius:6px; border:1px solid #333; background:#090b10; color:#fff; font-size:0.8rem;">
                        </div>

                        <button type="button" id="brl-admin-send-custom-btn" class="brl-app-btn brl-app-btn-green" style="font-size:0.8rem; padding:10px;">
                            📢 Push Custom Alert to App Users &amp; Discord
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
        const chkPracGate = document.getElementById('brl-chk-practice-gate');
        const chkRace = document.getElementById('brl-chk-race-live');
        const chkDriver = document.getElementById('brl-chk-driver-alerts');
        const selDriver = document.getElementById('brl-select-driver-target');
        const chkTeam = document.getElementById('brl-chk-team-alerts');
        const selTeam = document.getElementById('brl-select-team-target');

        chkSite.checked = prefSiteUpdates();
        chkPracGate.checked = prefPracticeGate();
        chkRace.checked = prefRaceLive();
        chkDriver.checked = prefDriverEnabled();
        selDriver.value = prefDriverTarget();
        chkTeam.checked = prefTeamEnabled();
        selTeam.value = prefTeamTarget();

        document.getElementById('brl-driver-select-wrap').style.opacity = chkDriver.checked ? '1' : '0.45';
        document.getElementById('brl-team-select-wrap').style.opacity = chkTeam.checked ? '1' : '0.45';

        chkSite.onchange = () => localStorage.setItem(STORAGE_KEYS.PREF_SITE_UPDATES, String(chkSite.checked));
        chkPracGate.onchange = () => localStorage.setItem(STORAGE_KEYS.PREF_PRACTICE_GATE, String(chkPracGate.checked));
        chkRace.onchange = () => localStorage.setItem(STORAGE_KEYS.PREF_RACE_LIVE, String(chkRace.checked));
        chkDriver.onchange = () => {
            localStorage.setItem(STORAGE_KEYS.PREF_DRIVER_ALERTS, String(chkDriver.checked));
            document.getElementById('brl-driver-select-wrap').style.opacity = chkDriver.checked ? '1' : '0.45';
        };
        selDriver.onchange = () => {
            localStorage.setItem(STORAGE_KEYS.PREF_DRIVER_TARGET, selDriver.value);
            renderMyBrlProfileCard();
        };

        chkTeam.onchange = () => {
            localStorage.setItem(STORAGE_KEYS.PREF_TEAM_ALERTS, String(chkTeam.checked));
            document.getElementById('brl-team-select-wrap').style.opacity = chkTeam.checked ? '1' : '0.45';
        };
        selTeam.onchange = () => {
            localStorage.setItem(STORAGE_KEYS.PREF_TEAM_TARGET, selTeam.value);
            renderMyBrlProfileCard();
        };

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

        document.getElementById('brl-admin-tue-prac-btn').onclick = () => sendCommissionerPush('tuesday_practice');
        document.getElementById('brl-admin-fantasy-lock-btn').onclick = () => sendCommissionerPush('fantasy_lock');
        document.getElementById('brl-admin-wed-gate-btn').onclick = () => sendCommissionerPush('wednesday_pit_gate');
        document.getElementById('brl-admin-go-live-btn').onclick = () => sendCommissionerPush('race_live');
        document.getElementById('brl-admin-outlaw-btn').onclick = () => sendCommissionerPush('outlaw_challenge');
        document.getElementById('brl-admin-send-custom-btn').onclick = () => sendCommissionerPush('custom');

        refreshAlertUIState();
        updateFantasyCountdownBanner();
        renderOutlawChallengeBanner();
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
        updateFantasyCountdownBanner();
        renderMyBrlProfileCard();
        renderOutlawChallengeBanner();
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
                'You will now be notified for Website Updates, Practice/Pit Gate, Fantasy Locks, Live Races, and your followed Drivers & Teams!',
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
            : 'Following League-Wide Updates, Practice/Pit Gate, Fantasy Locks, Live Races, Drivers & Teams.';

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
            const isPractice = n.category === 'practice_open';
            const isPitGate = n.category === 'pit_gate_open';
            const isFantasy = n.category === 'fantasy_lock';
            const isOutlaw = n.category === 'outlaw_challenge';
            const isDriver = n.category === 'driver_alert' || !!n.driver;
            const isTeam = n.category === 'team_alert' || !!n.team;

            let badgeCol = '#39ff14';
            let badgeText = '🔄 SITE UPDATE';
            if (isLive) {
                badgeCol = '#ff1744';
                badgeText = '🔴 RACE LIVE';
            } else if (isOutlaw) {
                badgeCol = '#ff0055';
                badgeText = '🔥 OUTLAW CHALLENGE';
            } else if (isFantasy) {
                badgeCol = '#ff9100';
                badgeText = '⚠️ FANTASY LOCK';
            } else if (isPractice) {
                badgeCol = '#39ff14';
                badgeText = '🟢 TUESDAY PRACTICE OPEN';
            } else if (isPitGate) {
                badgeCol = '#ffcc00';
                badgeText = '🏁 WEDNESDAY PIT GATE OPEN';
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

    // 9. Commissioner Push Broadcast (Supports Quick Presets, Outlaw Challenge, Driver/Team, and Discord Webhook Sync)
    async function sendCommissionerPush(mode) {
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
        const webhookInputVal = (document.getElementById('brl-admin-discord-webhook').value || '').trim();

        let title, body, url, category;
        let outlawStatusUpdate = null;

        if (mode === 'tuesday_practice') {
            title = '🟢 TUESDAY PRACTICE OPEN: Bandit Racing League!';
            body = 'The pit gate for official Tuesday Night practice for tomorrow night\'s Bandit Racing League race is now OPEN!';
            url = '/schedule.html';
            category = 'practice_open';
        } else if (mode === 'fantasy_lock') {
            title = '⚠️ 90 MINS LEFT: Lock In Your BRL Fantasy Picks!';
            body = 'Weekly Viewer Fantasy lineups lock at 9:00 PM EST! Tap now to submit your picks before the green flag.';
            url = '/fantasy.html';
            category = 'fantasy_lock';
        } else if (mode === 'wednesday_pit_gate') {
            title = '🏁 PIT GATE OPEN: Wednesday Night Race Session!';
            body = 'The pit gate for tonight\'s Wednesday Night race is officially OPEN and practice has begun!';
            url = '/index.html';
            category = 'pit_gate_open';
        } else if (mode === 'race_live') {
            title = '🔴 LIVE NOW: Bandit Racing League Race Broadcast!';
            body = 'The cars are on track! Tap now to watch the live SimTrax broadcast on banditracingleague.net.';
            url = '/simtrax.html';
            category = 'race_live';
        } else if (mode === 'outlaw_challenge') {
            const outlawDrv = (document.getElementById('brl-admin-outlaw-driver').value || 'Eligible Challenger').trim();
            const outlawPot = parseInt(document.getElementById('brl-admin-outlaw-pot').value || '3', 10);
            const outlawDecision = document.getElementById('brl-admin-outlaw-status').value;
            url = '/season17.html';
            category = 'outlaw_challenge';

            if (outlawDecision === 'ACCEPTED') {
                title = `🚨 OUTLAW CHALLENGE ACCEPTED: ${outlawDrv} (+${outlawPot} Pts Pot)!`;
                body = `${outlawDrv} has ACCEPTED the Back-Row Outlaw Challenge (!eol) and will start from the tail of the field for a shot at +${outlawPot} Bonus Points!`;
                outlawStatusUpdate = { pot: outlawPot, challenger: outlawDrv, status: '🚨 CHALLENGE ACCEPTED (!eol)', detail: `${outlawDrv} starting at the tail for +${outlawPot} Bonus Points (Win or Nothing!)` };
            } else if (outlawDecision === 'DECLINED') {
                const nextPot = Math.min(17, outlawPot + 1);
                title = `🛡️ OUTLAW CHALLENGE DECLINED: Pot Rolls Over to +${nextPot} Pts!`;
                body = `${outlawDrv} elected to keep their starting spot. The Back-Row Outlaw Challenge Rollover Pot grows to +${nextPot} Bonus Points next week!`;
                outlawStatusUpdate = { pot: nextPot, challenger: outlawDrv, status: '🛡️ DECLINED — POT ROLLED OVER', detail: `Unattempted this week; Rollover Pot increases to +${nextPot} Bonus Points!` };
            } else if (outlawDecision === 'WON') {
                title = `🏆 OUTLAW JACKPOT CLAIMED! ${outlawDrv} Wins From the Back (+${outlawPot} Pts)!`;
                body = `HISTORY MADE! ${outlawDrv} charged from the tail of the field to P1 Victory Lane to claim the +${outlawPot} Point Outlaw Bounty! Pot resets to +3 Pts next week.`;
                outlawStatusUpdate = { pot: 3, challenger: outlawDrv, status: `🏆 WON BY ${outlawDrv} (+${outlawPot} PTS!)`, detail: `${outlawDrv} won from the back! Pot resets to +3 Bonus Points next week.` };
            } else if (outlawDecision === 'FAILED') {
                title = `💥 OUTLAW CHALLENGE SHORT: ${outlawDrv} Misses P1 — Pot Freezes at +${outlawPot} Pts!`;
                body = `${outlawDrv} attempted the Back-Row Outlaw Challenge but finished shy of P1. Zero bonus points awarded and the pot freezes at +${outlawPot} Points!`;
                outlawStatusUpdate = { pot: outlawPot, challenger: outlawDrv, status: `💥 ATTEMPT FAILED — POT FROZEN (+${outlawPot} PTS)`, detail: `${outlawDrv} fell short of P1; pot stays frozen at +${outlawPot} Bonus Points.` };
            } else {
                title = `⚡ MANDATORY 3-PEAT OUTLAW CHALLENGE: ${outlawDrv}!`;
                body = `After winning 3 straight races, ${outlawDrv} is automatically placed under the Mandatory 3-Peat Back-Row Outlaw Challenge (!eol) with a shot at +${outlawPot} Bonus Points!`;
                outlawStatusUpdate = { pot: outlawPot, challenger: outlawDrv, status: '⚡ MANDATORY 3-PEAT CHALLENGE (!eol)', detail: `${outlawDrv} (3 straight wins) starts from the tail with +${outlawPot} Bonus Points on the line!` };
            }
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
            if (mode === 'custom' && targetDriver) newAlert.driver = targetDriver;
            if (mode === 'custom' && targetTeam) newAlert.team = targetTeam;
            if (mode === 'outlaw_challenge') {
                const od = (document.getElementById('brl-admin-outlaw-driver').value || '').trim();
                if (od) newAlert.driver = od;
            }

            if (outlawStatusUpdate) {
                rowData.outlawChallengeStatus = outlawStatusUpdate;
                cachedOutlawStatus = outlawStatusUpdate;
                renderOutlawChallengeBanner();
            }
            if (webhookInputVal) {
                rowData.discordWebhookUrl = webhookInputVal;
                cachedDiscordWebhook = webhookInputVal;
            }

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

            const activeWebhook = webhookInputVal || rowData.discordWebhookUrl;
            if (activeWebhook) {
                await postAlertToDiscordWebhook(activeWebhook, newAlert);
            }

            msgEl.style.color = '#39ff14';
            msgEl.textContent = activeWebhook
                ? '✅ Alert broadcasted live to BRL App users + synced to Discord!'
                : '✅ Alert broadcasted live to BRL App users!';
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
        checkScheduledRaceWindows();

        setInterval(() => {
            fetchAndProcessNotifications(false);
            checkScheduledRaceWindows();
            updateFantasyCountdownBanner();
        }, 30000);

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (swRegistration) swRegistration.update().catch(() => {});
                fetchAndProcessNotifications(false);
                checkScheduledRaceWindows();
                updateFantasyCountdownBanner();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBrlApp);
    } else {
        initBrlApp();
    }
})();
