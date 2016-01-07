/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------Abstract class of version controller------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------*/
/**
* TODO: Change the class name to localStorage Manager.
*/
function versionController() {
	this.storageBitArray = '0,0,0,0,0,0,0,0,0,0,0';
}

//Abstract method, should be implemented inside child.
versionController.prototype.getTemplateDocument = function() { return null;}
//Abstract method, should be implemented inside child.
versionController.prototype.resetLocalStorage = function() { return null;}
//Abstract method, should be implemented inside child.
versionController.prototype.flagLocalStorageInitialized = function() { return null; }

versionController.prototype.isStorageIntialized = function() {return null;}

versionController.prototype.cheat_Level_8 = function() { return null; }

versionController.prototype.cheat_Level_10 = function() {return null; } 

/**
* Backing up workspace changes to the local storage
*/
versionController.prototype.backUpWorkspaceBlocks = function() {
	//Mark that the values in the workspace have changed	
	this.tVersionController.flagLocalStorageInitialized();
	
    //Perhaps check if there is a change between the xml before changing.
    var tXml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);//XML representing the blocks in the workspace
    var tText = Blockly.Xml.domToText(tXml);//Translating this XML to text representation
    var tKey = "Level_" + Maze.LEVEL;
    var current_XML_tree = window.localStorage.getItem(tKey);
	//var current_XML_tree = this.tVersionController[tKey];
	var updated_XML_tree;
	var current_XML_tree_parsed = current_XML_tree.split("<&>");
	//TODO: perhaps we save to much detail, perhaps only save the latest version of workspace??
	if(tText != current_XML_tree_parsed[current_XML_tree_parsed.length - 1])//Check if current workspace is not already backed up.
	{
		updated_XML_tree = current_XML_tree + "<&>" + tText;
		window.localStorage.setItem(tKey, updated_XML_tree);
		//this.tVersionController[tKey] = updated_XML_tree;
	}
};

versionController.prototype.restoreBlocksFromVersionController = function() {
	//var tXmlText = this["Level_" + Maze.LEVEL];
	var tXmlText = window.localStorage.getItem("Level_" + Maze.LEVEL);
	//Extract last XML tree from the local storage.
	var tXmlTrees = tXmlText.split("<&>");
	var tXmlTextLastVersion = tXmlTrees[tXmlTrees.length - 1];
	if (tXmlTextLastVersion != null) {
		var tXml = Blockly.Xml.textToDom(tXmlTextLastVersion);
		// Clear the workspace to avoid merge.
		Blockly.mainWorkspace.clear();
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
	} else {
		console.log("Key value is null" + "Level_" + Maze.LEVEL + ", inside versionController.restoreBlocksFromVersionController");
	}
};

versionController.prototype.prepareLocalStorgae = function(flag) { return null; };

//TODO: Unused code for now, remove
versionController.prototype.resetMembers = function(flag) {
	//Initial values for each workspace.
	this["Level_1"] = window.localStorage.getItem("Level_1");
	this["Level_2"] = window.localStorage.getItem("Level_2");
	this["Level_3"] = window.localStorage.getItem("Level_3");
	this["Level_4"] = window.localStorage.getItem("Level_4");
	this["Level_5"] = window.localStorage.getItem("Level_5");
	this["Level_6"] = window.localStorage.getItem("Level_6");
	this["Level_7"] = window.localStorage.getItem("Level_7");
	this["Level_8"] = window.localStorage.getItem("Level_8");
	this["Level_9"] = window.localStorage.getItem("Level_9");
	this["Level_10"] = window.localStorage.getItem("Level_10");
};

versionController.prototype.dumpDataToLocalStorage = function() { 
	for(var i = 1; i <= 10; i++) {
		var tKey = "Level_" + i;
		if(window.localStorage.getItem(tKey) != this[tKey]) {
			window.localStorage.setItem(tKey, this[tKey]);
		}
	}
};

versionController.prototype.listenToTabSwitch = function() {
	var tabs = document.getElementsByClassName("tab");
	var refThis = this;
	for(var i = 0; i < tabs.length; i++ ) {
		tabs[i].addEventListener('click',
				function() {
					refThis.dumpDataToLocalStorage();
				}
			,false);
	}
};

