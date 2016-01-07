/**----------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------- Static oriented structure-----------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------------*/
// For the time now
Date.prototype.timeNow = function() {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
};

var currentDate = new Date();

var staticLogger = {};

staticLogger.loggedText = "";
staticLogger.storageKey = "";

staticLogger.log = function(key, message) {
    var messageKey = null;
    if (key == 1) { //1 == INFO
        messageKey = "INFO";
    } else if (key == 2) { //2 == CLICK
        messageKey = "CLICK";
    }
    //this.loggedText += new Date().timeNow() + " " + messageKey + " - " + message + "\n";
    this.loggedText = new Date().timeNow() + " " + messageKey + " - " + message + "\n";
    Logger.prototype.backUpLogToStorage(); //Transferring data to the LocalStorage. Current status is backup to local Storage every time.
    //Logger.prototype.sendLogTextToRemoteStorage();
};

staticLogger.logOnClickEvent = function(element) {
    //staticLogger.loggedText += "clicked: " + element.id + "@" + new Date().timeNow() + "\n";
    this.log(2, element.id);
};

/**----------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------- Object oriented structure-----------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/**-----------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------Change to set interval method-- https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers.setTimeout----
---------------------------------------------------------------------------------------------------------------------------------------------------------*/

var __nativeST__ = window.setTimeout,
    __nativeSI__ = window.setInterval;

function Logger() {
    this.log = "";
    this.arrayOfEventsIndex = null;
    this.stackOfEvents = [];
}

Logger.prototype.reset = function() {
    this.arrayOfEventsIndex = null;
}

