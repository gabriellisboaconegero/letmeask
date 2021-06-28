import { useState } from 'react';
import './styles.scss';
import menuImg from '../../assets/images/menu.svg';
import { useAuth } from '../../hooks/UseAuth';

import cx from "classnames";
import { useHistory } from 'react-router-dom';

export function Menu(){
  const [open, setOpen] = useState(false);
  const {signOut, user, signInWithGoogle} = useAuth();
  const history = useHistory();
  

  async function logOutAndExit(){
    history.push('/');
    setOpen(false);
    signOut();   
  }

  async function signFromMenu(){
    await signInWithGoogle();
  }

  return (
    <menu>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" stroke="#29292e" fill="#29292e"/></svg>
              <span>Desfazer login</span>
            </div>
            <div className="menu-opt">
              thema
            </div>
            <div className="menu-opt">
              alguma coisa
            </div>
          </main>
        </div>
      ): (
        <div className={cx(
          'no-user',
          {active: open}
        )}>
          <button onClick={signFromMenu}>Faça seu login</button>
        </div>
      )}    
    </menu>
  );
}