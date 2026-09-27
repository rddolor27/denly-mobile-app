const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// inlineRem 16: React Native Reusables sizes assume 1rem = 16pt (NativeWind's default is 14).
module.exports = withNativeWind(config, { input: './src/global.css', inlineRem: 16 });
