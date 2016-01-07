// Extensions to Blockly's language and JavaScript generator.

// Define Language and JavaScript, in case this file is loaded too early.
//TODO: Adiel , how to fix this undefinded refernce error
if (!Blockly.Language) {
  Blockly.Language = {};
}

var breakupon_counter = 0;


Blockly.JavaScript = Blockly.Generator.get('JavaScript');

Blockly.Language.bp_bsync = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("sync");
    this.appendValueInput("REQUEST")
        .setCheck(['event', Array])
        .appendTitle("requested=");
    this.appendValueInput("WAIT-FOR")
        .setCheck(['event', Array])
        .appendTitle("wait-for=");
    this.appendValueInput("BLOCK")
        .setCheck(['event', Array])
        .appendTitle("block=");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Synchronize with all other b-threads and post own decleratios.');
  }
};

Blockly.JavaScript.bp_bsync = function() {
  var code_for_req   = Blockly.JavaScript.valueToCode(this, 'REQUEST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  var code_for_wait  = Blockly.JavaScript.valueToCode(this, 'WAIT-FOR', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  var code_for_block = Blockly.JavaScript.valueToCode(this, 'BLOCK', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  
  var _req   = this.getInputTargetBlock('REQUEST' ); 
  var _wait  = this.getInputTargetBlock('WAIT-FOR');
  var _block = this.getInputTargetBlock('BLOCK'   );     
  
  // Add [..]  when the parameter is a single event
  if( _req   && _req  .outputConnection.check_&& _req  .outputConnection.check_.indexOf('event') != -1 )  code_for_req   = '['+code_for_req  +']';
  if( _wait  && _wait .outputConnection.check_&& _wait .outputConnection.check_.indexOf('event') != -1 )  code_for_wait  = '['+code_for_wait +']';
  if( _block && _block.outputConnection.check_&& _block.outputConnection.check_.indexOf('event') != -1 )  code_for_block = '['+code_for_block+']';
  
  // Generate JavaScript for bSync.
  return 'yield({request:' + code_for_req + ', wait:' +  code_for_wait + ', block:' + code_for_block + '});';
};

Blockly.Language.bp_bthread = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("b-thread"), "NAME");
    this.appendValueInput("PARAM")
        .appendTitle("instantiation parameters:");
    this.appendStatementInput("BLOCK")
        .appendTitle("code:");
    this.setTooltip('A b-thread.');
  }
};

Blockly.JavaScript.bp_bthread = function() {
  var funcName = this.getTitleValue('NAME');
  var param = Blockly.JavaScript.valueToCode(this, 'PARAM', Blockly.JavaScript.ORDER_ATOMIC);
  var block = Blockly.JavaScript.statementToCode(this, 'BLOCK');

  if(param) {
	var code = param + '.forEach(function(p,p_idx){ bp.addBThread(\'' + funcName + '\'+p_idx, priority++, function(){' + block + '})});';
	//var code = 'bp.addBThread(\'' + funcName + '\', priority++, function() {' + block + '});';
	return code;  
  } else {
	var code = 'bp.addBThread(\'' + funcName + '\', priority++, function() {' + block + '});';
	return code;
  }
};


Blockly.Language.bp_start = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("start");
    this.setOutput(true, "event");
    this.setTooltip('An event that is automatically triggered when the application starts');
  }
};

Blockly.JavaScript.bp_start = function() {
    return ["'start'", Blockly.JavaScript.ORDER_NONE];
};


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


Blockly.Language.bp_move = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("Move")
        .appendTitle(new Blockly.FieldDropdown([["forward", "forward"], ["backward", "backward"], ["", ""]]), "DIRECTIONS");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_move = function() {
  var dropdown_directions = this.getTitleValue('DIRECTIONS');
  //Bpsync generated code - creating a forward request
  var req = '[(' + '"' + dropdown_directions+ '"' + ')]';
  var wait = '[]';
  var block ='[]';

  //JavaScript for bSync - code
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});\n';
};

Blockly.Language.bp_turn = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("turn")
        .appendTitle(new Blockly.FieldDropdown([["left", "left"], ["right", "right"], ["randomly", "random"]]), "DIRECTIONS");
	this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_turn = function() {
  
  var dropdown_name = this.getTitleValue('DIRECTIONS');
  var code = "";
   
  //Bpsync generated code - creating a forward request
  var req = '';
  var wait = '[]';
  var block ='[]';
  
  if(dropdown_name == 'random')
  {
	if(Math.random() < 0.5)
	{
		req = '[(' + '"left"' + ')]';
	}
	else
	{
		req = '[(' + '"right"' + ')]';
	}
  }
  else
  {
	req = '[(' + '"' + dropdown_name + '"' + ')]';
  }
     
  //JavaScript for bSync - code
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});\n'; 
};

