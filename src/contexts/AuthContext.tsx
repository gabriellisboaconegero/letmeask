// para que nós possamos acessar os dados de autentificação em todo o aplicativo
// usamos contextos, eles podem ser acessados dentro de quelauer componente que
// esteja dentro do escopo do componente <Context.Provider />

import { createContext, ReactNode, useEffect, useState } from "react";

import { auth, firebase } from "../services/firebase";
// importamos pois vamos usar para fazer as autentificações

// o tipo user é o que vai ser passado para o stado user
type User = {
  id: string;
  name: string;
  avatar: string;
};

// o tipo AuthCntextType são quais os valores que o contexto vai receber, ou seja
// quais os tipos de dados que os componentes pode adquirir desse contexto
type AuthContextType = {
  	user: User | undefined;
  	signInWithGoogle: () => Promise<void>;
};

// como colocamos em um arquivo diferente para ficar melhor de refatorar, monitorar 
// e alterar o código, o nosso <Context.Provider /> vai agora ser um componente
// que vai prover o contexto, e como os outros componentes serão colocados dentro 
// desse componente precisamos saber o tipo da props.children (nesse caso vão ser
// os componentes, ou seja ReactNodes)
type AuthContextProviderProps = {
  children?: ReactNode; 
}

//precisa criar um contexto para usa-ló, depois é exportar ele e acessar de outro componente
// importando-o e depois usando o hook useContext() para acessar os dados do contexto
export const AuthContext = createContext({} as AuthContextType);

//Esse é o componente que vai envolver todos os outros que poderão acessar os dados
// do contexto criado logo acima
export function AuthContextProvider(props: AuthContextProviderProps){

  // são as variaveris de controle do usuario
  const [user, setUser] = useState<User>();

  // quando o componente é montado vai ser colocado on eventListner para saber se 
  // já tinha alguem logado
  useEffect(() => {
    //                  esse eventListner verifica se o usuario ja
    //                  tinha se cadastrado alguma
    //                  outra vez no app
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    // como é um eventListner, é boa pratica limpar o eventListner ao desmontar o componente
    // pois toda vez que elee for montado e o eventListner não for retirado vai ser adicionado
    // outro po cima, então podendo causar problemas
    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const res = await auth.signInWithPopup(provider);

    if (res.user) {
      const { displayName, photoURL, uid } = res.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }
  return (
    // componente do contexto, veja o que é passado no contexto
    // o user, e a função para logIn, pois eles serão necessarios em 
    // outros componentes da aplicação
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>

  );
}