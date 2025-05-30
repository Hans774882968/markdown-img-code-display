import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Fieldset,
  Field,
  Label,
  Select,
  DialogBackdrop,
} from '@headlessui/react';
import { cn } from '../lib/utils';
import { useEditorStore } from '../store/editorStore';
import { useThemeStore } from '../store/themeStore';
import { IoClose } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';

interface SettingsDialogProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isSettingsOpen: boolean) => void;
}

export default function SettingsDialog({ isSettingsOpen, setIsSettingsOpen }: SettingsDialogProps) {
  const { editorFontSize, setEditorFontSize } = useEditorStore();
  const { theme } = useThemeStore();
  const isDarkTheme = theme === 'dark';

  const fontSizeOptions = Array.from({ length: 13 }, (_, i) => 12 + i);

  return (
    <Dialog
      open={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop transition className="fixed inset-0 bg-black/30 duration-200 ease-out data-closed:opacity-0" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel transition className={cn(
          'w-full max-w-2xl rounded-2xl p-6 shadow-xl',
          'duration-200 ease-out data-closed:scale-0 data-closed:opacity-0',
          isDarkTheme ? 'bg-gray-800/90' : 'bg-white/90',
          'relative',
        )}>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className={cn(
              'absolute right-4 top-4 p-1 rounded-lg transition-colors cursor-pointer',
              isDarkTheme
                ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
            )}
          >
            <IoClose className="w-5 h-5" />
          </button>

          <DialogTitle className={cn(
            'text-lg font-bold mb-6',
            isDarkTheme ? 'text-gray-100' : 'text-gray-900',
          )}>
            设置
          </DialogTitle>

          <div className="space-y-6">
            <Fieldset>
              <Field>
                <Label className={cn(
                  'text-sm/6 font-semibold',
                  isDarkTheme ? 'text-gray-200' : 'text-gray-700',
                )}>
                  编辑器字体大小
                </Label>
                <div className="relative mt-2">
                  <Select
                    value={editorFontSize}
                    onChange={(e) => setEditorFontSize(Number(e.target.value))}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg appearance-none text-base',
                      'transition-colors duration-200',
                      'focus:outline-none focus:ring-2',
                      isDarkTheme
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-blue-500'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-blue-600',
                    )}
                  >
                    {fontSizeOptions.map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </Select>
                  <FiChevronDown
                    className={cn(
                      'group pointer-events-none absolute top-1/2 -translate-y-1/2 right-2.5 size-4',
                      isDarkTheme ? 'text-gray-200' : 'text-gray-900',
                    )}
                    aria-hidden="true"
                  />
                </div>
              </Field>
            </Fieldset>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