//Path Ahead - blocks

Blockly.Language.bp_path_ahead = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("path ahead");
    this.setOutput(true, "event");
    this.setTooltip('An event that moves the peg ahead');
  }
};

Blockly.JavaScript.bp_path_ahead = function() {
    return ["'pathAhead'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_no_path_ahead = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("no path ahead");
    this.setOutput(true, "event");
    this.setTooltip('An event that checks if the peg can not move ahead');
  }
};

Blockly.JavaScript.bp_no_path_ahead = function() {
    return ["'noPathAhead'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_path_right = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("path right");
    this.setOutput(true, "event");
    this.setTooltip('An event that turns the peg to the right');
  }
};

Blockly.JavaScript.bp_path_right = function() {
    return ["'pathRight'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_no_path_right = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("no path right");
    this.setOutput(true, "event");
    this.setTooltip('An event that checks if the peg can not turn to the right');
  }
};

Blockly.JavaScript.bp_no_path_right = function() {
    return ["'noPathRight'", Blockly.JavaScript.ORDER_NONE];
};

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

Blockly.Language.bp_no_path_left = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("no path left");
    this.setOutput(true, "event");
    this.setTooltip('An event that checks if the peg can not turn to the left');
  }
};

Blockly.JavaScript.bp_no_path_left = function() {
    return ["'noPathLeft'", Blockly.JavaScript.ORDER_NONE];
};


///////////////////////////////////////Last Event Block//////////////////////

Blockly.Language.bp_lastEvent = {
  // Block for checking if there a wall.
  category: 'Behavioral Programming',
  //helpUrl: 'http://code.google.com/p/google-blockly/wiki/Wall',
   init: function() {
    this.setColour(290);
  
    this.appendDummyInput()
        .appendTitle("last event");

	this.setOutput(true, String);
    this.setTooltip('A pseudo variable representing the event selected in the last b-sync.');
  }
};


Blockly.JavaScript.bp_lastEvent = function() {
	return ['bp.lastEvent', Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.Language.lists_join = {
  // Create a list by joining other lists.
  category: Blockly.LANG_CATEGORY_LISTS,
  helpUrl: '',
  init: function() {
    this.setColour(210);
    this.appendTitle('join lists');
    this.appendInput('', Blockly.INPUT_VALUE, 'ADD0', null);
    this.appendInput('', Blockly.INPUT_VALUE, 'ADD1', null);
    this.appendInput('', Blockly.INPUT_VALUE, 'ADD2', null);
    this.setOutput(true, Array);
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip('Join lists');
    this.itemCount_ = 3;
  },
  mutationToDom: function(workspace) {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function(container) {
    for (var x = 0; x < this.itemCount_; x++) {
      this.removeInput('ADD' + x);
    }
    this.itemCount_ = window.parseInt(container.getAttribute('items'), 10);
    for (var x = 0; x < this.itemCount_; x++) {
      this.appendInput('', Blockly.INPUT_VALUE, 'ADD' + x, null);
    }
  },
  decompose: function(workspace) {
    var listBlock = new Blockly.Block(workspace, 'lists_create_with_container');
    listBlock.initSvg();
    var connection = listBlock.inputList[0];
    for (var x = 0; x < this.itemCount_; x++) {
      var itemBlock = new Blockly.Block(workspace, 'lists_create_with_item');
      itemBlock.initSvg();
      // Store a pointer to any connected blocks.
      itemBlock.valueInput_ = this.getInput('ADD' + x).targetConnection;
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return listBlock;
  },
  compose: function(listBlock) {
    // Disconnect all input blocks and destroy all inputs.
    for (var x = 0; x < this.itemCount_; x++) {
      this.removeInput('ADD' + x);
    }
    this.itemCount_ = 0;
    // Rebuild the block's inputs.
    var itemBlock = listBlock.getInputTargetBlock('STACK');
    while (itemBlock) {
      var input =
          this.appendInput('', Blockly.INPUT_VALUE, 'ADD' + this.itemCount_, null);
      // Reconnect any child blocks.
      if (itemBlock.valueInput_) {
        input.connect(itemBlock.valueInput_);
      }
      this.itemCount_++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  }
};

Blockly.JavaScript.lists_join = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.JavaScript.valueToCode(this, 'ADD' + n,
        Blockly.JavaScript.ORDER_COMMA) || 'null';
  }
  code = '[].concat(' + code.join(', ') + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

///////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////Adiel - Michal blocks/////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

Blockly.Language.nlbp_request_new = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("Event")
        .appendTitle("Request");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A request.');
  }
};

Blockly.JavaScript.nlbp_request_new = function() {
  
  var req = Blockly.JavaScript.valueToCode(this, 'Event', Blockly.JavaScript.ORDER_ATOMIC) || '[]';//this.getTitleValue('REQUEST');
  req = '[' + req + ']';//#TODO: Can I do this better?Gera?
  var wait = '[]';
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';//#TODO: Ideas why this is isn't working?Gera?
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};


//#TODO: Add to template.soy and compile
Blockly.Language.nlbp_wait_new = {
  
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("Event")
        .appendTitle("Wait for");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A wait.');
  }

};

Blockly.JavaScript.nlbp_wait_new = function() {

  // Define a procedure with a return value.
  var req =  '[]';
  var wait = Blockly.JavaScript.valueToCode(this, 'Event', Blockly.JavaScript.ORDER_ATOMIC) || '[]';//this.getTitleValue('REQUEST');
  wait = '[' + wait + ']';//#TODO: Can I do this better?Gera?
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};

Blockly.Language.nlbp_requestblock_new = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("EventRequest")
        .appendTitle("Request");
    this.appendValueInput("EventBlock")
        .appendTitle("While blocking");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A request and block.');
  }
};

