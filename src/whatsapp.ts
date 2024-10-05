import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

let isClientReady = false;

const client: Client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr: string) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client esta prontoooo");
  isClientReady = true;
});

client.initialize();

const inicializandoCliente = () => {
  console.log("Aqui eu iniciaria o whatsapp");
};

export const enviarMensagem = async (contato: string, message: string) => {
  console.log("Funão enviarMensagem acionada.");
  console.log("O conteúdo a ser enviado é: ", message);
  const teste = await client
    .sendMessage("551992757516@c.us", message)
    .then(() => {
      console.log("Mensagem Enviada com sucessl");
    })
    .catch((err) => {
      if (err) console.log(err);
    });
};

export { client, isClientReady, inicializandoCliente };
