import type { Request, Response, NextFunction  } from "express";
import jwt from 'jsonwebtoken';
import { prisma } from "../lib/prisma";



const secret = process.env.JWT_SECRET

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}



export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            // El header llega como "Bearer TOKEN"; split('') separaba por letras y rompia el JWT.
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({message: 'There is not token'})
        }

        if(!secret){
            return res.status(500).json({message: 'there is not any secret on .env'});
        }

        const decoded = await jwt.verify(token, secret as string) as {id: string};

        const user = await prisma?.user.findUnique({where: {id: decoded.id}, select: {name: true, role: true, email: true, id: true}});

        if(!user){
            return res.status(401).json({message: 'there is not any user'})
        }

        req.user = user
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'something went wrong during the action', error: (error as Error).message});       
    };
    
}

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.role === 'ADMIN'){
        next();
    }else{
        return res.status(403).json({message: 'you must to be administrator'})
    }
};