/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------BP Code versionController  - subclass of versionController------------
-----------------------------------------------------------------------------------------------------------------------*/
// define the sub-class of version
function versionControllerBP_Code() {
    // Call the parent constructor
    versionController.call(this);
	this.prepareLocalStorgae(false);//prepare localStorage anyway.
	
};
//Infrastructure for inheritance.
versionControllerBP_Code.prototype = new versionController();
versionControllerBP_Code.prototype.constructor = versionControllerBP_Code;
versionControllerBP_Code.prototype.parent = versionController.prototype;//How to call parent? this.parent.method.call(this);

/**
* Template document load template.js or template.js
*/
versionControllerBP_Code.prototype.getTemplateDocument = function() {
	return null;
};

/**
* prepare localStorage ,true signals reset local storage no matter if it's initialized or not.
*/
versionControllerBP_Code.prototype.prepareLocalStorgae = function(flag) {
	if(!this.isStorageIntialized() || flag) {
		this.resetLocalStorage();
	}
};

//TODO: Consider removing this method
/**
* 
* True signals reset localStorage anyway
*/
versionControllerBP_Code.prototype.resetMembers = function(flag) {
	return null;
	/*if(!this.isStorageIntialized() || (!(typeof flag === "undefined") && flag)) {
		this.resetLocalStorage();
	}
	this.parent.resetMembers.call(this);
	*/
};

