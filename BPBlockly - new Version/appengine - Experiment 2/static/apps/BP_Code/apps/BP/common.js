/**
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview JavaScript for Blockly code demo (langaue-neutral).
 * @author fraser@google.com (Neil Fraser)
 */
document.write(codepage.start({}, null, {
    MSG: MSG,
    frameSrc: frameSrc.join('&')
}));

/**
 * List of tab names.
 * @private
 */
var TABS_ = ['blocks', 'javascript', 'html', 'xml', 'project_blocks','tasks'];

var selected = 'blocks';


/**
 * BP Vars
 */
//var tVersionController = new versionControllerBP_Code();//Will it work? High was chosen arbitrary
var tVersionControllerCode = new versionControllerCode();
var _logger = new Logger();

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} id ID of tab clicked.
 */
function tabClick(id) {
    // If the XML tab was open, save and render the content.
    if (document.getElementById('tab_xml').className == 'tabon') {
        var xmlTextarea = document.getElementById('textarea_xml');
        var xmlText = xmlTextarea.value;
        var xmlDom = null;
        try {
            xmlDom = Blockly.Xml.textToDom(xmlText);
        } catch (e) {
            var q =
                window.confirm(MSG.badXml.replace('%1', e));
            if (!q) {
                // Leave the user on the XML tab.
                return;
            }
        }
        if (xmlDom) {
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDom);
        }
    }

    // Deselect all tabs and hide all panes.
    for (var x in TABS_) {
        document.getElementById('tab_' + TABS_[x]).className = 'taboff';
        document.getElementById('content_' + TABS_[x]).style.display = 'none';
    }

    // Select the active tab.
    selected = id.replace('tab_', '');
    document.getElementById(id).className = 'tabon';
    // Show the selected pane.
    var content = document.getElementById('content_' + selected);
    content.style.display = 'block';
    renderContent();
}

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
function renderContent() {
    var content = document.getElementById('content_' + selected);
    // Initialize the pane.
    if (content.id == 'content_blocks') {
        // If the workspace was changed by the XML tab, Firefox will have performed
        // an incomplete rendering due to Blockly being invisible.  Rerender.
        Blockly.mainWorkspace.render();
    } else if (content.id == 'content_xml') {
        var xmlTextarea = document.getElementById('textarea_xml');
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        xmlTextarea.value = xmlText;
        xmlTextarea.focus();
    } else if (content.id == 'content_javascript') {
        content.innerHTML = prettyPrintOne(workspaceToCode('JavaScript'));
    } else if (content.id == 'content_tasks') { //Handle content_tasks id selected.
        //TODO: Focus?
    }
}

function getProjectBlocksText() {
    var textarea_project_blocks = document.getElementById('textarea_project_blocks');
    var text = textarea_project_blocks.value;
    return text;
};

/**
 * Initialize Blockly.  Called on page load.
 * @param {!Blockly} blockly Instance of Blockly from iframe.
 */
