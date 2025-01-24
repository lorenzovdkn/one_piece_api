import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../client'

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email : string,
    password : string,
  };

  try {
  const user = await prisma.users.findUnique({ where : { email: email } });
  if (!user) {
    res.status(401).send('Identifiants invalides');
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if(!valid) {
    res.status(401).send('Identifiants invalides');
    return;
  }

  const token = jwt.sign(
    { username : email, id : user.id}, // Payload
    process.env.JWT_SECRET as jwt.Secret, // Secret
    { expiresIn: process.env.JWT_EXPIRES_IN } // Expiration
  );

  res.status(200).json({
    token,
  });

}catch(error : any) {
  res.status(500).send({error: error.message});
}};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  }

  try {
    if(!email || !password) {
      res.status(400).send('Please enter all required information');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailExisted = await prisma.users.findUnique({where: {email: email}},)

    if(emailExisted) {
      res.status(409).send('Email already exists');
      return;
    }

    const user = await prisma.users.createMany({
      data: [
        { email : email,
          password: hashedPassword }
      ]
    })

    res.status(201).send('User created successfully');
}catch (err : any) {
  res.status(500).send({error: err.message});
}
}