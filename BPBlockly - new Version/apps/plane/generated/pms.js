// This file was automatically generated from common.soy.
// Please don't edit this file by hand.

if (typeof apps == 'undefined') { var apps = {}; }


apps.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '<div style="display: none"><span id="subtitle">n\'ambient ëd programassion visual</span><span id="blocklyMessage">Blockly</span><span id="codeTooltip">Vëdde ël còdes JavaScript generà.</span><span id="linkTooltip">Argistré e lijé ai blòch.</span><span id="runTooltip">Fé andé ël programa definì dai blòch ant lë \\nspassi ëd travaj. </span><span id="runProgram">Fé andé ël programa</span><span id="resetProgram">Buté torna coma al prinsipi</span><span id="dialogOk">Va bin</span><span id="dialogCancel">Anulé</span><span id="catLogic">Lògica</span><span id="catLoops">Liasse</span><span id="catMath">Matemàtica</span><span id="catText">Test</span><span id="catLists">Liste</span><span id="catColour">Color</span><span id="catVariables">Variàbij</span><span id="catProcedures">Procedure</span><span id="httpRequestError">A-i é staje un problema con l\'arcesta.</span><span id="linkAlert">Ch\'a partagia ij sò blòch grassie a sta liura: %1</span><span id="hashError">An dëspias, \'%1% a corëspond a gnun programa salvà.</span><span id="xmlError">A l\'é nen podusse carié so archivi salvà. Miraco a l\'é stàit creà con na version diferenta ëd Blockly?</span><span id="listVariable">lista</span><span id="textVariable">test</span></div>';
};


apps.dialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogShadow" class="dialogAnimate"></div><div id="dialogBorder"></div><div id="dialog"></div>';
};


apps.codeDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogCode" class="dialogHiddenContent"><pre id="containerCode"></pre>' + apps.ok(null, null, opt_ijData) + '</div>';
};


apps.storageDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogStorage" class="dialogHiddenContent"><div id="containerStorage"></div>' + apps.ok(null, null, opt_ijData) + '</div>';
};


apps.ok = function(opt_data, opt_ignored, opt_ijData) {
  return '<div class="farSide" style="padding: 1ex 3ex 0"><button class="secondary" onclick="BlocklyApps.hideDialog(true)">Va bin</button></div>';
};

;
// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof planepage == 'undefined') { var planepage = {}; }


planepage.messages = function(opt_data, opt_ignored, opt_ijData) {
  return apps.messages(null, null, opt_ijData) + '<div style="display: none"><span id="Plane_rows">Linie: %1</span><span id="Plane_getRows">linie (%1)</span><span id="Plane_rows1">linie ëd prima classa: %1</span><span id="Plane_getRows1">linie ëd prima classa (%1)</span><span id="Plane_rows2">linie ëd seconda classa: %1</span><span id="Plane_getRows2">linie ëd seconda classa (%1)</span><span id="Plane_seats">Sedij: %1</span><span id="Plane_placeholder">?</span><span id="Plane_setSeats">sedij =</span></div>';
};


