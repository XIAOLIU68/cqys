"use strict";
function msgError(msg, centerType = "center", dur = 1500) {
  plus.nativeUI.toast(msg, {
    align: "center",
    icon: "/static/toast/error.png",
    style: "inline",
    iconWidth: "20px",
    iconHeight: "20px",
    verticalAlign: centerType,
    duration: dur
  });
}
function msgSuccess(msg, centerType = "center") {
  plus.nativeUI.toast(msg, {
    align: "center",
    icon: "/static/toast/success.png",
    style: "inline",
    iconWidth: "20px",
    iconHeight: "20px",
    verticalAlign: centerType,
    duration: 1500
  });
}
exports.msgError = msgError;
exports.msgSuccess = msgSuccess;
