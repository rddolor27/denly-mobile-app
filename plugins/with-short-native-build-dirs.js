// Windows keeps a 260-character path limit for the CMake/ninja native builds. Native libraries
// stage their CMake build under node_modules/<lib>/android/.cxx/<Variant>/<hash>/<abi>/, which in
// this workspace pushes react-native-reanimated's release objects to 261 characters and fails with
// "build.ninja still dirty after 100 tries". This plugin moves every Android library's CMake
// staging directory to android/.cx/<module>, ~35 characters shorter. The app module's autolinked
// codegen still embeds the full source path in object names, so the app module (only) gets
// CMAKE_OBJECT_PATH_MAX: above it, CMake replaces long object file names with short hashes
// (applying it to the libraries broke react-native-worklets' build, so they keep the default).
// android/ is generated (CNG) and git-ignored, so the change lives here and is re-applied on every
// prebuild.
//
// Even so, the app module's autolinked codegen objects exceed 260 characters in the release
// (RelWithDebInfo) native build here, while the Debug native build fits. Until the build runs from
// a shorter path or with Windows long paths enabled, `-PdenlyEmbedJs` builds the debug variant
// with the production JS bundle embedded (no Metro needed), which installs and runs standalone.
// Without the flag, debug keeps loading JS from Metro as usual.
const { withAppBuildGradle, withProjectBuildGradle } = require('expo/config-plugins');

const APP_MARKER = '// denly: -PdenlyEmbedJs embeds the JS bundle in debug';
const APP_LINE = `    ${APP_MARKER}\n    debuggableVariants = project.hasProperty('denlyEmbedJs') ? [] : ['debug']\n`;

const MARKER = '// denly: short CMake staging dirs';
const SNIPPET = `
${MARKER}
subprojects { project ->
  project.plugins.withId('com.android.library') {
    project.android.externalNativeBuild.cmake.buildStagingDirectory =
      new File(rootProject.projectDir, ".cx/" + project.name)
  }
  project.plugins.withId('com.android.application') {
    project.android.defaultConfig.externalNativeBuild.cmake.arguments("-DCMAKE_OBJECT_PATH_MAX=128")
  }
}
`;

module.exports = function withShortNativeBuildDirs(config) {
  const withRoot = withProjectBuildGradle(config, (mod) => {
    if (mod.modResults.language === 'groovy' && !mod.modResults.contents.includes(MARKER)) {
      mod.modResults.contents += SNIPPET;
    }
    return mod;
  });
  return withAppBuildGradle(withRoot, (mod) => {
    const src = mod.modResults.contents;
    if (mod.modResults.language === 'groovy' && !src.includes(APP_MARKER)) {
      mod.modResults.contents = src.replace(/^react \{\n/m, (m) => m + APP_LINE);
    }
    return mod;
  });
};
