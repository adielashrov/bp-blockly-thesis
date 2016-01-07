////////////////////////////////////////////////////////////////////////////////
///////////////////BP - added utility javascript code///////////////////////////
////////////////////////////////////////////////////////////////////////////////
//TODO: Move to the bp.js file. consult with Gera.
//TODO: Duplicate code , same in bpblocks.js of the MazeBP.
//This function checks whether an event is inside array.
// Array could be a string or a flattened array of strings.
var findEvent = function(array, event) {
    //window.alert("Inside findEvent");
    var tAnswer = 0;
    if (typeof array == 'string') {
        if (array.indexOf(event) != -1) {
            tAnswer = 1;
        }
    } else if (array instanceof Array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] != null) {
                if (array[i].indexOf(event) != -1) {
                    tAnswer = 1;
                }
            }
        }
    }
    return tAnswer;
};

nesting_counter = 0;

Blockly.JavaScript.bp_reset_breakupon = function() {
        nesting_counter = 0;
    }
    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////BP - added utility javascript code end///////////////////////
    ////////////////////////////////////////////////////////////////////////////////

/*Comment*/ 
//-------------------------------------------------------------------------------//
//----------------------------------BP events------------------------------------//
//-------------------------------------------------------------------------------//


//BP - events for actuators
Blockly.Language.bp_forward = {
    helpUrl: '../../blocks_API/move_forward.html',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("move forward");
        this.setOutput(true, "event");
        this.setTooltip('An event that moves the peg foward');
    }
};

Blockly.JavaScript.bp_forward = function() {
    return ["'move forward'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_right = {
    helpUrl: '../../blocks_API/turn_right.html',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("turn right");
        this.setOutput(true, "event");
        this.setTooltip('An event that turns the peg to the right');
    }
};

Blockly.JavaScript.bp_right = function() {
    return ["'turn right'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_left = {
    helpUrl: '../../blocks_API/turn_left.html',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("turn left");
        this.setOutput(true, "event");
        this.setTooltip('An event that turns the peg to the left');
    }
};

Blockly.JavaScript.bp_left = function() {
    return ["'turn left'", Blockly.JavaScript.ORDER_NONE];

};


Blockly.Language.bp_barrierAhead = {
    helpUrl: '../../blocks_API/barrier_ahead.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("barrier ahead");
        this.setOutput(true, "sensorEvent");
        this.setTooltip('An event that occures when the path is blocked by a barrier');
    }
};

Blockly.JavaScript.bp_barrierAhead = function() {
    return ["'barrier ahead'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_no_barrierAhead = {
    helpUrl: '../../blocks_API/no_barrier_ahead.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("no barrier ahead");
        this.setInputsInline(true);
        this.setOutput(true, "sensorEvent");
        this.setTooltip('');
    }
};

Blockly.JavaScript.bp_no_barrierAhead = function() {
    return ["'no barrier ahead'", Blockly.JavaScript.ORDER_NONE];
};

//--------------------------------------------------------------------------------------------------------------
//---------------------------------------------End of events----------------------------------------------------
//--------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------
//---------------------------------------------Start of implicit idioms----------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

/**
 ** Function which generates a bSync idiom.
 **/
bSyncHelper = function(req, wait, block) {
    var code = "";
    code += 'yield({request: ' + req + ', wait: breakupon_events.concat(' + wait + '), block: [].concat.apply(' + block + ',blocked_events)});\n';

    for (var i = 0; i < nesting_counter; i++) {
        //Version without the use of the function findEvent
        //code += 'if((breakupon_events[' + i + '] == bp.lastEvent) && (' + req + '.indexOf(bp.lastEvent)==-1) && (' + wait + '.indexOf(bp.lastEvent)==-1)) { break level_' + (i + 1) + ';\n\}';

        //Version with use of findEvent function TODO:Debug
        code += 'if(findEvent(breakupon_events[' + i + '],bp.lastEvent) && (' + req + '.indexOf(bp.lastEvent)==-1) && (' + wait + '.indexOf(bp.lastEvent)==-1)) { break level_' + (i + 1) + ';\n\}';
    }
    return code;
}

