// componente que me leva para a rota que eu colocar nos props
import { Link, useHistory } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import "../styles/auth.scss";

import { Button } from "../components/Button";

import { useAuth } from "../hooks/UseAuth";

export function NewRoom() {

  const { signOut } = useAuth();

  const history = useHistory();

  function signOutAndReturnToHome(){
    signOut()
    history.push('/');
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração, perguntas e respostas" />
        <strong>Crie slas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="exit">
          <button onClick={signOutAndReturnToHome}>sair</button>
        </div>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <form>
            <h2>Crie uma nova sala</h2>
            <input type="text" placeholder="Nome da sala" />
            <Button type="submit">Criar sala</Button>
          </form>         
          <p>
            Quer entrar um uma sala já existente?
            <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
