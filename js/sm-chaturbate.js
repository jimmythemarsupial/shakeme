

/***************************************************************************************************
*
*
***************************************************************************************************/
class SMChaturbate {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.socket = null;
		this.state = 0;
		this.enabled = true;
		comms.addHook('cb', this.onMessage);
		
		var _this = this;
		settings.get('cb_enable', function(cb_enable) {
			if (cb_enable)
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
				return cb.getConnectionStatus();
			case 'connect':
				return cb.connect();
			case 'disconnect':
				return cb.disconnect();
			default:
				logger.log('Unknown command ' + msg.cmd);
				return false;
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	connect() {
		logger.log('CB connect');
		var _this = this;
		settings.get(['cb_username'], function(data) {
			$.getJSON('https://chaturbate.com/api/chatvideocontext/' + data.cb_username, function(ajax_response) {
				logger.log('Connecting to WS ' + ajax_response.wschat_host);
				if (!ajax_response.wschat_host)
				{
					_this.state = -1;
					comms.send({ rcpt: 'ui', payload: { cmd: 'updateCBStatus', status: cb.getConnectionStatus() } });
					return;
				}
				_this.connection_data = ajax_response;
				_this.socket = new SockJS(ajax_response.wschat_host);
				_this.socket.onopen = _this.onOpen;
				_this.socket.onmessage = _this.handleMessage;
				_this.socket.onclose = _this.onClose;
			}).fail(function() {
				_this.state = -1;
				comms.send({ rcpt: 'ui', payload: { cmd: 'updateCBStatus', status: cb.getConnectionStatus() } });
			})
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	disconnect() {
		if (this.socket) this.socket.close();
		this.socket = null;
		comms.send({ rcpt: 'ui', payload: { cmd: 'updateCBStatus', status: cb.getConnectionStatus() } });
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	handleMessage(msg) {
		if (cb.state == 1)
		{
			logger.log('CB WS join');
			cb.socket.send(JSON.stringify({
				method: 'joinRoom',
				data: {
					room: cb.connection_data.broadcaster_username
				}
			}));
			cb.state++;
			comms.send({ rcpt: 'ui', payload: { cmd: 'updateCBStatus', status: cb.getConnectionStatus() } });
		}
		else
		{
			msg = JSON.parse(msg.data);
			//logger.log(msg);
			switch (msg.method)
			{
				case 'onRoomMsg':
					break;
				case 'onTitleChange':
					break;
				case 'onNotify':
					cb.handleOnNotify(msg);
					break;
			}
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onClose() {
		cb.state = 0;
		cb.socket = null;
		comms.send({ rcpt: 'ui', payload: { cmd: 'updateCBStatus', status: cb.getConnectionStatus() } });
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onOpen() {
		logger.log('CB WS connect');
		cb.socket.send(JSON.stringify({
			method: 'connect',
			data: {
				user: cb.connection_data.chat_username,
				password: cb.connection_data.chat_password,
				room: cb.connection_data.broadcaster_username,
				room_password: cb.connection_data.room_pass
			}
		}));
		cb.state = 1;
		comms.send({ rcpt: 'ui', payload: { cmd: 'updateCBStatus', status: cb.getConnectionStatus() } });
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	handleOnNotify(msg) {
		msg = JSON.parse(msg.args[0]);
		logger.log(msg);
		if (msg.type == 'tip_alert')
		{
			var amount = msg.amount;
			settings.get([ 'obs_source', 'obs_filter', 'filter_list', 'tip_range_list' ], function(data) {
				if (!data.obs_source || !data.obs_filter || !data.filter_list || !data.tip_range_list) return;
				
				var source = data.obs_source;
				var filter = data.obs_filter;
				
				var duration = 0;
				for (var i = 0; i < data.tip_range_list.length; i++)
				{
					if (amount < data.tip_range_list[i].min || amount > data.tip_range_list[i].max) continue;
					duration = data.tip_range_list[i].duration;
					for (var j = 0; j < data.filter_list.length; j++)
					{
						if (data.filter_list[j].id == data.tip_range_list[i].filter)
						{
							var filter_settings = data.filter_list[j];
							return obs.runFilter(data.obs_source, data.obs_filter, filter_settings, duration);
						}
					}
				}
			});
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getConnectionStatus() {
		return this.state;
	}
	
	
}


var cb = new SMChaturbate();

