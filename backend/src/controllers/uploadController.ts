import { Response } from "express";
import { pool } from "../data/db.js";

export const createRepository = async (req: any, res: Response) => {
  try {
    const file = req.file;

    const fileUrl = file ? `/uploads/${file.filename}` : null;

    const {
      title,
      description,
      course,
      semester,
      subject,
      visibility
    } = req.body;

    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    await pool.query(
      `
      INSERT INTO repositories (
        title,
        description,
        course,
        semester,
        subject,
        visibility,
        student_id,
        file_url,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
      `,
      [
        title,
        description,
        course,
        semester,
        subject,
        visibility,
        studentId,
        fileUrl
      ]
    );

    return res.status(201).json({
      message: "Repositório criado com sucesso"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Erro ao criar repositório"
    });
  }
};