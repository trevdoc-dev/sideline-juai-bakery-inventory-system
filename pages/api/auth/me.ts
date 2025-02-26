import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const SECRET_KEY = process.env.JWT_SECRET!;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from headers

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
