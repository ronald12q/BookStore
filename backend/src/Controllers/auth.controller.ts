import {prisma} from '../lib/prisma'
import bcrypt from 'bcryptjs';
import { Jwt } from 'jsonwebtoken';
import type { Request, Response } from 'express';



const postUser = async (req : Request, res: Response) => {

    try {
        const {name, password, email, role} = req.body;
        const normalizedEmail = String(email ?? '').trim().toLowerCase();

        if(!name || !password || !normalizedEmail){
           return  res.status(400).json({message: 'all fields needs to be fill'});     
        }

        const exist = prisma.user.findUnique({where: {email: normalizedEmail}});

        if(!exist){
            const hashedPassword = await bcrypt.hash(password, 10);
            const createUser = await prisma.user.create({data: {name: name, email: normalizedEmail, password: hashedPassword, role: role},})

        } 

        return res.status(500).json({message: 'user already exist'})
        
    } catch (error) {
        
    }


}