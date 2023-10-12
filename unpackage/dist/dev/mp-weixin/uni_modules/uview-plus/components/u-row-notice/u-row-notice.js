"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uRowNotice_props = require("./props.js");
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
  name: "u-row-notice",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uRowNotice_props.props],
  data() {
    return {
      animationDuration: "0",
      // 动画执行时间
      animationPlayState: "paused",
      // 动画的开始和结束执行
      // nvue下，内容发生变化，导致滚动宽度也变化，需要标志为是否需要重新计算宽度
      // 不能在内容变化时直接重新计算，因为nvue的animation模块上一次的滚动不是刚好结束，会有影响
      nvueInit: true,
      show: true
    };
  },
  watch: {
    text: {
      immediate: true,
      handler(newValue, oldValue) {
        this.vue();
        if (!common_vendor.index.$u.test.string(newValue)) {
          common_vendor.index.$u.error("noticebar组件direction为row时，要求text参数为字符串形式");
        }
      }
    },
    fontSize() {
      this.vue();
    },
    speed() {
      this.vue();
    }
  },
  computed: {
    // 文字内容的样式
    textStyle() {
      let style = {};
      style.color = this.color;
      style.fontSize = common_vendor.index.$u.addUnit(this.fontSize);
      return style;
    },
    animationStyle() {
      let style = {};
      style.animationDuration = this.animationDuration;
      style.animationPlayState = this.animationPlayState;
      return style;
    },
    // 内部对用户传入的数据进一步分割，放到多个text标签循环，否则如果用户传入的字符串很长（100个字符以上）
    // 放在一个text标签中进行滚动，在低端安卓机上，动画可能会出现抖动现象，需要分割到多个text中可解决此问题
    innerText() {
      let result = [], len = 20;
      const textArr = this.text.split("");
      for (let i = 0; i < textArr.length; i += len) {
        result.push(textArr.slice(i, i + len).join(""));
      }
      return result;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.vue();
      if (!common_vendor.index.$u.test.string(this.text)) {
        common_vendor.index.$u.error("noticebar组件direction为row时，要求text参数为字符串形式");
      }
    },
    // vue版处理
    async vue() {
      let textWidth = 0;
      await common_vendor.index.$u.sleep();
      textWidth = (await this.$uGetRect(".u-notice__content__text")).width;
      (await this.$uGetRect(".u-notice__content")).width;
      this.animationDuration = `${textWidth / common_vendor.index.$u.getPx(this.speed)}s`;
      this.animationPlayState = "paused";
      setTimeout(() => {
        this.animationPlayState = "running";
      }, 10);
    },
    // nvue版处理
    async nvue() {
    },
    loopAnimation(textWidth, boxWidth) {
    },
    getNvueRect(el) {
    },
    // 点击通告栏
    clickHandler(index) {
      this.$emit("click");
    },
    // 点击右侧按钮，需要判断点击的是关闭图标还是箭头图标
    close() {
      this.$emit("close");
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.icon
  }, _ctx.icon ? {
    b: common_vendor.p({
      name: _ctx.icon,
      color: _ctx.color,
      size: "19"
    })
  } : {}, {
    c: common_vendor.f($options.innerText, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    d: common_vendor.s($options.textStyle),
    e: common_vendor.s($options.animationStyle),
    f: ["link", "closable"].includes(_ctx.mode)
  }, ["link", "closable"].includes(_ctx.mode) ? common_vendor.e({
    g: _ctx.mode === "link"
  }, _ctx.mode === "link" ? {
    h: common_vendor.p({
      name: "arrow-right",
      size: 17,
      color: _ctx.color
    })
  } : {}, {
    i: _ctx.mode === "closable"
  }, _ctx.mode === "closable" ? {
    j: common_vendor.o($options.close),
    k: common_vendor.p({
      name: "close",
      size: 16,
      color: _ctx.color
    })
  } : {}) : {}, {
    l: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ab8dee7b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-row-notice/u-row-notice.vue"]]);
wx.createComponent(Component);
