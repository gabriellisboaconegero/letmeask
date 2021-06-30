import { useEffect, useState } from "react";

import { useParams, useHistory } from "react-router-dom";

import deleteImg from "../assets/images/delete.svg";
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import "../styles/modal.scss";

import Modal from "react-modal";

import { database } from "../services/firebase";
import { Logo } from "../components/Logo";
import { VotationCreator } from "../components/VotationCreator";

type RoomParams = {
  id: string;
}

export function AdmRoom() {
  // pega os parametros que foram passados na rota, nesse cado o id da sala
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title, user, authorId, votation } = useRoom(roomId);
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [questToDelete, setQuestToDelete] = useState('');
  const [votationModalOpen, setVotationModalOpen] = useState(false);

  // Verifica se quem entrou é o adm
  // se não coloca ele na sala normal 
  useEffect(() => {
    database.ref(`rooms/${roomId}`).get().then(res => {
      const data = res.val();
      if (!user){
        return
      }else if (user?.id !== data.authorId){
        history.push(`/rooms/${roomId}`);
      }
    });
  }, [user?.id, roomId]);

  async function handleDeleteQuestion(questId: string){
    await database.ref(`rooms/${roomId}/questions/${questId}`).remove();
    setModalOpen(false);
    setQuestToDelete('');
  }

  function handleSelectQuestion(questId: string){
    setQuestToDelete(questId);
    setModalOpen(true);
  }

  async function handleMarkAsAnswered(questId: string, isAnswered: boolean){
    await database.ref(`rooms/${roomId}/questions/${questId}/isAnswered`).set(!isAnswered);
  }

  async function handleHighlightQuestion(questId: string, isHighlighted: boolean){
    await database.ref(`rooms/${roomId}/questions/${questId}/isHighlighted`).set(!isHighlighted);
  }

  async function openCreateVotationModal(){
    setVotationModalOpen(true);
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
          <Logo />
          <div>
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

          <button onClick={openCreateVotationModal}>Criar votação</button>
          <Modal
            isOpen={votationModalOpen}
            onRequestClose={e => setVotationModalOpen(false)}
          >
            <VotationCreator 
              closeCreator={() => setVotationModalOpen(false)}
              roomId={roomId}
            />
          </Modal>
          {votation.content && 
            <div className="votation">
            <p>{votation.content}</p>
              {votation.options.map(vote => (
                  <p>{vote.content}<span>{vote.votes}</span></p>
              ))}
              <span>{votation.options.reduce((acc, cur) => cur.votes > acc.votes? cur: acc).content}</span>
            </div>
          }
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
                onClick={() => handleSelectQuestion(quest.id)}
              >
                <img src={deleteImg} alt="Deletar pergunta" />
              </button>
              
            </Question>
          ))}
        </div>
      </main>
      <Modal 
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <span>Tem certeza que quer excluir essa pergunta?</span>  
        <div className="adm-choice">
          <button onClick={() => setModalOpen(false)}>
            <svg className="no" viewBox="0 0 20 20">
              <path fill="#29292e" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
            </svg>
          </button>
          <button className="yes" onClick={() => handleDeleteQuestion(questToDelete)}>
            <svg className="yes" viewBox="0 0 20 20">
              <path fill="#29292e" d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"></path>
            </svg>
          </button>
        </div>    
      </Modal>
    </div>
  ): (
    <div className="loading">
      Loading...
    </div>
  );
}
