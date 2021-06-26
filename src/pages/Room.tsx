import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";


import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function Room() {
  // pega os parametros que foram passados na rota, nesse cado o id da sala
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const { questions, title, user, signInWithGoogle } = useRoom(roomId);

  async function handleCreateNewQuestion(e: FormEvent) {
    e.preventDefault();

    //  Se n tiver pergunta ou nã estiver cadastrado n cria oergunta
    if (newQuestion.trim() === "") {
      return;
    }
    if (!user) {
      throw new Error("Please log in to ask");
    }

    const question = {
      context: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlghted: false,
      isAnswered: false,
      likes: 0
    };

    // envia a pergunta para se adicionada à haba de perguntas da sala
    await database.ref(`/rooms/${roomId}/questions`).push(question);
    setNewQuestion("");
  }

  async function signInFromRoom() {
    await signInWithGoogle();
  }

  async function handlelikes(questId: string){
    const questRef = database.ref(`/rooms/${roomId}/questions/${questId}`);

    const a = await questRef.get();
    console.log(a.val());
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode roomCode={roomId}></RoomCode>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {/* se não tiver pergunta não mostra quantas perguntas tem */}
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder="oque voce quer perguntar"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />

          <div className="form-footer">
            {/* se n tiver user não mostra as user-info e mostra o login */}
            {!user ? (
              <span>
                par enviar pergunta,{" "}
                <button onClick={signInFromRoom}>faça seu login</button>
              </span>
            ) : (
              <div className="user-info">
                <img src={user.avatar} alt="Avatar image" />
                <span>{user.name}</span>
              </div>
            )}
            <Button disabled={!user} type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((quest) => (
            <Question 
              key={quest.id}
              content={quest.context}
              author={quest.author}
            >
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
