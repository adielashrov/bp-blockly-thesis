/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------Parent class of msgDisplay------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------*/
//Defining an object
function msgDisplayParent() {
	this.flag = false;
	this.MaxLevelCongratulations = false;
}
    //Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_1 = function() {
    return;
};
//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_2 = function() {
    return;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_3 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelpRepeat_BP_ver1');
    style = {
        width: '360px',
        top: '340px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '425px';
    origin = toolbar[3].getSvgRoot();
    var button1 = document.getElementById("dialogHelpRepeat_button_BP_ver1");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark All LevelsHelp has been seen
                Maze.markLevelHelp();
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_4 = function(content, style, origin, toolbar, userBlocks) {
    return;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_5 = function() {
    return;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_6 = function() {
    return;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_7 = function() {
    return;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_8 = function() {
    return;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_9 = function() {
    return false;
};

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.level_10 = function(styleArray, content, style, origin) {
    if ((styleArray['level'] == "2")/* && !this.flag*/) { //How to move the scorll bar to show the relevant blocks
        Blockly.mainWorkspace.scrollbar.set(250, 290);
		/*this.flag = true;*/
    }
    Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.children_[2].blocks);
    content = document.getElementById('dialogHelp_Level_10_1_BP_ver' + styleArray['level']); //Left hand rule - Same message for version 1 and version 2
    style = styleArray[0];
    origin = toolbar[3];
    var button = document.getElementById("dialogHelp_Level_10_1_button_BP_ver" + styleArray['level']); //Left hand rule - Same message for version 1 and version 2
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                Blockly.Toolbox.flyout_.hide();
                BlocklyApps.hideDialog(false);
                //Open the updated category containing bSync idiom - flyout 
                //Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.children_[2].blocks);TODO: Delete
                content = document.getElementById('dialogHelp_Level_10_2_BP_ver' + styleArray['level']);
                style = styleArray[1];
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_10_2_button_BP_ver" + styleArray['level']);
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Blockly.Toolbox.flyout_.hide(); TODO: Remove this line.
                            BlocklyApps.hideDialog(false);
                            Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.children_[0].blocks);
                            content = document.getElementById('dialogHelp_Level_10_3_BP_ver' + styleArray['level']);
                            style = styleArray[2];
                            origin = toolbar[3];
                            var button3 = document.getElementById("dialogHelp_Level_10_3_button_BP_ver" + styleArray['level']);
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                         //TODO: Change level to be version, confusing now.
										 //Close the toolbox containing the bSync idiom
										 if (styleArray['level'] == "1") { //How to move the scroll bar to show the relevant blocks
											Blockly.Toolbox.flyout_.hide();
										}
                                        BlocklyApps.hideDialog(false);
										content = document.getElementById('dialogHelp_Level_10_4_BP_ver' + styleArray['level']);
                                        style = styleArray[3];
                                        origin = toolbar[3];
										var button4 = document.getElementById('dialogHelp_Level_10_4_button_BP_ver' + styleArray['level']);
                                        if (button4.addEventListener) {
                                            button4.addEventListener("click",
                                                function() {
                                                    BlocklyApps.hideDialog(false);
                                                    content = document.getElementById('dialogHelp_Level_10_5_BP_ver' + styleArray['level']);
                                                    style = styleArray[4];
                                                    origin = toolbar[3];
                                                    var button5 = document.getElementById('dialogHelp_Level_10_5_button_BP_ver' + styleArray['level']);
                                                    if (button5.addEventListener) {
                                                        button5.addEventListener("click",
                                                            function() {
                                                                Blockly.Toolbox.flyout_.hide();//Hide toolbox only for level 2.
																BlocklyApps.hideDialog(false);
                                                                /*
																if (styleArray['level'] == "2") { //How to move the scroll bar to show the relevant blocks
                                                                    Blockly.mainWorkspace.scrollbar.set(250, 450);
                                                                }
																*/
                                                                content = document.getElementById('dialogHelp_Level_10_6_BP_ver' + styleArray['level']);
                                                                style = styleArray[5];
                                                                origin = toolbar[3];
                                                                var button6 = document.getElementById("dialogHelp_Level_10_6_button_BP_ver" + styleArray['level']);
                                                                if (button6.addEventListener) {
                                                                    button6.addEventListener("click",
                                                                        function() {
                                                                            BlocklyApps.hideDialog(false);
																			if (styleArray['level'] == "2") { //How to move the scroll bar to show the relevant blocks
                                                                                Blockly.mainWorkspace.scrollbar.set(250, 500);
                                                                            }
                                                                            content = document.getElementById("dialogHelp_Level_10_7_BP_ver" + styleArray['level']);
                                                                            style = styleArray[6];
                                                                            origin = toolbar[3];
                                                                            var button7 = document.getElementById("dialogHelp_Level_10_7_button_BP_ver" + styleArray['level']);
                                                                            if (button7.addEventListener) {
                                                                                button7.addEventListener("click",
                                                                                    function() {
                                                                                        if (styleArray['level'] == "2") { //How to move the scroll bar to show the relevant blocks
                                                                                            Blockly.mainWorkspace.scrollbar.set(250, 750);
                                                                                        }
                                                                                        BlocklyApps.hideDialog(false);
                                                                                        content = document.getElementById("dialogHelp_Level_10_8_BP_ver" + styleArray['level']);
                                                                                        style = styleArray[7];
                                                                                        origin = toolbar[3];
                                                                                        var button8 = document.getElementById("dialogHelp_Level_10_8_button_BP_ver" + styleArray['level']);
                                                                                        if (button8.addEventListener) {
                                                                                            button8.addEventListener("click",
                                                                                                function() {
                                                                                                    if (styleArray['level'] == "2") { //How to move the scroll bar to show the relevant blocks
																										Blockly.mainWorkspace.scrollbar.set(250, 1000);
																									}
                                                                                                    BlocklyApps.hideDialog(false);
                                                                                                    content = document.getElementById("dialogHelp_Level_10_9_BP_ver" + styleArray['level']);
                                                                                                    style = styleArray[8];
                                                                                                    origin = toolbar[3];
                                                                                                    var button9 = document.getElementById("dialogHelp_Level_10_9_button_BP_ver" + styleArray['level']);
																									if (button9.addEventListener) {
                                                                                                        button9.addEventListener("click",
                                                                                                            function() {
                                                                                                                BlocklyApps.hideDialog(false);
                                                                                                                if(styleArray['level'] == "1") {
																														Maze.markLevelHelp();
																												}
																												else {
																													 if (styleArray['level'] == "2") { //How to move the scroll bar to show the relevant blocks
																														Blockly.mainWorkspace.scrollbar.set(250, 385);
																													}
																													content = document.getElementById("dialogHelp_Level_10_10_BP_ver" + styleArray['level']);
																													style = styleArray[9];
																													origin = toolbar[3];
																													var button10 = document.getElementById("dialogHelp_Level_10_10_button_BP_ver" + styleArray['level']);
																													if (button10.addEventListener) {
																														button10.addEventListener("click",
																															function() {
																																BlocklyApps.hideDialog(false);
																																Maze.markLevelHelp();
																															}, false);
																													}
																													BlocklyApps.showDialog(content, origin, true, false, style, null);
																												}
                                                                                                            }, false);
                                                                                                    }
                                                                                                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                                                                                                }, false);
                                                                                        }
                                                                                        BlocklyApps.showDialog(content, origin, true, false, style, null);
                                                                                    }, false);
                                                                            }
                                                                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                                                                        }, false);
                                                                }
                                                                BlocklyApps.showDialog(content, origin, true, false, style, null);
                                                            }, false);
                                                    }
                                                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                                                }, false);
                                        }
                                        BlocklyApps.showDialog(content, origin, true, false, style, null);
                                    }, false);
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                        }, false);
                }
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

