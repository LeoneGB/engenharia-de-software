import { Request, Response } from "express";
import { pool } from "../data/db.js";

export const getMyRepositories = async (
  req: Request,
  res: Response
) => {

  const studentId = req.user?.id;

  if (!studentId) {
    return res.status(401).json({
      message: "Não autenticado"
    });
  }

  try {

    const result = await pool.query(
  `
  SELECT 
    r.*,
    s.name AS "userName"
  FROM repositories r
  JOIN students s ON s.id = r.student_id
  WHERE r.student_id = $1
  ORDER BY r.created_at DESC
  `,
  [studentId]
);

    return res.json(result.rows);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Erro ao buscar repositórios"
    });
  }
};