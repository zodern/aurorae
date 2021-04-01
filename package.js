Package.describe({
  name: 'zodern:stories',
  description: 'Storybook for Meteor',
  // devOnly: true,
});

Package.onUse(api => {
  api.use('svelte:compiler');
  api.use('ecmascript');
  api.mainModule('./client.js', 'client');
  api.use('isobuild:compiler-plugin@1.0.0');
});

Package.registerBuildPlugin({
  name: 'compile-stories',
  use: ['babel-compiler', 'react-fast-refresh'],
  sources: ['build-plugin.js']
});
