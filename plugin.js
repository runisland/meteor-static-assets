import {
  defaults
} from 'lodash';

import fs from 'fs';

import colors from 'colors';

const defaultConfig = {
  verbose: false,
  scanFolders: true,
  extensions: [
    'ttf',
    'woff',
    'png'
  ],
  map: {}
};

// Load configuration as defined in [MeteorProjectRoot/static-assets.json] file.
const config = defaults(getConfig('static-assets.json'), defaultConfig),
    getCustomPathFn = config.scanFolders ? getCustomPathFolders : getCustomPathScrict;

class StaticAssetsCompiler {
  processFilesForTarget(files) {
    files.forEach((file) => {
      this.extendFile(file);
      this.processFile(file);
    });
  }

  extendFile(file) {
    file.getCustomPath = getCustomPathFn;
  }

  processFile(file) {
    const customPath = file.getCustomPath();
    const path = file.getPathInPackage();

    if (customPath) {
      this.log(`"${path}" as ${customPath}`);

      file.addAsset({
        data: file.getContentsAsBuffer(),
        path: customPath
      });
    }
  }

  log(msg) {
    if (config.verbose === true) {
      console.log(colors.blue('[Static Asset]'), msg);
    }
  }
}

Plugin.registerCompiler({
  extensions: config.extensions
}, () => new StaticAssetsCompiler);


// Original method from mys:fonts
function getCustomPathScrict() {
  return config.map[this.getPathInPackage()];
}

// Extended method to match immediate parent folders in listed static assets.
function getCustomPathFolders() {
  var truePath = this.getPathInPackage(),
      customPath = config.map[truePath];

  if (customPath) {
    return customPath;
  } else {
    let slashPos = truePath.lastIndexOf("/") + 1, // getPathInPackage() always uses forward slashes. See https://docs.meteor.com/api/packagejs.html#build-plugin-api
        folder = truePath.substring(0, slashPos),
        fileName = truePath.substr(slashPos);

    if (folder) {
      customPath = config.map[folder];

      if (customPath) {
        return customPath + fileName;
      }
    }
  }

  return null;
}

function getConfig(configFileName) {
  var path = Plugin.path;

  var appdir = process.env.PWD || process.cwd();
  var custom_config_filename = path.join(appdir, configFileName);
  var userConfig = {};

  if (fs.existsSync(custom_config_filename)) {
    userConfig = fs.readFileSync(custom_config_filename, {
      encoding: 'utf8'
    });
    userConfig = JSON.parse(userConfig);
  }
  return userConfig;
}
