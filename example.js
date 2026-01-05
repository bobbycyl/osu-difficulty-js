const dotnet = require("node-api-dotnet");
const path = require('path');

dotnet.load(
  path.resolve("./OsuNodeHelper/bin/Release/net8.0/win-x64/publish/OsuNodeHelper.dll")
);

const { OsuCalculator } = dotnet.OsuNodeHelper;

async function run() {
  try {
    const beatmapPath =
      "./tests/3477131.osu";
    const mods = ["HD", "DT"];
    const modOptions = ["DT_speed_change=1.3"];
    const rawResult = OsuCalculator.CalculateDifficulty(
      beatmapPath,
      0,
      mods,
      modOptions
    );
    const jsonString = String(rawResult);
    const result = JSON.parse(jsonString);

    console.log(result);
  } catch (err) {
    console.error("Error calling .NET:", err);
  }
}

run();
