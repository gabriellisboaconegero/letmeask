import { useEffect } from "react";
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
    Primary: string | undefined;
    Background: string | undefined;
    "Gray-Medium": string | undefined;
    black: string | undefined;
    Background2: string | undefined;
    Details: string | undefined;
    "Gray-Dark": string | undefined;
    "Pink-Dark": string | undefined;
  }
  logo: string;
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

  useEffect(() => {
    Object.entries(theme.colors).forEach(([varToChange, value]) => {
      if (!value){
        document.documentElement.style.removeProperty('--'+varToChange);
        return;
      }
      document.documentElement.style.setProperty("--"+varToChange, value);
    });
  }, [theme, themes]);

  function changeTheme(newTheme: string){
    if (themes[newTheme]){
      setTheme(themes[newTheme]);
    }  
  }

  return (
    <ThemeContext.Provider value={{theme, setTheme:changeTheme}}>
      <div>
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
}