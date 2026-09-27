// NativeWind v4 (ADR 0009): className support via its JSX runtime and babel preset.
// babel-preset-expo adds the Reanimated/worklets plugin on its own (SDK 57).
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
