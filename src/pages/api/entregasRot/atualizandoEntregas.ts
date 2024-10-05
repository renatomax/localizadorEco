import dataConectEntregas from "@/database/conectandoEntregas";
import { entregasTipo } from "@/types/entregasTypes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function up_Entregas(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connEntrega = await dataConectEntregas();
  const modelEntrega = connEntrega.model("entregas");
  if (req.method === "POST") {
    const entrega = req.body as entregasTipo;
    const entregaGerada = new modelEntrega(entrega);

    try {
      console.log("entrou no servidor pelo menos");
      const userEntregaBD = await modelEntrega.updateOne(
        { id: entrega.id }, // Encontra o documento pelo ID
        {
          $set: entrega,
        }
      );

      console.log(userEntregaBD); // Retorna um objeto com informações sobre a atualização

      // Verifique se a atualização foi bem-sucedida
      if (userEntregaBD.modifiedCount === 1) {
        res.status(200).json({ message: "Entrega atualizada com sucesso" });
      } else {
        res.status(404).json({ message: "Entrega não encontrada" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar a entrega" });
    }

    res.status(200).json({ message: "Atualizado com sucesso" });
  }
}
