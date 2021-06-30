import { useDebugValue, useEffect, useState } from "react";
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
    isHighlighted: boolean;
    likes: Record<string, {
      authorId: string;
    }> | null;
  }
>;

type DatabaseRoom = {
  authorId: string;
  questions: FirebaseQuestions;
  title: string;
  endedAt: string;
  votation: {
    content: string;
    isClosed: boolean;
    options: Record<string, {
      content: string;
      votes: Record<string, string>
    }>
  };
};

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  context: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: number;
  likeId: string | undefined;
};

type VotationType ={
  content: string;
  isClosed: boolean;
  totalVotes: number;
  alreadyVoted: boolean;
  options: {
    id: string;
    content: string;
    votes: number;
  }[];
}

export function useRoom(roomId: string) {
  const { user, signInWithGoogle } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [closed, setClosed] = useState("");
  const [votation, setVotation] = useState<VotationType>({} as VotationType);

  useEffect(() => {
    // pega a ref da sala para poder adicionar e modificar
    const roomRef = database.ref(`rooms/${roomId}`);

    // event listner que chama a fução toda vez que ocorre uma mudança no database
    roomRef.on("value", (room) => {
      //  o .val() retorna apenas o conteudo do database
      // diferente do .get() que pega outras coisas tambem
      const databaseRoom: DatabaseRoom = room.val();
      const firebaseQuestions = databaseRoom.questions ?? {};
      const firebaseVotation = databaseRoom.votation ?? {};


      const alreadyVoted = Object.values(firebaseVotation.options ?? {}).some(value => {
        return Object.values(value.votes ?? {}).includes(user?.id as string, 0);
      }) 

      const parsedOptions = Object.entries(firebaseVotation.options ?? {}).map(([id, value]) => {
        return {
          id, 
          content: value.content,
          votes: Object.entries(value.votes ?? {}).length
        }
      });

      let totalVotes = 0;
      const listOfVotesInOptions = Object.values(firebaseVotation.options ?? {}).forEach(value => {
        totalVotes += Object.values(value.votes ?? {}).length;
      })

      const parsedVotation: VotationType = {
        content: firebaseVotation.content,
        isClosed: firebaseVotation.isClosed,
        totalVotes,
        alreadyVoted,
        options: parsedOptions
      }

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
            isHighlighted: value.isHighlighted,
            likes: Object.keys(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(([key, like]) => {
              return like.authorId === user?.id;
            })?.[0]
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      setClosed(databaseRoom.endedAt);
      setAuthorId(databaseRoom.authorId);
      setVotation(parsedVotation);
    });

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return {
    questions,
    title,
    user,
    signInWithGoogle,
    authorId,
    closed,
    votation
  };
}