//TODO - Check if this method is being used, if not remove.
versionControllerBP_Code.prototype.flagLocalStorageInitialized = function() { 
	if ('localStorage' in window) {
	//Initialize flag for first time in localStorage
		window.localStorage.setItem("reset", "true");
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
};

//TODO - Check if this method is being used, if not remove.
versionControllerBP_Code.prototype.isStorageIntialized = function() {
	var tAnswer = false;
	if ('localStorage' in window) {
		var tValue = window.localStorage.getItem("reset");
		if( tValue != null) {//Key is defined.
			if(tValue === "true") {
				tAnswer = true;
			}
		}
		else {
			//console.log("'reset' value in localStorage is null");
		}
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
	return tAnswer;
};

versionControllerBP_Code.prototype.resetLocalStorage = function() {
	var tXml = null;
    var tKey = null;
    if ('localStorage' in window) {
        //Initialize flag for first time in localStorage
        //window.localStorage.setItem("reset", "");
		this.flagLocalStorageInitialized();

        //Initialize workspace localStorage
        tXml = "";
        tKey = "workspace";
        window.localStorage.setItem(tKey, tXml);
        
		//Log backup test reset? TODO: Test
		tKey = "logText";
		if (window.localStorage.getItem("logText") == null){//If not defined, define.
			window.localStorage.setItem(tKey, "");
		}
    } else {
        console.log("No LocalStorage, Error resetting localstorage");
    }
};

/**
* Backing up workspace changes to the local storage 
* Duplicate code for backing up BP Code workspace to the local storage.
*/
versionControllerBP_Code.prototype.backUpWorkspaceBlocks = function() {
	//Mark that the values in the workspace have changed	
	this.tVersionController.flagLocalStorageInitialized();
	
    //Perhaps check if there is a change between the xml before changing.
    var tXml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);//XML representing the blocks in the workspace
    var tText = Blockly.Xml.domToText(tXml);//Translating this XML to text representation
    var tKey = "workspace";
    var current_XML_tree = window.localStorage.getItem(tKey);
	//var current_XML_tree = this.tVersionController[tKey];
	var updated_XML_tree;
	var current_XML_tree_parsed = current_XML_tree.split("<&>");
	//TODO: perhaps we save to much detail, perhaps only save the latest version of workspace??
	if(tText != current_XML_tree_parsed[current_XML_tree_parsed.length - 1])//Check if current workspace is not already backed up.
	{
		updated_XML_tree = current_XML_tree + "<&>" + tText;
		window.localStorage.setItem(tKey, updated_XML_tree);
		//this.tVersionController[tKey] = updated_XML_tree;
	}
};

// TODO: Do we use this function?
versionControllerBP_Code.prototype.restoreBlocksFromVersionController = function() {
	//var tXmlText = this["Level_" + Maze.LEVEL];
	var tXmlText = window.localStorage.getItem("workspace");
	//Extract last XML tree from the local storage.
	var tXmlTrees = tXmlText.split("<&>");
	var tXmlTextLastVersion = tXmlTrees[tXmlTrees.length - 1];
	if (tXmlTextLastVersion != null) {
		var tXml = Blockly.Xml.textToDom(tXmlTextLastVersion);
		// Clear the workspace to avoid merge.
		Blockly.mainWorkspace.clear();
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
	} else {
		console.log("Key value is null" + "workspace" + ", inside versionController.restoreBlocksFromVersionController");
	}
};


/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------High level versionController  - subclass of versionController------------
-----------------------------------------------------------------------------------------------------------------------*/
// define the sub-class of version
function versionControllerHigh() {
    // Call the parent constructor
    versionController.call(this);
	this.prepareLocalStorgae(false);
	//this.resetMembers();
	
};
//Infrastructure for inheritance.
versionControllerHigh.prototype = new versionController();
versionControllerHigh.prototype.constructor = versionControllerHigh;
versionControllerHigh.prototype.parent = versionController.prototype;//How to call parent? this.parent.method.call(this);
/**
* Template document load en.js or en2.js
*/
versionControllerHigh.prototype.getTemplateDocument = function() {
	return '<script type="text/javascript" src="generated/en.js"></script>\n';//en.js for now is high level idioms.
};

/**
* prepare localStorage ,true signals reset local storage no matter if it's initialized or not.
*/
versionControllerHigh.prototype.prepareLocalStorgae = function(flag) {
	if(!this.isStorageIntialized() || flag) {
		this.resetLocalStorage();
	}
};

//TODO: Consider removing this method
/**
* 
* True signals reset localStorage anyway
*/
versionControllerHigh.prototype.resetMembers = function(flag) {
	if(!this.isStorageIntialized() || (!(typeof flag === "undefined") && flag)) {
		this.resetLocalStorage();
	}
	this.parent.resetMembers.call(this);
};

//TODO - Check if this method is being used, if not remove.
versionControllerHigh.prototype.flagLocalStorageInitialized = function() { 
	if ('localStorage' in window) {
	//Initialize flag for first time in localStorage
		window.localStorage.setItem("reset", "ver_1");
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
};

//TODO - Check if this method is being used, if not remove.
versionControllerHigh.prototype.isStorageIntialized = function() {
	var tAnswer = false;
	if ('localStorage' in window) {
		var tValue = window.localStorage.getItem("reset");
		if( tValue != null) {//Key is defined.
			if(tValue === "ver_1") {
				tAnswer = true;
			}
		}
		else {
			//console.log("'reset' value in localStorage is null");
		}
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
	return tAnswer;
};

versionControllerHigh.prototype.resetLocalStorage = function() {
	var tXml = null;
    var tKey = null;
    if ('localStorage' in window) {
        //Initialize flag for first time in localStorage
        //window.localStorage.setItem("reset", "");
		this.flagLocalStorageInitialized();

        //Initialize level_1 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="scoped_request" inline="false" x="70" y="70"><value name="REQUEST"><block type="bp_forward"></block></value></block></xml>';
        tKey = "Level_1";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_2 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="scoped_request" inline="false" x="111" y="69"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value></block></next></block></xml>';
        tKey = "Level_2";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_3 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="111" y="69"></block></xml>';
        tKey = "Level_3";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_4 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_4";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_5 localStorage
		tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" disabled="true" x="500" y="58"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false" disabled="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="209" y="81"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        tKey = "Level_5";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_6 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="40"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="400" y="40"><statement name="DO"><block type="scoped_wait" inline="false"><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value></block></next></block></statement></block><block type="bp_repeat_forever" x="630" y="40"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        tKey = "Level_6";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_7 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="42" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="267" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" disabled="true" x="495" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_barrierAhead"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_forward"></block></value><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_barrierAhead"></block></value></block></statement></block></next></block></statement></block><block type="bp_repeat_forever" x="725" y="50"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
		tKey = "Level_7";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_8 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_8";
        window.localStorage.setItem(tKey, tXml);
		
		//Initialize level_9 localStorage		
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="0"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_right"></block></value><statement name="code"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></statement></block></next></block></statement><value name="events"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="550" y="0"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_ahead"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="150" y="285"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_ahead"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="550" y="285"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_ahead"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block></xml>';
		tKey = "Level_9";
        window.localStorage.setItem(tKey, tXml);

		//Initialize level_10 localStorage
		tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="28"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="150" y="133"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="150" y="324"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></xml>';
        tKey = "Level_10";
        window.localStorage.setItem(tKey, tXml);
		
        //Initialize level_help array - only if null! for reset click H.
        //var tBitArray = '0,0,0,0,0,0,0,0,0,0'; //an array of bits for seen help, current number of levels is 8, array is size 9. TODO: refactor this code.
        tKey = "Level_help";//TODO: Rename the name of this variable
        window.localStorage.setItem(tKey, this.storageBitArray);
		
		//Log backup test reset? TODO: Test
		tKey = "logText";
		if (window.localStorage.getItem("logText") == null){//If not defined, define.
			window.localStorage.setItem(tKey, "");
		}
    } else {
        console.log("No LocalStorage, Error resetting localstorage");
    }
};

versionControllerHigh.prototype.cheat_Level_8 = function() { 
	var tXmlText = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="42" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="267" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="495" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_barrierAhead"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_forward"></block></value><statement name="code"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_barrierAhead"></block></value></block></next></block></next></block></next></block></next></block></statement><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="725" y="50"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
	var tXml = Blockly.Xml.textToDom(tXmlText);
	// Clear the workspace to avoid merge.
	Blockly.mainWorkspace.clear();
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
};

versionControllerHigh.prototype.cheat_Level_10 = function() { 
	var tXmlText = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="135" y="28"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="144" y="133"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="BLOCK"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="143" y="324"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></xml>';
	var tXml = Blockly.Xml.textToDom(tXmlText);
	// Clear the workspace to avoid merge.
	Blockly.mainWorkspace.clear();
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
};

/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------Low level idioms versionController  - subclass of versionController-------
-----------------------------------------------------------------------------------------------------------------------*/
// define the sub-class of version
function versionControllerLow() {
    // Call the parent constructor
    versionController.call(this);
	this.prepareLocalStorgae(false);
	//this.resetMembers();//TODO: Remove call here.
};

// inherit versionController
versionControllerLow.prototype = new versionController();
// correct the constructor pointer because it points to msgDisplayParent
versionControllerLow.prototype.constructor = versionControllerLow;
versionControllerLow.prototype.parent = versionController.prototype;

/**
* prepare localStorage ,true signals reset local storage no matter if it's initialized or not.
*/
versionControllerLow.prototype.prepareLocalStorgae = function(flag) {
	if(!this.isStorageIntialized() || flag) {
		this.resetLocalStorage();
	}
};
//TODO: Remove this method
/**
* True signals reset localStorage anyway
*/
versionControllerLow.prototype.resetMembers = function(flag) {
	if(!this.isStorageIntialized() || (!(typeof flag === "undefined") && flag)) {
		this.resetLocalStorage();
	}
	this.parent.resetMembers.call(this);
};

//This method include the compiled file ,en.js, from template.soy (With pallet outline).
versionControllerLow.prototype.getTemplateDocument = function() {
	return '<script type="text/javascript" src="generated/en2.js"></script>\n';//en2.js for now is low level idioms.
}

versionControllerLow.prototype.flagLocalStorageInitialized = function() { 

	if ('localStorage' in window) {
	//Initialize flag for first time in localStorage
		window.localStorage.setItem("reset", "ver_2");//TODO: Change name of this flag perhaps.
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
}
//TODO: Extract code to parent class.
versionControllerLow.prototype.isStorageIntialized = function() {
	var tAnswer = false;
	if ('localStorage' in window) {
		var tValue = window.localStorage.getItem("reset");
		if( tValue != null) {//Key is defined.
			if(tValue === "ver_2") {
				tAnswer = true;
			}
		}
		else {
			//console.log("'reset' value in localStorage is null");
		}
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
	return tAnswer;
}

versionControllerLow.prototype.resetLocalStorage = function() {
var tXml = null;
    var tKey = null;
    if ('localStorage' in window) {
        //Initialize flag for first time in localStorage
        //window.localStorage.setItem("reset", "");
		this.flagLocalStorageInitialized();

        //Initialize level_1 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bsync" inline="true" x="70" y="69"><value name="REQUEST"><block type="bp_forward"></block></value></block></xml>';
        tKey = "Level_1";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_2 localStorage
		tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bsync" inline="true" x="117" y="63"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value></block></next></block></xml>';
        tKey = "Level_2";
		
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_3 localStorage
        tXml = ' <xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="111" y="69"></block></xml>';
        tKey = "Level_3";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_4 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_4";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_5 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="66" y="37"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" disabled="true" x="71" y="254"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="bsync" inline="true" disabled="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></xml>';
		tKey = "Level_5";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_6 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="380" y="-10"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="380" y="169"><statement name="DO"><block type="bsync" inline="true"><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value></block></next></block></statement></block><block type="bp_repeat_forever" x="380" y="352"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        tKey = "Level_6";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_7 localStorage
		tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="40" y="-3"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="544" y="6"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="42" y="180"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" disabled="true" x="41" y="400"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_barrierAhead"></block></value><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_no_barrierAhead"></block></value><value name="BLOCK"><block type="bp_forward"></block></value></block></next></block></statement></block></xml>';
        tKey = "Level_7";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_8 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_8";
        window.localStorage.setItem(tKey, tXml);
		
		//Initialize level_9 localStorage
		//tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="0" y="22"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_left"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_path_left"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="WAIT-FOR"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_left"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value></block></statement></block></next></block></statement></block></next></block></statement></block><block type="bp_repeat_forever" x="0" y="295"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_no_path_left"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_ahead"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_path_ahead"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></next></block></statement></block></next></block></statement></block><block type="bp_repeat_forever" x="0" y="574"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_no_path_left"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_ahead"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_no_path_ahead"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_right"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_path_right"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_right"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></statement></block><block type="bp_repeat_forever" x="0" y="1022"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_no_path_left"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_ahead"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_no_path_ahead"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_right"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_no_path_right"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_right"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_right"></block></value><statement name="statement"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></statement></block></xml>';
		tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="-1" y="-84"><statement name="DO"><block type="bp_label"><title name="LABEL_NAME">Label_1</title><statement name="NAME"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_left"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_1</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="WAIT-FOR"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_1</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="-6" y="266"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value></block></value><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_ahead"></block></value></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="-8" y="470"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value></block></value><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_ahead"></block></value></block></value><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_right"></block></value></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="-9" y="750"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value></block></value><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_ahead"></block></value></block></value><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_right"></block></value></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>';
        tKey = "Level_9";
        window.localStorage.setItem(tKey, tXml);
		
		//Initialize level_10 localStorage
		//tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="28"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="150" y="133"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="150" y="324"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></xml>';
        tKey = "Level_10";
        window.localStorage.setItem(tKey, tXml);
        
		//Initialize level_help array - only if null! for reset click H.
        //var tBitArray = '0,0,0,0,0,0,0,0,0,0'; //an array of bits for seen help, current number of levels is 8, array is size 9. TODO: refactor this code.
        tKey = "Level_help";//TODO: Rename the name of this variable
        window.localStorage.setItem(tKey, this.storageBitArray);
		
		//Log backup reset?TODO: Test
		tKey = "logText";
		if (window.localStorage.getItem("logText") == null){//If not defined, define.
			window.localStorage.setItem(tKey, "");
		}
		
		/*TODO: Remove code segment if reset is working properly
		if (window.localStorage.getItem(tKey) == null) {
            window.localStorage.setItem(tKey, this.storageBitArray);
        }
		*/
    } else {
        console.log("No LocalStorage, Error resetting localstorage");
    }
};

versionControllerLow.prototype.cheat_Level_8 = function() { 
		
			var tXmlText = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="19" y="27"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="539" y="111"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="24" y="156"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="17" y="336"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_barrierAhead"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="BLOCK"><block type="bp_forward"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="BLOCK"><block type="bp_forward"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="BLOCK"><block type="bp_forward"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="BLOCK"><block type="bp_forward"></block></value><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_no_barrierAhead"></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>';
			var tXml = Blockly.Xml.textToDom(tXmlText);
			// Clear the workspace to avoid merge.
			Blockly.mainWorkspace.clear();
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
};

versionControllerLow.prototype.cheat_Level_10 = function() { 
	var tXmlText = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="-1" y="-84"><statement name="DO"><block type="bp_label"><title name="LABEL_NAME">Label_1</title><statement name="NAME"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_left"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_1</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="WAIT-FOR"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_1</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="-6" y="266"><statement name="DO"><block type="bp_label"><title name="LABEL_NAME">Label_2</title><statement name="NAME"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_2</title></block></statement><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_ahead"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_2</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="-5" y="623"><statement name="DO"><block type="bp_label"><title name="LABEL_NAME">Label_3</title><statement name="NAME"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_3</title></block></statement><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_ahead"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_3</title></block></statement><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_path_right"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_3</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><value name="WAIT-FOR"><block type="bp_forward"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_3</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="-4" y="1229"><statement name="DO"><block type="bp_label"><title name="LABEL_NAME">Label_4</title><statement name="NAME"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_left"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_4</title></block></statement><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_ahead"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_4</title></block></statement><next><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="lists_create_with" inline="true"><mutation items="2"></mutation><value name="ADD0"><block type="bp_no_path_right"></block></value><value name="ADD1"><block type="bp_forward"></block></value></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_4</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><value name="WAIT-FOR"><block type="bp_forward"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_4</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><value name="WAIT-FOR"><block type="bp_forward"></block></value><next><block type="bp_if_last_event" inline="false"><value name="EVENT"><block type="bp_forward"></block></value><statement name="statement"><block type="bp_break"><title name="LABEL_NAME">Label_4</title></block></statement><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block></xml>';
	var tXml = Blockly.Xml.textToDom(tXmlText);
	// Clear the workspace to avoid merge.
	Blockly.mainWorkspace.clear();
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
}

/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------Mixed level versionController  - subclass of versionController------------
-----------------------------------------------------------------------------------------------------------------------*/
// define the sub-class of version
function versionControllerMixed() {
    // Call the parent constructor
    versionController.call(this);
	this.prepareLocalStorgae(false);
	//this.resetMembers();
	
};
//Infrastructure for inheritance.
versionControllerMixed.prototype = new versionController();
versionControllerMixed.prototype.constructor = versionControllerMixed;
versionControllerMixed.prototype.parent = versionController.prototype;//How to call parent? this.parent.method.call(this);
/**
* Template document load en.js or en2.js
*/
versionControllerMixed.prototype.getTemplateDocument = function() {
	return '<script type="text/javascript" src="generated/en3.js"></script>\n';//en.js for now is high level idioms.
};

/**
* prepare localStorage ,true signals reset local storage no matter if it's initialized or not.
*/
versionControllerMixed.prototype.prepareLocalStorgae = function(flag) {
	if(!this.isStorageIntialized() || flag) {
		this.resetLocalStorage();
	}
};

//TODO: Consider removing this method
/**
* 
* True signals reset localStorage anyway
*/
versionControllerMixed.prototype.resetMembers = function(flag) {
	if(!this.isStorageIntialized() || (!(typeof flag === "undefined") && flag)) {
		this.resetLocalStorage();
	}
	this.parent.resetMembers.call(this);
};

//TODO - Check if this method is being used, if not remove.
versionControllerMixed.prototype.flagLocalStorageInitialized = function() { 
	if ('localStorage' in window) {
	//Initialize flag for first time in localStorage
		window.localStorage.setItem("reset", "ver_3");
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
};

//TODO - Check if this method is being used, if not remove.
versionControllerMixed.prototype.isStorageIntialized = function() {
	var tAnswer = false;
	if ('localStorage' in window) {
		var tValue = window.localStorage.getItem("reset");
		if( tValue != null) {//Key is defined.
			if(tValue === "ver_3") {
				tAnswer = true;
			}
		}
		else {
			//console.log("'reset' value in localStorage is null");
		}
	}
	else {
		console.log("No LocalStorage, Error resetting localstorage");
	}
	return tAnswer;
};

versionControllerMixed.prototype.resetLocalStorage = function() {
	var tXml = null;
    var tKey = null;
    if ('localStorage' in window) {
        //Initialize flag for first time in localStorage
        //window.localStorage.setItem("reset", "");
		this.flagLocalStorageInitialized();

        //Initialize level_1 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bsync" inline="true" x="70" y="69"><value name="REQUEST"><block type="bp_forward"></block></value></block></xml>';
        tKey = "Level_1";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_2 localStorage
		tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bsync" inline="true" x="117" y="63"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value></block></next></block></xml>';
        tKey = "Level_2";
		
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_3 localStorage
        tXml = ' <xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="111" y="69"></block></xml>';
        tKey = "Level_3";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_4 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_4";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_5 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="66" y="37"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" disabled="true" x="71" y="254"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="bsync" inline="true" disabled="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></xml>';
		tKey = "Level_5";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_6 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="40"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="400" y="40"><statement name="DO"><block type="scoped_wait" inline="false"><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value></block></next></block></statement></block><block type="bp_repeat_forever" x="630" y="40"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        tKey = "Level_6";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_7 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="42" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="267" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" disabled="true" x="495" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_barrierAhead"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_forward"></block></value><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_barrierAhead"></block></value></block></statement></block></next></block></statement></block><block type="bp_repeat_forever" x="725" y="50"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
		tKey = "Level_7";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_8 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_8";
        window.localStorage.setItem(tKey, tXml);
		
		//Initialize level_9 localStorage		
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="0"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_right"></block></value><statement name="code"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></statement></block></next></block></statement><value name="events"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="550" y="0"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_ahead"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="150" y="285"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_ahead"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="bp_repeat_forever" x="550" y="285"><statement name="DO"><block type="bp_breakupon" inline="false"><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_ahead"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block></xml>';
		tKey = "Level_9";
        window.localStorage.setItem(tKey, tXml);

		//Initialize level_10 localStorage
		tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="28"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="150" y="133"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="150" y="324"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></xml>';
        tKey = "Level_10";
        window.localStorage.setItem(tKey, tXml);
		
        //Initialize level_help array - only if null! for reset click H.
        //var tBitArray = '0,0,0,0,0,0,0,0,0,0'; //an array of bits for seen help, current number of levels is 8, array is size 9. TODO: refactor this code.
        tKey = "Level_help";//TODO: Rename the name of this variable
        window.localStorage.setItem(tKey, this.storageBitArray);
		
		//Log backup test reset? TODO: Test
		tKey = "logText";
		if (window.localStorage.getItem("logText") == null){//If not defined, define.
			window.localStorage.setItem(tKey, "");
		}
    } else {
        console.log("No LocalStorage, Error resetting localstorage");
    }
};

versionControllerMixed.prototype.cheat_Level_8 = function() { 
	var tXmlText = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="42" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="267" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="495" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_barrierAhead"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_forward"></block></value><statement name="code"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_barrierAhead"></block></value></block></next></block></next></block></next></block></next></block></statement><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="725" y="50"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
	var tXml = Blockly.Xml.textToDom(tXmlText);
	// Clear the workspace to avoid merge.
	Blockly.mainWorkspace.clear();
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
};

versionControllerMixed.prototype.cheat_Level_10 = function() { 
	var tXmlText = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="135" y="28"><statement name="DO"><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block><block type="bp_repeat_forever" x="144" y="133"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_left"></block></value><value name="BLOCK"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value><value name="BLOCK"><block type="bp_right"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="143" y="324"><statement name="DO"><block type="bsync" inline="true"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="bsync" inline="true"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block></xml>';
	var tXml = Blockly.Xml.textToDom(tXmlText);
	// Clear the workspace to avoid merge.
	Blockly.mainWorkspace.clear();
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
};