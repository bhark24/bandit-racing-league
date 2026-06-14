# Bandit Racing League — Franchise Configuration Guide

This guide provides a comprehensive breakdown of the economics, rules, and mathematical configurations governing the **Bandit Racing League Franchise System**. It details how all revenues, expenses, truck wear, driver travel costs, and emergency loans are calculated and applied.

---

## 1. Roster Rules & Slots

Each franchise is built around its active drivers and backup roster. The system enforces strict roster guidelines:

*   **Roster Composition:**
    *   **Primary Driver Slots (4 Slots):** Assigned to active, **Full-Time** drivers.
    *   **Backup Driver Slots (2 Slots):** Assigned to reserve or **Part-Time** drivers.
*   **Auto-Sorting & Substitution:**
    *   Full-time drivers occupy primary slots, and part-time drivers occupy backup slots. The roster auto-sorts dynamically to satisfy this constraint.
    *   If a primary driver is absent (**DNS - Did Not Start**) and a backup driver is registered, the backup driver is automatically substituted. In the race simulation, the backup driver drives their own dedicated truck (matched by their driver number), scoring points and earning revenue for the franchise. This ensures that wear and damage are applied directly to that driver's actual truck rather than the absent primary driver's truck.
    *   **Handling When All 6 Drivers Participate:**
        *   **Standard Races (Capped at 4 Active Slots):** Standard race weeks are capped at a maximum of 4 active simulation slots. If all 4 primary drivers participate, the backup drivers remain on the bench (DNS status in the simulation) even if they ran in real life. Inactive backups do not earn points or revenue, generate no prep/travel expenses, and their dedicated trucks suffer no wear. Backup drivers only substitute in if a primary driver is absent.
        *   **Special Events (e.g., Daytona):** The active slot cap is removed. All registered roster drivers (up to 6 total: 4 primaries + 2 backups) participate in the simulation, scoring points, earning revenue, generating expenses, and running their own dedicated trucks.
*   **Dedicated Driver Trucks:**
    *   Every driver on the roster, whether **Full-Time** or **Part-Time**, must have their own dedicated truck in the team fleet, matched to their driver number (e.g., `#35` or `#82`).
*   **Driver Signings & Truck Assignment:**
    *   Signing any driver requires a flat **$50,000 signing bonus** deducted from franchise capital.
    *   **Spare Truck Reclaiming (Free):** If a spare truck (carrying `#TBD` in its name) exists in the team's fleet, it is automatically assigned to the new driver and renamed to match their driver number at no extra cost.
    *   **New Truck Purchase ($185,000):** If no spare (`#TBD`) trucks exist in the fleet, the franchise must purchase a new fleet truck for **$185,000**.
    *   **Total Sign Cost:** Either **$50,000** (if reclaiming a spare) or **$235,000** (if purchasing a new truck).
    *   Signing requires the owner's passcode and is disabled if the team has an active emergency loan.
*   **Driver Releases & Fleet Reversion:**
    *   Releasing a driver is free (**$0 fee**).
    *   Upon release, the driver's dedicated truck is not deleted; instead, it is renamed back to include `#TBD` (reverted to a spare), keeping it in the fleet to be reclaimed by future signees.

---

## 2. Weekly Financial Mechanics (Race-by-Race)

During the weekly race updates, the system processes a series of credits (revenue) and debits (expenses) for every franchise team based on their participating drivers' performance.

### A. Revenue Credits

1.  **Sponsor Start Bonus:** A flat **$15,000** per participating driver per race.
2.  **Race Prize Money:** Paid out based on the official finish position of each driver:

| Finish Position | Prize Payout | Finish Position | Prize Payout |
| :--- | :--- | :--- | :--- |
| **P1 (Winner)** | $75,000 | **P6 – P10** | $25,000 |
| **P2** | $55,000 | **P11 – P15** | $20,000 |
| **P3** | $45,000 | **P16 – P20** | $15,000 |
| **P4** | $35,000 | **P21 – DNF** | $12,000 |
| **P5** | $30,000 | **DNS (No Sub)** | $0 |

### B. Expense Debits

1.  **Standard Race Prep:** A flat **$2,000** per participating driver/truck to cover track setup, crew labor, tires, fuel, and tuning.
2.  **Hauler Logistics Travel:** Calculated as a round-trip distance cost from the franchise's home base to the track coordinates. The rate is **$5.00 per mile round-trip**:
    **Calculation Formula:**  
    `Hauler Cost = Round-trip Distance (miles) * $5.00`  
3.  **Quarterly Hauler Maintenance:** Charged every 4 races, costing a flat **$2,000** per team.
4.  **Driver Travel & Lodging Tiers:** Calculated from the driver's hometown coordinates to the track coordinates:

