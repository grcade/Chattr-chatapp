import express from "express";
import { sql } from "drizzle-orm";
import type { Request, Response } from "express";

import db from "./db/db.js";
import { env } from "./config/env.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";



const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },))

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);




    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    });
})


app.get("/health", async (req : Request, res : Response) => {
  try {
    await db.execute(sql`SELECT 1`);
    return res.json({ status: 'healthy' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'unhealthy', error });
  }
});

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
