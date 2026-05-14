import { Request, Response } from "express";
import { pool } from "../data/db.js";

export const getPendingRepositories = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        r.id,
        r.title,
        r.description,
        r.course,
        r.subject,
        r.semester,
        r.visibility,
        r.file_url,
        r.status,
        r.created_at,

        s.name AS student_name,
        s.matricula AS student_matricula

      FROM repositories r
      JOIN students s ON s.id = r.student_id
      WHERE r.status = 'pending'
      `
    );

    return res.status(200).json(result.rows);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao buscar pendentes" });
  }
};