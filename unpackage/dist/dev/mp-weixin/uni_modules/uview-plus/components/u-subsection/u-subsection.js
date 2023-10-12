"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uSubsection_props = require("./props.js");
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
  name: "u-subsection",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uSubsection_props.props],
  data() {
    return {
      // 组件尺寸
      itemRect: {
        width: 0,
        height: 0
      }
    };
  },
  watch: {
    list(newValue, oldValue) {
      this.init();
    },
    current: {
      immediate: true,
      handler(n) {
      }
    }
  },
  computed: {
    wrapperStyle() {
      const style = {};
      if (this.mode === "button") {
        style.backgroundColor = this.bgColor;
      }
      return style;
    },
    // 滑块的样式
    barStyle() {
      const style = {};
      style.width = `${this.itemRect.width}px`;
      style.height = `${this.itemRect.height}px`;
      style.transform = `translateX(${this.current * this.itemRect.width}px)`;
      if (this.mode === "subsection") {
        style.backgroundColor = this.activeColor;
      }
      return style;
    },
    // 分段器item的样式
    itemStyle(index) {
      return (index2) => {
        const style = {};
        if (this.mode === "subsection") {
          style.borderColor = this.activeColor;
          style.borderWidth = "1px";
          style.borderStyle = "solid";
        }
        return style;
      };
    },
    // 分段器文字颜色
    textStyle(index) {
      return (index2) => {
        const style = {};
        style.fontWeight = this.bold && this.current === index2 ? "bold" : "normal";
        style.fontSize = common_vendor.index.$u.addUnit(this.fontSize);
        if (this.mode === "subsection") {
          style.color = this.current === index2 ? "#fff" : this.inactiveColor;
        } else {
          style.color = this.current === index2 ? this.activeColor : this.inactiveColor;
        }
        return style;
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      common_vendor.index.$u.sleep().then(() => this.getRect());
    },
    // 判断展示文本
    getText(item) {
      return typeof item === "object" ? item[this.keyName] : item;
    },
    // 获取组件的尺寸
    getRect() {
      this.$uGetRect(".u-subsection__item--0").then((size) => {
        this.itemRect = size;
      });
    },
    clickHandler(index) {
      this.$emit("change", index);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.barStyle),
    b: common_vendor.n(_ctx.mode === "button" && "u-subsection--button__bar"),
    c: common_vendor.n(_ctx.current === 0 && _ctx.mode === "subsection" && "u-subsection__bar--first"),
    d: common_vendor.n(_ctx.current > 0 && _ctx.current < _ctx.list.length - 1 && _ctx.mode === "subsection" && "u-subsection__bar--center"),
    e: common_vendor.n(_ctx.current === _ctx.list.length - 1 && _ctx.mode === "subsection" && "u-subsection__bar--last"),
    f: common_vendor.f(_ctx.list, (item, index, i0) => {
      return {
        a: common_vendor.t($options.getText(item)),
        b: common_vendor.s($options.textStyle(index)),
        c: common_vendor.n(`u-subsection__item--${index}`),
        d: common_vendor.n(index < _ctx.list.length - 1 && "u-subsection__item--no-border-right"),
        e: common_vendor.n(index === 0 && "u-subsection__item--first"),
        f: common_vendor.n(index === _ctx.list.length - 1 && "u-subsection__item--last"),
        g: `u-subsection__item--${index}`,
        h: common_vendor.s($options.itemStyle(index)),
        i: common_vendor.o(($event) => $options.clickHandler(index), index),
        j: index
      };
    }),
    g: common_vendor.n(`u-subsection--${_ctx.mode}`),
    h: common_vendor.s(_ctx.$u.addStyle(_ctx.customStyle)),
    i: common_vendor.s($options.wrapperStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b5ccb67e"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-subsection/u-subsection.vue"]]);
wx.createComponent(Component);
