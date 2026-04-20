/**
 * Expo config plugin that adds the local Maven repo shipped with
 * @react-native-async-storage/async-storage v3.x so that Gradle
 * can resolve the org.asyncstorage.shared_storage:storage-android artifact.
 */
const { withProjectBuildGradle } = require("expo/config-plugins");

module.exports = function withAsyncStorageRepo(config) {
  return withProjectBuildGradle(config, (mod) => {
    if (mod.modResults.language === "groovy") {
      const contents = mod.modResults.contents;
      const repoLine = `        maven { url(new File(["node", "--print", "require.resolve('@react-native-async-storage/async-storage/package.json')"].execute(null, rootDir).text.trim(), "../android/local_repo")) }`;

      // Insert into allprojects > repositories block
      if (!contents.includes("async-storage") && !contents.includes("local_repo")) {
        mod.modResults.contents = contents.replace(
          /allprojects\s*\{[^}]*repositories\s*\{/,
          (match) => `${match}\n${repoLine}`
        );
      }
    }
    return mod;
  });
};
