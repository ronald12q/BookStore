import { useState, type ChangeEvent, type FormEvent } from "react";
import { Label, Input } from "@heroui/react";
import type { AuthFormInterface } from "../utilities/authInterface";
import type { loginInterface } from "../utilities/authInterface";
import { LoginHook } from "../hooks/loginAuthHook";
import { ButtonPrimary } from "./ui/bottonFirt";
import { AlertError } from "./ui/alertError";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = ({ setModeAuth, onSuccess }: AuthFormInterface) => {
  const [alertErrorState, setAlertErrorState] = useState<boolean>(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState< boolean> (false);
  const [errorFrontend, setErrorFrontend] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<loginInterface>({
    email: '',
    password: ''
  });

  const { requestLoginApi, errorLogin } = LoginHook();

  const loginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorFrontend(null);

    if (!loginData.email || !loginData.password) {
      setErrorFrontend('all fields need to fill');
      return;
    }

    if (!loginData.email.includes("@")) {
      setErrorFrontend('the structure of the email is not correct');
      return;
    }

    if (loginData.password.length < 8) {
      setErrorFrontend('password need almost 8 characters');
      return;
    }

    const authData = await requestLoginApi(loginData);
    if (!authData) {
      setAlertErrorState(true);
      return 
    }
    setLoginData({ email: '', password: '' });
    onSuccess();
    navigate(authData.user.role    === 'ADMIN' ? '/admin' : '/')
      
    
    
  }

  const getLoginData = (e: ChangeEvent<HTMLInputElement>) => {
    // El input debe guardar un string; con [e.target.value] estabas guardando un array.
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  return (
    <div className="relative isolate flex w-[min(92vw,30rem)] flex-col items-center overflow-hidden rounded-[2rem] border border-veloura-accent/25 bg-linear-to-br from-[#120c0a]/85 via-[#24130f]/75 to-[#090605]/90 px-8 py-10 shadow-2xl shadow-black/70 backdrop-blur-3xl sm:px-14 sm:py-14">
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <div className="absolute -top-24 right-[-4rem] -z-10 size-56 rounded-full bg-veloura-accent/12 blur-3xl" />
      <div className="absolute -bottom-28 left-[-5rem] -z-10 size-64 rounded-full bg-veloura-primary/35 blur-3xl" />

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.45em] text-veloura-accent/80">Raven Brand</p>
      <h1 className="font-display text-6xl font-bold text-veloura-surface drop-shadow-sm">Login</h1>
      <p className="mt-3 max-w-sm text-center text-sm leading-6 text-veloura-surface-2/70">Enter your private shelf and continue your next dark coffee read.</p>

      <form className="mt-9 w-full" onSubmit={loginSubmit}>
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-surface-2" htmlFor="input-type-email">Email</Label>
            <Input
              className="rounded-2xl border border-veloura-border/30 bg-veloura-surface/95 text-veloura-text shadow-inner shadow-black/10 transition focus-within:border-veloura-accent focus-within:ring-2 focus-within:ring-veloura-accent/35"
              id="input-type-email"
              name="email"
              value={loginData.email}
              onChange={getLoginData}
              placeholder="jane@example.com"
              type="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-surface-2" htmlFor="input-type-password">Password</Label>
           <div className="space-y-2">
             <Input
              className="rounded-2xl border border-veloura-border/30 bg-veloura-surface/95 text-veloura-text shadow-inner shadow-black/10 transition focus-within:border-veloura-accent focus-within:ring-2 focus-within:ring-veloura-accent/35"
              id="input-type-password"
              name="password"
              value={loginData.password}
              onChange={getLoginData}
              placeholder="**********"
              type={showPassword ? 'text' : 'password' }
              
            />

            <button onClick={() =>  setShowPassword(!showPassword)}  >{showPassword ? <Eye></Eye> : <EyeOff></EyeOff>}</button>

           </div>
          </div>

          <ButtonPrimary
            type="submit"
            classname="mt-3 flex h-12 w-full rounded-full border border-veloura-accent/40 bg-veloura-accent font-semibold tracking-[0.18em] text-veloura-text shadow-lg shadow-black/30 transition-all duration-200 hover:scale-[0.98] hover:bg-veloura-surface-offset hover:shadow-veloura-accent/20 active:scale-95"
            label="SIGN IN"
            // El submit real vive en el form; antes solo devolvias la funcion sin ejecutarla.
            onClick={() => {}}
          />
        </div>
      </form>

      {errorFrontend && <p className="mt-4 text-center text-sm text-red-200">{errorFrontend}</p>}
      {errorLogin && <p className="mt-4 text-center text-sm text-red-200">{errorLogin}</p>}

      <div className="mt-6 flex inline-block space-x-1 text-sm text-veloura-surface-2/75">
        <span>Don't you have an account yet?</span>
        <span
          className="cursor-pointer font-semibold text-veloura-accent transition hover:text-veloura-surface"
          onClick={() => setModeAuth()}
        >
          Register
        </span>
      </div>

      {alertErrorState && <AlertError title="something went wrong with the log in" />}
    </div>
  )
}
