import { SearchForm } from "./ui/SearchForm";
import {  Button } from "@heroui/react";
import { ShoppingCart, BookOpen, LogIn, LogOut, Package, LayoutDashboard } from "lucide-react";
import { ModalComponent } from "./modal";
import { useEffect, useRef, useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { authStore } from "../store/authStore";
import { LoginForm } from "./loginForm";
import { useNavigate } from "react-router-dom";
import { SidebarComponent } from "./sidebarcomponent";

type modeAuth = 'login' | 'register';

export const Navbar = () => {
  const {User, logOut, authModal, setAuthModal} = authStore();
  const [authMode, setAuthMode] = useState<modeAuth>('login');
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [sideBar, setSideBar] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  const sideBarMode = () => {
    setSideBar(false);
  }

  const userInitials = User?.user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join('') || 'U';

  const handleLogOut = () => {
    setTimeout(() => {
      logOut();
    setUserMenuOpen(false);
    navigate('/');
    window.location.reload();
    }, 800)


  }

  const handleShopNow = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('books')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  useEffect(() => {
    const closeUserMenu = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeUserMenu);
    return () => document.removeEventListener('mousedown', closeUserMenu);
  }, []);

  
  return (
    <div className="sticky top-0 z-50 w-full border-b border-veloura-border/20 bg-[#141210]/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-5">
          
          <div className="flex shrink-0 items-center gap-2">
            <BookOpen className="text-veloura-accent size-8 items-center flex "/>
            <p className="font-display text-3xl font-bold text-veloura-accent sm:text-4xl">
              Raven Brand
            </p>
          </div>

          <div className="flex flex-1 justify-center">
            <SearchForm />
          </div>

          <div className="flex shrink-0 items-center gap-6">
           {User === null ? (
  <>
    <div className="flex items-center justify-center cursor-pointer rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 border border-veloura-surface-offset/40 size-12">
      <LogIn onClick={() => setAuthModal(true)} className="text-veloura-accent" />
    </div>

    <ModalComponent isOpen={authModal} onOpenChange={setAuthModal} >
      {authMode === 'login' ? (
        <LoginForm setModeAuth={() => setAuthMode('register')} onSuccess={() => setAuthModal(false)} />
      ) : (
        <RegisterForm setModeAuth={() => setAuthMode('login')} onSuccess={() => setAuthModal(false)} />
      )}
    </ModalComponent>
  </>
) : (
  <div ref={userMenuRef} className="relative">
    <button
      type="button"
      onClick={() => setUserMenuOpen(!userMenuOpen)}
      className="flex size-12 items-center justify-center rounded-full border border-veloura-accent/40 bg-linear-to-br from-veloura-accent to-veloura-primary text-sm font-bold text-veloura-text shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-105 active:scale-95"
      aria-label="Open user menu"
    >
      {userInitials}
    </button>

    {userMenuOpen && (
      <div className="absolute right-0 top-16 w-72 overflow-hidden rounded-[1.5rem] border border-veloura-accent/20 bg-[#120c0a]/90 p-4 text-veloura-surface shadow-2xl shadow-black/60 backdrop-blur-3xl">
        <div className="flex items-center gap-3 border-b border-veloura-border/15 pb-4">
          <div className="flex size-11 items-center justify-center rounded-full bg-veloura-accent text-sm font-bold text-veloura-text">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-veloura-surface">{User.user.name}</p>
            <p className="truncate text-xs text-veloura-surface-2/55">{User.user.email}</p>
          </div>
        </div>

        <div className="py-4">
          <span className="rounded-full border border-veloura-accent/20 bg-veloura-accent/10 px-3 py-1 text-xs font-semibold text-veloura-accent">
            {User.user.role}
          </span>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => { setUserMenuOpen(false); navigate('/my-orders'); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-veloura-surface-2 transition hover:bg-white/5"
          >
            <Package className="size-4" />
            My Orders
          </button>
          {User.user.role === 'ADMIN' && (
            <button
              type="button"
              onClick={() => { setUserMenuOpen(false); navigate('/admin'); }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-veloura-surface-2 transition hover:bg-white/5"
            >
              <LayoutDashboard className="size-4" />
              Admin Dashboard
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogOut}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300/15 bg-red-950/30 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-900/45"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    )}
  </div>
)}
            

            <Button onClick={() => setSideBar(true)}
              isIconOnly
              className="transition-transform duration-200 active:scale-95 hover:scale-105 size-12 rounded-full border border-veloura-border/40 bg-transparent hover:bg-white/5"
            >
              <ShoppingCart className="size-5 text-veloura-accent " />
            </Button>

            <SidebarComponent isOpen={sideBar} setOpen={sideBarMode} ></SidebarComponent>


            <Button onClick={handleShopNow} className=" transition-transform duration-200 active:scale-95 hover:scale-105 w-32 rounded-full bg-veloura-primary text-veloura-accent hover:bg-veloura-primary-hover">
              Shop now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
