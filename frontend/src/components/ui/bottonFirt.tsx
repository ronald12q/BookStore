import { Button } from "@heroui/react"


type botonesTipo = "button" | "submit" | "reset" | undefined

interface ButtonProps {
    label?:string,
    onClick: () => void,
    classname?: string,
    type: botonesTipo
}


export const ButtonPrimary = ({label, onClick, classname, type}: ButtonProps) => {

    return (
        <Button   onClick={onClick} type={type}  className={classname}>{label}</Button>
    )

}