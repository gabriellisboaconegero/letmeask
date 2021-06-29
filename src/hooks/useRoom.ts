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
      votes: Record<string, {
        authorId: string;
      }>
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
  voteId: string | undefined;
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


      let voteId: string | undefined;
      const userVoteIdInOptions = Object.entries(firebaseVotation.options ?? {}).map(([key, value]) => {
        return Object.entries(value.votes ?? {}).find(([key, value]) => {
          return value.authorId === user?.id;
        })?.[0]
      })
      if (userVoteIdInOptions.length !== 0){
        voteId = userVoteIdInOptions.reduce((acc, cur) => {
          if (cur){
            return cur;
          }
          return acc;
        });
      }else{
        voteId = undefined;
      }

      const parsedOptions = Object.entries(firebaseVotation.options ?? {}).map(([id, value]) => {
        return {
          id, 
          content: value.content,
          votes: Object.entries(value.votes ?? {}).length
        }
      });

      const listOfVotesInOptions = Object.entries(firebaseVotation.options ?? {}).map(([key, value]) => {
        return Object.entries(value.votes ?? {}).length;
      })
      let totalVotes: number;
      if (listOfVotesInOptions.length !== 0){
        totalVotes = listOfVotesInOptions.reduce((acc, cur) => acc + cur);
      }else{
        totalVotes = 0;
      }


      const parsedVotation: VotationType = {
        content: firebaseVotation.content,
        isClosed: firebaseVotation.isClosed,
        totalVotes,
        voteId,
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
              return like.authorId === user?.id
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
