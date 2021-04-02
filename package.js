Package.describe({
  name: 'zodern:aurorae',
  description: 'Storybook for Meteor',
  git: 'https://github.com/zodern/aurorae.git',
  documentation: './readme.md'
});

Package.onUse(api => {
  api.versionsFrom('2.0')
  api.use('svelte:compiler@3.31.2');
  api.use('ecmascript');
  api.use('dynamic-import');
  api.mainModule('./main.js', 'client');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.imply('zodern:aurorae-compiler');
});
