
var echoButton;
var voiceButton;
var closeButton;

var originalSoundDialog;
var originalSoundElement;
var originalSoundElementHTML = "\
<div class='audio-options'>\
  <h3>Original Sound</h3>\
  <p>Settings take effect on device change</p>\
  <div style='margin-top: 4px; margin-bottom: 4px;'>\
    <input type='checkbox' id='cancelecho' name='cancelecho' checked>\
    <label for='cancelecho' style='display: inline; margin-left: 8px'>Cancel echo</label>\
  </div>\
  <div style='margin-top: 4px; margin-bottom: 4px;'>\
    <input type='checkbox' id='optimizevoice' name='optimizevoice' checked>\
    <label for='optimizevoice' style='display: inline; margin-left: 8px;'>Optimize for voice</label>\
  </div>\
  <button id='os-close' style='margin-top: 8px;'>Close</button>\
</div>\
";

function initOriginalSoundDialog () {
  if (originalSoundDialog) {
    return;
  }
  var td = window.top.document;
  if (window.location == window.parent.location) {
    originalSoundDialog = td.createElement("dialog");
    originalSoundDialog.setAttribute("style", "position: absolute; top: 0; left: 0; z-index: 9999");
    originalSoundElement = originalSoundDialog;
    originalSoundElement.innerHTML = originalSoundElementHTML;
    td.body.append(originalSoundDialog);
  }
  echoButton = td.querySelector("#cancelecho");
  voiceButton = td.querySelector("#optimizevoice");
  closeButton = td.querySelector("#os-close");
  closeButton.addEventListener("click", function() { if (originalSoundDialog) { originalSoundDialog.close(); } });
}

var oldUserMedia;

function newUserMedia (c) {
  console.log("newUserMedia");
  console.log("before: " + JSON.stringify(c));
  if (c.audio) {
    const echo = echoButton.checked;
    const voice = voiceButton.checked;
    c.audio.echoCancellation = echo;
    c.audio.autoGainControl = voice;
    c.audio.noiseSuppression = voice;
  }
  console.log("after: " + JSON.stringify(c));
  return oldUserMedia(c);
}

function replaceUserMedia () {
  console.log("replaceUserMedia started");
  const nmd = navigator.mediaDevices;
  console.log(nmd.getUserMedia);
  var msg;
  if (!oldUserMedia) {
    oldUserMedia = nmd.getUserMedia.bind(navigator.mediaDevices);
    nmd.getUserMedia = newUserMedia;
  }
  if (window.location == window.parent.location) {
    originalSoundDialog.show();
  }
  console.log(nmd.getUserMedia);
  console.log("replaceUserMedia completed");
}

initOriginalSoundDialog();
replaceUserMedia();
