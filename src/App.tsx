import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { FiSun, FiMoon, FiCopy, FiBox, FiX } from 'react-icons/fi';
import { Listbox } from '@headlessui/react';
import { marked } from 'marked';
import { Toaster, toast } from 'sonner';
import { useThemeStore } from './store/themeStore';
import { useContentStore } from './store/contentStore';
import { Copyright } from './components/Copyright';
import { cn } from './lib/utils';
import * as themes from '@uiw/codemirror-themes-all';

const lightThemes = [
  { name: 'GitHub Light', value: 'github-light', theme: githubLight },
  { name: 'Basic Light', value: 'basic-light', theme: themes.basicLight },
  { name: 'Console Light', value: 'console-light', theme: themes.consoleLight },
  { name: 'Duotone Light', value: 'duotone-light', theme: themes.duotoneLight },
  { name: 'Eclipse', value: 'eclipse', theme: themes.eclipse },
  { name: 'Material Light', value: 'material-light', theme: themes.materialLight },
  { name: 'Noctis Lilac', value: 'noctis-lilac', theme: themes.noctisLilac },
  { name: 'Quiet Light', value: 'quietlight', theme: themes.quietlight },
  { name: 'Solarized Light', value: 'solarized-light', theme: themes.solarizedLight },
  { name: 'Tokyo Night Day', value: 'tokyo-night-day', theme: themes.tokyoNightDay },
  { name: 'VS Code Light', value: 'vscode-light', theme: themes.vscodeLightInit() },
  { name: 'White Light', value: 'white-light', theme: themes.whiteLight },
  { name: 'XCode Light', value: 'xcode-light', theme: themes.xcodeLight },
];

const darkThemes = [
  { name: 'GitHub Dark', value: 'github-dark', theme: githubDark },
  { name: 'abcdef', value: 'abcdef', theme: themes.abcdef },
  { name: 'Abyss', value: 'abyss', theme: themes.abyss },
  { name: 'Android Studio', value: 'androidstudio', theme: themes.androidstudio },
  { name: 'Andromeda', value: 'andromeda', theme: themes.andromeda },
  { name: 'Aura', value: 'aura', theme: themes.aura },
  { name: 'Basic Dark', value: 'basic-dark', theme: themes.basicDark },
  { name: 'Bespin', value: 'bespin', theme: themes.bespin },
  { name: 'Console Dark', value: 'console-dark', theme: themes.consoleDark },
  { name: 'Copilot', value: 'copilot', theme: themes.copilot },
  { name: 'Darcula', value: 'darcula', theme: themes.darcula },
  { name: 'Dracula', value: 'dracula', theme: themes.dracula },
  { name: 'Duotone Dark', value: 'duotone-dark', theme: themes.duotoneDark },
  { name: 'Gruvbox Dark', value: 'gruvbox-dark', theme: themes.gruvboxDark },
  { name: 'Kimbie Dark', value: 'kimbie-dark', theme: themes.kimbie },
  { name: 'Material Dark', value: 'material-dark', theme: themes.materialDark },
  { name: 'Monokai', value: 'monokai', theme: themes.monokai },
  { name: 'Monokai Dimmed', value: 'monokai-dimmed', theme: themes.monokaiDimmed },
  { name: 'Nord', value: 'nord', theme: themes.nord },
  { name: 'Okaidia', value: 'okaidia', theme: themes.okaidia },
  { name: 'Red', value: 'red', theme: themes.red },
  { name: 'Solarized Dark', value: 'solarized-dark', theme: themes.solarizedDark },
  { name: 'Sublime', value: 'sublime', theme: themes.sublime },
  { name: 'Tokyo Night', value: 'tokyo-night', theme: themes.tokyoNight },
  { name: 'Tokyo Night Storm', value: 'tokyo-night-storm', theme: themes.tokyoNightStorm },
  { name: 'Tomorrow Night Blue', value: 'tomorrow-night-blue', theme: themes.tomorrowNightBlue },
  { name: 'VS Code Dark', value: 'vscode-dark', theme: themes.vscodeDarkInit() },
  { name: 'White Dark', value: 'white-dark', theme: themes.whiteDark },
  { name: 'XCode Dark', value: 'xcode-dark', theme: themes.xcodeDark },
];

