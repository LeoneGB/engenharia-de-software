import { Request, Response } from "express";
import { pool } from "../data/db.js";

export const deleteMyRepository = async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?.id;

  try {
    const result = await pool.query(
      `
      DELETE FROM repositories
      WHERE id = $1 AND student_id = $2
      RETURNING *
      `,
      [id, studentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Repositório não encontrado ou não pertence ao usuário"
      });
    }

    return res.json({
      message: "Repositório deletado com sucesso"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao deletar repositório" });
  }
};