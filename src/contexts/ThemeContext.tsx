import { useEffect, createContext, ReactNode, useState } from "react";

export type Theme = 'light' | 'dark'| 'solarized';
type ThemeProviderProps = {
  children: ReactNode;
}
type ThemeContextType = {
  theme: Theme,
  setTheme: (theme:Theme) => void
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

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <div className={theme}>
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
}