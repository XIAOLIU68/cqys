"use strict";
const uni_modules_uviewPlus_components_uNoticeBar_props = require("./props.js");
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
const common_vendor = require("../../../../common/vendor.js");
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
  name: "u-notice-bar",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uNoticeBar_props.props],
  data() {
    return {
      show: true
    };
  },
  methods: {
    // 点击通告栏
    click(index) {
      this.$emit("click", index);
      if (this.url && this.linkType) {
        this.openPage();
      }
    },
    // 点击关闭按钮
    close() {
      this.show = false;
      this.$emit("close");
    }
  }
};
if (!Array) {
  const _easycom_u_column_notice2 = common_vendor.resolveComponent("u-column-notice");
  const _easycom_u_row_notice2 = common_vendor.resolveComponent("u-row-notice");
  (_easycom_u_column_notice2 + _easycom_u_row_notice2)();
}
const _easycom_u_column_notice = () => "../u-column-notice/u-column-notice.js";
const _easycom_u_row_notice = () => "../u-row-notice/u-row-notice.js";
if (!Math) {
  (_easycom_u_column_notice + _easycom_u_row_notice)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.show
  }, $data.show ? common_vendor.e({
    b: _ctx.direction === "column" || _ctx.direction === "row" && _ctx.step
  }, _ctx.direction === "column" || _ctx.direction === "row" && _ctx.step ? {
    c: common_vendor.o($options.close),
    d: common_vendor.o($options.click),
    e: common_vendor.p({
      color: _ctx.color,
      bgColor: _ctx.bgColor,
      text: _ctx.text,
      mode: _ctx.mode,
      step: _ctx.step,
      icon: _ctx.icon,
      ["disable-touch"]: _ctx.disableTouch,
      fontSize: _ctx.fontSize,
      duration: _ctx.duration
    })
  } : {
    f: common_vendor.o($options.close),
    g: common_vendor.o($options.click),
    h: common_vendor.p({
      color: _ctx.color,
      bgColor: _ctx.bgColor,
      text: _ctx.text,
      mode: _ctx.mode,
      fontSize: _ctx.fontSize,
      speed: _ctx.speed,
      url: _ctx.url,
      linkType: _ctx.linkType,
      icon: _ctx.icon
    })
  }, {
    i: common_vendor.s({
      backgroundColor: _ctx.bgColor
    }),
    j: common_vendor.s(_ctx.$u.addStyle(_ctx.customStyle))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-54bd9363"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-notice-bar/u-notice-bar.vue"]]);
wx.createComponent(Component);
