import app from "./app.js";
import { pool } from "./data/db.js";
import express from "express";
import path from "path";

const PORT = process.env.PORT;

pool.connect()
  .then(() => {
    console.log("Banco conectado!");

    app.use("/uploads", express.static("uploads"));

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Erro ao conectar no banco");
    console.log(err);
  });