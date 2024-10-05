import type { NextApiRequest, NextApiResponse } from "next";
import { client, enviarMensagem } from "@/whatsapp";
import { enviandoMensagem } from "@/servidor";

type Data = {
  success: boolean;
  error?: string;
};

export default async function rota_Mensagem(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { number, message } = req.body;
    console.log("Recebendo dentro da rota de mensagem: ", req.body);
    console.log("Recebendo solicitação de mensagem");
    try {
      await enviarMensagem(`${number}@c.us`, message);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: " error.message" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
