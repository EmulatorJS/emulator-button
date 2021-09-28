(async function() {
    fetch('https://raw.githack.com/ethanaobrien/emulator-button/main/version.json').then(async function(response) {
        var body = await response.text();
        var usingVersion = 2.4;
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
    a.appendChild(document.createElement('br'));
    var input = document.createElement('input');
    input.onchange = async function() {
        var file = input.files[0];
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
    };
    input.type = 'file';
    a.appendChild(input);
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var p = document.createElement('p');
    p.innerHTML = 'Game-Button: Version 2.4';
    a.appendChild(p);
    var b = document.createElement('p');
    b.innerHTML = 'Button Last Updated: September 28, 2021';
    a.appendChild(b);
    document.body.appendChild(a);
})();
