//$(document).ready(function(){  
    //alert("Got in here");
	//$("#loadFilesDiv").load("examples/addHotCold.xml");
//});
$( "#selectExample").change(function() {
	//alert( "Handler for .change() called." );
	//alert($('#selectExample').val());//Extract index.
	//$('#selectExample option:selected').text()// Extract option selected.
	var tfileNameIndex = $('#selectExample').val();
	var tfileName = "";
	var tPath = "examples/";
	switch(tfileNameIndex)
	{
	case "1"://Igonre base case
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
					loadSelection(data);
				}
		});
	}
});