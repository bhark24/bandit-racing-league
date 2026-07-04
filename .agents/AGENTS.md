# Bandit Racing League Workspace Rules

These guidelines prevent regressions and maintain design consistency across the BRL website, Geezer App, and Spotter Portal.

## UI Stability & Layout Shifting ("The Jiggles")
* **No Telemetry Layout Shifts:** Never toggle elements that affect layout height (like warning banners or penalty logs) using `display: none` / `display: block` dynamically during active race events. Instead, use layout-occupied toggles like `visibility: hidden; opacity: 0` and transparent border colors so the parent card's height never changes.
* **Float Formatting:** Always format or round telemetry values (e.g. `Math.round(temp)` for tire temperatures, `.toFixed(1)` for fuel gallons, `.toFixed(3)` for average fuel) before rendering them to the DOM. Constantly updating floating-point decimals cause horizontal text width shifts and layout jiggling.
* **Grid Bounds:** Ensure all main columns and card containers inside dashboard grids have `min-height: 0` and `min-width: 0` applied to allow flex child components to shrink rather than stretching the parent grid row/column.

## Embeddable Web Demos
* **Web Portal Query Parameters:** Always check for `demo=true` or `autodemo=true` URL query parameters on web telemetry portals (like `spotter.html`). If present, automatically boot the page in local visual demo mode so it can be embedded in a fullscreen iframe on other landing pages (like `geezer-app.html`).

## Asset Management & Logos
* **Transparent Circular PNGs:** When creating circular badges or team logos, always crop the image to the non-black bounding box and mask the outer corners to be fully transparent (using PIL / Pillow), preventing solid black square backgrounds on dark theme pages.
