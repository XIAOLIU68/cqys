"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_page = require("../../utils/page.js");
const utils_toast = require("../../utils/toast.js");
const api_user = require("../../api/user.js");
require("../../api/config.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    let toSecurity_policy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/security_policy/security_policy",
        animationType: "slide-in-bottom"
      });
    };
    let toRegister = () => {
      common_vendor.index.redirectTo({
        url: "/pages/register/register"
      });
    };
    let account = common_vendor.ref("");
    let password = common_vendor.ref("");
    let isCheck = common_vendor.ref([]);
    let isCheckChange = (e) => {
      isCheck.value = e.detail.value;
    };
    let ruleTitle = common_vendor.ref({
      accountRule: "none",
      passwordRule: "none"
    });
    let islogin = common_vendor.ref(false);
    let SubmitLogin = () => {
      if (islogin.value)
        return false;
      if (isNull()) {
        if (!isCheck.value.length) {
          utils_toast.msgError("请勾选用户协议后,进行登录!");
          return;
        } else {
          common_vendor.index.setStorageSync("isAuthLogin", true);
          common_vendor.index.setStorageSync("accountInfo", {
            account: account.value,
            password: password.value
          });
        }
        islogin.value = true;
        api_user.login(account.value, password.value).then((res) => {
          common_vendor.index.setStorageSync("userInfo", res.data.userInfo);
          common_vendor.index.setStorageSync("token", res.data.token);
          common_vendor.index.switchTab({
            url: "../index/index"
          });
          islogin.value = false;
        }).catch(() => {
          islogin.value = false;
        });
      } else {
        islogin.value = false;
      }
    };
    let isNull = () => {
      if (!account.value) {
        ruleTitle.value.accountRule = "block";
        return false;
      } else {
        ruleTitle.value.accountRule = "none";
      }
      if (!password.value) {
        ruleTitle.value.passwordRule = "block";
        return false;
      } else {
        ruleTitle.value.passwordRule = "none";
      }
      return true;
    };
    common_vendor.onMounted(() => {
      utils_page.hideSystemNavigation();
      let isAuthLogin = common_vendor.index.getStorageSync("isAuthLogin");
      let accountInfo = common_vendor.index.getStorageSync("accountInfo");
      if (isAuthLogin) {
        isCheckChange({ detail: { value: ["login"] } });
        account.value = accountInfo.account;
        password.value = accountInfo.password;
        SubmitLogin();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(account),
        b: common_vendor.o(($event) => common_vendor.isRef(account) ? account.value = $event.detail.value : account = $event.detail.value),
        c: common_vendor.unref(ruleTitle).accountRule,
        d: common_vendor.o((...args) => common_vendor.unref(SubmitLogin) && common_vendor.unref(SubmitLogin)(...args)),
        e: common_vendor.unref(password),
        f: common_vendor.o(($event) => common_vendor.isRef(password) ? password.value = $event.detail.value : password = $event.detail.value),
        g: common_vendor.unref(ruleTitle).passwordRule,
        h: common_vendor.o((...args) => common_vendor.unref(toSecurity_policy) && common_vendor.unref(toSecurity_policy)(...args)),
        i: common_vendor.o((...args) => common_vendor.unref(isCheckChange) && common_vendor.unref(isCheckChange)(...args)),
        j: common_vendor.t(common_vendor.unref(islogin) ? "登录中..." : "登录"),
        k: common_vendor.unref(islogin),
        l: common_vendor.o((...args) => common_vendor.unref(SubmitLogin) && common_vendor.unref(SubmitLogin)(...args)),
        m: common_vendor.o((...args) => common_vendor.unref(toRegister) && common_vendor.unref(toRegister)(...args))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
