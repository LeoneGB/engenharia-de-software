import { Request, Response } from "express";
import { pool } from "../data/db.js";

type CreateRepositoryBody = {
  title: string;
  description: string;
  course: string;
  subject: string;
  semester: string;
  visibility: string;
  file_url: string;
  status: string
};

export const createRepository = async (
  req: Request<{}, {}, CreateRepositoryBody>,
  res: Response
) => {
  const studentId = req.user?.id;

  if (!studentId) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  const {
    title,
    description,
    course,
    subject,
    semester,
    visibility,
    file_url,
    status
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO repositories 
      (title, description, course, subject, semester, visibility, file_url, status, student_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        title,
        description,
        course,
        subject,
        semester,
        visibility,
        file_url,
        status,
        studentId
      ]
    );

    return res.status(201).json({ message: "Repositório criado" });

  } catch (err) {
  console.error(err);
  return res.status(500).json({
    message: "Erro ao criar repositório",
    error: err
  });
}
};