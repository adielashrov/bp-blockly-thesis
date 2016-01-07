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
        .appendTitle("forward");
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
        .appendTitle("right");
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
        .appendTitle("left");
    this.setOutput(true, "event");
    this.setTooltip('An event that turns the peg to the left');
  }
};

Blockly.JavaScript.bp_left = function() {
    return ["'left'", Blockly.JavaScript.ORDER_NONE];

};


Blockly.Language.bp_ballAhead = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("ballAhead");
    this.setOutput(true, "event");
    this.setTooltip('An event that occures when the path is blocked by a ball');
  }
};

Blockly.JavaScript.bp_ballAhead = function() {
    return ["'ballAhead'", Blockly.JavaScript.ORDER_NONE];
};

//End of events


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
Blockly.Language.bp_path_left = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("path left");
    this.setOutput(true, "event");
    this.setTooltip('An event that turns the peg to the left');
  }
};

Blockly.JavaScript.bp_path_left = function() {
    return ["'pathLeft'", Blockly.JavaScript.ORDER_NONE];
};