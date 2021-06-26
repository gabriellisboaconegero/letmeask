import { useParams, useHistory } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";


import "../styles/room.scss";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

export function AdmRoom() {
  // pega os parametros que foram passados na rota, nesse cado o id da sala
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title, user } = useRoom(roomId);
  const history = useHistory();

  async function handleDeleteQuestion(questId: string){
    if (window.confirm("Tem certeza que deseja excluir essa pergunta")){
      const questRef = database.ref(`rooms/${roomId}/questions/${questId}`)

      await questRef.remove();
    }
  }

  async function handleCloseRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });
    history.push('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div className="">
            <RoomCode roomCode={roomId}></RoomCode>
            <Button 
              isOutlined
              onClick={handleCloseRoom}
            >Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {/* se não tiver pergunta não mostra quantas perguntas tem */}
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((quest) => (
            <Question 
              key={quest.id}
              content={quest.context}
              author={quest.author}
            >
              <button
                type="button"
                onClick={e => handleDeleteQuestion(quest.id)}
              >
                <img src={deleteImg} alt="Delete question" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
