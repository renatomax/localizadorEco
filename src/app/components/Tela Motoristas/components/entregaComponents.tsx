"use client";
import { entregasTipo } from "@/types/entregasTypes";
import { ContextEntregasClientes } from "../../contexts/entregasClientesContext";
import { RefObject, useContext, useEffect, useState } from "react";
import estilo from "@/styles/sideBar.module.css";
import styMotora from "@/styles/telaMotoristas/telaMotorista.module.css";
import { TbTruckDelivery } from "react-icons/tb";
import { contextAutenticacao } from "../../contexts/contextoUsuario";
import { atualizandoEntregaRot, informarUpEntregas } from "@/utils/funcRotas";
import { GiStorkDelivery } from "react-icons/gi";
import socket from "../../socket/socketCliente";

export default function EntregasDisplayMotora({
  telaEntregaDisp,
}: {
  telaEntregaDisp: RefObject<HTMLDivElement>;
}) {
  const { entregasDia, atualizandoEntregas } = useContext(
    ContextEntregasClientes
  );
  const [entregasUsuario, setEntregasUsuario] = useState<entregasTipo[]>([]);

  const { usuarioLogado } = useContext(contextAutenticacao);

  const msgEntregaCaminho = (entregaEvidencia: entregasTipo) => {
    console.log("Iniciando MENSAGEM");
    let meuDadoMsg = {
      numero: "aaaa",
      mensagem: `
Ola.
Temos uma entrega para:
*${entregaEvidencia?.nome}*

Sou o motorista da sua entrega: ${entregaEvidencia.entregador}.
Estou iniciando sua rota de entrega.
Peço a gentileza de me receber assim que possível.
Equipe Eco Clean agradece a preferência.
      `,
    };
    console.log(meuDadoMsg);

    socket.emit("enviarMensagem", meuDadoMsg);
  };

  const iniciandoEntrega = async (entrega: entregasTipo) => {
    let novaEntrega = entrega;
    novaEntrega.status = "Entregando";
    usuarioLogado
      ? (novaEntrega.entregador = usuarioLogado.userName)
      : (novaEntrega.entregador = entrega.entregador);
    atualizandoEntregaRot(novaEntrega).then(() => {
      msgEntregaCaminho(entrega);
      atualizandoEntregas();
      informarUpEntregas();
    });
  };

  const entregaAndEntregador = () => {
    if (entregasUsuario) {
      entregasUsuario.map((entrega) => {
        console.log("Acessando verifes");
        if (entrega.id) {
          let elEntrega = document.getElementById(
            "disponiv" + entrega.id.toString()
          );
          elEntrega?.classList.add(styMotora.entregaDesteEntregador);
          elEntrega?.parentElement?.parentElement?.classList.add(
            styMotora.entregaDesteEntregador
          );
          console.log(elEntrega);
        }
      });
    } else if (!entregasUsuario) {
      telaEntregaDisp.current?.classList.remove(
        styMotora.entregaDesteEntregador
      );
    }
  };

  useEffect(() => {
    if (usuarioLogado) {
      const entregasFiltradas = entregasDia?.filter(
        (entrega) => entrega.entregador === usuarioLogado.userName
      );
      if (entregasFiltradas) {
        setEntregasUsuario(entregasFiltradas);
      }
    }
  }, [entregasDia, usuarioLogado]);

  useEffect(() => {
    entregaAndEntregador();
  }, [entregasUsuario, usuarioLogado]);

  return (
    <>
      {entregasDia?.map((entrega) => {
        let idElement = `disponiv${entrega.id}`;
        if (entrega.status === "Disponível" && usuarioLogado)
          return (
            <div
              className={`${styMotora.caixaEntregaMotora} `} /**$ {estilo.caixaAberta} */
              key={entrega.nome + entrega.id}
              id={idElement}
            >
              <div
                className={estilo.tituloCaixa}
                onClick={(ev) => {
                  console.log("Peguei o click no titulo da entrega");
                  let boxInfoEntrega = ev.currentTarget.parentElement;
                  boxInfoEntrega?.classList.toggle(styMotora.caixaAbertaMotora);
                }}
              >
                <h3>{entrega.nome}</h3>
              </div>

              {usuarioLogado?.userName == entrega.entregador && (
                <span className={`${styMotora.entregaMotoristaLogado}`}>
                  <GiStorkDelivery />
                </span>
              )}

              <div className={estilo.informCaixa}>
                <p>Bairro: {entrega.bairro}</p>
                <p>Rua: {entrega.rua}</p>
                <p>Número: {entrega.numero}</p>
                <p>Valor: R$ {entrega.valor}</p>
                <p>Entregador: {entrega.entregador}</p>
                <p>Volume: {entrega.volume}</p>
                <p>Pagamento: {entrega.pagamento}</p>
              </div>

              <div className={styMotora.botoesCaixaMotora}>
                {/**Interação de enviar mensagem para o cliente */}
                <button
                  onClick={(ev) => {
                    ev.currentTarget.textContent = "Gerando entrega...";
                    iniciandoEntrega(entrega).finally(() => {
                      telaEntregaDisp.current?.classList.remove(
                        styMotora.displayMotoraEntregasAberto
                      );
                    });
                  }}
                >
                  <TbTruckDelivery className={styMotora.iconeInitEntrega} />
                  <span>Iniciar Entrega</span>
                </button>
              </div>
            </div>
          );
      })}
    </>
  );
}
