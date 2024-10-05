import io, { Socket } from "socket.io-client";

const socket: Socket = io("https://localizador-eco-ffn7.vercel.app/");

export default socket;
