"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uPopup_props = require("./props.js");
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
  name: "u-popup",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uPopup_props.props],
  data() {
    return {
      overlayDuration: this.duration + 50
    };
  },
  watch: {
    show(newValue, oldValue) {
      if (newValue === true) {
        const children = this.$children;
        this.retryComputedComponentRect(children);
      }
    }
  },
  computed: {
    transitionStyle() {
      const style = {
        zIndex: this.zIndex,
        position: "fixed",
        display: "flex"
      };
      style[this.mode] = 0;
      if (this.mode === "left") {
        return common_vendor.index.$u.deepMerge(style, {
          bottom: 0,
          top: 0
        });
      } else if (this.mode === "right") {
        return common_vendor.index.$u.deepMerge(style, {
          bottom: 0,
          top: 0
        });
      } else if (this.mode === "top") {
        return common_vendor.index.$u.deepMerge(style, {
          left: 0,
          right: 0
        });
      } else if (this.mode === "bottom") {
        return common_vendor.index.$u.deepMerge(style, {
          left: 0,
          right: 0
        });
      } else if (this.mode === "center") {
        return common_vendor.index.$u.deepMerge(style, {
          alignItems: "center",
          "justify-content": "center",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        });
      }
    },
    contentStyle() {
      const style = {};
      common_vendor.index.$u.sys();
      if (this.mode !== "center") {
        style.flex = 1;
      }
      if (this.bgColor) {
        style.backgroundColor = this.bgColor;
      }
      if (this.round) {
        const value = common_vendor.index.$u.addUnit(this.round);
        if (this.mode === "top") {
          style.borderBottomLeftRadius = value;
          style.borderBottomRightRadius = value;
        } else if (this.mode === "bottom") {
          style.borderTopLeftRadius = value;
          style.borderTopRightRadius = value;
        } else if (this.mode === "center") {
          style.borderRadius = value;
        }
      }
      return common_vendor.index.$u.deepMerge(style, common_vendor.index.$u.addStyle(this.customStyle));
    },
    position() {
      if (this.mode === "center") {
        return this.zoom ? "fade-zoom" : "fade";
      }
      if (this.mode === "left") {
        return "slide-left";
      }
      if (this.mode === "right") {
        return "slide-right";
      }
      if (this.mode === "bottom") {
        return "slide-up";
      }
      if (this.mode === "top") {
        return "slide-down";
      }
    }
  },
  methods: {
    // 点击遮罩
    overlayClick() {
      if (this.closeOnClickOverlay) {
        this.$emit("close");
      }
    },
    close(e) {
      this.$emit("close");
    },
    afterEnter() {
      this.$emit("open");
    },
    clickHandler() {
      if (this.mode === "center") {
        this.overlayClick();
      }
      this.$emit("click");
    },
    retryComputedComponentRect(children) {
      const names = [
        "u-calendar-month",
        "u-album",
        "u-collapse-item",
        "u-dropdown",
        "u-index-item",
        "u-index-list",
        "u-line-progress",
        "u-list-item",
        "u-rate",
        "u-read-more",
        "u-row",
        "u-row-notice",
        "u-scroll-list",
        "u-skeleton",
        "u-slider",
        "u-steps-item",
        "u-sticky",
        "u-subsection",
        "u-swipe-action-item",
        "u-tabbar",
        "u-tabs",
        "u-tooltip"
      ];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const grandChild = child.$children;
        if (names.includes(child.$options.name) && typeof (child == null ? void 0 : child.init) === "function") {
          common_vendor.index.$u.sleep(50).then(() => {
            child.init();
          });
        }
        if (grandChild.length) {
          this.retryComputedComponentRect(grandChild);
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_u_overlay2 = common_vendor.resolveComponent("u-overlay");
  const _easycom_u_status_bar2 = common_vendor.resolveComponent("u-status-bar");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_safe_bottom2 = common_vendor.resolveComponent("u-safe-bottom");
  const _easycom_u_transition2 = common_vendor.resolveComponent("u-transition");
  (_easycom_u_overlay2 + _easycom_u_status_bar2 + _easycom_u_icon2 + _easycom_u_safe_bottom2 + _easycom_u_transition2)();
}
const _easycom_u_overlay = () => "../u-overlay/u-overlay.js";
const _easycom_u_status_bar = () => "../u-status-bar/u-status-bar.js";
const _easycom_u_icon = () => "../u-icon/u-icon.js";
const _easycom_u_safe_bottom = () => "../u-safe-bottom/u-safe-bottom.js";
const _easycom_u_transition = () => "../u-transition/u-transition.js";
if (!Math) {
  (_easycom_u_overlay + _easycom_u_status_bar + _easycom_u_icon + _easycom_u_safe_bottom + _easycom_u_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.overlay
  }, _ctx.overlay ? {
    b: common_vendor.o($options.overlayClick),
    c: common_vendor.p({
      show: _ctx.show,
      duration: $data.overlayDuration,
      customStyle: _ctx.overlayStyle,
      opacity: _ctx.overlayOpacity
    })
  } : {}, {
    d: _ctx.safeAreaInsetTop
  }, _ctx.safeAreaInsetTop ? {} : {}, {
    e: _ctx.closeable
  }, _ctx.closeable ? {
    f: common_vendor.p({
      name: "close",
      color: "#909399",
      size: "18",
      bold: true
    }),
    g: common_vendor.o((...args) => $options.close && $options.close(...args)),
    h: common_vendor.n("u-popup__content__close--" + _ctx.closeIconPos)
  } : {}, {
    i: _ctx.safeAreaInsetBottom
  }, _ctx.safeAreaInsetBottom ? {} : {}, {
    j: common_vendor.s($options.contentStyle),
    k: common_vendor.o((...args) => _ctx.noop && _ctx.noop(...args)),
    l: common_vendor.o($options.afterEnter),
    m: common_vendor.o($options.clickHandler),
    n: common_vendor.p({
      show: _ctx.show,
      customStyle: $options.transitionStyle,
      mode: $options.position,
      duration: _ctx.duration
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-05c24e9b"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-popup/u-popup.vue"]]);
wx.createComponent(Component);
