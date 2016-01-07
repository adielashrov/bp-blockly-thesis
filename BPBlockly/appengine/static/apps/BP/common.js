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

document.write(codepage.start({}, null,
    {MSG: MSG, frameSrc: frameSrc.join('&')}));

/**
 * List of tab names.
 * @private
 */
var TABS_ = ['blocks', 'javascript', 'html', 'xml','project_blocks'];

var selected = 'blocks';

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
  }
}

function getProjectBlocksText() {
	var textarea_project_blocks = document.getElementById('textarea_project_blocks');
	var text = textarea_project_blocks.value;
	
	return text;
}


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
      window.setTimeout(BlocklyStorage.restoreBlocks, 0);
    }
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload();
  } else {
    document.getElementById('linkButton').className = 'disabled';
  }

  tabClick('tab_' + selected);
  
  // Init load event.
  var loadInput = document.getElementById('load');
  loadInput.addEventListener('change', load, false);
  document.getElementById('fakeload').onclick = function() {
    loadInput.click();
  };
  
  //textarea_project_blocks = document.getElementById('textarea_project_blocks');
}


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

var suffixHtml="\
<!-- ******** Beggining of fixed code ************************ -->\
<script type=\"text/javascript;version=1.7\" src=\"../lib/BPJS/lib/jquery-1.7.2.min.js\"></script>\
<script type=\"text/javascript;version=1.7\">\
function mapper() {\
    while (true) {\
        yield({ wait: [function(x) {return true;}] });\
      var x = $.find('[when_'+bp.lastEvent+']');\
\
		for( var i=0; i<x.length; i++ ) {\
			var command = x[i].getAttribute('when_'+bp.lastEvent);\
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
}\
bp.addBThread('logger', priority++, logger);\
\
setTimeout('bp.event(\"start\")',10);\
\
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

	try { pwindow.close(); } catch(err) {}
	
	//pwindow = window.open("", "Application", "width=100%,height=100%,status=1,toolbar=1");
	pwindow = window.open("", "Application", "status=1,toolbar=1");
	

	pwindow.document.write('<div class="stage"> <script type="text/javascript;version=1.7" src="../lib/BPJS/bp.js"></script> <script>bp = new BProgram(); priority=0;</script>'+htmlText+suffixHtml+'<script type="text/javascript;version=1.7">'+code+'</script></div>');
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
	  
	  if(block.isParametricBT) {
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

  code = code.join('\n');  // Blank line between each section.
  
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

  // Gera  
  var htmlTextarea = document.getElementById('textarea_html');
  var htmlText = htmlTextarea.value;
  
  var element = document.createElement('htmlText');  
  element.innerHTML = "//<!--" +  htmlText + "//-->";
  xml.appendChild(element);
  //--------
  
  //BP - save project Blocks
  var projectBlocksTextarea = document.getElementById('textarea_project_blocks');
  var projectBlocksText = projectBlocksTextarea.value;
  
  var element2 = document.createElement('projectBlocks');  
  element2.innerHTML = "//<!--" +  projectBlocksText + "//-->";
  xml.appendChild(element2);
  //-------------------------------
  
  var data = Blockly.Xml.domToText(xml);

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
      } catch (e) {
        alert('Error parsing XML:\n' + e);
        return;
      }
	  
		
	  // Gera - html content---------------------
      var htmlTextarea = document.getElementById('textarea_html');
	  var htmlTxt = xml.getElementsByTagName('htmltext');//Returns a collection , we are intrested in the first index
	  if(typeof htmlTxt[0].innerHTML != 'undefined')
	  {
		htmlTextarea.value = htmlTxt[0].innerHTML.substring(6,htmlTxt[0].innerHTML.length-5);
	  }
	  else
	  {
		alert("HTML block inside XML is not defined!");
	  }
	  //--------------------------
	  
	  //Adiel - project defined blocks-------------------------
	  var projectBlocksTextarea = document.getElementById('textarea_project_blocks');
      var projectBlocksText = xml.getElementsByTagName('projectblocks');
	  if(typeof projectBlocksText[0].innerHTML != 'undefined')
	  {
		projectBlocksTextarea.value = projectBlocksText[0].innerHTML.substring(6,projectBlocksText[0].innerHTML.length-5);
	  }
	  else
	  {
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
	  //-----------------------------------------------------------------------
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
  };
  reader.readAsText(files[0]);
};

/**
 * Load blocks from local file - duplicate code, TODO: Refactor
 */
function loadSelection(tfileContentXML) {
	
    if (tfileContentXML != null) {
      var xml = tfileContentXML;
	  
	  // Gera - html content---------------------
      var htmlTextarea = document.getElementById('textarea_html');
	  var htmlTxt = xml.getElementsByTagName('htmltext');//Returns a collection , we are intrested in the first index
	  if(typeof htmlTxt[0].innerHTML != 'undefined')
	  {
		htmlTextarea.value = htmlTxt[0].innerHTML.substring(6,htmlTxt[0].innerHTML.length-5);
	  }
	  else
	  {
		alert("HTML block inside XML is not defined!");
	  }
	  //--------------------------
	  
	  //Adiel - project defined blocks-------------------------
	  var projectBlocksTextarea = document.getElementById('textarea_project_blocks');
      var projectBlocksText = xml.getElementsByTagName('projectblocks');
	  if(typeof projectBlocksText[0].innerHTML != 'undefined')
	  {
		projectBlocksTextarea.value = projectBlocksText[0].innerHTML.substring(6,projectBlocksText[0].innerHTML.length-5);
	  }
	  else
	  {
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
	  var tBlocksXML = xml.firstChild;
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tBlocksXML);
	  //-----------------------------------------------------------------------
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
};

var counterOfDebug = 0;

function showDebugTabs()
{
	//alert("Got here");
	var tabXML;
	var tabXMLBorder;
	var tabHTML;
	var tabHTMLBorder;
	if(counterOfDebug  == 0)
	{
		tabXML = document.getElementById("tab_xml");
		tabXML.style.display = "table-cell";
		tabXMLBorder = document.getElementById("tab_xml_border");
		tabXMLBorder.style.display = "table-cell";
		tabHTML = document.getElementById("tab_javascript");
		tabHTML.style.display = "table-cell";
		var tabHTMLBorder = document.getElementById("tab_javascript_border");
		tabHTMLBorder.style.display = "table-cell";
		counterOfDebug++;
	}
	else
	{
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




