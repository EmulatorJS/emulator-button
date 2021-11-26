(async function() {
    (async function() {
        try {
            var version = {
                current_version: 4.6,
                jsFilesVersion: false
            };
            window.versionJSON = version;
            var version = await fetch('https://raw.githack.com/ethanaobrien/emulator-button/main/version.json');
            var version = await version.text();
            var version = JSON.parse(version);
        } catch(e) {
            var version = {
                current_version: 4.6,
                jsFilesVersion: false
            };
        };
        window.versionJSON = version;
        var usingVersion = 4.6;
        if (usingVersion < version.current_version) {
            alert('You have version ' + usingVersion + ' but the newest version is ' + version.current_version + '. ' + version.changes);
            if (confirm('Do you want to update? (Github Pages will open)')) {
                window.open('https://raw.githack.com/ethanaobrien/emulator-button/main/index.html');
            };
        };
    })();
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
    function getCachedFileUrl(key, path, mime, forceUpdate) {
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
                    if (! file || forceUpdate) {
                        try {
                            var asd = await fetch(path);
                        } catch(e) {
                            reject(e);
                            return;
                        };
                        var buffer = await asd.arrayBuffer();
                        var transaction = db.transaction(["mainEmuFiles"], "readwrite");
                        var objectStore = transaction.objectStore("mainEmuFiles");
                        var request = objectStore.put(buffer, key);
                        request.onsuccess = function() {};
                        request.onerror = function() {};
                        resolve(URL.createObjectURL(new Blob([buffer], {type: mime})));
                        return;
                    };
                    resolve(URL.createObjectURL(new Blob([file], {type: mime})));
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
        var cachedFilesVersion = localStorage.getItem('commonModulesCacheVersion');
        if (typeof cachedFilesVersion != 'number') {
            localStorage.removeItem('commonModulesCacheVersion');
        };
        var status = document.getElementById('offlineStatus');
        if (! cachedFilesVersion) {
            var forceUpdate = true;
            status.innerHTML = 'Offline Mode: DOWNLOADING FILES';
        } else if (window.versionJSON && window.versionJSON.jsFilesVersion && cachedFilesVersion < window.versionJSON.jsFilesVersion) {
            var forceUpdate = true;
            status.innerHTML = 'Offline Mode: UPDATING FILES';
            localStorage.setItem('commonModulesCacheVersion', window.versionJSON.jsFilesVersion);
        } else {
            var forceUpdate = false;
            status.innerHTML = 'Offline Mode: READY';
        };
        var baseUrl = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/';
        try {
            getCachedFileUrl('loader', 'https://raw.githack.com/ethanaobrien/emulator-button/main/data/loader.js', js, forceUpdate);
            getCachedFileUrl('webrtc', baseUrl + 'webrtc-adapter.js', js, forceUpdate);
            getCachedFileUrl('rar', baseUrl + 'libunrar.js', js, forceUpdate);
            getCachedFileUrl('zip', baseUrl + 'extractzip.js', js, forceUpdate);
            getCachedFileUrl('7zip', baseUrl + 'extract7z.js', js, forceUpdate);
            getCachedFileUrl('emulator', 'https://raw.githack.com/ethanaobrien/emulator-button/main/data/emulator.js', js, forceUpdate);
            getCachedFileUrl('rarMem', baseUrl+'libunrar.js.mem', js, forceUpdate);
            var v = await getCachedFileUrl('v', baseUrl + 'v.json', 'application/json', forceUpdate);
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
            var title = document.createElement('title');
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
    async function loadGame(fileURL, gameName, core) {
        var js = 'text/javascript';
        var base = 'https://raw.githack.com/ethanaobrien/emulatorjs/main/data/';
        var loader = await getCachedFileUrl('loader', 'https://raw.githack.com/ethanaobrien/emulator-button/main/data/loader.js', js);
        var webrtc = await getCachedFileUrl('webrtc', base+'webrtc-adapter.js', js);
        var rar = await getCachedFileUrl('rar', base+'libunrar.js', js);
        var rarMem = await getCachedFileUrl('rarMem', base+'libunrar.js.mem', 'application/json');
        var zip = await getCachedFileUrl('zip', base+'extractzip.js', js);
        var sevenzip = await getCachedFileUrl('7zip', base+'extract7z.js', js);
        var emulator = await getCachedFileUrl('emulator', 'https://raw.githack.com/ethanaobrien/emulator-button/main/data/emulator.js', js);
        var v = await getCachedFileUrl('v', base+'v.json', 'application/json');
        var paths = {
            "v": v,
            "emulator": emulator,
            "7z": sevenzip,
            "zip": zip,
            "rar": rar,
            "webrtc": webrtc,
            "rarMem": rarMem
        };
        var a = document.createElement('div');
        a.style = "width:640px;height:480px;max-width:100%";
        var b = document.createElement('div');
        b.id = 'game';
        a.appendChild(b);
        document.body.appendChild(a);
        var script = document.createElement('script');
        script.innerHTML = "EJS_player = '#game'; EJS_biosUrl = ''; EJS_gameName = '" + gameName + "'; EJS_gameUrl = '" + fileURL + "'; EJS_core = '" + core + "'; EJS_lightgun = false; EJS_pathtodata = '"+base+"'; EJS_PATHS = " + JSON.stringify(paths) + ";";
        document.body.appendChild(script);
        var script = document.createElement('script');
        script.src = loader;
        document.body.appendChild(script);
        
    };
    resetPageContents();
    var a = document.createElement('div');
    a.style = 'padding: 50px;';
    var header = document.createElement('h1');
    header.style = 'font-size: 45px;';
    header.innerHTML = 'Gamez';
    a.appendChild(header);
    var b = document.createElement('p');
    b.innerHTML = 'Click the choose file button to upload a rom (you can also drag and drop the file)';
    a.appendChild(b);
    a.appendChild(document.createElement('br'));
    var file = document.createElement('input');
    async function selectedFile(file) {
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        var extension = file.name.split('.').pop().toLowerCase();
        var detectCore = document.createElement('input');
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
                    function askForCore() {
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
                        var a = document.createElement('div');
                        a.style = 'padding: 50px;';
                        var p = document.createElement('h2');
                        p.innerHTML = 'Unable to auto-detect system. Please select the desired system.';
                        a.appendChild(p);
                        a.appendChild(document.createElement('br'));
                        for (var k in cores) {
                            var input = document.createElement('input');
                            input.type = 'radio';
                            input.id = 'game-' + cores[k];
                            input.name = 'game';
                            input.value = cores[k];
                            a.appendChild(input);
                            var label = document.createElement('label');
                            label.for = 'game-' + cores[k];
                            label.innerHTML = k;
                            a.appendChild(label);
                            a.appendChild(document.createElement('br'));
                        };
                        a.appendChild(document.createElement('br'));
                        var submit = document.createElement('input');
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
                    };
                    if ((extension == 'zip' || extension == '7z' || extension == 'rar') && detectCore.checked) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            if (extension == '7z') {
                                var text = e.target.result.split('');
                                var newText = [];
                                for (var i=0; i<text.length; i++) {
                                    if ('abcdefghijklmnopjrstuvwxyz.'.split('').includes(text[i].toLowerCase())) {
                                        newText.push(text[i]);
                                    };
                                };
                                var text = newText.join('').toLowerCase();
                            } else {
                                var text = e.target.result.toLowerCase();
                            };
                            if (text.split('.nes').length != 1 || text.split('.fds').length != 1 || text.split('.unif').length != 1 || text.split('.unf').length != 1) {
                                resolve('nes');
                            } else if (text.split('.z64').length != 1) {
                                resolve('n64');
                            } else if (text.split('.nds').length != 1) {
                                resolve('nds');
                            } else if (text.split('.gba').length != 1) {
                                resolve('gba');
                            } else if (text.split('.gb').length != 1) {
                                resolve('gb');
                            } else if (text.split('.smc').length != 1 || text.split('.fig').length != 1 || text.split('.sfc').length != 1 || text.split('.gd3').length != 1 || text.split('.gd7').length != 1 || text.split('.dx2').length != 1 || text.split('.bsx').length != 1 || text.split('.swc').length != 1) {
                                resolve('snes');
                            } else {
                                askForCore();
                            };
                        };
                        reader.readAsText(file);
                    } else {
                        askForCore();
                    };
                });
            }();
        };
        var fileURL = URL.createObjectURL(new Blob([file]));
        loadGame(fileURL, gameName, core);
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
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var detectCore = document.createElement('input');
    detectCore.type = 'checkbox';
    detectCore.checked = true;
    detectCore.name = 'detectCore';
    a.appendChild(detectCore);
    var w = document.createElement('label');
    w.for = 'detectCore';
    w.innerHTML = 'Auto-detect core';
    a.appendChild(w);
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var cachedRomsDiv = document.createElement('div');
    var cacheRom = document.createElement('input');
    cacheRom.type = 'checkbox';
    cacheRom.checked = true;
    cacheRom.name = 'cacheRom';
    cachedRomsDiv.appendChild(cacheRom);
    var w = document.createElement('label');
    w.for = 'cacheRom';
    w.innerHTML = 'Cache this rom';
    cachedRomsDiv.appendChild(w);
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    var p = document.createElement('h2');
    p.innerHTML = 'Cached Roms';
    cachedRomsDiv.appendChild(p);
    cachedRomsDiv.appendChild(document.createElement('br'));
    var games = await getCachedKeys();
    var c = document.createElement('div');
    function showCachedRoms(games, c) {
        games.sort(gamezSortFunc);
        for (var i=0; i<games.length; i++) {
            var br = document.createElement('br');
            var input = document.createElement('input');
            input.type = 'radio';
            input.id = 'game-' + i;
            input.name = 'game';
            input.value = i;
            c.appendChild(input);
            var label = document.createElement('label');
            label.for = 'game-' + i;
            label.innerHTML = games[i].name + ' - ';
            var y = document.createElement('a');
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
                        var p = document.createElement('p');
                        p.innerHTML = 'There are no cached Roms';
                        c.appendChild(p);
                    };
                };
            }(games[i], input, label, br, y);
            var u = document.createElement('a');
            u.href = 'javascript:void(0)';
            u.innerHTML = 'download';
            u.onclick = function(game) {
                return async function() {
                    var blob = await getRomData(game.key);
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = game.fileName;
                    a.click();
                };
            }(games[i]);
            var p = document.createElement('f');
            p.innerHTML = ' - ';
            label.appendChild(y);
            label.appendChild(p);
            label.appendChild(u);
            c.appendChild(label);
            c.appendChild(br);
        };
        if (games.length == 0) {
            var p = document.createElement('p');
            p.innerHTML = 'There are no cached Roms';
            c.appendChild(p);
        };
        return c;
    };
    var c = showCachedRoms(games, c);
    c.id = 'cachedRoms';
    cachedRomsDiv.appendChild(c);
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    var submit = document.createElement('input');
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
        
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        var blob = await getRomData(game.key);
        loadGame(URL.createObjectURL(blob), game.name.replaceAll("'", "\\'"), game.core);
    };
    cachedRomsDiv.appendChild(submit);
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    var clear = document.createElement('button');
    clear.onclick = function() {
        if (! confirm('Are you sure you want to clear the rom cache')) {
            return;
        };
        indexedDB.deleteDatabase('emulatorGameCache');
        while(document.getElementById('cachedRoms').firstChild) {
            document.getElementById('cachedRoms').removeChild(document.getElementById('cachedRoms').firstChild);
        };
        var p = document.createElement('p');
        p.innerHTML = 'There are no cached Roms';
        c.appendChild(p);
        alert('cleared!');
    };
    clear.innerHTML = 'Clear Cached Roms';
    cachedRomsDiv.appendChild(clear);
    if (localStorage.getItem('emubuttonCacheRoms') == 'false') {
        cachedRomsDiv.style = 'display:none;';
    };
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    var q = document.createElement('a');
    q.innerHTML = 'Restore saved export (requires internet)';
    q.href = 'javascript:void(0)';
    q.onclick = function(q) {
        return function() {
            var p = document.createElement('p');
            p.innerHTML = 'starting...';
            q.appendChild(p);
            var script = document.createElement('script');
            script.onload = function() {
                var a = document.createElement('input');
                a.type = 'file';
                a.onchange = async function(e) {
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
                    setTimeout(function() {p.remove();}, 5000);
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
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    var q = document.createElement('a');
    q.innerHTML = 'Save imported roms (requires internet)';
    q.href = 'javascript:void(0)';
    q.onclick = function(q, y) {
        return function() {
            q.remove();
            var p = document.createElement('p');
            p.innerHTML = 'Starting...';
            y.appendChild(p);
            var script = document.createElement('script');
            script.onload = async function() {
                var zip = new JSZip();
                var keys = await getCachedKeys();
                zip.file('keys.json', new Blob([JSON.stringify(keys)]));
                for (var i=0;i<keys.length; i++) {
                    zip.file(keys[i].fileName, await getRomData(keys[i].key));
                };
                var blob = await zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
                    var zipStatus = 'Zipping: '+metadata.percent.toFixed(2)+'%';
                    p.innerHTML = zipStatus;
                });
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'emulator-button.export';
                a.click();
            };
            script.src = 'https://raw.githack.com/Stuk/jszip/master/dist/jszip.js';
            document.body.appendChild(script);
        };
    }(q, cachedRomsDiv);
    cachedRomsDiv.appendChild(q);
    a.appendChild(cachedRomsDiv);
    var toggleCacheSetting = document.createElement('button');
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
    a.appendChild(document.createElement('br'));
    a.appendChild(toggleCacheSetting);
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var p = document.createElement('p');
    p.innerHTML = 'Game-Button: Version 4.6';
    a.appendChild(p);
    var b = document.createElement('p');
    b.innerHTML = 'Button Last Updated: November 26, 2021';
    a.appendChild(b);
    var p = document.createElement('p');
    p.innerHTML = 'Offline Mode: CHECKING';
    p.id = 'offlineStatus';
    a.appendChild(p);
    document.body.appendChild(a);
    setTimeout(function() {
        cacheCommonModules();
    }, 2000);
})();
