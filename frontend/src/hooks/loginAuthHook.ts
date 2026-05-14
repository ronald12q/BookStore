import { useState } from "react";
import { authStore } from "../store/authStore";
import type { loginInterface } from "../utilities/authInterface";
import type { authInterface } from "../utilities/authInterface";
import { useNotificationStore } from "../store/notificationStore";

export const LoginHook = () => {
   
    const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
    const [errorLogin, setErrorLogin] = useState<string | null>(null);
    const { setUser } = authStore();
    const pushNotification = useNotificationStore((state) => state.push);

    const requestLoginApi = async ({ email,password }: loginInterface): Promise<null| authInterface > => {
        try {
            setLoadingLogin(true);
            setErrorLogin(null); 

            const request = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                
                body: JSON.stringify({ email, password }) 
            });

            if (!request.ok) throw new Error('The request to the API failed');
            
            const data = await request.json();
            setUser(data);
            pushNotification({
                title: 'Welcome back',
                description: 'You have logged in successfully.',
                status: 'success'
            });
            console.log('login exitoso');
            return data;
            
            
            
           
            
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setErrorLogin(error.message);
                pushNotification({
                    title: 'Login failed',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                console.log('Unknown error during the request', error);
                setErrorLogin('Unknown error during the request');
                pushNotification({
                    title: 'Login failed',
                    description: 'Unknown error during the request',
                    status: 'danger'
                });
            }

            return null;
        } finally {
            setLoadingLogin(false);
        }
    }

    return { requestLoginApi, loadingLogin, errorLogin };
}
