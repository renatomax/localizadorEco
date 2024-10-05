import dataConectClientes from "@/database/conectandoClientes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deletando_cliente_bd(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connClientes = await dataConectClientes();
  const modelClientes = connClientes.model("clientesEco");

  if (req.method === "POST") {
    let userData = req.body;
    console.log(req.body);

    try {
      const retornoDel = await modelClientes.deleteOne({ id: userData.id });

      if (retornoDel.deletedCount === 0) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      let todosClientes = await modelClientes.find({});

      res.status(200).json(todosClientes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar cliente" });
    }

    res
      .status(200)
      .json({ message: "Deletado com sucesso do Banco de Dados!" });
  }
}
