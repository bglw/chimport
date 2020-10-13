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
        const dirname = path.dirname(file);
        const fullFilePath = path.resolve(resourceDir, file);
        let fullFileContent = fs.readFileSync(fullFilePath).toString();

        fullFileContent = rewriteImports(fullFileContent, dirname);
        fullFileContent = rewriteRequires(fullFileContent, dirname);

        return fullFileContent;
      })
      .join('\n\n');
    return result;
  }
  var res = source.replace(chimport, replacer);
  return res;
};

const rewriteImports = (src, dirname) => {
  var importRegex = /import +([\'\"])(.*?)\1/gm;

  function replacer(match, quote, filename) {
    return `import '${dirname}/${filename}'`;
  }

  return src.replace(importRegex, replacer);
}

const rewriteRequires = (src, dirname) => {
  var requireRegex = /require\(([\'\"])([^\+\$\'\"]*?)\1\)/gm;

  function replacer(match, quote, filename) {
    return `require('${dirname}/${filename}')`;
  }

  return src.replace(requireRegex, replacer);
}