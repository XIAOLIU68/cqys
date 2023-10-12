"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const utils_page = require("../../utils/page.js");
const common_assets = require("../../common/assets.js");
const api_user = require("../../api/user.js");
require("../../api/config.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_icon2 + _easycom_u_button2 + _easycom_u_popup2)();
}
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_button + _easycom_u_popup)();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    let lvs = common_vendor.ref([
      common_assets.LV1,
      common_assets.LV2,
      common_assets.LV3,
      common_assets.LV4,
      common_assets.LV5,
      common_assets.LV6,
      common_assets.LV7,
      common_assets.LV8,
      common_assets.LV9,
      common_assets.LV10
    ]);
    common_vendor.ref(null);
    common_vendor.onMounted(() => {
      userInfo.value = common_vendor.index.getStorageSync("userInfo");
      getClloectNumber();
    });
    common_vendor.ref(null);
    common_vendor.onShow(() => {
      getClloectNumber();
      userInfo.value = common_vendor.index.getStorageSync("userInfo");
      utils_page.setFullscreen(false);
    });
    let handelGetUserInfo = () => {
      api_user.getUserInfo(userInfo.value.user_id).then((res) => {
        userInfo.value = res.data;
        userInfo.value.user_image += "?" + new Date().getTime();
        common_vendor.index.setStorageSync("userInfo", res.data);
        common_vendor.index.stopPullDownRefresh();
      });
    };
    let feedback = () => {
      plus.nativeUI.prompt("简单表述刚才遇到的问题", (res) => {
        if (res.index === 0) {
          console.log("，", res.value);
          api_user.handleFeedback({
            content: res.value,
            userId: common_vendor.index.getStorageSync("userInfo").user_id
          }).then((res2) => {
            utils_toast.msgSuccess(res2.msg);
          });
        }
      }, "提示!", "请在此输入问题", ["提交", "取消"]);
    };
    common_vendor.onPullDownRefresh(() => {
      handelGetUserInfo();
      getClloectNumber();
    });
    let bg_height = common_vendor.ref(12);
    let key = "";
    let user_img_height = common_vendor.ref(5);
    let user_img_width = common_vendor.ref(5);
    let touchmove = (ev) => {
      clearTimeout(key);
      key = setTimeout(() => {
        bg_height.value = 20;
      }, 10);
    };
    let touchend = () => {
      bg_height.value = 12;
    };
    let button_show = common_vendor.ref(false);
    let button_showValue = common_vendor.ref("更换头像");
    let fieldName = "";
    let close = () => {
      button_show.value = false;
    };
    let checkImg = (title, field) => {
      fieldName = field;
      button_showValue.value = title;
      button_show.value = true;
    };
    let chooseImage = () => {
      try {
        common_vendor.index.chooseImage({
          count: 1,
          //默认9
          sizeType: ["original", "compressed"],
          //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album"],
          //从相册选择
          success: (res, tempFiles) => {
            common_vendor.index.showLoading({
              title: "正在上传中.."
            });
            api_user.uploadTx(res.tempFilePaths[0], userInfo.value.user_id, fieldName).then((res2) => {
              plus.nativeUI.toast(res2.msg, {
                align: "center",
                icon: "/static/toast/success.png",
                style: "inline",
                iconWidth: "20px",
                iconHeight: "20px"
              });
              let time = new Date().getTime();
              if (fieldName == "user_bg") {
                userInfo.value.user_bg = res2.img_url + "?time=" + time;
              } else {
                userInfo.value.user_image = res2.img_url + "?time=" + time;
              }
              handelGetUserInfo();
            }).catch((err) => {
              if (err.msg) {
                utils_toast.msgError(err.msg);
              }
            });
            common_vendor.index.hideLoading();
            button_show.value = false;
          }
        });
      } catch (e) {
      }
    };
    let saveImg = () => {
      plus.gallery.save(userInfo.value.user_image, () => {
        plus.nativeUI.toast("已经在相册里躺好啦");
        button_show.value = false;
      }, (err) => {
        plus.nativeUI.toast("保存好像失败了", err);
      });
    };
    let userInfo = common_vendor.ref({});
    let logOut = () => {
      common_vendor.index.setStorageSync("isAuthLogin", false);
      common_vendor.index.redirectTo({
        url: "../login/login"
      });
    };
    let navTo = (pageUrl) => {
      common_vendor.index.navigateTo({
        url: pageUrl,
        animationType: "pop-in"
      });
    };
    let collectNumber = common_vendor.ref(0);
    let historyNumber = common_vendor.ref(0);
    let getClloectNumber = () => {
      let TempList = common_vendor.index.getStorageSync("user_history_fiml");
      if (TempList !== null && TempList !== void 0) {
        historyNumber.value = TempList.length;
      }
      api_user.userFindCollect("number").then((res) => {
        collectNumber.value = res.data.total;
      });
    };
    let toDownload = () => {
      utils_toast.msgError("功能暂时不可用,敬请期待!");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => common_vendor.isRef(button_show) ? button_show.value = false : button_show = false),
        b: common_vendor.p({
          color: "#f9f9f9",
          size: "30",
          name: "setting"
        }),
        c: common_vendor.o(($event) => common_vendor.isRef(button_show) ? button_show.value = false : button_show = false),
        d: common_vendor.o((...args) => common_vendor.unref(touchmove) && common_vendor.unref(touchmove)(...args)),
        e: common_vendor.o(($event) => common_vendor.unref(checkImg)("更换背景", "user_bg")),
        f: `url(${common_vendor.unref(userInfo).user_bg})`,
        g: `${common_vendor.unref(bg_height)}rem`,
        h: `${common_vendor.unref(user_img_height)}rem`,
        i: `${common_vendor.unref(user_img_width)}rem`,
        j: common_vendor.o(($event) => common_vendor.unref(checkImg)("更换头像", "user_image")),
        k: common_vendor.unref(userInfo).user_image,
        l: common_vendor.unref(lvs)[common_vendor.unref(collectNumber) >= 100 ? 9 : Math.floor(common_vendor.unref(collectNumber) / 10)],
        m: common_vendor.t(common_vendor.unref(userInfo).user_name),
        n: common_vendor.unref(userInfo).user_sex === "0" ? common_vendor.unref(common_assets.GenderFemale) : common_vendor.unref(common_assets.GenderMale),
        o: common_vendor.o(($event) => common_vendor.unref(navTo)("/pages/edit_user/edit_user")),
        p: common_vendor.t(common_vendor.unref(collectNumber)),
        q: common_vendor.o(($event) => common_vendor.unref(navTo)("/pages/collect/collect")),
        r: common_vendor.t(common_vendor.unref(historyNumber)),
        s: common_vendor.o(($event) => common_vendor.unref(navTo)("/pages/watch_record/watch_record")),
        t: common_vendor.o((...args) => common_vendor.unref(toDownload) && common_vendor.unref(toDownload)(...args)),
        v: common_vendor.t(common_vendor.unref(userInfo).user_id),
        w: common_vendor.o((...args) => common_vendor.unref(toDownload) && common_vendor.unref(toDownload)(...args)),
        x: common_vendor.o((...args) => common_vendor.unref(toDownload) && common_vendor.unref(toDownload)(...args)),
        y: common_vendor.o((...args) => common_vendor.unref(feedback) && common_vendor.unref(feedback)(...args)),
        z: common_vendor.o((...args) => common_vendor.unref(logOut) && common_vendor.unref(logOut)(...args)),
        A: common_vendor.o(common_vendor.unref(chooseImage)),
        B: common_vendor.p({
          text: common_vendor.unref(button_showValue),
          color: "linear-gradient(to right, #D94BC6, #F9F871)"
        }),
        C: common_vendor.o(common_vendor.unref(saveImg)),
        D: common_vendor.p({
          text: "保存",
          color: "linear-gradient(to right, #FF5997, #0078F5)"
        }),
        E: common_vendor.o(common_vendor.unref(close)),
        F: common_vendor.p({
          round: 10,
          safeAreaInsetBottom: true,
          closeable: true,
          show: common_vendor.unref(button_show)
        }),
        G: common_vendor.o((...args) => common_vendor.unref(touchend) && common_vendor.unref(touchend)(...args))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/Qffiction/app1/uni-app/commApp/pages/home/home.vue"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
