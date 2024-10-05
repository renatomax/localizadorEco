import dataConectEntregas from "@/database/conectandoEntregas";
import { NextApiRequest, NextApiResponse } from "next";

export default async function rota_UpCoords(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connEntrega = await dataConectEntregas();
  const modelEntrega = connEntrega.model("entregas");
  if (req.method === "POST") {
    const dadosUser = req.body;
    const userEntr = dadosUser.id;
    const userNovaCoor = dadosUser.novaCoordenada;
    console.log(dadosUser);
    try {
      const userEntregaBD = await modelEntrega
        .findOneAndUpdate(
          { id: userEntr }, // Encontra o documento pelo ID
          {
            $set: {
              "coordenadas.latitude": userNovaCoor.lat,
              "coordenadas.longitude": userNovaCoor.lng,
            },
          }
        )
        .then((resposta) => {
          console.log(resposta);
          console.log("usuario encontrado e atualizado");
          res
            .status(200)
            .json({ message: "Coordenadas atualizadas com sucesso" });
        })
        .catch((err) => {
          if (err)
            res
              .status(500)
              .json({ message: "Erro ao atualizar as coordenadas" });
        });

      // Verifique se a atualização foi bem-sucedida
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar as coordenadas" });
    }
  }
}
