import { Request, Response } from "express";
import { pool } from "../data/db.js";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { matricula, password } = req.body;

  try {
    const studentResult = await pool.query(
      "SELECT * FROM students WHERE matricula = $1",
      [matricula]
    );

    const student = studentResult.rows[0];

    if (student) {

      if (student.password !== password) {
        return res.status(404).json({
          message: "Usuário ou senha incorretos"
        });
      }

      const token = jwt.sign(
        {
            id: student.id,
            type: "student"
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1d"
        }
      )

      return res.status(200).json({
        message: "Login realizado com sucesso", 
        token,
        type: "student",
        user: student
      });
    }

    const coordinatorResult = await pool.query(
      "SELECT * FROM coordinators WHERE matricula = $1",
      [matricula]
    );

    const coordinator = coordinatorResult.rows[0];

    if (coordinator) {

      if (coordinator.password !== password) {
        return res.status(404).json({
          message: "Usuário ou senha incorretos"
        });
      }

      const token = jwt.sign(
        {
            id: coordinator.id,
            type: "coordinator",
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1d"
        }
      )

      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
        type: "coordinator"
      });
    }

    return res.status(404).json({
      message: "Usuário ou senha incorretos"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro interno"
    });
  }
};