Blockly.JavaScript.nlbp_requestblock_new = function() {
 
  //var value_eventrequest = Blockly.JavaScript.valueToCode(this, 'EventRequest', Blockly.JavaScript.ORDER_ATOMIC);
  //var value_eventblock = Blockly.JavaScript.valueToCode(this, 'EventBlock', Blockly.JavaScript.ORDER_ATOMIC);
 
  
  // Define a procedure with a return value.
  var req =  Blockly.JavaScript.valueToCode(this, 'EventRequest', Blockly.JavaScript.ORDER_ATOMIC);
  //var req = Blockly.JavaScript.valueToCode(this, 'REQUEST') || '[]';
  var wait = '[]';
  var block = Blockly.JavaScript.valueToCode(this, 'EventBlock', Blockly.JavaScript.ORDER_ATOMIC);
  req = '[' + req + ']';
  block = '[' + block + ']';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};

Blockly.Language.nlbp_requestwait_new = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("Request")
        .appendTitle("Request");
    this.appendValueInput("WAIT")
        .appendTitle("until");
    this.appendDummyInput()
        .appendTitle("happens");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A request and wait.');
  }
};

Blockly.JavaScript.nlbp_requestwait_new = function() {
  
  
  // Define a procedure with a return value.
  var req =  Blockly.JavaScript.valueToCode(this, 'Request', Blockly.JavaScript.ORDER_ATOMIC);
  var wait = Blockly.JavaScript.valueToCode(this, 'WAIT', Blockly.JavaScript.ORDER_ATOMIC);
  var block = '[]';
  //#TODO: Consolt with Gera
  req = '['+req+']';
  wait = '['+wait+']';
  
  /*
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) )
	req = '['+req+']';
  else
	console.log('didnt enter if block req code');
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';
  */
  
  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};

Blockly.Language.nlbp_waitandblock_new = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("WAIT")
        .appendTitle("Wait for");
    this.appendValueInput("BLOCK")
        .appendTitle("while blocking");
    this.setInputsInline(true);
	this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A wait and block.');
  }
};

Blockly.JavaScript.nlbp_waitandblock_new = function() {
  
  // Define a procedure with a return value.
  var req =   '[]';
  var wait = Blockly.JavaScript.valueToCode(this, 'WAIT', Blockly.JavaScript.ORDER_ATOMIC);
  var block = Blockly.JavaScript.valueToCode(this, 'BLOCK', Blockly.JavaScript.ORDER_ATOMIC);
  
  //#TODO: Consult with Gera
  wait = '['+wait+']';
  block = '['+block+']';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
  ;
};

Blockly.Language.nlbp_waitthenrequest_new = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("WAIT")
        .appendTitle("Wait for");
    this.appendValueInput("REQUEST")
        .appendTitle("then request");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A wait and than a request.');
  }
};

