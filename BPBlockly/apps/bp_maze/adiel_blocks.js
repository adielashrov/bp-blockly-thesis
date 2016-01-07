
//////////////////////////////////////
////////Adiel - Added blocks//////////
//////////////////////////////////////

Blockly.Language.adiel_test = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendTitle("forward_bpthread");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.adiel_test = function() {
  // TODO: Assemble JavaScript into code variable.
  var code = 'testing 1'
  alert(code);
  //return code;
};

/*
Blockly.Language.bp_forward_bthread = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("bp_forward_bthread");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript.bp_forward_bthread = function() {
  
  	//Bpsync generated code - creating a forward request
	var req = '[(' + 'forward' + ')]';
	var wait = '[]';
	var block ='[]';

	//JavaScript for bSync - code
	var block = 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
	
	//Bthread generated code
	//var funcName = this.getTitleValue('NAME');
	var funcName = "forward_bthread";
	var param = Blockly.JavaScript.valueToCode(this, 'PARAM', Blockly.JavaScript.ORDER_ATOMIC);
	var param = 0;
	//var block = Blockly.JavaScript.statementToCode(this, 'BLOCK');

	var code = 'bp.addBThread(\'' + funcName + '\', priority++, function() {' + block + '});';
	return code;
	
	//Generated code we wish to achieve
	//bp.addBThread('b-thread', priority++, function() {  yield({request:[('forward')], wait:[], block:[]});});
	//TODO: Assemble JavaScript into code variable.Assemble this code, don't leave it like this.
	//var code = '...'
	//return code;
};
*/