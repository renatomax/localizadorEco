"use client";

import React, {
  createContext,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import estilo from "@/styles/telaAutenticacao.module.css";
import styAnim from "@/styles/animando/animaLogin.module.css";
import { usuarioTipo } from "@/types/userTypes";
import AnimandoFundoLoginUsers from "../fundo Animado/fundoAnimado";
import { RiAdminLine } from "react-icons/ri";
import socket from "../socket/socketCliente";

/**Incializando conexão com webSocket */

interface AuntenticInterface {
  usuarioLogado: usuarioTipo | undefined;
  marcosUser: usuarioTipo;
  ueneUser: usuarioTipo;
  leoUser: usuarioTipo;
  joaoUser: usuarioTipo;
}

let usuarioLogado: usuarioTipo = {
  userName: "",
  senha: "",
  status: "",
  localizacao: {
    latitude: 0,
    longitude: 0,
  },
};

/**Criando contexto de autenticação */
export const contextAutenticacao = createContext<AuntenticInterface>({} as any);

export function ProvedorAutenticacao({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const telaAutenticacao = useRef<HTMLDivElement>(null);
  const areaAnimandoUserRef = useRef<HTMLDivElement>(null);

  const [dadosForm, setDadosForm] = useState({
    usuario: "Administradores",
    senha: "",
  });

  const [admUser, setAdmUser] = useState<usuarioTipo>({
    userName: "Administradores",
    status: "Carregando",
    senha: "ecoadm",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [marcosUser, setMarcosUser] = useState<usuarioTipo>({
    userName: "Marcos",
    status: "Carregando",
    senha: "ecomarcos",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [ueneUser, setUeneUser] = useState<usuarioTipo>({
    userName: "Uene",
    status: "Carregando",
    senha: "ecouene",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [leoUser, setLeoUser] = useState<usuarioTipo>({
    userName: "Leo",
    status: "Carregando",
    senha: "ecoleo",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [joaoUser, setJoaoUser] = useState<usuarioTipo>({
    userName: "Joao",
    status: "Carregando",
    senha: "ecojoao",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });

  const localizandoUsuario = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("atualizarLocalizacao", {
        lat: latitude,
        lon: longitude,
        usuarioLogin: usuarioLogado,
      });
      console.log("Recebido a primeira localização do usuário.");
      console.log(
        "O usuário logado é:" + usuarioLogado.userName
          ? usuarioLogado.userName
          : ""
      );
      console.log(
        "As coordenadas do usuário estão em: " +
          usuarioLogado?.localizacao.latitude +
          " " +
          usuarioLogado?.localizacao.longitude
      );
    });
  };

  const atualizandoFormulario = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDadosForm({
      ...dadosForm,
      [event.target.name]: event.target.value,
    });
  };

  const autenticandoFormulario = (ev: FormEvent) => {
    ev.preventDefault();
    console.log("Autenticando usuario: " + dadosForm);

    socket.emit("autenticando-Usuario", dadosForm);
  };

  const atualizandoTodosUsuarios = () => {
    socket.emit("solicitar-usuarios");
  };

  const flutuandoCirculos = () => {
    if (areaAnimandoUserRef.current) {
      const elementos = Array.from(areaAnimandoUserRef.current.children);
      elementos.forEach((elemento) => {
        let meuElememento = elemento as HTMLElement;
        let tamanhoElemento = numAleatoreo(30, 80);
        meuElememento.style.width = `${tamanhoElemento}px`;
        meuElememento.style.height = `${tamanhoElemento}px`;
        meuElememento.style.top = `${numAleatoreo(10, 80)}%`;
        meuElememento.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;
        meuElememento.style.animationDelay = `${numAleatoreo(1, 5)}s`;
        meuElememento.style.animationDuration = `${numAleatoreo(10, 15)}s`;
        meuElememento.style.zIndex = `${numAleatoreo(1, 5)}`;
      });
    }
  };

  useEffect(() => {
    console.log("Effect flutuando circulos - confirmado");
    flutuandoCirculos();
  }, []);

  useEffect(() => {
    socket.on("novoUser-autenticado", (autenticateUser) => {
      console.log("Acionando a escuta do usuario autenticado");
      console.log(autenticateUser);
      usuarioLogado = autenticateUser;

      if (usuarioLogado.userName != "") {
        localizandoUsuario().then(() => {
          atualizandoTodosUsuarios();
        });
      }

      if (telaAutenticacao.current) {
        telaAutenticacao.current.classList.add(estilo.telaAutenticFora);
      }

      if (autenticateUser.userName === "Marcos") {
        setMarcosUser(autenticateUser);
      } else if (autenticateUser.userName === "Uene") {
        setUeneUser(autenticateUser);
      } else if (autenticateUser.userName === "Leo") {
        setLeoUser(autenticateUser);
      } else if (autenticateUser.userName === "João") {
        setJoaoUser(autenticateUser);
      } else if (autenticateUser.userName === "Administradores") {
        setAdmUser(autenticateUser);
      }
    });

    socket.on("todos-usuarios", (todosUsuarios) => {
      console.log("Todos os usuários foram atualizados com sucesso!");
      console.log(todosUsuarios);
      todosUsuarios.map((usuario: usuarioTipo) => {
        if (usuario.userName === "Marcos") {
          setMarcosUser(usuario);
        } else if (usuario.userName === "Uene") {
          setUeneUser(usuario);
        } else if (usuario.userName === "Leo") {
          setLeoUser(usuario);
        } else if (usuario.userName === "João") {
          setJoaoUser(usuario);
        } else if (usuario.userName === "Administradores") {
          setAdmUser(usuario);
        }
      });
    });

    return () => {
      socket.off("novoUser-autenticado");
      socket.off("todos-usuarios");
    };
  }, []);

  return (
    <contextAutenticacao.Provider
      value={{ usuarioLogado, marcosUser, ueneUser, leoUser, joaoUser }}
    >
      <>
        <div
          className={`${estilo.telaAutenticacao} ${estilo.telaAutenticForaaaaa}`}
          ref={telaAutenticacao}
        >
          <AnimandoFundoLoginUsers></AnimandoFundoLoginUsers>
          <div className={estilo.areaLogin}>
            <div className={`${estilo.areaComFotoUsuarioSelect}`}>
              <div
                className={`${estilo.fluxoElementos}`}
                ref={areaAnimandoUserRef}
              >
                <span className={`${estilo.elementosFlutuados}`}></span>
                <span className={`${estilo.elementosFlutuados}`}></span>
                <span className={`${estilo.elementosFlutuados}`}></span>
                <span className={`${estilo.elementosFlutuados}`}></span>
                <span className={`${estilo.elementosFlutuados}`}></span>
                <span className={`${estilo.elementosFlutuados}`}></span>
              </div>
              <div className={`${estilo.fotoUsuarioParaLogin}`}>
                {dadosForm?.usuario == "Marcos" && (
                  <>
                    <div className={estilo.fotoMarcosUsuarioLogin}></div>
                  </>
                )}
                {dadosForm?.usuario == "Uene" && (
                  <>
                    <div className={estilo.fotoUeneUsuarioLogin}></div>
                  </>
                )}

                {dadosForm?.usuario == "Leo" && (
                  <>
                    <div className={estilo.fotoLeoUsuarioLogin}></div>
                  </>
                )}

                {dadosForm?.usuario == "João" && (
                  <>
                    <div className={estilo.fotoJoaoUsuarioLogin}></div>
                  </>
                )}

                {dadosForm?.usuario == "Administradores" && (
                  <div className={estilo.fotoAdmnistradoresLogin}>
                    <RiAdminLine />
                  </div>
                )}
              </div>
            </div>

            <form
              className={estilo.formAutent}
              onSubmit={autenticandoFormulario}
            >
              <select name="usuario" onChange={atualizandoFormulario}>
                <option value="Administradores">Administradores</option>
                <option value="Marcos">Marcos</option>
                <option value="Uene">Uene</option>
                <option value="Leo">Leo</option>
                <option value="João">João</option>
                <option value="Dev">Dev</option>
              </select>

              <input
                type="text"
                name="senha"
                placeholder="Sua senha"
                onChange={atualizandoFormulario}
              />

              <button type="submit">LOGIN</button>
            </form>
          </div>
        </div>
        {children}
      </>
    </contextAutenticacao.Provider>
  );
}

function numAleatoreo(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
