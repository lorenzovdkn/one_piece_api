import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';


export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log(_.toString(authHeader));
  
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    req.user = { id: decodedToken.userId };
    next();


  } catch (error: any) {
    console.error("Token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expired" }); 
      return;
    }

    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ error: "Invalid token signature" });
      return;
    }

    res.status(500).json({ error: "Internal server error" }); 
  }
};
