const { withPlugins, withInfoPlist, withPodfileProperties } = require('@expo/config-plugins');

module.exports = function expoPluginSystemSetting(config) {
  return withPlugins(config, [
    // 1. give iOS permission to run background audio
    [
      withInfoPlist,
      plist => {
        plist.UIBackgroundModes = plist.UIBackgroundModes || [];
        if (!plist.UIBackgroundModes.includes('audio')) {
          plist.UIBackgroundModes.push('audio');
        }

        return plist;
      }
    ],
    // 2. make sure CocoaPods links the lib
    config => {
      return withPodfileProperties(config, props => {
        props.podfileProperties = {
          ...props.podfileProperties,
          // this tells pod install to use the local node_module
          REACT_NATIVE_SYSTEM_SETTING_PATH: '../node_modules/react-native-system-setting'
        };
        return props;
      });
    }
  ]);
};
