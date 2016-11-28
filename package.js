Package.describe({
  name: 'runisland:static-assets',
  version: '0.1.5',
  summary: 'Load static assets from dependencies (like node modules)',
  git: 'https://github.com/runisland/meteor-static-assets',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'compileStaticAssets',
  use: [
    'caching-compiler@1.0.0',
    'ecmascript@0.2.0'
  ],
  sources: [
    'plugin.js'
  ],
  npmDependencies: {
    lodash: '4.13.1',
    colors: '1.1.2'
  }
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');
});
