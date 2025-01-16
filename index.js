import express from "express";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON body parsing
app.use(express.json());

// Helper to get directory path (ESM-compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint to generate an app
app.post("/generate-app", async (req, res) => {
  const { name, website } = req.body;

  // Validate input
  if (!name || !website) {
    return res.status(400).json({
      error: "Name and website are required fields.",
    });
  }

  try {
    // Define the app configuration dynamically based on input
    const appConfig = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"), // Slug-friendly name
      website,
    };

    // Path to the Expo project
    const expoProjectPath = path.resolve(__dirname, "expo-project");

    // Update app.json dynamically for Expo project
    const appJsonPath = path.join(expoProjectPath, "app.json");
    const appJsonContent = {
      expo: {
        name: appConfig.name,
        slug: appConfig.slug,
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "automatic",
        splash: {
          image: "./assets/splash.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
        updates: {
          fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
          supportsTablet: true,
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff",
          },
        },
        web: {
          favicon: "./assets/favicon.png",
        },
      },
    };

    // Write the updated app.json file
    await fs.writeFile(appJsonPath, JSON.stringify(appJsonContent, null, 2));

    // Run EAS build command
    const buildCommand = `cd ${expoProjectPath} && eas build --platform all --non-interactive`;
    exec(buildCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Error during EAS build:", error);
        return res.status(500).json({ error: "Failed to generate the app." });
      }

      console.log("EAS Build Output:", stdout);
      console.error("EAS Build Error Output:", stderr);

      // Respond with app links (replace placeholders after testing)
      res.status(200).json({
        message: "App generated successfully!",
        details: {
          name: appConfig.name,
          iosLink: `https://expo.dev/accounts/grey_project/projects/${appConfig.slug}/builds/<build-id-ios>`,
          androidLink: `https://expo.dev/accounts/grey_project/projects/${appConfig.slug}/builds/<build-id-android>`,
        },
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
