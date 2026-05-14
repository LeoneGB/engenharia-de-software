import { Request, Response } from "express";
import { pool } from "../data/db.js";

export const approveRepository = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    await pool.query(
      `
      UPDATE repositories
      SET status = 'approved'
      WHERE id = $1
      `,
      [id]
    );

    return res.json({
      message: "Repositório aprovado"
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Erro ao aprovar"
    });
  }
};