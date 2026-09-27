// react-native-gesture-handler is an optional peer of expo-router that pnpm installs
// automatically. Only expo-router's JS stack navigator uses it; Denly uses the native stack and
// tabs. Its Android codegen path exceeds Windows' 260-character limit and breaks the local build,
// so it is kept out of native autolinking. Remove this entry if a screen ever needs gestures
// from it (and build from a short path or with Windows long paths enabled).
module.exports = {
  dependencies: {
    'react-native-gesture-handler': {
      platforms: { android: null, ios: null },
    },
  },
};
