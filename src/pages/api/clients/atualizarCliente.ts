import dataConectClientes from "@/database/conectandoClientes";
import { clientesTipo } from "@/types/clientesType";
import { NextApiRequest, NextApiResponse } from "next";

export default async function clienteUpdateRota(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connClientes = await dataConectClientes();
  const modelClientes = connClientes.model("clientesEco");
  if (req.method === "POST") {
    const cliente = req.body as clientesTipo;
    const gerandoCliente = new modelClientes(cliente);

    try {
      console.log("entrou no servidor para atualizar o cliente abaixo");

      console.log(cliente);
      /**Verificando se tem o cliente no banco de dados */
      let achandoCliente = await modelClientes.findOneAndUpdate(
        { id: cliente.id },
        cliente,
        { new: true }
      );

      console.log(
        "No servidor foi encontrado o seguinte cliente no banco de dados."
      );
      console.log(achandoCliente);

      //O meu objetivo é tranformar o cliente que está no banco de dados no cliente que chegou pela rota.
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar o cliente" });
    }

    res.status(200).json({ message: "Atualizado com sucesso" });
  }
}
