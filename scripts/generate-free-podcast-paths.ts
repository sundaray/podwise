// scripts/generate-free-podcast-paths.ts
const fs = require("fs");
const path = require("path");

/**
 * Function to convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Function to get host name from file name
 */
function getHostNameFromFileName(fileName: string): string {
  // Convert filename (like "tim-ferriss.ts") to host name ("tim-ferriss")
  return fileName.replace(/\.(ts|js)$/, "");
}

/**
 * Function to generate free podcast paths
 */
function generateFreePodcastPaths(): void {
  console.log("🔍 Starting to generate free podcast paths...");

  const podcastListDir = path.join(process.cwd(), "podcast-list");
  console.log(`Looking for podcast list files in: ${podcastListDir}`);

  let allFreePaths: string[] = [];

  try {
    // Read all files in the podcast-list directory
    const files = fs.readdirSync(podcastListDir);
    console.log(
      `Found ${files.length} files in podcast-list directory:`,
      files,
    );

    // Process each file
    for (const file of files) {
      try {
        // Skip non-TypeScript/JavaScript files
        if (!file.endsWith(".ts") && !file.endsWith(".js")) {
          console.log(`Skipping non-TS/JS file: ${file}`);
          continue;
        }

        const filePath = path.join(podcastListDir, file);
        console.log(`Processing file: ${filePath}`);

        // Read the file content
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Extract host name from file name
        const hostName = getHostNameFromFileName(file);
        console.log(`Host name: ${hostName}`);

        // Use regex to find podcasts with isPremium: false
        // This regex pattern looks for objects with slug and isPremium: false
        const freePodcastRegex =
          /{\s*(?:[^{}]*,)?\s*slug:\s*["']([^"']+)["'](?:[^{}]*,)?\s*isPremium:\s*false(?:[^{}]*,)?[^{}]*}/g;

        let match;
        const freeSlugs: string[] = [];

        // Find all matches
        while ((match = freePodcastRegex.exec(fileContent)) !== null) {
          // match[1] contains the captured slug
          freeSlugs.push(match[1]);
        }

        console.log(`Found ${freeSlugs.length} free podcasts in ${hostName}`);

        // Create paths for each free podcast
        const freePaths = freeSlugs.map(
          (slug) => `/podcasts/${hostName}/${slug}`,
        );
        allFreePaths = [...allFreePaths, ...freePaths];
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`Error processing file ${file}:`, errorMessage);
        if (error instanceof Error && error.stack) {
          console.error(error.stack);
        }
      }
    }

    console.log(`Total free podcasts found: ${allFreePaths.length}`);

    // Sort the paths for readability
    allFreePaths.sort();

    // Generate the output code
    const output: string = `// Auto-generated free podcast paths - DO NOT EDIT MANUALLY
// Generated on ${new Date().toISOString()}

export const freePodcastPaths = [
${allFreePaths
  .map((path: string) => {
    return `  "${path}",`;
  })
  .join("\n")}
];
`;

    // Write to the file
    const outputDir: string = path.join(process.cwd(), "lib", "podcast");
    const outputFile: string = path.join(outputDir, "free-podcast-paths.ts");

    // Ensure the directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, output);

    if (allFreePaths.length > 0) {
      console.log(
        `✅ Generated ${allFreePaths.length} free podcast paths to ${outputFile}`,
      );
    } else {
      console.error(
        `❌ No free podcast paths were found! Check the console output above to see what went wrong.`,
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error reading podcast list directory:`, errorMessage);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  }
}

// Run the function
generateFreePodcastPaths();
