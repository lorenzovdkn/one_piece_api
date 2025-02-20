import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../client'
import _ from 'lodash';
import { CrudUserParamsType, LoginType, UsersType } from '../types/common.type';

export const login = async (req: Request<{}, any, LoginType>, res: Response): Promise<void> => {
  try {
    const { email, password} = req.body;
    const user = await prisma.users.findUnique({ where: { email: email } });
    if (!user) {
      res.status(201).send({error : 'Invalid identifiers'});
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).send({error : 'Invalid identifiers'});
      return;
    }

    const token = jwt.sign(
      { username: email, userId: user.id }, // Payload
      process.env.JWT_SECRET as jwt.Secret, // Secret
      { expiresIn: process.env.JWT_EXPIRES_IN } // Expiration
    );

    res.status(200).send({
      token,
    });

  } catch (error: any) {
    res.status(500).send({ error: "Database error" });
  }
};

export const register = async (req: Request<{}, any, LoginType>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).send({error : 'Please enter all required information'});
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailExisted = await prisma.users.findUnique({ where: { email: email } },)

    if (emailExisted) {
      res.status(409).send({error : 'Email already exists'});
      return;
    }

    const user = await prisma.users.createMany({
      data: [
        {
          email: email,
          password: hashedPassword
        }
      ]
    })

    res.status(201).send();
  } catch (err: any) {
    res.status(500).send({ error: "Database error" });
  }
};

export const updateUser = async (req: Request<CrudUserParamsType, any, UsersType>, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({error : 'Invalid User ID'});
      return;
    }

    const user = await prisma.users.findUnique({ where: { id: id } });

    if (!user) {
      res.status(404).send({error : 'User not found' });
      return;
    }

    const { email, password } = req.body

    const updatedData: any = {};

    if (email !== undefined) {
      updatedData.email = email;
    }

    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    if (_.isEmpty(updatedData)) {
      res.status(400).send({error : 'No data provided to update'});
      return;
    }

    const userUpdated = await prisma.users.update({
      where: { id: id },
      data: updatedData,
    })

    res.status(200).send(userUpdated);
  } catch (error: any) {
    res.status(500).send({ error: "Database error" });
  }
};

export const deleteUser = async (req : Request<CrudUserParamsType, any, UsersType>, res  : Response) : Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).send({error : 'Invalid User ID'});
      return;
    }

    const user = await prisma.users.findUnique({ where: { id: id } });

    if (!user) {
      res.status(404).send({error : 'User not found'});
      return;
    }

    const deletedUser = await prisma.users.delete({ where: { id: id } });

    res.status(200).send(deletedUser);
  }catch (error : any) {
    res.status(500).send({ error: "Database error" });
  }
}