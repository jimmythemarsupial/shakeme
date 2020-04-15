chrome.runtime.onInstalled.addListener(function() {
	/*chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});*/
	
	
	/*function handleMessage(message) {
		try {
			message = JSON.parse(message);
		}
		catch(e)
		{
			return;
		}
		if (message.method == undefined || message.args == undefined)
		{
			return;
		}
		
		switch(message.method)
		{
			case "onNotify":
				var info = JSON.parse(message.args[0]);
				break;
			case "onRoomMsg":
				var user = message.args[0];
				var info = JSON.parse(message.args[1]);
				break;
			case "onTitleChange":
				var info = JSON.parse(message.args[0]);
				break;
		}
		chrome.extension.getBackgroundPage().console.log(message);
	}
	
	$.getJSON("https://chaturbate.com/api/chatvideocontext/canbebought/", function( info ) {
		//chrome.extension.getBackgroundPage().console.log(info);
		
		var mode = 0;
		var sock = new SockJS(info['wschat_host']);

		sock.onmessage = function(e) {
			//chrome.extension.getBackgroundPage().console.log('onrecv');
			if (mode == 0)
			{
				//chrome.extension.getBackgroundPage().console.log('join');
				sock.send(JSON.stringify({
					method: 'joinRoom',
					data: {
						room: info['broadcaster_username']
					}
				}));
				
				mode += 1;
			}
			handleMessage(e.data);
			//chrome.extension.getBackgroundPage().console.log('message', e.data);
			//sock.close();
		};

		sock.onclose = function() {
			chrome.extension.getBackgroundPage().console.log('close');
		};
		
		sock.onopen = function() {
			//chrome.extension.getBackgroundPage().console.log('open');
			sock.send(JSON.stringify({
				method: 'connect',
				data: {
					user: info['chat_username'],
					password: info['chat_password'],
					room: info['broadcaster_username'],
					room_password: info['room_pass']
				}
			}));
			//chrome.extension.getBackgroundPage().console.log('sent');
		};
	});*/
	
	function start() {
		var obs = new OBSWebSocket();
		var console = chrome.extension.getBackgroundPage().console;
		
		obs.on('ConnectionOpened', () => {
			chrome.extension.getBackgroundPage().console.log('OBS Connected');
			//console.log('OBS Connected');
		});
		
		obs.on('AuthenticationSuccess', () => {
			chrome.extension.getBackgroundPage().console.log('OBS Autenticated');
			//console.log('OBS Autenticated');
			
			obs.send('GetSourcesList').then(data => {
				chrome.extension.getBackgroundPage().console.log(data);
			});
			
			//obs.send('GetSourceFilters', { 'sourceName': 'Display Capture' }).then(data => {
			//	chrome.extension.getBackgroundPage().console.log(data);
			//});
		});
		
		obs.on('AuthenticationFailure', () => {
			chrome.extension.getBackgroundPage().console.log('OBS Not Autenticated');
			//console.log('OBS Not Autenticated');
		});
		
		obs.on('ConnectionClosed', () => {
			chrome.extension.getBackgroundPage().console.log('OBS Closed');
			//console.log('OBS Closed');
		});
		
		obs.on('error', (err) => {
			chrome.extension.getBackgroundPage().console.log(err);
			//console.log('error ' + err);
		});
		
		obs.connect({ address: 'localhost:4444', password: '$up3rSecretP@ssw0rd' }).catch(err => { // Promise convention dicates you have a catch on every chain.
			chrome.extension.getBackgroundPage().console.log(err);
			//console.log(err);
		});
	}
	
	//start();
	//logger.debug('test');
});