function init(blockly) {
    window.Blockly = blockly;

    // Add to reserved word list: Local variables in execution evironment (runJS)
    // and the infinite loop detection function.
    Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

    // Make the 'Blocks' tab line up with the toolbox.
    if (Blockly.Toolbox) {
        window.setTimeout(function() {
            document.getElementById('tab_blocks').style.minWidth =
                (Blockly.Toolbox.width - 38) + 'px';
            // Account for the 19 pixel margin and on each side.
        }, 1);
    }

    if ('BlocklyStorage' in window) {
        // An href with #key trigers an AJAX call to retrieve saved blocks.
        if (window.location.hash.length > 1) {
            BlocklyStorage.retrieveXml(window.location.hash.substring(1));
        } else {
            // Restore saved blocks in a separate thread so that subsequent
            // initialization is not affected from a failed load.
            //window.setTimeout(BlocklyStorage.restoreBlocks, 0);
        }
        // Hook a save function onto unload.
        BlocklyStorage.backupOnUnload();
    } else {
        //Commented link button for now.
        //document.getElementById('linkButton').className = 'disabled';
    }

    tabClick('tab_' + selected);

    // Init load event.
    //BP - Commented out for now.
    /*
    var loadInput = document.getElementById('load');
    loadInput.addEventListener('change', load, false);
    document.getElementById('fakeload').onclick = function() {
        loadInput.click();
    };
    */

	//Default project initialize.
    tVersionControllerCode.initProject();
    loadSelection();
	
	//Attaching an onChange listener to produce automatic save of workspace.
	Blockly.addChangeListener(tVersionControllerCode.backUpWorkspaceBlocks);
    //var tTargetResult = JSON.parse(jsonStringProject);
    //var xml = Blockly.Xml.textToDom(objectJSONString);
    //loadSelection(xml);
	_logger.initLoggerForCode();
	_logger.logMsg(1 ,"Started the BP Code challenge");


    //Adding tasks tab content 
    //TODO: Extract to method and remove.
    var iframeElem = document.createElement("iframe");
    iframeElem.src = "tasks.html";
    iframeElem.style.height = "875px";
    document.getElementById("content_tasks").appendChild(iframeElem);
    
    //TODO:Extract to method
    //Adding a method to reset the workspace to it's initial state.
    document.getElementById("resetButton").onclick = function() {
        tVersionControllerCode.keyUpListener();
        loadSelection();
    };

    /*
    Adiel - Removed the introdcution video becuase it is in Hebrew - for the ICSE 2016 paper submission
    tVersionControllerCode.showIntroductionVideo();
    document.getElementById("introButton").onclick = function(){
        tVersionControllerCode.clickedShowIntroductionVideo();       
    }
    tVersionControllerCode.testPostRequest2();
    */
    document.getElementById("introButton").style.display = "none";
};


/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
//Timeout is here
/**
function runJS() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG.timeout;
    }
  };
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(MSG.badCode.replace('%1', e));
  }
}
**/


/**
 * Discard all blocks from the workspace.
 */
function discard() {
    var count = Blockly.mainWorkspace.getAllBlocks().length;
    if (count < 2 ||
        window.confirm(MSG.discard.replace('%1', count))) {
        Blockly.mainWorkspace.clear();
        window.location.hash = '';
    }

    //Adiel - added code
    document.getElementById('textarea_project_blocks').value = "";
}
/*
Logger code - currently commented out.
function logger() {\
  while(true){\
 	yield({wait: [function(x){return true;}]});\
    	\\console.log(bp.lastEvent);\
  }\
};\
bp.addBThread('logger', priority++, logger);\
\
*/
var suffixHtml = "\
<!-- ******** Beginning of fixed code ************************ -->\
<!--<script type=\"text/javascript;version=1.7\" src=\"../lib/BPJS/lib/jquery-1.7.2.min.js\"></script> -->\
<script type=\"text/javascript\" src=\"http://code.jquery.com/jquery-latest.min.js\"></script>\
<script type=\"text/javascript;version=1.7\">\
function mapper() {\
    while (true) {\
        yield({ wait: [function(x) {return true;}] });\
		var lastEventNoSpaces = bp.lastEvent.replace(/\\s+/g, '_');\
		var x = $.find('[when_' + lastEventNoSpaces + ']');\
		\
		for( var i=0; i<x.length; i++ ) {\
			var command = x[i].getAttribute('when_'+lastEventNoSpaces);\
			with(x[i]) {eval(command)};\
		}\
    }\
}\
bp.addBThread('mapper', priority++, mapper);\
\
function logger() {\
  while(true){\
 	yield({wait: [function(x){return true;}]});\
    	console.log(bp.lastEvent);\
  }\
};\
bp.addBThread('logger', priority++, logger);\
\
setTimeout('bp.event(\"start\")',10);\
\
\/*TODO: Duplicate code , same in bpblocks.js of the MazeBP.*/\
function findEvent(array, event) {\
    var tAnswer = 0;\
    if (typeof array == 'string') {\
        if (array.indexOf(event) != -1) {\
            tAnswer = 1;\
        }\
    } else if (array instanceof Array) {\
        for (var i = 0; i < array.length; i++) {\
            if (array[i] != null) {\
                if (array[i].indexOf(event) != -1) {\
                    tAnswer = 1;\
                }\
            }\
        }\
    }\
    return tAnswer;\
};\
</script>\
<!-- ******** End of fixed code ************************ -->	\
";

/**
 * Execute the user's code.  Heaven help us...
 */
