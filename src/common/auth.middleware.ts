import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log(_.toString(authHeader));
  
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // On récupère le token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as {
      userId: string;
    };
    const userId = decodedToken.userId;
    req.query = {
      userId: userId,
    };
    next();
  } else {
    res.sendStatus(401); // Pas de token fourni
  }
};
