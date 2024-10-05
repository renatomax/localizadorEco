// src/pages/api/rotaMensagem.ts
import { enviandoMensagem } from "@/servidor";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { contato, mensagem } = req.body;
    console.log(req.body.contato);

    if (!contato || !mensagem) {
      return res
        .status(400)
        .json({ error: "Contato e mensagem são obrigatórios" });
    }

    try {
      console.log("tentando enviar mensagem...");
      enviandoMensagem(contato, mensagem).then(() => {
        console.log("enviado");
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
