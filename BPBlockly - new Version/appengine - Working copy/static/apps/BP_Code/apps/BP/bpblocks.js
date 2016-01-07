// Extensions to Blockly's language and JavaScript generator.
// Define Language and JavaScript, in case this file is loaded too early.
//TODO: Adiel , how to fix this undefinded refernce error
/*
if (!Blockly.Language) {
  Blockly.Language = {};
}
*/

var nesting_counter = 0;

Blockly.JavaScript = Blockly.Generator.get('JavaScript');

Blockly.Language.bp_bsync = {
    helpUrl: '../../../../blocks_API/bSync.html',
    init: function() {
        this.setColour(290);
        this.appendDummyInput()
            .appendTitle("bSync");
        this.appendValueInput("REQUEST")
            .setCheck(['event', Array])
            .appendTitle("request=");
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


//TODO: Adjust this code to fit the new blocking scheme.
Blockly.JavaScript.bp_bsync = function() {
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

    var code = bSyncHelper(req, wait, block);
    return code;
};

//Function which code generates bSync based on events.
bSyncHelper = function(req, wait, block) {
    var code = "";
    //TODO: Test transformation is good, old version is first line.
    //code += 'yield({request: ' + req + ', wait: breakupon_events.concat(' + wait + '), block: ' + block + '.concat.apply([],blocked_events)});\n';
    code += 'yield({request: ' + req + ', wait: breakupon_events.concat(' + wait + '), block: [].concat.apply(' + block + ',blocked_events)});\n';
    for (var i = 0; i < nesting_counter; i++) { //TODO: Check if == for last event is enough, or we should use findEvent from the maze.js
        code += 'if((breakupon_events[' + i + '] == bp.lastEvent) && (' + req + '.indexOf(bp.lastEvent)==-1) && (' + wait + '.indexOf(bp.lastEvent)==-1)) { break level_' + (i + 1) + ';\n\}';
    }
    return code;
}

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

    if (param) {
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
            .appendTitle(new Blockly.FieldDropdown([
                ["forward", "forward"],
                ["backward", "backward"],
                ["", ""]
            ]), "DIRECTIONS");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.JavaScript.bp_move = function() {
    var dropdown_directions = this.getTitleValue('DIRECTIONS');
    //Bpsync generated code - creating a forward request
    var req = '[(' + '"' + dropdown_directions + '"' + ')]';
    var wait = '[]';
    var block = '[]';

    //JavaScript for bSync - code
    return 'yield({request:' + req + ', wait:' + wait + ', block:' + block + '});\n';
};

Blockly.Language.bp_turn = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(290);
        this.appendDummyInput()
            .appendTitle("turn")
            .appendTitle(new Blockly.FieldDropdown([
                ["left", "left"],
                ["right", "right"],
                ["randomly", "random"]
            ]), "DIRECTIONS");
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
    var block = '[]';

    if (dropdown_name == 'random') {
        if (Math.random() < 0.5) {
            req = '[(' + '"left"' + ')]';
        } else {
            req = '[(' + '"right"' + ')]';
        }
    } else {
        req = '[(' + '"' + dropdown_name + '"' + ')]';
    }

    //JavaScript for bSync - code
    return 'yield({request:' + req + ', wait:' + wait + ', block:' + block + '});\n';
};

//Path Ahead - blocks
/* TODO: Delete if it has no effect on code.
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
*/

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
/////////////////////////////////////BP - Michal's NLP blocks/////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


//BP - Identical to scoped_request. Used scoped_request
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

//BP - Identical to scoped_request. Used scoped_request
Blockly.JavaScript.nlbp_request_new = function() {
    /*
        var req = Blockly.JavaScript.valueToCode(this, 'Event', Blockly.JavaScript.ORDER_ATOMIC) || '[]'; //this.getTitleValue('REQUEST');
        req = '[' + req + ']'; //#TODO: Can I do this better?Gera?
        var wait = '[]';
        var block = '[]';

        // If the parameter is a single event, wrap it with square brackets
        if (req.match(/^\'.*\'/)) req = '[' + req + ']'; //#TODO: Ideas why this is isn't working?Gera?
        if (wait.match(/^\'.*\'/)) wait = '[' + wait + ']';
        if (block.match(/^\'.*\'/)) block = '[' + block + ']';

        // Generate JavaScript for bSync.
        return 'yield({request:' + req + ', wait:' + wait + ', block:' + block + '});';
    	*/
};


//BP - Identical to scoped_wait. Used scoped_wait
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
//BP - Identical to scoped_wait. Used scoped_wait
Blockly.JavaScript.nlbp_wait_new = function() {
    /*
        // Define a procedure with a return value.
        var req = '[]';
        var wait = Blockly.JavaScript.valueToCode(this, 'Event', Blockly.JavaScript.ORDER_ATOMIC) || '[]'; //this.getTitleValue('REQUEST');
        wait = '[' + wait + ']'; //#TODO: Can I do this better?Gera?
        var block = '[]';

        // If the parameter is a single event, wrap it with square brackets
        if (req.match(/^\'.*\'/)) req = '[' + req + ']';
        if (wait.match(/^\'.*\'/)) wait = '[' + wait + ']';
        if (block.match(/^\'.*\'/)) block = '[' + block + ']';

        // Generate JavaScript for bSync.
        return 'yield({request:' + req + ', wait:' + wait + ', block:' + block + '});';
    	*/
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
//Added to pallet - bug here!
Blockly.JavaScript.nlbp_requestblock_new = function() {

    //Extracting requested event
    var req = Blockly.JavaScript.valueToCode(this, 'EventRequest', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _req = this.getInputTargetBlock('EventRequest');

    // Add [..]  when the parameter is a single event
    if (_req && _req.outputConnection.check_ && _req.outputConnection.check_.indexOf('event') != -1) req = '[' + req + ']';

    //Extracting block event
    var block = Blockly.JavaScript.valueToCode(this, 'EventBlock', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _block = this.getInputTargetBlock('EventBlock');

    // Add [..]  when the parameter is a single event
    if (_block && _block.outputConnection.check_ && _block.outputConnection.check_.indexOf('event') != -1) block = '[' + block + ']';

    return bSyncHelper(req, '[]', block);
};

//Added to the BP code
Blockly.Language.nlbp_requestwait_new = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(290);
        this.appendValueInput("REQUEST")
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

//Added to the BP code
Blockly.JavaScript.nlbp_requestwait_new = function() {

    //Extracting requested event
    var req = Blockly.JavaScript.valueToCode(this, 'REQUEST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _req = this.getInputTargetBlock('REQUEST');

    // Add [..]  when the parameter is a single event
    if (_req && _req.outputConnection.check_ && _req.outputConnection.check_.indexOf('event') != -1) req = '[' + req + ']';

    //Extracting wait event
    var wait = Blockly.JavaScript.valueToCode(this, 'WAIT', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _wait = this.getInputTargetBlock('WAIT');

    // Add [..]  when the parameter is a single event
    if (_wait && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1) wait = '[' + wait + ']';

    return bSyncHelper(req, wait, '[]');

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
//Added to the BP Code
Blockly.JavaScript.nlbp_waitandblock_new = function() {

    //Extracting requested event
    var wait = Blockly.JavaScript.valueToCode(this, 'WAIT', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _wait = this.getInputTargetBlock('WAIT');

    // Add [..]  when the parameter is a single event
    if (_wait && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1) wait = '[' + wait + ']';

    //Extracting wait event
    var block = Blockly.JavaScript.valueToCode(this, 'BLOCK', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _block = this.getInputTargetBlock('BLOCK');

    // Add [..]  when the parameter is a single event
    if (_block && _block.outputConnection.check_ && _block.outputConnection.check_.indexOf('event') != -1) block = '[' + block + ']';

    return bSyncHelper('[]', wait, block);
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

    //Extracting requested event
    var wait = Blockly.JavaScript.valueToCode(this, 'WAIT', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _wait = this.getInputTargetBlock('WAIT');

    // Add [..]  when the parameter is a single event
    if (_wait && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1) wait = '[' + wait + ']';

    //Extracting wait event
    var req = Blockly.JavaScript.valueToCode(this, 'REQUEST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';

    // If the parameter is a single event, wrap it with square brackets
    var _req = this.getInputTargetBlock('REQUEST');

    // Add [..]  when the parameter is a single event
    if (_req && _req.outputConnection.check_ && _req.outputConnection.check_.indexOf('event') != -1) req = '[' + req + ']';

    var code = bSyncHelper('[]', wait, '[]');
    code += bSyncHelper(req, '[]', '[]');
    return code;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////-----------Adiel & Michal------End----//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////
//// Gera's experimental scoped blocks//////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
Blockly.JavaScript.bp_reset_breakupon = function() {
    nesting_counter = 0;
}

Blockly.Language.bp_breakupon = {
    helpUrl: '../../../../blocks_API/breakupon.html',
    init: function() {
        this.setColour(350);
        this.appendStatementInput("code");
        this.appendValueInput("events")
            .setCheck(['event'])
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
    code += '} breakupon_events = breakupon_events.slice(0,' + nesting_counter + ');\n';
    code += 'blocked_events = blocked_events.slice(0,' + nesting_counter + ');\n';
    return code;
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

Blockly.Language.bp_dowhileblocking = {
    helpUrl: '../../../../blocks_API/blocking.html',
    init: function() {
        this.setColour(350);
        this.appendValueInput("events")
            //.setCheck(['event'])
            .appendTitle("blocking");
        this.appendStatementInput("code");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.Language.scoped_wait = {

    helpUrl: '../../../../blocks_API/wait_for.html',
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
    var _wait = this.getInputTargetBlock('WAIT-FOR');

    // Add [..]  when the parameter is a single event
    if (_wait && _wait.outputConnection.check_ && _wait.outputConnection.check_.indexOf('event') != -1) wait = '[' + wait + ']';

    return bSyncHelper('[]', wait, '[]');

};


Blockly.Language.scoped_request = {
    helpUrl: '../../../../blocks_API/request.html',
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

    return bSyncHelper(req, '[]', '[]');

};

Blockly.Language.bp_event = {
    helpUrl: '../../../../blocks_API/event_and_text.html',
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
//TODO : add this block to the template.soy file.
Blockly.Language.bp_event_setText = {
    helpUrl: '../../../../blocks_API/set_text.html',
    init: function() {
        this.setColour(290);

        this.appendValueInput("EVENT")
            .appendTitle("Set TextEvent");

        this.setOutput(true, "event");
        this.setTooltip('An option to set the debugging text');
    }
};

Blockly.JavaScript.bp_event_setText = function() {
   
   var srcEvent = Blockly.JavaScript.valueToCode(this, 'EVENT', Blockly.JavaScript.ORDER_ATOMIC);
   srcEvent = srcEvent.substr(srcEvent.indexOf("'") + 1);
   var set_text_str = "('set_text_";
   var flaggedEvent = set_text_str.concat(srcEvent);
   var event = [flaggedEvent, Blockly.JavaScript.ORDER_NONE];
   //console.log(event);
   return event;
};


Blockly.Language.bp_parametrized = {
    //helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendTitle("Instantiate with ")
            .appendTitle('', 'PARAMS');
        this.appendValueInput("VALUES")
            .appendTitle(" in ");
        this.appendStatementInput('STACK');
        this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
        this.setTooltip("tooltip for bp_parametrized");
        this.arguments_ = ['p'];
        this.setInputsInline(true);
    },
    updateParams_: function() {
        // Check for duplicated arguments.
        var badArg = false;
        var hash = {};
        for (var x = 0; x < this.arguments_.length; x++) {
            if (hash['arg_' + this.arguments_[x].toLowerCase()]) {
                badArg = true;
                break;
            }
            hash['arg_' + this.arguments_[x].toLowerCase()] = true;
        }
        if (badArg) {
            this.setWarningText(Blockly.LANG_PROCEDURES_DEF_DUPLICATE_WARNING);
        } else {
            this.setWarningText(null);
        }
        // Merge the arguments into a human-readable list.
        var paramString = this.arguments_.join(', ');
        this.setTitleValue(paramString, 'PARAMS');
    },
    mutationToDom: function() {
        var container = document.createElement('mutation');
        for (var x = 0; x < this.arguments_.length; x++) {
            var parameter = document.createElement('arg');
            parameter.setAttribute('name', this.arguments_[x]);
            container.appendChild(parameter);
        }
        return container;

    },
    domToMutation: function(xmlElement) {
        this.arguments_ = [];
        for (var x = 0, childNode; childNode = xmlElement.childNodes[x]; x++) {
            if (childNode.nodeName.toLowerCase() == 'arg') {
                this.arguments_.push(childNode.getAttribute('name'));
            }
        }
        this.updateParams_();
    },
    decompose: function(workspace) {

        var containerBlock = new Blockly.Block(workspace,
            'procedures_mutatorcontainer');
        containerBlock.initSvg();

        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.arguments_.length; x++) {
            var paramBlock = new Blockly.Block(workspace, 'procedures_mutatorarg');
            paramBlock.initSvg();
            paramBlock.setTitleValue(this.arguments_[x], 'NAME');
            // Store the old location.
            paramBlock.oldLocation = x;
            connection.connect(paramBlock.previousConnection);
            connection = paramBlock.nextConnection;
        }

        // Initialize procedure's callers with blank IDs.
        //Blockly.Procedures.mutateCallers(this.getTitleValue('NAME'),
        //                                 this.workspace, this.arguments_, null);

        return containerBlock;

    },
    compose: function(containerBlock) {

        this.arguments_ = [];
        this.paramIds_ = [];
        var paramBlock = containerBlock.getInputTargetBlock('STACK');
        while (paramBlock) {
            this.arguments_.push(paramBlock.getTitleValue('NAME'));
            this.paramIds_.push(paramBlock.id);
            paramBlock = paramBlock.nextConnection &&
                paramBlock.nextConnection.targetBlock();
        }
        this.updateParams_();
        //Blockly.Procedures.mutateCallers(this.getTitleValue('NAME'),
        //  this.workspace, this.arguments_, this.paramIds_);

    },
    dispose: function() {
        var name = this.getTitleValue('NAME');
        var editable = this.editable;
        var workspace = this.workspace;
        // Call parent's destructor.
        Blockly.Block.prototype.dispose.apply(this, arguments);
        if (editable) {
            // Dispose of any callers.
            //Blockly.Procedures.disposeCallers(name, workspace);
        }
    },
    getVars: function() {
        return this.arguments_;
    },
    renameVar: function(oldName, newName) {
        var change = false;
        for (var x = 0; x < this.arguments_.length; x++) {
            if (Blockly.Names.equals(oldName, this.arguments_[x])) {
                this.arguments_[x] = newName;
                change = true;
            }
        }
        if (change) {
            this.updateParams_();
            // Update the mutator's variables if the mutator is open.
            if (this.mutator.isVisible_()) {
                var blocks = this.mutator.workspace_.getAllBlocks();
                for (var x = 0, block; block = blocks[x]; x++) {
                    if (block.type == 'procedures_mutatorarg' &&
                        Blockly.Names.equals(oldName, block.getTitleValue('NAME'))) {
                        block.setTitleValue(newName, 'NAME');
                    }
                }
            }
        }
    },
    customContextMenu: function(options) {
        // Add options to create getters for each parameter.
        for (var x = 0; x < this.arguments_.length; x++) {
            var option = {
                enabled: true
            };
            var name = this.arguments_[x];
            option.text = Blockly.LANG_VARIABLES_SET_CREATE_GET.replace('%1', name);
            var xmlTitle = goog.dom.createDom('title', null, name);
            xmlTitle.setAttribute('name', 'VAR');
            var xmlBlock = goog.dom.createDom('block', null, xmlTitle);
            xmlBlock.setAttribute('type', 'variables_get');
            option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
            options.push(option);
        }
    },
    //callType_: 'procedures_callnoreturn'
    isParametricBT: true
};

Blockly.JavaScript.bp_parametrized = function() {
    var branch = Blockly.JavaScript.statementToCode(this, 'STACK');
    param = Blockly.JavaScript.valueToCode(this, 'VALUES', Blockly.JavaScript.ORDER_ATOMIC);
    var code = param + '.forEach(function(' + this.arguments_[0] + '){ bp.addBThread(\'parametrize-bt\', 100, function(){ \nvar blocked_events = []; \nvar breakupon_events = [];\n' + branch + '\n})});';

    return code;
};

Blockly.Language.bp_repeat_forever = {

    helpUrl: '../../../../blocks_API/repeat_forever.html',
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

    var code = 'while (true) {\n' + statement + '}';
    //Version 1 - Before yield TODO: Consult with Gera
    /*
	code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
	code += statement + '}\n';
	*/

    //Version 2 - After yield.
    /*
	code += statement;
	code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);}\n";
	*/
    return code;
};

//An attempt to add if_Last_event and if_not_last_event blocks

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
    //code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
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
    helpUrl: '../../../../blocks_API/if_last_event.html',
    init: function() {
        this.setColour(120);
        this.appendValueInput("EVENT")
            .setCheck(['event', 'sensorEvent', Array])//Trying to use Array instead of 'Array'
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
    //code += "BlocklyApps.log.push(['highlight', 'block_id_" + this.id + "']);\n";
    //push an event for highlighting the current block
    if (event_name.length > 0) {
        code += 'if(findEvent(' + event_name + ',bp.lastEvent)) {\n' + statements_statement + '\}';
    } else {
        code += 'if(true) {\n' + statements_statement + '\}';
    }
    return code;
};

Blockly.Language.bp_label = {
  helpUrl: '../../../../blocks_API/label_and_break.html',
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
  helpUrl: '../../../../blocks_API/label_and_break.html',
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



function getProjectBlocksText() {
    var textarea_project_blocks = window.parent.document.getElementById('textarea_project_blocks');
    var text = textarea_project_blocks.value;

    return text;
}


Blockly.updateCustomBlocksDef = function(text) {
    eval(text);

    for (var prop in custom) {
        Blockly.Language[prop] = custom[prop];
    }
}

Blockly.flyoutCategory = function(blocks, gaps, margin, workspace) {
    Blockly.updateCustomBlocksDef(getProjectBlocksText());

    for (var prop in custom) {
        var block = new Blockly.Block(workspace, prop);

        if (block) {
            block.initSvg();
            blocks.push(block);
            gaps.push(margin);
        }

    }
};

Blockly.Flyout.prototype.show = function(xmlList) {
    this.hide();
    var margin = this.CORNER_RADIUS;
    this.svgGroup_.style.display = 'block';

    // Create the blocks to be shown in this flyout.
    var blocks = [];
    var gaps = [];

    if (xmlList == "EVENTS") {
        // Special category for events.
        Blockly.flyoutCategory(blocks, gaps, margin,
            /** @type {!Blockly.Workspace} */
            (this.workspace_));
    } else if (xmlList == Blockly.Variables.NAME_TYPE) {
        // Special category for variables.
        Blockly.Variables.flyoutCategory(blocks, gaps, margin,
            /** @type {!Blockly.Workspace} */
            (this.workspace_));
    } else if (xmlList == Blockly.Procedures.NAME_TYPE) {
        // Special category for procedures.
        Blockly.Procedures.flyoutCategory(blocks, gaps, margin,
            /** @type {!Blockly.Workspace} */
            (this.workspace_));
    } else {
        for (var i = 0, xml; xml = xmlList[i]; i++) {
            if (xml.tagName && xml.tagName.toUpperCase() == 'BLOCK') {
                var block = Blockly.Xml.domToBlock_(
                    /** @type {!Blockly.Workspace} */
                    (this.workspace_), xml);
                blocks.push(block);
                gaps.push(margin * 2);
            }
        }
    }

    // Lay out the blocks vertically.
    var flyoutWidth = 0;
    var cursorY = margin;
    for (var i = 0, block; block = blocks[i]; i++) {
        var allBlocks = block.getDescendants();
        for (var j = 0, child; child = allBlocks[j]; j++) {
            // Mark blocks as being inside a flyout.  This is used to detect and prevent
            // the closure of the flyout if the user right-clicks on such a block.
            child.isInFlyout = true;
            // There is no good way to handle comment bubbles inside the flyout.
            // Blocks shouldn't come with predefined comments, but someone will
            // try this, I'm sure.  Kill the comment.
            Blockly.Comment && child.setCommentText(null);
        }
        block.render();
        var bBox = block.getSvgRoot().getBBox();
        var x = Blockly.RTL ? 0 : margin + Blockly.BlockSvg.TAB_WIDTH;
        block.moveBy(x, cursorY);
        flyoutWidth = Math.max(flyoutWidth, bBox.width);
        cursorY += bBox.height + gaps[i];
        if (!block.disabled) {
            Blockly.bindEvent_(block.getSvgRoot(), 'mousedown', null,
                Blockly.Flyout.createBlockFunc_(this, block));
        }
    }
    flyoutWidth += margin + Blockly.BlockSvg.TAB_WIDTH + margin / 2 +
        Blockly.Scrollbar.scrollbarThickness;

    for (var i = 0, block; block = blocks[i]; i++) {
        if (Blockly.RTL) {
            // With the flyoutWidth known, reposition the blocks to the right-aligned.
            block.moveBy(flyoutWidth - margin - Blockly.BlockSvg.TAB_WIDTH, 0);
        }
        // Create an invisible rectangle over the block to act as a button.  Just
        // using the block as a button is poor, since blocks have holes in them.
        var bBox = block.getSvgRoot().getBBox();
        var xy = block.getRelativeToSurfaceXY();
        var rect = Blockly.createSvgElement('rect', {
            'width': bBox.width,
            'height': bBox.height,
            'x': xy.x + bBox.x,
            'y': xy.y + bBox.y,
            'fill-opacity': 0
        }, null);
        // Add the rectangles under the blocks, so that the blocks' tooltips work.
        this.svgOptions_.insertBefore(rect, this.svgOptions_.firstChild);
        rect.wrapper_ = Blockly.bindEvent_(rect, 'mousedown', null,
            Blockly.Flyout.createBlockFunc_(this, block));
        this.buttons_[i] = rect;
    }
    // Record the width for .getMetrics and .position_.
    this.width_ = flyoutWidth;

    this.filterForCapacity_();

    // Fire a resize event to update the flyout's scrollbar.
    Blockly.fireUiEvent(window, 'resize');
};

/**--------------------------------------------------------------------------------------------------------------/
/*-------------------------------------Event static ordering for bpjs.js - START-------------------------------
-------------------------------------------------------------------------------------------------------------*/
event_order = ['barrier ahead', 'no barrier ahead', 'path left', 'no path left', 'path ahead', 'no path ahead', 'path right', 'no path right', 'turn left', 'turn right', 'backward', 'move forward', 'tick'];
/*
function compareBids(a, b) {
    //return a.priority - b.priority;
    var tAnswer = event_order.indexOf(a.event) - event_order.indexOf(b.event);
    return tAnswer;
};
*/
/**--------------------------------------------------------------------------------------------------------------/
---------------------------------------Event static ordering for bpjs.js - END-----------------------------------
---------------------------------------------------------------------------------------------------------------*/