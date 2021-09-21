(async function() {
    fetch('https://raw.githack.com/ethanaobrien/emulator-button/main/version.json').then(response => {
        if (response.ok) {
            response.text().then(body => {
                var usingVersion = 2.2;
                var version = JSON.parse(body);
                if (usingVersion < version.current_version) {
                    alert('You have version ' + usingVersion + ' but the newest version is ' + version.current_version + '. ' + version.changes);
                    if (confirm('Do you want to update? (Github Pages will open)')) {
                        window.open('https://raw.githack.com/ethanaobrien/emulator-button/main/index.html');
                    };
                };
            });
        };
    });
    if (String.prototype.replaceAll === undefined) {
        String.prototype.replaceAll = function(a, b) {
            return this.split(a).join(b);
        };
    };
    var customRom = function(file) {
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
        } else {
            var core = prompt('Input core (examples: nes, snes, n64, gb, gba)');
        };
        var fileURL = URL.createObjectURL(new Blob([file]));
        var a = document.createElement('div');
        a.style = "width:640px;height:480px;max-width:100%";
        var b = document.createElement('div');
        b.id = 'game';
        a.appendChild(b);
        document.body.appendChild(a);
        var script = document.createElement('script');
        script.innerHTML = "EJS_player = '#game'; EJS_biosUrl = ''; EJS_gameName = '" + gameName + "'; EJS_gameUrl = '" + fileURL + "'; EJS_core = '" + core + "'; EJS_lightgun = false; EJS_pathtodata = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/demo/data/'; ";
        document.body.appendChild(script);
        var script = document.createElement('script');
        script.src = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/loader.js';
        document.body.appendChild(script);
    };
	try {
		var server = 'https://canvas-cluster-005.netlify.app';
		var b = await fetch(server + '/info.json');
		var games = await b.text();
		var games = JSON.parse(games);
	} catch(e) {
        try {
            var server = 'https://canvas-cluster-006.netlify.app';
            var b = await fetch(server + '/info.json');
            var games = await b.text();
            var games = JSON.parse(games);
        } catch(e) {
            while(document.body.firstChild) {
                document.body.removeChild(document.body.firstChild);
            };
            if (! document.body.style) {document.body.style = {};};
            document.body.style.backgroundColor = 'white';
            var a = document.createElement('div');
            a.style = 'padding: 50px;';
            var header = document.createElement('h1');
            header.style = 'font-size: 45px;';
            header.innerHTML = 'Gamez';
            a.appendChild(header);
            a.appendChild(document.createElement('br'));
            var p = document.createElement('p');
            p.innerHTML = 'All game servers are down, but you san still upload a rom!';
            a.appendChild(p);
            a.appendChild(document.createElement('br'));
            var input = document.createElement('input');
            input.onchange = function() {
                customRom(input.files[0]);
            };
            input.type = 'file';
            a.appendChild(input);
            a.appendChild(document.createElement('br'));
            a.appendChild(document.createElement('br'));
            a.appendChild(document.createElement('br'));
            var p = document.createElement('p');
            p.innerHTML = 'Game-Button: Version 2.0';
            a.appendChild(p);
            var b = document.createElement('p');
            b.innerHTML = 'Button Last Updated: September 20, 2021';
            a.appendChild(b);
            document.body.appendChild(a);
            return;
        };
	};
	while(document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	};
    if (! document.body.style) {document.body.style = {};};
    document.body.style.backgroundColor = 'white';
    var namez = {
        "nes": "Nintendo Entertainment System",
        "snes": "Super Nintendo Entertainment System",
        "gba": "Game Boy Advance",
        "n64": "Nintendo 64",
        "nds": "Nintendo DS"
    };
    var gamezSortFunc = function(a, b) {
        if (a.lastUpdated) {
            return -1;
        } else if (b.lastUpdated) {
            return 1;
        };
        var asys = a.core;
        var bsys = b.core;
        if (asys == bsys) {
            return a.name.localeCompare(b.name);
        } else if (asys == 'nes') {
            return -1;
        } else if (bsys == 'nes') {
            return 1;
        } else if (asys == 'snes') {
            return -1;
        } else if (bsys == 'snes') {
            return 1;
        } else if (asys == 'gba') {
            return -1;
        } else if (bsys == 'gba') {
            return 1;
        } else if (asys == 'n64') {
            return -1;
        } else if (bsys == 'n64') {
            return 1;
        } else if (asys == 'nds') {
            return -1;
        } else if (bsys == 'nds') {
            return 1;
        };
        return 0;
    };
    games.sort(gamezSortFunc);
	var a = document.createElement('div');
    a.style = 'padding: 50px;';
    var header = document.createElement('h1');
    header.style = 'font-size: 45px;';
    header.innerHTML = 'Gamez';
    a.appendChild(header);
    var core = '';
	for (var i=1; i<games.length; i++) {
        if (games[i].core != core) {
            var core = games[i].core;
            a.appendChild(document.createElement('br'));
            a.appendChild(document.createElement('br'));
            var p = document.createElement('h2');
            p.innerHTML = namez[core];
            a.appendChild(p);
        };
		var input = document.createElement('input');
		input.type = 'radio';
		input.id = 'game-' + i;
		input.name = 'game';
		input.value = i;
		a.appendChild(input);
		var label = document.createElement('label');
		label.for = 'game-' + i;
		label.innerHTML = games[i].name;
		a.appendChild(label);
		a.appendChild(document.createElement('br'));
	};
	a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var p = document.createElement('p');
    p.innerHTML = 'Or select your own rom';
    a.appendChild(p);
    var input = document.createElement('input');
    input.onchange = function() {
        customRom(input.files[0]);
    };
    input.type = 'file';
    a.appendChild(input);
	a.appendChild(document.createElement('br'));
	a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    var style = document.createElement('style');
	var submit = document.createElement('input');
    submit.type = 'submit';
	submit.value = 'Load Game';
	submit.onclick = function(e) {
        var q = false;
		var radios = document.getElementsByName('game');
		for (var i=0; i<radios.length; i++) {
		    if (radios[i].checked) {
			    var q = games[radios[i].value];
			    break;
		    };
		};
        if (! q) {
            return;
        };
		while(document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		};
		var fileURL = server + '/' + q.filename;
		var core = q.core;
		var a = document.createElement('div');
		a.style = "width:640px;height:480px;max-width:100%";
		var b = document.createElement('div');
		b.id = 'game';
		a.appendChild(b);
		document.body.appendChild(a);
		var script = document.createElement('script');
		script.innerHTML = "EJS_player = '#game'; EJS_biosUrl = ''; EJS_gameUrl = '" + fileURL + "'; EJS_core = '" + core + "'; EJS_lightgun = false; EJS_pathtodata = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/'; ";
		document.body.appendChild(script);
		var script = document.createElement('script');
		script.src = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/main/data/loader.js';
		document.body.appendChild(script);
	};
	a.appendChild(submit);
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
    a.appendChild(document.createElement('br'));
	var b = document.createElement('p');
	b.innerHTML = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSc1AkX5LLOawyFlBBXIlbyfnRw055tuYnS3ycDxoLiKZCNSYw/viewform?usp=sf_link" target="_blank">Fill out this form to add another game!</a>';
	a.appendChild(b);
    var p = document.createElement('p');
    p.innerHTML = 'Game-Button: Version 2.2';
    a.appendChild(p);
	var b = document.createElement('p');
	b.innerHTML = 'Game Database Last Updated: ' + games[0].lastUpdated;
	a.appendChild(b);
	var b = document.createElement('p');
	b.innerHTML = 'Button Last Updated: September 21, 2021';
	a.appendChild(b);
	document.body.appendChild(a);
})();
