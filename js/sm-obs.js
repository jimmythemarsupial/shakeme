

/***************************************************************************************************
*
*
***************************************************************************************************/
class SMOBS {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.enabled = false;
		this.needs_auth = false;
		this.filters = [ ];
		this.queue = [ ];
		
		this.connecting = false;
		this.connected = false
		this.authenticated = false;
		this.timeout = null;
		
		
		comms.addHook('obs', this.onMessage);
		this.socket = new OBSWebSocket();
		
		var _this = this;
		this.socket.on('ConnectionOpened',      ()    => { _this.onConnect();     });
		this.socket.on('AuthenticationSuccess', ()    => { _this.onAuthSuccess(); });
		this.socket.on('AuthenticationFailure', ()    => { _this.onAuthFailure(); });
		this.socket.on('ConnectionClosed',      ()    => { _this.onDisconnect();  });
		this.socket.on('error',                 (err) => { _this.onError(err);    });
		
		settings.get('obs_enable', function(obs_enable) {
			if (obs_enable)
			{
				_this.enabled = true;
				_this.connect();
			}
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onMessage(msg, callback) {
		logger.log('OBS onMessage');
		if (msg.cmd == undefined)
		{
			return false;
		}
		switch (msg.cmd)
		{
			case 'getConnectionStatus':
				return obs.getConnectionStatus();
			case 'getSources':
				return obs.getSources(callback);
			case 'getFilters':
				return obs.getFilters(msg.source, callback);
			case 'connect':
				return obs.connect();
			case 'disconnect':
				return obs.disconnect();
			case 'runFilter':
				return obs.runFilter(msg.source, msg.filter, msg.filter_settings, msg.duration);
			case 'getQueue':
				return obs.getQueue();
			case 'clearQueue':
				return obs.clearQueue();
			default:
				logger.log('Unknown command ' + msg.cmd);
				return false;
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getQueue() {
		logger.log('getQueue');
		logger.log(this.queue);
		var info = { size: 0, time: 0 };
		for (var i = 0; i < this.queue.length; i++)
		{
			info.size++;
			info.time += parseInt(this.queue[i].duration);
			if (this.queue[i].started)
			{
				info.time -= Math.floor((Date.now() - this.queue[i].started) / 1000);
			}
		}
		return info;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	clearQueue() {
		if (this.queue.length)
		{
			this.disableFilter(this.queue[0]);
		}
		this.queue = [ ];
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	runFilter(source, filter, filter_settings, duration) {
		logger.log('Running filter');
		
		if (!source || !filter || !filter_settings || !duration || !filter_settings.samp || !filter_settings.mag || !filter_settings.speed || !filter_settings.samp.match(/^[0-9]+$/) || !filter_settings.mag.match(/^[0-9\.]+$/) || !filter_settings.speed.match(/^[0-9]+$/))
		{
			logger.log('Skipping, missing filter settings');
			logger.log([ !source, !filter, !filter_settings, !duration, !filter_settings.samp, !filter_settings.mag, !filter_settings.speed, !filter_settings.samp.match(/^[0-9]+$/), !filter_settings.mag.match(/^[0-9\.]+$/), !filter_settings.speed.match(/^[0-9]+$/) ]);
			return;
		}
		
		this.enableFilter({ source: source, filter: filter, samples: filter_settings.samp, magnitude: filter_settings.mag, speed_percent: filter_settings.speed, glitch: filter_settings.glitch, ease: filter_settings.ease, duration: duration });
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	enableFilter(info) {
		var _this = this;
		if (this.queue.length)
		{
			if (info == undefined)
			{
				info = this.queue[0];
			}
			else
			{
				this.queue.push(info);
				return;
			}
		}
		else
		{
			this.queue.push(info);
		}
		info.started = Date.now();
		logger.log('Enabling filter ' + this.queue.length);
		this.socket.send('GetSourceFilterInfo', { sourceName: info.source, filterName: info.filter }).then(function(response) {
			logger.log('GetSourceFilterInfo');
			var settings = response.settings;
			settings.samples = parseInt(info.samples);
			settings.magnitude = parseFloat(info.magnitude);
			settings.speed_percent = parseInt(info.speed_percent);
			settings.glitch = info.glitch ? true : false;
			settings.ease = info.ease ? true : false;
			_this.socket.send('SetSourceFilterSettings', { sourceName: info.source, filterName: info.filter, filterSettings: settings }).then(function(response) {
				logger.log('SetSourceFilterSettings');
				logger.log({ sourceName: info.source, filterName: info.filter, filterSettings: settings });
				logger.log(response);
				_this.timeout = setTimeout(function() { _this.disableFilter({ source: info.source, filter: info.filter }); }, info.duration * 1000);
			}).catch(function(err) {
				logger.log(err);
			});
		}).catch(function(err) {
			logger.log(err);
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	disableFilter(info) {
		logger.log('Disable filter');
		var _this = this;
		this.socket.send('GetSourceFilterInfo', { sourceName: info.source, filterName: info.filter }).then(function(response) {
			var settings = response.settings;
			settings.samples = 0;
			settings.magnitude = 0;
			settings.speed_percent = 0;
			settings.glitch = false;
			settings.ease = false;
			_this.socket.send('SetSourceFilterSettings', { sourceName: info.source, filterName: info.filter, filterSettings: settings }).then(function(response) {
				logger.log(response);
				_this.queue.shift();
				if (_this.queue.length)
				{
					_this.enableFilter();
				}
			}).catch(function(err) {
				logger.log(err);
			});
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getConnectionStatus() {
		var status = 0;
		if (obs.connected) status++;
		if (obs.authenticated) status++;
		logger.log(status);
		return status;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onConnect() {
		logger.log('OBS Connected');
		this.connecting = false;
		this.connected = true;
		if (!this.needs_auth)
		{
			this.authenticated = true;
			//this.getSources();
		}
		comms.send({ rcpt: 'ui', payload: { cmd: 'updateOBSStatus', status: this.getConnectionStatus() } });
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onDisconnect() {
		logger.log('OBS Disconnected');
		this.connected = false;
		this.authenticated = false;
		if (this.connecting) comms.send({ rcpt: 'ui', payload: { cmd: 'updateOBSStatus', status: -1 } });
		this.connecting = false;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onAuthSuccess() {
		logger.log('OBS Authenticated');
		this.authenticated = true;
		//this.getSources();
		comms.send({ rcpt: 'ui', payload: { cmd: 'updateOBSStatus', status: this.getConnectionStatus() } });
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onAuthFailure() {
		logger.log('OBS Authentication Failed');
		this.authenticated = false;
		comms.send({ rcpt: 'ui', payload: { cmd: 'updateOBSStatus', status: -2 } });
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onError(err) {
		logger.log(err);
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getSources(callback) {
		logger.log("Getting OBS source list");
		var _this = this;
		this.socket.send('GetSourcesList').then(data => {
			logger.log(data);
			if (data.status != 'ok')
			{
				logger.log("Invalid OBS response status: " + data.status);
				return;
			}
			logger.log(data.sources);
			var sources = [ ];
			for (var i = 0; i < data.sources.length; i++)
			{
				sources.push(data.sources[i].name);
			}
			if (callback) callback(sources);
		}).catch(function(err) {
			logger.log(err);
			return callback(false);
		});
		return true;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getFilters(source, callback) {
		logger.log("Getting OBS filter list");
		var _this = this;
		this.socket.send('GetSourceFilters', { sourceName: source }).then(data => {
			logger.log(data);
			var filters = [ ];
			for (var i = 0; i < data.filters.length; i++)
			{
				if (data.filters[i].enabled) filters.push(data.filters[i].name);
			}
			if (callback) callback(filters);
		}).catch(function(err) {
			logger.log(err);
			return callback(false);
		});
		return true;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	connect(callback) {
		var _this = this;
		settings.get([ 'obs_ip_address', 'obs_port', 'obs_password' ], function(data) {
			if (!data.obs_ip_address || !data.obs_port)
			{
				if (callback) callback(false);
			}
			var conninfo = { address: data.obs_ip_address + ':' + data.obs_port };
			if (data.obs_password)
			{
				conninfo['password'] = data.obs_password;
				_this.needs_auth = true;
			}
			logger.log('Connecting to OBS on ' + conninfo.address);
			_this.connecting = true;
			_this.socket.connect(conninfo).catch(err => {
				logger.log(err);
			});
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	disconnect() {
		this.socket.disconnect();
	}
	
	
}


/***************************************************************************************************
*
*
***************************************************************************************************/
var obs = new SMOBS();

