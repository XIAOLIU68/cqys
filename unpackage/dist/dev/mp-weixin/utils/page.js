"use strict";
function hideSystemNavigation() {
  if (typeof plus !== "undefined") {
    plus.navigator.hideSystemNavigation();
  }
}
function setFullscreen(fullscreen) {
  if (typeof plus !== "undefined") {
    plus.navigator.setFullscreen(fullscreen);
    plus.navigator.showSystemNavigation();
  }
}
exports.hideSystemNavigation = hideSystemNavigation;
exports.setFullscreen = setFullscreen;
