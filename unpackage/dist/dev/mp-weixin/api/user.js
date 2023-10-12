"use strict";
const common_vendor = require("../common/vendor.js");
require("./config.js");
function getRequist(url, data = {}, method = "get") {
  return common_vendor.index.request({
    method,
    url,
    header: {
      "Authorization": common_vendor.index.getStorageSync("token")
    },
    data
  });
}
function postRequist(url, data) {
  return new Promise((reslove, reject) => {
    common_vendor.index.uploadFile({
      url: "http://47.101.56.97:10001" + url,
      filePath: data,
      name: "file",
      success: (res) => {
        let resp = JSON.parse(res.data);
        reslove(resp);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
function login(userAccount, userPassword) {
  return getRequist(`/login/${userAccount}/${userPassword}`);
}
function register(userAccount, userPassword, userPassword1) {
  return common_vendor.index.request({
    method: "post",
    url: `/register`,
    data: {
      userAccount,
      userPassword,
      userPassword1
    }
  });
}
function uploadTx(data, userId, fieldName) {
  return postRequist(`/userUploadTx/${userId}/${fieldName}`, data);
}
function userCollect(data) {
  return getRequist(`/userCollect`, data, "POST");
}
function userCancelCollect({ videoId, userId }) {
  return getRequist(`/userCancelCollect/${videoId}/${userId}`);
}
function getUserInfo(userId) {
  return getRequist(`/getUserInfo/${userId}`);
}
function userFindCollect(type = "list") {
  let { user_id } = common_vendor.index.getStorageSync("userInfo");
  return getRequist(`/userFindCollect/${user_id}/${type}`);
}
function updateUserInfo(user) {
  return getRequist(`/userUpdateInfo`, user, "POST");
}
function addHot(video) {
  return getRequist(`/AddHot`, video, "POST");
}
function getHotList() {
  return getRequist(`/getHotList`);
}
function handleFeedback(data) {
  return getRequist(`/feedback`, data, "GET");
}
function isUpdate(key) {
  return getRequist(`/isUpdate/${key}`);
}
exports.addHot = addHot;
exports.getHotList = getHotList;
exports.getUserInfo = getUserInfo;
exports.handleFeedback = handleFeedback;
exports.isUpdate = isUpdate;
exports.login = login;
exports.register = register;
exports.updateUserInfo = updateUserInfo;
exports.uploadTx = uploadTx;
exports.userCancelCollect = userCancelCollect;
exports.userCollect = userCollect;
exports.userFindCollect = userFindCollect;
