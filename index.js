const UglifyJS = require("uglify-js");
const fs = require('fs');
const prompt = require("prompt-sync")({sigint: true});

var cv = JSON.parse(fs.readFileSync('version.json', 'utf8'));
const version = prompt("Enter the version we are building (currently on version "+cv.current_version+"): ");
if (isNaN(version)) {
    throw new Error("New version must be a number!");
}
cv.current_version = parseFloat(version);
if (!cv.changes[version]) cv.changes[version]=[];
var change;
while (1) {
    change = prompt("Please enter the changes to put in version.json (and enter done to finish): ");
    if (change === "done") break;
    if (change) cv.changes[version].push(change);
}

var code = fs.readFileSync('main.js', 'utf8');

function minify(source){
    var ast = UglifyJS.parse(source); 
    return UglifyJS.minify(ast).code;
}
console.log('building...');
var min = encodeURIComponent(minify(code.replaceAll('{{VERSION}}', version)));

var result = '<!DOCTYPE HTML>\n<html lang="en"><head><style>.btn{display:inline-block;font-size:48px;margin-bottom:3rem;color:#000;background-color:#fff;border-color:#000;border-style:solid;border-width:1px;border-radius:.3rem;transition:color .2s,background-color .2s,border-color .2s;cursor:move;padding:12px}span{background-color:#fff;padding:12px}</style><title>Emulator Button</title><meta charset=\'utf-8\'><meta name="viewport" content="width=device-width, initial-scale=1">\n<script>\n// easter egg (this site works offline)\nif ("serviceWorker" in navigator) {\n    navigator.serviceWorker.register("worker.js");\n};\n</script>\n</head><body><center><br><br><a href="javascript:'+min+'" class="btn">Emulator Button</a><br><br><p>Emulator version '+version+'</p><br><p>Drag the button to the bookmark bar, open a website, and click it</p><p><a href="https://github.com/ethanaobrien/emulator-button">View on GitHub</a></p></center></body></html>\n';

var offline = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Emulator Button - Offline</title><style>body{font-family:helvetica,arial,sans-serif;margin:2em}.btn{display:inline-block;font-size:48px;margin-bottom:3rem;color:#000;background-color:#fff;border-color:#000;border-style:solid;border-width:1px;border-radius:.3rem;transition:color .2s,background-color .2s,border-color .2s;cursor:move;padding:12px}</style></head><body><h1>You are offline</h1><p>But you can still use the emulator button</p><br><center><a href="javascript:'+min+'" class="btn">Emulator</a><br><br><p><a href="https://github.com/ethanaobrien/emulator-button">View on GitHub</a></p></center></body></html>\n';

fs.writeFileSync('index.html', result);
fs.writeFileSync('offline.html', offline);
fs.writeFileSync('version.json', JSON.stringify(cv));
console.log('done!');

