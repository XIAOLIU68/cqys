"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 内置图标名称，或图片路径，建议绝对路径
    icon: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.icon
    },
    // 提示文字
    text: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.text
    },
    // 文字颜色
    textColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.textColor
    },
    // 文字大小
    textSize: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.textSize
    },
    // 图标的颜色
    iconColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.iconColor
    },
    // 图标的大小
    iconSize: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.iconSize
    },
    // 选择预置的图标类型
    mode: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.mode
    },
    //  图标宽度，单位px
    width: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.width
    },
    // 图标高度，单位px
    height: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.height
    },
    // 是否显示组件
    show: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.show
    },
    // 组件距离上一个元素之间的距离，默认px单位
    marginTop: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.empty.marginTop
    }
  }
};
exports.props = props;