Blockly.JavaScript.nlbp_waitthenrequest_new = function() {
 
  // Define a procedure with a return value.
  var req =   Blockly.JavaScript.valueToCode(this, 'REQUEST', Blockly.JavaScript.ORDER_ATOMIC);
  var wait = Blockly.JavaScript.valueToCode(this, 'WAIT', Blockly.JavaScript.ORDER_ATOMIC);
  var block = '[]';
  
   //#TODO: Consolt with Gera
  req = '['+req+']';
  wait = '['+wait+']';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' +  '[]' + ', wait:' +  wait + ', block:' + block + '});' + 
        'yield({request:' + req + ', wait:' +   '[]' + ', block:' + block + '});';
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////-----------Adiel & Michal------End----//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////
//Michal test add function
/////////////////////////////////////

Blockly.Language.bp_funcCall = {
  // Block for checking if there a wall.
  category: 'Behavioral Programming',
  //helpUrl: 'http://code.google.com/p/google-blockly/wiki/Wall',
   init: function() {
    this.setColour(290);
    this.setPreviousStatement(true);
    this.setNextStatement(true);


    this.appendTitle('call func');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    //this.setOutput(true);
    //this.setMutator(new Blockly.Mutator(this, ['lists_create_with_item']));
    this.setTooltip('call function implemented elsewhere.');
    //this.itemCount_ = 3;
	
  },
};

Blockly.JavaScript.bp_funcCall = function() {

  //var funcName = Blockly.JavaScript.quote_(this.getTitleText('TEXT'));
  var funcName = this.getTitleText('TEXT');

  // Generate JavaScript for bSync.
  return [funcName + '();'];
};




//////////////////////////////////////
//Michal NL BP test
/////////////////////////////////////
Blockly.Language.nlbp_request = {
  // Define a procedure with no return value.
  category: 'Easy BP',
  //helpUrl: 'http://en.wikipedia.org/wiki/Variable_(computer_science)',
  init: function() {
    this.setColour(290);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	
    this.appendTitle('Request');
    this.appendTitle(new Blockly.FieldTextInput(''), 'REQUEST');

    this.setTooltip('A request.');
  },
  getProcedureDef: function() {
    return this.getTitleText(0);
  }
};

Blockly.JavaScript.nlbp_request = function() {

  // Define a procedure with a return value.
  var req = Blockly.JavaScript.quote_(this.getTitleText('REQUEST'));
  //var req = Blockly.JavaScript.valueToCode(this, 'REQUEST') || '[]';
  var wait = '[]';
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};



Blockly.Language.nlbp_wait = {
  // Define a procedure with no return value.
  category: 'Easy BP',
  //helpUrl: 'http://en.wikipedia.org/wiki/Variable_(computer_science)',
  init: function() {
    this.setColour(290);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	
    this.appendTitle('Wait for');
    this.appendTitle(new Blockly.FieldTextInput(''), 'WAIT');

    this.setTooltip('A wait.');
  },
  getProcedureDef: function() {
    return this.getTitleText(0);	
  }
};

Blockly.JavaScript.nlbp_wait = function() {

  // Define a procedure with a return value.
  var req =  '[]';
  //var req = Blockly.JavaScript.valueToCode(this, 'REQUEST') || '[]';
  var wait = Blockly.JavaScript.quote_(this.getTitleText('WAIT'));
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};



Blockly.Language.nlbp_requestBlock = {
  // Define a procedure with no return value.
  category: 'Easy BP',
  //helpUrl: 'http://en.wikipedia.org/wiki/Variable_(computer_science)',
  init: function() {
    this.setColour(290);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	
    this.appendTitle('Request');
    this.appendTitle(new Blockly.FieldTextInput(''), 'REQUEST');
    this.appendTitle('while blocking');
    this.appendTitle(new Blockly.FieldTextInput(''), 'BLOCK');

    this.setTooltip('A request and block.');
  },
  getProcedureDef: function() {
    return this.getTitleText(0);
  }
};

Blockly.JavaScript.nlbp_requestBlock = function() {

  // Define a procedure with a return value.
  var req =  Blockly.JavaScript.quote_(this.getTitleText('REQUEST'));
  //var req = Blockly.JavaScript.valueToCode(this, 'REQUEST') || '[]';
  var wait = '[]';
  var block = Blockly.JavaScript.quote_(this.getTitleText('BLOCK'));
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};

//#TODO: Transform all from here till end to new blockly


Blockly.Language.nlbp_requestWait = {
  // Define a procedure with no return value.
  category: 'Easy BP',
  //helpUrl: 'http://en.wikipedia.org/wiki/Variable_(computer_science)',
  init: function() {
    this.setColour(290);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	
    this.appendTitle('Request');
    this.appendTitle(new Blockly.FieldTextInput(''), 'REQUEST');
    this.appendTitle('until');
    this.appendTitle(new Blockly.FieldTextInput(''), 'WAIT');
    this.appendTitle('happens');

    this.setTooltip('A request and wait.');
  },
  getProcedureDef: function() {
    return this.getTitleText(0);
  }
};

