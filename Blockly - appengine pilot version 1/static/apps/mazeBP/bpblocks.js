//Adiel - Bp implicit blocks

Blockly.JavaScript.bp_reset_breakupon = function () {
	breakupon_counter = 0;
}

//Adiel - events for actuators
Blockly.Language.bp_forward = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("move forward");
    this.setOutput(true, "event");
    this.setTooltip('An event that moves the peg foward');
  }
};

Blockly.JavaScript.bp_forward = function() {
    return ["'forward'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_right = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("turn right");
    this.setOutput(true, "event");
    this.setTooltip('An event that turns the peg to the right');
  }
};

Blockly.JavaScript.bp_right = function() {
    return ["'right'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_left = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("turn left");
    this.setOutput(true, "event");
    this.setTooltip('An event that turns the peg to the left');
  }
};

Blockly.JavaScript.bp_left = function() {
    return ["'left'", Blockly.JavaScript.ORDER_NONE];

};


Blockly.Language.bp_holeAhead = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("hole ahead");
    this.setOutput(true, "event");
    this.setTooltip('An event that occures when the path is blocked by a hole');
  }
};

Blockly.JavaScript.bp_holeAhead = function() {
    return ["'holeAhead'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_no_holeAhead = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("no hole ahead");
    this.setInputsInline(true);
    this.setOutput(true, "event");
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_no_holeAhead = function() {
  return ["'noHoleAhead'", Blockly.JavaScript.ORDER_NONE];
};

//--------------------------------------------------------------------------------------------------------------
//---------------------------------------------End of events----------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

Blockly.Language.scoped_wait = {
  
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("WAIT-FOR")
        .appendTitle("Wait for");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Synchronize with all threads and wait until one of the specified events is triggered.');
  }

};
//Adiel - added to research proposal
Blockly.JavaScript.scoped_wait = function() {

  // Define a procedure with a return value.
  var wait = Blockly.JavaScript.valueToCode(this, 'WAIT-FOR', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  var _wait  = this.getInputTargetBlock('WAIT-FOR');
  
  // Add [..]  when the parameter is a single event
  if( _wait  && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1 )  wait  = '['+wait +']';

  // Generate JavaScript for bSync.
  var code='yield({request: [], wait: [].concat.apply([],breakupon_events).concat(' + wait + '), block: [].concat.apply([],blocked_events) });';
  for( var i=0; i<breakupon_counter; i++ ){ 
	code += 'if(findEvent(breakupon_events['+i+'],bp.lastEvent) && ('+wait+'.indexOf(bp.lastEvent) == -1)) break breakupon'+(i+1)+'\n'
  }
  return code;

};

//Adiel - added this research proporsal
Blockly.Language.scoped_request = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("REQUEST")
        .appendTitle("Request")
		.setCheck(['event',Array]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A request.');
  }
};

Blockly.JavaScript.scoped_request = function() { 
  var req = Blockly.JavaScript.valueToCode(this, 'REQUEST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  var _req  = this.getInputTargetBlock('REQUEST');
  
  // Add [..]  when the parameter is a single event
  if( _req  && _req.outputConnection.check_ && _req.outputConnection.check_.indexOf('event') != -1 )  req  = '['+req +']';

  // Generate JavaScript for bSync.
  var code = 'yield({request: ' + req + ', wait: [].concat.apply([],breakupon_events), block: [].concat.apply([],blocked_events)});';
  for( var i=0; i<breakupon_counter; i++ ){ 
	code += 'if(findEvent(breakupon_events['+i+'],bp.lastEvent) && ('+req+'.indexOf(bp.lastEvent) == -1)) break breakupon'+(i+1)+'\n'
  }
  return code;
};


Blockly.Language.maze_moveForwardBP = {
  // Block for moving forward.
  helpUrl: 'http://code.google.com/p/blockly/wiki/Move',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('maze_moveForwardBP'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Maze_moveForwardTooltip'));
  }
};

Blockly.JavaScript.maze_moveForwardBP = function() {
  // Generate JavaScript for moving forward. - now is brute force
  //return 'Maze.moveForward(\'block_id_' + this.id + '\');\n';
  
  //var req = Blockly.JavaScript.valueToCode(this, 'Event', Blockly.JavaScript.ORDER_ATOMIC) || '[]';//this.getTitleValue('REQUEST');
  var req = '[' + '\(\'forward\'\)' + ']';//#TODO: Can I do this better?Gera?
  var wait = '[]';
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';//#TODO: Ideas why this is isn't working?Gera?
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';
  
    // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
  
};

Blockly.Language.bp_repeat_forever = {
  
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle("Repeat forever");
    this.appendStatementInput("DO");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_repeat_forever = function() {
  
  var statement = Blockly.JavaScript.statementToCode(this, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    statement = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + statement;
  }

  return 'while (true) {\n' + statement + '}\n';
};

//-----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------Path - Events---------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------

//TODO: Fix link of helpUrl
Blockly.Language.bp_path_ahead = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("path ahead");
    this.setOutput(true, "event");
    this.setTooltip('An event that indicates a path ahead');
  }
};

Blockly.JavaScript.bp_path_ahead = function() {
    return ["'pathAhead'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_path_left = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("path left");
    this.setOutput(true, "event");
    this.setTooltip('An event that indicates a path to the left');
  }
};

Blockly.JavaScript.bp_path_left = function() {
    return ["'pathLeft'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_path_right = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("path right");
    this.setOutput(true, "event");
    this.setTooltip('An event that indicates a path right');
  }
};

Blockly.JavaScript.bp_path_right = function() {
    return ["'pathRight'", Blockly.JavaScript.ORDER_NONE];
};

//-----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------Do while blocking---------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
Blockly.Language.bp_breakupon = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendStatementInput("code");
    this.appendValueInput("events")
		.setCheck(['event'])
        .appendTitle("break upon");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_reset_breakupon = function () {
	breakupon_counter=0;
}

Blockly.JavaScript.bp_breakupon = function() {
  var value_events = Blockly.JavaScript.valueToCode(this, 'events', Blockly.JavaScript.ORDER_ATOMIC);
  
  breakupon_counter++;
  var statements_code = Blockly.JavaScript.statementToCode(this, 'code');

  
  // Assemble JavaScript into code variable.
  var code = '\n breakupon'+(breakupon_counter--)+': {';
  code += 'breakupon_events.push('+value_events+')\n';
  code += statements_code + '\n';
  code += '} breakupon_events.pop()\n';
   
  return code;
};


Blockly.Language.bp_dowhileblocking = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendValueInput("events")
		.setCheck(['event'])
        .appendTitle("Blocking");
    this.appendStatementInput("code");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};


Blockly.JavaScript.bp_dowhileblocking = function() {
  var value_events = Blockly.JavaScript.valueToCode(this, 'events', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_code = Blockly.JavaScript.statementToCode(this, 'code');
  
  // Assemble JavaScript into code variable.
  var code = '\n';
  code += 'blocked_events.push('+value_events+')\n';
  code += statements_code + '\n';
  code += 'blocked_events.pop()\n';
  return code;

};

/**--------------------------------------------------------------------------------------------------------------/
/*-------------------------------------Event static ordering for bpjs.js - START-------------------------------
-------------------------------------------------------------------------------------------------------------*/

event_order = ['holeAhead','noHoleAhead','pathLeft','pathRight','pathAhead','noPathAhead','noPathRight','noPathLeft','right','left','backward','forward','tick'];

function compareBids(a, b) {
    //return a.priority - b.priority;
	return event_order.indexOf(a.event) - event_order.indexOf(b.event);
}

/**--------------------------------------------------------------------------------------------------------------/
---------------------------------------Event static ordering for bpjs.js - END-----------------------------------
---------------------------------------------------------------------------------------------------------------*/