import { Request, Response } from "express";
import { pool } from "../data/db.js";

export const getRepositories = async (req: Request, res: Response) => {
  try {

    const result = await pool.query(
      `
      SELECT
        r.*,
        s.name AS "userName"
      FROM repositories r
      JOIN students s ON s.id = r.student_id
      WHERE visibility = $1
      AND status = $2
      ORDER BY r.created_at DESC
      `,
      ['publico', 'approved']
    );

    return res.status(200).json(result.rows);

  } catch (err) {

    return res.status(500).json({
      message: "Erro ao buscar repositórios"
    });

  }
};