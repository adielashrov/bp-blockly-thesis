custom = {};

custom.startGame = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Start_game',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Start game");
        this.setOutput(true, 'event');
        this.setTooltip('Start game event');
    }
};

Blockly.JavaScript.startGame = function() {
    return ['"startGame"', Blockly.JavaScript.ORDER_NONE];
};
//Currently not working - debug.
/*
custom.initialConfiguration = {
  //helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendTitle("Board of");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["5*20", "5 20"], ["5*5", "5 5"], ["3*3", "33"]]), "board_size");
    this.appendDummyInput()
        .appendTitle("with ");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("5"), "num_of_red_bricks");
    this.appendDummyInput()
        .appendTitle("red, ");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("5"), "num_of_gold_bricks");
    this.appendDummyInput()
        .appendTitle("gold, ");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("5"), "num_of_green_bricks");
    this.appendDummyInput()
        .appendTitle("green, ");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("5"), "num_of_blue_bricks");
    this.appendDummyInput()
        .appendTitle("blue, and");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput("5"), "num_of_pink_bricks");
    this.appendDummyInput()
    .appendTitle("pink bricks.");
    this.setInputsInline(true);
    this.setOutput(true, 'event');
    this.setTooltip('');
  }
};

Blockly.JavaScript.initialConfiguration = function() {
  var dropdown_board_size = this.getTitleValue('board_size');
  var text_num_of_red_bricks = this.getTitleValue('num_of_red_bricks');
  var text_num_of_gold_bricks = this.getTitleValue('num_of_gold_bricks');
  var text_num_of_green_bricks = this.getTitleValue('num_of_green_bricks');
  var text_num_of_blue_bricks = this.getTitleValue('num_of_blue_bricks');
  var text_num_of_pink_bricks = this.getTitleValue('num_of_pink_bricks');
  var code = "";
  //var code =    'board_size:' + dropdown_board_size + ',' + 'num_of_red_bricks:' + text_num_of_red_bricks + ',' + 'num_of_gold_bricks:' + text_num_of_gold_bricks + ',' +  'num_of_green_bricks:' + text_num_of_green_bricks + ',' +  'num_of_blue_bricks:' + text_num_of_blue_bricks + ',' +  'num_of_pink_bricks:' + text_num_of_pink_bricks;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
*/
custom.acceleratePad = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Accelerate_pad',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Accelerate pad");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["left", "'acceleratePadLeft'"],
                ["right", "'acceleratePadRight'"]
            ]), "menu");
        this.setInputsInline(true);
        this.setOutput(true, 'event');
        this.setTooltip('');
    }
};

Blockly.JavaScript.acceleratePad = function() {
    var dropdown_menu = this.getTitleValue('menu');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_menu;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

custom.color_brick = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Color_brick',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Color brick ");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["green", "'colorBrickGreen'"],
                ["gold", "'colorBrickGold'"],
                ["blue", "'colorBrickBlue'"],
                ["red", "'colorBrickRed'"]
            ]), "menu");
        this.setInputsInline(true);
        this.setOutput(true, 'event');
        this.setTooltip('');
    }
};

Blockly.JavaScript.color_brick = function() {
    var dropdown_menu = this.getTitleValue('menu');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_menu;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

custom.reverse_direction = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Reverse_ball',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Reverse ball");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["x", "'reverseBallXDirection'"],
                ["y", "'reverseBallYDirection'"]
            ]), "menu");
        this.appendDummyInput()
            .appendTitle("direction");
        this.setInputsInline(true);
        this.setOutput(true, "event");
        this.setTooltip('');
    }
};

Blockly.JavaScript.reverse_direction = function() {
    var dropdown_menu = this.getTitleValue('menu');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_menu;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

custom.destroyCurrentBricks = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Destroy_brick',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Destroy brick");
        this.setOutput(true, 'event');
        this.setTooltip('Destroy current bricks');
    }
};