| Travel Tier | Distance Trigger | Cost & Calculation Logic |
| :--- | :--- | :--- |
| **Local Commute** | 0 – 50 miles | **$20 flat fee.** Fuel only; no lodging. |
| **Drive & Lodging** | 51 – 250 miles | **$100 flat fee.** Regional driving commute and lodging. |
| **Flight & Lodging** | > 250 miles | **Dynamic Flight Cost.** Base cost is mapped by major regional airports (e.g., Cleveland is $220, Roanoke is $380, West Plains is $420) or distance-based fallback ($250 + $0.20/mi). Multiplied by **Seasonal Multipliers** (1.3 in Summer/Holidays; 0.8 in Jan/Feb; 1.0 Spring/Fall) and a **Random Fluctuation (+/- 15%)**. |

---

## 3. Truck Fleet Wear, Damage & Repairs

Each driver (both primary full-time and backup part-time) races in their own dedicated fleet truck. Chassis and engine wear are calculated dynamically based on race telemetry, requiring active capital management to restore condition. During updates, the simulation locates each participating driver's truck by matching their roster number to the truck's name, applying all wear and damage directly to their actual truck.

### A. Weekly Condition Wear
**Calculation Formula:**  
`Total Wear = Natural Wear (2% to 5%) + Incident Damage (Incidents * 4%) + Manual Admin Overrides`  
All wear is applied directly to the driver's dedicated truck. Truck condition has a hard floor of **0%**.

### B. Special Race Incidents & Resets
If a severe crash or failure occurs, specific expenses and resets are triggered:

*   **Engine Blown DNF:** If a truck DNF's due to engine/mechanical failure, the team is charged a flat **$45,000 Engine Replacement fee** which resets the truck condition to **100%**.
*   **Fast Repair used (Finished):** If a driver uses a fast repair but finishes the race, the team is charged a flat **$83,250 fee** (45% of truck value) and condition resets to **100%**.
*   **Fast Repair DNF (Totaled):** If a driver uses a fast repair but still DNF's due to damage, the truck is totaled and replaced with a new truck for **$185,000** (restoring condition to 100%).

### C. Manual & Bulk Chassis Repairs (Web UI)
*   **Chassis Repair Rate:** Manual repairs between races cost **$500 per 1% condition restored** (e.g., restoring a truck from 70% to 100% costs 30 * $500 = $15,000).
*   **Checkbox Multi-Select:** In the Garage tab, owners can check multiple trucks and click **"Repair Selected"** to repair all of them in a single transaction, requiring the owner passcode only **once**.
*   **Loan Lock:** Manual repairs are locked if the franchise has an active loan.

---

## 4. Emergency Loans

To prevent bankruptcy, the league provides automatic emergency financing:

*   **Trigger:** If a franchise balance drops below **$0** after weekly race expenses, an emergency loan is automatically issued to cover the exact deficit, bringing the team balance back to exactly **$0**.
*   **Automatic Repayment:** **50% of the team's weekly earnings** (sponsor start bonus + prize money) is automatically diverted to repay the loan during updates.
*   **Weekly Interest:** Any outstanding loan balance at the end of a week accrues a **2% weekly interest charge**.
*   **Action Restrictions:** Having an active emergency loan locks manual chassis repairs and driver signings in the web application until the loan is fully repaid.

---

## 5. Driver Fines & Sponsor Declines

*   **Driver Fines:** Team owners can issue fines to their drivers for damage or poor conduct. The fine amount is entered manually in the Roster tab. Fines are credited directly to the franchise capital balance (paid *to* the franchise). Issuing a fine requires owner passcode authorization.
*   **Sponsor Declines:** Team owners can decline existing sponsor agreements. This terminates the sponsor contract and frees up a sponsor slot in the Finances tab. Declining a sponsor requires owner passcode authorization.

---

## 6. Hideout Interrogations (Press Conference)

The web application features a Press Room tab allowing franchise owners to interrogate their rostered drivers between races:

*   **Instruction:** Owners click on their active roster drivers to begin the interrogation.
*   **Context-Aware Dialogues:** Driver dialogue is customized based on their performance and status in the latest race:
    *   **Winner:** Driver discusses the winning pass and team morale.
    *   **Blown Engine:** Driver discusses the mechanical failure and engine replacement costs.
    *   **Crash DNF:** Driver discusses getting caught in wrecks and totaling equipment.
    *   **High Incidents:** Driver discusses chaotic track conditions and potential owner fines.
    *   **Clean Race:** Driver discusses patience, budget savings, and avoiding damage.
    *   **General/Mid-Pack:** Driver discusses pack racing battles and setups.
    *   **DNS/Backup:** Inactive/backup drivers discuss supporting the team and waiting for their next shot.
*   **Dynamic Variable Injection:** The interface automatically injects the **driver's name**, the **franchise name**, and the **latest race track** into the dialogue options to keep them contextual.
*   **Weekly Q&A Rotation:** Selection is driven by a hash seed incorporating the `driverName`, `teamName`, `trackName`, and `questionIndex`. As the track changes each week, the dialogue variations automatically rotate so the driver asks/answers different questions even if they finish in the same performance bracket.
