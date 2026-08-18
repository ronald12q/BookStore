import { API_URL } from "../lib/api";
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

            const request = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                
                body: JSON.stringify({ email, password }) 
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Login failed';
                console.error('[Login Error]', message, errorData);
                throw new Error(message);
            }
            
            const data = await request.json();
            setUser(data);
            pushNotification({
                title: 'Welcome back',
                description: 'You have logged in successfully.',
                status: 'success'
            });
            return data;
            
        } catch (error) {
            if (error instanceof Error) {
                setErrorLogin(error.message);
                pushNotification({
                    title: 'Login failed',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                console.error('[Login Error] Unknown error', error);
                setErrorLogin('An unexpected error occurred');
                pushNotification({
                    title: 'Login failed',
                    description: 'An unexpected error occurred',
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
