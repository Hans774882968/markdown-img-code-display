[TOC]

## 引言

TODO

## 初始化项目

```powershell
bun create vite markdown-img-code-display
```

Prompt：

> 请帮我实现一个 Chrome 插件，实现在 markdown 文章中提取图片代码，并按列表显示。插件有一个 popup.html 和 popup.js，宽度尽量宽。
>
> 页面分左右两个 div，宽度一样，右边 div 高度总是大于等于左边 div。要求包裹盒子和两个 div 都有圆角和阴影。整个页面默认是深色背景。
>
> 左边是一个 CodeMirror 的编辑器，用于粘贴 markdown 代码。
>
> 左边 div 又分为上下两个 div，下面 div 就是编辑器，上面的 div 是一个工具栏，背景颜色也是默认深色但和编辑器背景色略有差别。
>
> 工具栏有一个太阳/月亮图标，点击可切换页面主题，支持 light 和 dark，即浅色和深色主题。还有一个下拉框，可选择编辑器的主题，默认使用 GitHub 主题。
>
> 页面主题和编辑器主题都需要存到 localStorage，所以相关数据需要使用 zustand。
>
> 右边是一个列表，显示匹配到的图片的代码，每个条目的图片代码单行显示，加粗，过长则显示省略号，鼠标悬浮显示完整代码文本。每个条目的右边都提供一个“复制”按钮，点击可复制图片代码。未匹配到图片代码，则右边 div 显示一个打开的箱子的大图标和文本“该文章没有图片”。
>
> 右边需要实时响应左边的编辑，使用 marked 的 renderer 遍历。若渲染过程中出错，需要让右边 div 边框变红，并在右下角显示 toast，提示用户出了什么错。toast 持续无限时间，并提供“X”按钮，X 使用 react-icon 的图标。toast 使用 sonner 包实现。
>
> 两个 div 的下面有一个页脚组件 Copyright.tsx，紧挨着上述两个 div。分两行，第一行是 Made with ❤ in {currentYear} by，第二行是一个链接，文本为 Hans，链接为 https://github.com/Hans774882968

效果不错，功能一次性就 OK，但有些样式需要调整。

> 1. 将文章内容也加入 localStorage。仍然用 zustand 实现，但务必使用另一个 store
>
> 2. 为右键唤出的菜单添加一个条目，文案是 Markdown Image Code Display (page)
>
> 3. 编辑器的主题，在页面为浅色主题时默认为 GitHub Light，在页面为深色背景时默认为 GitHub Dark。页面为浅色/深色主题时，编辑器只能选择浅色/深色主题。并扩展为支持选择以下主题：
>
>    ```html
>    <select
>      onchange="selectTheme()"
>      id="select"
>    >
>      <option selected="">default</option>
>      <option>3024-day</option>
>      <option>3024-night</option>
>      <option>abbott</option>
>      <option>abcdef</option>
>      <option>ambiance</option>
>      <option>ayu-dark</option>
>      <option>ayu-mirage</option>
>      <option>base16-dark</option>
>      <option>base16-light</option>
>      <option>bespin</option>
>      <option>blackboard</option>
>      <option>cobalt</option>
>      <option>colorforth</option>
>      <option>darcula</option>
>      <option>dracula</option>
>      <option>duotone-dark</option>
>      <option>duotone-light</option>
>      <option>eclipse</option>
>      <option>elegant</option>
>      <option>erlang-dark</option>
>      <option>gruvbox-dark</option>
>      <option>hopscotch</option>
>      <option>icecoder</option>
>      <option>idea</option>
>      <option>isotope</option>
>      <option>juejin</option>
>      <option>lesser-dark</option>
>      <option>liquibyte</option>
>      <option>lucario</option>
>      <option>material</option>
>      <option>material-darker</option>
>      <option>material-palenight</option>
>      <option>material-ocean</option>
>      <option>mbo</option>
>      <option>mdn-like</option>
>      <option>midnight</option>
>      <option>monokai</option>
>      <option>moxer</option>
>      <option>neat</option>
>      <option>neo</option>
>      <option>night</option>
>      <option>nord</option>
>      <option>oceanic-next</option>
>      <option>panda-syntax</option>
>      <option>paraiso-dark</option>
>      <option>paraiso-light</option>
>      <option>pastel-on-dark</option>
>      <option>railscasts</option>
>      <option>rubyblue</option>
>      <option>seti</option>
>      <option>shadowfox</option>
>      <option>solarized dark</option>
>      <option>solarized light</option>
>      <option>the-matrix</option>
>      <option>tomorrow-night-bright</option>
>      <option>tomorrow-night-eighties</option>
>      <option>ttcn</option>
>      <option>twilight</option>
>      <option>vibrant-ink</option>
>      <option>xq-dark</option>
>      <option>xq-light</option>
>      <option>yeti</option>
>      <option>yonce</option>
>      <option>zenburn</option>
>    </select>
>    ```
>
>    请务必自己归类这里哪些主题是浅色主题，哪些是深色主题。
>
> 4. 如附件图片所示，选择编辑器主题的下拉框的 Listbox.Options 的位置不对。它应该出现在 Listbox.Button 的正下方。

