import { Alert, CloseButton } from "@heroui/react";
import { useState, useEffect } from "react";



interface alertSuccess {
    title : String
    duration : number
} 


export const AlertSuccess = ({title, duration = 2000}: alertSuccess) => {
    
    const [isVisible, setIsVisible] = useState<Boolean>(true);
    
       useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer); // Limpiar si el componente se desmonta
    }, []);

    if (!isVisible) return null;
    return (

          <Alert status="success">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{title}</Alert.Title>
        </Alert.Content>
        <CloseButton />
      </Alert>
    )
}