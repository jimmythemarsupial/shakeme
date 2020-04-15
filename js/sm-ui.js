


/***************************************************************************************************
*
*
***************************************************************************************************/
class SMUIChaturbate {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.setupEnable();
		this.setupUsername();
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupEnable() {
		var _this = this;
		settings.get('cb_enable', function(cb_enable) {
			if (cb_enable)
			{
				logger.log('Setting Chaturbate to enabled');
				$('#cb_enable').prop('checked', true);
				$('#cb_username').prop('disabled', true);
			}
			else
			{
				$('#cb_username').prop('disabled', false);
			}
		});
		$('#cb_enable').change(function() {
			if (this.checked)
			{
				$('#cb_username').prop('disabled', true);
				comms.send({ rcpt: 'cb', payload: { 'cmd': 'connect' } });
			}
			else
			{
				$('#cb_username').prop('disabled', false);
				comms.send({ rcpt: 'cb', payload: { 'cmd': 'disconnect' } });
			}
			settings.set('cb_enable', this.checked);
		});
		comms.send({ rcpt: 'cb', payload: { cmd: 'getConnectionStatus' } }, function(status) {
			_this.updateCBStatus(status);
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupUsername() {
		var _this = this;
		settings.get('cb_username', function(cb_username) {
			if (cb_username)
			{
				$('#cb_username').val(cb_username);
				M.updateTextFields();
			}
		});
		$('#cb_username').focusout(function() {
			settings.set('cb_username', this.value);
		});
		$('#cb_username').on('keypress',function(e) {
			if(e.which == 13) settings.set('cb_username', this.value);
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	updateCBStatus(status) {
		var _this = this;
		this.status = status;
		logger.log('updateCBStatus1');
		if (status > 0)
		{
			logger.log('updateCBStatus2');
			$('#cb_status').html('<img src="icons/cb-yellow.png" />');
			$('#cb_enable').prop("checked", true);
			$('#cb_username').prop('disabled', true);
			if (status == 2)
			{
				logger.log('updateCBStatus3');
				$('#cb_status').html('<img src="icons/cb-green.png" />');
			}
		}
		else if(status < 0)
		{
			$('#cb_status').html('<img src="icons/cb-red.png" />');
			settings.set('cb_enable', false);
			$('#cb_enable').prop("checked", false);
			$('#cb_username').prop('disabled', false);
		}
		else
		{
			$('#cb_status').html('<img src="icons/cb-grey.png" />');
			settings.set('cb_enable', false);
			$('#cb_enable').prop("checked", false);
			$('#cb_username').prop('disabled', false);
		}
		return false;
	}
	
	
}


/***************************************************************************************************
*
*
***************************************************************************************************/
class SMUIOBS {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.setupEnable();
		this.setupIPAddress();
		this.setupPort();
		this.setupPassword();
		this.setupSource();
		this.setupFilter();
		
		this.status = 0;
		this.source = null;
		this.filter = null;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupEnable() {
		var _this = this;
		settings.get('obs_enable', function(obs_enable) {
			if (obs_enable)
			{
				logger.log('Setting OBS to enabled');
				$('#obs_enable').prop('checked', true);
				$('#obs_ip_address').prop('disabled', true);
				$('#obs_port').prop('disabled', true);
				$('#obs_password').prop('disabled', true);
			}
			else
			{
				$('#obs_ip_address').prop('disabled', false);
				$('#obs_port').prop('disabled', false);
				$('#obs_password').prop('disabled', false);
			}
		});
		$('#obs_enable').change(function() {
			if (this.checked)
			{
				$('#obs_ip_address').prop('disabled', true);
				$('#obs_port').prop('disabled', true);
				$('#obs_password').prop('disabled', true);
				comms.send({ rcpt: 'obs', payload: { 'cmd': 'connect' } });
			}
			else
			{
				$('#obs_ip_address').prop('disabled', false);
				$('#obs_port').prop('disabled', false);
				$('#obs_password').prop('disabled', false);
				comms.send({ rcpt: 'obs', payload: { 'cmd': 'disconnect' } });
				$('#obs_status').html('<img src="icons/obs-grey.png" />');
			}
			settings.set('obs_enable', this.checked);
			_this.updateOBSStatus(0);
		});
		comms.send({ rcpt: 'obs', payload: { cmd: 'getConnectionStatus' } }, function(status) {
			_this.updateOBSStatus(status);
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupIPAddress() {
		var _this = this;
		settings.get('obs_ip_address', function(obs_ip_address) {
			if (obs_ip_address)
			{
				$('#obs_ip_address').val(obs_ip_address);
			}
			M.updateTextFields();
		});
		$('#obs_ip_address').focusout(function() {
			settings.set('obs_ip_address', this.value);
		});
		$('#obs_ip_address').on('keypress',function(e) {
			if(e.which == 13) settings.set('obs_ip_address', this.value);
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupPort() {
		var _this = this;
		settings.get('obs_port', function(obs_port) {
			if (obs_port)
			{
				$('#obs_port').val(obs_port);
			}
			M.updateTextFields();
		});
		$('#obs_port').focusout(function() {
			settings.set('obs_port', this.value);
		});
		$('#obs_port').on('keypress',function(e) {
			if(e.which == 13) settings.set('obs_port', this.value);
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupPassword() {
		var _this = this;
		settings.get('obs_password', function(obs_password) {
			if (obs_password)
			{
				$('#obs_password').val(obs_password);
				M.updateTextFields();
			}
		});
		$('#obs_password').focusout(function() {
			settings.set('obs_password', this.value);
		});
		$('#obs_password').on('keypress',function(e) {
			if(e.which == 13) settings.set('obs_password', this.value);
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupSource() {
		var _this = this;
		$('#obs_source').on('change',function(e) {
			settings.set('obs_source', $(this).children("option:selected").val());
			_this.source = $(this).children("option:selected").val();
			_this.updateFilters();
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupFilter() {
		var _this = this;
		$('#obs_filter').on('change',function(e) {
			settings.set('obs_filter', $(this).children("option:selected").val());
			_this.filter = $(this).children("option:selected").val();
			if (_this.status == 2) $('#obs_status').html('<img src="icons/obs-green.png" />');
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	updateSources(sources) {
		var _this = this;
		logger.log('Getting source list');
		settings.get('obs_source', function(obs_source) {
			var source_list = [ ];
			_this.source = false;
			for (var i = 0; i < sources.length; i++)
			{
				var source = $('<option>' + sources[i] + '</option>');
				if (obs_source && obs_source == sources[i])
				{
					source.prop('selected', true);
					_this.source = sources[i];
					$('#obs_status').html('<img src="icons/obs-green.png" />');
				}
				source_list.push(source);
			}
			$('#obs_source').html('');
			$('#obs_source').append($('<option value="" disabled' + (_this.source ? '' : ' selected') + '>Source</option>'));
			for (var i = 0; i < source_list.length; i++)
			{
				$('#obs_source').append(source_list[i]);
			}
			$('#obs_source').formSelect();
			if (_this.source) _this.updateFilters();
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	updateFilters() {
		var _this = this;
		logger.log('Getting filter list');
		settings.get('obs_filter', function(obs_filter) {
			comms.send({ rcpt: 'obs', payload: { 'cmd': 'getFilters', source: _this.source } }, function(filters) {
				logger.log('updateFilters');
				logger.log(filter_list);
				var filter_list = [ ];
				_this.filter = false;
				for (var i = 0; i < filters.length; i++)
				{
					var filter = $('<option>' + filters[i] + '</option>');
					if (obs_filter && obs_filter == filters[i])
					{
						filter.prop('selected', true);
						_this.filter = filters[i];
						$('#obs_status').html('<img src="icons/obs-green.png" />');
					}
					filter_list.push(filter);
				}
				$('#obs_filter').html('');
				$('#obs_filter').append($('<option value="" disabled' + (_this.filter ? '' : ' selected') + '>Filter</option>'));
				for (var i = 0; i < filter_list.length; i++)
				{
					$('#obs_filter').append(filter_list[i]);
				}
				$('#obs_filter').formSelect();
			});
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	updateOBSStatus(status) {
		var _this = this;
		this.status = status;
		logger.log('updateOBSStatus1');
		if (status > 0)
		{
			logger.log('updateOBSStatus2');
			$('#obs_status').html('<img src="icons/obs-yellow.png" />');
			if (status == 2)
			{
				logger.log('updateOBSStatus3');
				comms.send({ rcpt: 'obs', payload: { 'cmd': 'getSources' } }, function(source_list) {
					logger.log('updateOBSStatus4');
					logger.log(source_list);
					_this.updateSources(source_list);
					ui.filters.updateFilterList();
					ui.tipranges.updateTipRangeList();
				});
			}
			else
			{
				ui.filters.updateFilterList();
				ui.tipranges.updateTipRangeList();
			}
		}
		else if(status < 0)
		{
			$('#obs_status').html('<img src="icons/obs-red.png" />');
			settings.set('obs_enable', false);
			$('#obs_enable').prop("checked", false);
			$('#obs_ip_address').prop('disabled', false);
			$('#obs_port').prop('disabled', false);
			$('#obs_password').prop('disabled', false);
		}
		else
		{
			ui.filters.updateFilterList();
			ui.tipranges.updateTipRangeList();
		}
		return false;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getConnectionStatus() {
		return this.status
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getSource() {
		return this.source;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getFilter() {
		return this.filter;
	}
	
	
}


/***************************************************************************************************
*
*
***************************************************************************************************/
class SMUIFilters {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.filter_list = [ ];
		this.setupFilters();
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupFilters() {
		var _this = this;
		settings.get('filter_list', function(filter_list) {
			logger.log(filter_list);
			if (filter_list) _this.filter_list = filter_list;
			$.each(filter_list, function(i, data) {
				logger.log(data);
				_this.addFilter(data);
			});
			if (_this.filter_list.length == 0)
			{
				_this.addFilter();
			}
		});
		$('#add_filter').click(function() {
			_this.addFilter();
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	addFilter(data) {
		var _this = this;
		var update = false;
		var id;
		if (!data || !data.id)
		{
			update = true;
			id = uuidv4().replace(/-/g, '');
		}
		else
		{
			id = data.id;
		}
		var row = $('<div class="row" id="'+id+'"></div>');
		row.append(
			$('<div class="input-field col s3">').append(
				$('<input id="filter_name_'+id+'" rowid="'+id+'" type="text" class="validate"'+(data && data.name ? ' value="'+data.name+'"' : '')+'>')
					.on('change', function() { _this.updateFilterList(); })
					.on('keypress', function(e) { if(e.which == 13) _this.updateFilterList(); })
			).append(
				$('<label for="filter_name_'+id+'">Name</label>')
			)
		);
		row.append(
			$('<div class="input-field col s2">').append(
				$('<input id="filter_samp_'+id+'" rowid="'+id+'" type="text" class="validate"'+(data && data.samp ? ' value="'+data.samp+'"' : '')+'>')
					.on('change', function() { _this.updateFilterList(); })
					.on('keypress', function(e) { if(e.which == 13) _this.updateFilterList(); })
			).append(
				$('<label for="filter_samp_'+id+'">Samples</label>')
			)
		);
		row.append(
			$('<div class="input-field col s2">').append(
				$('<input id="filter_mag_'+id+'" rowid="'+id+'" type="text" class="validate"'+(data && data.mag ? ' value="'+data.mag+'"' : '')+'>')
					.on('change', function() { _this.updateFilterList(); })
					.on('keypress', function(e) { if(e.which == 13) _this.updateFilterList(); })
			).append(
				$('<label for="filter_mag_'+id+'">Magnitude</label>')
			)
		);
		row.append(
			$('<div class="input-field col s2">').append(
				$('<input id="filter_speed_'+id+'" rowid="'+id+'" type="text" class="validate"'+(data && data.speed ? ' value="'+data.speed+'"' : '')+'>')
					.on('change', function() { _this.updateFilterList(); })
					.on('keypress', function(e) { if(e.which == 13) _this.updateFilterList(); })
			).append(
				$('<label for="filter_speed_'+id+'">Speed</label>')
			)
		);
		row.append(
			$('<div class="input-field col s2">').append(
				$('<div class="row"></div>').append(
					$('<label></label>').append(
						$('<input type="checkbox" rowid="'+id+'" id="ease_'+id+'" '+(data && data.ease ? 'checked ' : '')+'/>')
							.change(function() { _this.updateFilterList(); })
					).append(
						$('<span>Ease</span>')
					)
				)
			).append(
				$('<div class="row"></div>').append(
					$('<label></label>').append(
						$('<input type="checkbox" rowid="'+id+'" id="glitch_'+id+'" '+(data && data.glitch ? 'checked ' : '')+'/>')
							.change(function() { _this.updateFilterList(); })
					).append(
						$('<span>Glitch</span>')
					)
				)
			)
		);
		row.append(
			$('<div class="input-field col s1">').append(
				$('<div style="margin-bottom: 9px;"><a class="btn-small btn-tiny" title="Delete" rowid="'+id+'"><i class="material-icons">delete</i></a></div>')
					.on('click', function() { _this.deleteFilter($(this).children("a").attr('rowid')); })
			).append(
				$('<div><a class="btn-small btn-tiny" title="Test" rowid="'+id+'" id="filter_test_'+id+'"'+((ui.obs.getConnectionStatus() == 2 && data && data.name && data.samp && data.mag && data.speed && data.name.match(/[a-zA-Z]/) && data.samp.match(/^[0-9]+$/) && data.mag.match(/^[0-9\.]+$/) && data.speed.match(/^[0-9]+$/)) ? '' : ' disabled')+'><i class="material-icons">check_circle</i></a></div>')
					.on('click', function() { _this.testFilter($(this).children("a").attr('rowid')); })
			)
		);
		$('#filters').append(row);
		if (update) this.updateFilterList();
		M.updateTextFields();
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	deleteFilter(id) {
		logger.log(id);
		$('#filters').parent().find('#'+id).remove();
		this.updateFilterList();
		if (this.filter_list.length == 0)
		{
			this.addFilter();
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	updateFilterList() {
		logger.log('updateFilterList');
		var filters = [ ];
		$('#filters').children('div.row').each(function(i) {
			var id = $(this).attr('id');
			var filter = {
				id: id,
				name: $('#filter_name_'+id).val(),
				samp: $('#filter_samp_'+id).val(),
				mag: $('#filter_mag_'+id).val(),
				speed: $('#filter_speed_'+id).val(),
				ease: $('#ease_'+id).is(":checked"),
				glitch: $('#glitch_'+id).is(":checked")
			};
			if (ui.obs.getConnectionStatus() == 2 && filter.name.match(/[a-zA-Z]/) && filter.samp.match(/^[0-9]+$/) && filter.mag.match(/^[0-9\.]+$/) && filter.speed.match(/^[0-9]+$/))
			{
				logger.log('Enable test #filter_test_'+id);
				$('#filter_test_'+id).removeAttr("disabled");
			}
			else
			{
				logger.log('Disable test #filter_test_'+id);
				$('#filter_test_'+id).attr('disabled', true);
			}
			filters.push(filter);
		});
		logger.log(filters);
		this.filter_list = filters;
		settings.set('filter_list', filters);
		ui.tipranges.updateFilters(filters);
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	getFilterList() {
		return this.filter_list;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	testFilter(id) {
		settings.get([ 'obs_source', 'obs_filter', 'filter_list' ], function(data) {
			var source = data.obs_source;
			var filter = data.obs_filter;
			var filter_settings;
			for (var i = 0; i < data.filter_list.length; i++)
			{
				if (data.filter_list[i].id == id) filter_settings = data.filter_list[i];
			}
			comms.send({ rcpt: 'obs', payload: { 'cmd': 'runFilter', source: source, filter: filter, filter_settings: filter_settings, duration: 10 } });
		});
	}
	
	
}


/***************************************************************************************************
*
*
***************************************************************************************************/
class SMUITipRanges {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.tip_range_list = [ ];
		this.setupTipRanges();
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupTipRanges() {
		var _this = this;
		settings.get('tip_range_list', function(tip_range_list) {
			logger.log('SETUP TIP RANGES');
			logger.log(tip_range_list);
			if (tip_range_list) _this.tip_range_list = tip_range_list;
			$.each(tip_range_list, function(i, data) {
				logger.log(data);
				_this.addTipRange(data);
			});
			if (_this.tip_range_list.length == 0)
			{
				_this.addTipRange();
			}
		});
		$('#add_tip_range').click(function() {
			_this.addTipRange();
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	addTipRange(data) {
		var _this = this;
		var update = false;
		var id;
		if (!data || !data.id)
		{
			update = true;
			id = uuidv4().replace(/-/g, '');
		}
		else
		{
			id = data.id;
		}
		logger.log('ADD TIP RANGE');
		logger.log(data);
		var row = $('<div class="row" id="'+id+'"></div>');
		row.append(
			$('<div class="input-field col s3">').append(
				$('<input id="tip_range_min_'+id+'" rowid="'+id+'" type="text" class="validate"'+(data && data.min ? ' value="'+data.min+'"' : '')+'>')
					.on('change', function() { _this.updateTipRangeList(); })
					.on('keypress', function(e) { if(e.which == 13) _this.updateTipRangeList(); })
			).append(
				$('<label for="tip_range_min_'+id+'">Minimum</label>')
			)
		);
		row.append(
			$('<div class="input-field col s3">').append(
				$('<input id="tip_range_max_'+id+'" rowid="'+id+'" type="text" class="validate"'+(data && data.max ? ' value="'+data.max+'"' : '')+'>')
					.on('change', function() { _this.updateTipRangeList(); })
					.on('keypress', function(e) { if(e.which == 13) _this.updateTipRangeList(); })
			).append(
				$('<label for="tip_range_max_'+id+'">Maximum</label>')
			)
		);
		
		var select = $('<select id="tip_range_filter_'+id+'"></select>').on('change',function(e) {
			_this.updateTipRangeList();
		});
		var filter_found = this.buildFilters(id, select, data);
		row.append(
			$('<div class="input-field col s3">').append(select)
		);
		row.append(
			$('<div class="input-field col s2">').append(
				$('<input id="tip_range_duration_'+id+'" rowid="'+id+'" type="text" class="validate"'+(data && data.duration ? ' value="'+data.duration+'"' : '')+'>')
					.on('change', function() { _this.updateTipRangeList(); })
					.on('keypress', function(e) { if(e.which == 13) _this.updateTipRangeList(); })
			).append(
				$('<label for="tip_range_duration_'+id+'">Duration</label>')
			)
		);
		row.append(
			$('<div class="input-field col s1">').append(
				$('<div style="margin-bottom: 9px;"><a class="btn-small btn-tiny" title="Delete" rowid="'+id+'"><i class="material-icons">delete</i></a></div>')
					.on('click', function() { _this.deleteTipRange($(this).children("a").attr('rowid')); })
			).append(
				$('<div><a class="btn-small btn-tiny" title="Test" rowid="'+id+'" id="tip_range_test_'+id+'"'+((data && data.min && data.max && filter_found && data.duration && data.min.match(/^[0-9]+$/) && data.max.match(/^[0-9]+$/) && data.duration.match(/^[0-9]+$/)) ? '' : ' disabled')+'><i class="material-icons">check_circle</i></a></div>')
					.on('click', function() { _this.testFilter($(this).children("a").attr('rowid')); })
			)
		);
		$('#tip_ranges').append(row);
		if (update) this.updateTipRangeList();
		M.updateTextFields();
		$('#tip_range_filter_'+id).formSelect();
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	buildFilters(id, select, data) {
		var filters = ui.filters.getFilterList();
		logger.log("FILTERS");
		logger.log(filters);
		logger.log(data);
		var filter_list = [ ];
		var filter_found = false;
		for (var i = 0; i < filters.length; i++)
		{
			if (filters[i].name.match(/[a-zA-Z]/) && filters[i].samp.match(/^[0-9]+$/) && filters[i].mag.match(/^[0-9\.]+$/) && filters[i].speed.match(/^[0-9]+$/))
			{
				var filter = $('<option value="'+filters[i].id+'">' + filters[i].name + '</option>');
				if (data && data.filter && data.filter == filters[i].id)
				{
					filter.prop('selected', true);
					filter_found = true;
				}
				filter_list.push(filter);
			}
		}
		select.html('');
		select.append($('<option value="" disabled' + (!filter_found ? ' selected' : '') + '>Filter</option>'));
		for (var i = 0; i < filter_list.length; i++) select.append(filter_list[i]);
		return filter_found;
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	updateFilters(filters) {
		logger.log('updateFilters');
		var _this = this;
		$('#tip_ranges').children('div.row').each(function(i) {
			var id = $(this).attr('id');
			var filter_found = _this.buildFilters(id, $('#tip_range_filter_'+id), { filter: $('#tip_range_filter_'+id).children("option:selected").val() });
			if (filter_found)
			{
				$('#tip_range_test_'+id).removeAttr("disabled");
			}
			else
			{
				$('#tip_range_test_'+id).prop('disabled', true);
			}
			$('#tip_range_filter_'+id).formSelect();
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	deleteTipRange(id) {
		logger.log(id);
		$('#tip_ranges').parent().find('#'+id).remove();
		this.updateTipRangeList();
		if (this.tip_range_list.length == 0)
		{
			this.addTipRange();
		}
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	updateTipRangeList() {
		logger.log('updateTipRangeList');
		var tip_ranges = [ ];
		$('#tip_ranges').children('div.row').each(function(i) {
			var id = $(this).attr('id');
			var tip_range = {
				id: id,
				min: $('#tip_range_min_'+id).val(),
				max: $('#tip_range_max_'+id).val(),
				filter: $('#tip_range_filter_'+id).children("option:selected").val(),
				duration: $('#tip_range_duration_'+id).val()
			};
			logger.log(tip_range);
			if (ui.obs.getConnectionStatus() == 2 && tip_range.min.match(/^[0-9]+$/) && tip_range.max.match(/^[0-9]+$/) && tip_range.filter && tip_range.duration.match(/^[0-9]+$/))
			{
				logger.log('Enable test');
				$('#tip_range_test_'+id).removeAttr("disabled");
			}
			else
			{
				logger.log('Disable test tip_range_test_'+id);
				$('#tip_range_test_'+id).attr('disabled', true);
			}
			tip_ranges.push(tip_range);
		});
		logger.log('SAVE TIP RANGES');
		logger.log(tip_ranges);
		this.tip_range_list = tip_ranges;
		settings.set('tip_range_list', tip_ranges);
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	testFilter(id) {
		settings.get([ 'obs_source', 'obs_filter', 'filter_list', 'tip_range_list' ], function(data) {
			var source = data.obs_source;
			var filter = data.obs_filter;
			var filter_settings;
			var duration = 0;
			for (var i = 0; i < data.tip_range_list.length; i++)
			{
				if (data.tip_range_list[i].id == id)
				{
					duration = data.tip_range_list[i].duration;
					for (var j = 0; j < data.filter_list.length; j++)
					{
						if (data.filter_list[j].id == data.tip_range_list[i].filter) filter_settings = data.filter_list[j];
					}
				}
			}
			comms.send({ rcpt: 'obs', payload: { 'cmd': 'runFilter', source: source, filter: filter, filter_settings: filter_settings, duration: duration } });
		});
	}
	
	
}


/***************************************************************************************************
*
*
***************************************************************************************************/
class SMUIDebug {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		this.setupLogging();
		this.setupReset();
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupLogging() {
		var _this = this;
		settings.get('log_enable', function(log_enable) {
			if (log_enable)
			{
				logger.log('Setting UI logging to enabled');
				$('#log_enable').prop('checked', true);
			}
		});
		$('#log_enable').change(function() {
			settings.set('log_enable', this.checked);
			comms.send({ rcpt: 'log', payload: { 'cmd': this.checked ? 'enable' : 'disable' } });
		});
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	setupReset() {
		var _this = this;
		$('#reset_settings').click(function() {
			logger.log('Resetting settings');
			settings.clear();
			window.location.href = "popup.html";
		});
	}
	
	
}


/***************************************************************************************************
*
*
***************************************************************************************************/
class SMUI {
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	constructor() {
		comms.addHook('ui', this.onMessage);
		this.debug = new SMUIDebug();
		this.cb = new SMUIChaturbate();
		this.obs = new SMUIOBS();
		this.filters = new SMUIFilters();
		this.tipranges = new SMUITipRanges();
		 M.AutoInit();
	}
	
	
	/***********************************************************************************************
	*
	*
	***********************************************************************************************/
	onMessage(msg) {
		if (msg.cmd == undefined)
		{
			return false;
		}
		switch (msg.cmd)
		{
			case 'updateOBSStatus':
				return ui.obs.updateOBSStatus(msg.status);
			case 'updateCBStatus':
				return ui.cb.updateCBStatus(msg.status);
			default:
				return false;
		}
	}
	
	
}


/***************************************************************************************************
* Global variable declaration
***************************************************************************************************/
var ui = new SMUI();

