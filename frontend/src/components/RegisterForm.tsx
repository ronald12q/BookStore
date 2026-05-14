import { useState, type ChangeEvent, type FormEvent } from "react";
import { Label, Input } from "@heroui/react";
import type { AuthFormInterface } from "../utilities/authInterface";
import type { registerInterface } from "../utilities/authInterface";
import { RegisterHook } from "../hooks/registerAuthHook";
import { ButtonPrimary } from "./ui/bottonFirt";
import { Eye, EyeOff } from "lucide-react";
export const RegisterForm = ({ setModeAuth, onSuccess }: AuthFormInterface) => {
  const [errorFrontend, setErrorFrontend] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState<registerInterface>({
    name: '',
    email: '',
    password: ''
  });

  const { requestRegisterApi, errorRegister } = RegisterHook();
  const [showpassWord, setShowPassoword] = useState<boolean>(false);

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
   
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  }

  return (
    <div className="relative w-[min(92vw,28rem)] overflow-hidden rounded-[1.75rem] border-2 border-[#3b332d] bg-[#141210] p-6 text-veloura-surface shadow-2xl shadow-black/45 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-veloura-accent via-[#d6b17b] to-veloura-primary" />

      <div className="space-y-2 border-b border-[#3b332d] pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-veloura-accent/80">New Chapter</p>
        <h1 className="font-display text-4xl font-bold text-veloura-accent">Register</h1>
        <p className="max-w-sm text-sm leading-6 text-veloura-inverse/65">Create your account and start your shelf.</p>
      </div>

      <form className="mt-6 w-full" onSubmit={RegisterSubmit}>
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-inverse/75" htmlFor="input-type-email">Email</Label>
            <Input
              className="rounded-2xl border border-[#3b332d] bg-[#1b1714] px-4 py-3 text-veloura-surface-2 shadow-none outline-none transition placeholder:text-veloura-inverse/35 focus-within:border-veloura-accent focus-within:ring-1 focus-within:ring-veloura-accent/25"
              id="input-type-email"
              name="email"
              value={registerData.email}
              onChange={getRegisterData}
              placeholder="jane@example.com"
              type="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-inverse/75" htmlFor="input-type-username">Username</Label>
            <Input
              className="rounded-2xl border border-[#3b332d] bg-[#1b1714] px-4 py-3 text-veloura-surface-2 shadow-none outline-none transition placeholder:text-veloura-inverse/35 focus-within:border-veloura-accent focus-within:ring-1 focus-within:ring-veloura-accent/25"
              id="input-type-username"
              name="name"
              value={registerData.name}
              onChange={getRegisterData}
              placeholder="John Doe"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-veloura-inverse/75" htmlFor="input-type-password">Password</Label>
            <div className="relative">
              <input
                className="h-12 w-full rounded-2xl border border-[#3b332d] bg-[#1b1714] px-4 pr-12 text-sm text-veloura-surface-2 outline-none transition placeholder:text-veloura-inverse/35 focus:border-veloura-accent focus:ring-1 focus:ring-veloura-accent/25"
                id="input-type-password"
                name="password"
                value={registerData.password}
                onChange={getRegisterData}
                placeholder="••••••••"
                type={showpassWord ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={() => setShowPassoword(!showpassWord)}
                aria-label={showpassWord ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#3b332d] bg-[#141210] text-veloura-inverse/55 transition hover:border-veloura-accent/40 hover:text-veloura-accent"
              >
                {showpassWord ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <ButtonPrimary
            type="submit"
            classname="mt-2 flex h-12 w-full rounded-full border border-veloura-accent/30 bg-veloura-accent font-semibold tracking-[0.16em] text-veloura-text shadow-md shadow-black/25 transition hover:bg-[#d4b37a] active:scale-[0.99]"
            label="CREATE ACCOUNT"
            onClick={() => {}}
          />
        </div>
      </form>

      {errorFrontend && <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-100">{errorFrontend}</p>}
      {errorRegister && <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-100">{errorRegister}</p>}

      <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-veloura-inverse/70">
        <span>Already have an account?</span>
        <button
          type="button"
          className="font-semibold text-veloura-accent transition hover:text-veloura-surface"
          onClick={() => setModeAuth()}
        >
          Login
        </button>
      </div>
    </div>
  )
}
