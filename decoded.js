(async function() {
    fetch('https://raw.githack.com/ethanaobrien/emulator-button/main/version.json').then(response => {
        if (response.ok) {
            response.text().then(body => {
                var usingVersion = '1.8';
                var version = JSON.parse(body);
                if (usingVersion < version.current_version) {
                    alert('You have version ' + usingVersion + ' but the newest version is ' + version.current_version);
                    if (confirm('Do you want to update? (Github Pages will open)')) {
                        window.open('https://raw.githack.com/ethanaobrien/emulator-button/main/index.html');
                    };
                };
            });
        };
    });
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
            var p = document.createElement('p');
            p.innerHTML = 'All game servers are down, but you san still upload a rom!';
            document.body.appendChild(p);
            var p = document.createElement('p');
            p.innerHTML = 'Please use this feature on a site you don\'t normally use this bookmark on. This feature will delete all cached roms (and will have to re-use those rom\'s through my limited bandwith)';
            document.body.appendChild(p);
            var input = document.createElement('input');
            input.onchange = function() {
                while(document.body.firstChild) {
                    document.body.removeChild(document.body.firstChild);
                };
                var extension = input.files[0].name.split('.').pop();
                if (['fds', 'nes', 'unif', 'unf'].includes(extension)) {
                    var core = 'nes';
                } else if (['z64'].includes(extension) {
                    var core = 'n64';
                } else if (['smc', 'fig', 'sfc', 'gd3', 'gd7', 'dx2', 'bsx', 'swc'].includes(extension) {
                    var core = 'snes';
                } else {
                    var core = prompt('Input core (examples: nes, snes, n64, gb, gba)');
                };
                var fileURL = URL.createObjectURL(new Blob([input.files[0]]));
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
            input.type = 'file';
            document.body.appendChild(input);
        };
	};
	while(document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	};
	var a = document.createElement('div');
	var b = document.createElement('p');
	b.innerHTML = 'Contact me to add another game!';
	a.appendChild(b);
    var p = document.createElement('p');
    p.innerHTML = 'Please try to always use the same website with this bookmark!! It saves my (limited) bandwith that I use to store the roms';
	a.appendChild(document.createElement('br'));
    a.appendChild(p);
	var b = document.createElement('p');
	b.innerHTML = 'Last Updated: ' + games[0].lastUpdated;
	a.appendChild(b);
	for (var i=1; i<games.length; i++) {
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
    var p = document.createElement('p');
    p.innerHTML = 'Or select your own rom';
    a.appendChild(p);
    var p = document.createElement('p');
    p.innerHTML = 'Please use this feature on a site you don\'t normally use this bookmark on. This feature will delete all cached roms (and will have to re-use those rom\'s through my limited bandwith)';
    a.appendChild(p);
    var input = document.createElement('input');
    input.onchange = function() {
		while(document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		};
        var extension = input.files[0].name.split('.').pop();
        if (['fds', 'nes', 'unif', 'unf'].includes(extension)) {
            var core = 'nes';
        } else if (['z64'].includes(extension) {
            var core = 'n64';
        } else if (['smc', 'fig', 'sfc', 'gd3', 'gd7', 'dx2', 'bsx', 'swc'].includes(extension) {
            var core = 'snes';
        } else {
            var core = prompt('Input core (examples: nes, snes, n64, gb, gba)');
        };
		var fileURL = URL.createObjectURL(new Blob([input.files[0]]));
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
    input.type = 'file';
    a.appendChild(input);
	a.appendChild(document.createElement('br'));
	var submit = document.createElement('input');
	a.appendChild(document.createElement('br'));
	submit.type = 'submit';
	submit.value = 'Load Game';
	submit.onclick = function(e) {
		var radios = document.getElementsByName('game');
		for (var i = 0, length = radios.length; i < length; i++) {
		  if (radios[i].checked) {
			var q = games[radios[i].value];
			break;
		  };
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
	document.body.appendChild(a);
})();