Blockly.Language.scoped_wait = {

    helpUrl: '../../blocks_API/wait_for.html',
    init: function() {
        this.setColour(290);
        this.appendValueInput("WAIT-FOR")
            .setCheck("sensorEvent")
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
    var _wait = this.getInputTargetBlock('WAIT-FOR');

    // Add [..]  when the parameter is a single event
    if (_wait && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1) wait = '[' + wait + ']';

    //push an event for highlighting the current block
    var code = "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
    // Generate JavaScript for bSync.
    code += bSyncHelper('[]', wait, '[]');

    return code;

};

//Adiel - added this research proporsal
Blockly.Language.scoped_request = {
    helpUrl: '../../blocks_API/request.html',
    init: function() {
        this.setColour(290);
        this.appendValueInput("REQUEST")
            .appendTitle("Request")
            .setCheck(['event', Array]);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('A request.');
    }
};

Blockly.JavaScript.scoped_request = function() {
    var req = Blockly.JavaScript.valueToCode(this, 'REQUEST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _req = this.getInputTargetBlock('REQUEST');

    // Add [..]  when the parameter is a single event
    if (_req && _req.outputConnection.check_ && _req.outputConnection.check_.indexOf('event') != -1) req = '[' + req + ']';

    //push an event for highlighting the current block
    var code = "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
    // Generate JavaScript for request,using bSyncHelper
    code += bSyncHelper(req, '[]', '[]');

    return code;
};


Blockly.Language.maze_moveForwardBP = {
    // Block for moving forward.
    helpUrl: 'http://code.google.com/p/blockly/wiki/Move',
    init: function() {
        this.setColour(190);
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
    var req = '[' + '\(\'forward\'\)' + ']'; //#TODO: Can I do this better?Gera?
    var wait = '[]';
    var block = '[]';

    // If the parameter is a single event, wrap it with square brackets
    if (req.match(/^\'.*\'/)) req = '[' + req + ']'; //#TODO: Ideas why this is isn't working?Gera?
    if (wait.match(/^\'.*\'/)) wait = '[' + wait + ']';
    if (block.match(/^\'.*\'/)) block = '[' + block + ']';

    // Generate JavaScript for bSync.
    return 'yield({request:' + req + ', wait:' + wait + ', block:' + block + '});';

};

Blockly.Language.bp_repeat_forever = {

    helpUrl: '../../blocks_API/repeat_forever.html',
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

    var code = 'while (true) {\n';
    //Version 1 - Before yield TODO: Consult with Gera
    /*
	code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
	code += statement + '}\n';
	*/

    //Version 2 - After yield.

    code += statement;
    code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);}\n"; //Removing highlight for repeat.
    //code += "}\n";
    return code;
};

//-----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------Path - Events---------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------

//TODO: Fix link of helpUrl
Blockly.Language.bp_path_ahead = {
    helpUrl: '../../blocks_API/path_ahead.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("path ahead");
        this.setOutput(true, "sensorEvent");
        this.setTooltip('An event that indicates a path ahead');
    }
};

Blockly.JavaScript.bp_path_ahead = function() {
    return ["'path ahead'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_path_left = {
    helpUrl: '../../blocks_API/path_left.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("path left");
        this.setOutput(true, "sensorEvent");
        this.setTooltip('An event that indicates a path to the left');
    }
};

Blockly.JavaScript.bp_path_left = function() {
    return ["'path left'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_path_right = {
    helpUrl: '../../blocks_API/path_right.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("path right");
        this.setOutput(true, "sensorEvent");
        this.setTooltip('An event that indicates a path right');
    }
};

Blockly.JavaScript.bp_path_right = function() {
    return ["'path right'", Blockly.JavaScript.ORDER_NONE];
};


Blockly.Language.bp_no_path_ahead = {
    helpUrl: '../../blocks_API/no_path_ahead.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("no path ahead");
        this.setOutput(true, "sensorEvent");
        this.setTooltip('An event that indicates a no path ahead');
    }
};

Blockly.JavaScript.bp_no_path_ahead = function() {
    return ["'no path ahead'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_no_path_right = {
    helpUrl: '../../blocks_API/no_path_right.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("no path right");
        this.setOutput(true, "sensorEvent");
        this.setTooltip('An event that indicates a no path right');
    }
};

Blockly.JavaScript.bp_no_path_right = function() {
    return ["'no path right'", Blockly.JavaScript.ORDER_NONE];
};

Blockly.Language.bp_no_path_left = {
    helpUrl: '../../blocks_API/no_path_left.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("no path left");
        this.setOutput(true, "sensorEvent");
        this.setTooltip('An event that indicates a no path left');
    }
};

Blockly.JavaScript.bp_no_path_left = function() {
    return ["'no path left'", Blockly.JavaScript.ORDER_NONE];
};


//-----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------Do while blocking - and breakupon-------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
Blockly.Language.bp_breakupon = {
    helpUrl: '../../blocks_API/breakupon.html',
    init: function() {
        this.setColour(350);
        this.appendStatementInput("code");
        this.appendValueInput("events")
            .setCheck(['event', 'sensorEvent'])
            .appendTitle("break upon");

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.JavaScript.bp_breakupon = function() {
    var value_events = Blockly.JavaScript.valueToCode(this, 'events', Blockly.JavaScript.ORDER_ATOMIC);

    nesting_counter++;
    var statements_code = Blockly.JavaScript.statementToCode(this, 'code');

    // Assemble JavaScript into code variable.
    var code = '\n level_' + (nesting_counter--) + ': {';
    code += 'breakupon_events.push(' + value_events + ');\n';
    code += 'blocked_events.push([]);\n';
    code += statements_code + '\n';
    code += '}\n';
    //code += 'window.alert(\"breakupon\" + bp.lastEvent);\n';
    code += 'breakupon_events = breakupon_events.slice(0,' + nesting_counter + ');\n';
    code += 'blocked_events = blocked_events.slice(0,' + nesting_counter + ');\n';
    return code;

};


Blockly.Language.bp_dowhileblocking = {
    helpUrl: '../../blocks_API/blocking.html',
    init: function() {
        this.setColour(350);
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

    nesting_counter++;
    var statements_code = Blockly.JavaScript.statementToCode(this, 'code');

    // Assemble JavaScript into code variable.
    var code = '\n level_' + (nesting_counter--) + ': {';

    code += 'blocked_events.push(' + value_events + ');\n';
    code += 'breakupon_events.push([]);\n';
    code += statements_code + '\n';
    code += '} blocked_events.pop();\n';
    code += 'breakupon_events.pop();\n';
    return code;

};

/**
bSync idiom for mazeBP
*/
Blockly.Language.bsync = {
    helpUrl: '../../blocks_API/bSync.html',
    init: function() {
        this.setColour(290);
        this.appendDummyInput()
            .appendTitle("bSync");
        this.appendValueInput("REQUEST")
            .setCheck(['event', Array]) //Should be  .setCheck(["event", "Array"]) perhaps?
            .appendTitle("request=");
        this.appendValueInput("WAIT-FOR")
            .setCheck(['Array', 'event', 'sensorEvent'])
            .appendTitle("wait-for=");
        this.appendValueInput("BLOCK")
            .setCheck(['event', Array])
            .appendTitle("block=");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

/**
bSync idiom for mazeBP translation
*/
Blockly.JavaScript.bsync = function() {

    var req = Blockly.JavaScript.valueToCode(this, 'REQUEST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
    var wait = Blockly.JavaScript.valueToCode(this, 'WAIT-FOR', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
    var block = Blockly.JavaScript.valueToCode(this, 'BLOCK', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    var _req = this.getInputTargetBlock('REQUEST');
    var _wait = this.getInputTargetBlock('WAIT-FOR');
    var _block = this.getInputTargetBlock('BLOCK');

    // Add [..]  when the parameter is a single event
    if (_req && _req.outputConnection.check_ && _req.outputConnection.check_.indexOf('event') != -1) req = '[' + req + ']';
    if (_wait && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1) wait = '[' + wait + ']';
    if (_block && _block.outputConnection.check_ && _block.outputConnection.check_.indexOf('event') != -1) block = '[' + block + ']';

    //push an event for highlighting the current block
    var code = "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";

    code += bSyncHelper(req, wait, block);
    return code;
};

/***
 * Last event block - perhaps change it?
 */
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

Blockly.Language.bp_if_not_last_event = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(120);
        this.appendValueInput("EVENT")
            .setCheck(['event', 'sensorEvent', 'Array'])
            .appendTitle("If last event != ");
        this.appendStatementInput("statement");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.JavaScript.bp_if_not_last_event = function() {
    var event_name = Blockly.JavaScript.valueToCode(this, 'EVENT', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_statement = Blockly.JavaScript.statementToCode(this, 'statement');
    var code = "";
    code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
    //push an event for highlighting the current block
    //code += 'if(' + event_name + '.indexOf(bp.lastEvent) == -1) {\n' +
    if (event_name.length > 0) {
        code += 'if(!findEvent(' + event_name + ',bp.lastEvent)) {\n' + statements_statement + '\}';
    } else {
        code += 'if(true) {\n' + statements_statement + '\}';
    }
    return code;
};

Blockly.Language.bp_if_last_event = {
    helpUrl: '../../blocks_API/if_last_event.html',
    init: function() {
        this.setColour(120);
        this.appendValueInput("EVENT")
            .setCheck(['event', 'sensorEvent', 'Array'])
            .appendTitle("If last event == ");
        this.appendStatementInput("statement");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.JavaScript.bp_if_last_event = function() {
    var event_name = Blockly.JavaScript.valueToCode(this, 'EVENT', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_statement = Blockly.JavaScript.statementToCode(this, 'statement');
    var code = "";
    code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
    //push an event for highlighting the current block
    if (event_name.length > 0) {
        code += 'if(findEvent(' + event_name + ',bp.lastEvent)) {\n' + statements_statement + '\}';
    } else {
        code += 'if(true) {\n' + statements_statement + '\}';
    }
    return code;
};

/**-----------------------------------------------------------------------------------------------------------/
/*-------------------------------------Structures for Break in Version 1 - START------------------------------
-------------------------------------------------------------------------------------------------------------*/

Blockly.Language.bp_label = {
  helpUrl: '../../blocks_API/label_and_break.html',
  init: function() {
    this.setColour(350);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("Label_Name"), "LABEL_NAME");
    this.appendStatementInput("NAME");
    this.setInputsInline(true);
	this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_label = function() {
  var code = "";
  var statements_name = Blockly.JavaScript.statementToCode(this, 'NAME');
  var text_label_name = this.getTitleValue('LABEL_NAME');
  var regEx = /^[a-zA-Z _0-9]+$/i;
  if(!regEx.test(text_label_name)){
    alert("Wrong format for Label name! should be composed of letters,numbers and spaces only!");
    throw "Wrong format for Label name! should be composed of letters,numbers and spaces only!";
  }
  else{
    text_label_name = text_label_name.replace(/ /g,'_');
    code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
    code += text_label_name + ' :{\n' + statements_name +'}';
  }
  return code;
};

Blockly.Language.bp_break = {
  helpUrl: '../../blocks_API/label_and_break.html',
  init: function() {
    this.setColour(350);
    this.appendDummyInput()
        .appendTitle("break ");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("Label_Name"), "LABEL_NAME");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_break = function() {
  var text_label_name = this.getTitleValue('LABEL_NAME');
  var code = "";
  var regEx = /^[a-zA-Z _0-9]+$/i;
  if(!regEx.test(text_label_name)){
    alert("Wrong format for Label name! should be composed of letters,numbers and spaces only!");
    throw "Wrong format for Label name! should be composed of letters,numbers and spaces only!";
  }
  else {
    text_label_name = text_label_name.replace(/ /g,'_');
    code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
    code += 'break ' + text_label_name + ';\n';
  }
  return code;
};

/**------------------------------------------------------------------------------------------------------------/
---------------------------------------Structures for Break in Version 1 - END---------------------------------
--------------------------------------------------------------------------------------------------------------*/


/**--------------------------------------------------------------------------------------------------------------/
/*-------------------------------------Event static ordering for bpjs.js - START-------------------------------
-------------------------------------------------------------------------------------------------------------*/
//The more left the event , the higher is it's priority.
//Event order is like the version above, turn left is higher than turn right.
event_order = ['barrier ahead', 'no barrier ahead', 'path left', 'no path left', 'path ahead', 'no path ahead', 'path right', 'no path right', 'turn left', 'turn right', 'backward', 'move forward', 'tick'];

function compareBids(a, b) {
    //return a.priority - b.priority;
    var tAnswer = event_order.indexOf(a.event) - event_order.indexOf(b.event);
    return tAnswer;
}

/**--------------------------------------------------------------------------------------------------------------/
---------------------------------------Event static ordering for bpjs.js - END-----------------------------------
---------------------------------------------------------------------------------------------------------------*/