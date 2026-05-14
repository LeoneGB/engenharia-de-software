import { Request, Response } from "express";
import { pool } from "../data/db.js";

export const rejectRepository = async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  try {

    await pool.query(
      `
      DELETE FROM repositories
      WHERE id = $1
      `,
      [id]
    );

    return res.json({
      message: "Repositório rejeitado e removido"
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Erro ao rejeitar repositório"
    });

  }
};