"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uSticky_props = require("./props.js");
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
  name: "u-sticky",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uSticky_props.props],
  data() {
    return {
      cssSticky: false,
      // 是否使用css的sticky实现
      stickyTop: 0,
      // 吸顶的top值，因为可能受自定义导航栏影响，最终的吸顶值非offsetTop值
      elId: common_vendor.index.$u.guid(),
      left: 0,
      // js模式时，吸顶的内容因为处于postition: fixed模式，为了和原来保持一致的样式，需要记录并重新设置它的left，height，width属性
      width: "auto",
      height: "auto",
      fixed: false
      // js模式时，是否处于吸顶模式
    };
  },
  computed: {
    style() {
      const style = {};
      if (!this.disabled) {
        if (this.cssSticky) {
          style.position = "sticky";
          style.zIndex = this.uZindex;
          style.top = common_vendor.index.$u.addUnit(this.stickyTop);
        } else {
          style.height = this.fixed ? this.height + "px" : "auto";
        }
      } else {
        style.position = "static";
      }
      style.backgroundColor = this.bgColor;
      return common_vendor.index.$u.deepMerge(common_vendor.index.$u.addStyle(this.customStyle), style);
    },
    // 吸顶内容的样式
    stickyContent() {
      const style = {};
      if (!this.cssSticky) {
        style.position = this.fixed ? "fixed" : "static";
        style.top = this.stickyTop + "px";
        style.left = this.left + "px";
        style.width = this.width == "auto" ? "auto" : this.width + "px";
        style.zIndex = this.uZindex;
      }
      return style;
    },
    uZindex() {
      return this.zIndex ? this.zIndex : common_vendor.index.$u.zIndex.sticky;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getStickyTop();
      this.checkSupportCssSticky();
      if (!this.cssSticky) {
        !this.disabled && this.initObserveContent();
      }
    },
    initObserveContent() {
      this.$uGetRect("#" + this.elId).then((res) => {
        this.height = res.height;
        this.left = res.left;
        this.width = res.width;
        this.$nextTick(() => {
          this.observeContent();
        });
      });
    },
    observeContent() {
      this.disconnectObserver("contentObserver");
      const contentObserver = common_vendor.index.createIntersectionObserver({
        // 检测的区间范围
        thresholds: [0.95, 0.98, 1]
      });
      contentObserver.relativeToViewport({
        top: -this.stickyTop
      });
      contentObserver.observe(`#${this.elId}`, (res) => {
        this.setFixed(res.boundingClientRect.top);
      });
      this.contentObserver = contentObserver;
    },
    setFixed(top) {
      const fixed = top <= this.stickyTop;
      this.fixed = fixed;
    },
    disconnectObserver(observerName) {
      const observer = this[observerName];
      observer && observer.disconnect();
    },
    getStickyTop() {
      this.stickyTop = common_vendor.index.$u.getPx(this.offsetTop) + common_vendor.index.$u.getPx(this.customNavHeight);
    },
    async checkSupportCssSticky() {
      if (common_vendor.index.$u.os() === "android" && Number(common_vendor.index.$u.sys().system) > 8) {
        this.cssSticky = true;
      }
      this.cssSticky = await this.checkComputedStyle();
      if (common_vendor.index.$u.os() === "ios") {
        this.cssSticky = true;
      }
    },
    // 在APP和微信小程序上，通过uni.createSelectorQuery可以判断是否支持css sticky
    checkComputedStyle() {
      return new Promise((resolve) => {
        common_vendor.index.createSelectorQuery().in(this).select(".u-sticky").fields({
          computedStyle: ["position"]
        }).exec((e) => {
          resolve("sticky" === e[0].position);
        });
      });
    },
    // H5通过创建元素的形式嗅探是否支持css sticky
    // 判断浏览器是否支持sticky属性
    checkCssStickyForH5() {
    }
  },
  beforeDestroy() {
    this.disconnectObserver("contentObserver");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.stickyContent),
    b: $data.elId,
    c: common_vendor.s($options.style)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8b303089"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-sticky/u-sticky.vue"]]);
wx.createComponent(Component);
