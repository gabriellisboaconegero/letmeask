import { BrowserRouter, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

//Componente que regula e tem todas as funções do contexto de autentificação
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {

  return (
		// context provider
    <AuthContextProvider>
			{/* router provider */}
      <BrowserRouter>
        <Route path="/" exact component={Home} />
        <Route path="/roons/new" component={NewRoom} />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
