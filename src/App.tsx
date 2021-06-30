import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";

//Componente que regula e tem todas as funções do contexto de autentificação
import { AuthContextProvider } from "./contexts/AuthContext";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { AdmRoom } from "./pages/AdmRom";
import { Menu } from "./components/Menu";

import "./styles/global.scss";

function App() {
  return (

    <ThemeContextProvider>
      {/* context provider */}
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
            <Route path='/adimin/rooms/:id' component={AdmRoom}></Route>
          </Switch>
          <Menu />
        </BrowserRouter>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
