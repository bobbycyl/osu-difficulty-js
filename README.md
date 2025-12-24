# osu-difficulty-js

使用子进程调用 osu-tools 完成谱面难度计算。

通过 edge-js 调用 .Net 太脆弱了，暂时选择使用 osu-tools 原生的 CLI 完成。

这个仓库只能算是 [osupp](https://github.com/bobbycyl/osupp) 的一个副产物罢了，虽然二者都很草率就是了。

## 使用示例

```js
// calculate.js
const { calculateDifficulty } = require("osu-difficulty");
const path = require("path");

async function main() {
  try {
    const result = await calculateDifficulty({
      beatmap: 3477131, // BID
      mods: ["HD", "DT"],
      modOptions: ["DT_speed_change=1.3"],
      calculatorDllPath: "path/to/PerformanceCalculator.dll", // 需要预先编译
    });

    console.log(JSON.stringify(result.results[0].attributes, null, 2));
  } catch (err) {
    console.error("Failed to calculate difficulty:", err.message);
  }
}

main();
```

这里贴上 osu-tools 的帮助页面：

```
Computes the difficulty of a beatmap.

Usage: dotnet PerformanceCalculator.dll difficulty [options] <path>

Arguments:
  path                         Required. A beatmap file (.osu), beatmap ID, or a folder containing .osu files to compute
                               the difficulty for.

Options:
  -?|-h|--help                 Show help information.
  -r|--ruleset[:<ruleset-id>]  Optional. The ruleset to compute the beatmap difficulty for, if it's a convertible
                               beatmap.
                               Values: 0 - osu!, 1 - osu!taiko, 2 - osu!catch, 3 - osu!mania
                               Allowed values are: 0, 1, 2, 3.
  -m|--m <mod>                 One for each mod. The mods to compute the difficulty with.Values: hr, dt, hd, fl, ez, 4k,
                               5k, etc...
  -o|--mod-option <option>     The options of mods, with one for each setting. Specified as acryonym_settingkey=value.
                               Example: DT_speed_change=1.35
  -j|--json                    Output results as JSON.
```