Blockly.JavaScript.destroyCurrentBricks = function() {
    return ['"destroyCurrentBricks"', Blockly.JavaScript.ORDER_NONE];
};

custom.changeXSpeedRelativeToPad = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Change_x_speed',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Change x speed relative to pad");
        this.setOutput(true, 'event');
        this.setTooltip('Change x speed relative to pad');
    }
};

Blockly.JavaScript.changeXSpeedRelativeToPad = function() {
    return ['"changeXSpeedRelativeToPad"', Blockly.JavaScript.ORDER_NONE];
};

custom.increaseScore = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Increase_score',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Increase score");
        this.setOutput(true, 'event');
        this.setTooltip('Increase score event');
    }
};

Blockly.JavaScript.increaseScore = function() {
    return ['"increaseScore"', Blockly.JavaScript.ORDER_NONE];
};

custom.decreaseScore = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Decrease_score',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Decrease score");
        this.setOutput(true, 'event');
        this.setTooltip('Decrease score event');
    }
};

Blockly.JavaScript.decreaseScore = function() {
    return ['"decreaseScore"', Blockly.JavaScript.ORDER_NONE];
};

custom.initScore = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Init_score',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Init score");
        this.setOutput(true, 'event');
        this.setTooltip('Init score event');
    }
};

Blockly.JavaScript.initScore = function() {
    return ['"initScore"', Blockly.JavaScript.ORDER_NONE];
};

custom.gameStatus = {
    helpUrl: '../../../../blocks_API/game_status.html',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Game ");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["lost", "'gameLost'"],
                ["won", "'gameWon'"],
            ]), "menu");
        this.setInputsInline(true);
        this.setOutput(true, 'event');
        this.setTooltip('');
    }
};

Blockly.JavaScript.gameStatus = function() {
    var dropdown_menu = this.getTitleValue('menu');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_menu;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};


custom.showVictoryMessage = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Show_victory__message',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Show victory message");
        this.setOutput(true, 'event');
        this.setTooltip('Show victory message event');
    }
};

Blockly.JavaScript.showVictoryMessage = function() {
    return ['"showVictoryMessage"', Blockly.JavaScript.ORDER_NONE];
};

custom.key_pressed = {
    helpUrl: '../../../../blocks_API/clicked_event.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("Clicked");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["space", "'keydown-32'"],
                ["key left", "'keydown-37'"],
                ["key right", "'keydown-39'"],
                ["key up", "'keydown-38'"],
                ["key down", "'keydown-40'"],
                ["enter", "'keydown-13'"],
                /*
                ["escape", "'keydown-27'"],
                ["backspace", "'keydown-8'"],
                ["ctrl", "'keydown-17'"],
                ["alt", "'keydown-18'"],
                ["shift", "'keydown-16'"],
                ["caps-lock", "'keydown-20'"],
                ["tab", "'keydown-9'"],
                ["\\", "'keydown-220'"],
                ["`", "'keydown-192'"],
                ["[", "'keydown-219'"],
                ["\'", "'keydown-220'"],
                ["]", "'keydown-221'"],
                [";", "'keydown-59'"],
                [",", "'keydown-188'"],
                [".", "'keydown-190'"],
                ["/", "'keydown-191'"],
                ["-", "'keydown-173'"],
                ["=", "'keydown-61'"],
                ["=", "'keydown-61'"],
                */
                ["1", "'keydown-49'"],
                ["2", "'keydown-50'"],
                ["3", "'keydown-51'"],
                ["4", "'keydown-52'"],
                ["5", "'keydown-53'"],
                ["6", "'keydown-54'"],
                ["7", "'keydown-55'"],
                ["8", "'keydown-56'"],
                ["9", "'keydown-57'"],
                ["q", "'keydown-81'"],
                ["w", "'keydown-87'"],
                ["e", "'keydown-69'"],
                ["r", "'keydown-82'"],
                ["t", "'keydown-84'"],
                ["y", "'keydown-89'"],
                ["u", "'keydown-85'"],
                ["i", "'keydown-73'"],
                ["o", "'keydown-79'"],
                ["p", "'keydown-80'"],
                ["a", "'keydown-65'"],
                ["s", "'keydown-83'"],
                ["d", "'keydown-68'"],
                ["f", "'keydown-70'"],
                ["g", "'keydown-71'"],
                ["h", "'keydown-72'"],
                ["j", "'keydown-74'"],
                ["k", "'keydown-75'"],
                ["l", "'keydown-76'"],
                ["z", "'keydown-90'"],
                ["x", "'keydown-88'"],
                ["c", "'keydown-67'"],
                ["v", "'keydown-86'"],
                ["b", "'keydown-66'"],
                ["n", "'keydown-78'"],
                ["m", "'keydown-77'"]
            ]), "dropdown");
        this.setInputsInline(true);
        this.setOutput(true, 'event');
        this.setTooltip('');
    }
};

