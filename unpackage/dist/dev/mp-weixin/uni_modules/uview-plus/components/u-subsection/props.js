"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // tab的数据
    list: {
      type: Array,
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.list
    },
    // 当前活动的tab的index
    current: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.current
    },
    // 激活的颜色
    activeColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.activeColor
    },
    // 未激活的颜色
    inactiveColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.inactiveColor
    },
    // 模式选择，mode=button为按钮形式，mode=subsection时为分段模式
    mode: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.mode
    },
    // 字体大小
    fontSize: {
      type: [String, Number],
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.fontSize
    },
    // 激活tab的字体是否加粗
    bold: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.bold
    },
    // mode = button时，组件背景颜色
    bgColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.bgColor
    },
    // 从list元素对象中读取的键名
    keyName: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.subsection.keyName
    }
  }
};
exports.props = props;
