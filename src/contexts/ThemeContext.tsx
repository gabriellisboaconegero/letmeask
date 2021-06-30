import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {createContext, ReactNode } from "react";
import { usePermState } from "../hooks/usePermState";
import Dark from "../styles/themes/dark";
import Light from "../styles/themes/light";
import Solarized from "../styles/themes/solarized";


type ThemeProviderProps = {
  children: ReactNode;
}

type Theme = {
  name: string;
  colors:{
    Primary: string;
    Background: string;
    "Gray-Medium": string;
    black: string;
    Background2: string;
    Details: string;
    "Gray-Dark": string;
    "Pink-Dark": string;
  }
}

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme:string) => void
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeProviderProps){
  
  const [themes, setThemes] = useState(
    {
      [Dark.name]: Dark,
      [Light.name]: Light,
      [Solarized.name]: Solarized
    }
  );

  const [theme, setTheme] = usePermState('letmeask_theme', Light as Theme);

  const themeProviderDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Object.entries(theme.colors).forEach(([varToChange, value]) => {
      themeProviderDivRef.current?.style.setProperty("--"+varToChange, value)
    });
  }, [theme, themes]);

  function changeTheme(newTheme: string){
    if (themes[newTheme]){
      setTheme(themes[newTheme]);
    }  
  }

  return (
    <ThemeContext.Provider value={{theme, setTheme:changeTheme}}>
      <div ref={themeProviderDivRef}>
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
}