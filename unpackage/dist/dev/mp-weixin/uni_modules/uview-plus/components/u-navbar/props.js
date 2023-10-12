"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 是否开启顶部安全区适配
    safeAreaInsetTop: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.safeAreaInsetTop
    },
    // 固定在顶部时，是否生成一个等高元素，以防止塌陷
    placeholder: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.placeholder
    },
    // 是否固定在顶部
    fixed: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.fixed
    },
    // 是否显示下边框
    border: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.border
    },
    // 左边的图标
    leftIcon: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.leftIcon
    },
    // 左边的提示文字
    leftText: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.leftText
    },
    // 左右的提示文字
    rightText: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.rightText
    },
    // 右边的图标
    rightIcon: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.rightIcon
    },
    // 标题
    title: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.title
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.bgColor
    },
    // 标题的宽度
    titleWidth: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.titleWidth
    },
    // 导航栏高度
    height: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.height
    },
    // 左侧返回图标的大小
    leftIconSize: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.leftIconSize
    },
    // 左侧返回图标的颜色
    leftIconColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.leftIconColor
    },
    // 点击左侧区域(返回图标)，是否自动返回上一页
    autoBack: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.autoBack
    },
    // 标题的样式，对象或字符串
    titleStyle: {
      type: [String, Object],
      default: uni_modules_uviewPlus_libs_config_props.defprops.navbar.titleStyle
    }
  }
};
exports.props = props;
