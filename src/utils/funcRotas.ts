import { clientesTipo } from "@/types/clientesType";
import { entregasTipo } from "@/types/entregasTypes";

import io, { Socket } from "socket.io-client";

/**Incializando conexão com webSocket */
const socket: Socket = io("http://localhost:3000");

/************************************************** ROTAS DEFINIDAS PRA FUNCIONAREM APENAS COM WEBSOCKETS */

export async function informarUpEntregas() {
  socket.emit("novasInfosEntregas", () => {
    console.log("Avisando todos os clientes sobre entregas novas");
  });
}

/************************************************** CLIENTE TRABALHANDO COM ROTAS PARA ENTREGAS *************/

export async function todasEntregas() {
  const urlEntregaNova = "http://localhost:3000/api/entregasRot/rotaEntregas";
  const opts = {
    method: "GET",
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const data = await response.json();
    console.log("Resposta do servidor:", data);
    return data as entregasTipo[];
  } catch (error) {
    console.error("Erro ao enviar a rota de entrega:", error);
  }
}

export async function todasEntregasRelatorio() {
  const urlEntregaNova =
    "http://localhost:3000/api/entregasRot/rotaEntregasRelatorio";
  const opts = {
    method: "GET",
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const data = await response.json();
    console.log("Resposta do servidor:", data);
    return data as entregasTipo[];
  } catch (error) {
    console.error("Erro ao enviar a rota de entrega para relatorio:", error);
  }
}

export async function criarEntregaRot(entrega: entregasTipo) {
  const urlEntregaNova = "http://localhost:3000/api/entregasRot/rotaEntregas";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entrega),
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const todasEntregas = await response.json();
    console.log("O servidor adicionou entregas");
    console.log("Entregas retornadas: ", todasEntregas.length);
  } catch (error) {
    console.error(error);
  }
}

export async function atualizandoEntregaRot(entrega: entregasTipo) {
  const urlEntregaNova =
    "http://localhost:3000/api/entregasRot/atualizandoEntregas";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entrega),
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const todasEntregas = await response.json();
    console.log("O servidor atualizou uma entrega");
    console.log("Entregas retornadas: ", todasEntregas.length);
  } catch (error) {
    console.error(error);
  }
}

type coordsNovaType = {
  id: string;
  novaCoordenada: { lat: number; lng: number };
};

export async function atualizandoCoordEntrega(
  entregaCoordenda: coordsNovaType
) {
  let objetoEnvio = {
    id: entregaCoordenda.id,
    novaCoordenada: {
      lat: entregaCoordenda.novaCoordenada.lat,
      lng: entregaCoordenda.novaCoordenada.lng,
    },
  };

  const urlEntregaNova = "http://localhost:3000/api/entregasRot/uppCoords";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objetoEnvio),
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const todasEntregas = await response.json();
    console.log("O servidor atualizou uma entrega");
    console.log("Retorno: ", todasEntregas);
  } catch (error) {
    console.error(error);
  }
}

export async function deletarEntregaRot(entrega: entregasTipo) {
  const urlEntregaNova = "http://localhost:3000/api/entregasRot/deleteEntrega";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entrega),
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const todasEntregas = await response.json();
    console.log("O servidor deletou um cliente");
    console.log("Clientes retornados: ", todasEntregas.length);
  } catch (error) {
    console.error(error);
  }
}

/************************************************** CLIENTE TRABALHANDO COM ROTAS PARA CLIENTES *************/

export async function meusClientes() {
  const urlClientes = "http://localhost:3000/api/clients/rotaClientes";
  const opts = {
    method: "GET",
  };
  try {
    const dadosRota = await fetch(urlClientes, opts);
    const meusClientes = await dadosRota.json();
    console.log("Resposta do servidor:", meusClientes);
    return meusClientes as clientesTipo[];
  } catch (error) {
    console.error("Erro ao enviar a rota de entrega:", error);
  }
}

export async function criarClienteRot(cliente: clientesTipo) {
  const urlEntregaNova = "http://localhost:3000/api/clients/rotaClientes";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const todasEntregas = await response.json();
    console.log("O servidor adicionou um cliente");
    console.log("Clientes retornados: ", todasEntregas.length);
  } catch (error) {
    console.error(error);
  }
}

export async function deletarClienteRot(cliente: clientesTipo) {
  const urlEntregaNova = "http://localhost:3000/api/clients/removerCliente";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const todosClientes = await response.json();
    console.log("O servidor deletou um cliente");
    console.log("Clientes retornados: ", todosClientes.length);
  } catch (error) {
    console.error(error);
  }
}

export async function clienteUpdateRota(cliente: clientesTipo) {
  console.log("O cliente recebido aqui no middlewere foi: ", cliente);
  const urlEntregaNova = "http://localhost:3000/api/clients/atualizarCliente";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  };
  try {
    const response = await fetch(urlEntregaNova, opts);
    const todosClientes = await response.json();
    console.log("O servidor atualizou um cliente");
    console.log("Clientes retornados: ", todosClientes.length);
  } catch (error) {
    console.log(error);
  }

  /**A aplicação deve funcionar como um porteiro. Duas pessoas não passam  */
}

/************************************************** CLIENTE TRABALHANDO COM ROTAS PARA WHATSAPP *************/

export async function enviarMensagemRot(number: string, message: string) {
  const urlEntregaNova = "http://localhost:3000/api/whatsappRot/whatsAppRot";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number, message }),
  };

  try {
    const response = await fetch(urlEntregaNova, opts);
    const statusMensagem = await response.json();
    console.log("O servidor vai enviar uma mensagem whatsapp.");
    console.log("Retorno do envio da mensagem: ", statusMensagem);
  } catch (error) {
    console.error(error);
  }
}

export async function entregasDoDia() {}