Logger.prototype.setTimeout = function(vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */ ) {
    var oThis = this,
        aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function() {
        vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
};

Logger.prototype.setInterval = function(vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */ ) {
    var oThis = this,
        aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function() {
        vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
};

/**--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------Change to set interval method-- https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers.setTimeout end-----------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

Logger.prototype.listenToAllButtons = function(param) {

    var buttonElements = document.getElementsByTagName("button");
    for (var i = 0; i < buttonElements.length; i++) {
        this.attachOnClick(buttonElements[i], null);
    }

};

Logger.prototype.listenToTabs = function() {
    var tableRows = document.getElementById("tabRow").children;
    for (var i = 0; i < tableRows.length; i++) {
        var tableRow = tableRows[i];
        if ((tableRow.id.indexOf("tab_blocks") != -1) ||
            (tableRow.id.indexOf("tab_tasks") != -1) ||
            (tableRow.id.indexOf("tab_html") != -1) ||
            (tableRow.id.indexOf("tab_project_blocks") != -1) ||
            (tableRow.id.indexOf("tab_javascript") != -1) ||
            (tableRow.id.indexOf("tab_xml") != -1)) {
            this.attachOnClick(tableRow, null);
        }
    }
};

Logger.prototype.listenToPalletButtons = function() {
    var tree = Blockly.Toolbox.tree_;
    if (typeof tree != 'undefined') {
        var children = tree.getElementsByClass("blocklyTreeLabel");
        if (children.length >= 2) {
            for (var i = 1; i < children.length; i++) {
                var paletteElement = children[i];
                this.attachOnClick(paletteElement, (function(elem) {
                    var answer = function() {
                        Logger.prototype.logPaletteElement(elem);
                        Logger.prototype.logCurrentWorkspace(); //TODO: Duplicate code , why this is not working and the name of block seleceted is not included.
                    };
                    return answer;
                })(paletteElement));
            }
        }
    }
};

Logger.prototype.logPaletteElement = function(paletteElement) {

    Logger.prototype.logMsg(1, "Clicked palette element : " + paletteElement.innerHTML);

};

Logger.prototype.initLoggerForMaze = function() {

    //Attach listener to the all buttons.
    this.listenToAllButtons(1);
    //Attach listener to the level buttons.
    var levelButtons = document.getElementById("selected").parentNode.children;
    //Attach to pallet elements
    this.listenToPalletButtons();

    //TODO: No Need to listen to run button because workspace backup function is already attached in listenToAllButtons
    //TODO: Delete these lines.
    //Attach run button click - TODO:  more should happen here than just click run button.
    //var runProgramButton = document.getElementById('runButton');
    //this.attachOnClick(runProgramButton , this.logCurrentWorkspace);//TODO: Code should not be null.

    //Attach pause button click.
    var pauseButton = document.getElementById('pauseMotionButton');
    this.attachOnClick(pauseButton,
        function() {
            this.setTimeout.call(this, this.logPauseClick, 1750);
        });
    var singleStepButton = document.getElementById('singleStepButton');
    this.attachOnClick(singleStepButton,
        function() {
            this.setTimeout.call(this, this.logPauseClick, 1750);
        });
};

Logger.prototype.initLoggerForCode = function() {

    this.listenToAllButtons(2);
    this.listenToTabs();
    //Attach to pallet elements
    this.listenToPalletButtons();
    //Attach run button click - TODO:  more should happen here than just click run button.

    //TODO: No Need to listen to run button because workspace backup function is already attached in listenToAllButtons
    //TODO: Delete these lines.
    //var runProgramButton = document.getElementById('runButton');
    //this.attachOnClick(runProgramButton , this.logCurrentWorkspace_BP_Code);//TODO: Code should not be null.

};

Logger.prototype.logPauseClick = function() {
    while (this.stackOfEvents.length > 0) {
        var tEvent = this.stackOfEvents.shift();
        //this.logMsg(1, "Event: " + tEvent);//Problematic. Think about this
    }
};

//TODO: Log this function , improtant
Logger.prototype.attachOnClick = function(domElement, codeToExecute) {
    if (domElement.addEventListener) {
        if (codeToExecute == null) {
            domElement.addEventListener('click',
                function() {
                    staticLogger.logOnClickEvent(this);
                    Logger.prototype.logCurrentWorkspace();
                    //Logger.prototype.backUpLogToStorage();
                }, false);
        } else {
            domElement.addEventListener('click', codeToExecute.bind(this), false);
        }
    }
};

/**
 * Logger snapshot of the workspace.
 * This function uses the version Controller mechanism of backing of the workspace in order to log the current workspace to
 * the log file.
 */
//TODO : This function backs up the workspace on every change, or at least it should do so.
//TODO: Check that we back up the workspace on every change and that we can extract this information and use it.
Logger.prototype.logCurrentWorkspace = function() {

    //TODO: Smelly code.
    var allWorkspacesArray;
    if ((typeof Maze != 'undefined') &&
        (window.localStorage.getItem("Level_" + Maze.LEVEL) != null)) {
        allWorkspacesArray = window.localStorage.getItem("Level_" + Maze.LEVEL).split("<&>"); //TODO: Direct access to localStorage, wrap it.
    } else if (window.localStorage.getItem("workspace") != null) {
        allWorkspacesArray = window.localStorage.getItem("workspace").split("<&>"); //TODO: Direct access to localStorage, wrap it.
    } else {
        console.log("No workspace or Level_.Maze.LEVEL var inside the localStorage");
    }
    var currentWorkspaceText = allWorkspacesArray[allWorkspacesArray.length - 1];
    Logger.prototype.logMsg(1, "Current workspace : " + currentWorkspaceText);
};

//TODO: Same function as above, can we delete it?
/*
Logger.prototype.logCurrentWorkspace_BP_Code = function() {
	var allWorkspacesArray = window.localStorage.getItem("workspace").split("<&>");//TODO: Direct access to localStorage, wrap it.
	var currentWorkspaceText = allWorkspacesArray[allWorkspacesArray.length - 1];
	Logger.prototype.logMsg(1, "Current workspace : " + currentWorkspaceText);
};
*/

//Logging events to the textArea
Logger.prototype.logEvent = function(action) {
    //Logging current event to console, anyway.

    //console.log('Event: ' + action);
    //Logging inside the log text box.
    //TODO: Extract to method Or delete.
    if (action != 'tick') { //Not logging tick event, perhaps should be done in the logger
        //Storing events for dumping them to logger.
        this.stackOfEvents.push(action);

        //Logging to  logText
        this.logMsg(1, "Event: " + action);

        //Displaying event in loggerTextArea
        var tTextArea = document.getElementById("loggerTextArea");
        var content = document.createElement('p');
        content.style.margin = '7px';
        content.innerHTML = action;
        tTextArea.appendChild(content);
        tTextArea.scrollTop = tTextArea.scrollHeight;
    }
    return;
};

Logger.prototype.logMsg = function(level, message) {
    staticLogger.log(level, message);
};

Logger.prototype.backUpLogToStorage = function() {

    if ('localStorage' in window) {
        var tValue = window.localStorage.getItem("logText");
        if (tValue != "") { //Key is defined.
            window.localStorage.setItem("logText", tValue + staticLogger.loggedText);
        } else { //Key is not defined
            window.localStorage.setItem("logText", staticLogger.loggedText);
        }
    } else {
        console.log("No LocalStorage, Error resetting localStorage");
    }
};

Logger.prototype.sendLogTextToRemoteStorage = function() {

    logText = window.localStorage.getItem("logText");
    var logTextEncoded = encodeURI(logText);
    //var  dataAsString = "xml=" + logTextEncoded;  //Name value Pair
    var dataAsArray = {xml:logTextEncoded}; //Array 

    window.jQuery.ajax({
        url : "/storage",
        type: "POST",
        data : dataAsArray,
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            console.log(jqXHR);
            alert( "success_1" + data);
            window.localStorage.setItem("remoteStorageKey", data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
             //data - error from server
            var responseText = jQuery.parseJSON(jqXHR.responseText);
            console.log(responseText);
            window.localStorage.setItem("responseText", responseText);
        }
    });
};
//Old Code for sendLogTextToRemoteStorage
/* 
    window.jQuery.post( "/storage", { xml: dataToSend }, 
        function() { alert("success_1")})
        .done(function(data) {
            console.log("success_2");
            alert( "success_2" + data);
            window.localStorage.setItem("remoteStorageKey", data);
        })
        .fail(function(data) {
            console.log("error" + data);
            alert( "error"  + data);
        })
        .always(function(data) {
            console.log("finished" + data);
            alert( "finished" + data);
        });



window.jQuery.post('/storage', {
            xml: dataToSend
        },
        function(data, status, xhr) {
            staticLogger.storageKey = data;
            if ('localStorage' in window) {
                window.localStorage.setItem("remoteStorageKey", data);
            } else {
                console.log("No LocalStorage, Error resetting localStorage");
            }
            data = data.replace(/[\n\t\r]/g,"");//Clean the data from unwanted strings
            //window.location = window.location + "&storageKey=" + staticLogger.storageKey;//Testing function
        });
*/

Logger.prototype.getRemoteStorageKey = function() {

	var ans = null;
	if(staticLogger.storageKey != ""){
		ans = staticLogger.storageKey;
	}
	return ans;
};

Logger.prototype.getRemoteStorageKeyHashString = function() {
    var ans = "";
    if(this.getRemoteStorageKey() != null){
        ans = "&key=" + this.getRemoteStorageKey();
    }
    return ans;
}