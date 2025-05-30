import { useState, useEffect, useRef } from 'react';
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { FiSun, FiMoon, FiCopy, FiBox, FiX, FiSettings } from 'react-icons/fi';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { marked } from 'marked';
import { Toaster, toast } from 'sonner';
import { useThemeStore } from './store/themeStore';
import { useContentStore } from './store/contentStore';
import { Copyright } from './components/Copyright';
import { cn } from './lib/utils';
import { useEditorStore } from './store/editorStore';
import SettingsDialog from './components/SettingsDialog';
import { darkThemes, lightThemes } from './common/themeDropdownOptions';
import { ctrlPressed } from './common/getPlatform';

export default function App() {
  const { theme, lightEditorTheme, darkEditorTheme, setTheme, setLightEditorTheme, setDarkEditorTheme } = useThemeStore();
  const isDarkTheme = theme === 'dark';
  const { markdownText, setMarkdownText } = useContentStore();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { editorFontSize, setEditorFontSize } = useEditorStore();

  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    processMarkdown(markdownText);
    // onChange 时，processMarkdown 会自动调用，所以这里不需要重复调用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (ctrlPressed(e) && e.key === '+') {
        e.preventDefault();
        setEditorFontSize(Math.min(editorFontSize + 1, 24));
      } else if (ctrlPressed(e) && e.key === '-') {
        e.preventDefault();
        setEditorFontSize(Math.max(editorFontSize - 1, 12));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorFontSize, setEditorFontSize]);

  useEffect(() => {
    const editor = editorRef.current?.editor;
    const handleEditorWheel = (e: WheelEvent) => {
      if (!ctrlPressed(e)) {
        return;
      }
      e.preventDefault();
      // 类似于 VSCode 往上滚放大，往下滚缩小
      const delta = e.deltaY > 0 ? -1 : 1;
      setEditorFontSize((prev: number) => Math.min(Math.max(prev + delta, 12), 24));
    };

    editor?.addEventListener('wheel', handleEditorWheel, { passive: false });
    return () => editor?.removeEventListener('wheel', handleEditorWheel);
  }, [setEditorFontSize]);

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setTheme(newTheme);
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

      renderer.image = ({ href, title, text }) => {
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

  const currentThemes = isDarkTheme ? darkThemes : lightThemes;
  const currentEditorTheme = currentThemes.find(t =>
    t.value === (isDarkTheme ? darkEditorTheme : lightEditorTheme),
  )?.theme || (isDarkTheme ? githubDark : githubLight);

  return (
    <div className={cn(
      'min-h-screen text-base relative',
      isDarkTheme ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700',
    )}>
      <div className="container mx-auto p-4">
        <div className="flex gap-4 min-h-[600px] justify-center">
          <div className="flex-1 flex flex-col max-w-[370px]">
            <div className={cn(
              'p-4 rounded-t-lg',
              isDarkTheme ? 'bg-gray-800' : 'bg-white',
              'shadow-md',
            )}>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  title={isDarkTheme ? '切换为浅色背景' : '切换为深色背景'}
                  className={cn(
                    'p-2 rounded-lg cursor-pointer',
                    isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
                  )}
                >
                  {isDarkTheme ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
                <div className="relative">
                  <Listbox
                    value={isDarkTheme ? darkEditorTheme : lightEditorTheme}
                    onChange={isDarkTheme ? setDarkEditorTheme : setLightEditorTheme}
                  >
                    <ListboxButton className={cn(
                      'px-4 py-2 rounded-lg cursor-pointer',
                      isDarkTheme ? 'bg-gray-700' : 'bg-gray-200',
                    )}
                    >
                      {currentThemes.find(t => t.value === (isDarkTheme ? darkEditorTheme : lightEditorTheme))?.name}
                    </ListboxButton>
                    <ListboxOptions className={cn(
                      'absolute z-10 mt-1 w-48 rounded-lg shadow-lg max-h-60 overflow-auto',
                      isDarkTheme ? 'bg-gray-700' : 'bg-white',
                    )}
                    >
                      {
                        currentThemes.map((editorTheme) => (
                          <ListboxOption
                            key={editorTheme.value}
                            value={editorTheme.value}
                            className={({ focus }) =>
                              cn(
                                'px-4 py-2 cursor-pointer',
                                focus && 'bg-blue-500 text-white',
                              )
                            }
                          >
                            {editorTheme.name}
                          </ListboxOption>
                        ))
                      }
                    </ListboxOptions>
                  </Listbox>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  title="设置"
                  className={cn(
                    'p-2 rounded-lg cursor-pointer',
                    isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
                  )}
                >
                  <FiSettings className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <CodeMirror
                ref={editorRef}
                value={markdownText}
                height="100%"
                theme={currentEditorTheme}
                extensions={[markdown()]}
                onChange={(value) => {
                  setMarkdownText(value);
                  processMarkdown(value);
                }}
                className="h-full rounded-b-lg shadow-md overflow-hidden"
                style={{ fontSize: `${editorFontSize}px` }}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col max-w-[370px]">
            <div className={cn(
              'p-4 rounded-t-lg',
              isDarkTheme ? 'bg-gray-800' : 'bg-white',
            )}>
              <div className="flex items-center">
                <span className="text-lg font-bold">共 {images.length} 张图片</span>
              </div>
            </div>
            <div
              className={cn(
                'flex-1 rounded-b-lg shadow-md p-4',
                error ? 'border-2 border-red-500' : '',
                isDarkTheme ? 'bg-gray-800' : 'bg-white',
              )}
            >
              {images.length > 0 ? (
                <div className="space-y-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg transition-colors',
                        isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200',
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
                          isDarkTheme
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
        </div>
        <Copyright />
      </div>
      <Toaster theme={theme} position="bottom-right" />

      <SettingsDialog isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />
    </div>
  );
}
