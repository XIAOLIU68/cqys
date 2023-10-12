"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
require("../../api/config.js");
require("../../utils/toast.js");
if (!Array) {
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  _easycom_u_empty2();
}
const _easycom_u_empty = () => "../../uni_modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  _easycom_u_empty();
}
const _sfc_main = {
  __name: "collect",
  setup(__props) {
    let list = common_vendor.ref([]);
    let toDetail = (item) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + item.video_id
      });
    };
    let imageLoad = (item) => {
      item.updateTime = true;
    };
    common_vendor.onMounted(() => {
      api_user.userFindCollect("list").then((res) => {
        console.log("res", res);
        list.value = res.data;
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(list).length
      }, common_vendor.unref(list).length ? {
        b: common_vendor.f(common_vendor.unref(list), (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => common_vendor.unref(toDetail)(item), item.cover),
            b: common_vendor.o(($event) => common_vendor.unref(imageLoad)(item), item.cover),
            c: !item.updateTime ? "../../static/logo2.svg" : item.cover,
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.director),
            f: item.cover
          };
        })
      } : {
        c: common_vendor.p({
          text: "暂时还没有收藏记录",
          mode: "search"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b24c290b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/collect/collect.vue"]]);
wx.createPage(MiniProgramPage);
