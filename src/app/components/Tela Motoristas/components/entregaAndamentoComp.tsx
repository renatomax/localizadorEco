"use client";
import { entregasTipo } from "@/types/entregasTypes";
import { ContextEntregasClientes } from "../../contexts/entregasClientesContext";
import { RefObject, useContext, useEffect, useState } from "react";
import estilo from "@/styles/sideBar.module.css";
import styMotora from "@/styles/telaMotoristas/telaMotorista.module.css";
import { TbTruckDelivery } from "react-icons/tb";
import { contextAutenticacao } from "../../contexts/contextoUsuario";
import { GiConfirmed } from "react-icons/gi";
import { atualizandoEntregaRot, informarUpEntregas } from "@/utils/funcRotas";
import socket from "../../socket/socketCliente";

export default function AndamentoComponent({
  elementoAndamneto,
}: {
  elementoAndamneto: RefObject<HTMLDivElement>;
}) {
  const { entregasDia, entregasAndamento, atualizandoEntregas } = useContext(
    ContextEntregasClientes
  );

  const { usuarioLogado } = useContext(contextAutenticacao);
  const [entregasUsuario, setEntregasUsuario] = useState<entregasTipo[]>([]);

  const enviarMensagemCliente = async (entrega: entregasTipo) => {
    if (entrega.telefone) {
      socket.emit("enviarMensagem", {
        numero: entrega.telefone,
        mensagem: `
Olá, sou o entregador da Eco Clean, *${entrega.entregador}* .

Estou lhe aguardando no local da sua entrega.
`,
      });
    }
  };

  const concluirEntrega = async (entrega: entregasTipo) => {
    let novaEntrega = entrega;
    novaEntrega.status = "Concluída";
    usuarioLogado
      ? (novaEntrega.entregador = usuarioLogado.userName)
      : (novaEntrega.entregador = entrega.entregador);
    atualizandoEntregaRot(novaEntrega).then(() => {
      atualizandoEntregas();
      informarUpEntregas();
    });
  };

  const disponibilizarEntrega = async (entrega: entregasTipo) => {
    let novaEntrega = entrega;
    novaEntrega.status = "Disponível";
    usuarioLogado
      ? (novaEntrega.entregador = usuarioLogado.userName)
      : (novaEntrega.entregador = entrega.entregador);
    atualizandoEntregaRot(novaEntrega).then(() => {
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
            "disp" + entrega.id.toString()
          );
          elEntrega?.classList.add(styMotora.entregaAndEntregador);
          elEntrega?.parentElement?.parentElement?.classList.add(
            styMotora.entregaAndEntregador
          );
          console.log(elEntrega);
        }
      });
    } else {
      elementoAndamneto.current?.classList.remove(
        styMotora.entregaAndEntregador
      );
    }
  };

  useEffect(() => {
    if (usuarioLogado) {
      const entregasFiltradas = entregasAndamento?.filter(
        (entrega) => entrega.entregador === usuarioLogado.userName
      );
      if (entregasFiltradas) {
        setEntregasUsuario(entregasFiltradas);
      }
    }
    entregaAndEntregador();
  }, [entregasDia, usuarioLogado]);

  useEffect(() => {
    entregaAndEntregador();
  }, [entregasUsuario, usuarioLogado]);

  const getCaseClass = (caseName: string) => {
    switch (caseName) {
      case "Marcos":
        return estilo.marcosFoto;
      case "Uene":
        return estilo.ueneFoto;
      case "Leo":
        return estilo.leoFoto;
      case "Joao":
        return estilo.joaoFoto;
      default:
        return "";
    }
  };

  return (
    <>
      {entregasAndamento?.map((entrega) => {
        let idElement = `disp${entrega.id}`;
        if (entrega.status === "Entregando")
          return (
            <div
              className={`${styMotora.caixaEntregaMotora}`} /**${estilo.caixaAberta} */
              key={entrega.nome + entrega.id}
              id={idElement}
            >
              {/* Marcando a entrega caso a entrega for deste motorista */}
              {usuarioLogado?.userName == entrega.entregador && (
                <span className={`${styMotora.entregaMotoristaLogado}`}>
                  <GiConfirmed />
                </span>
              )}

              <div
                className={estilo.tituloCaixa}
                onClick={(ev) => {
                  console.log("Peguei o click no titulo da entrega disponivel");
                  let boxInfoEntrega = ev.currentTarget.parentElement;
                  boxInfoEntrega?.classList.toggle(styMotora.caixaAbertaMotora);
                  boxInfoEntrega?.classList.toggle(
                    styMotora.caixaAbertaMotoraAnd
                  );
                }}
              >
                <h3>{entrega.nome}</h3>
              </div>
              {/* Area que contem as infomrações sobre a entrega em andamento */}
              <div className={estilo.informCaixa}>
                <p>Bairro: {entrega.bairro}</p>
                <p>Rua: {entrega.rua}</p>
                <p>Número: {entrega.numero}</p>
                <p>Valor: R$ {entrega.valor}</p>
                <p>Entregador: {entrega.entregador}</p>
                <p>Volume: {entrega.volume}</p>
                <p>Pagamento: {entrega.pagamento}</p>
              </div>
              {/* Verifica se as entregas pertencem a este entregador. então liberta botões para o entregador */}
              {usuarioLogado?.userName == entrega.entregador && (
                <div className={styMotora.botoesCaixaMotora}>
                  {/**Interação de enviar mensagem para o cliente */}
                  <div className="relative">
                    <button
                      onClick={(ev) => {
                        const labelMsgStats =
                          ev.currentTarget.parentElement?.children[1];
                        console.log(labelMsgStats);
                        enviarMensagemCliente(entrega).then(() => {
                          labelMsgStats?.classList.toggle(
                            styMotora.mensagemEntregaMotoraFora
                          );
                          labelMsgStats?.classList.toggle(
                            styMotora.botaoEfetuado
                          );
                        });
                      }}
                    >
                      <TbTruckDelivery className={styMotora.iconeInitEntrega} />
                      <span>Notificar chegada ao cliente</span>
                    </button>

                    <span
                      className={`${styMotora.mensagemEntregaMotora} ${styMotora.mensagemEntregaMotoraFora}`}
                    >
                      Mensagem enviada com sucesso!
                    </span>
                  </div>
                  {/* Botão para concluir entrega */}
                  <button
                    onClick={() => {
                      concluirEntrega(entrega);
                    }}
                  >
                    <TbTruckDelivery className={styMotora.iconeInitEntrega} />
                    <span>Concluir entrega</span>
                  </button>
                  {/**Botão para liberar entrega */}
                  <button
                    onClick={() => {
                      disponibilizarEntrega(entrega);

                      if (elementoAndamneto.current) {
                        elementoAndamneto.current.classList.remove(
                          styMotora.displayMotoraEntregasAberto
                        );
                      }
                    }}
                  >
                    <TbTruckDelivery className={styMotora.iconeInitEntrega} />
                    <span>Disponibilizar entrega</span>
                  </button>
                </div>
              )}
            </div>
          );
      })}
    </>
  );
}
