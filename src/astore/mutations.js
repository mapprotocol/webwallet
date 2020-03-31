export const changeNavIndex = (state, value) => {
  if (state.navIndex !== value) {
    if (process.env.LOGGER) {
      console.debug("Nav Index 更改：" + value);
    }
    state.navIndex = value;
    Bus.$emit("changeNavIndex", value);
  }
};
