
var echoButton;
var voiceButton;
var closeButton;

var originalSoundDialog;
var originalSoundDialogHTML = "\
<div class='audio-options'>\
  <h3>Original Sound</h3>\
  <p>Settings take effect on device change</p>\
  <div>\
    <input type='checkbox' id='cancelecho' name='cancelecho' checked>\
    <label for='cancelecho'>Cancel echo</label>\
  </div>\
  <div>\
    <input type='checkbox' id='optimizevoice' name='optimizevoice' checked>\
    <label for='optimizevoice'>Optimize for voice</label>\
  </div>\
  <button id='os-close'>Close</button>\
</div>\
";

function initOriginalSoundDialog () {
  if (originalSoundDialog) {
    return;
  }
  var td = window.top.document;
  if (window.location == window.parent.location) {
    originalSoundDialog = td.createElement("dialog");
    originalSoundDialog.innerHTML = originalSoundDialogHTML;
    td.body.append(originalSoundDialog);
  }
  echoButton = td.querySelector("#cancelecho");
  voiceButton = td.querySelector("#optimizevoice");
  closeButton = td.querySelector("#os-close");
  closeButton.addEventListener("click", function() { originalSoundDialog.close(); });
}

var oldUserMedia;

function newUserMedia (c) {
  console.log("newUserMedia");
  if (c.audio) {
    const echo = echoButton.checked;
    const voice = voiceButton.checked;
    c.audio.echoCancellation = echo;
    c.audio.autoGainGontrol = voice;
    c.audio.noisesuppression = voice;
    console.log(JSON.stringify(c));
  }
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
