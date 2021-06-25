import { FormEvent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import { useAuth } from "../hooks/UseAuth";

import { database } from "../services/firebase";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

// o record quer dizer um objeto
// esse objeto vai ter uma key em formato de string e um valor do colocado
type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  context: string,
  isAnswered: boolean,
  isHighlghted: boolean
}>;

type Question = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  context: string,
  isAnswered: boolean,
  isHighlghted: boolean,
}

type DatabaseRoom = {
  authorId: string,
  questions: FirebaseQuestions,
  title: string
}

export function Room() {

  // pega os parametros que foram passados na rota, nesse cado o id da sala
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    // pega a ref da sala para poder adicionar e modificar
    const roomRef = database.ref(`rooms/${roomId}`);

    // event listner que chama a fução toda vez que ocorre uma mudança no database
    roomRef.on("value", (room) => {
      //  o .val() retorna apenas o conteudo do database
      // diferente do .get() que pega outras coisas tambem
      const databaseRoom: DatabaseRoom = room.val();
      const firebaseQuestions = databaseRoom.questions;

      //  como o valor é retornado como objeto com os ids como keys dos objetos
      // ele não vem em um lista, então precisamos mudar isso
      // pega os dois valores, e coloca em uma lista assim Array<[key, value]>
      // e depois usa map para tornar uma lista só com id
      const parsedQuestions = Object.entries(firebaseQuestions).map(([id, value]) => {
        return {
          id,
          context: value.context,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlghted: value.isHighlghted
        }
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

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
    };

    // envia a pergunta para se adicionada à haba de perguntas da sala
    await database.ref(`/rooms/${roomId}/questions`).push(question);
    setNewQuestion("");
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
          {questions.length > 0 && (
            <span>{questions.length} pergunta(s)</span>
          )}
          
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
                par enviar pergunta, <button>faça seu login</button>
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
        {questions.map(quest => (
          <div>
            <p>{quest.context}</p>
            <p>{quest.author.name}</p>
            <br />
          </div>
        ))}
      </main>
    </div>
  );
}