//TODO: Remove the flag option after correct implementation.
msgDisplayParent.prototype.showMsg = function(flag, content, style, origin) {
        if (flag) {
            if (content) {
                if (content.parentNode != document.getElementById('dialog')) {
                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                }
            } else {
                console.log("content is null, inside msgDisplayParent.prototype.showMsg");
                BlocklyApps.hideDialog(false);
            }
        }
    }
    //Hide the current dialogue/message
msgDisplayParent.prototype.hideMsg = function() {
    BlocklyApps.hideDialog(false);
}

msgDisplayParent.prototype.showResetMsg = function(content, style, origin) {
    content = document.getElementById('dialogHelpReset');
    style = {
        width: '360px',
        top: '410px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '400px';
    origin = document.getElementById('resetButton');
    this.showMsg(true, content, style, origin);
}

msgDisplayParent.prototype.showMessagesClickReset = function() {
    var content = document.getElementById('dialogHelp_Level_showMessages');
    var style = {
        width: '360px',
        top: '450px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '380px';
    origin = document.getElementById('resetButton');
    var button = document.getElementById("dialogHelp_Level_showMessages_button");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
            }, false);
    }
    this.showMsg(true, content, style, origin);
}

//Abstract method in parent needs to be implemented in child, take notice arguments don't correlate.
msgDisplayParent.prototype.endLevelExplanation = function() {
    return null;
}

msgDisplayParent.prototype.explainAboutSlowMotion = function(content, style, origin, toolbar, userBlocks) {

        Maze.showSingleStepButton();
        Maze.showContinueButton();
        content = document.getElementById('dialogHelp_Level_slowMotion_BP');
        style = {
            width: '430px',
            top: '535px'
        };
        style[Blockly.RTL ? 'right' : 'left'] = '400px';
        origin = toolbar[0].getSvgRoot();
        var button1 = document.getElementById("dialogHelp_Level_slowMotion_button_BP");
        var reference = this;
        if (button1.addEventListener) {
            button1.addEventListener("click",
                function() {
                    BlocklyApps.hideDialog(false);
                    content = document.getElementById('dialogHelp_Level_continueB_BP');
                    style = {
                        width: '430px',
                        top: '545px'
                    };
                    style[Blockly.RTL ? 'right' : 'left'] = '400px';
                    origin = toolbar[0].getSvgRoot();;
                    var button2 = document.getElementById("dialogHelp_Level_continueB_button_BP");
                    if (button2.addEventListener) {
                        button2.addEventListener("click",
                            function() {
                                BlocklyApps.hideDialog(false);
                                reference.level_4(content, style, origin, toolbar, userBlocks);
                                //Maze.markLevelHelp();
                            }, false);
                    }
                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                }, false);
        }
        this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
        return;
    }
    //TODO: Refactor variables
