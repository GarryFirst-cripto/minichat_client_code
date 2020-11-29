const { override, useEslintRc } = require('customize-cra');
const path = require('path');

// module.exports = override(useEslintRc());

module.exports = {
    paths: function (paths, env) {    
      override(useEslintRc());    
      paths.appBuild = path.join(paths.appBuild, 'web');
      return paths;
    },
  };
