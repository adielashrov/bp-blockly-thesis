/*
$(document).ready(function() {
    $.get('examples/bricks_version_1.xml', 
		function(data) {
			var xmlDoc = $.parseXML(data); 
		}, 'text');

});


$("#selectExample").change(function() {
	var tfileNameIndex = $('#selectExample').val();
	var tfileName = "";
	var tPath = "examples/";
	switch(tfileNameIndex)
	{
	case "1"://Ignore base case
		break;
	case "2"://2 - addHotCold.xml
		tfileName = tPath + "addHotCold.xml";
		break;
	case "3"://3 - nullification.xml
		tfileName = tPath + "nullification.xml";
		break;
	case "4"://4 - TicTacToe.xml
		tfileName = tPath + "TicTacToe.xml";
		break;
	}
	if(tfileName != "")
	{
		var x = $.get(tfileName,
			function(data,status){
				if(typeof data === 'object')
				{
					//var xml = Blockly.Xml.textToDom(data.result);
					loadSelection(xml);
				}
		});
	}
});

var loadDefaultBricksProject = function() {
	var tfileName = "";
	var tPath = "examples/";
	if(tVersion == "1") {
		tfileName = tPath + "bricks_version_1.xml";
	}
	else if(tVersion == "2") {
		tfileName = tPath + "bricks_version_2.xml";
	}
	else{
		tVersion = "1";
		tfileName = tPath + "bricks_version_1.xml";
	}
	if(tfileName != "")
	{
		var x = $.get(tfileName,
			function(data,status){
				if(typeof data === 'object')
				{
					loadSelection(data);
				}
		});
	}
};

var setTasksTabContent = function() {

};
*/