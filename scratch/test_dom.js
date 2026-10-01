const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('wall-of-shame.html', 'utf8');
const dataJs = fs.readFileSync('wall_of_shame_data.js', 'utf8');
const appJs = fs.readFileSync('wall_of_shame_app.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;

try {
    window.eval(dataJs);
    console.log("Data JS evaluated successfully.");
    window.eval(appJs);
    console.log("App JS evaluated successfully.");

    // Trigger DOMContentLoaded
    const event = new window.Event('DOMContentLoaded');
    window.document.dispatchEvent(event);
    console.log("DOMContentLoaded dispatched.");

    // Test changing raceWeekSelect to richmond
    const select = window.document.getElementById('raceWeekSelect');
    select.value = 'richmond';
    select.dispatchEvent(new window.Event('change'));
    console.log("Richmond selected. Track title:", window.document.getElementById('trackNameDisplay').innerText);

    // Test changing raceWeekSelect to michigan
    select.value = 'michigan';
    select.dispatchEvent(new window.Event('change'));
    console.log("Michigan selected. Track title:", window.document.getElementById('trackNameDisplay').innerText);

    // Test changing raceWeekSelect to gateway
    select.value = 'gateway';
    select.dispatchEvent(new window.Event('change'));
    console.log("Gateway selected. Track title:", window.document.getElementById('trackNameDisplay').innerText);

    // Test changing raceWeekSelect to darlington
    select.value = 'darlington';
    select.dispatchEvent(new window.Event('change'));
    console.log("Darlington selected. Track title:", window.document.getElementById('trackNameDisplay').innerText);

} catch (err) {
    console.error("Error during JSDOM test:", err);
}
