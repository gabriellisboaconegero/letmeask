import { FormEvent, useState } from "react";

// componente que me leva para a rota que eu colocar nos props
import { Link, useHistory } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import "../styles/auth.scss";

import { Button } from "../components/Button";

import { useAuth } from "../hooks/UseAuth";

import { database } from "../services/firebase";

export function NewRoom() {

  //#region signOut
  const { signOut, user } = useAuth();
  const history = useHistory();

  function signOutAndReturnToHome(){
    signOut()
    history.push('/');
  }
  //#endregion

  //#region create new room
  const [newRoomName, setNewRoomName] = useState('');

  async function handleCreateRoom(e: FormEvent){
    e.preventDefault()

    if (newRoomName.trim() === ''){
      return
    }

    // pega uma referencia da data base com o path usado
    const roomRef = database.ref('rooms');

    // adiciona uma room com o metodo push, ou seja vai adicionar um valor 
    //  ao inves de "settar" o valor
    // para mudar o valor do ref usa o .set(valor: any)
    const firebaseRoom = await roomRef.push({
      title: newRoomName,
      authorId: user?.id,
    });

    // key é o id que o firebase usa para indentificar cada dado
    history.push(`/adimin/rooms/${firebaseRoom.key}`);
  }
  //#endregion

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
          <form onSubmit={handleCreateRoom}>
            <h2>Crie uma nova sala</h2>
            <input 
              type="text" 
              placeholder="Nome da sala"
              value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
            />
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
