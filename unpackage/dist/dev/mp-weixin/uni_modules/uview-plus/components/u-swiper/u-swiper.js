"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uSwiper_props = require("./props.js");
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
  name: "u-swiper",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uSwiper_props.props],
  data() {
    return {
      currentIndex: 0
    };
  },
  watch: {
    current(val, preVal) {
      if (val === preVal)
        return;
      this.currentIndex = val;
    }
  },
  computed: {
    itemStyle() {
      return (index) => {
        const style = {};
        if (this.nextMargin && this.previousMargin) {
          style.borderRadius = common_vendor.index.$u.addUnit(this.radius);
          if (index !== this.currentIndex)
            style.transform = "scale(0.92)";
        }
        return style;
      };
    }
  },
  methods: {
    getItemType(item) {
      if (typeof item === "string")
        return common_vendor.index.$u.test.video(this.getSource(item)) ? "video" : "image";
      if (typeof item === "object" && this.keyName) {
        if (!item.type)
          return common_vendor.index.$u.test.video(this.getSource(item)) ? "video" : "image";
        if (item.type === "image")
          return "image";
        if (item.type === "video")
          return "video";
        return "image";
      }
    },
    // 获取目标路径，可能数组中为字符串，对象的形式，额外可指定对象的目标属性名keyName
    getSource(item) {
      if (typeof item === "string")
        return item;
      if (typeof item === "object" && this.keyName)
        return item[this.keyName];
      else
        common_vendor.index.$u.error("请按格式传递列表参数");
      return "";
    },
    // 轮播切换事件
    change(e) {
      const {
        current
      } = e.detail;
      this.pauseVideo(this.currentIndex);
      this.currentIndex = current;
      this.$emit("change", e.detail);
    },
    // 切换轮播时，暂停视频播放
    pauseVideo(index) {
      const lastItem = this.getSource(this.list[index]);
      if (common_vendor.index.$u.test.video(lastItem)) {
        const video = common_vendor.index.createVideoContext(`video-${index}`, this);
        video.pause();
      }
    },
    // 当一个轮播item为视频时，获取它的视频海报
    getPoster(item) {
      return typeof item === "object" && item.poster ? item.poster : "";
    },
    // 点击某个item
    clickHandler(index) {
      this.$emit("click", index);
    }
  }
};
if (!Array) {
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_swiper_indicator2 = common_vendor.resolveComponent("u-swiper-indicator");
  (_easycom_u_loading_icon2 + _easycom_u_swiper_indicator2)();
}
const _easycom_u_loading_icon = () => "../u-loading-icon/u-loading-icon.js";
const _easycom_u_swiper_indicator = () => "../u-swiper-indicator/u-swiper-indicator.js";
if (!Math) {
  (_easycom_u_loading_icon + _easycom_u_swiper_indicator)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.loading
  }, _ctx.loading ? {
    b: common_vendor.p({
      mode: "circle"
    })
  } : {
    c: common_vendor.f(_ctx.list, (item, index, i0) => {
      return common_vendor.e({
        a: $options.getItemType(item) === "image"
      }, $options.getItemType(item) === "image" ? {
        b: $options.getSource(item),
        c: _ctx.imgMode,
        d: common_vendor.o(($event) => $options.clickHandler(index), index),
        e: _ctx.$u.addUnit(_ctx.height),
        f: _ctx.$u.addUnit(_ctx.radius)
      } : {}, {
        g: $options.getItemType(item) === "video"
      }, $options.getItemType(item) === "video" ? {
        h: `video-${index}`,
        i: $options.getSource(item),
        j: $options.getPoster(item),
        k: _ctx.showTitle && _ctx.$u.test.object(item) && item.title ? item.title : "",
        l: _ctx.$u.addUnit(_ctx.height),
        m: common_vendor.o(($event) => $options.clickHandler(index), index)
      } : {}, {
        n: _ctx.showTitle && _ctx.$u.test.object(item) && item.title && _ctx.$u.test.image($options.getSource(item))
      }, _ctx.showTitle && _ctx.$u.test.object(item) && item.title && _ctx.$u.test.image($options.getSource(item)) ? {
        o: common_vendor.t(item.title)
      } : {}, {
        p: common_vendor.s($options.itemStyle(index)),
        q: index
      });
    }),
    d: _ctx.$u.addUnit(_ctx.height),
    e: common_vendor.o((...args) => $options.change && $options.change(...args)),
    f: _ctx.circular,
    g: _ctx.interval,
    h: _ctx.duration,
    i: _ctx.autoplay,
    j: _ctx.current,
    k: _ctx.currentItemId,
    l: _ctx.$u.addUnit(_ctx.previousMargin),
    m: _ctx.$u.addUnit(_ctx.nextMargin),
    n: _ctx.acceleration,
    o: _ctx.displayMultipleItems,
    p: _ctx.easingFunction
  }, {
    q: !_ctx.loading && _ctx.indicator && !_ctx.showTitle
  }, !_ctx.loading && _ctx.indicator && !_ctx.showTitle ? {
    r: common_vendor.p({
      indicatorActiveColor: _ctx.indicatorActiveColor,
      indicatorInactiveColor: _ctx.indicatorInactiveColor,
      length: _ctx.list.length,
      current: $data.currentIndex,
      indicatorMode: _ctx.indicatorMode
    })
  } : {}, {
    s: common_vendor.s(_ctx.$u.addStyle(_ctx.indicatorStyle)),
    t: _ctx.bgColor,
    v: _ctx.$u.addUnit(_ctx.height),
    w: _ctx.$u.addUnit(_ctx.radius)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4e7d0c90"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-swiper/u-swiper.vue"]]);
wx.createComponent(Component);
