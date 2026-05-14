import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        type: string;
      };

      file?: Express.Multer.File;
    }
  }
}

export {};