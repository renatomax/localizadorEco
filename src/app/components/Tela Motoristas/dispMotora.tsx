"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { contextAutenticacao } from "../contexts/contextoUsuario";
import { ContextEntregasClientes } from "../contexts/entregasClientesContext";
import estilo from "@/styles/sideBar.module.css";
import styMotora from "@/styles/telaMotoristas/telaMotorista.module.css";
import EntregasDisplayMotora from "./components/entregaComponents";
import AndamentoComponent from "./components/entregaAndamentoComp";
import sam from "@/styles/telaMotoristas/animandoTelaMotora.module.css";
import { AnimandoQuadrados } from "./components/quadradosAnimados";
import dynamic from "next/dynamic";

let inicializarQuads = true;

export default function TelaMotoristas() {
  const { usuarioLogado } = useContext(contextAutenticacao);
  const {
    entregasDia,
    atualizandoEntregas,
    entregasAndamento,
    entregasConcluidas,
  } = useContext(ContextEntregasClientes);
  const [travaInicializacao, setTravaInicializacao] = useState(false);
  const elementoDisplay = useRef<HTMLDivElement>(null);
  const elementoAndamento = useRef<HTMLDivElement>(null);

  const QuadradosMeus = dynamic(
    () =>
      import("./components/quadradosAnimados").then(
        (mod) => mod.AnimandoQuadrados
      ),
    { ssr: false }
  );

  const gerandoEntregas = () => {
    if (!travaInicializacao) {
      setTravaInicializacao(true);
      atualizandoEntregas();
    }
  };

  const animandoQuadrados = () => {
    if (inicializarQuads) {
      inicializarQuads = false;
      return;
    } else {
      const quadrados = [];
      for (let i = 0; i < 10; i++) {
        let tamanho = `${numAleatoreo(25, 80)}px`;
        quadrados.push(
          <div
            key={i}
            style={{
              left: `${numAleatoreo(0, 80)}%`,
              animationDelay: `${numAleatoreo(0, 10)}s`,
              width: tamanho,
              height: tamanho,
            }}
            className={sam.quadradoAnim}
          ></div>
        );
      }
      return quadrados;
    }
  };

  const [estadoEntregaDisponivel, setEstadoEntregaDisponivel] = useState(false);
  const [estadoEntregaAndamento, setEstadoEntregaAndamento] = useState(false);

  const verificandoEntregasMotoristas = () => {
    entregasDia?.forEach((entregaDisponivel) => {
      if (entregaDisponivel.entregador === usuarioLogado?.userName) {
        setEstadoEntregaDisponivel(true);
      }
    });

    entregasAndamento?.forEach((entregaAnda) => {
      if (entregaAnda.entregador === usuarioLogado?.userName) {
        setEstadoEntregaAndamento(true);
      }
    });
  };

  useEffect(() => {
    if (estadoEntregaDisponivel) {
      elementoDisplay.current?.classList.add(styMotora.entregaDesteEntregador);
    }

    if (estadoEntregaAndamento) {
      elementoAndamento.current?.classList.add(
        styMotora.entregaDesteEntregador
      );
    }
  }, [estadoEntregaDisponivel, estadoEntregaAndamento]);

  useEffect(() => {
    gerandoEntregas();
    verificandoEntregasMotoristas();
  }, [entregasDia, entregasAndamento]);

  return (
    <>
      {usuarioLogado?.userName !== "Administradores" && (
        // RENDERIZADO TELA GERAL DO USUARIO
        <div className={styMotora.telaFullMotora}>
          <div className={sam.telaMotoraAnimada}>
            <div className={`${sam.circuloCor} ${sam.circulo1}`}></div>
            <div className={`${sam.circuloCor} ${sam.circulo2}`}></div>
            <div className={`${sam.circuloCor} ${sam.circulo3}`}></div>
            <div className={`${sam.circuloCor} ${sam.circulo4}`}></div>
            <div className={`${sam.circuloCor} ${sam.circulo5}`}></div>
            <div className={`${sam.circuloCor} ${sam.circulo6}`}></div>
            <div className={`${sam.circuloCor} ${sam.circulo7}`}></div>
            <div className={`${sam.circuloCor} ${sam.circulo8}`}></div>

            <QuadradosMeus></QuadradosMeus>
          </div>

          {/* <div className={`w-[100vw] h-[100vh] overflow-hidden absolute`}>
            
          </div> */}

          <div className={styMotora.areaSaudacaoMotra}>
            <h3 className={styMotora.bomDiaMotora}>
              Olá {usuarioLogado?.userName}!
            </h3>
            <div
              className={`${styMotora.fotoUsuarioMotora} ${
                usuarioLogado?.userName == "Marcos" &&
                styMotora.fotoMarcosMotora
              } ${
                usuarioLogado?.userName == "Uene" && styMotora.fotoUeneMotora
              } ${
                usuarioLogado?.userName == "Leo" && styMotora.fotoLeoMotora
              } ${
                usuarioLogado?.userName == "João" && styMotora.fotoJoaoMotora
              }`}
            ></div>
            <h3>Acesse suas entregas do dia:</h3>
          </div>

          {/* // Primeiramente é criado o pequeno display de entregas */}
          <div
            className={`${styMotora.displayMotoraEntregas} ${styMotora.dispMotora}`}
            ref={elementoDisplay}
          >
            <h1
              className={estilo.titulosDisplay}
              onClick={(ev) => {
                let el = ev.currentTarget;
                ev.currentTarget.parentElement?.classList.toggle(
                  styMotora.displayMotoraEntregasAberto
                );
              }}
            >
              Entregas Disponiveis:
              <span className={estilo.quantidadeTitulo}>
                {entregasDia ? entregasDia.length : "0"}
              </span>
            </h1>

            <div className={styMotora.areaInformsDispMotora}>
              {/* Aqui entre a parte que renderiza entrega em andamento, uma a uma */}
              {elementoDisplay && (
                <EntregasDisplayMotora
                  telaEntregaDisp={elementoDisplay}
                ></EntregasDisplayMotora>
              )}
            </div>
          </div>

          {/* // Agora é criado o pequen display de entregas em andamento */}
          <div>
            <div
              className={`${styMotora.displayMotoraEntregas} ${styMotora.andMotora}`}
              ref={elementoAndamento}
            >
              <h1
                className={estilo.titulosDisplay}
                onClick={(ev) => {
                  ev.currentTarget.parentElement?.classList.toggle(
                    styMotora.displayMotoraEntregasAberto
                  );
                }}
              >
                Entregas em Andamento:
                <span className={estilo.quantidadeTitulo}>
                  {entregasAndamento ? entregasAndamento.length : "0"}
                </span>
              </h1>

              <div className={styMotora.areaInformsDispMotora}>
                <AndamentoComponent
                  elementoAndamneto={elementoAndamento}
                ></AndamentoComponent>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function numAleatoreo(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
