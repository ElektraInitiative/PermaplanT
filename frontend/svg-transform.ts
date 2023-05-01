// Jest can't handle SVG files.
// We will therefore transform them into an empty module.
module.exports = {
  process() {
    return {
      code: `module.exports = {};`,
    };
  },
};
