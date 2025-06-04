import { Request, Response } from "express";

export const getMembers = async (req: Request, res: Response) => {
  try {

  } catch (err) {
    console.error("Internal Error in fetching members", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

export const addMembers = async (req: Request, res: Response) => {
  try {
    const {  } = req.body;
  } catch (err) {
    console.error("Internal Error in adding members", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}