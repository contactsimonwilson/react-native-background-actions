import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withInfoPlist,
  withAndroidManifest,
} from "@expo/config-plugins";

const pkg = { name: "react-native-background-actions", version: "UNVERSIONED" }; //require('react-native-background-actions/package.json')

/**
 * Apply background actions native configuration.
 */
const withBackgroundActions: ConfigPlugin<void> = (config) => {
  // iOS
  config = withInfoPlist(config, (newConfig) => {
    if (!newConfig.modResults.BGTaskSchedulerPermittedIdentifiers) {
      newConfig.modResults.BGTaskSchedulerPermittedIdentifiers = [];
    }

    if (
      Array.isArray(newConfig.modResults.BGTaskSchedulerPermittedIdentifiers)
    ) {
      newConfig.modResults.BGTaskSchedulerPermittedIdentifiers.push(
        "$(PRODUCT_BUNDLE_IDENTIFIER)"
      );
    }

    return newConfig;
  });

  // Android
  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.FOREGROUND_SERVICE",
    "android.permission.WAKE_LOCK",
  ]);

  config = withAndroidManifest(config, (newConfig) => {
    if (newConfig.modResults.manifest.application) {
      if (!newConfig.modResults.manifest.application[0].service) {
        newConfig.modResults.manifest.application[0].service = [];
      }

      newConfig.modResults.manifest.application[0].service.push({
        $: {
          "android:name":
            "com.asterinet.react.bgactions.RNBackgroundActionsTask",
        },
      });
    }
    return newConfig;
  });

  return config;
};

export default createRunOncePlugin(
  withBackgroundActions,
  pkg.name,
  pkg.version
);
