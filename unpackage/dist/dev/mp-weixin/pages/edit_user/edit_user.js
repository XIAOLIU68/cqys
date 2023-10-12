"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const utils_toast = require("../../utils/toast.js");
require("../../api/config.js");
if (!Array) {
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  _easycom_uni_section2();
}
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  _easycom_uni_section();
}
const _sfc_main = {
  __name: "edit_user",
  setup(__props) {
    common_vendor.ref();
    let items = common_vendor.ref([
      {
        value: "1",
        name: "男",
        color: "#007aff"
      },
      {
        value: "0",
        name: "女",
        color: "#d04a92"
      }
    ]);
    common_vendor.ref(0);
    let user = common_vendor.ref({});
    common_vendor.onShow(() => {
      user.value = common_vendor.index.getStorageSync("userInfo");
    });
    let radioChange = (e) => {
      user.value.user_sex = e.detail.value;
    };
    let isSubmitLoading = common_vendor.ref(false);
    let submit_ = () => {
      let { user_name } = user.value;
      user.value.user_name = user_name.trim();
      if (user_name.trim()) {
        if (user_name.trim().length > 10) {
          utils_toast.msgError("昵称长度不能超过10个字符!");
          return;
        }
      } else {
        utils_toast.msgError("昵称不能为空!");
        return;
      }
      isSubmitLoading.value = true;
      api_user.updateUserInfo(user.value).then((res) => {
        common_vendor.index.setStorageSync("userInfo", user.value);
        utils_toast.msgSuccess(res.msg);
        common_vendor.index.navigateBack();
      }).catch((err) => {
        isSubmitLoading.value = false;
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(user).user_name,
        b: common_vendor.o(($event) => common_vendor.unref(user).user_name = $event.detail.value),
        c: common_vendor.p({
          titleColor: "white",
          title: "昵称",
          type: "line"
        }),
        d: common_vendor.f(common_vendor.unref(items), (item, index, i0) => {
          return {
            a: item.value,
            b: item.color,
            c: item.value === common_vendor.unref(user).user_sex,
            d: common_vendor.t(item.name),
            e: item.value
          };
        }),
        e: common_vendor.o((...args) => common_vendor.unref(radioChange) && common_vendor.unref(radioChange)(...args)),
        f: common_vendor.p({
          titleColor: "white",
          title: "性别",
          type: "line"
        }),
        g: common_vendor.o((...args) => common_vendor.unref(submit_) && common_vendor.unref(submit_)(...args)),
        h: common_vendor.unref(isSubmitLoading),
        i: common_vendor.unref(isSubmitLoading)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-702a44f5"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/edit_user/edit_user.vue"]]);
wx.createPage(MiniProgramPage);
