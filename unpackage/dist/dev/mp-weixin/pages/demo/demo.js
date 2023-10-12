"use strict";
const common_vendor = require("../../common/vendor.js");
let path = common_vendor.ref("");
common_vendor.ref(false);
let videoContext = common_vendor.index.createVideoContext("videoRef", common_vendor.getCurrentInstance());
common_vendor.onMounted(() => {
  console.log("执行了啊");
  const value = common_vendor.index.getStorageSync("path");
  if (value) {
    path.value = value;
    videoContext.requestFullScreen();
  }
});
const _sfc_main = {};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.isShow
  }, _ctx.isShow ? {} : {}, {
    b: common_vendor.o((...args) => _ctx.demo && _ctx.demo(...args)),
    c: common_vendor.o((...args) => _ctx.demo1 && _ctx.demo1(...args)),
    d: _ctx.path
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/demo/demo.nvue"]]);
wx.createPage(MiniProgramPage);
