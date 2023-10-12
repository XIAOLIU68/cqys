"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uSafeBottom_props = require("./props.js");
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
require("../../libs/config/props/datetimePicker.js");
require("../../libs/config/props/icon.js");
require("../../libs/config/config.js");
require("../../libs/config/props/link.js");
require("../../libs/config/props/loadingIcon.js");
require("../../libs/config/props/navbar.js");
require("../../libs/config/color.js");
const _sfc_main = {
  name: "u-safe-bottom",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uSafeBottom_props.props],
  data() {
    return {
      safeAreaBottomHeight: 0,
      isNvue: false
    };
  },
  computed: {
    style() {
      const style = {};
      return common_vendor.index.$u.deepMerge(style, common_vendor.index.$u.addStyle(this.customStyle));
    }
  },
  mounted() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.style),
    b: common_vendor.n(!$data.isNvue && "u-safe-area-inset-bottom")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f3d22cfe"], ["__file", "F:/Qffiction/app1/uni-app/commApp/uni_modules/uview-plus/components/u-safe-bottom/u-safe-bottom.vue"]]);
wx.createComponent(Component);
