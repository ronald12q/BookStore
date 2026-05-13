import { useState, type ChangeEvent, type FormEvent } from "react";
import { Label, Input } from "@heroui/react";
import type { AuthFormInterface } from "../utilities/authInterface";
import type { registerInterface } from "../utilities/authInterface";
import { RegisterHook } from "../hooks/registerAuthHook";
import { ButtonPrimary } from "./ui/bottonFirt";

export const RegisterForm = ({ setModeAuth, onSuccess }: AuthFormInterface) => {
  const [errorFrontend, setErrorFrontend] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState<registerInterface>({
    name: '',
    email: '',
    password: ''
  });

  const { requestRegisterApi, errorRegister } = RegisterHook();

  const RegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorFrontend(null);

    if (!registerData.name || !registerData.email || !registerData.password) {
      setErrorFrontend('all field must be fill');
      return;
    }

    if (!registerData.email.includes('@')) {
      setErrorFrontend('the structure of the email is not correct');
      return;
    }

    if (registerData.password.length < 8) {
      setErrorFrontend('password need almost 8 characters');
      return;
    }

    if (registerData.password.includes('123')) {
      setErrorFrontend('pattern 123 is insecure please try with other combination');
      return;
    }

    const isSuccess = await requestRegisterApi(registerData);
    if (!isSuccess) return;

    setRegisterData({ name: '', email: '', password: '' });
    onSuccess();
  }

  const getRegisterData = (e: ChangeEvent<HTMLInputElement>) => {
    // El input debe guardar un string; con [e.target.value] estabas guardando un array.
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  }

  return (
    <div className="relative isolate flex w-[min(92vw,31rem)] flex-col items-center overflow-hidden rounded-[2rem] border border-veloura-accent/25 bg-linear-to-br from-[#120c0a]/85 via-[#24130f]/75 to-[#090605]/90 px-8 py-10 shadow-2xl shadow-black/70 backdrop-blur-3xl sm:px-14 sm:py-14">
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <div className="absolute -top-24 right-[-4rem] -z-10 size-56 rounded-full bg-veloura-accent/12 blur-3xl" />
      <div className="absolute -bottom-28 left-[-5rem] -z-10 size-64 rounded-full bg-veloura-primary/35 blur-3xl" />

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.45em] text-veloura-accent/80">New Chapter</p>
      <h1 className="font-display text-6xl font-bold text-veloura-surface drop-shadow-sm">Register</h1>
      <p className="mt-3 max-w-sm text-center text-sm leading-6 text-veloura-surface-2/70">Create your account and start building a shelf wrapped in coffee, cream and shadows.</p>

      <form className="mt-9 w-full" onSubmit={RegisterSubmit}>
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-surface-2" htmlFor="input-type-email">Email</Label>
            <Input
              className="rounded-2xl border border-veloura-border/30 bg-veloura-surface/95 text-veloura-text shadow-inner shadow-black/10 transition focus-within:border-veloura-accent focus-within:ring-2 focus-within:ring-veloura-accent/35"
              id="input-type-email"
              name="email"
              value={registerData.email}
              onChange={getRegisterData}
              placeholder="jane@example.com"
              type="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-surface-2" htmlFor="input-type-username">Username</Label>
            <Input
              className="rounded-2xl border border-veloura-border/30 bg-veloura-surface/95 text-veloura-text shadow-inner shadow-black/10 transition focus-within:border-veloura-accent focus-within:ring-2 focus-within:ring-veloura-accent/35"
              id="input-type-username"
              name="name"
              value={registerData.name}
              onChange={getRegisterData}
              placeholder="John Doe"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-surface-2" htmlFor="input-type-password">Password</Label>
            <Input
              className="rounded-2xl border border-veloura-border/30 bg-veloura-surface/95 text-veloura-text shadow-inner shadow-black/10 transition focus-within:border-veloura-accent focus-within:ring-2 focus-within:ring-veloura-accent/35"
              id="input-type-password"
              name="password"
              value={registerData.password}
              onChange={getRegisterData}
              placeholder="••••••••"
              type="password"
            />
          </div>

          <ButtonPrimary
            type="submit"
            classname="mt-3 flex h-12 w-full rounded-full border border-veloura-accent/40 bg-veloura-accent font-semibold tracking-[0.18em] text-veloura-text shadow-lg shadow-black/30 transition-all duration-200 hover:scale-[0.98] hover:bg-veloura-surface-offset hover:shadow-veloura-accent/20 active:scale-95"
            label="CREATE ACCOUNT"
            // El submit real vive en el form; antes solo devolvias la funcion sin ejecutarla.
            onClick={() => {}}
          />
        </div>
      </form>

      {errorFrontend && <p className="mt-4 text-center text-sm text-red-200">{errorFrontend}</p>}
      {errorRegister && <p className="mt-4 text-center text-sm text-red-200">{errorRegister}</p>}

      <div className="mt-6 flex inline-block space-x-1 text-sm text-veloura-surface-2/75">
        <span>Do you already have an account?</span>
        <span
          className="cursor-pointer font-semibold text-veloura-accent transition hover:text-veloura-surface"
          onClick={() => setModeAuth()}
        >
          Login
        </span>
      </div>
    </div>
  )
}
