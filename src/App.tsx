import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

//Componente que regula e tem todas as funções do contexto de autentificação
import { AuthContextProvider } from "./contexts/AuthContext";

import { Room } from "./pages/Room";

function App() {

  return (
		// context provider
    <AuthContextProvider>
			{/* router */}
      <BrowserRouter>
      {/* evita que duas rotas sejam chamadas ao mesmo tempo */}
        <Switch>
          {/*a rota que tem o exact só vai ser acessada apenas 
          se o path exataemnte igual ao que nós escolhermos*/}
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" exact component={NewRoom} />
          <Route path='/rooms/:id' component={Room}></Route>
        </Switch>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
