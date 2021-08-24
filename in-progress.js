(async function() {
	try {
		var URL = 'https://unruffled-bhaskara-7b045c.netlify.app/info.json';
		var b = await fetch(URL);
		var games = await b.text();
		var games = JSON.parse(games);
		var server = URL
	} catch(e) { /** TODO - Add more servers **/
		alert('All game servers seem to be down - Contact me! (First, try using a different site, google.com works!)');
		return;
	};
	while(document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	};
	var a = document.createElement('div');
	var b = document.createElement('p');
	b.innerHTML = 'Contact me to add another game!';
	a.appendChild(b);
	for (var i=0; i<games.length; i++) {
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
	}
	a.appendChild(document.createElement('br'));
	var submit = document.createElement('input');
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
		var commit = 'dec7d949b6dbf7140a9d7897b2acbe132b251b00';
		var a = document.createElement('div');
		a.style = "width:640px;height:480px;max-width:100%";
		var b = document.createElement('div');
		b.id = 'game';
		a.appendChild(b);
		document.body.appendChild(a);
		var script = document.createElement('script');
		script.innerHTML = "EJS_player = '#game'; EJS_biosUrl = ''; EJS_gameUrl = '" + fileURL + "'; EJS_core = '" + core + "'; EJS_lightgun = false; EJS_pathtodata = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/" + commit + "/data/'; ";
		document.body.appendChild(script);
		var script = document.createElement('script');
		script.src = 'https://rawcdn.githack.com/ethanaobrien/emulatorjs/' + commit + '/data/loader.js';
		document.body.appendChild(script);
	};
	a.appendChild(submit);
	document.body.appendChild(a);
})();