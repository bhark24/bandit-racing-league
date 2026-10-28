---
trigger: always_on
description: Always run cache-busting, git commit, and git push origin main after any Bandit Racing League website update
---

# Bandit Racing League Website — Mandatory Auto-Push Rule

Whenever you create, edit, or update any files in the Bandit Racing League website repository (`C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league`), you **MUST** automatically deploy the changes to the live website (`banditracingleague.net`) before finishing your turn—**never** wait for the user to ask you to push:

1. Run `python apply_cache_busting.py` in `C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league`.
2. Stage all modified and newly created website files/assets (`git add -u` and `git add` any new HTML, JS, CSS, or `assets/` files).
3. Commit with a clear message (`git commit -m "..."`).
4. Push immediately to GitHub Pages (`git push origin main`).
5. Confirm in your response that the changes have been pushed live to `origin/main`.
