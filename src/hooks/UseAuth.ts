//para evitar ter que importar useContext e AuthContext e depois usar eles
//criamos nossa propria hook (só pode ser chamada dentro de um componente)

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => useContext(AuthContext);