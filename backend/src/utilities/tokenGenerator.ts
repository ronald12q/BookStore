
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET

if(!secret){
    throw new Error('it seems that the are not any secret on .env file')
}


export const generateToken = (id: String ): String=> {
    return  jwt.sign({id},secret , {expiresIn: '7d'})

}