Blockly.JavaScript.key_pressed = function() {
    var dropdown_dropdown = this.getTitleValue('dropdown');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_dropdown;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

custom.ball_at = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Ball_at',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("Ball at");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["left", "'ballAtLeft'"],
                ["right", "'ballAtRight'"],
                ["top", "'ballAtTop'"],
                ["bottom", "'ballAtBottom'"]
            ]), "menu");
        this.setInputsInline(true);
        this.setOutput(true, 'event');
        this.setTooltip('');
    }
};

Blockly.JavaScript.ball_at = function() {
    var dropdown_menu = this.getTitleValue('menu');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_menu;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

custom.ball_collides_with = {
    helpUrl: '../../../../blocks_API/ball_colliades.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("Ball collides with ");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["red", "'ballCollidesWithRedBrick'"],
                ["gold", "'ballCollidesWithGoldBrick'"],
                ["green", "'ballCollidesWithGreenBrick'"],
                ["blue", "'ballCollidesWithBlueBrick'"],
                ["pink", "'ballCollidesWithPinkBrick'"],
                ["any color", "'ballCollidesWithBrick'"]
            ]), "menu")
        this.appendDummyInput()
            .appendTitle(" brick");
        this.setInputsInline(true);
        this.setOutput(true, 'event');
        this.setTooltip('');
    }
};

Blockly.JavaScript.ball_collides_with = function() {
    var dropdown_menu = this.getTitleValue('menu');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_menu;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

custom.ballHitPad = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=Ball_hit_pad',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("Ball hit pad");
        this.setOutput(true, 'event');
        this.setTooltip('Ball hit pad');
    }
};

Blockly.JavaScript.ballHitPad = function() {
    return ['"ballHitPad"', Blockly.JavaScript.ORDER_NONE];
};


custom.ballHitsBrick = {
    helpUrl: '../../../../blocks_API/ball_hits_a_brick.html',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("Ball hits ");
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown([
                ["any edge", "'ballCollidesWithBrick'"],
                ["a wide edge", "'wideEdgeCollisionOfBallAndBrick'"],
                ["a narrow edge", "'narrowEdgeCollisionOfBallAndBrick'"]
            ]), "menu")
        this.appendDummyInput()
        .appendTitle("of the brick");
        this.setInputsInline(true);
        this.setOutput(true, "event");
        this.setTooltip('');
    }
};


Blockly.JavaScript.ballHitsBrick = function() {
    var dropdown_menu = this.getTitleValue('menu');
    var code = dropdown_menu;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

custom.noMoreBricks = {
    helpUrl: '../../../../blocks_API/generic_event_help.html?event=No_more_bricks',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendTitle("No more bricks");
        this.setOutput(true, 'event');
        this.setTooltip('No more bricks event');
    }
};

Blockly.JavaScript.noMoreBricks = function() {
    return ['"noMoreBricks"', Blockly.JavaScript.ORDER_NONE];
};