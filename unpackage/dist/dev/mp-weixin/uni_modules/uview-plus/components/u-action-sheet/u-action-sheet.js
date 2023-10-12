"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_libs_mixin_openType = require("../../libs/mixin/openType.js");
const uni_modules_uviewPlus_libs_mixin_button = require("../../libs/mixin/button.js");
const uni_modules_uviewPlus_components_uActionSheet_props = require("./props.js");
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
  name: "u-action-sheet",
  // 一些props参数和methods方法，通过mixin混入，因为其他文件也会用到
  mixins: [uni_modules_uviewPlus_libs_mixin_openType.openType, uni_modules_uviewPlus_libs_mixin_button.button, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uActionSheet_props.props],
  data() {
    return {};
  },
  computed: {
    // 操作项目的样式
    itemStyle() {
      return (index) => {
        let style = {};
        if (this.actions[index].color)
          style.color = this.actions[index].color;
        if (this.actions[index].fontSize)
          style.fontSize = common_vendor.index.$u.addUnit(this.actions[index].fontSize);
        if (this.actions[index].disabled)
          style.color = "#c0c4cc";
        return style;
      };
    }
  },
  methods: {
    closeHandler() {
      if (this.closeOnClickOverlay) {
        this.$emit("close");
      }
    },
    // 点击取消按钮
    cancel() {
      this.$emit("close");
    },
    selectHandler(index) {
      const item = this.actions[index];
      if (item && !item.disabled && !item.loading) {
        this.$emit("select", item);
        if (this.closeOnClickAction) {
          this.$emit("close");
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_line2 = common_vendor.resolveComponent("u-line");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_gap2 = common_vendor.resolveComponent("u-gap");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_icon2 + _easycom_u_line2 + _easycom_u_loading_icon2 + _easycom_u_gap2 + _easycom_u_popup2)();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
const _easycom_u_line = () => "../u-line/u-line.js";
const _easycom_u_loading_icon = () => "../u-loading-icon/u-loading-icon.js";
const _easycom_u_gap = () => "../u-gap/u-gap.js";
const _easycom_u_popup = () => "../u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_line + _easycom_u_loading_icon + _easycom_u_gap + _easycom_u_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.title
  }, _ctx.title ? {
    b: common_vendor.t(_ctx.title),
    c: common_vendor.p({
      name: "close",
      size: "17",
      color: "#c8c9cc",
      bold: true
    }),
    d: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  } : {}, {
    e: _ctx.description
  }, _ctx.description ? {
    f: common_vendor.t(_ctx.description),
    g: common_vendor.s({
      marginTop: `${_ctx.title && _ctx.description ? 0 : "18px"}`
    })
  } : {}, {
    h: _ctx.description
  }, _ctx.description ? {} : {}, {
    i: common_vendor.f(_ctx.actions, (item, index, i0) => {
      return common_vendor.e({
        a: !item.loading
      }, !item.loading ? common_vendor.e({
        b: common_vendor.t(item.name),
        c: common_vendor.s($options.itemStyle(index)),
        d: item.subname
      }, item.subname ? {
        e: common_vendor.t(item.subname)
      } : {}) : {
        f: "69669810-3-" + i0 + ",69669810-0",
        g: common_vendor.p({
          ["custom-class"]: "van-action-sheet__loading",
          size: "18",
          mode: "circle"
        })
      }, {
        h: common_vendor.o(($event) => $options.selectHandler(index), index),
        i: !item.disabled && !item.loading ? "u-action-sheet--hover" : "",
        j: item.openType,
        k: common_vendor.o((...args) => _ctx.onGetUserInfo && _ctx.onGetUserInfo(...args), index),
        l: common_vendor.o((...args) => _ctx.onContact && _ctx.onContact(...args), index),
        m: common_vendor.o((...args) => _ctx.onGetPhoneNumber && _ctx.onGetPhoneNumber(...args), index),
        n: common_vendor.o((...args) => _ctx.onError && _ctx.onError(...args), index),
        o: common_vendor.o((...args) => _ctx.onLaunchApp && _ctx.onLaunchApp(...args), index),
        p: common_vendor.o((...args) => _ctx.onOpenSetting && _ctx.onOpenSetting(...args), index),
        q: common_vendor.o(($event) => $options.selectHandler(index), index),
        r: !item.disabled && !item.loading ? "u-action-sheet--hover" : "",
        s: index !== _ctx.actions.length - 1
      }, index !== _ctx.actions.length - 1 ? {
        t: "69669810-4-" + i0 + ",69669810-0"
      } : {}, {
        v: index
      });
    }),
    j: _ctx.lang,
    k: _ctx.sessionFrom,
    l: _ctx.sendMessageTitle,
    m: _ctx.sendMessagePath,
    n: _ctx.sendMessageImg,
    o: _ctx.showMessageCard,
    p: _ctx.appParameter,
    q: _ctx.cancelText
  }, _ctx.cancelText ? {
    r: common_vendor.p({
      bgColor: "#eaeaec",
      height: "6"
    })
  } : {}, {
    s: _ctx.cancelText
  }, _ctx.cancelText ? {
    t: common_vendor.t(_ctx.cancelText),
    v: common_vendor.o(() => {
    }),
    w: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  } : {}, {
    x: common_vendor.o($options.closeHandler),
    y: common_vendor.p({
      show: _ctx.show,
      mode: "bottom",
      safeAreaInsetBottom: _ctx.safeAreaInsetBottom,
      round: _ctx.round
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-69669810"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-action-sheet/u-action-sheet.vue"]]);
wx.createComponent(Component);
