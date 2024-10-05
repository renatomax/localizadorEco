"use client";
// components/whatsweb.tsx
import { useEffect } from "react";
import { Client, LocalAuth } from "whatsapp-web.js";

const WhatsWeb = () => {
  useEffect(() => {
    const client = new Client({
      authStrategy: new LocalAuth(),
    });

    client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      // Aqui você pode renderizar o QR code na tela
    });

    client.on("ready", () => {
      console.log("Client is ready!");
    });

    client.on("message", (msg) => {
      if (msg.body === "!ping") {
        msg.reply("pong");
      }
    });

    client.initialize();

    return () => {
      client.destroy();
    };
  }, []);

  return (
    <div>
      <h1>WhatsApp Web Client</h1>
      {/* Aqui você pode adicionar um elemento para exibir o QR code */}
    </div>
  );
};

export default WhatsWeb;
