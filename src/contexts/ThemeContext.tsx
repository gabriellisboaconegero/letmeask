import { useEffect } from "react";
import { useState } from "react";
import { createContext, ReactNode } from "react";

type Theme = 'light' | 'dark'| 'solarized';
type ThemeProviderProps = {
  children: ReactNode;
}
type ThemeContextType = {
  theme: Theme,
  toggleTheme: () => void
}

function setDocumentVariableTheme(theme: Theme){
  document.documentElement.setAttribute('data-theme', theme);
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeProviderProps){

  const [theme, setTheme] = useState<Theme>(() => {
    const storageTheme = (window.localStorage.getItem('letmeask_theme') ?? 'light') as Theme;
    return storageTheme;
  });

  useEffect(() => {
    window.localStorage.setItem('letmeask_theme', theme);
    setDocumentVariableTheme(theme);
  }, [theme]);

  function toggleTheme(){
    setTheme(prev => prev === 'light'? 'dark': "light");  
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div className={theme}>
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
}