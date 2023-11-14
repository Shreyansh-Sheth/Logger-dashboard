import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
import { Server } from "socket.io";
import LogsEventHandler from "@/lib/event";

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  console.log("SocketHandler");
  if (res?.socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res?.socket?.server);
    res.socket.server.io = io;
    io.emit("newLog", "Hello");

    LogsEventHandler.on("newLog", (data) => {
      console.log("newLog");
      io.emit("newLog", "Hello");
    });
  }
  res.end();
};

export default SocketHandler;
