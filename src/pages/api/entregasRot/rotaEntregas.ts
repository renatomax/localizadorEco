import dataConectEntregas from "@/database/conectandoEntregas";
import { fechandoBanco } from "@/database/conectUsers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function rota_Entregas(
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
    console.log("Entregas solicitadas do banco de dados");

    // Obter a data de hoje dinamicamente
    const hoje = new Date();
    const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

    // Buscar entregas com a data de hoje
    const entregasDia = await modelEntrega.find({ dia: diaHoje });
    res.status(200).json(entregasDia);
  }
}
