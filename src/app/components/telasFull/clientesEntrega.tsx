"use client";

import estilo from "@/styles/telasFull.module.css";
import estiloFade from "@/styles/fades/fadesSty.module.css";
import estiloFullCliente from "@/styles/telasFull.module.css";
import { MdFindReplace } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { FaRegWindowClose } from "react-icons/fa";
import { MdOutlineGroupRemove } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { ContextEntregasClientes } from "../contexts/entregasClientesContext";
import { GiConfirmed } from "react-icons/gi";
import { clientesTipo } from "@/types/clientesType";
import {
  clienteUpdateRota,
  criarEntregaRot,
  deletarClienteRot,
} from "@/utils/funcRotas";
import { end4Coords, gerandoDia } from "@/utils/enderecoCoords";
import { entregasTipo } from "@/types/entregasTypes";
import { contextAutenticacao } from "../contexts/contextoUsuario";

let controlerRotaClientes = true;

export default function ClientesEntregas() {
  const { todosClientes, atualizandoClientes, atualizandoEntregas } =
    useContext(ContextEntregasClientes);

  const { usuarioLogado } = useContext(contextAutenticacao);

  const [editData, setEditData] = useState({
    valor: "",
    pagamento: "Dinheiro",
    entregador: "Marcos",
    volume: "Carro",
  });

  const [selectCliente, setSelectCliente] = useState<clientesTipo>({
    nome: "",
    telefone: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    coordenadas: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [dadosNovosClientes, setDadosNovosClientes] = useState<clientesTipo>({
    nome: "",
    telefone: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    coordenadas: {
      latitude: 0,
      longitude: 0,
    },
  });

  const telaEditClient = useRef<HTMLDivElement>(null);

  const telaFullClient = useRef<HTMLDivElement>(null);

  const areaClientes = useRef<HTMLDivElement>(null);

  const fechandoTela = () => {
    if (telaFullClient.current) {
      let fundoFosco = telaFullClient.current;
      let infsClientEl = fundoFosco.children[0].children[1].children[0];
      let entregaClientEl = fundoFosco.children[0].children[1].children[1];
      let buttonClientEl = fundoFosco.children[0].children[1].children[2];
      let sideBar = fundoFosco.children[0].children[2];

      /**O formulario inicialmente recebera a classe "esfumaçandoParaCima" */
      // formCliente.classList.toggle(estilo.esfumacandoCima);
      infsClientEl.classList.toggle(estiloFade.saiEsquerda);
      entregaClientEl.classList.toggle(estiloFade.saiDireita);
      buttonClientEl.classList.toggle(estiloFade.saiBaixo);
      sideBar.classList.toggle(estiloFade.saiBaixo);
      /**Depois de aguardar 2 segundos, o fundo do formulário deve receber a classe "saiFundoTela" */
      setTimeout(() => {
        fundoFosco.classList.toggle(estilo.retiraNaEsquerda);
      }, 300);
    }
  };

  const removendoCheckedClientese = () => {
    if (areaClientes.current) {
      const clientesElements = areaClientes.current.children;
      for (let i = 0; i < clientesElements.length; i++) {
        clientesElements[i].classList.remove(estilo.areaClientesSelecionado);
      }
    }
  };

  const abrindoTelaNovoCliente = () => {
    let telaFundorForm = document.querySelector("#telaNovoClientesForm");
    if (telaFundorForm) {
      let infsCliente = telaFundorForm.children[0].children[0].children[0];
      let infsEntrega = telaFundorForm.children[0].children[0].children[1];
      let sideBar = telaFundorForm.children[0].children[1];
      telaFundorForm.classList.toggle(estiloFullCliente.retiraNaEsquerda);
      setTimeout(() => {
        infsCliente.classList.toggle(estiloFade.saiEsquerda);
        infsEntrega.classList.toggle(estiloFade.saiCima);
        sideBar.classList.toggle(estiloFade.saiBaixo);
      }, 300);
    }
  };

  const modificandoInputs = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({
      ...editData,
      [event.target.name]: event.target.value,
    });
  };

  const genrandoEntrega = async () => {
    console.log("iniciando processo de gerar entrega...");
    let endereco = `${selectCliente.cidade}, ${selectCliente.bairro}, ${selectCliente.rua}, ${selectCliente.numero}`;
    let diaAtual = gerandoDia();
    let coordenadas = await end4Coords(endereco);
    let entregaNova: entregasTipo = {
      dia: diaAtual,
      nome: selectCliente.nome,
      status: "Disponível",
      telefone: selectCliente.telefone,
      cidade: selectCliente.cidade,
      bairro: selectCliente.bairro,
      rua: selectCliente.rua,
      numero: selectCliente.numero,
      coordenadas: {
        latitude: coordenadas[0],
        longitude: coordenadas[1],
      },
      valor: editData.valor,
      pagamento: editData.pagamento,
      entregador: editData.entregador,
      volume: editData.volume,
    };
    await criarEntregaRot(entregaNova).then(() => {
      atualizandoEntregas();
    });
    console.log("Entrega montada");
  };

  const modificandoClientesInfs = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDadosNovosClientes({
      ...dadosNovosClientes,
      [event.target.name]: event.target.value,
    });
  };

  const alternandoEditClientTela = async () => {
    if (telaEditClient.current) {
      let editTela = telaEditClient.current;
      let editTelaInps = editTela.children[1];
      editTela.classList.toggle(estilo.telaInfAbertoEdit);
      editTelaInps.classList.toggle(estilo.telaEditClienteFora);
    }
  };

  useEffect(() => {
    if (controlerRotaClientes) {
      controlerRotaClientes = false;
      atualizandoClientes();
    }
    if (todosClientes) {
      console.log(
        "Ouvindo modificações nos clientes, atualizado: ",
        todosClientes.length + " clientes."
      );
    }
  }, [todosClientes, usuarioLogado]);

  return (
    <>
      {usuarioLogado?.userName === "Administradores" && (
        <>
          <div
            className={`${estilo.retiraNaEsquerda} ${estilo.telaFullUsuario}`}
            ref={telaFullClient}
            id="telaClientesForm"
          >
            <div className={`${estilo.areaForm}`}>
              {/* Sessão responsável por exibir os clientes disponíves no bd para entrega */}
              <div className={estilo.escolhaClienteComp}>
                <div className={estilo.areaBuscaCliente}>
                  <input type="text" placeholder="Encontrar cliente" />
                  <button>
                    <MdFindReplace className="inline-block size-10" /> Pesquisar
                  </button>
                </div>

                <div className={estilo.areaClientes} ref={areaClientes}>
                  {todosClientes?.map((cliente) => {
                    return (
                      <p
                        key={cliente.nome + cliente.id}
                        onClick={(ev) => {
                          removendoCheckedClientese();
                          ev.currentTarget.classList.toggle(
                            estilo.areaClientesSelecionado
                          );
                          setSelectCliente(cliente);
                          setDadosNovosClientes(cliente);
                        }}
                      >
                        {cliente.nome}
                        <span className={`${estilo.iconeCheckedCliente}`}>
                          <GiConfirmed />
                        </span>
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className={`${estilo.clienteTelaInform}`}>
                <div
                  className={`${estiloFade.saiEsquerda} ${estilo.telaInformsCliente}`}
                  ref={telaEditClient}
                >
                  <div>
                    <h3>Informações do cliente:</h3>
                    <p>Nome: {selectCliente.nome}</p>
                    <p>Cidade: {selectCliente.cidade}</p>
                    <p>Bairro: {selectCliente.bairro}</p>
                    <p>Rua: {selectCliente.rua}</p>
                    <p>Número: {selectCliente.numero}</p>
                  </div>
                  {/* Essa div aqui contem porta todas as modificações que podem ser feitas em um cliente do banco de dados */}
                  <div
                    className={`${estilo.telaEditClienteFora} ${estilo.telaEditCliente}`}
                  >
                    <form
                      onSubmit={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <h3 className={estiloFullCliente.tituloEdit}>
                        Editando dados do Cliente:
                      </h3>
                      <h3>
                        Nome:{" "}
                        <input
                          type="text"
                          name="nome"
                          defaultValue={dadosNovosClientes.nome}
                          onChange={modificandoClientesInfs}
                        />
                      </h3>
                      <h3>
                        Telefone:{" "}
                        <input
                          type="text"
                          name="telefone"
                          defaultValue={dadosNovosClientes.telefone}
                          onChange={modificandoClientesInfs}
                        />
                      </h3>
                      <h3>
                        Cidade:{" "}
                        <input
                          type="text"
                          name="cidade"
                          defaultValue={dadosNovosClientes.cidade}
                          onChange={modificandoClientesInfs}
                        />
                      </h3>
                      <h3>
                        Bairro:{" "}
                        <input
                          type="text"
                          name="bairro"
                          defaultValue={dadosNovosClientes.bairro}
                          onChange={modificandoClientesInfs}
                        />
                      </h3>
                      <h3>
                        Rua:{" "}
                        <input
                          type="text"
                          name="rua"
                          defaultValue={dadosNovosClientes.rua}
                          onChange={modificandoClientesInfs}
                        />
                      </h3>
                      <h3>
                        Número:{" "}
                        <input
                          type="text"
                          name="numero"
                          defaultValue={dadosNovosClientes.numero}
                          onChange={modificandoClientesInfs}
                        />
                      </h3>
                      <div className={estilo.areaButtonsUpdateUser}>
                        <button
                          onClick={() => {
                            alternandoEditClientTela();
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={async () => {
                            console.log(selectCliente);
                            await clienteUpdateRota(dadosNovosClientes).then(
                              (resposta) => {
                                console.log(
                                  "Renato... sua atualização deu muito certo!"
                                );
                                console.log(resposta);
                                atualizandoClientes();
                              }
                            );
                          }}
                        >
                          Atualizar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* Aqui é onde fica o botão para gerar a entrega com todas as informações do formulário preenchidas */}
                <div
                  className={`${estiloFade.saiDireita} ${estilo.areaInformsEntrega}`}
                >
                  <h3>Informações da entrega:</h3>
                  <p>
                    Valor:{" "}
                    <input
                      type="text"
                      placeholder="R$ 278,90"
                      name="valor"
                      onChange={modificandoInputs}
                    />
                  </p>
                  <p>
                    Pagamento:{" "}
                    <select name="pagamento" onChange={modificandoInputs}>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Pix">Pix</option>
                      <option value="Boleto">Boleto</option>
                      <option value='"Vou lembrar dessa..."'>
                        "Vou lembrar dessa..."
                      </option>
                    </select>
                  </p>
                  <p>
                    Entregador:{" "}
                    <select name="entregador" onChange={modificandoInputs}>
                      <option value="Marcos">Marcos</option>
                      <option value="Uene">Uene</option>
                      <option value="Leo">Leo</option>
                    </select>
                  </p>
                  <p>
                    Volume:{" "}
                    <select name="volume" onChange={modificandoInputs}>
                      <option value="Carro">Carro</option>
                      <option value="Moto">Moto</option>
                    </select>
                  </p>
                </div>
                {/* Aqui esta o botão para gerar a entrega do cliente */}
                <button
                  className={`${estiloFade.saiBaixo} ${estilo.botaoGerarEntregaCliente}`}
                  onClick={() => {
                    genrandoEntrega();
                  }}
                >
                  GERAR ROTA DE ENTREGA
                  <TbTruckDelivery className="size-10 absolute right-1" />
                </button>
              </div>

              <div className={`${estiloFade.saiBaixo} ${estilo.navLateral}`}>
                <button
                  onClick={(ev) => {
                    console.log("Clique para fechar ");
                    fechandoTela();
                  }}
                >
                  <FaRegWindowClose className={estilo.fecharTela} />
                </button>

                <button
                  onClick={() => {
                    deletarClienteRot(selectCliente).then(() => {
                      atualizandoClientes();
                      alternandoEditClientTela();
                    });
                  }}
                >
                  <MdOutlineGroupRemove />
                </button>

                <button
                  onClick={() => {
                    alternandoEditClientTela();
                  }}
                >
                  <FaUserEdit />
                </button>

                <button
                  onClick={() => {
                    fechandoTela();
                    setTimeout(() => {
                      abrindoTelaNovoCliente();
                    }, 500);
                  }}
                >
                  <IoPersonAdd />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
