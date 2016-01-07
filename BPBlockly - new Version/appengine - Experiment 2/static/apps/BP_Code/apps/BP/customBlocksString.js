    var custom = {};
	custom.bp_event_O = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendValueInput('EVENT')
			.appendTitle('O', 'EV');

		this.setOutput(true, 'event');
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_event_O = function() {
		return ["'markO-'+"+Blockly.JavaScript.valueToCode(this, 'EVENT', Blockly.JavaScript.ORDER_ATOMIC), Blockly.JavaScript.ORDER_NONE];
	};


	custom.bp_event_X = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendValueInput('EVENT')
			.appendTitle('X', 'EV');

		this.setOutput(true, 'event');
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_event_X = function() {
		return ["'markX-'+"+Blockly.JavaScript.valueToCode(this, 'EVENT', Blockly.JavaScript.ORDER_ATOMIC),
		Blockly.JavaScript.ORDER_NONE];
	};


	custom.bp_event_click = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendValueInput('EVENT')
			.appendTitle('click','EV');

		this.setOutput(true, 'event');
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_event_click = function() {
		return ["'click-'+"+Blockly.JavaScript.valueToCode(this, 'EVENT', Blockly.JavaScript.ORDER_ATOMIC),
		Blockly.JavaScript.ORDER_NONE];
	};

	custom.bp_event_XWin = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendDummyInput()
			.appendTitle('X win', 'EV');

		this.setOutput(true, 'event');
		this.setTooltip('A user-defined event event');
	  },
	};


	Blockly.JavaScript.bp_event_XWin = function() {
		return ['"XWin"',Blockly.JavaScript.ORDER_NONE];
	};


	custom.bp_event_OWin = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendDummyInput()
			.appendTitle('O win', 'EV');

		this.setOutput(true, 'event');
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_event_OWin = function() {
		return ['"OWin"',Blockly.JavaScript.ORDER_NONE];
	};


	custom.bp_all_squares = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendDummyInput()
			.appendTitle('All Squares', 'EV');
		this.setOutput(true);
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_all_squares = function() {
		return ["['11','12','13','21','22','23','31','32','33']", Blockly.JavaScript.ORDER_NONE];
	};


	custom.bp_all_X_events = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendDummyInput()
			.appendTitle('All X events', 'EV');
		this.setOutput(true);
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_all_X_events = function() {
		return ["['markX-11','markX-12','markX-13','markX-21','markX-22','markX-23','markX-31','markX-32','markX-33']", Blockly.JavaScript.ORDER_NONE];
	};


	custom.bp_all_O_events = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendDummyInput()
			.appendTitle('All O events', 'EV');
		this.setOutput(true);
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_all_O_events = function() {
		return ["['markO-11','markO-12','markO-13','markO-21','markO-22','markO-23','markO-31','markO-32','markO-33']", Blockly.JavaScript.ORDER_NONE];
	};
	


	custom.bp_perms = {
	  helpUrl: 'http://www.example.com/',
	  init: function() {
		this.setColour(290);

		this.appendDummyInput()
			.appendTitle('All permutations of all lines', 'EV');
		this.setOutput(true);
		this.setTooltip('A user-defined event event');
	  },
	};

	Blockly.JavaScript.bp_perms = function() {
		var allPerms = "[[11, 12, 13], [11, 13, 12], [12, 11, 13], [12, 13, 11], [13, 11, 12], [13, 12, 11], [21, 22, 23], [21, 23, 22], [22, 21, 23], [22, 23, 21], [23, 21, 22], [23, 22, 21], [31, 32, 33], [31, 33, 32], [32, 31, 33], [32, 33, 31], [33, 31, 32], [33, 32, 31], [11, 21, 31], [11, 31, 21], [21, 11, 31], [21, 31, 11], [31, 11, 21], [31, 21, 11], [12, 22, 32], [12, 32, 22], [22, 12, 32], [22, 32, 12], [32, 12, 22], [32, 22, 12], [13, 23, 33], [13, 33, 23], [23, 13, 33], [23, 33, 13], [33, 13, 23], [33, 23, 13], [11, 22, 33], [11, 33, 22], [22, 11, 33], [22, 33, 11], [33, 11, 22], [33, 22, 11], [13, 22, 31], [13, 31, 22], [22, 13, 31], [22, 31, 13], [31, 13, 22], [31, 22, 13]]";
		return [allPerms, Blockly.JavaScript.ORDER_NONE];
	};

	
