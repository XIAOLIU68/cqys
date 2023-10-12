"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_page = require("../../utils/page.js");
const utils_toast = require("../../utils/toast.js");
const api_user = require("../../api/user.js");
require("../../api/config.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    let toBack = () => {
      console.log("OK啊");
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    };
    let account = common_vendor.ref("");
    let password = common_vendor.ref("");
    let password1 = common_vendor.ref("");
    let ruleTitle = common_vendor.ref({
      accountRule: "none",
      accountLengthRule: "none",
      passwordRule: "none",
      passwordRule1: "none",
      passwordIsEques: "none",
      passwordtLengthRule: "none"
    });
    let islogin = common_vendor.ref(false);
    let SubmitLogin = () => {
      if (islogin.value)
        return false;
      if (isNull()) {
        islogin.value = true;
        api_user.register(account.value, password.value, password1.value).then((res) => {
          utils_toast.msgSuccess(res.msg);
          common_vendor.index.redirectTo({
            url: "/pages/login/login"
          });
        }).catch(() => {
          islogin.value = false;
        });
      } else {
        islogin.value = false;
      }
    };
    let clearRule = () => {
      ruleTitle.value = {
        accountRule: "none",
        accountLengthRule: "none",
        passwordRule: "none",
        passwordRule1: "none",
        passwordIsEques: "none",
        passwordtLengthRule: "none"
      };
    };
    let isNull = () => {
      let account_ = account.value.trim();
      let password_ = password.value.trim();
      if (!account_) {
        clearRule();
        ruleTitle.value.accountRule = "block";
        return false;
      } else {
        ruleTitle.value.accountRule = "none";
      }
      if (!password_) {
        clearRule();
        ruleTitle.value.passwordRule = "block";
        return false;
      } else {
        ruleTitle.value.passwordRule = "none";
      }
      if (!password1.value.trim()) {
        clearRule();
        ruleTitle.value.passwordRule1 = "block";
        return false;
      } else {
        ruleTitle.value.passwordRule1 = "none";
      }
      if (password_ !== password1.value) {
        clearRule();
        ruleTitle.value.passwordIsEques = "block";
        return false;
      } else {
        ruleTitle.value.passwordIsEques = "none";
      }
      if (account_.length < 6) {
        clearRule();
        ruleTitle.value.accountLengthRule = "block";
        return;
      } else {
        ruleTitle.value.accountLengthRule = "none";
      }
      if (password_.length < 6) {
        clearRule();
        ruleTitle.value.passwordtLengthRule = "block";
        return;
      } else {
        ruleTitle.value.passwordtLengthRule = "none";
      }
      return true;
    };
    common_vendor.onMounted(() => {
      utils_page.hideSystemNavigation();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => common_vendor.unref(toBack)()),
        b: common_vendor.unref(account),
        c: common_vendor.o(($event) => common_vendor.isRef(account) ? account.value = $event.detail.value : account = $event.detail.value),
        d: common_vendor.unref(ruleTitle).accountRule,
        e: common_vendor.unref(ruleTitle).accountLengthRule,
        f: common_vendor.o((...args) => common_vendor.unref(SubmitLogin) && common_vendor.unref(SubmitLogin)(...args)),
        g: common_vendor.unref(password),
        h: common_vendor.o(($event) => common_vendor.isRef(password) ? password.value = $event.detail.value : password = $event.detail.value),
        i: common_vendor.unref(ruleTitle).passwordRule,
        j: common_vendor.unref(ruleTitle).passwordtLengthRule,
        k: common_vendor.o((...args) => common_vendor.unref(SubmitLogin) && common_vendor.unref(SubmitLogin)(...args)),
        l: common_vendor.unref(password1),
        m: common_vendor.o(($event) => common_vendor.isRef(password1) ? password1.value = $event.detail.value : password1 = $event.detail.value),
        n: common_vendor.unref(ruleTitle).passwordRule1,
        o: common_vendor.unref(ruleTitle).passwordIsEques,
        p: common_vendor.t(common_vendor.unref(islogin) ? "注册中..." : "注册"),
        q: common_vendor.unref(islogin),
        r: common_vendor.o((...args) => common_vendor.unref(SubmitLogin) && common_vendor.unref(SubmitLogin)(...args)),
        s: common_vendor.o((...args) => common_vendor.unref(toBack) && common_vendor.unref(toBack)(...args))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bac4a35d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/register/register.vue"]]);
wx.createPage(MiniProgramPage);
