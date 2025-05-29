import { cn } from '../lib/utils';
import { useThemeStore } from '../store/themeStore';
import { FaGithub } from 'react-icons/fa';

export const Copyright = () => {
  const theme = useThemeStore((state) => state.theme);
  const currentYear = new Date().getFullYear();

  return (
    <div className={cn(
      'text-center py-8 rounded-lg mt-4 flex flex-col items-center gap-4 text-xl',
      theme === 'dark' ? 'bg-gray-800' : 'text-gray-600 bg-white',
    )}>
      <p>Made with ❤ in {currentYear} by</p>
      <p className="flex items-center justify-center gap-2">
        <FaGithub size={20} />
        <a
          href="https://github.com/Hans774882968"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-950',
          )}
        >
          Hans
        </a>
      </p>
    </div>
  );
};
