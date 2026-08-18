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

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Registration failed';
                console.error('[Register Error]', message, errorData);
                throw new Error(message);
            }
            
            const data = await request.json();
            setUser(data);
            pushNotification({
                title: 'Account created',
                description: 'Your account is ready.',
                status: 'success'
            });
            return true;
            
        } catch (error) {
            if (error instanceof Error) {
                setErrorRegister(error.message);
                pushNotification({
                    title: 'Register failed',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                console.error('[Register Error] Unknown error', error);
                setErrorRegister('An unexpected error occurred');
                pushNotification({
                    title: 'Register failed',
                    description: 'An unexpected error occurred',
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