msgDisplayParent.prototype.showOnlyOneGroupMsg = function() {

    var content = document.getElementById('dialogHelpOnlyOneBlocksGroup_BP_ver1');
    var style = {
        width: '430px',
        top: '300px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '600px';
    var toolbar = Blockly.mainWorkspace.flyout_.workspace_.getTopBlocks(true); //Only use for levels lower than 6. TODO: Refactor.
    var origin = toolbar[0].getSvgRoot();
    var button1 = document.getElementById("dialogHelpOnlyOneBlocksGroup_button_BP_ver1");
    var reference = this;
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------High level idioms msgDisplay - subclass of msgDisplayParent---------------
-----------------------------------------------------------------------------------------------------------------------*/

// define the sub-class of version
function msgDisplayHigh() {
    // Call the parent constructor
    msgDisplayParent.call(this);
};

// inherit msgDisplayParent
msgDisplayHigh.prototype = new msgDisplayParent();
// correct the constructor pointer because it points to msgDisplayParent
msgDisplayHigh.prototype.constructor = msgDisplayHigh;
// Keep pointer to super.
msgDisplayHigh.prototype.parent = msgDisplayParent.prototype; //How to call parent? this.parent.method.call(this);

//TODO: Change this method inside msgDisplayLow
msgDisplayHigh.prototype.level_1 = function(content, style, origin, toolbar) {
    /*
    Adiel - Removed first message which is introduction video in Hebrew for review purposes of paper in ICSE 2016
    content = document.getElementById('dialogHelp_Level_1_1_BP_ver1');
    style = {
        width: 'auto',
        top: '240px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '420px';
    origin = toolbar[0].getSvgRoot();
    var button1 = document.getElementById("dialogHelp_Level_1_1_button_BP_ver1");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
     */
                content = document.getElementById('dialogHelpStack_BP_ver1');
                style = {
                    width: '430px',
                    top: '240px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                origin = toolbar[0].getSvgRoot();
                var button2 = document.getElementById("dialogHelpStack_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            // Show run help dialogue.
                            content = document.getElementById('dialogHelpRun');
                            style = {
                                width: '360px',
                                top: '410px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '400px';
                            origin = document.getElementById('runButton');
                            //Mark All LevelsHelp has been seen
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                            Maze.markLevelHelp();
                        }, false);
                }
                /*
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    */
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayHigh.prototype.level_2 = function(content, style, origin, toolbar) {

    content = document.getElementById('dialogHelpLevel_2_BP_ver1');
    style = {
        width: '400px',
        top: '255px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '430px';
    origin = toolbar[0].getSvgRoot();
    var button1 = document.getElementById("dialogHelpLevel_2_button_BP_ver1");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark All LevelsHelp has been seen
                Maze.markLevelHelp();
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayHigh.prototype.level_3 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelpRepeat_BP_ver1');
    style = {
        width: '360px',
        top: '320px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '425px';
    origin = toolbar[3].getSvgRoot();
    var button1 = document.getElementById("dialogHelpRepeat_button_BP_ver1");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark All LevelsHelp has been seen
                Maze.markLevelHelp();
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayHigh.prototype.level_4 = function(content, style, origin, toolbar, userBlocks) {

    content = document.getElementById('dialogHelpRepeatMany_BP_ver1');
    style = {
        width: '360px',
        top: '320px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '425px';
    origin = toolbar[3].getSvgRoot();
    var button = document.getElementById("dialogHelpRepeatMany_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark all help signs have been seen (third message)
                Maze.markLevelHelp();
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayHigh.prototype.level_5 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_5_1_BP_ver1');
    style = {
        width: '360px',
        height: 'auto',
        top: '280px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '560px';
    origin = toolbar[3].getSvgRoot();
    //Attach a listener to the button-1
    var button = document.getElementById("dialogHelp_Level_5_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Hide the first message for the user
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_5_2_BP_ver1');
                style = {
                    width: '360px',
                    height: '100px',
                    top: '260px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '860px';
                var origin2 = toolbar[3].getSvgRoot();
                //var origin2 = Blockly.mainWorkspace.getTopBlocks(true)[0].getSvgRoot();
                //Attach a listener to the button-1
                var button2 = document.getElementById("dialogHelp_Level_5_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Hide the second message from the user
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_5_3_BP_ver1');
                            style = {
                                width: '360px',
                                height: '200px',
                                top: '260px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '1150px';
                            //origin = toolbar[3].getSvgRoot();
                            if (Blockly.mainWorkspace.getTopBlocks(true).length > 0) {
                                origin = Blockly.mainWorkspace.getTopBlocks(true)[1].getSvgRoot();
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                            //TODO: Hide the third message and show click on listener
                            //BlocklyApps.hideDialog(false);
                            var button3 = document.getElementById("dialogHelp_Level_5_3_button_BP_ver1");
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        // Show run help dialog - duplicate code, think about this
                                        content = document.getElementById('dialogHelpRun');
                                        style = {
                                            width: '360px',
											height: '80px',
                                            top: '410px'
                                        };
                                        style[Blockly.RTL ? 'right' : 'left'] = '400px';
                                        var origin4 = document.getElementById('runButton');
                                        BlocklyApps.showDialog(content, origin4, true, false, style, null);
                                        //Finished 3 message.
                                        //Mark all help signs have been seen
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                        }, false);
                }
                //Show the second message
                BlocklyApps.showDialog(content, origin2, true, false, style, null);
            }, false);
    }
    //Show the first message on the pallet
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayHigh.prototype.level_6 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_6_1_BP_ver1');
    style = {
        width: '360px',
        top: '265px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '415px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[0];
    //origin = document.getElementById('runButton');
    var button = document.getElementById("dialogHelp_Level_6_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                // Show run help dialogue - duplicate code, think about this
                content = document.getElementById('dialogHelp_Level_6_2_BP_ver1');
                style = {
                    width: '360px',
                    top: '235px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '985px';
                var origin2 = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_6_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            //Finished 2 message.
                            //Mark all help signs have been seen
                            Maze.markLevelHelp();
                        }, false);
                }
                BlocklyApps.showDialog(content, origin2, true, false, style, null);
            }, false);
    }
    //Show the first message on the pallet
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayHigh.prototype.level_7 = function(content, style, origin, toolbar, userBlocks) {

    //Open the updated category containing bSync idiom - flyout
    Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.firstChild_.blocks);
    content = document.getElementById('dialogHelp_Level_7_1_BP_ver1');
    style = {
        width: '360px',
        top: '345px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '580px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3];
    var button = document.getElementById("dialogHelp_Level_7_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Hide the old message
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_7_2_BP_ver1');
                style = {
                    width: '600px', //TODO: Hard coded
                    //height: '160px',
                    top: '345px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '580px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_7_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Close the toolbox containing the bSync idiom
                            Blockly.Toolbox.flyout_.hide();
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_7_4_BP_ver1'); //Left hand rule - Same message for version 1 and version 2
                            style = {
                                width: '360px',
                                //height: '160px',
                                top: '285px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '1080px';
                            origin = toolbar[3];
                            var button4 = document.getElementById("dialogHelp_Level_7_4_button_BP_ver1"); //Left hand rule - Same message for version 1 and version 2
                            if (button4.addEventListener) {
                                button4.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        // Show run help dialogue - duplicate code, think about this
                                        content = document.getElementById('dialogHelpRun');
                                        style = {
                                            width: '360px',
                                            top: '410px'
                                        };
                                        style[Blockly.RTL ? 'right' : 'left'] = '400px';
                                        var origin4 = document.getElementById('runButton');
                                        BlocklyApps.showDialog(content, origin4, true, false, style, null);
                                        //Mark all help signs have been seen (third message)
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                        }, false);
                }
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayHigh.prototype.level_8 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_8_1_BP_ver1');
    style = {
        width: '360px',
        top: '150px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '420px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3]; //TODO: Do we need this origin even though it's not defined?
    var button = document.getElementById("dialogHelp_Level_8_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_8_2_BP_ver1');
                style = {
                    width: '360px',
                    //height: '160px',
                    top: '150px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_8_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            //Mark all help signs have been seen (third message)
                            Maze.markLevelHelp();
                        }, false);
                }
                //Show the second message
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    //Show the first message on the pallet - TODO: Repeated code, re factor this code segment.
}

msgDisplayHigh.prototype.level_9 = function(content, style, origin) {

    //Open the updated category containing bSync idiom - flyout
    Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.firstChild_.blocks);
    content = document.getElementById('dialogHelp_Level_9_1_BP_ver1');
    style = {
        width: '360px',
        top: '225px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '580px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3];
    var button = document.getElementById("dialogHelp_Level_9_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Close the toolbox containing the bSync idiom
                Blockly.Toolbox.flyout_.hide();
                //Hide the old message
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_9_2_BP_ver1');
                style = {
                    width: '360px',
                    //height: '160px',
                    top: '245px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '710px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_9_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_9_3_BP_ver1');
                            style = {
                                width: '360px',
                                //height: '160px',
                                top: '370px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '710px';
                            //origin = toolbar[3].getSvgRoot();
                            origin = toolbar[3];
                            var button3 = document.getElementById("dialogHelp_Level_9_3_button_BP_ver1");
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        //Mark all help signs have been seen (third message)TODO: Update in Maze
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);

                        }, false);
                }
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayHigh.prototype.level_10 = function(content, style, origin) {
    var styleArray = [];
    styleArray[0] = {
        width: "360px",
        top: "360px",
        left: "350px"
    }, styleArray[1] = {
        width: "360px",
        top: "140px",
        left: "350px"
    }, styleArray[2] = {
        width: "360px",
        top: "440px",
        left: "550px"
    }, styleArray[3] = {
        width: "360px",
        top: "300px",
        left: "740px"
    }, styleArray[4] = {
        width: "360px",
        top: "300px",
        left: "740px"
    }, styleArray[5] = {
        width: "360px",
        top: "265px",
        left: "1100px"
    }, styleArray[6] = {
        width: "360px",
        top: "600px",
        left: "740px"
    }, styleArray[7] = {
        width: "360px",
        top: "625px",
        left: "1100px"
    }, styleArray[8] = {
        width: "360px",
        top: "525px",
        left: "200px"
    };
    styleArray['level'] = "1";
    this.parent.level_10.apply(this, [styleArray], arguments); //"1" is version high idioms
    return;
};

msgDisplayHigh.prototype.endLevelExplanation = function() {
    //How to call methods in super
    //this.parent.endLevelExplanation.call(this);
    var content = document.getElementById('dialogDoneBP');
    var buttonDiv = document.getElementById('dialogDoneButtonsBP');
    buttonDiv.textContent = '';
    var style = {
        width: '600px', //Width and height are determined by the child iFrame element. TODO: Maybe refactor this?
        //height: '400px', //A hard-coded bug override, let because after we displayed BP help with timeout and buttons , height was different.
        //width: '100%',//Moved these features to template.soy file.
        height: 'auto',
        //resize: 'both',
        //overflow: 'auto',
        left: '30%',
        top: '2em'
    };
    var iframeDiv = document.getElementById('iframeDiv');
    var iframe = document.getElementById('iframeDialogDoneBP');
    if (Maze.LEVEL == 1) {
        iframeDiv.style.height = "300px";
        iframe.setAttribute("src", "level_1_Explanation_ver1.html");
    } else if (Maze.LEVEL == 5) {
        iframeDiv.style.height = "400px";
        iframe.setAttribute("src", "level_5_Explanation_ver1.html");
    } else if (Maze.LEVEL == 6) {
        iframeDiv.style.height = "200px";
        iframe.setAttribute("src", "level_6_Explanation_ver1.html");
    } else if (Maze.LEVEL == 7) {
        iframeDiv.style.height = "350px";
        iframe.setAttribute("src", "level_7_Explanation_ver1.html");
    } else if (Maze.LEVEL == 9) {
        if(Maze.counterOfRightTurns > 0) {
			iframeDiv.style.height = "420px";
			iframe.setAttribute("src", "level_10_Explanation_ver1.html");
			this.MaxLevelCongratulations = true;
		}
		else {
			iframeDiv.style.height = "420px";
			iframe.setAttribute("src", "level_10_Explanation_2_ver1.html");
		}
    } else {
        iframeDiv.style.height = "fac100px";
        iframe.setAttribute("src", "levelDefaultExplanation.html");
    }
    if (Maze.LEVEL < Maze.MAX_LEVEL) { //Play according to levels here	
        var cancel = document.createElement('button');
        cancel.appendChild(
            document.createTextNode('Try Again'/*BlocklyApps.getMsg('dialogCancel')*/));
        cancel.addEventListener('click', BlocklyApps.hideDialog, true);
        cancel.addEventListener('touchend', BlocklyApps.hideDialog, true);
        buttonDiv.appendChild(cancel);

        var ok = document.createElement('button');
        ok.className = 'secondary';
        ok.appendChild(document.createTextNode('Continue'/*BlocklyApps.getMsg('dialogOk')*/));
        ok.addEventListener('click', Maze.nextLevel, true);
        ok.addEventListener('touchend', Maze.nextLevel, true);
        buttonDiv.appendChild(ok);

        BlocklyApps.showDialog(content, null, false, true, style,
            function() {
                document.body.removeEventListener('keydown',
                    BlocklyApps.congratulationsKeyDown_, true);
            });
        document.body.addEventListener('keydown',
            BlocklyApps.congratulationsKeyDown_, true);

    } else {
        var tryButton = document.createElement('button');
        tryButton.appendChild(
            document.createTextNode('Try Again'/*BlocklyApps.getMsg('dialogCancel')*/));
        tryButton.addEventListener('click', BlocklyApps.hideDialog, true);
        tryButton.addEventListener('touchend', BlocklyApps.hideDialog, true);
        buttonDiv.appendChild(tryButton);

        var nextLevel = document.createElement('button');
        nextLevel.className = 'secondary';
        nextLevel.appendChild(document.createTextNode('Task Area'/*BlocklyApps.getMsg('dialogOk')*/));
        //nextLevel.addEventListener('click', Maze.nextLevel, true);
		nextLevel.addEventListener('click', function () {
												var win = window.open("../BP_Code/apps/BP/index.html?ver=1", '_blank');
												//win.focus();
											} , true);
        nextLevel.addEventListener('touchend', Maze.nextLevel, true);
        buttonDiv.appendChild(nextLevel);

        BlocklyApps.showDialog(content, null, false, true, style,
            function() {
                document.body.removeEventListener('keydown',
                    BlocklyApps.congratulationsKeyDown_, true);
            });
        document.body.addEventListener('keydown',
            BlocklyApps.congratulationsKeyDown_, true);
		
    }

    var pegSpin = document.getElementById('pegSpinBP');
    pegSpin.style.backgroundImage = 'url(' + Maze.SKIN.sprite + ')';

};

/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------Low level idioms msgDisplay - subclass of msgDisplayParent---------------
-----------------------------------------------------------------------------------------------------------------------*/

// define the sub-class of version
function msgDisplayLow() {
    // Call the parent constructor
    msgDisplayParent.call(this);
};

// inherit msgDisplayParent
msgDisplayLow.prototype = new msgDisplayParent();
// correct the constructor pointer because it points to msgDisplayParent
msgDisplayLow.prototype.constructor = msgDisplayLow;
// Keep pointer to super.
msgDisplayLow.prototype.parent = msgDisplayParent.prototype; //How to call parent? this.parent.method.call(this);

msgDisplayLow.prototype.level_1 = function(content, style, origin, toolbar) {

    /*
    Adiel - Removed first message which is introduction video in Hebrew for review purposes of paper in ICSE 2016
    content = document.getElementById('dialogHelp_Level_1_1_BP_ver2');
    style = {
        width: 'auto', //430px
        top: '260px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '420px';
    origin = toolbar[0].getSvgRoot();
    var button1 = document.getElementById("dialogHelp_Level_1_1_button_BP_ver2");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
    */
                content = document.getElementById('dialogHelpStack_BP_ver2');
                style = {
                    width: 'auto',
                    top: '260px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                origin = toolbar[0].getSvgRoot();
                var button2 = document.getElementById("dialogHelpStack_button_BP_ver2");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            // Show run help dialogue.
                            content = document.getElementById('dialogHelpRun');
                            style = {
                                width: '360px',
                                top: '410px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '400px';
                            origin = document.getElementById('runButton');
                            //Mark All LevelsHelp has been seen
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                            Maze.markLevelHelp();
                        }, false);
                }
                /*
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    */
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayLow.prototype.level_2 = function(content, style, origin, toolbar) {
    content = document.getElementById('dialogHelpLevel_2_BP_ver2');
    style = {
        width: '400px',
        top: '255px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '430px';
    origin = toolbar[0].getSvgRoot();
    var button1 = document.getElementById("dialogHelpLevel_2_button_BP_ver2");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark All LevelsHelp has been seen
                Maze.markLevelHelp();
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayLow.prototype.level_3 = function(content, style, origin, toolbar, userBlocks) {
    this.parent.level_3.apply(this, arguments);
    /*
	if (userBlocks.indexOf('scoped_request') == -1) { //Smart - If the user didn't use request we notify with a help message.
        content = document.getElementById('dialogHelpRepeat_BP_ver2');
        style = {
            width: '360px',
            top: '340px'
        };
        style[Blockly.RTL ? 'right' : 'left'] = '425px';
        origin = toolbar[0].getSvgRoot();
        Maze.markLevelHelp(); //Mark All LevelsHelp has been seen
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
	*/
};

msgDisplayLow.prototype.level_4 = function(content, style, origin, toolbar, userBlocks) {
    //if (userBlocks.indexOf('bp_repeat_forever') == -1) {
    content = document.getElementById('dialogHelpRepeatMany_BP_ver1');
    style = {
        width: '360px',
        top: '350px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '425px';
    origin = toolbar[0].getSvgRoot();
    var button = document.getElementById("dialogHelpRepeatMany_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark all help signs have been seen (third message)
                Maze.markLevelHelp();
            }, false);
    }
    //}
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayLow.prototype.level_5 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_5_1_BP_ver2');
    style = {
        width: '360px',
        height: 'auto',
        top: '320px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '560px';
    origin = toolbar[3].getSvgRoot();
    //Attach a listener to the button-1
    var button = document.getElementById("dialogHelp_Level_5_1_button_BP_ver2");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Hide the first message for the user
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_5_2_BP_ver2');
                style = {
                    width: '360px',
                    height: '80px',
                    top: '190px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '960px';
                var origin2 = toolbar[3].getSvgRoot();
                //var origin2 = Blockly.mainWorkspace.getTopBlocks(true)[0].getSvgRoot();
                //Attach a listener to the button-1
                var button2 = document.getElementById("dialogHelp_Level_5_2_button_BP_ver2");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Hide the second message from the user
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_5_3_BP_ver2');
                            style = {
                                width: '360px',
                                height: '220px',
                                top: '475px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '960px';
                            //origin = toolbar[3].getSvgRoot();
                            if (Blockly.mainWorkspace.getTopBlocks(true).length > 0) {
                                origin = Blockly.mainWorkspace.getTopBlocks(true)[1].getSvgRoot();
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                            //TODO: Hide the third message and show click on listener
                            //BlocklyApps.hideDialog(false);
                            var button3 = document.getElementById("dialogHelp_Level_5_3_button_BP_ver2");
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        // Show run help dialog - duplicate code, think about this
                                        content = document.getElementById('dialogHelpRun');
                                        style = {
                                            width: '360px',
											height: '80px',
                                            top: '410px'
                                        };
                                        style[Blockly.RTL ? 'right' : 'left'] = '400px';
                                        var origin4 = document.getElementById('runButton');
                                        BlocklyApps.showDialog(content, origin4, true, false, style, null);
                                        //Finished 3 message.
                                        //Mark all help signs have been seen
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                        }, false);
                }
                //Show the second message
                BlocklyApps.showDialog(content, origin2, true, false, style, null);
            }, false);
    }
    //Show the first message on the pallet
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayLow.prototype.level_6 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_6_1_BP_ver1');
    style = {
        width: '360px',
        top: '255px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '415px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[0];
    //origin = document.getElementById('runButton');
    var button = document.getElementById("dialogHelp_Level_6_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                // Show run help dialogue - duplicate code, think about this
                content = document.getElementById('dialogHelp_Level_6_2_BP_ver1'); //Same message as High, for now
                style = {
                    width: '360px',
                    top: '380px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '970px';
                var origin2 = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_6_2_button_BP_ver1"); //Same message as High, for now
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            //Finished 2 message.
                            //Mark all help signs have been seen
                            Maze.markLevelHelp();
                        }, false);
                }
                BlocklyApps.showDialog(content, origin2, true, false, style, null);
            }, false);
    }
    //Show the first message on the pallet
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayLow.prototype.level_7 = function(content, style, origin, toolbar, userBlocks) {

    //Open the updated category containing bSync idiom - fly-out
    Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.firstChild_.blocks);
    content = document.getElementById('dialogHelp_Level_7_1_BP_ver2');
    style = {
        width: 'auto',
        top: '225px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '500px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3];
    var button = document.getElementById("dialogHelp_Level_7_1_button_BP_ver2");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Hide the old message
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_7_2_BP_ver2');
                style = {
                    width: 'auto',
                    //height: '160px',
                    top: '225px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '500px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_7_2_button_BP_ver2");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Close the toolbox containing the bSync idiom
                            Blockly.Toolbox.flyout_.hide();
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_7_4_BP_ver2');
                            style = {
                                width: '590px',
                                //height: '160px',
                                top: '610px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '630px';
                            //origin = toolbar[3].getSvgRoot();
                            origin = toolbar[3];
                            var button3 = document.getElementById("dialogHelp_Level_7_4_button_BP_ver2");
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        // Show run help dialog - duplicate code, think about this
                                        content = document.getElementById('dialogHelpRun');
                                        style = {
                                            width: '360px',
                                            top: '370px'
                                        };
                                        style[Blockly.RTL ? 'right' : 'left'] = '350px';
                                        var origin4 = document.getElementById('runButton');
                                        BlocklyApps.showDialog(content, origin4, true, false, style, null);
                                        //Mark all help signs have been seen (third message)
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                        }, false);
                }
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayLow.prototype.level_8 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_8_1_BP_ver2');
    style = {
        width: '360px',
        top: '150px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '420px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3]; //TODO: Do we need this origin even though it's not defined?
    var button = document.getElementById("dialogHelp_Level_8_1_button_BP_ver2");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_8_2_BP_ver2');
                style = {
                    width: '360px',
                    //height: '160px',
                    top: '150px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_8_2_button_BP_ver2");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            //Mark all help signs have been seen (third message)
                            Maze.markLevelHelp();
                        }, false);
                }
                //Show the second message
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    //Show the first message on the pallet - TODO: Repeated code, re factor this code segment.
};