Blockly.JavaScript.nlbp_requestWait = function() {

  // Define a procedure with a return value.
  var req =  Blockly.JavaScript.quote_(this.getTitleText('REQUEST'));
  var wait = Blockly.JavaScript.quote_(this.getTitleText('WAIT'));
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};

Blockly.Language.nlbp_WaitAndBlock = {
  // Define a procedure with no return value.
  category: 'Easy BP',
  //helpUrl: 'http://en.wikipedia.org/wiki/Variable_(computer_science)',
  init: function() {
    this.setColour(290);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	
    this.appendTitle('Wait for');
    this.appendTitle(new Blockly.FieldTextInput(''), 'WAIT');
    this.appendTitle('while blocking');
    this.appendTitle(new Blockly.FieldTextInput(''), 'BLOCK');

    this.setTooltip('A wait and block.');
  },
  getProcedureDef: function() {
    return this.getTitleText(0);
  }
};

Blockly.JavaScript.nlbp_WaitAndBlock = function() {

  // Define a procedure with a return value.
  var req =   '[]';
  var wait = Blockly.JavaScript.quote_(this.getTitleText('WAIT'));
  var block = Blockly.JavaScript.quote_(this.getTitleText('BLOCK'));
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
};

Blockly.Language.nlbp_WaitThenRequest = {
  // Define a procedure with no return value.
  category: 'Easy BP',
  //helpUrl: 'http://en.wikipedia.org/wiki/Variable_(computer_science)',
  init: function() {
    this.setColour(290);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	
    this.appendTitle('Wait for');
    this.appendTitle(new Blockly.FieldTextInput(''), 'WAIT');
    this.appendTitle('then');
    this.appendTitle('request');
    this.appendTitle(new Blockly.FieldTextInput(''), 'REQUEST');

    this.setTooltip('A wait and block.');
  },
  getProcedureDef: function() {
    return this.getTitleText(0);
  }
};

Blockly.JavaScript.nlbp_WaitThenRequest = function() {

  // Define a procedure with a return value.
  var req =   Blockly.JavaScript.quote_(this.getTitleText('BLOCK'));
  var wait = Blockly.JavaScript.quote_(this.getTitleText('WAIT'));
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';

  // Generate JavaScript for bSync.
  return 'yield({request:' +  '[]' + ', wait:' +  wait + ', block:' + block + '});' + 
        'yield({request:' + req + ', wait:' +   '[]' + ', block:' + block + '});';
};



//// Gera's experimental scoped blocks
////////////////////////////////////////////////////////////////////////////////////////
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
        .appendTitle("while blocking");
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

Blockly.JavaScript.scoped_wait = function() {

  // Define a procedure with a return value.
  var wait = Blockly.JavaScript.valueToCode(this, 'WAIT-FOR', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  var _wait  = this.getInputTargetBlock('WAIT-FOR');
  
  // Add [..]  when the parameter is a single event
  if( _wait  && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1 )  wait  = '['+wait +']';

  // Generate JavaScript for bSync.
  var code='yield({request: [], wait: breakupon_events.concat(' + wait + '), block: blocked_events });';
  for( var i=0; i<breakupon_counter; i++ ){ 
	code += 'if((breakupon_events['+i+'] == bp.lastEvent) && ('+wait+'.indexOf(bp.lastEvent)==-1)) break breakupon'+(i+1)+'\n'
  }
  return code;

};


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
  //var code='yield({request: [], wait: breakupon_events.concat(' + wait + '), block: blocked_events });';
  var code = 'yield({request: ' + req + ', wait: breakupon_events, block: blocked_events});';
  for( var i=0; i<breakupon_counter; i++ ){ 
	code += 'if((breakupon_events['+i+'] == bp.lastEvent) && ('+req+'.indexOf(bp.lastEvent)==-1)) break breakupon'+(i+1)+'\n'
  }
  return code;
};

Blockly.Language.bp_event = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
	
    this.appendValueInput("EVENT")
        .appendTitle("Event");
		
    this.setOutput(true, "event");
    this.setTooltip('A user-defined event event');
  }
};

Blockly.JavaScript.bp_event = function() {
    return [Blockly.JavaScript.valueToCode(this, 'EVENT', Blockly.JavaScript.ORDER_ATOMIC), Blockly.JavaScript.ORDER_NONE];
};




