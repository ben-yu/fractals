window.require.register("index", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  buf.push("<div id=\"shaderFractal\"></div><script src=\"/js/vendor.js\"></script><script src=\"/js/app.js\"></script><script>require('scripts/fractal')</script>");;return buf.join("");
  };
});