msgDisplayLow.prototype.level_9 = function(content, style, origin) {

    //Open the updated category containing bSync idiom - flyout
    Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.firstChild_.blocks);
    content = document.getElementById('dialogHelp_Level_9_1_BP_ver2');
    style = {
        width: '360px',
        top: '215px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '580px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3];
    var button = document.getElementById("dialogHelp_Level_9_1_button_BP_ver2");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {

                //Hide the old message
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_9_2_BP_ver2');
                style = {
                    width: '360px',
                    //height: '160px',
                    top: '255px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '580px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_9_2_button_BP_ver2");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Close the toolbox containing the bSync idiom
                            Blockly.Toolbox.flyout_.hide();
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_9_3_BP_ver2');
                            style = {
                                width: '360px',
                                //height: '160px',
                                top: '240px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '735px';
                            //origin = toolbar[3].getSvgRoot();
                            origin = toolbar[3];
                            var button3 = document.getElementById("dialogHelp_Level_9_3_button_BP_ver2");
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        content = document.getElementById('dialogHelp_Level_9_4_BP_ver2');
                                        style = {
                                            width: '360px',
                                            //height: '160px',
                                            top: '370px'
                                        };
                                        style[Blockly.RTL ? 'right' : 'left'] = '735px';
                                        origin = toolbar[3];
                                        var button4 = document.getElementById("dialogHelp_Level_9_4_button_BP_ver2");
                                        if (button4.addEventListener) {
                                            button4.addEventListener("click",
                                                function() {
                                                    BlocklyApps.hideDialog(false);
                                                    //Mark all help signs have been seen (third message)TODO: Update in Maze
                                                    Maze.markLevelHelp();
                                                }, false);
                                        }
                                        BlocklyApps.showDialog(content, origin, true, false, style, null);
                                    }, false);
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                        }, false);
                }
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayLow.prototype.level_10 = function(content, style, origin) {

    //document.getElementById("blockly").style.cssText = "top: 0px; left: 320px; height: 1200px; width: 1050px; transform: scale(0.9,0.9);"
    var styleArray = [];
    styleArray[0] = {
        width: "360px",
        top: "360px",
        left: "350px"
    }, styleArray[1] = {
        width: "360px",
        top: "140px",
        left: "350px"
    }, styleArray[2] = {
        width: "360px",
        top: "360px",
        left: "550px"
    }, styleArray[3] = {
        width: "360px",
        top: "540px",
        left: "550px"
    }, styleArray[4] = {
		height: "auto",
		width: "737px",
        top: "300px",
        left: "550px"
    }, styleArray[5] = {
        width: "360px",
        top: "480px",
        left: "900px"
    }, styleArray[6] = {
        width: "360px",
        top: "525px",
        left: "900px"
    }, styleArray[7] = {
        width: "360px",
        top: "550px",
        left: "900px"
    }, styleArray[8] = {
        width: "360px",
        top: "625px",
        left: "900px"
    },styleArray[9] = {
		width: "360px",
        top: "525px",
        left: "200px"
    }/*
	, styleArray[10] = {
        width: "360px",
        top: "525px",
        left: "200px"
    }*/;
    styleArray['level'] = "2";
    this.parent.level_10.apply(this, [styleArray], arguments); //"2" symbols version low.
    return;
};

