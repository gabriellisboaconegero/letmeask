import { useState } from "react";
import { createContext, ReactNode } from "react";

type Theme = 'light' | 'dark';
type ThemeProviderProps = {
  children: ReactNode;
}
type ThemeContextType = {
  theme: Theme,
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeProviderProps){

  const [theme, setTheme] = useState<Theme>('light');

  function toggleTheme(){
    setTheme(prev => {
      const newTheme = prev === 'light'? 'dark': "light";
      document.documentElement.setAttribute('data-theme', newTheme);
      return newTheme;
    });
    
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div className={theme}>
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
}