"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uLoadingIcon_props = require("./props.js");
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
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
  name: "u-loading-icon",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uLoadingIcon_props.props],
  data() {
    return {
      // Array.form可以通过一个伪数组对象创建指定长度的数组
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
      array12: Array.from({
        length: 12
      }),
      // 这里需要设置默认值为360，否则在安卓nvue上，会延迟一个duration周期后才执行
      // 在iOS nvue上，则会一开始默认执行两个周期的动画
      aniAngel: 360,
      // 动画旋转角度
      webviewHide: false,
      // 监听webview的状态，如果隐藏了页面，则停止动画，以免性能消耗
      loading: false
      // 是否运行中，针对nvue使用
    };
  },
  computed: {
    // 当为circle类型时，给其另外三边设置一个更轻一些的颜色
    // 之所以需要这么做的原因是，比如父组件传了color为红色，那么需要另外的三个边为浅红色
    // 而不能是固定的某一个其他颜色(因为这个固定的颜色可能浅蓝，导致效果没有那么细腻良好)
    otherBorderColor() {
      const lightColor = common_vendor.index.$u.colorGradient(this.color, "#ffffff", 100)[80];
      if (this.mode === "circle") {
        return this.inactiveColor ? this.inactiveColor : lightColor;
      } else {
        return "transparent";
      }
    }
  },
  watch: {
    show(n) {
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      setTimeout(() => {
      }, 20);
    },
    // 监听webview的显示与隐藏
    addEventListenerToWebview() {
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.show
  }, _ctx.show ? common_vendor.e({
    b: !$data.webviewHide
  }, !$data.webviewHide ? common_vendor.e({
    c: _ctx.mode === "spinner"
  }, _ctx.mode === "spinner" ? {
    d: common_vendor.f($data.array12, (item, index, i0) => {
      return {
        a: index
      };
    })
  } : {}, {
    e: common_vendor.n(`u-loading-icon__spinner--${_ctx.mode}`),
    f: _ctx.color,
    g: _ctx.$u.addUnit(_ctx.size),
    h: _ctx.$u.addUnit(_ctx.size),
    i: _ctx.color,
    j: $options.otherBorderColor,
    k: $options.otherBorderColor,
    l: $options.otherBorderColor,
    m: `${_ctx.duration}ms`,
    n: _ctx.mode === "semicircle" || _ctx.mode === "circle" ? _ctx.timingFunction : ""
  }) : {}, {
    o: _ctx.text
  }, _ctx.text ? {
    p: common_vendor.t(_ctx.text),
    q: _ctx.$u.addUnit(_ctx.textSize),
    r: _ctx.textColor
  } : {}, {
    s: common_vendor.s(_ctx.$u.addStyle(_ctx.customStyle)),
    t: common_vendor.n(_ctx.vertical && "u-loading-icon--vertical")
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2af81691"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-loading-icon/u-loading-icon.vue"]]);
wx.createComponent(Component);
