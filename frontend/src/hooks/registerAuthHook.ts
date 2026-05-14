import { useState } from "react";
import { authStore } from "../store/authStore";
import type { registerInterface } from "../utilities/authInterface";
import { useNotificationStore } from "../store/notificationStore";


export const RegisterHook = () => {
   
    const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
    const [errorRegister, setErrorRegister] = useState<string | null>(null);
    const { setUser } = authStore();
    const pushNotification = useNotificationStore((state) => state.push);

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
            pushNotification({
                title: 'Account created',
                description: 'Your account is ready.',
                status: 'success'
            });
            console.log('datos guardados con exito')
            return true;
            
           
            
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setErrorRegister(error.message);
                pushNotification({
                    title: 'Register failed',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                console.log('Unknown error during the request', error);
                setErrorRegister('Unknown error during the request');
                pushNotification({
                    title: 'Register failed',
                    description: 'Unknown error during the request',
                    status: 'danger'
                });
            }

            return false;
        } finally {
            setLoadingRegister(false);
        }
    }

    return { requestRegisterApi, loadingRegister, errorRegister };
}
