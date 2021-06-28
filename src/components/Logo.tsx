import logoImg from '../assets/images/logo.svg'
import exitImg from '../assets/images/home.svg';

import { useHistory } from 'react-router';

export function Logo(){
  const history = useHistory();

  function goHome(){
    history.push('/');
  }
  return (
    <button onClick={goHome} className="logo">
      <img src={logoImg} alt="Letmeask" />
      <img src={exitImg} alt="Exit" />
    </button>
  );
}