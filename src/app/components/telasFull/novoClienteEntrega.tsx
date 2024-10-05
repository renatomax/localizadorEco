"use client";

import estilo from "@/styles/telasFull.module.css";
import estiloFade from "@/styles/fades/fadesSty.module.css";
import estiloFullCliente from "@/styles/telasFull.module.css";
import { FaRegWindowClose } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { FaUsersViewfinder } from "react-icons/fa6";
import { end4Coords, gerandoDia } from "@/utils/enderecoCoords";
import { entregasTipo } from "@/types/entregasTypes";
import { criarClienteRot, criarEntregaRot } from "@/utils/funcRotas";
import { clientesTipo } from "@/types/clientesType";
import { ContextEntregasClientes } from "../contexts/entregasClientesContext";
import { contextAutenticacao } from "../contexts/contextoUsuario";

export default function NovoClienteEntregas() {
  const { atualizandoClientes, atualizandoEntregas } = useContext(
    ContextEntregasClientes
  );
  const { usuarioLogado } = useContext(contextAutenticacao);
  const telaFullClient = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cidade: "",
    telefone: "",
    bairro: "",
    rua: "",
    numero: "",
    valor: "",
    pagamento: "Dinheiro",
    entregador: "Marcos",
    volume: "Carro",
  });

  const modificandoInputs = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const genrandoEntrega = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    console.log("iniciando processo de gerar entrega...");
    let endereco = `${formData.cidade}, ${formData.bairro}, ${formData.rua}, ${formData.numero}`;
    let coordenadas = await end4Coords(endereco);
    let diaAtual = gerandoDia();
    let entregaNova: entregasTipo = {
      dia: diaAtual,
      nome: formData.nome,
      telefone: formData.telefone,
      cidade: formData.cidade,
      status: "Disponível",
      bairro: formData.bairro,
      rua: formData.rua,
      numero: formData.numero,
      coordenadas: {
        latitude: coordenadas[0],
        longitude: coordenadas[1],
      },
      valor: formData.valor,
      pagamento: formData.pagamento,
      entregador: formData.entregador,
      volume: formData.volume,
    };
    await criarEntregaRot(entregaNova).then(() => {
      atualizandoEntregas();
    });
    console.log(formData);
  };

  const adicionarCliente = async () => {
    console.log("iniciando processo de adicionar cliente...");
    let endereco = `${formData.cidade}, ${formData.bairro}, ${formData.rua}, ${formData.numero}`;
    let coordenadas = await end4Coords(endereco);
    let clienteNovo: clientesTipo = {
      nome: formData.nome,
      telefone: formData.telefone,
      cidade: formData.cidade,
      bairro: formData.bairro,
      rua: formData.rua,
      numero: formData.numero,
      coordenadas: {
        latitude: coordenadas[0],
        longitude: coordenadas[1],
      },
    };
    await criarClienteRot(clienteNovo).then(() => {
      atualizandoClientes();
    });
  };
  /**********************          FUNÇOES DE ESTILIZAÇÃO E INTERAÇÃO */
  const fechandoTela = () => {
    if (telaFullClient.current) {
      let fundoFosco = telaFullClient.current;
      let infsCliente = fundoFosco.children[0].children[0].children[0];
      let infsEntrega = fundoFosco.children[0].children[0].children[1];
      let sideBar = fundoFosco.children[0].children[1];

      /**O formulario inicialmente recebera a classe "esfumaçandoParaCima" */
      infsCliente.classList.toggle(estiloFade.saiEsquerda);
      infsEntrega.classList.toggle(estiloFade.saiCima);
      sideBar.classList.toggle(estiloFade.saiBaixo);
      /**Depois de aguardar 2 segundos, o fundo do formulário deve receber a classe "saiFundoTela" */
      setTimeout(() => {
        fundoFosco.classList.toggle(estilo.retiraNaEsquerda);
      }, 300);
    }
  };

  const abrindoTelaClientes = () => {
    let telaFundorForm = document.querySelector("#telaClientesForm");
    let infsClientEl = telaFundorForm?.children[0].children[1].children[0];
    let entregaClientEl = telaFundorForm?.children[0].children[1].children[1];
    let buttonClientEl = telaFundorForm?.children[0].children[1].children[2];
    let sideBar = telaFundorForm?.children[0].children[2];
    if (
      telaFundorForm &&
      infsClientEl &&
      entregaClientEl &&
      buttonClientEl &&
      sideBar
    ) {
      telaFundorForm.classList.toggle(estiloFullCliente.retiraNaEsquerda);
      setTimeout(() => {
        // formCliente.classList.toggle(estiloFullCliente.esfumacandoCima);
        infsClientEl.classList.toggle(estiloFade.saiEsquerda);
        entregaClientEl.classList.toggle(estiloFade.saiDireita);
        buttonClientEl.classList.toggle(estiloFade.saiBaixo);
        sideBar.classList.toggle(estiloFade.saiBaixo);
      }, 500);
    }
  };

  useEffect(() => {}, [usuarioLogado]);

  return (
    <>
      {usuarioLogado?.userName === "Administradores" && (
        <div
          className={`${estilo.retiraNaEsquerda}  ${estilo.telaFullUsuario}`}
          ref={telaFullClient}
          id="telaNovoClientesForm"
        >
          <div className={`${estilo.areaForm}`}>
            {/* Sessão responsável por exibir os clientes disponíves no bd para entrega */}

            <form
              className={`${estilo.formNovoCliente}`}
              onSubmit={(ev) => {
                genrandoEntrega(ev);
              }}
            >
              <div
                className={`${estiloFade.saiEsquerda} ${estilo.areaInformsCliente}`}
              >
                <h2 className={`${estilo.tituloArea}`}>
                  Informações do cliente:
                </h2>
                <h3>
                  Nome:{" "}
                  <input type="text" name="nome" onChange={modificandoInputs} />
                </h3>

                <h3>
                  Telefone:{" "}
                  <input
                    type="text"
                    name="telefone"
                    placeholder="(41) 9999-9999"
                    onChange={modificandoInputs}
                  />
                </h3>

                <h3>
                  Cidade:{" "}
                  <input
                    type="text"
                    name="cidade"
                    onChange={modificandoInputs}
                  />
                </h3>

                <h3>
                  Bairro:{" "}
                  <input
                    type="text"
                    name="bairro"
                    onChange={modificandoInputs}
                  />
                </h3>

                <h3>
                  Rua:{" "}
                  <input type="text" name="rua" onChange={modificandoInputs} />
                </h3>
                <h3>
                  Número:{" "}
                  <input
                    type="text"
                    name="numero"
                    onChange={modificandoInputs}
                  />
                </h3>
              </div>

              <div
                className={`${estiloFade.saiCima} ${estilo.areaEntregaInfosNC}`}
              >
                <div className={`${estilo.areaInformsEntrega}`}>
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

                <button
                  className={`${estilo.botaoGerarEntregaCliente}`}
                  type="submit"
                >
                  GERAR ROTA DE ENTREGA
                  <TbTruckDelivery className="size-10 absolute right-1" />
                </button>
              </div>
            </form>

            <div className={`${estiloFade.saiBaixo} ${estilo.navLateral}`}>
              <button
                onClick={(ev) => {
                  console.log("Clique para fechar ");
                  fechandoTela();
                }}
              >
                <FaRegWindowClose className={estilo.fecharTela} />
              </button>

              <div
                className={`${estilo.buttonDiv} ${estilo.adcClienteNewForm}`}
                onClick={adicionarCliente}
              >
                <IoPersonAdd />
              </div>

              <div
                className={`${estilo.buttonDiv} ${estilo.buscaClienteNewForm}`}
                onClick={() => {
                  fechandoTela();
                  setTimeout(() => {
                    abrindoTelaClientes();
                  }, 800);
                }}
              >
                <FaUsersViewfinder />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
