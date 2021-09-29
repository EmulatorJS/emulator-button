(async function() {
    fetch('https://raw.githack.com/ethanaobrien/emulator-button/main/version.json').then(async function(response) {
        var body = await response.text();
        var usingVersion = 3;
        var version = JSON.parse(body);
        if (usingVersion < version.current_version) {
            alert('You have version ' + usingVersion + ' but the newest version is ' + version.current_version + '. ' + version.changes);
            if (confirm('Do you want to update? (Github Pages will open)')) {
                window.open('https://raw.githack.com/ethanaobrien/emulator-button/main/index.html');
            };
        };
    });
    if (String.prototype.replaceAll === undefined) {
        String.prototype.replaceAll = function(a, b) {
            return this.split(a).join(b);
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
    }
    function createRomCache(data, fileName, core) {
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
                if (keys.includes(key) || key == 'keys') {return};
                var newKey = {key: key, name: name, core: core, fileName: fileName};
                keys.push(newKey);
                var request = objectStore.put(keys, 'keys');
                request.onsuccess = function() {};
                request.onerror = function() {};
                var request2 = objectStore.put(data, key);
                request2.onsuccess = function() {};
                request2.onerror = function() {};
            };
        };
        openRequest.onupgradeneeded = function() {
            var db = openRequest.result;
            if (! db.objectStoreNames.contains('emulatorGameCache')) {
                db.createObjectStore('emulatorGameCache');
            };
        };
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
    var input = document.createElement('input');
    async function selectedFile(file) {
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        var extension = file.name.split('.').pop();
        var gameName = file.name.replaceAll("'", "\\'");
        var gameName = gameName.substr(0, gameName.length - extension.length - 1);
        if (['fds', 'nes', 'unif', 'unf'].includes(extension)) {
            var core = 'nes';
        } else if (['z64'].includes(extension)) {
            var core = 'n64';
        } else if (['smc', 'fig', 'sfc', 'gd3', 'gd7', 'dx2', 'bsx', 'swc'].includes(extension)) {
            var core = 'snes';
        } else if (['nds'].includes(extension)) {
            var core = 'nds';
        } else if (['gba'].includes(extension)) {
            var core = 'gba';
        } else if (['gb'].includes(extension)) {
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
                });
            }();
        };
        var fileURL = URL.createObjectURL(new Blob([file]));
        var a = document.createElement('div');
        a.style = "width:640px;height:480px;max-width:100%";
        var b = document.createElement('div');
        b.id = 'game';
        a.appendChild(b);
        document.body.appendChild(a);
        var script = document.createElement('script');
        script.innerHTML = "EJS_player = '#game'; EJS_biosUrl = ''; EJS_gameName = '" + gameName + "'; EJS_gameUrl = '" + fileURL + "'; EJS_core = '" + core + "'; EJS_lightgun = false; EJS_pathtodata = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/'; ";
        document.body.appendChild(script);
        var script = document.createElement('script');
        script.src = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/loader.js';
        document.body.appendChild(script);
        if (localStorage.getItem('emubuttonCacheRoms') != 'false') {
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
    input.onchange = function() {selectedFile(input.files[0])};
    input.type = 'file';
    a.appendChild(input);
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var cachedRomsDiv = document.createElement('div');
    var p = document.createElement('h2');
    p.innerHTML = 'Cached Roms';
    cachedRomsDiv.appendChild(p);
    cachedRomsDiv.appendChild(document.createElement('br'));
    var games = await getCachedKeys();
    games.sort(gamezSortFunc);
    var c = document.createElement('div');
    for (var i=0; i<games.length; i++) {
        var input = document.createElement('input');
        input.type = 'radio';
        input.id = 'game-' + i;
        input.name = 'game';
        input.value = i;
        c.appendChild(input);
        var label = document.createElement('label');
        label.for = 'game-' + i;
        label.innerHTML = games[i].name;
        c.appendChild(label);
        c.appendChild(document.createElement('br'));
    };
    if (games.length == 0) {
        var p = document.createElement('p');
        p.innerHTML = 'There are no cached Roms';
        c.appendChild(p);
    };
    c.id = 'cachedRoms';
    cachedRomsDiv.appendChild(c);
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Load Game';
    submit.onclick = async function(e) {
        var q = false;
        var radios = document.getElementsByName('game');
        for (var i=0; i<radios.length; i++) {
            if (radios[i].checked) {
                var q = games[radios[i].value];
                break;
            };
        };
        if (! q) {return};
        var game = q;
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        };
        var blob = await getRomData(game.key);
        var fileURL = URL.createObjectURL(blob);
        var gameName = game.fileName.replaceAll("'", "\\'");
        var core = game.core;
        var a = document.createElement('div');
        a.style = "width:640px;height:480px;max-width:100%";
        var b = document.createElement('div');
        b.id = 'game';
        a.appendChild(b);
        document.body.appendChild(a);
        var script = document.createElement('script');
        script.innerHTML = "EJS_player = '#game'; EJS_biosUrl = ''; EJS_gameName = '" + gameName + "'; EJS_gameUrl = '" + fileURL + "'; EJS_core = '" + core + "'; EJS_lightgun = false; EJS_pathtodata = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/'; ";
        document.body.appendChild(script);
        var script = document.createElement('script');
        script.src = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/loader.js';
        document.body.appendChild(script);
    };
    cachedRomsDiv.appendChild(submit);
    cachedRomsDiv.appendChild(document.createElement('br'));
    cachedRomsDiv.appendChild(document.createElement('br'));
    var clear = document.createElement('button');
    clear.onclick = function() {
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
        }
    };
    a.appendChild(document.createElement('br'));
    a.appendChild(toggleCacheSetting);
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var p = document.createElement('p');
    p.innerHTML = 'Game-Button: Version 3';
    a.appendChild(p);
    var b = document.createElement('p');
    b.innerHTML = 'Button Last Updated: September 29, 2021';
    a.appendChild(b);
    document.body.appendChild(a);
    function drag(evt) {
        evt.dataTransfer.dropEffect = 'copy';
        evt.preventDefault();
        return false;
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
                document.removeEventListener("dragover", drag, false);
                document.removeEventListener("dragleave", drag, false);
                document.removeEventListener("dragenter", drag, false);
                document.removeEventListener("drop", drop, false);
                return;
            };
        };
        return false;
    };
    document.addEventListener("dragover", drag, false);
    document.addEventListener("dragleave", drag, false);
    document.addEventListener("dragenter", drag, false);
    document.addEventListener("drop", drop, false);
})();