function runJS() {
    Blockly.updateCustomBlocksDef(getProjectBlocksText());


    var code = workspaceToCode('JavaScript');

    var i = 0;
    var htmlTextarea = document.getElementById('textarea_html');
    var htmlText = htmlTextarea.value;

    try {
        pwindow.close();
    } catch (err) {}

    //pwindow = window.open("", "Application", "width=100%,height=100%,status=1,toolbar=1");
    pwindow = window.open("", "Application", "status=1,toolbar=1");


    pwindow.document.write('<div class="stage"> <script type="text/javascript;version=1.7" src="../lib/BPJS/bp.js"></script> <script>bp = new BProgram(); priority=0;</script>' + htmlText + suffixHtml + '<script type="text/javascript;version=1.7">' + code + '</script></div>');
    pwindow.focus();
}

//BP workspaceToCode function
function workspaceToCode(name) {
    var code = [];
    var generator = Blockly.Generator.get(name);

    generator.init();
    var blocks = Blockly.mainWorkspace.getTopBlocks(true);

    for (var x = 0, block; block = blocks[x]; x++) {
        Blockly.JavaScript.bp_reset_breakupon();

        var line = generator.blockToCode(block);
        if (line instanceof Array) {
            // Value blocks return tuples of code and operator order.
            // Top-level blocks don't care about operator order.
            line = line[0];
        }
        if (line) {
            if (block.outputConnection && generator.scrubNakedValue) {
                // This block is a naked value.  Ask the language's code generator if
                // it wants to append a semicolon, or something.
                line = generator.scrubNakedValue(line);
            }

            if (block.isParametricBT) {
                code.push(line);
            } else {
                code.push("bp.addBThread('', priority++, function() {"); // Priority based
                //code.push("bp.addBThread('', 100, function() {"); // Round Robin
                code.push("var blocked_events = [];");
                code.push("var breakupon_events = [];");
                code.push(line);
                code.push("\n});");
            }

        }
    }

    code = code.join('\n'); // Blank line between each section.

    //Added code - BP - commented this part out var definitions are inline now

    code = generator.finish(code);

    // Final scrubbing of whitespace.
    code = code.replace(/^\s+\n/, '');
    code = code.replace(/\n\s+$/, '\n');
    code = code.replace(/[ \t]+\n/g, '\n');
    return code;
};

//////////////////////////////Added code - save and load///////////////////////////

/**
 * Save blocks to local file.
 */
function save() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    xml.innerHTML = xml.innerHTML.replace(/"/g,'\"');//Escaping " with /"
    xml.innerHTML = xml.innerHTML.replace(/\'/g,"\\'");//Escaping " with /"
    console.log(xml.innerHTML);

    // Gera  
    var htmlTextarea = document.getElementById('textarea_html');
    var htmlText = htmlTextarea.value;

    var element = document.createElement('htmlText');
    element.innerHTML = "//<!--" + htmlText + "//-->";
    xml.appendChild(element);
    //--------

    //BP - save project Blocks
    var projectBlocksTextarea = document.getElementById('textarea_project_blocks');
    var projectBlocksText = projectBlocksTextarea.value;

    var element2 = document.createElement('projectBlocks');
    element2.innerHTML = "//<!--" + projectBlocksText + "//-->";
    xml.appendChild(element2);
    //-------------------------------

    var data = Blockly.Xml.domToText(xml);
    console.log(data);

    // Store data in blob.
    var builder = new BlobBuilder();
    builder.append(data);
    saveAs(builder.getBlob('text/plain;charset=utf-8'), 'block.xml');
};


/**
 * Load blocks from local file.
 */
function load(event) {

    var files = event.target.files;
    // Only allow uploading one file.
    if (files.length != 1) {
        return;
    }

    // FileReader
    var reader = new FileReader();
    reader.onloadend = function(event) {
        var target = event.target;
        // 2 == FileReader.DONE
        if (target.readyState == 2) {
            try {
                var xml = Blockly.Xml.textToDom(target.result);
                //localStorage.setItem('xml' , JSON.stringify(target.result)); 
            } catch (e) {
                alert('Error parsing XML:\n' + e);
                return;
            }


            // Gera - html content---------------------
            var htmlTextarea = document.getElementById('textarea_html');
            var htmlTxt = xml.getElementsByTagName('htmltext'); //Returns a collection , we are intrested in the first index
            if (typeof htmlTxt[0].innerHTML != 'undefined') {
                htmlTextarea.value = htmlTxt[0].innerHTML.substring(6, htmlTxt[0].innerHTML.length - 5);
                /* HTML Tab content into string
				console.log("Project html tab content(string): ");
                console.log(JSON.stringify(htmlTextarea.value));
				*/
            } else {
                alert("HTML block inside XML is not defined!");
            }
            //--------------------------

            //Adiel - project defined blocks-------------------------
            var projectBlocksTextarea = document.getElementById('textarea_project_blocks');
            var projectBlocksText = xml.getElementsByTagName('projectblocks');
            if (typeof projectBlocksText[0].innerHTML != 'undefined') {
                projectBlocksTextarea.value = projectBlocksText[0].innerHTML.substring(6, projectBlocksText[0].innerHTML.length - 5);
                /* Project blocks into string
				console.log("Project custom blocks(string): ");
                console.log(JSON.stringify(projectBlocksTextarea.value));
				*/
            } else {
                alert("Project blocks inside XML are not defined!");
            }
            //-------------------------------------------------------

            //Eval project blocks so we can use them
            Blockly.updateCustomBlocksDef(projectBlocksTextarea.value);

            //Taking Blocks data and displaying it on the pallete----------------
            var count = Blockly.mainWorkspace.getAllBlocks().length;
            if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
                Blockly.mainWorkspace.clear();
            }

            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);

            /* Documenting the workspace as XML blocks (saving)
			console.log("Project workspace blocks(string): ");
            console.log(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)));
            */
        }
        // Reset value of input after loading because Chrome will not fire
        // a 'change' event if the same file is loaded again.
        document.getElementById('load').value = '';
    };
    reader.readAsText(files[0]);
};


