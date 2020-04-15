

/***************************************************************************************************
*
*
***************************************************************************************************/
class SMComms {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		chrome.runtime.onMessage.addListener(this.recv);
		this.hooks = { };
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	addHook(name, hook) {
		this.hooks[name] = hook;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	send(msg, callback) {
		logger.log('Send message from popup to background');
		chrome.runtime.sendMessage(msg, function(response) {
			if(chrome.runtime.lastError) {
				return logger.log(chrome.runtime.lastError.message);
			}
			if (callback) callback(response);
		});
		if(chrome.runtime.lastError) {
			return logger.log(chrome.runtime.lastError.message);
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	recv(request, sender, sendResponse) {
		logger.log(request);
		if (request.rcpt == undefined)
		{
			logger.log('Missing rcpt in message');
			if (sendResponse) return sendResponse(false);
		}
		if (comms.hooks[request.rcpt] == undefined)
		{
			logger.log('Unknown rcpt in message');
			if (sendResponse) return sendResponse(false);
		}
		var response = comms.hooks[request.rcpt](request.payload, sendResponse);
		if (response === true) return true;
		if (sendResponse) return sendResponse(response);
	}
	
	
}


/***************************************************************************************************
*
*
***************************************************************************************************/
var comms = new SMComms();

