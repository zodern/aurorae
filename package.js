Package.describe({
  name: 'zodern:aurorae',
  summary: 'Development environment for UI components',
  git: 'https://github.com/zodern/aurorae.git',
  documentation: './readme.md',
  version: '0.1.1'
});

Package.onUse(api => {
  api.versionsFrom('2.0')
  api.use('ecmascript');
  api.use('dynamic-import');
  api.use('zodern:melte@1.4.4');

  api.imply('zodern:aurorae-compiler@0.1.2');

  api.mainModule('./main.js', 'client');
  api.mainModule('./server.js', 'server');

});
