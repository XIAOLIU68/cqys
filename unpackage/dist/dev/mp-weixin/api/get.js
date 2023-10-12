"use strict";
const common_vendor = require("../common/vendor.js");
require("./config.js");
function getRequist(url) {
  return common_vendor.index.request({
    method: "GET",
    url,
    header: {
      "Authorization": common_vendor.index.getStorageSync("token")
    }
  });
}
function getTypeList(type, page) {
  return getRequist(`/getTypeList/${type}/${page}`);
}
function getFindByVideoId(videoId) {
  return getRequist(`/getFindByVideoId/${videoId}`);
}
function getFindBySearch(name, indexPage, type) {
  return getRequist(`/getFindBySearch/${name}/${indexPage}/${type}`);
}
function getFindByVideoType(type, indexPage = 1) {
  return getRequist(`/getFindByVideoType/${type}/${indexPage}`);
}
exports.getFindBySearch = getFindBySearch;
exports.getFindByVideoId = getFindByVideoId;
exports.getFindByVideoType = getFindByVideoType;
exports.getTypeList = getTypeList;