msgDisplayLow.prototype.endLevelExplanation = function() {
    //How to call methods in super
    //this.parent.endLevelExplanation.call(this);
    var content = document.getElementById('dialogDoneBP');
    var buttonDiv = document.getElementById('dialogDoneButtonsBP');
    buttonDiv.textContent = '';
    var style = {
        width: '600px', //Width and height are determined by the child iFrame element. TODO: Maybe refactor this?
        //height: '400px', //A hard-coded bug override, let because after we displayed BP help with timeout and buttons , height was different.
        //width: '100%',//Moved these features to template.soy file.
        height: 'auto',
        //resize: 'both',
        //overflow: 'auto',
        left: '30%',
        top: '2em'
    };
    var iframeDiv = document.getElementById('iframeDiv');
    var iframe = document.getElementById('iframeDialogDoneBP');
    if (Maze.LEVEL == 1) {
        iframeDiv.style.height = "300px";
        iframe.setAttribute("src", "level_1_Explanation_ver2.html");
    } else if (Maze.LEVEL == 5) {
        iframeDiv.style.height = "400px";
        iframe.setAttribute("src", "level_5_Explanation_ver1.html");
    } else if (Maze.LEVEL == 6) {
        iframeDiv.style.height = "200px";
        iframe.setAttribute("src", "level_6_Explanation_ver2.html");
    } else if (Maze.LEVEL == 7) {
        iframeDiv.style.height = "350px";
        iframe.setAttribute("src", "level_7_Explanation_ver2.html");
    } else if (Maze.LEVEL == 9) {
        if(Maze.counterOfRightTurns > 0) {
			iframeDiv.style.height = "420px";
			iframe.setAttribute("src", "level_10_Explanation_ver2.html");
			this.MaxLevelCongratulations = true;
		}
		else {
			iframeDiv.style.height = "420px";
			iframe.setAttribute("src", "level_10_Explanation_2_ver2.html");
		}
    } else {
        iframeDiv.style.height = "100px";
        iframe.setAttribute("src", "levelDefaultExplanation.html");
    }
    if (Maze.LEVEL < Maze.MAX_LEVEL) { //Play according to levels here	
        var cancel = document.createElement('button');
        cancel.appendChild(
            document.createTextNode('Try Again'/*BlocklyApps.getMsg('dialogCancel')*/));
        cancel.addEventListener('click', BlocklyApps.hideDialog, true);
        cancel.addEventListener('touchend', BlocklyApps.hideDialog, true);
        buttonDiv.appendChild(cancel);

        var ok = document.createElement('button');
        ok.className = 'secondary';
        ok.appendChild(document.createTextNode('Continue'/*BlocklyApps.getMsg('dialogOk')*/));
        ok.addEventListener('click', Maze.nextLevel, true);
        ok.addEventListener('touchend', Maze.nextLevel, true);
        buttonDiv.appendChild(ok);

        BlocklyApps.showDialog(content, null, false, true, style,
            function() {
                document.body.removeEventListener('keydown',
                    BlocklyApps.congratulationsKeyDown_, true);
            });
        document.body.addEventListener('keydown',
            BlocklyApps.congratulationsKeyDown_, true);

    } else {
	
		var tryButton = document.createElement('button');
        tryButton.appendChild(
            document.createTextNode('Try Again'/*BlocklyApps.getMsg('dialogCancel')*/));
        tryButton.addEventListener('click', BlocklyApps.hideDialog, true);
        tryButton.addEventListener('touchend', BlocklyApps.hideDialog, true);
        buttonDiv.appendChild(tryButton);

        var nextLevel = document.createElement('button');
        nextLevel.className = 'secondary';
        nextLevel.appendChild(document.createTextNode('Task Area'/*BlocklyApps.getMsg('dialogOk')*/));
        //nextLevel.addEventListener('click', Maze.nextLevel, true);
		nextLevel.addEventListener('click', function () {
												var win = window.open("../BP_Code/apps/BP/index.html?ver=2", '_blank');
												//win.focus();
											} , true);
        nextLevel.addEventListener('touchend', Maze.nextLevel, true);
        buttonDiv.appendChild(nextLevel);

        BlocklyApps.showDialog(content, null, false, true, style,
            function() {
                document.body.removeEventListener('keydown',
                    BlocklyApps.congratulationsKeyDown_, true);
            });
        document.body.addEventListener('keydown',
            BlocklyApps.congratulationsKeyDown_, true);
		
		/*
        var ok = document.createElement('button');
        ok.className = 'secondary';
        ok.addEventListener('click', BlocklyApps.hideDialog, true);
        ok.addEventListener('touchend', BlocklyApps.hideDialog, true);
        ok.appendChild(document.createTextNode(BlocklyApps.getMsg('dialogOk')));
        buttonDiv.appendChild(ok);
        BlocklyApps.showDialog(content, null, false, true, style,
            BlocklyApps.stopDialogKeyDown);
        BlocklyApps.startDialogKeyDown();
		*/
    }

    var pegSpin = document.getElementById('pegSpinBP');
    pegSpin.style.backgroundImage = 'url(' + Maze.SKIN.sprite + ')';

};

