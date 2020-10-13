var glob = require("glob");
var path = require("path");
var fs = require("fs");

module.exports = function(source) {
  this.cacheable();
  var chimport = /chimport +([\'\"])(.*?)\1\s*?;/gm;
  var resourceDir = path.dirname(this.resourcePath);
  function replacer(match, quote, filename) {
    var result = glob
      .sync(filename, {
        cwd: resourceDir
      })
      .map(function(file, index) {
        const fullFile = path.resolve(resourceDir, file);
        return fs.readFileSync(fullFile);
      })
      .join('\n\n');
    return result;
  }
  var res = source.replace(chimport, replacer);
  return res;
};
