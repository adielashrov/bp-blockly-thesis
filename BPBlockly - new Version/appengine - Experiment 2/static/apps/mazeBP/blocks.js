/**
 * Blockly Apps: Maze Blocks
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
 * @fileoverview Blocks for Blockly's Maze application.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

// Extensions to Blockly's language and JavaScript generator.

Blockly.JavaScript = Blockly.Generator.get('JavaScript');

Blockly.Language.maze_moveForward = {
  // Block for moving forward.
  helpUrl: 'http://code.google.com/p/blockly/wiki/Move',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Maze_moveForward'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Maze_moveForwardTooltip'));
  }
};

Blockly.JavaScript.maze_moveForward = function() {
  // Generate JavaScript for moving forward.
  return 'Maze.moveForward(\'block_id_' + this.id + '\');\n';
};

Blockly.Language.maze_turn = {
  // Block for turning left or right.
  helpUrl: 'http://code.google.com/p/blockly/wiki/Turn',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Maze_turnTooltip'));
  }
};

Blockly.Language.maze_turn.DIRECTIONS =
    [[BlocklyApps.getMsg('Maze_turnLeft'), 'turnLeft'],
     [BlocklyApps.getMsg('Maze_turnRight'), 'turnRight']];

Blockly.JavaScript.maze_turn = function() {
  // Generate JavaScript for turning left or right.
  var dir = this.getTitleValue('DIR');
  return 'Maze.' + dir + '(\'block_id_' + this.id + '\');\n';
};

Blockly.Language.maze_if = {
  // Block for 'if' conditional if there is a path.
  helpUrl: '',
  init: function() {
    this.setColour(210);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendTitle(BlocklyApps.getMsg('Maze_doCode'));
    this.setTooltip(BlocklyApps.getMsg('Maze_ifTooltip'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Language.maze_if.DIRECTIONS =
    [[BlocklyApps.getMsg('Maze_pathAhead'), 'isPathForward'],
     [BlocklyApps.getMsg('Maze_pathLeft'), 'isPathLeft'],
     [BlocklyApps.getMsg('Maze_pathRight'), 'isPathRight']];

Blockly.JavaScript.maze_if = function() {
  // Generate JavaScript for 'if' conditional if there is a path.
  var argument = 'Maze.' + this.getTitleValue('DIR') +
      '(\'block_id_' + this.id + '\')';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  var code = 'if (' + argument + ') {\n' + branch + '}\n';
  return code;
};

Blockly.Language.maze_ifElse = {
  // Block for 'if/else' conditional if there is a path.
  helpUrl: '',
  init: function() {
    this.setColour(210);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendTitle(BlocklyApps.getMsg('Maze_doCode'));
    this.appendStatementInput('ELSE')
        .appendTitle(BlocklyApps.getMsg('Maze_elseCode'));
    this.setTooltip(BlocklyApps.getMsg('Maze_ifelseTooltip'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Language.maze_ifElse.DIRECTIONS = Blockly.Language.maze_if.DIRECTIONS;

Blockly.JavaScript.maze_ifElse = function() {
  // Generate JavaScript for 'if/else' conditional if there is a path.
  var argument = 'Maze.' + this.getTitleValue('DIR') +
      '(\'block_id_' + this.id + '\')';
  var branch0 = Blockly.JavaScript.statementToCode(this, 'DO');
  var branch1 = Blockly.JavaScript.statementToCode(this, 'ELSE');
  var code = 'if (' + argument + ') {\n' + branch0 +
             '} else {\n' + branch1 + '}\n';
  return code;
};

Blockly.Language.maze_forever = {
  // Do forever loop.
  helpUrl: 'http://code.google.com/p/blockly/wiki/Repeat',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Maze_repeatUntil'))
        .appendTitle(new Blockly.FieldImage(Maze.SKIN.marker, 12, 16));
    this.appendStatementInput('DO')
        .appendTitle(BlocklyApps.getMsg('Maze_doCode'));
    this.setPreviousStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Maze_whileTooltip'));
  }
};

Blockly.JavaScript.maze_forever = function() {
  // Generate JavaScript for do forever loop.
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + this.id + '\'') + branch;
  }
  return 'while (true) {\n' + branch + '}\n';
};
/*
//Adiel - test blocks
Blockly.Language.maze_moveForwardBP = {
  // Block for moving forward.
  helpUrl: 'http://code.google.com/p/blockly/wiki/Move',
  init: function() {
    this.setColour(290);
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
  var req = '[' + '\(\'forward\'\)' + ']';//#TODO: Can I do this better?Gera?
  var wait = '[]';
  var block = '[]';
  
  // If the parameter is a single event, wrap it with square brackets
  if( req.match(/^\'.*\'/) ) req = '['+req+']';//#TODO: Ideas why this is isn't working?Gera?
  if( wait.match(/^\'.*\'/) ) wait = '['+wait+']';
  if( block.match(/^\'.*\'/) ) block = '['+block+']';
  
    // Generate JavaScript for bSync.
  return 'yield({request:' + req + ', wait:' +  wait + ', block:' + block + '});';
  
};
*/