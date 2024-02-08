(async function() {
    const ce = function(e) {return document.createElement(e);};
    const br = function(e) {e.appendChild(ce('br'))};
    const cp = function(e, t, id) {
        const p = ce('p');
        p.innerHTML = t||'';
        if (id) {p.id=id;};
        e.appendChild(p);
        return p;
    };
    var resetPageContents = function() {
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        document.body.style = 'backgroundColor: white;';
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
    const emuVersion = {{VERSION}};
    const domainForUrls = await (async function() {
        /*
        TODO
        resetPageContents();
        const a = ce('div');
        const html = "All resources are blocked! Follow these steps to get the EmulatorJS resources.\n\n1. Go to https://github.com/EmulatorJS/EmulatorJS/\n2. Select \"code\" and click \"Download ZIP\".\n3. Upload the zip below:";
        a.innerText = html;
        br(a);
        const file = ce("input");
        file.type = "file";
        file.addEventListener("change", (e) => {
            const file = e.target.files[0];
            console.log(file);
        })
        a.appendChild(file);
        document.body.appendChild(a);
        
        return;
        */
        const availableURLs = ["https://cdn.emulatorjs.org/stable/data/", "https://demo.emulatorjs.org/data/"];
        if (window.navigator.onLine === false && availableURLs.includes(localStorage.getItem('emuButtonResourceDomain'))) return localStorage.getItem('emuButtonResourceDomain');
        console.log("Loading...");
        alert("Loading...");
        for (let i=0; i<availableURLs.length; i++) {
            try {
                let res = await fetch(availableURLs[i]+'version.json');
                localStorage.setItem('emuButtonResourceDomain', availableURLs[i]);
                console.log("got", availableURLs[i]);
                return availableURLs[i];
            } catch(e) {}
        }
        console.log("Error! All available resource locations are not available (may be blocked?)");
        alert("Error! All available resource locations are not available (may be blocked/offline?)");
    })();
    const updateFiles = window.navigator.onLine;
    async function checkForUpdate() {
        let version;
        try {
            version = await fetch('https://rawcdn.githack.com/EmulatorJS/emulator-button/main/version.json');
            version = JSON.parse(await version.text());
        } catch(e) {
            return;
        };
        const usingVersion = emuVersion;
        if (usingVersion < version.current_version) {
            const a = ce('div');
            let html = '<h2>Version ' + version.current_version + ' is out! <a href="https://rawcdn.githack.com/EmulatorJS/emulator-button/main/index.html" target="_blank">Click Here</a> to update.</h2><p>Changes:</p><ul>';
            for (let i=usingVersion+0.1; i<=version.current_version; i+=0.1) {
                i = Math.round(i*10)/10;
                const y = i.toString();
                if (version.changes[y]) {
                    for (var w=0; w<version.changes[y].length; w++) {
                        html += '<li>' + version.changes[y][w] + '</li>';
                    };
                };
            };
            html += '</ul><br>';
            a.innerHTML = html;
            document.getElementById('emulatorjsElemAfterTitle').parentNode.insertBefore(a, document.getElementById('emulatorjsElemAfterTitle'));
        };
    };
    if (typeof window.EJS_terminate == 'function') {
        EJS_terminate();
    }
    if (String.prototype.replaceAll === undefined) {
        String.prototype.replaceAll = function(a, b) {
            return this.split(a).join(b);
        };
    };
    let pressText = '';
    function keyDDown(e) {
        const key = e.key;
        if (key == 'Backspace') {
            pressText = '';
        } else {
            pressText += key.toLowerCase();
        };
        if (pressText.includes('dev mode')) {
            pressText = '';
            document.getElementById('dev').style = 'display:block;';
            localStorage.setItem('emuButtonDev', true);
        } else if (pressText.includes('show me games')) {
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
    function get(key, dbName, storeName) {
        return new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open(dbName, 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction([storeName], "readwrite");
                var objectStore = transaction.objectStore(storeName);
                var request = objectStore.get(key);
                request.onsuccess = async function(e) {
                    resolve(request.result);
                };
                request.onerror = function() {resolve()};
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                };
            };
        });
    };
    function put(key, data, dbName, storeName) {
        return new Promise(function(resolve, reject) {
            var openRequest = indexedDB.open(dbName, 1);
            openRequest.onerror = function() {};
            openRequest.onsuccess = function() {
                var db = openRequest.result;
                var transaction = db.transaction([storeName], "readwrite");
                var objectStore = transaction.objectStore(storeName);
                var request = objectStore.put(data, key);
                request.onerror = function() {resolve()};
                request.onsuccess = function() {resolve()};
            };
            openRequest.onupgradeneeded = function() {
                var db = openRequest.result;
                if (! db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                };
            };
        })
    };
    async function getCachedFileUrl(key, path, mime, update) {
        if (! update) {
            var file = await get(key, 'mainEmuFiles', 'mainEmuFiles');
            if (file) {
                return URL.createObjectURL(new Blob([file], {type: mime}));
            }
        }
        try {
            var asd = await fetch(path, {cache: 'reload'});
            var buffer = await asd.arrayBuffer();
            await put(key, buffer, 'mainEmuFiles', 'mainEmuFiles');
            return URL.createObjectURL(new Blob([buffer], {type: mime}));
        } catch(e) {
            if (update) {
                var file = await get(key, 'mainEmuFiles', 'mainEmuFiles');
                if (file)
                    return URL.createObjectURL(new Blob([file], {type: mime}));
            }
            throw e;
        };
    };
    async function getCachedKeys() {
        var keys = await get('keys', 'emulatorGameCache', 'emulatorGameCache');
        if (! keys) {
            keys = [];
            await put('keys', [], 'emulatorGameCache', 'emulatorGameCache');
        };
        return keys;
    };
    async function getRomData(key) {
        var a = await get(key, 'emulatorGameCache', 'emulatorGameCache');
        return new Blob([a]);
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
                    var request = objectStore.put('keys', newKeys);
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
        var keys = await getCachedKeys();
        var key = fileName.trim().split(' ').join('').toLowerCase();
        var key = key.trim().substr(0, key.length - key.split('.').pop().length - 1);
        var name = fileName.trim().substr(0, fileName.length - fileName.split('.').pop().length - 1);
        var newKey = {key: key, name: name, core: core, fileName: fileName};
        for (var i=0; i<keys.length; i++) {
            if (keys[i].key == newKey.key && keys[i].core == newKey.core) {
                return;
            };
        };
        keys.push(newKey);
        await put('keys', keys, 'emulatorGameCache', 'emulatorGameCache');
        await put(key, data, 'emulatorGameCache', 'emulatorGameCache');
    };
    async function cacheCommonModules() {
        const js = 'text/javascript';
        const baseUrl = domainForUrls;
        const status = document.getElementById('offlineStatus');
        try {
            await getCachedFileUrl('loader', baseUrl + 'loader.js', js, true);
            await getCachedFileUrl('rar', baseUrl + 'compression/libunrar.js', js, true);
            await getCachedFileUrl('rarWasm', baseUrl + 'compression/libunrar.wasm', "application/wasm", true);
            await getCachedFileUrl('zip', baseUrl + 'compression/extractzip.js', js, true);
            await getCachedFileUrl('7zip', baseUrl + 'compression/extract7z.js', js, true);
            await getCachedFileUrl('emuMin', baseUrl + 'emulator.min.js', js, true);
            await getCachedFileUrl('emuCSS', baseUrl + 'emulator.min.css', 'text/css', true);
            status.innerHTML = 'Offline Mode: READY';
        } catch(e) {
            status.innerHTML = 'Offline Mode: NOT READY';
        };
    };
    async function loadGame(fileURL, gameName, core, adUrl, color, useOldCores, lang) {
        document.removeEventListener('keydown', keyDDown, false);
        const js = 'text/javascript';
        const base = domainForUrls;
        try {
            var loader = await getCachedFileUrl('loader', base + 'loader.js', js);
            var rar = await getCachedFileUrl('rar', base + 'compression/libunrar.js', js);
            var rarWasm = await getCachedFileUrl('rarWasm', base + 'compression/libunrar.wasm', "application/wasm");
            var zip = await getCachedFileUrl('zip', base + 'compression/extractzip.js', js);
            var sevenzip = await getCachedFileUrl('7zip', base + 'compression/extract7z.js', js);
            var emuMin = await getCachedFileUrl('emuMin', base + 'emulator.min.js', js);
            var emuCSS = await getCachedFileUrl('emuCSS', base + 'emulator.min.css', 'text/css');
        } catch(e) {
            console.warn(e);
            alert('Looks like githack is down or you are offline. Please try again later.');
            return;
        }
        var paths = {
            "emulator.min.js": emuMin,
            "emulator.min.css": emuCSS,
            "extract7z.js": sevenzip,
            "extractzip.js": zip,
            "libunrar.js": rar,
            "libunrar.wasm": rarWasm
        };
        var b = ce('style');
        b.innerHTML = '*{padding:0;margin:0;}';
        document.body.appendChild(b);
        var a = ce('div');
        a.innerHTML = '<div id="game"></div>';
        a.style = 'width:'+window.innerWidth+'px;height:'+window.innerHeight+'px;max-width:100%';
        window.onresize = function() {
            a.style = 'width:'+window.innerWidth+'px;height:'+window.innerHeight+'px;max-width:100%';
        };
        document.body.appendChild(a);
        EJS_language = lang;
        EJS_color = color;
        EJS_startOnLoaded = true;
        EJS_paths = paths;
        EJS_player = '#game';
        EJS_gameName = gameName;
        EJS_gameUrl = fileURL;
        EJS_core = core;
        EJS_pathtodata = base;
        if (adUrl && adUrl.trim() != '') {
            EJS_AdUrl = adUrl;
        };
        EJS_oldCores = useOldCores || false;
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
    br(a);
    var file = ce('input');
    async function selectedFile(file) {
        if (document.getElementById('offlineStatus') && document.getElementById('offlineStatus').innerHTML === 'Offline Mode: NOT READY' && window.navigator.onLine === false) {
            alert('either you are offline, or githack is down, please try again later');
            return;
        }
        var adUrl = document.getElementById('adUrl').value;
        var color = document.getElementById('color').value;
        var useOldCores = oldCores.checked;
        var lang = document.getElementById('lang').selectedOptions[0].value;
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
                                 "Atari 2600": "atari2600",
                                 "Atari 5200": "atari5200"};
                    var a = ce('div');
                    a.style = 'padding: 50px;';
                    var p = ce('h2');
                    p.innerHTML = 'Unable to auto-detect system. Please select the desired system.';
                    a.appendChild(p);
                    br(a);
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
                        br(a);
                    };
                    br(a);
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
        loadGame(fileURL, gameName, core, adUrl, color, useOldCores, lang);
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
    br(a);
    br(a);
    br(a);
    var detectCore = ce('input');
    detectCore.type = 'checkbox';
    detectCore.checked = true;
    detectCore.name = 'detectCore';
    a.appendChild(detectCore);
    var w = ce('label');
    w.for = 'detectCore';
    w.innerHTML = 'Auto-detect core';
    a.appendChild(w);
    br(a);
    br(a);
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
    br(cachedRomsDiv);
    br(cachedRomsDiv);
    var oldCores = ce('input');
    oldCores.type = 'checkbox';
    oldCores.name = 'oldCores';
    cachedRomsDiv.appendChild(oldCores);
    var w = ce('label');
    w.for = 'oldCores';
    w.innerHTML = 'Use Old Cores';
    cachedRomsDiv.appendChild(w);
    br(cachedRomsDiv);
    br(cachedRomsDiv);
    var p = ce('h2');
    p.innerHTML = 'Cached Roms';
    cachedRomsDiv.appendChild(p);
    br(cachedRomsDiv);
    var search = ce('ul');
    search.innerHTML += 'Search: ';
    var w = ce('input');
    w.type = 'search';
    w.addEventListener('input', function(element) {
        return async function(e) {
            var value = e.target.value.toLowerCase();
            var games = await getCachedKeys();
            if (value.trim() === '') {
                showCachedRoms(games);
                return;
            };
            var gamez = [];
            for (var i=0; i<games.length; i++) {
                if (games[i].name.toLowerCase().includes(value)) {
                    gamez.push(games[i]);
                }
            };
            showCachedRoms(gamez, true);
        };
    }(w));
    search.appendChild(w);
    cachedRomsDiv.appendChild(search);
    br(cachedRomsDiv);
    var c = ce('ul');
    var gameUiArray;
    async function showCachedRoms(games, isSearch) {
        if (! games) {
            games = await getCachedKeys();
        };
        games.sort(gamezSortFunc);
        gameUiArray = games;
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        };
        for (var i=0; i<games.length; i++) {
            var brr = ce('br');
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
                        cp(c, isSearch ? 'No roms match your search' : 'There are no cached Roms');
                    };
                };
            }(games[i], input, label, brr, y);
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
            label.appendChild(u);
            var x = ce('asfdgh');
            x.innerHTML = ' - ';
            label.appendChild(x);
            label.appendChild(y);
            c.appendChild(label);
            c.appendChild(brr);
        };
        if (games.length === 0) {
            cp(c, isSearch ? 'No roms match your search' : 'There are no cached Roms');
        };
    };
    await showCachedRoms();
    cachedRomsDiv.appendChild(c);
    br(cachedRomsDiv);
    br(cachedRomsDiv);
    br(cachedRomsDiv);
    var submit = ce('input');
    submit.type = 'submit';
    submit.value = 'Load Game';
    submit.onclick = async function(e) {
        if (document.getElementById('offlineStatus') && document.getElementById('offlineStatus').innerHTML === 'Offline Mode: NOT READY' && window.navigator.onLine === false) {
            alert('either you are offline, or githack is down, please try again later');
            return;
        }
        var games = gameUiArray;
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
        var color = document.getElementById('color').value;
        var useOldCores = oldCores.checked;
        var lang = document.getElementById('lang').selectedOptions[0].value;
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        var blob = await getRomData(game.key);
        loadGame(URL.createObjectURL(blob), game.name.replaceAll("'", "\\'"), game.core, adUrl, color, useOldCores, lang);
    };
    cachedRomsDiv.appendChild(submit);
    br(cachedRomsDiv);
    br(cachedRomsDiv);
    var clear = ce('button');
    clear.onclick = async function() {
        if (! confirm('Are you sure you want to clear the rom cache')) {
            return;
        };
        indexedDB.deleteDatabase('emulatorGameCache');
        await showCachedRoms();
        alert('cleared!');
    };
    clear.innerHTML = 'Clear Cached Roms';
    cachedRomsDiv.appendChild(clear);
    if (localStorage.getItem('emubuttonCacheRoms') == 'false') {
        cachedRomsDiv.style = 'display:none;';
    };
    br(cachedRomsDiv);
    var qwe = ce('div');
    br(qwe);
    qwe.style = window.navigator.onLine?'display:inline;':'display:none;';
    var q = ce('a');
    q.innerHTML = 'Restore saved export';
    q.href = 'javascript:void(0)';
    q.onclick = function(q) {
        return function() {
            var started = false;
            var p = ce('p');
            p.innerHTML = 'starting...';
            q.appendChild(p);
            var script = ce('script');
            script.onload = function() {
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
                    await showCachedRoms();
                };
                a.click();
            };
            script.onerror = function() {
                alert("Something went wrong... Maybe githack is blocked?");
            }
            script.src = 'https://rawcdn.githack.com/Stuk/jszip/master/dist/jszip.js';
            document.body.appendChild(script);
        };
    }(qwe);
    qwe.appendChild(q);
    br(qwe);
    br(qwe);
    var t = ce('a');
    t.innerHTML = 'Save imported roms';
    t.href = 'javascript:void(0)';
    t.onclick = function(t, y) {
        return function() {
            t.remove();
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
            script.onerror = function() {
                alert("Something went wrong... Maybe githack is blocked?");
            }
            script.src = 'https://rawcdn.githack.com/Stuk/jszip/master/dist/jszip.js';
            document.body.appendChild(script);
        };
    }(t, qwe);
    window.addEventListener('online',  function(qwe) {
        return function() {
            qwe.style = 'display:inline;';
        }
    }(qwe));
    window.addEventListener('offline',  function(qwe) {
        return function() {
            qwe.style = 'display:none;';
        }
    }(qwe));
    qwe.appendChild(t);
    cachedRomsDiv.appendChild(qwe);
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
    br(a);
    a.appendChild(toggleCacheSetting);
    br(a);
    br(a);
    var div = ce('div');
    div.innerHTML = 'Color Theme: <input type="color" id="color" value="'+(localStorage.getItem('emuColorTheme')||'#0011ff')+'">';
    a.appendChild(div);
    var div = ce('div');
    div.innerHTML = '<br>Language: <select id="lang"><option value="en-US">English</option><option value="pt-BR">Portuguese Brasil</option><option value="es-ES">Spanish</option><option value="el-GR">Greek</option><option value="ja-JA">Japanese</option></select>';
    a.appendChild(div);
    var dev = ce('div');
    dev.innerHTML = '<br><br><h1>Dev Options</h1>ad (iframe) url: <input type="text" id="adUrl"><br><br><br>';
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
    gl.innerHTML = '<br><br><h1>Game Links</h1><p><a href="https://archive.org/download/NintendoMultiRomCollectionByGhostware">Nes roms</a></p><p><a href="https://archive.org/download/SuperNintendoUSACollectionByGhostware">Snes roms</a></p><p><a href="https://archive.org/download/GameboyClassicRomCollectionByGhostware">Gameboy classic roms</a></p><p><a href="https://archive.org/download/Nintendo64V2RomCollectionByGhostware">Nintendo 64 roms</a></p><p><a href="https://archive.org/download/NintendoDSRomCollectionByGhostware">Nintendo ds roms</a></p>';
    a.appendChild(gl);
    br(a);
    br(a);
    cp(a, 'Game-Button: Version '+emuVersion);
    cp(a, 'Offline Mode: '+(updateFiles?'CHECKING':'READY'), 'offlineStatus');
    document.body.appendChild(a);
    document.getElementById('color').addEventListener('change', function(e) {
        localStorage.setItem('emuColorTheme', document.getElementById('color').value);
    });
    document.addEventListener('keydown', keyDDown, false);
    if (updateFiles !== false) {
        checkForUpdate();
        cacheCommonModules();
    };
})();