/**----------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------Mixed idioms msgDisplay - subclass of msgDisplayParent---------------
-----------------------------------------------------------------------------------------------------------------------*/

// define the sub-class of version
function msgDisplayMixed() {
    // Call the parent constructor
    msgDisplayParent.call(this);
};

// inherit msgDisplayParent
msgDisplayMixed.prototype = new msgDisplayParent();
// correct the constructor pointer because it points to msgDisplayParent
msgDisplayMixed.prototype.constructor = msgDisplayMixed;
// Keep pointer to super.
msgDisplayMixed.prototype.parent = msgDisplayParent.prototype; //How to call parent? this.parent.method.call(this);

msgDisplayMixed.prototype.level_1 = function(content, style, origin, toolbar) {

    /*
    Adiel - Removed first message which is introduction video in Hebrew for review purposes of paper in ICSE 2016
    content = document.getElementById('dialogHelp_Level_1_1_BP_ver2');
    style = {
        width: 'auto', //430px
        top: '260px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '420px';
    origin = toolbar[0].getSvgRoot();
    var button1 = document.getElementById("dialogHelp_Level_1_1_button_BP_ver2");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
    */
                content = document.getElementById('dialogHelpStack_BP_ver2');
                style = {
                    width: 'auto',
                    top: '260px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                origin = toolbar[0].getSvgRoot();
                var button2 = document.getElementById("dialogHelpStack_button_BP_ver2");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            // Show run help dialogue.
                            content = document.getElementById('dialogHelpRun');
                            style = {
                                width: '360px',
                                top: '410px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '400px';
                            origin = document.getElementById('runButton');
                            //Mark All LevelsHelp has been seen
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                            Maze.markLevelHelp();
                        }, false);
                }
                /*
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    */
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayMixed.prototype.level_2 = function(content, style, origin, toolbar) {
    content = document.getElementById('dialogHelpLevel_2_BP_ver2');
    style = {
        width: '400px',
        top: '255px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '430px';
    origin = toolbar[0].getSvgRoot();
    var button1 = document.getElementById("dialogHelpLevel_2_button_BP_ver2");
    if (button1.addEventListener) {
        button1.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark All LevelsHelp has been seen
                Maze.markLevelHelp();
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayMixed.prototype.level_3 = function(content, style, origin, toolbar, userBlocks) {
    this.parent.level_3.apply(this, arguments);
    /*
    if (userBlocks.indexOf('scoped_request') == -1) { //Smart - If the user didn't use request we notify with a help message.
        content = document.getElementById('dialogHelpRepeat_BP_ver2');
        style = {
            width: '360px',
            top: '340px'
        };
        style[Blockly.RTL ? 'right' : 'left'] = '425px';
        origin = toolbar[0].getSvgRoot();
        Maze.markLevelHelp(); //Mark All LevelsHelp has been seen
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
    */
};

msgDisplayMixed.prototype.level_4 = function(content, style, origin, toolbar, userBlocks) {
    //if (userBlocks.indexOf('bp_repeat_forever') == -1) {
    content = document.getElementById('dialogHelpRepeatMany_BP_ver1');
    style = {
        width: '360px',
        top: '350px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '425px';
    origin = toolbar[0].getSvgRoot();
    var button = document.getElementById("dialogHelpRepeatMany_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                //Mark all help signs have been seen (third message)
                Maze.markLevelHelp();
            }, false);
    }
    //}
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayMixed.prototype.level_5 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_5_1_BP_ver2');
    style = {
        width: '360px',
        height: 'auto',
        top: '320px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '560px';
    origin = toolbar[3].getSvgRoot();
    //Attach a listener to the button-1
    var button = document.getElementById("dialogHelp_Level_5_1_button_BP_ver2");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Hide the first message for the user
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_5_2_BP_ver2');
                style = {
                    width: '360px',
                    height: '80px',
                    top: '190px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '960px';
                var origin2 = toolbar[3].getSvgRoot();
                //var origin2 = Blockly.mainWorkspace.getTopBlocks(true)[0].getSvgRoot();
                //Attach a listener to the button-1
                var button2 = document.getElementById("dialogHelp_Level_5_2_button_BP_ver2");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Hide the second message from the user
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_5_3_BP_ver2');
                            style = {
                                width: '360px',
                                height: '220px',
                                top: '475px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '960px';
                            //origin = toolbar[3].getSvgRoot();
                            if (Blockly.mainWorkspace.getTopBlocks(true).length > 0) {
                                origin = Blockly.mainWorkspace.getTopBlocks(true)[1].getSvgRoot();
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                            //TODO: Hide the third message and show click on listener
                            //BlocklyApps.hideDialog(false);
                            var button3 = document.getElementById("dialogHelp_Level_5_3_button_BP_ver2");
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        // Show run help dialog - duplicate code, think about this
                                        content = document.getElementById('dialogHelpRun');
                                        style = {
                                            width: '360px',
                                            height: '80px',
                                            top: '410px'
                                        };
                                        style[Blockly.RTL ? 'right' : 'left'] = '400px';
                                        var origin4 = document.getElementById('runButton');
                                        BlocklyApps.showDialog(content, origin4, true, false, style, null);
                                        //Finished 3 message.
                                        //Mark all help signs have been seen
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                        }, false);
                }
                //Show the second message
                BlocklyApps.showDialog(content, origin2, true, false, style, null);
            }, false);
    }
    //Show the first message on the pallet
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayMixed.prototype.level_6 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_6_1_BP_ver1');
    style = {
        width: '360px',
        top: '265px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '415px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[0];
    //origin = document.getElementById('runButton');
    var button = document.getElementById("dialogHelp_Level_6_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                // Show run help dialogue - duplicate code, think about this
                content = document.getElementById('dialogHelp_Level_6_2_BP_ver1');
                style = {
                    width: '360px',
                    top: '235px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '985px';
                var origin2 = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_6_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            //Finished 2 message.
                            //Mark all help signs have been seen
                            Maze.markLevelHelp();
                        }, false);
                }
                BlocklyApps.showDialog(content, origin2, true, false, style, null);
            }, false);
    }
    //Show the first message on the pallet
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
}

