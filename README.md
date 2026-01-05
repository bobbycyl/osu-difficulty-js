# osu-difficulty-js

使用子进程或 [node-api-dotnet](https://github.com/microsoft/node-api-dotnet) 调用 osu-tools 完成谱面难度计算。

## 方法一：使用子进程调用

本仓库的 `osu-difficulty` 是一个 npm 包，

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

## 方法二：使用 node-api-dotnet

**⚠️ 注**：这部分内容没有做成 npm 包，以下仅为使用指引

1. 克隆 osu-tools 仓库，编译 `PerformanceCalculator`，以 win-x64 架构为例。

   ```bash
   dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=false -p:IncludeNativeLibrariesForSelfExtract=true
   ```

2. 安装 `node-api-dotnet`。

   ```bash
   npm install node-api-dotnet
   ```

3. 根据需求修改 `OsuNodeHelper` 项目，并按照与第 1 步相同的方法编译
4. 在 JavaScript 中调用 `OsuNodeHelper`。调用方法可参考 [example.js](./example.js)。

## 常见问题

**Q1**：哪一种方法更好？

**A1**：取决于应用场景。如果生产环境没有 .Net 运行时，甚至可以编译为单文件然后再通过子进程调用。

**Q2**：为什么不能像 [osupp](https://github.com/bobbycyl/osupp) 那样在 JavaScript 中实例化一个 C# `calculator`？

**A2**：测试下来，`node-api-dotnet` 对于复杂的 C# 泛型支持有限，仿照 `osu-tools` 封装计算过程并暴露一个公开的函数供 JavaScript 调用更加稳定。
