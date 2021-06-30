import { FormEvent, useState } from "react";

//hook do sistema de rotas que permite setar qual vai ser a proxima rota
import { useHistory } from "react-router-dom";

//para usar imagens ou outro tipo de dado é preciso importa-lô
//pois não é possivel utilizando caminhos com strings ou colocando no html
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import "../styles/modal.scss";

import { Button } from "../components/Button";

import { useAuth } from "../hooks/UseAuth";

import { database } from "../services/firebase";
import Modal from "react-modal";
import {useTheme} from '../hooks/useTheme';


export function Home() {
  const history = useHistory();

  const [roomCode, setRoomCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSettings, setModalSettings] = useState('');
  const {theme} = useTheme();

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
      setModalOpen(true);
      setModalSettings('non_exists');
      return;
    }else if(await roomRef.val().endedAt){
      setModalOpen(true);
      setModalSettings('closed');
      setRoomCode('');
      return;
    }
    // Se quem entrar for o adm ele vai para a pagina de adm
    const isAdm = (await roomRef.val().authorId) === user?.id;
    history.push(`${isAdm? '/adimin/': ''}rooms/${roomCode}`);
  }

  // function handleSelectedTheme(e: ChangeEvent<HTMLSelectElement>){
  //   setTheme(e.target.value as Theme);
  // }

  return (
    <div id="page-auth">
      <aside>
        {/*     usar uma string na prop src não funcionaria */}
        <img src={illustrationImg} alt="Ilustração, perguntas e respostas" />
        <strong>Crie slas de Q&amp;A ao-vivo</strong>
        <p className={theme.name}>Tire dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          {/* <h1>{theme}</h1>
          <select name="theme" id="theme" onChange={handleSelectedTheme} defaultValue={theme}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="solarized">Solarized</option>
          </select> */}
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
      <Modal 
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        {modalSettings === 'closed'? (
          <span>Sala fechada pelo criador</span>
        ):(
          <span>Sala não encontrada</span>
        )}
        <button onClick={() => setModalOpen(false)}>
          <svg className="svg-icon" viewBox="0 0 20 20">
						<path fill="#29292e" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
					</svg>
        </button>
      </Modal>
    </div>
  );
}
