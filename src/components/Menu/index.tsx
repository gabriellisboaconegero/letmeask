import { ChangeEvent, useState } from 'react';
import './styles.scss';
import menuImg from '../../assets/images/menu.svg';
import { useAuth } from '../../hooks/UseAuth';

import cx from "classnames";
import { useHistory } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useEffect } from 'react';
import Dark from '../../styles/themes/dark';

export function Menu(){
  const [open, setOpen] = useState(false);
  const {signOut, user, signInWithGoogle} = useAuth();
  const history = useHistory();
  const {theme, setTheme} = useTheme();

  function clickOutOfMenuEventHandler(e: MouseEvent){
    const path = e.composedPath();
    const menu = document.querySelector('menu#main-menu');
    const menuInPath = path.some((target) => {
      return menu === target;
    });
    
    if (!menuInPath){
      setOpen(false);
    }
  }

  function handleExitByKey(e: KeyboardEvent){
    if (e.code === 'Escape'){
      setOpen(false);
    }
  }

  useEffect(() => {
    if (open){
      document.documentElement.addEventListener("mousedown", clickOutOfMenuEventHandler);
      document.documentElement.addEventListener("keydown", handleExitByKey);

    }

    return () => {
      document.documentElement.removeEventListener("mousedown", clickOutOfMenuEventHandler);
      document.documentElement.removeEventListener("keydown", handleExitByKey);

    }
  }, [open]);
  

  async function logOutAndExit(){
    history.push('/');
    setOpen(false);
    signOut();   
  }

  async function signFromMenu(){
    await signInWithGoogle();
  }

  function handleSelectedTheme(e: ChangeEvent<HTMLSelectElement>){
    setTheme(e.target.value);
  }

  return (
    <menu id="main-menu" className={theme.name}>
      <button onClick={() => setOpen(!open)}>
        <img src={menuImg} alt="Menu" width="32px"/>
      </button> 
      {user? (
        <div className={cx(
          'menu',
          {active: open}
        )}>
          <header>
            <img src={user?.avatar} alt={user?.name} />
            <div>
              <span>{user?.name}</span>
              <span>{user?.email}</span>
            </div>
          </header>
          <main>
            <div 
              className="menu-opt exit"
              onClick={logOutAndExit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
              </svg>
              <span>Desfazer login</span>
            </div>
            <div 
              className="menu-opt theme"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-sliders" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" strokeWidth="1.5"/>
              </svg>
              <select value={theme.name} name="theme" id="theme" onChange={handleSelectedTheme}>
                <option value="light">light</option>
                <option value="dark">dark</option>
                <option value="solarized">solarized</option>
              </select>
            </div>
            <div className="menu-opt">            
            <span>{theme.name}</span>
            </div>
          </main>
        </div>
      ): (
        <div className={cx(
          'no-user',
          {active: open}
        )}>
          <button onClick={signFromMenu}>Fa??a seu login</button>
        </div>
      )}    
    </menu>
  );
}