import { ChangeEvent, useEffect } from "react";
import { useState, FormEvent } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import "../styles/room.scss";
import {useTheme} from '../hooks/useTheme';

type RoomParams = {
  id: string;
};

export function Room() {
  // pega os parametros que foram passados na rota, nesse cado o id da sala
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState("");
  const [votationSelected, setVotationSelected] = useState('');
  const {theme} = useTheme();
  const { 
    questions, 
    title, 
    user, 
    signInWithGoogle,
    votation
  } = useRoom(roomId);
  const history = useHistory();

  // Ao entrar na pagina ou logar de dentro dela, vai verificar se o usuario é 
  // O criador e colocar ele na sala de adm
  useEffect(() => {

    database.ref(`rooms/${roomId}`).get().then(res => {
      const data = res.val();
      if (user?.id === data.authorId){
        history.push(`/adimin/rooms/${roomId}`);
      }else if(data.endedAt){
        history.push('/');
      }
    });
  }, [roomId, user?.id]); //

  async function handleCreateNewQuestion(e: FormEvent) {
    e.preventDefault();

    //  Se n tiver pergunta ou nã estiver cadastrado n cria oergunta
    if (newQuestion.trim() === "" || !user) {
      return;
    }

    const question = {
      context: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    // envia a pergunta para se adicionada à haba de perguntas da sala
    await database.ref(`/rooms/${roomId}/questions`).push(question);
    setNewQuestion("");
  }

  async function signInFromRoom() {
    await signInWithGoogle();
  }

  async function handlelikes(questId: string, likeId: string | undefined) {
    if (!user) return;

    if (likeId){
      const questRef = database.ref(`/rooms/${roomId}/questions/${questId}/likes/${likeId}`);

      await questRef.remove();
    }else{
      const questRef = database.ref(`/rooms/${roomId}/questions/${questId}/likes`);

      await questRef.push({
        authorId: user?.id,
      });
    }
  }

  async function handleVote(){
    if (!user || votationSelected === '' || votation.alreadyVoted){
      console.log(user, votationSelected, votation.alreadyVoted);
      return;
    }

    await database.ref(`rooms/${roomId}/votation/options/${votationSelected}/votes`).push(user.id);
  }

  function handleSelectOption(e: ChangeEvent<HTMLInputElement>){
    setVotationSelected(e.target.value);
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Logo />
          <RoomCode roomCode={roomId}></RoomCode>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {/* se não tiver pergunta não mostra quantas perguntas tem */}
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder="oque voce quer perguntar"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className={theme.name}
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
                <img src={user.avatar} alt="Avatar" />
                <span>{user.name}</span>
              </div>
            )}
            <Button disabled={!user} type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {(user && votation.content) && (
            <div className="votation">
              <div className="vote-options">
                <p>{votation.content}</p>
                {votation.options.map(vote => (
                  <>
                  <input
                    onChange={handleSelectOption}
                    type="radio"
                    name={votation.content}
                    id={vote.id}
                    value={vote.id}
                    disabled={votation.isClosed}
                  />
                  <label htmlFor={vote.id} key={vote.id}>
                    <p>{vote.content} <span>{vote.votes}</span> </p>
                  </label>
                  </>
                ))}
              </div>
              <div className="vote-settings">
                {votation.totalVotes !== 0 && (
                  <>
                  <strong>{((votation.options.reduce((acc, cur) => cur.votes > acc.votes? cur: acc).votes / votation.totalVotes) * 100).toFixed(0) + '%'}</strong>
                    <span>{votation.options.reduce((acc, cur) => cur.votes > acc.votes? cur: acc).content}</span>
                  </>
                )}
                <Button onClick={handleVote}>Enviar</Button>
              </div>
            </div>
          )}
          {questions.map((quest) => (
            <Question
              key={quest.id}
              content={quest.context}
              author={quest.author}
              isAnswered={quest.isAnswered}
              isHighlighted={quest.isHighlighted}
            >
              {!quest.isAnswered && 
                <button
                  onClick={e => handlelikes(quest.id, quest.likeId)}
                  className={`like-button ${quest.likeId ? 'liked': ''}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  disabled={!user}
                >
                  {quest.likes > 0 && (<span>{quest.likes}</span>)}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              }
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
