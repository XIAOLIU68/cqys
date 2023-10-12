"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uIcon_icons = require("./icons.js");
const uni_modules_uviewPlus_components_uIcon_props = require("./props.js");
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
  name: "u-icon",
  data() {
    return {};
  },
  emits: ["click"],
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uIcon_props.props],
  computed: {
    uClasses() {
      let classes = [];
      classes.push(this.customPrefix + "-" + this.name);
      if (this.color && common_vendor.index.$u.config.type.includes(this.color))
        classes.push("u-icon__icon--" + this.color);
      return classes;
    },
    iconStyle() {
      let style = {};
      style = {
        fontSize: common_vendor.index.$u.addUnit(this.size),
        lineHeight: common_vendor.index.$u.addUnit(this.size),
        fontWeight: this.bold ? "bold" : "normal",
        // 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
        top: common_vendor.index.$u.addUnit(this.top)
      };
      if (this.color && !common_vendor.index.$u.config.type.includes(this.color))
        style.color = this.color;
      return style;
    },
    // 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
    isImg() {
      return this.name.indexOf("/") !== -1;
    },
    imgStyle() {
      let style = {};
      style.width = this.width ? common_vendor.index.$u.addUnit(this.width) : common_vendor.index.$u.addUnit(this.size);
      style.height = this.height ? common_vendor.index.$u.addUnit(this.height) : common_vendor.index.$u.addUnit(this.size);
      return style;
    },
    // 通过图标名，查找对应的图标
    icon() {
      return uni_modules_uviewPlus_components_uIcon_icons.icons["uicon-" + this.name] || this.name;
    }
  },
  methods: {
    clickHandler(e) {
      this.$emit("click", this.index);
      this.stop && this.preventEvent(e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.isImg
  }, $options.isImg ? {
    b: _ctx.name,
    c: _ctx.imgMode,
    d: common_vendor.s($options.imgStyle),
    e: common_vendor.s(_ctx.$u.addStyle(_ctx.customStyle))
  } : {
    f: common_vendor.t($options.icon),
    g: common_vendor.n($options.uClasses),
    h: common_vendor.s($options.iconStyle),
    i: common_vendor.s(_ctx.$u.addStyle(_ctx.customStyle)),
    j: _ctx.hoverClass
  }, {
    k: _ctx.label !== ""
  }, _ctx.label !== "" ? {
    l: common_vendor.t(_ctx.label),
    m: _ctx.labelColor,
    n: _ctx.$u.addUnit(_ctx.labelSize),
    o: _ctx.labelPos == "right" ? _ctx.$u.addUnit(_ctx.space) : 0,
    p: _ctx.labelPos == "bottom" ? _ctx.$u.addUnit(_ctx.space) : 0,
    q: _ctx.labelPos == "left" ? _ctx.$u.addUnit(_ctx.space) : 0,
    r: _ctx.labelPos == "top" ? _ctx.$u.addUnit(_ctx.space) : 0
  } : {}, {
    s: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args)),
    t: common_vendor.n("u-icon--" + _ctx.labelPos)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ac70166d"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-icon/u-icon.vue"]]);
wx.createComponent(Component);
