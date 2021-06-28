import { useEffect } from "react";

import { useParams, useHistory } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

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
  const { questions, title, user, authorId } = useRoom(roomId);
  const history = useHistory();

  // Verifica se quem entrou é o adm
  // se não coloca ele na sala normal 
  useEffect(() => {

    database.ref(`rooms/${roomId}`).get().then(res => {
      const data = res.val();
      if (user?.id !== data.authorId){
        history.push(`/rooms/${roomId}`);
      }
    });
  }, [user?.id, roomId]);

  async function handleDeleteQuestion(questId: string){
    if (window.confirm("Tem certeza que deseja excluir essa pergunta")){
      const questRef = database.ref(`rooms/${roomId}/questions/${questId}`)

      await questRef.remove();
    }
  }

  async function handleMarkAsAnswered(questId: string, isAnswered: boolean){
    await database.ref(`rooms/${roomId}/questions/${questId}/isAnswered`).set(!isAnswered);
  }

  async function handleHighlightQuestion(questId: string, isHighlighted: boolean){
    await database.ref(`rooms/${roomId}/questions/${questId}/isHighlighted`).set(!isHighlighted);
  }

  async function handleCloseRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });
    history.push('/');
  };

  return authorId ? (
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
          <h1>{title}</h1>
          {/* se não tiver pergunta não mostra quantas perguntas tem */}
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((quest) => (
            <Question 
              key={quest.id}
              content={quest.context}
              author={quest.author}
              isAnswered={quest.isAnswered}
              isHighlighted={quest.isHighlighted}
            >
              <button
                type="button"
                onClick={e => handleMarkAsAnswered(quest.id, quest.isAnswered)}
              >
                <img src={checkImg} alt="Marcar pergunta como respondida" />
              </button>
              {!quest.isAnswered && 
                <button
                  type="button"
                  onClick={e => handleHighlightQuestion(quest.id, quest.isHighlighted)}
                >
                  <img src={answerImg} alt="Dara destaque à pergunta" />
                </button>
              }
              <button
                type="button"
                onClick={e => handleDeleteQuestion(quest.id)}
              >
                <img src={deleteImg} alt="Deletar pergunta" />
              </button>
              
            </Question>
          ))}
        </div>
      </main>
    </div>
  ): (
    <div className="loading">
      Loading...
    </div>
  );
}
