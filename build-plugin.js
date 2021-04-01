const ext = 'stories.js';

class Compiler extends BabelCompiler {
  // Overrides processFilesForTarget to make added javascript not lazy
  processFilesForTarget(inputFiles) {
    var compiler = this;
    
    // Reset this cache for each batch processed.
    this._babelrcCache = null;

    inputFiles.forEach(function (inputFile) {
      var path = inputFile.getPathInPackage();
      var inNodeModules = path.startsWith('node_modules/') || path.includes('/node_modules/');
      console.log('compiling', inputFile.getPathInPackage(), inNodeModules);
      if (inputFile.supportsLazyCompilation) {
        inputFile.addJavaScript({
          path: inputFile.getPathInPackage(),
          bare: !!inputFile.getFileOptions().bare,
          lazy: inNodeModules || !inputFile.getPathInPackage().endsWith(`.${ext}`),
        }, function () {
          return compiler.processOneFileForTarget(inputFile);
        });
      } else {
        var toBeAdded = compiler.processOneFileForTarget(inputFile);
        if (toBeAdded) {
          inputFile.addJavaScript(toBeAdded);
        }
      }
    });
  }
}

Plugin.registerCompiler({
  extensions: [ext],
}, function () {
  return new Compiler({
    react: true
  }, (babelOptions, file) => {
    if (file.hmrAvailable() && ReactFastRefresh.babelPlugin) {
      babelOptions.plugins = babelOptions.plugins || [];
      babelOptions.plugins.push(ReactFastRefresh.babelPlugin);
    }
  });
});
