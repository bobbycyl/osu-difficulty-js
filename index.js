const { spawn } = require("child_process");
const path = require("path");

/**
 * 计算 osu! beatmap 难度
 * @param {Object} options
 * @param {string|number} options.beatmap
 * @param {number} [options.ruleset]
 * @param {string[]} [options.mods]
 * @param {string[]} [options.modOptions]
 * @param {string} [options.dotnetPath='dotnet']
 * @param {string} options.calculatorDllPath
 * @returns {Promise<Object>}
 */
function calculateDifficulty(options) {
  const {
    beatmap,
    ruleset,
    mods = [],
    modOptions = [],
    dotnetPath = "dotnet",
    calculatorDllPath,
  } = options;

  if (!calculatorDllPath) {
    throw new Error("calculatorDllPath is required");
  }

  const args = [calculatorDllPath, "difficulty"];

  if (ruleset !== undefined) {
    args.push("--ruleset", String(ruleset));
  }

  for (const mod of mods) {
    args.push("-m", mod);
  }

  for (const opt of modOptions) {
    args.push("-o", opt);
  }

  args.push(String(beatmap), "-j");

  return new Promise((resolve, reject) => {
    const child = spawn(dotnetPath, args, {
      cwd: path.dirname(calculatorDllPath),
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));

    child.on("error", (err) => {
      reject(new Error(`Failed to run dotnet: ${err.message}`));
    });

    child.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (e) {
          reject(
            new Error(`Invalid JSON output: ${e.message}\nOutput: ${stdout}`)
          );
        }
      } else {
        reject(
          new Error(
            `Command failed with code ${code}\nstderr: ${stderr}\nstdout: ${stdout}`
          )
        );
      }
    });
  });
}

module.exports = { calculateDifficulty };
