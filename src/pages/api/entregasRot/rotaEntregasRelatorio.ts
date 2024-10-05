import dataConectEntregas from "@/database/conectandoEntregas";
import { NextApiRequest, NextApiResponse } from "next";

export default async function rota_Entregas_Relatorio(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connEntrega = await dataConectEntregas();
  const modelEntrega = connEntrega.model("entregas");
  if (req.method === "POST") {
    const dadosUser = req.body;
    const entregaGerada = new modelEntrega(dadosUser);
    await entregaGerada.save().then(() => {
      console.log("salvo com sucesso!");
    });
    const entregasDia = await modelEntrega.find({});
    res.status(200).json(entregasDia);
  } else if (req.method === "GET") {
    console.log("Entregas solicitadas do banco de dados para relatorio");

    // Buscar entregas com a data de hoje
    const entregasDia = await modelEntrega.find({});
    res.status(200).json(entregasDia);
  }
}
