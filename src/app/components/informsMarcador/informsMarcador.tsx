"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { ContextEntregasClientes } from "../contexts/entregasClientesContext";
import { contextMapa } from "../mapa/meuMapa";
import estiloInform from "@/styles/telaInfMarcador/telaInfMarker.module.css";
import { entregasTipo } from "@/types/entregasTypes";
import leaflet from "leaflet";
import { RiUserLocationFill } from "react-icons/ri";
import { BiMessageCheck } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { atualizandoCoordEntrega } from "@/utils/funcRotas";
import { contextAutenticacao } from "../contexts/contextoUsuario";
import socket from "../socket/socketCliente";

export default function TelaMarcadorInform() {
  const { mapaPronto, marcadores } = useContext(contextMapa);
  const { entregasDia, atualizandoEntregas } = useContext(
    ContextEntregasClientes
  );
  const { usuarioLogado } = useContext(contextAutenticacao);
  const telaInformMR = useRef<HTMLDivElement>(null);
  const [entregaEvidencia, setEntregaEvidencia] = useState<entregasTipo>();
  const [marcadorEvidencia, setMarcadorEvidencia] = useState<leaflet.Marker>();

  marcadores?.map((minhaMark, indexMark) => {
    minhaMark.novoMarcador.addEventListener("click", () => {
      adicionandoTelaInform();
      if (entregasDia) {
        setEntregaEvidencia(minhaMark.entregaMarcador);
        setMarcadorEvidencia(minhaMark.novoMarcador);
      }
    });
  });

  let elementoMapa = document.querySelector("#meuMapaId");

  const enviarMinhaMSG = () => {
    console.log("Iniciando MENSAGEM");
    let meuDadoMsg = {
      numero: "aaaa",
      mensagem: `
Ola, ${entregaEvidencia?.entregador}.
Você tem uma entrega para:
*${entregaEvidencia?.nome}*

Bairro: ${entregaEvidencia?.bairro}

Rua: ${entregaEvidencia?.rua}

Número: ${entregaEvidencia?.numero}
      `,
    };
    console.log(meuDadoMsg);

    socket.emit("enviarMensagem", meuDadoMsg);
  };

  const removendoTelaInform = () => {
    if (telaInformMR.current) {
      telaInformMR.current.classList.add(estiloInform.telaInformMarcadorFora);
    }
  };

  const adicionandoTelaInform = () => {
    if (telaInformMR.current) {
      telaInformMR.current.classList.remove(
        estiloInform.telaInformMarcadorFora
      );
    }
  };

  elementoMapa?.addEventListener("click", (ev) => {
    if (ev.target === ev.currentTarget) {
      removendoTelaInform();
    }
  });

  const liberandoPontoMarcador = (btnClick: HTMLButtonElement) => {
    let elementoMarcadorFoto =
      marcadorEvidencia?.getElement()?.children[0].children[1];

    let elementoMarcadorTexto =
      marcadorEvidencia?.getElement()?.children[0].children[0];

    if (marcadorEvidencia?.dragging?.enabled()) {
      marcadorEvidencia.dragging.disable();

      const novaCoord = marcadorEvidencia.getLatLng();

      btnClick.classList.toggle(estiloInform.btnLocationAtivo);

      elementoMarcadorFoto?.classList.toggle(estiloInform.marcadorEstaAtivo);

      if (entregaEvidencia) {
        if (entregaEvidencia.id) {
          const updateEntregaCoords = {
            id: entregaEvidencia.id,
            novaCoordenada: {
              lat: novaCoord.lat as number,
              lng: novaCoord.lng as number,
            },
          };

          atualizandoCoordEntrega(updateEntregaCoords).then(() => {
            console.log("Coordenadas atualizadas com sucesso.");
            atualizandoEntregas();
          });
        }
      }

      elementoMarcadorTexto?.classList.toggle(
        estiloInform.nomeComMarcadorAtivo
      );
    } else {
      marcadorEvidencia?.dragging?.enable();

      btnClick.classList.toggle(estiloInform.btnLocationAtivo);

      elementoMarcadorFoto?.classList.toggle(estiloInform.marcadorEstaAtivo);

      elementoMarcadorTexto?.classList.toggle(
        estiloInform.nomeComMarcadorAtivo
      );
    }
  };

  useEffect(() => {}, [usuarioLogado]);

  return (
    <>
      <div
        className={`${estiloInform.telaInformMarcador} ${estiloInform.telaInformMarcadorFora}`}
        ref={telaInformMR}
      >
        <div className={estiloInform.areaBTNSinfMR}>
          <button
            onClick={(ev) => {
              liberandoPontoMarcador(ev.currentTarget);
            }}
          >
            <RiUserLocationFill />
          </button>

          <button
            onClick={() => {
              // enviarMensagemCliente();
              enviarMinhaMSG();
            }}
          >
            <BiMessageCheck />
          </button>

          <button
            onClick={() => {
              if (entregaEvidencia) {
                mapaPronto?.flyTo(
                  [
                    entregaEvidencia?.coordenadas.latitude,
                    entregaEvidencia?.coordenadas.longitude,
                  ],
                  17,
                  {
                    animate: true,
                    duration: 1,
                  }
                );
              }
            }}
          >
            <FaMapLocationDot />
          </button>
        </div>

        <div className={estiloInform.areaInformacoesMR}>
          <h3>Entrega para: {entregaEvidencia?.nome}</h3>
          <h3>Contato: {entregaEvidencia?.telefone}</h3>
          <h3>Bairro: {entregaEvidencia?.bairro}</h3>
          <h3>Rua: {entregaEvidencia?.rua}</h3>
          <h3>Número: {entregaEvidencia?.numero}</h3>
          <h3>Valor: {entregaEvidencia?.valor}</h3>
          <h3>Pagamento: {entregaEvidencia?.pagamento}</h3>
          <h3>Entregador: {entregaEvidencia?.entregador}</h3>
        </div>
      </div>
    </>
  );
}