export default function App() {
  const { theme, editorTheme, setTheme, setEditorTheme } = useThemeStore();
  const { markdownText, setMarkdownText } = useContentStore();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processMarkdown(markdownText);
    // onChange 时，processMarkdown 会自动调用，所以这里不需要重复调用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // 切换主题时，自动切换到对应的默认编辑器主题
    setEditorTheme(newTheme === 'dark' ? 'github-dark' : 'github-light');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('已复制到剪贴板');
    });
  };

  const processMarkdown = (text: string) => {
    try {
      setError(null);
      const images: string[] = [];
      const renderer = new marked.Renderer();

      renderer.image = (href, title, text) => {
        const imgCode = `![${text || ''}](${href}${title ? ` "${title}"` : ''})`;
        images.push(imgCode);
        return imgCode;
      };

      marked(text, { renderer });
      setImages(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析出错');
      toast.error('Markdown解析出错', {
        duration: Infinity,
        action: {
          label: <FiX className="w-4 h-4" />,
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const currentThemes = theme === 'dark' ? darkThemes : lightThemes;
  const currentEditorTheme = currentThemes.find(t => t.value === editorTheme)?.theme || (theme === 'dark' ? githubDark : githubLight);

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700',
    )}>
      <div className="container mx-auto p-4">
        <div className="flex gap-4 min-h-[600px]">
          <div className="flex-1 flex flex-col">
            <div className={cn(
              'p-4 rounded-t-lg',
              theme === 'dark' ? 'bg-gray-800' : 'bg-white',
              'shadow-md',
            )}>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  title={theme === 'dark' ? '切换为浅色背景' : '切换为深色背景'}
                  className={cn(
                    'p-2 rounded-lg',
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
                  )}
                >
                  {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
                <div className="relative">
                  <Listbox value={editorTheme} onChange={setEditorTheme}>
                    <Listbox.Button className={cn(
                      'px-4 py-2 rounded-lg',
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
                    )}
                    >
                      {currentThemes.find(t => t.value === editorTheme)?.name}
                    </Listbox.Button>
                    <Listbox.Options className={cn(
                      'absolute z-10 mt-1 w-48 rounded-lg shadow-lg max-h-60 overflow-auto',
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white',
                    )}
                    >
                      {
                        currentThemes.map((editorTheme) => (
                          <Listbox.Option
                            key={editorTheme.value}
                            value={editorTheme.value}
                            className={({ active }) =>
                              cn(
                                'px-4 py-2 cursor-pointer',
                                active && 'bg-blue-500 text-white',
                              )
                            }
                          >
                            {editorTheme.name}
                          </Listbox.Option>
                        ))
                      }
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <CodeMirror
                value={markdownText}
                height="100%"
                theme={currentEditorTheme}
                extensions={[markdown()]}
                onChange={(value) => {
                  setMarkdownText(value);
                  processMarkdown(value);
                }}
                className="h-full rounded-b-lg shadow-md overflow-hidden"
              />
            </div>
          </div>
          <div
            className={cn(
              'flex-1 rounded-lg shadow-md p-4',
              error ? 'border-2 border-red-500' : '',
              theme === 'dark' ? 'bg-gray-800' : 'bg-white',
            )}
          >
            {images.length > 0 ? (
              <div className="space-y-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-colors',
                      theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200',
                    )}
                  >
                    <div className="font-bold truncate flex-1" title={img}>
                      {img}
                    </div>
                    <button
                      onClick={() => handleCopy(img)}
                      title="复制"
                      className={cn(
                        'ml-4 p-2 rounded-lg cursor-copy',
                        theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-200',
                      )}
                    >
                      <FiCopy className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={cn(
                'h-full flex flex-col items-center justify-center',
              )}>
                <FiBox className="w-16 h-16 mb-4" />
                <p>该文章没有图片</p>
              </div>
            )}
          </div>
        </div>
        <Copyright />
      </div>
      <Toaster theme={theme} position="bottom-right" />
    </div>
  );
}
