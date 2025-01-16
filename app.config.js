export default {
  expo: {
    name: "grey_project", // Replace with your app name
    slug: "converter", // Replace with your app slug
    version: "1.0.0",
    sdkVersion: "49.0.0",
    orientation: "portrait",
    icon: "./assets/icon.jpg",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    platforms: ["ios", "android"],

    android: {
      package: "com.yourcompany.yourappname",
      gradleCommand: "./gradlew wrapper --gradle-version 8.2",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    ios: {
      bundleIdentifier: "com.yourcompany.yourappname",
      buildNumber: "1.0.0"
    },

    // Add the following extra block
    extra: {
      eas: {
        projectId: "5c97c5a5-6986-4356-b005-84b63e36dcdf" // Add your actual project ID here
      }
    }
  }
};
