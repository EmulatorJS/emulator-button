(async function() {
    var ce = function(e) {return document.createElement(e);};
    async function checkForUpdate() {
        try {
            var version = {
                current_version: 5.2
            };
            var version = await fetch('https://raw.githack.com/ethanaobrien/emulator-button/main/version.json');
            var version = await version.text();
            var version = JSON.parse(version);
        } catch(e) {
            var version = {
                current_version: 5.2
            };
        };
        var usingVersion = 5.2;
        if (usingVersion < version.current_version) {
            var a = ce('div');
            var html = '<h2>Version ' + version.current_version + ' is out! <a href="https://raw.githack.com/ethanaobrien/emulator-button/main/index.html" target="_blank">Click Here</a> to update.</h2><p>Changes:</p><ul>';
            for (var i=0; i<version.changes.length; i++) {
                html += '<li>' + version.changes[i] + '</li>';
            };
            html += '</ul><br>';
            a.innerHTML = html;
            document.getElementById('emulatorjsElemAfterTitle').parentNode.insertBefore(a, document.getElementById('emulatorjsElemAfterTitle'));
        };
    };
    if (window.VARRRSSZZ) {
        var a = [];
        var b = [];
        for (var k in window) {
            a.push(k);
        };
        for (var i=0; i<a.length; i++) {
            if (! window.VARRRSSZZ.includes(a[i])) {
                b.push(a[i]);
            };
        };
        for (var i=0; i<b.length; i++) {
            if (window[b[i]]) {
                delete window[b[i]];
            };
        };
    };
    var a = [];
    for (var k in window) {
        a.push(k);
    };
    window.VARRRSSZZ = a;
    if (String.prototype.replaceAll === undefined) {
        String.prototype.replaceAll = function(a, b) {
            return this.split(a).join(b);
        };
    };
    var pressText = '';
    function keyDDown(e) {
        var key = e.key;
        if (key == 'Backspace') {
            pressText = '';
        } else {
            pressText += key
        };
        if (pressText.split('dev mode').length != 1) {
            pressText = '';
            document.getElementById('dev').style = 'display:block;';
            localStorage.setItem('emuButtonDev', true);
        } else if (pressText.split('show me games').length != 1) {
            pressText = '';
            document.getElementById('gameLinks').style = 'display:block;';
        };
    };
    function drag(evt) {
        evt.dataTransfer.dropEffect = 'copy';
        evt.preventDefault();
        return false;
    };
    function removeDropListen() {
        document.removeEventListener("dragover", drag, false);
        document.removeEventListener("dragleave", drag, false);
        document.removeEventListener("dragenter", drag, false);
        document.removeEventListener("drop", drop, false);
    };
    function drop(e) {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
        var items = e.dataTransfer.items;
        for (var i=0; i<items.length; i++) {
            var item = items[i];
            if (item.kind == 'file') {
                var entry = item.webkitGetAsEntry();
                entry.file(selectedFile);
                removeDropListen();
                return;
            };
        };
        return false;
    };
    document.addEventListener("dragover", drag, false);
    document.addEventListener("dragleave", drag, false);
    document.addEventListener("dragenter", drag, false);
    document.addEventListener("drop", drop, false);
    function getCachedFileUrl(key, path, mime) {
        return new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open("mainEmuFiles", 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction(["mainEmuFiles"], "readwrite");
                var objectStore = transaction.objectStore("mainEmuFiles");
                var request = objectStore.get(key);
                request.onsuccess = async function(e) {
                    var file = e.target.result;
                    try {
                        var asd = await fetch(path);
                    } catch(e) {
                        if (file) {
                            resolve(URL.createObjectURL(new Blob([file], {type: mime})));
                        } else {
                            reject(e);
                        };
                        return;
                    };
                    var buffer = await asd.arrayBuffer();
                    var transaction = db.transaction(["mainEmuFiles"], "readwrite");
                    var objectStore = transaction.objectStore("mainEmuFiles");
                    var request = objectStore.put(buffer, key);
                    request.onsuccess = function() {};
                    request.onerror = function() {};
                    resolve(URL.createObjectURL(new Blob([buffer], {type: mime})));
                };
                request.onerror = function() {};
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains('mainEmuFiles')) {
                    db.createObjectStore('mainEmuFiles');
                };
            };
        });
    };
    function putInSystemCache(key, data, version) {
        var openRequest = indexedDB.open("ejs-system", 1);
        openRequest.onerror = function() {};
        openRequest.onsuccess = function() {
            var db = openRequest.result;
            var transaction = db.transaction(["system"], "readwrite");
            var objectStore = transaction.objectStore("system");
            var system = {version: version, data: data};
            var request = objectStore.put(system, key);
            request.onerror = function() {};
            request.onsuccess = function() {};
        };
        openRequest.onupgradeneeded = function() {
            var db = openRequest.result;
            if (! db.objectStoreNames.contains('system')) {
                db.createObjectStore('system');
            };
        };
    };
    function checkSystemCache(key, version) {
        return new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open("ejs-system", 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction(["system"], "readwrite");
                var objectStore = transaction.objectStore("system");
                var request = objectStore.get(key);
                request.onsuccess = function(e) {
                    var result = e.target.result;
                    if (! result) {
                        resolve(true);
                        return;
                    };
                    if (result.version != version) {
                        resolve(true);
                        return;
                    };
                    resolve(false);
                };
                request.onerror = function() {};
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains('system')) {
                    db.createObjectStore('system');
                };
            };
        });
    };
    async function cacheCommonModules() {
        var js = 'text/javascript';
        var baseUrl = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/';
        var status = document.getElementById('offlineStatus');
        try {
            getCachedFileUrl('loader', baseUrl + 'loader.js', js);
            getCachedFileUrl('webrtc', baseUrl + 'webrtc-adapter.js', js);
            getCachedFileUrl('rar', baseUrl + 'libunrar.js', js);
            getCachedFileUrl('zip', baseUrl + 'extractzip.js', js);
            getCachedFileUrl('7zip', baseUrl + 'extract7z.js', js);
            getCachedFileUrl('emulator', baseUrl + 'emulator.js', js);
            getCachedFileUrl('rarMem', baseUrl+'libunrar.js.mem', js);
            var v = await getCachedFileUrl('v', baseUrl + 'v.json', 'application/json');
            var v = await fetch(v);
            var v = await v.text();
            var v = JSON.parse(v);
            var coresToCache = [
                {system: 'gb', type: 'asmjs'},
                {system: 'gba', type: 'asmjs'},
                {system: 'n64', type: 'asmjs'},
                {system: 'nds', type: 'asmjs'},
                {system: 'nds', type: 'wasm'},
                {system: 'nes', type: 'asmjs'},
                {system: 'nes', type: 'wasm'},
                {system: 'snes', type: 'asmjs'},
                {system: 'snes', type: 'wasm'}
            ];
            for (var i=0; i<coresToCache.length; i++) {
                var url = baseUrl + coresToCache[i].system + '-' + coresToCache[i].type + '.data';
                var key = coresToCache[i].system + '-' + coresToCache[i].type + '.data';
                var version = v[coresToCache[i].system].version;
                var needToGet = await checkSystemCache(key, version);
                if (needToGet) {
                    var data = await fetch(url);
                    var data = await data.arrayBuffer();
                    var data = new Uint8Array(data);
                    putInSystemCache(key, data, version);
                };
            };
            status.innerHTML = 'Offline Mode: READY';
        } catch(e) {
            status.innerHTML = 'Offline Mode: NOT READY';
        };
    };
    function getCachedKeys() {
        return new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open("emulatorGameCache", 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction(["emulatorGameCache"], "readwrite");
                var objectStore = transaction.objectStore("emulatorGameCache");
                var request = objectStore.get('keys');
                request.onsuccess = function(e) {
                    var keys = e.target.result;
                    if (! keys) {
                        var transaction = db.transaction(["emulatorGameCache"], "readwrite");
                        var objectStore = transaction.objectStore("emulatorGameCache");
                        var request = objectStore.put([], 'keys');
                        request.onsuccess = function() {};
                        request.onerror = function() {};
                        return resolve([]);
                    };
                    resolve(keys);
                };
                request.onerror = function() {};
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains('emulatorGameCache')) {
                    db.createObjectStore('emulatorGameCache');
                };
            };
        });
    };
    function getRomData(key) {
        return new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open("emulatorGameCache", 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction(["emulatorGameCache"], "readwrite");
                var objectStore = transaction.objectStore("emulatorGameCache");
                var request = objectStore.get(key);
                request.onsuccess = function() {
                    var gameData = request.result;
                    resolve(new Blob([gameData]));
                };
                request.onerror = function() {};
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains('emulatorGameCache')) {
                    db.createObjectStore('emulatorGameCache');
                };
            };
        });
    };
    function deleteRom(key) {
        return new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open("emulatorGameCache", 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction(["emulatorGameCache"], "readwrite");
                var objectStore = transaction.objectStore("emulatorGameCache");
                var currentKeys = objectStore.get('keys');
                currentKeys.onsuccess = function() {
                    var keys = currentKeys.result;
                    if (! keys) {var keys = [];};
                    var newKeys = [];
                    for (var i=0; i<keys.length; i++) {
                        if (keys[i].key != key) {
                            newKeys.push(keys[i]);
                        };
                    };
                    var request = objectStore.put(newKeys, 'keys');
                    request.onsuccess = function() {};
                    request.onerror = function() {};
                    var request2 = objectStore.delete(key);
                    request2.onsuccess = function() {resolve()};
                    request2.onerror = function() {};
                };
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains('emulatorGameCache')) {
                    db.createObjectStore('emulatorGameCache');
                };
            };
        });
    };
    async function createRomCache(data, fileName, core) {
        return await new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open("emulatorGameCache", 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction(["emulatorGameCache"], "readwrite");
                var objectStore = transaction.objectStore("emulatorGameCache");
                var currentKeys = objectStore.get('keys');
                currentKeys.onsuccess = function() {
                    var keys = currentKeys.result;
                    if (! keys) {var keys = []};
                    var key = fileName.split(' ').join('').toLowerCase();
                    var key = key.substr(0, key.length - key.split('.').pop().length - 1);
                    var name = fileName.substr(0, fileName.length - fileName.split('.').pop().length - 1);
                    var newKey = {key: key, name: name, core: core, fileName: fileName};
                    for (var i=0; i<keys.length; i++) {
                        if (keys[i].key == newKey.key && keys[i].core == newKey.core) {
                            resolve();
                            return;
                        };
                    };
                    keys.push(newKey);
                    var request = objectStore.put(keys, 'keys');
                    request.onsuccess = function() {};
                    request.onerror = function() {};
                    var request2 = objectStore.put(data, key);
                    request2.onsuccess = function() {};
                    request2.onerror = function() {};
                    resolve();
                };
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains('emulatorGameCache')) {
                    db.createObjectStore('emulatorGameCache');
                };
            };
        });
    };
    var resetPageContents = function() {
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        if (! document.body.style) {document.body.style = {};};
        document.body.style.backgroundColor = 'white';
        if (document.getElementsByTagName('title')[0]) {
            var title = ce('title');
            title.innerHTML = document.getElementsByTagName('title')[0].innerHTML;
            while(document.head.firstChild) {
                document.head.removeChild(document.head.firstChild);
            };
            document.head.appendChild(title);
        } else {
            while(document.head.firstChild) {
                document.head.removeChild(document.head.firstChild);
            };
        };
    };
    async function loadGame(fileURL, gameName, core, adUrl) {
        document.removeEventListener('keydown', keyDDown, false);
        var js = 'text/javascript';
        var color = function() {
            var colors = ['#FF0000', '#FFA500', '#008000', '#0000FF', '#800080'];
            var random = Math.floor(Math.random() * colors.length);
            return colors[random];
        }();
        var base = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/';
        var loader = await getCachedFileUrl('loader', base+'loader.js', js);
        var webrtc = await getCachedFileUrl('webrtc', base+'webrtc-adapter.js', js);
        var rar = await getCachedFileUrl('rar', base+'libunrar.js', js);
        var rarMem = await getCachedFileUrl('rarMem', base+'libunrar.js.mem', 'application/json');
        var zip = await getCachedFileUrl('zip', base+'extractzip.js', js);
        var sevenzip = await getCachedFileUrl('7zip', base+'extract7z.js', js);
        var emulator = await getCachedFileUrl('emulator', base+'emulator.js', js);
        var v = await getCachedFileUrl('v', base+'v.json', 'application/json');
        var paths = {
            "v.json": v,
            "emulator.js": emulator,
            "extract7z.js": sevenzip,
            "extractzip.js": zip,
            "libunrar.js": rar,
            "webrtc-adapter.js": webrtc,
            "libunrar.js.mem": rarMem
        };
        var b = ce('style');
        b.innerHTML = '*{padding:0;margin:0;}';
        document.body.appendChild(b);
        var a = ce('div');
        a.innerHTML = '<div id="game"></div>';
        a.style = 'width:'+window.innerWidth+'px;height:'+window.innerHeight+'px;max-width:100%';
        document.body.appendChild(a);
        EJS_color = color;
        EJS_startOnLoaded = true;
        EJS_paths = paths;
        EJS_player = '#game';
        EJS_biosUrl = '';
        EJS_gameName = gameName;
        EJS_gameUrl = fileURL;
        EJS_core = core;
        EJS_lightgun = false;
        EJS_pathtodata = base;
        if (adUrl && adUrl != '') {
            EJS_AdUrl = adUrl;
        };
        var script = ce('script');
        script.src = loader;
        document.body.appendChild(script);
    };
    resetPageContents();
    var a = ce('div');
    a.style = 'padding: 50px;';
    var header = ce('h1');
    header.style = 'font-size: 45px;';
    header.innerHTML = 'Gamez';
    a.appendChild(header);
    var b = ce('p');
    b.id = 'emulatorjsElemAfterTitle';
    b.innerHTML = 'Click the choose file button to upload a rom (you can also drag and drop the file)';
    a.appendChild(b);
    a.appendChild(ce('br'));
    var file = ce('input');
    async function selectedFile(file) {
        var adUrl = document.getElementById('adUrl').value;
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        var extension = file.name.split('.').pop().toLowerCase();
        var gameName = file.name.replaceAll("'", "\\'");
        var gameName = gameName.substr(0, gameName.length - extension.length - 1);
        if (['fds', 'nes', 'unif', 'unf'].includes(extension) && detectCore.checked) {
            var core = 'nes';
        } else if (['z64'].includes(extension) && detectCore.checked) {
            var core = 'n64';
        } else if (['smc', 'fig', 'sfc', 'gd3', 'gd7', 'dx2', 'bsx', 'swc'].includes(extension) && detectCore.checked) {
            var core = 'snes';
        } else if (['nds'].includes(extension) && detectCore.checked) {
            var core = 'nds';
        } else if (['gba'].includes(extension) && detectCore.checked) {
            var core = 'gba';
        } else if (['gb'].includes(extension) && detectCore.checked) {
            var core = 'gb';
        } else {
            var core = await function() {
                return new Promise(function(resolve, reject) {
                    var cores = {"NES / Nintendo Entertainment System / Famicon": "nes",
                                 "SNES / Super Nintendo Entertainment System": "snes",
                                 "Nintendo 64": "n64",
                                 "Nintendo Game Boy": "gb",
                                 "Nintendo Game Boy Advance": "gba",
                                 "Nintendo DS": "nds",
                                 "PlayStation": "psx",
                                 "Virtual Boy": "vb",
                                 "Sega Mega Drive": "segaMD",
                                 "Sega Master System": "segaMS",
                                 "Sega CD": "segaCD",
                                 "Atari Lynx": "lynx",
                                 "Sega 32X": "sega32x",
                                 "Atari Jaguar": "jaguar",
                                 "Sega Game Gear": "segaGG",
                                 "Sega Saturn": "segaSaturn",
                                 "Atari 7800": "atari7800",
                                 "Atari 2600": "atari2600"};
                    var a = ce('div');
                    a.style = 'padding: 50px;';
                    var p = ce('h2');
                    p.innerHTML = 'Unable to auto-detect system. Please select the desired system.';
                    a.appendChild(p);
                    a.appendChild(ce('br'));
                    for (var k in cores) {
                        var input = ce('input');
                        input.type = 'radio';
                        input.id = 'game-' + cores[k];
                        input.name = 'game';
                        input.value = cores[k];
                        a.appendChild(input);
                        var label = ce('label');
                        label.for = 'game-' + cores[k];
                        label.innerHTML = k;
                        a.appendChild(label);
                        a.appendChild(ce('br'));
                    };
                    a.appendChild(ce('br'));
                    var submit = ce('input');
                    submit.type = 'submit';
                    submit.value = 'Load Game';
                    submit.onclick = function(e) {
                        var q = false;
                        var radios = document.getElementsByName('game');
                        for (var i=0; i<radios.length; i++) {
                            if (radios[i].checked) {
                                var q = radios[i].value;
                                break;
                            };
                        };
                        if (! q) {
                            return;
                        };
                        while(document.body.firstChild) {
                            document.body.removeChild(document.body.firstChild);
                        };
                        resolve(q);
                    };
                    a.appendChild(submit);
                    document.body.appendChild(a);
                });
            }();
        };
        var fileURL = URL.createObjectURL(new Blob([file]));
        loadGame(fileURL, gameName, core, adUrl);
        if (localStorage.getItem('emubuttonCacheRoms') != 'false' && cacheRom.checked) {
            var reader = new FileReader();
            reader.onload = function(e) {
                createRomCache(e.target.result, file.name, core);
            };
            reader.readAsArrayBuffer(file);
        };
    };
    var gamezSortFunc = function(a, b) {
        return a.name.localeCompare(b.name);
    };
    file.onchange = function() {selectedFile(file.files[0])};
    file.type = 'file';
    a.appendChild(file);
    a.appendChild(ce('br'));
    a.appendChild(ce('br'));
    a.appendChild(ce('br'));
    var detectCore = ce('input');
    detectCore.type = 'checkbox';
    detectCore.checked = true;
    detectCore.name = 'detectCore';
    a.appendChild(detectCore);
    var w = ce('label');
    w.for = 'detectCore';
    w.innerHTML = 'Auto-detect core';
    a.appendChild(w);
    a.appendChild(ce('br'));
    a.appendChild(ce('br'));
    var cachedRomsDiv = ce('div');
    var cacheRom = ce('input');
    cacheRom.type = 'checkbox';
    cacheRom.checked = true;
    cacheRom.name = 'cacheRom';
    cachedRomsDiv.appendChild(cacheRom);
    var w = ce('label');
    w.for = 'cacheRom';
    w.innerHTML = 'Cache this rom';
    cachedRomsDiv.appendChild(w);
    cachedRomsDiv.appendChild(ce('br'));
    cachedRomsDiv.appendChild(ce('br'));
    var p = ce('h2');
    p.innerHTML = 'Cached Roms';
    cachedRomsDiv.appendChild(p);
    cachedRomsDiv.appendChild(ce('br'));
    var games = await getCachedKeys();
    var c = ce('div');
    function showCachedRoms(games, c) {
        games.sort(gamezSortFunc);
        for (var i=0; i<games.length; i++) {
            var br = ce('br');
            var input = ce('input');
            input.type = 'radio';
            input.id = 'game-' + i;
            input.name = 'game';
            input.value = i;
            c.appendChild(input);
            var label = ce('label');
            label.for = 'game-' + i;
            label.innerHTML = games[i].name + ' - ';
            var y = ce('a');
            y.href = 'javascript:void(0)';
            y.innerHTML = 'delete';
            y.onclick = function(info, div1, div2, div3, div4) {
                return async function() {
                    if (!confirm('Are you sure you want to delete ' + info.name + ' from rom cache?')) {return};
                    div1.remove();
                    div2.remove();
                    div3.remove();
                    div4.remove();
                    await deleteRom(info.key);
                    alert('deleted!');
                    if (! c.firstChild) {
                        var p = ce('p');
                        p.innerHTML = 'There are no cached Roms';
                        c.appendChild(p);
                    };
                };
            }(games[i], input, label, br, y);
            var u = ce('a');
            u.href = 'javascript:void(0)';
            u.innerHTML = 'download';
            u.onclick = function(game) {
                return async function() {
                    var blob = await getRomData(game.key);
                    var url = URL.createObjectURL(blob);
                    var a = ce('a');
                    a.href = url;
                    a.download = game.fileName;
                    a.click();
                };
            }(games[i]);
            var p = ce('f');
            p.innerHTML = ' - ';
            label.appendChild(y);
            label.appendChild(p);
            label.appendChild(u);
            c.appendChild(label);
            c.appendChild(br);
        };
        if (games.length == 0) {
            var p = ce('p');
            p.innerHTML = 'There are no cached Roms';
            c.appendChild(p);
        };
        return c;
    };
    var c = showCachedRoms(games, c);
    c.id = 'cachedRoms';
    cachedRomsDiv.appendChild(c);
    cachedRomsDiv.appendChild(ce('br'));
    cachedRomsDiv.appendChild(ce('br'));
    cachedRomsDiv.appendChild(ce('br'));
    var submit = ce('input');
    submit.type = 'submit';
    submit.value = 'Load Game';
    submit.onclick = async function(e) {
        var games = await getCachedKeys();
        games.sort(gamezSortFunc);
        var q = false;
        var radios = document.getElementsByName('game');
        for (var i=0; i<radios.length; i++) {
            if (radios[i].checked && games[radios[i].value]) {
                var q = games[radios[i].value];
                break;
            };
        };
        if (! q) {return};
        removeDropListen();
        var game = q;
        var adUrl = document.getElementById('adUrl').value;
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        var blob = await getRomData(game.key);
        loadGame(URL.createObjectURL(blob), game.name.replaceAll("'", "\\'"), game.core, adUrl);
    };
    cachedRomsDiv.appendChild(submit);
    cachedRomsDiv.appendChild(ce('br'));
    cachedRomsDiv.appendChild(ce('br'));
    var clear = ce('button');
    clear.onclick = function() {
        if (! confirm('Are you sure you want to clear the rom cache')) {
            return;
        };
        indexedDB.deleteDatabase('emulatorGameCache');
        while(document.getElementById('cachedRoms').firstChild) {
            document.getElementById('cachedRoms').removeChild(document.getElementById('cachedRoms').firstChild);
        };
        var p = ce('p');
        p.innerHTML = 'There are no cached Roms';
        c.appendChild(p);
        alert('cleared!');
    };
    clear.innerHTML = 'Clear Cached Roms';
    cachedRomsDiv.appendChild(clear);
    if (localStorage.getItem('emubuttonCacheRoms') == 'false') {
        cachedRomsDiv.style = 'display:none;';
    };
    cachedRomsDiv.appendChild(ce('br'));
    cachedRomsDiv.appendChild(ce('br'));
    var q = ce('a');
    q.innerHTML = 'Restore saved export (requires internet)';
    q.href = 'javascript:void(0)';
    q.onclick = function(q) {
        return function() {
            var started = false;
            var p = ce('p');
            p.innerHTML = 'starting...';
            q.appendChild(p);
            var script = ce('script');
            script.onload = function() {
                setTimeout(function() {
                    if (started === false) {
                        p.remove();
                    };
                }, 2500);
                var a = ce('input');
                a.type = 'file';
                a.onchange = async function(e) {
                    started = true;
                    var zip = new JSZip();
                    var contents = await zip.loadAsync(e.target.files[0]);
                    var keys = JSON.parse(await contents.file("keys.json").async("string"));
                    for (var i=0; i<keys.length; i++) {
                        p.innerHTML = 'restoring: '+i+'/'+keys.length;
                        if (contents.files[keys[i].fileName]) {
                            var data = await contents.file(keys[i].fileName).async("arrayBuffer");
                            await createRomCache(data, keys[i].fileName, keys[i].core);
                        };
                    };
                    p.innerHTML = 'finished';
                    setTimeout(function() {p.remove();}, 2500);
                    var games = await getCachedKeys();
                    while(document.getElementById('cachedRoms').firstChild) {
                        document.getElementById('cachedRoms').removeChild(document.getElementById('cachedRoms').firstChild);
                    };
                    showCachedRoms(games, document.getElementById('cachedRoms'));
                };
                a.click();
            };
            script.src = 'https://raw.githack.com/Stuk/jszip/master/dist/jszip.js';
            document.body.appendChild(script);
        };
    }(cachedRomsDiv);
    cachedRomsDiv.appendChild(q);
    cachedRomsDiv.appendChild(ce('br'));
    cachedRomsDiv.appendChild(ce('br'));
    var q = ce('a');
    q.innerHTML = 'Save imported roms (requires internet)';
    q.href = 'javascript:void(0)';
    q.onclick = function(q, y) {
        return function() {
            q.remove();
            var p = ce('p');
            p.innerHTML = 'Starting...';
            y.appendChild(p);
            var script = ce('script');
            script.onload = async function() {
                var zip = new JSZip();
                var keys = await getCachedKeys();
                zip.file('keys.json', new Blob([JSON.stringify(keys)]));
                for (var i=0;i<keys.length; i++) {
                    zip.file(keys[i].fileName, await getRomData(keys[i].key));
                };
                var blob = await zip.generateAsync({type:"blob", compression:"DEFLATE", compressionOptions:{level:6}}, function updateCallback(metadata) {
                    var zipStatus = 'Zipping: '+metadata.percent.toFixed(2)+'%';
                    p.innerHTML = zipStatus;
                });
                var a = ce('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'emulator-button.export';
                a.click();
                setTimeout(function() {p.remove();}, 10000);
            };
            script.src = 'https://raw.githack.com/Stuk/jszip/master/dist/jszip.js';
            document.body.appendChild(script);
        };
    }(q, cachedRomsDiv);
    cachedRomsDiv.appendChild(q);
    a.appendChild(cachedRomsDiv);
    var toggleCacheSetting = ce('button');
    if (localStorage.getItem('emubuttonCacheRoms') != 'false') {
        toggleCacheSetting.innerHTML = 'Currently Caching Roms. Click to change';
    } else {
        toggleCacheSetting.innerHTML = 'Not Caching Roms. Click to change';
    };
    toggleCacheSetting.onclick = function() {
        if (localStorage.getItem('emubuttonCacheRoms') != 'false') {
            toggleCacheSetting.innerHTML = 'Not Caching Roms. Click to change';
            localStorage.setItem('emubuttonCacheRoms', false);
            cachedRomsDiv.style = 'display:none;';
        } else {
            toggleCacheSetting.innerHTML = 'Currently Caching Roms. Click to change';
            localStorage.removeItem('emubuttonCacheRoms');
            cachedRomsDiv.style = 'display:block;';
        };
    };
    a.appendChild(ce('br'));
    a.appendChild(toggleCacheSetting);
    var dev = ce('div');
    dev.innerHTML = '<br><br><h1>Dev Options</h1><p>ad (iframe) url</p><input type="text" id="adUrl"><br><br>';
    var button = ce('button');
    button.onclick = function() {
        document.getElementById('dev').style = 'display:none;';
        localStorage.removeItem('emuButtonDev');
    };
    button.innerHTML = 'turn off dev mode';
    dev.appendChild(button);
    dev.style = 'display:'+(localStorage.getItem('emuButtonDev') ? 'block;':'none;');
    dev.id = 'dev';
    a.appendChild(dev);
    var gl = ce('div');
    gl.id = 'gameLinks';
    gl.style = 'display:none;';
    gl.innerHTML = '<br><br><h1>Game Links</h1><p><a href="https://archive.org/download/NintendoMultiRomCollectionByGhostware">nes roms</a></p><p><a href="https://archive.org/download/SuperNintendoUSACollectionByGhostware">snes roms</a></p><p><a href="https://archive.org/download/GameboyClassicRomCollectionByGhostware">gameboy classic roms</a></p><p><a href="https://archive.org/download/Nintendo64V2RomCollectionByGhostware">nintendo 64 roms</a></p><p><a href="https://archive.org/download/NintendoDSRomCollectionByGhostware">nintendo ds roms</a></p>';
    a.appendChild(gl);
    a.appendChild(ce('br'));
    a.appendChild(ce('br'));
    var p = ce('p');
    p.innerHTML = 'Game-Button: Version 5.2';
    a.appendChild(p);
    var b = ce('p');
    b.innerHTML = 'Button Last Updated: January 8, 2022';
    a.appendChild(b);
    var p = ce('p');
    p.innerHTML = 'Offline Mode: CHECKING';
    p.id = 'offlineStatus';
    a.appendChild(p);
    document.body.appendChild(a);
    document.addEventListener('keydown', keyDDown, false);
    checkForUpdate();
    setTimeout(function() {
        cacheCommonModules();
    }, 2000);
})();