planepage.start = function(opt_data, opt_ignored, opt_ijData) {
  var output = planepage.messages(null, null, opt_ijData) + '<table width="100%"><tr><td><h1><span id="title"><a href="../index.html">Blockly</a> : Avion</span> \\u0026nbsp; ';
  for (var i128 = 1; i128 < 4; i128++) {
    output += ' ' + ((i128 == opt_ijData.level) ? '<span class="tab" id="selected">' + soy.$$escapeHtml(i128) + '</span>' : (i128 < opt_ijData.level) ? '<a class="tab previous" href="?lang=' + soy.$$escapeHtml(opt_ijData.lang) + '&level=' + soy.$$escapeHtml(i128) + '">' + soy.$$escapeHtml(i128) + '</a>' : '<a class="tab" href="?lang=' + soy.$$escapeHtml(opt_ijData.lang) + '&level=' + soy.$$escapeHtml(i128) + '">' + soy.$$escapeHtml(i128) + '</a>');
  }
  output += '</h1></td><td class="farSide"><select id="languageMenu" onchange="BlocklyApps.changeLanguage();"></select></td></tr></table><script type="text/javascript" src="../slider.js"><\/script><svg id="plane" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="600" height="256" viewBox="0 142 600 256"><defs><g id="row1st"><rect class="seat1st" width="10" height="10" x="75" y="245" /><rect class="seat1st" width="10" height="10" x="75" y="256" /><rect class="seat1st" width="10" height="10" x="75" y="274" /><rect class="seat1st" width="10" height="10" x="75" y="285" /></g><g id="row2nd"><rect class="seat2nd" width="10" height="8" x="75" y="245" /><rect class="seat2nd" width="10" height="8" x="75" y="253" /><rect class="seat2nd" width="10" height="8" x="75" y="271" /><rect class="seat2nd" width="10" height="8" x="75" y="279" /><rect class="seat2nd" width="10" height="8" x="75" y="287" /></g><linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" style="stop-color:#fff;stop-opacity:0" /><stop offset="100%" style="stop-color:#fff;stop-opacity:1" /></linearGradient><linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#fff;stop-opacity:0" /><stop offset="100%" style="stop-color:#fff;stop-opacity:1" /></linearGradient></defs><path d="M 404,1 373,15 230,244 230,297 373,524 404,542 330,351 330,189 z" id="wing" /><path d="m 577,269 22,-93 -27,6 -44,88 44,88 27,6 z" id="tail" /><path d="m 483,296 h -407 c -38,0 -75,-13 -75,-26 c 0,-13 38,-26 75,-26 h 407 l 94,24 z" id="fuselage" /><rect width="610" height="100" x="-5" y="142" fill="url(#grad1)" /><rect width="610" height="100" x="-5" y="298" fill="url(#grad2)" /><text id="row1stText" x="55" y="380"></text><text id="row2ndText" x="350" y="380"></text><text x="55" y="210"><tspan id="seatText"></tspan><tspan id="seatYes" style="fill: #0c0;" dy="10">&#x2713;</tspan><tspan id="seatNo" style="fill: #f00;" dy="10">&#x2717;</tspan></text>' + ((opt_ijData.level > 1) ? '<rect id="crew_right" class="crew" width="10" height="10" x="35" y="256" /><rect id="crew_left" class="crew" width="10" height="10" x="35" y="274" />' : '') + '</svg><p>';
  switch (opt_ijData.level) {
    case 1:
      output += 'N\'avion a l\'ha un nùmer ëd file ëd sedij da passëgé. Minca fila a l\'ha quatr sedij.';
      break;
    case 2:
      output += 'N\'avion a l\'ha doi sedij ant la cabin-a ëd pilotage (për ël pilòta e ël cò-pilòta), e un chèich nùmer ëd file ëd sedij pr\'ij passagé. Minca fila a conten quatr sedij.';
      break;
    case 3:
      output += 'N\'avion a l\'ha doi sedij ant la cabin-a ëd pilotage (për ël pilòta e ël cò-pilòta) e un chèich nùmer ëd file ëd sedij pr\'ij passagé ëd prima e sconda classa. Minca fila ëd prima classa a conten quatr sedij. Minca fila ëd seconda classa a conten sinch sedij.';
      break;
  }
  output += '</p><p>Fabriché na fórmola (sì-sota) ch\'a fa \'l cont dël nùmer total ëd sedij ant l\'avion cand che ël nùmer dle file a cangia (sì-dzora).</p><script type="text/javascript" src="../../blockly_compressed.js"><\/script><script type="text/javascript" src="../../javascript_compressed.js"><\/script><script type="text/javascript" src="../../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><script type="text/javascript" src="blocks.js"><\/script>' + planepage.toolbox(null, null, opt_ijData) + '<div id="blockly"></div>';
  return output;
};


planepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none"><block type="math_number"></block><block type="math_arithmetic"></block><block type="math_arithmetic"><title name="OP">MULTIPLY</title></block>' + ((opt_ijData.level <= 2) ? '<block type="plane_get_rows"></block>' : '<block type="plane_get_rows1st"></block><block type="plane_get_rows2nd"></block>') + '</xml>';
};
