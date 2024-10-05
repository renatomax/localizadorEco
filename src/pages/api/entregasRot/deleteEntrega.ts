import dataConectEntregas from "@/database/conectandoEntregas";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deletando_entrega_bd(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connEntrega = await dataConectEntregas();
  const modelEntrega = connEntrega.model("entregas");

  if (req.method === "POST") {
    let userData = req.body;
    console.log(req.body);

    try {
      const retornoDel = await modelEntrega.deleteOne({ id: userData.id });

      if (retornoDel.deletedCount === 0) {
        return res.status(404).json({ message: "Entrega não encontrada" });
      }

      let entregasAtuais = await modelEntrega.find({});

      res.status(200).json(entregasAtuais);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar entrega" });
    }

    res
      .status(200)
      .json({ message: "Deletado com sucesso do Banco de Dados!" });
  }
}
