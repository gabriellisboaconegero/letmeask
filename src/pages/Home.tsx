import { FormEvent, useState } from "react";

//hook do sistema de rotas que permite setar qual vai ser a proxima rota
import { useHistory } from "react-router-dom";

//para usar imagens ou outro tipo de dado é preciso importa-lô
//pois não é possivel utilizando caminhos com strings ou colocando no html
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";

import "../styles/auth.scss";

import { Button } from "../components/Button";

import { useAuth } from "../hooks/UseAuth";

import { database } from "../services/firebase";

export function Home() {
  const history = useHistory();

  const [roomCode, setRoomCode] = useState("");

  //exemplo de como funciona o useAuth, ele retorna os dados que podemos acessar do contexto
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    //atualiza a rota
    history.push("/rooms/new");
  }

  // verifica se a sala existe antes de entrar nela
  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === ''){
      return
    }
    
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()){
      alert('sala não existe');
      return;
    }else if(await roomRef.val().endedAt){
      alert("Sala fechada");
      setRoomCode('');
      return;
    }
    const isAdm = (await roomRef.val().authorId) === user?.id;
    history.push(`${isAdm? '/adimin/': ''}rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        {/*     usar uma string na prop src não funcionaria */}
        <img src={illustrationImg} alt="Ilustração, perguntas e respostas" />
        <strong>Crie slas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIcon} alt="Google icon" />
            Crie sua sala com Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"  
              placeholder="Digite o código de sala"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
