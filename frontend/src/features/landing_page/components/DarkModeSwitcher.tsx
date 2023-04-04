import SimpleButton from '@/components/Button/SimpleButton';

export const DarkModeSwitcher = () => {
  function toggleDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
      localStorage.setItem('darkMode', 'false');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('darkMode', 'true');
      document.documentElement.classList.add('dark');
    }
  }
  return (
    <div>
      <SimpleButton onClick={toggleDarkMode}>toggle dark mode</SimpleButton>
    </div>
  );
};
