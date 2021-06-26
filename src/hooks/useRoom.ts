import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./UseAuth";

// o record quer dizer um objeto
// esse objeto vai ter uma key em formato de string e um valor do colocado
type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    context: string;
    isAnswered: boolean;
    isHighlghted: boolean;
    likes: number;
  }
>;

type DatabaseRoom = {
  authorId: string;
  questions: FirebaseQuestions;
  title: string;
};

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  context: string;
  isAnswered: boolean;
  isHighlghted: boolean;
  likes: number;
};

export function useRoom(roomId: string) {
  const { user, signInWithGoogle } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // pega a ref da sala para poder adicionar e modificar
    const roomRef = database.ref(`rooms/${roomId}`);

    // event listner que chama a fução toda vez que ocorre uma mudança no database
    roomRef.on("value", (room) => {
      //  o .val() retorna apenas o conteudo do database
      // diferente do .get() que pega outras coisas tambem
      const databaseRoom: DatabaseRoom = room.val();
      const firebaseQuestions = databaseRoom.questions ?? {};

      //  como o valor é retornado como objeto com os ids como keys dos objetos
      // ele não vem em um lista, então precisamos mudar isso
      // pega os dois valores, e coloca em uma lista assim Array<[key, value]>
      // e depois usa map para tornar uma lista só com id
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([id, value]) => {
          return {
            id,
            context: value.context,
            author: value.author,
            isAnswered: value.isAnswered,
            isHighlghted: value.isHighlghted,
            likes: value.likes
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  return {
    questions,
    title,
    user,
    signInWithGoogle
  };
}