/**
 * Load blocks from local file - duplicate code, TODO: Delete later
 */
function loadSelection(tfileContentXML) {

    if (tfileContentXML != null) {
        var xml = tfileContentXML;

        // Gera - html content---------------------
        var htmlTextarea = document.getElementById('textarea_html');
        var htmlTxt = xml.getElementsByTagName('htmltext'); //Returns a collection , we are intrested in the first index
        if (typeof htmlTxt[0].innerHTML != 'undefined') {
            htmlTextarea.value = htmlTxt[0].innerHTML.substring(6, htmlTxt[0].innerHTML.length - 5);
        } else {
            alert("HTML block inside XML is not defined!");
        }
        //--------------------------

        //Adiel - project defined blocks-------------------------
        var projectBlocksTextarea = document.getElementById('textarea_project_blocks');
        var projectBlocksText = xml.getElementsByTagName('projectblocks');
        if (typeof projectBlocksText[0].innerHTML != 'undefined') {
            projectBlocksTextarea.value = projectBlocksText[0].innerHTML.substring(6, projectBlocksText[0].innerHTML.length - 5);
        } else {
            alert("Project blocks inside XML are not defined!");
        }
        //-------------------------------------------------------

        //Eval project blocks so we can use them
        Blockly.updateCustomBlocksDef(projectBlocksTextarea.value);

        //Taking Blocks data and displaying it on the pallet----------------
        var count = Blockly.mainWorkspace.getAllBlocks().length;
        if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
            Blockly.mainWorkspace.clear();
        }
        var tBlocksXML = xml.firstChild;
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tBlocksXML);
        //-----------------------------------------------------------------------
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
};

/**
 * Load blocks from versionControllerCode object.
 *  - duplicate code, TODO: Re factor
 */
