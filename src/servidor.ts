import express from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cors from "cors"; // Importando o pacote cors
import dataConnectUsuarios, { fechandoBanco } from "./database/conectUsers";
import { usuarioTipo } from "./types/userTypes";

/**Inicializando Cliente WhatsApp */

let isClientReady = false;

const client: Client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr: string) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client está pronto");
  isClientReady = true;
  enviandoMensagem(
    "q2e12eqwdas",
    "O cliente do WhatsApp foi inicializado com sucesso"
  );
  client.sendMessage("551992757516@c.us", "O cliente do WhatsApp está pronto");
});

client.initialize(); // Certifique-se de que o cliente está sendo inicializado

export const enviandoMensagem = async (contato: string, message: string) => {
  if (!isClientReady) {
    console.log("Cliente não está pronto");
    return;
  }
  console.log("Enviando mensagem...");
  try {
    await client.sendMessage("551992757516@c.us", message);
    console.log("Mensagem enviada com sucesso");
  } catch (err) {
    console.log(err);
  }
};

const dev = process.env.NODE_ENV !== "production";
/**Inicializando o app */
const app = next({ dev });
const tratadorRotas = app.getRequestHandler();

app.prepare().then(() => {
  /******************************************** CONFIGURANDO SERVIDOR */
  const servidor = express();
  const servidorEco = createServer(servidor);

  /**Inicializado WebSocket */
  const io = new Server(servidorEco, {
    cors: {
      origin: "https://localizador-eco-ffn7.vercel.app",
      methods: ["GET", "POST"],
    },
  });

  servidor.use(express.json());
  servidor.use(cors()); // Adicionando o middleware cors

  servidor.all("*", (req, res) => {
    return tratadorRotas(req, res);
  });

  /******************************************* CONEXÕES COM WEBSOCKET */
  io.on("connection", (socket) => {
    console.log("Cliente conectado, seu socket foi criado com sucesso.");
    /***************************************** AQUI JA ENTRA TODAS AS CONEXÕES QUE UMA PESSOA QUE FEZ O PRIMEIRO ACESSO TEM DIREITO */

    socket.on("autenticando-Usuario", (informs) => {
      console.log(informs);
      const meusUsuarios = autenticandoUsuario(informs).then((meuUsuario) => {
        /**Aqui, depois de autenticar o usuario, todos os usuarios ja conectados dever receber um "sinal", notificando isso */
        socket.emit("novoUser-autenticado", meuUsuario);
        /**Aqui, depois de autenticar o usuario, estamos ouvindo envios de localização dos usuários*/
      });
    });

    socket.on("atualizarLocalizacao", async (dados) => {
      console.log("Atualizando coordenadas do usuário...");
      dados.usuarioLogin.localizacao.latitude = dados.lat;
      dados.usuarioLogin.localizacao.longitude = dados.lon;
      console.log(dados.usuarioLogin);
      atualizandoUsuarios(dados.usuarioLogin);
    });

    socket.on("solicitar-usuarios", async () => {
      todosUsuariosBd().then((dados) => {
        socket.emit("todos-usuarios", dados);
      });
    });

    socket.on("enviarMensagem", async (objetoMSG) => {
      if (!isClientReady) {
        console.log("Cliente não está pronto");
        socket.emit("erro", {
          mensagem: "Cliente do WhatsApp não está pronto",
        });
        return;
      }

      try {
        await client.sendMessage("551992757516@c.us", objetoMSG.mensagem);
        console.log("Mensagem enviada com sucesso");
        socket.emit("mensagemEnviada", {
          mensagem: "Mensagem enviada com sucesso",
        });
      } catch (err) {
        console.log(err);
        socket.emit("erro", { mensagem: "Erro ao enviar mensagem" });
      }
    });

    socket.on("novasInfosEntregas", () => {
      io.emit("informandoClientesUpdateEntregas", () => {
        console.log("Atualizando entrega de todos os usuario");
      });
    });

    socket.on("disconnect", () => {
      console.log("Um usuário abandonou a conexão");
      fechandoBanco();
    });
  });

  servidorEco.listen(3000, () => {
    console.log(
      "> Servidor rodando em https://localizador-eco-ffn7.vercel.app/"
    );
  });
});

type dadosIniciais = {
  usuario: string;
  senha: string;
};

export default async function autenticandoUsuario(dados: dadosIniciais) {
  /*** Estabelecer conexão com o banco de dados de usuários. */
  const conexaoUsuarios = await dataConnectUsuarios();
  const modeloUsuarios = conexaoUsuarios.model("usuarios");
  /*** Fazer a busca pelo usuário no banco de dados. */
  const usuarioEncontrado = await modeloUsuarios.findOne({
    userName: dados.usuario,
  });
  console.log(usuarioEncontrado.userName + " foi autenticado com Sucesso!");
  return usuarioEncontrado;
}

async function todosUsuariosBd() {
  /*** Estabelecer conexão com o banco de dados de usuários. */
  const conexaoUsuarios = await dataConnectUsuarios();
  const modeloUsuarios = conexaoUsuarios.model("usuarios");
  /*** Fazer a busca pelo usuário no banco de dados. */
  const allUsers = await modeloUsuarios.find({});
  console.log("Pegando todos usuários do banco de dados.");
  return allUsers;
}

async function atualizandoUsuarios(usuarioUppdate: usuarioTipo) {
  /*** Estabelecer conexão com o banco de dados de usuários. */
  const conexaoUsuarios = await dataConnectUsuarios();
  const modeloUsuarios = conexaoUsuarios.model("usuarios");

  const userEntregaBD = await modeloUsuarios.updateOne(
    { userName: usuarioUppdate.userName }, // Encontra o documento pelo ID
    {
      $set: usuarioUppdate,
    }
  );
  console.log(
    "Status da atualização da coordenada do usuário: " +
      userEntregaBD.acknowledged
  );
}
