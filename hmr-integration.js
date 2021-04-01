
if (module.hot) {
  function hasNoExports(module) {
    return !module.exports ||
      Object.keys(module.exports).filter(name => name !== '__esModule').length === 0;
  }

  module.hot.onRequire({
    // TODO: there is a bug in the `hot-module-replacement` package when
    // the before hook is missing
    before() {

    },
    after(module) {
      if (!module.id.endsWith('.story.js')) {
        return;
      }
      // Make sure HMR is available,
      // the module has no exports,
      // and the module added messages
      if (module.hot && hasNoExports(module)) {
        module.hot.accept();
      }
    }
  });
}
