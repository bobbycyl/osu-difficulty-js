const { describe, it } = require("node:test");
const assert = require("node:assert");
const { calculateDifficulty } = require("../index.js");

const CALCULATOR_DLL = process.env.OSU_CALCULATOR_DLL;

if (!CALCULATOR_DLL) {
  throw new Error("Set OSU_CALCULATOR_DLL env var");
}

describe("osu-difficulty", () => {
  it(
    "test",
    async () => {
      const result = await calculateDifficulty({
        beatmap: 3477131,
        mods: ["HD", "DT"],
        modOptions: ["DT_speed_change=1.3"],
        calculatorDllPath: CALCULATOR_DLL,
      });

      const attributes = result.results[0].attributes;

      const actual = JSON.stringify(attributes);

      const expected =
        '{"star_rating":8.340159453660592,"max_combo":1782,"aim_difficulty":4.464371148872465,"aim_difficult_slider_count":229.3534837920631,"speed_difficulty":3.5505915358962152,"speed_note_count":322.6236688454787,"slider_factor":0.9672502717561137,"aim_top_weighted_slider_factor":0.455429594945989,"speed_top_weighted_slider_factor":0.4901857094088748,"aim_difficult_strain_count":155.50956192853607,"speed_difficult_strain_count":91.93918738759285,"nested_score_per_object":27.145174371451745,"legacy_score_base_multiplier":4,"maximum_legacy_combo_score":52235232}';

      assert.strictEqual(actual, expected);
    },
    { timeout: 10000 }
  );
});