msgDisplayMixed.prototype.level_7 = function(content, style, origin, toolbar, userBlocks) {

    //Open the updated category containing bSync idiom - flyout
    Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.firstChild_.blocks);
    content = document.getElementById('dialogHelp_Level_7_1_BP_ver1');
    style = {
        width: '360px',
        top: '345px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '580px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3];
    var button = document.getElementById("dialogHelp_Level_7_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Hide the old message
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_7_2_BP_ver1');
                style = {
                    width: '600px', //TODO: Hard coded
                    //height: '160px',
                    top: '345px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '580px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_7_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            //Close the toolbox containing the bSync idiom
                            Blockly.Toolbox.flyout_.hide();
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_7_4_BP_ver1'); //Left hand rule - Same message for version 1 and version 2
                            style = {
                                width: '360px',
                                //height: '160px',
                                top: '285px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '1080px';
                            origin = toolbar[3];
                            var button4 = document.getElementById("dialogHelp_Level_7_4_button_BP_ver1"); //Left hand rule - Same message for version 1 and version 2
                            if (button4.addEventListener) {
                                button4.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        // Show run help dialogue - duplicate code, think about this
                                        content = document.getElementById('dialogHelpRun');
                                        style = {
                                            width: '360px',
                                            top: '410px'
                                        };
                                        style[Blockly.RTL ? 'right' : 'left'] = '400px';
                                        var origin4 = document.getElementById('runButton');
                                        BlocklyApps.showDialog(content, origin4, true, false, style, null);
                                        //Mark all help signs have been seen (third message)
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);
                        }, false);
                }
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayMixed.prototype.level_8 = function(content, style, origin, toolbar, userBlocks) {
    content = document.getElementById('dialogHelp_Level_8_1_BP_ver1');
    style = {
        width: '360px',
        top: '150px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '420px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3]; //TODO: Do we need this origin even though it's not defined?
    var button = document.getElementById("dialogHelp_Level_8_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_8_2_BP_ver1');
                style = {
                    width: '360px',
                    //height: '160px',
                    top: '150px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_8_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            //Mark all help signs have been seen (third message)
                            Maze.markLevelHelp();
                        }, false);
                }
                //Show the second message
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    //Show the first message on the pallet - TODO: Repeated code, re factor this code segment.
}

