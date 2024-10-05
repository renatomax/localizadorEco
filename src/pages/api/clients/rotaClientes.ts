import dataConectClientes from "@/database/conectandoClientes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function rota_Clientes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connClientes = await dataConectClientes();
  const modelClientes = connClientes.model("clientesEco");

  /*******************************  ROTA GET ->   RETORNANDO TODOS OS CLIENTES  */
  if (req.method === "GET") {
    console.log("Clientes solicitados do banco de dados");
    const todosClientes = await modelClientes.find({});
    res.status(200).json(todosClientes);

    /*******************************  ROTA POST ->   ADINCIONANDO CLIENTE  */
  } else if (req.method === "POST") {
    const dadosUser = req.body;
    const clienteGerado = new modelClientes(dadosUser);
    await clienteGerado.save().then(() => {
      console.log("Cliente salvo com sucesso!");
    });
    const todosClientes = await modelClientes.find({});
    res.status(200).json(todosClientes);
  }
}
