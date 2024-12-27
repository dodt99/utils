export default {
  mounted(el, { value }) {
    if (value === false) {
      return;
    }

    if (value && typeof value === "string") {
      el.querySelector(value)?.focus();
    } else {
      el.focus();
    }
  },
};