msgDisplayMixed.prototype.level_9 = function(content, style, origin) {

    //Open the updated category containing bSync idiom - flyout
    Blockly.Toolbox.flyout_.show(Blockly.Toolbox.tree_.firstChild_.blocks);
    content = document.getElementById('dialogHelp_Level_9_1_BP_ver1');
    style = {
        width: '360px',
        top: '225px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '580px';
    //origin = toolbar[3].getSvgRoot();
    origin = toolbar[3];
    var button = document.getElementById("dialogHelp_Level_9_1_button_BP_ver1");
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                //Close the toolbox containing the bSync idiom
                Blockly.Toolbox.flyout_.hide();
                //Hide the old message
                BlocklyApps.hideDialog(false);
                content = document.getElementById('dialogHelp_Level_9_2_BP_ver1');
                style = {
                    width: '360px',
                    //height: '160px',
                    top: '245px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '710px';
                //origin = toolbar[3].getSvgRoot();
                origin = toolbar[3];
                var button2 = document.getElementById("dialogHelp_Level_9_2_button_BP_ver1");
                if (button2.addEventListener) {
                    button2.addEventListener("click",
                        function() {
                            BlocklyApps.hideDialog(false);
                            content = document.getElementById('dialogHelp_Level_9_3_BP_ver1');
                            style = {
                                width: '360px',
                                //height: '160px',
                                top: '370px'
                            };
                            style[Blockly.RTL ? 'right' : 'left'] = '710px';
                            //origin = toolbar[3].getSvgRoot();
                            origin = toolbar[3];
                            var button3 = document.getElementById("dialogHelp_Level_9_3_button_BP_ver1");
                            if (button3.addEventListener) {
                                button3.addEventListener("click",
                                    function() {
                                        BlocklyApps.hideDialog(false);
                                        //Mark all help signs have been seen (third message)TODO: Update in Maze
                                        Maze.markLevelHelp();
                                    }, false);
                            }
                            BlocklyApps.showDialog(content, origin, true, false, style, null);

                        }, false);
                }
                BlocklyApps.showDialog(content, origin, true, false, style, null);
            }, false);
    }
    this.showMsg(true, content, style, origin); //Flag is true here, TODO: is it needed?
    return;
};

msgDisplayMixed.prototype.level_10 = function(content, style, origin) {
    var styleArray = [];
    styleArray[0] = {
        width: "360px",
        top: "360px",
        left: "350px"
    }, styleArray[1] = {
        width: "360px",
        top: "140px",
        left: "350px"
    }, styleArray[2] = {
        width: "360px",
        top: "440px",
        left: "550px"
    }, styleArray[3] = {
        width: "360px",
        top: "300px",
        left: "740px"
    }, styleArray[4] = {
        width: "360px",
        top: "300px",
        left: "740px"
    }, styleArray[5] = {
        width: "360px",
        top: "265px",
        left: "1100px"
    }, styleArray[6] = {
        width: "360px",
        top: "600px",
        left: "740px"
    }, styleArray[7] = {
        width: "360px",
        top: "625px",
        left: "1100px"
    }, styleArray[8] = {
        width: "360px",
        top: "525px",
        left: "200px"
    };
    styleArray['level'] = "1";
    this.parent.level_10.apply(this, [styleArray], arguments); //"1" is version high idioms
    return;
};

msgDisplayMixed.prototype.endLevelExplanation = function() {
    //How to call methods in super
    //this.parent.endLevelExplanation.call(this);
    var content = document.getElementById('dialogDoneBP');
    var buttonDiv = document.getElementById('dialogDoneButtonsBP');
    buttonDiv.textContent = '';
    var style = {
        width: '600px', //Width and height are determined by the child iFrame element. TODO: Maybe refactor this?
        //height: '400px', //A hard-coded bug override, let because after we displayed BP help with timeout and buttons , height was different.
        //width: '100%',//Moved these features to template.soy file.
        height: 'auto',
        //resize: 'both',
        //overflow: 'auto',
        left: '30%',
        top: '2em'
    };
    var iframeDiv = document.getElementById('iframeDiv');
    var iframe = document.getElementById('iframeDialogDoneBP');
    if (Maze.LEVEL == 1) {
        iframeDiv.style.height = "300px";
        iframe.setAttribute("src", "level_1_Explanation_ver2.html");
    } else if (Maze.LEVEL == 5) {
        iframeDiv.style.height = "400px";
        iframe.setAttribute("src", "level_5_Explanation_ver1.html");
    } else if (Maze.LEVEL == 6) {
        iframeDiv.style.height = "200px";
        iframe.setAttribute("src", "level_6_Explanation_ver1.html");
    } else if (Maze.LEVEL == 7) {
        iframeDiv.style.height = "350px";
        iframe.setAttribute("src", "level_7_Explanation_ver1.html");
    } else if (Maze.LEVEL == 9) {
        if(Maze.counterOfRightTurns > 0) {
            iframeDiv.style.height = "420px";
            iframe.setAttribute("src", "level_10_Explanation_ver1.html");
            this.MaxLevelCongratulations = true;
        }
        else {
            iframeDiv.style.height = "420px";
            iframe.setAttribute("src", "level_10_Explanation_2_ver1.html");
        }
    } else {
        iframeDiv.style.height = "100px";
        iframe.setAttribute("src", "levelDefaultExplanation.html");
    }
    if (Maze.LEVEL < Maze.MAX_LEVEL) { //Play according to levels here  
        var cancel = document.createElement('button');
        cancel.appendChild(
            document.createTextNode('Try Again'));
        cancel.addEventListener('click', BlocklyApps.hideDialog, true);
        cancel.addEventListener('touchend', BlocklyApps.hideDialog, true);
        buttonDiv.appendChild(cancel);

        var ok = document.createElement('button');
        ok.className = 'secondary';
        ok.appendChild(document.createTextNode('Continue'));
        ok.addEventListener('click', Maze.nextLevel, true);
        ok.addEventListener('touchend', Maze.nextLevel, true);
        buttonDiv.appendChild(ok);

        BlocklyApps.showDialog(content, null, false, true, style,
            function() {
                document.body.removeEventListener('keydown',
                    BlocklyApps.congratulationsKeyDown_, true);
            });
        document.body.addEventListener('keydown',
            BlocklyApps.congratulationsKeyDown_, true);

    } else {
    
        var tryButton = document.createElement('button');
        tryButton.appendChild(
            document.createTextNode('Try Again'));
        tryButton.addEventListener('click', BlocklyApps.hideDialog, true);
        tryButton.addEventListener('touchend', BlocklyApps.hideDialog, true);
        buttonDiv.appendChild(tryButton);

        var nextLevel = document.createElement('button');
        nextLevel.className = 'secondary';
        nextLevel.appendChild(document.createTextNode('Task Area'));
        nextLevel.addEventListener('click', function () {
                                                var win = window.open("../BP_Code/apps/BP/index.html?ver=2", '_blank');
                                                //win.focus();
                                            } , true);
        nextLevel.addEventListener('touchend', Maze.nextLevel, true);
        buttonDiv.appendChild(nextLevel);

        BlocklyApps.showDialog(content, null, false, true, style,
            function() {
                document.body.removeEventListener('keydown',
                    BlocklyApps.congratulationsKeyDown_, true);
            });
        document.body.addEventListener('keydown',
            BlocklyApps.congratulationsKeyDown_, true);      
    }

    var pegSpin = document.getElementById('pegSpinBP');
    pegSpin.style.backgroundImage = 'url(' + Maze.SKIN.sprite + ')';

};