function loadSelection() {

    if (tVersionControllerCode != null) {
        //var xml = tfileContentXML;

        // Gera - html content---------------------
        var htmlTextarea = document.getElementById('textarea_html');
        //var htmlTxt = xml.getElementsByTagName('htmltext');//Returns a collection , we are intrested in the first index
        //var htmlTxt = tVersionControllerCode.decodeHTML(tVersionControllerCode.project.html_text);
        var htmlTxt = tVersionControllerCode.project.html_text;
        //htmlTxt = JSON.parse(htmlTxt);
        if (typeof htmlTxt /*[0].innerHTML*/ != 'undefined') {
            //htmlTextarea.value = html_beautify(htmlTxt);
            htmlTextarea.value = htmlTxt;
            //htmlTextarea.value = htmlTxt[0].innerHTML.substring(6,htmlTxt[0].innerHTML.length-5);
        } else {
            alert("HTML block inside XML is not defined!");
        }

        //Adiel - project defined blocks-------------------------
        var projectBlocksTextarea = document.getElementById('textarea_project_blocks');
        //var projectBlocksText = xml.getElementsByTagName('projectblocks');
        var projectBlocksText = tVersionControllerCode.project.project_blocks;
        //projectBlocksText = JSON.parse(projectBlocksText);
        if (typeof projectBlocksText /*[0].innerHTML*/ != 'undefined') {
            projectBlocksTextarea.value = js_beautify(projectBlocksText);
            //projectBlocksTextarea.value = projectBlocksText[0].innerHTML.substring(6,projectBlocksText[0].innerHTML.length-5);
        } else {
            alert("Project blocks inside XML are not defined!");
        }
        //-------------------------------------------------------

        //Eval project blocks so we can use them
        Blockly.updateCustomBlocksDef(projectBlocksTextarea.value);
		
		

        //Taking Blocks data and displaying it on the pallet----------------
        var count = Blockly.mainWorkspace.getAllBlocks().length;
        if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
            Blockly.mainWorkspace.clear();
        }
        
        //var tBlocksXML = Blockly.Xml.textToDom(tVersionControllerCode.project.blocks);
        //@Pre: is the workspace key in localStorge is initialized
        //TODO: Check if this should like this, not safe TODO.
        
        //TODO: This code should not be here, think of refactoring this.
        var tBlocksAsText = window.localStorage.getItem("workspace");
        var tBlocksAsTextArray = tBlocksAsText.split("<&>");
        if(tBlocksAsTextArray.length > 1) {
            tBlocksAsText = tBlocksAsTextArray[tBlocksAsTextArray.length - 1];
        }
        var tBlocksXML = Blockly.Xml.textToDom(tBlocksAsText);
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tBlocksXML);
        //-----------------------------------------------------------------------
		var tCoordinates = tVersionControllerCode.getScrollBarCoordinates();
		Blockly.mainWorkspace.scrollbar.set(tCoordinates[0],tCoordinates[1]);
		//----------------------------------------------------------
		return;
        //----------TODO Stopped here.----------------------------------

    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
};

var counterOfDebug = 0;

function showDebugTabs() {
    //alert("Got here");
    var tabXML;
    var tabXMLBorder;
    var tabHTML;
    var tabHTMLBorder;
    if (counterOfDebug == 0) {
		tabHTML = document.getElementById("tab_html");
        tabHTML.style.display = "table-cell";
		tabHTMLBorder = document.getElementById("tab_html_border");
        tabHTMLBorder.style.display = "table-cell";
		tabProjectBlocks = document.getElementById("tab_project_blocks");
        tabProjectBlocks.style.display = "table-cell";
		tabProjectBlocksBorder = document.getElementById("tab_project_blocks_border");
        tabProjectBlocksBorder.style.display = "table-cell";
		tabXML = document.getElementById("tab_xml");
        tabXML.style.display = "table-cell";
        tabXMLBorder = document.getElementById("tab_xml_border");
        tabXMLBorder.style.display = "table-cell";
        tabHTML = document.getElementById("tab_javascript");
        tabHTML.style.display = "table-cell";
        var tabHTMLBorder = document.getElementById("tab_javascript_border");
        tabHTMLBorder.style.display = "table-cell";
        counterOfDebug++;
    } else {
		tabHTML = document.getElementById("tab_html");
        tabHTML.style.display = "none";
		tabHTMLBorder = document.getElementById("tab_html_border");
        tabHTMLBorder.style.display = "none";
		tabProjectBlocks = document.getElementById("tab_project_blocks");
        tabProjectBlocks.style.display = "none";
		tabProjectBlocksBorder = document.getElementById("tab_project_blocks_border");
        tabProjectBlocksBorder.style.display = "none";
        tabXML = document.getElementById("tab_xml");
        tabXML.style.display = "none";
        tabXMLBorder = document.getElementById("tab_xml_border");
        tabXMLBorder.style.display = "none";
        tabHTML = document.getElementById("tab_javascript");
        tabHTML.style.display = "none";
        tabHTMLBorder = document.getElementById("tab_javascript_border");
        tabHTMLBorder.style.display = "none";
        counterOfDebug--;
    }
}