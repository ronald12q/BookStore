import { useState } from "react";
import { authStore } from "../store/authStore";
import type { registerInterface } from "../utilities/authInterface";


export const RegisterHook = () => {
   
    const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
    const [errorRegister, setErrorRegister] = useState<string | null>(null);
    const { setUser } = authStore();

    const requestRegisterApi = async ({ email, name, password }: registerInterface): Promise<boolean> => {
        try {
            setLoadingRegister(true);
            setErrorRegister(null); 

            const request = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                
                body: JSON.stringify({ name, email, password }) 
            });

            if (!request.ok) throw new Error('The request to the API failed');
            
            const data = await request.json();
            setUser(data);
            console.log('datos guardados con exito')
            return true;
            
           
            
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setErrorRegister(error.message);
            } else {
                console.log('Unknown error during the request', error);
                setErrorRegister('Unknown error during the request');
            }

            return false;
        } finally {
            setLoadingRegister(false);
        }
    }

    return { requestRegisterApi, loadingRegister, errorRegister };
}