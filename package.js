Package.describe({
  name: 'zodern:aurorae',
  description: 'Storybook for Meteor',
  devOnly: true,
});

Package.onUse(api => {
  api.versionsFrom('2.0')
  api.use('svelte:compiler@3.31.2');
  api.use('ecmascript');
  api.mainModule('./client.js', 'client');
  api.use('isobuild:compiler-plugin@1.0.0');
});

Package.registerBuildPlugin({
  name: 'compile-stories',
  use: ['babel-compiler', 'react-fast-refresh'],
  sources: ['build-plugin.js']
});
