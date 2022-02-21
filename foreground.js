
var echoButton;
var voiceButton;
var closeButton;

var originalSoundDialog;
var originalSoundElement;

function initOriginalSoundDialog () {
  if (originalSoundDialog) {
    return;
  }
  var td = window.top.document;
  if (window.location == window.parent.location) {
    originalSoundDialog = td.createElement("dialog");
    originalSoundDialog.setAttribute("style", "position: absolute; top: 0; left: 0; z-index: 9999");
    originalSoundElement = originalSoundDialog;
    // Google Meet uses TrustedHTML, so we cannot use innerHTML
    // instead, build the dialog programmatically
    const h = td.createElement("h3");
    const p = td.createElement("p");
    const d = td.createElement("div");
    const d1 = td.createElement("div");
    const i1 = td.createElement("input");
    const l1 = td.createElement("label");
    const d2 = td.createElement("div");
    const i2 = td.createElement("input");
    const l2 = td.createElement("label");
    const b = td.createElement("button");
    h.innerText = "Original Sound";
    p.innerText = "Settings take effect on device change";
    d1.setAttribute("style", "margin-top: 4px; margin-button: 4px;");
    i1.setAttribute("type", "checkbox");
    i1.setAttribute("id", "cancelecho");
    i1.setAttribute("name", "cancelecho");
    i1.setAttribute("checked", true);
    l1.setAttribute("for", "cancelecho");
    l1.setAttribute("style", "display: inline; margin-left: 8px;");
    l1.innerText = "Cancel echo";
    d2.setAttribute("style", "margin-top: 4px; margin-button: 4px;");
    i2.setAttribute("type", "checkbox");
    i2.setAttribute("id", "optimizevoice");
    i2.setAttribute("name", "optimizevoice");
    i2.setAttribute("checked", true);
    l2.setAttribute("for", "optimizevoice");
    l2.setAttribute("style", "display: inline; margin-left: 8px;");
    l2.innerText = "Optimize for voice";
    b.setAttribute("id", "os-close");
    b.setAttribute("style", "margin-top: 8px;");
    b.innerText = "Close";
    d1.append(i1, l1);
    d2.append(i2, l2);
    d.append(d1, d2);
    originalSoundDialog.append(h, p, d, b);
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
    if (c.audio.mandatory || c.audio.optional) {
      c.audio.mandatory.echoCancellation = echo;
      c.audio.mandatory.googAutoGainControl = voice;
      c.audio.mandatory.googNoiseSuppression = voice;
    } else {
      c.audio.echoCancellation = echo;
      c.audio.autoGainControl = voice;
      c.audio.noiseSuppression = voice;
    }
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