然后：

> 1.  鼠标悬浮在右边 div 的某个条目上时，那个条目的背景色应该有变化。
> 2.  进入页面时，应该解析一次文章，获取图像列表。现在是只有文本变化时才会解析文章。
> 3.  请帮我一次性安装所有在 App.tsx 里列出的编辑器主题`lightThemes`和`darkThemes`，并完成代码修改。

一开始 AI 生成的是这样的，少了十几个：

```typescript
const lightThemes = [
  { name: "GitHub Light", value: "github-light" },
  { name: "3024 Day", value: "3024-day" },
  { name: "Base16 Light", value: "base16-light" },
  { name: "Duotone Light", value: "duotone-light" },
  { name: "Eclipse", value: "eclipse" },
  { name: "Elegant", value: "elegant" },
  { name: "MDN Like", value: "mdn-like" },
  { name: "Neat", value: "neat" },
  { name: "Neo", value: "neo" },
  { name: "Paraiso Light", value: "paraiso-light" },
  { name: "Solarized Light", value: "solarized-light" },
  { name: "XQ Light", value: "xq-light" },
  { name: "Yeti", value: "yeti" },
];

const darkThemes = [
  { name: "GitHub Dark", value: "github-dark" },
  { name: "3024 Night", value: "3024-night" },
  { name: "Abbott", value: "abbott" },
  { name: "abcdef", value: "abcdef" },
  { name: "Ambiance", value: "ambiance" },
  { name: "Ayu Dark", value: "ayu-dark" },
  { name: "Ayu Mirage", value: "ayu-mirage" },
  { name: "Base16 Dark", value: "base16-dark" },
  { name: "Bespin", value: "bespin" },
  { name: "Blackboard", value: "blackboard" },
  { name: "Cobalt", value: "cobalt" },
  { name: "Darcula", value: "darcula" },
  { name: "Dracula", value: "dracula" },
  { name: "Duotone Dark", value: "duotone-dark" },
  { name: "Erlang Dark", value: "erlang-dark" },
  { name: "Gruvbox Dark", value: "gruvbox-dark" },
  { name: "Hopscotch", value: "hopscotch" },
  { name: "Material", value: "material" },
  { name: "Material Darker", value: "material-darker" },
  { name: "Material Palenight", value: "material-palenight" },
  { name: "Material Ocean", value: "material-ocean" },
  { name: "Midnight", value: "midnight" },
  { name: "Monokai", value: "monokai" },
  { name: "Night", value: "night" },
  { name: "Nord", value: "nord" },
  { name: "Oceanic Next", value: "oceanic-next" },
  { name: "Panda Syntax", value: "panda-syntax" },
  { name: "Paraiso Dark", value: "paraiso-dark" },
  { name: "Pastel on Dark", value: "pastel-on-dark" },
  { name: "Railscasts", value: "railscasts" },
  { name: "Seti", value: "seti" },
  { name: "Shadowfox", value: "shadowfox" },
  { name: "Solarized Dark", value: "solarized-dark" },
  { name: "The Matrix", value: "the-matrix" },
  { name: "Tomorrow Night Bright", value: "tomorrow-night-bright" },
  { name: "Tomorrow Night Eighties", value: "tomorrow-night-eighties" },
  { name: "Twilight", value: "twilight" },
  { name: "Vibrant Ink", value: "vibrant-ink" },
  { name: "XQ Dark", value: "xq-dark" },
  { name: "Zenburn", value: "zenburn" },
];
```

然后 AI 只搜到了一个叫`@uiw/codemirror-themes-all`的包，所以最后我就只配置了这个包提供的主题。

