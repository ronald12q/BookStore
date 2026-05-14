

type role =  'ADMIN' | 'CUSTOMER'; 



interface user {
    name: string,
    email: string, 
    role: role
}

export interface authInterface {
    token: string,
    user: user
}


export interface AuthFormInterface {
    setModeAuth: () => void,
    onSuccess: () => void

    
}


export interface registerInterface {
    name: string,
    email: string,
    password: string
}


export interface loginInterface {
    email: string,
    password: string

}
