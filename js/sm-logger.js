

class SMLogger {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.enabled = false;
		comms.addHook('log', this.onMessage);
		
		var _this = this;
		settings.get('log_enable', function(log_enable) {
			if (log_enable)
			{
				_this.enable();
			}
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	enable() {
		this.enabled = true;
		this.log('Enabled debug logging');
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	disable() {
		this.log('Disabling debug logging');
		this.enabled = false;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	log(text) {
		if (this.enabled)
		{
			chrome.extension.getBackgroundPage().console.log(text);
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onMessage(msg, callback) {
		logger.log('Log onMessage');
		if (msg.cmd == undefined)
		{
			return false;
		}
		switch (msg.cmd)
		{
			case 'enable':
				return logger.enable();
			case 'disable':
				return logger.disable();
			default:
				logger.log('Unknown command ' + msg.cmd);
				return false;
		}
	}
	
	
}

var logger = new SMLogger();