```typescript
import * as themes from "@uiw/codemirror-themes-all";

const lightThemes = [
  { name: "GitHub Light", value: "github-light", theme: githubLight },
  { name: "Basic Light", value: "basic-light", theme: themes.basicLight },
  { name: "Console Light", value: "console-light", theme: themes.consoleLight },
  { name: "Duotone Light", value: "duotone-light", theme: themes.duotoneLight },
  { name: "Eclipse", value: "eclipse", theme: themes.eclipse },
  {
    name: "Material Light",
    value: "material-light",
    theme: themes.materialLight,
  },
  { name: "Noctis Lilac", value: "noctis-lilac", theme: themes.noctisLilac },
  { name: "Quiet Light", value: "quietlight", theme: themes.quietlight },
  {
    name: "Solarized Light",
    value: "solarized-light",
    theme: themes.solarizedLight,
  },
  {
    name: "Tokyo Night Day",
    value: "tokyo-night-day",
    theme: themes.tokyoNightDay,
  },
  {
    name: "VS Code Light",
    value: "vscode-light",
    theme: themes.vscodeLightInit(),
  },
  { name: "White Light", value: "white-light", theme: themes.whiteLight },
  { name: "XCode Light", value: "xcode-light", theme: themes.xcodeLight },
];

const darkThemes = [
  { name: "GitHub Dark", value: "github-dark", theme: githubDark },
  { name: "abcdef", value: "abcdef", theme: themes.abcdef },
  { name: "Abyss", value: "abyss", theme: themes.abyss },
  {
    name: "Android Studio",
    value: "androidstudio",
    theme: themes.androidstudio,
  },
  { name: "Andromeda", value: "andromeda", theme: themes.andromeda },
  { name: "Aura", value: "aura", theme: themes.aura },
  { name: "Basic Dark", value: "basic-dark", theme: themes.basicDark },
  { name: "Bespin", value: "bespin", theme: themes.bespin },
  { name: "Console Dark", value: "console-dark", theme: themes.consoleDark },
  { name: "Copilot", value: "copilot", theme: themes.copilot },
  { name: "Darcula", value: "darcula", theme: themes.darcula },
  { name: "Dracula", value: "dracula", theme: themes.dracula },
  { name: "Duotone Dark", value: "duotone-dark", theme: themes.duotoneDark },
  { name: "Gruvbox Dark", value: "gruvbox-dark", theme: themes.gruvboxDark },
  { name: "Kimbie Dark", value: "kimbie-dark", theme: themes.kimbie },
  { name: "Material Dark", value: "material-dark", theme: themes.materialDark },
  { name: "Monokai", value: "monokai", theme: themes.monokai },
  {
    name: "Monokai Dimmed",
    value: "monokai-dimmed",
    theme: themes.monokaiDimmed,
  },
  { name: "Nord", value: "nord", theme: themes.nord },
  { name: "Okaidia", value: "okaidia", theme: themes.okaidia },
  { name: "Red", value: "red", theme: themes.red },
  {
    name: "Solarized Dark",
    value: "solarized-dark",
    theme: themes.solarizedDark,
  },
  { name: "Sublime", value: "sublime", theme: themes.sublime },
  { name: "Tokyo Night", value: "tokyo-night", theme: themes.tokyoNight },
  {
    name: "Tokyo Night Storm",
    value: "tokyo-night-storm",
    theme: themes.tokyoNightStorm,
  },
  {
    name: "Tomorrow Night Blue",
    value: "tomorrow-night-blue",
    theme: themes.tomorrowNightBlue,
  },
  {
    name: "VS Code Dark",
    value: "vscode-dark",
    theme: themes.vscodeDarkInit(),
  },
  { name: "White Dark", value: "white-dark", theme: themes.whiteDark },
  { name: "XCode Dark", value: "xcode-dark", theme: themes.xcodeDark },
];
```

然后：

> 1.  右边 div 也加一个工具栏，样式和左边 div 已有的工具栏一致。显示“共 {image.length} 张图片”，18px 加粗
> 2.  编辑器支持同时按下 ctrl 和 + 时放大字体
> 3.  左边 div 和右边 div 都需要设置宽度限制为 360px

然后：

> 1.  编辑器支持：当焦点在编辑器、按下 ctrl 键且鼠标滚动时放大/缩小字体。滚动方向需要考虑 windows 和 mac 系统
> 2.  在左边 div 的工具栏新增一个设置图标，cursor-pointer，点击后弹出一个对话框。对话框标题为“设置”，下面是一个类似于表单的展示组件，表单的每一行左边是标签，右边是值。目前表单只有 1 行，左边文案“编辑器字体大小”，右边是一个下拉框，可以选择 12px 到 24px。下拉框的当前值是 editorFontSize。下拉框选中元素后，应调用 setEditorFontSize
> 3.  希望页面样式更有科技感。可以：为背景添加玻璃效果；在鼠标悬浮时和离开元素时有过渡动画。请使用 Tailwind CSS4 实现
> 4.  editorTheme 拆分为两个变量，一个记录页面为浅色背景时选择的编辑器样式，另一个是页面为深色背景的情况

## 参考资料

无
