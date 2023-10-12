"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 吸顶容器到顶部某个距离的时候，进行吸顶，在H5平台，NavigationBar为44px
    offsetTop: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.sticky.offsetTop
    },
    // 自定义导航栏的高度
    customNavHeight: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.sticky.customNavHeight
    },
    // 是否开启吸顶功能
    disabled: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.sticky.disabled
    },
    // 吸顶区域的背景颜色
    bgColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.sticky.bgColor
    },
    // z-index值
    zIndex: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.sticky.zIndex
    },
    // 列表中的索引值
    index: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.sticky.index
    }
  }
};
exports.props = props;
