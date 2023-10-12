"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_libs_mixin_button = require("../../libs/mixin/button.js");
const uni_modules_uviewPlus_libs_mixin_openType = require("../../libs/mixin/openType.js");
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
const uni_modules_uviewPlus_components_uButton_props = require("./props.js");
require("../../libs/config/props.js");
require("../../libs/config/props/actionSheet.js");
require("../../libs/config/props/album.js");
require("../../libs/config/props/alert.js");
require("../../libs/config/props/avatar.js");
require("../../libs/config/props/avatarGroup.js");
require("../../libs/config/props/backtop.js");
require("../../libs/config/props/badge.js");
require("../../libs/config/props/button.js");
require("../../libs/config/props/calendar.js");
require("../../libs/config/props/carKeyboard.js");
require("../../libs/config/props/cell.js");
require("../../libs/config/props/cellGroup.js");
require("../../libs/config/props/checkbox.js");
require("../../libs/config/props/checkboxGroup.js");
require("../../libs/config/props/circleProgress.js");
require("../../libs/config/props/code.js");
require("../../libs/config/props/codeInput.js");
require("../../libs/config/props/col.js");
require("../../libs/config/props/collapse.js");
require("../../libs/config/props/collapseItem.js");
require("../../libs/config/props/columnNotice.js");
require("../../libs/config/props/countDown.js");
require("../../libs/config/props/countTo.js");
require("../../libs/config/props/datetimePicker.js");
require("../../libs/config/props/divider.js");
require("../../libs/config/props/empty.js");
require("../../libs/config/props/form.js");
require("../../libs/config/props/formItem.js");
require("../../libs/config/props/gap.js");
require("../../libs/config/props/grid.js");
require("../../libs/config/props/gridItem.js");
require("../../libs/config/props/icon.js");
require("../../libs/config/config.js");
require("../../libs/config/props/image.js");
require("../../libs/config/props/indexAnchor.js");
require("../../libs/config/props/indexList.js");
require("../../libs/config/props/input.js");
require("../../libs/config/props/keyboard.js");
require("../../libs/config/props/line.js");
require("../../libs/config/props/lineProgress.js");
require("../../libs/config/props/link.js");
require("../../libs/config/props/list.js");
require("../../libs/config/props/listItem.js");
require("../../libs/config/props/loadingIcon.js");
require("../../libs/config/props/loadingPage.js");
require("../../libs/config/props/loadmore.js");
require("../../libs/config/props/modal.js");
require("../../libs/config/props/navbar.js");
require("../../libs/config/color.js");
require("../../libs/config/props/noNetwork.js");
require("../../libs/config/props/noticeBar.js");
require("../../libs/config/props/notify.js");
require("../../libs/config/props/numberBox.js");
require("../../libs/config/props/numberKeyboard.js");
require("../../libs/config/props/overlay.js");
require("../../libs/config/props/parse.js");
require("../../libs/config/props/picker.js");
require("../../libs/config/props/popup.js");
require("../../libs/config/props/radio.js");
require("../../libs/config/props/radioGroup.js");
require("../../libs/config/props/rate.js");
require("../../libs/config/props/readMore.js");
require("../../libs/config/props/row.js");
require("../../libs/config/props/rowNotice.js");
require("../../libs/config/props/scrollList.js");
require("../../libs/config/props/search.js");
require("../../libs/config/props/section.js");
require("../../libs/config/props/skeleton.js");
require("../../libs/config/props/slider.js");
require("../../libs/config/props/statusBar.js");
require("../../libs/config/props/steps.js");
require("../../libs/config/props/stepsItem.js");
require("../../libs/config/props/sticky.js");
require("../../libs/config/props/subsection.js");
require("../../libs/config/props/swipeAction.js");
require("../../libs/config/props/swipeActionItem.js");
require("../../libs/config/props/swiper.js");
require("../../libs/config/props/swipterIndicator.js");
require("../../libs/config/props/switch.js");
require("../../libs/config/props/tabbar.js");
require("../../libs/config/props/tabbarItem.js");
require("../../libs/config/props/tabs.js");
require("../../libs/config/props/tag.js");
require("../../libs/config/props/text.js");
require("../../libs/config/props/textarea.js");
require("../../libs/config/props/toast.js");
require("../../libs/config/props/toolbar.js");
require("../../libs/config/props/tooltip.js");
require("../../libs/config/props/transition.js");
require("../../libs/config/props/upload.js");
const _sfc_main = {
  name: "u-button",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_libs_mixin_button.button, uni_modules_uviewPlus_libs_mixin_openType.openType, uni_modules_uviewPlus_components_uButton_props.props],
  data() {
    return {};
  },
  computed: {
    // 生成bem风格的类名
    bemClass() {
      if (!this.color) {
        return this.bem(
          "button",
          ["type", "shape", "size"],
          ["disabled", "plain", "hairline"]
        );
      } else {
        return this.bem(
          "button",
          ["shape", "size"],
          ["disabled", "plain", "hairline"]
        );
      }
    },
    loadingColor() {
      if (this.plain) {
        return this.color ? this.color : common_vendor.index.$u.config.color[`u-${this.type}`];
      }
      if (this.type === "info") {
        return "#c9c9c9";
      }
      return "rgb(200, 200, 200)";
    },
    iconColorCom() {
      if (this.iconColor)
        return this.iconColor;
      if (this.plain) {
        return this.color ? this.color : this.type;
      } else {
        return this.type === "info" ? "#000000" : "#ffffff";
      }
    },
    baseColor() {
      let style = {};
      if (this.color) {
        style.color = this.plain ? this.color : "white";
        if (!this.plain) {
          style["background-color"] = this.color;
        }
        if (this.color.indexOf("gradient") !== -1) {
          style.borderTopWidth = 0;
          style.borderRightWidth = 0;
          style.borderBottomWidth = 0;
          style.borderLeftWidth = 0;
          if (!this.plain) {
            style.backgroundImage = this.color;
          }
        } else {
          style.borderColor = this.color;
          style.borderWidth = "1px";
          style.borderStyle = "solid";
        }
      }
      return style;
    },
    // nvue版本按钮的字体不会继承父组件的颜色，需要对每一个text组件进行单独的设置
    nvueTextStyle() {
      let style = {};
      if (this.type === "info") {
        style.color = "#323233";
      }
      if (this.color) {
        style.color = this.plain ? this.color : "white";
      }
      style.fontSize = this.textSize + "px";
      return style;
    },
    // 字体大小
    textSize() {
      let fontSize = 14, { size } = this;
      if (size === "large")
        fontSize = 16;
      if (size === "normal")
        fontSize = 14;
      if (size === "small")
        fontSize = 12;
      if (size === "mini")
        fontSize = 10;
      return fontSize;
    }
  },
  emits: [
    "click",
    "getphonenumber",
    "getuserinfo",
    "error",
    "opensetting",
    "launchapp"
  ],
  methods: {
    clickHandler() {
      if (!this.disabled && !this.loading) {
        common_vendor.index.$u.throttle(() => {
          this.$emit("click");
        }, this.throttleTime);
      }
    },
    // 下面为对接uniapp官方按钮开放能力事件回调的对接
    getphonenumber(res) {
      this.$emit("getphonenumber", res);
    },
    getuserinfo(res) {
      this.$emit("getuserinfo", res);
    },
    error(res) {
      this.$emit("error", res);
    },
    opensetting(res) {
      this.$emit("opensetting", res);
    },
    launchapp(res) {
      this.$emit("launchapp", res);
    }
  }
};
if (!Array) {
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_loading_icon2 + _easycom_u_icon2)();
}
const _easycom_u_loading_icon = () => "../u-loading-icon/u-loading-icon.js";
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_loading_icon + _easycom_u_icon)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.loading
  }, _ctx.loading ? {
    b: common_vendor.p({
      mode: _ctx.loadingMode,
      size: _ctx.loadingSize * 1.15,
      color: $options.loadingColor
    }),
    c: common_vendor.t(_ctx.loadingText || _ctx.text),
    d: common_vendor.s({
      fontSize: $options.textSize + "px"
    })
  } : common_vendor.e({
    e: _ctx.icon
  }, _ctx.icon ? {
    f: common_vendor.p({
      name: _ctx.icon,
      color: $options.iconColorCom,
      size: $options.textSize * 1.35,
      customStyle: {
        marginRight: "2px"
      }
    })
  } : {}, {
    g: common_vendor.t(_ctx.text),
    h: common_vendor.s({
      fontSize: $options.textSize + "px"
    })
  }), {
    i: Number(_ctx.hoverStartTime),
    j: Number(_ctx.hoverStayTime),
    k: _ctx.formType,
    l: _ctx.openType,
    m: _ctx.appParameter,
    n: _ctx.hoverStopPropagation,
    o: _ctx.sendMessageTitle,
    p: _ctx.sendMessagePath,
    q: _ctx.lang,
    r: _ctx.dataName,
    s: _ctx.sessionFrom,
    t: _ctx.sendMessageImg,
    v: _ctx.showMessageCard,
    w: common_vendor.o((...args) => $options.getphonenumber && $options.getphonenumber(...args)),
    x: common_vendor.o((...args) => $options.getuserinfo && $options.getuserinfo(...args)),
    y: common_vendor.o((...args) => $options.error && $options.error(...args)),
    z: common_vendor.o((...args) => $options.opensetting && $options.opensetting(...args)),
    A: common_vendor.o((...args) => $options.launchapp && $options.launchapp(...args)),
    B: !_ctx.disabled && !_ctx.loading ? "u-button--active" : "",
    C: common_vendor.s($options.baseColor),
    D: common_vendor.s(_ctx.$u.addStyle(_ctx.customStyle)),
    E: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args)),
    F: common_vendor.n($options.bemClass)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5ce41ee6"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-button/u-button.vue"]]);
wx.createComponent(Component);
