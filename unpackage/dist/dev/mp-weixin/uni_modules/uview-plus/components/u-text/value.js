"use strict";
const common_vendor = require("../../../../common/vendor.js");
const value = {
  computed: {
    // 经处理后需要显示的值
    value() {
      const {
        text,
        mode,
        format,
        href
      } = this;
      if (mode === "price") {
        if (!/^\d+(\.\d+)?$/.test(text)) {
          common_vendor.index.$u.error("金额模式下，text参数需要为金额格式");
        }
        if (common_vendor.index.$u.test.func(format)) {
          return format(text);
        }
        return common_vendor.index.$u.priceFormat(text, 2);
      }
      if (mode === "date") {
        !common_vendor.index.$u.test.date(text) && common_vendor.index.$u.error("日期模式下，text参数需要为日期或时间戳格式");
        if (common_vendor.index.$u.test.func(format)) {
          return format(text);
        }
        if (format) {
          return common_vendor.index.$u.timeFormat(text, format);
        }
        return common_vendor.index.$u.timeFormat(text, "yyyy-mm-dd");
      }
      if (mode === "phone") {
        if (common_vendor.index.$u.test.func(format)) {
          return format(text);
        }
        if (format === "encrypt") {
          return `${text.substr(0, 3)}****${text.substr(7)}`;
        }
        return text;
      }
      if (mode === "name") {
        !(typeof text === "string") && common_vendor.index.$u.error("姓名模式下，text参数需要为字符串格式");
        if (common_vendor.index.$u.test.func(format)) {
          return format(text);
        }
        if (format === "encrypt") {
          return this.formatName(text);
        }
        return text;
      }
      if (mode === "link") {
        !common_vendor.index.$u.test.url(href) && common_vendor.index.$u.error("超链接模式下，href参数需要为URL格式");
        return text;
      }
      return text;
    }
  },
  methods: {
    // 默认的姓名脱敏规则
    formatName(name) {
      let value2 = "";
      if (name.length === 2) {
        value2 = name.substr(0, 1) + "*";
      } else if (name.length > 2) {
        let char = "";
        for (let i = 0, len = name.length - 2; i < len; i++) {
          char += "*";
        }
        value2 = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        value2 = name;
      }
      return value2;
    }
  }
};
exports.value = value;
