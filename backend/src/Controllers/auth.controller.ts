import {prisma} from '../lib/prisma'
import bcrypt from 'bcryptjs';
import { generateToken } from '../utilities/tokenGenerator';
import type { Request, Response } from 'express';
import {z} from 'zod';



export const createUser = async (req : Request, res: Response) => {

    const userCreateSchema = z.object({
        name: z.string().trim().min(1, 'name is required'),
        email: z.email('email is required'),
        password: z.string().trim().min(8, 'password needs almost 8 letters')
    })
    try {
        const result  = userCreateSchema.safeParse(req.body);

        if(!result.success){
           return  res.status(400).json({message: 'something went wrong with the data sent'});     
        }

        const {name, email, password} = result.data;

        const normalizedEmail = String(email ?? '').trim().toLowerCase();

        const user = await prisma.user.findUnique({where: {email: normalizedEmail}});

        if(user){
            return res.status(401).json({message: 'user already exist'})
            
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = await prisma.user.create({data: {name: name, email: normalizedEmail, password: hashedPassword, cart: {create: {}}}})
        const token = generateToken(createUser.id);
        return res.status(201).json({token, user:{name: createUser.name, email: createUser.email, role:createUser.role}});

        
        
    } catch (error) {
        console.error(error);
       return  res.status(500).json({message:"something was wrong creating a new user", error: (error as Error).message});
    }


}


export const loginUser = async(req: Request, res: Response) => {

    const userLoginSchema = z.object({
        email: z.email('email is required'),
        password: z.string().trim().min(8,'password needs almost 8 letters')
    })
    try {
        const result = userLoginSchema.safeParse(req.body);
        

        if(!result.success){
            return res.status(400).json({message: 'something went wrong with the data sent'});
        }
        
        const {email, password} = result.data;
        const normalizedEmail = String(email ?? '').trim().toLowerCase();
        const user = await prisma.user.findUnique({where:{email: normalizedEmail}});
        if(!user){
            return res.status(500).json({message: 'user not find'})
        }

        const decryptedPassword = await bcrypt.compare(password, user.password);
            if(!decryptedPassword){
                return res.status(401).json({message: 'error password does not match'})
            }
            const token = generateToken(user.id);
           return  res.status(200).json({token, user:{name: user.name, email: user.email, role: user.role}});
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'something was wrong during the action', error: (error as Error).message});
    }
}
