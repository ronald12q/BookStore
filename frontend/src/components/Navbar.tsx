import { SearchForm } from "./ui/SearchForm";
import { Avatar, Button } from "@heroui/react";
import { ShoppingCart } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-veloura-border shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-6xs px-4">
        <div className="flex p-4 items-center justify-between gap-4">
          
          <div className="flex shrink-0 items-center gap-2">
            <img
              className="size-14"
              src="/src/assets/logo.svg"
              alt="logo tienda"
            />
            <p className="font-display text-4xl font-bold text-veloura-accent">
              Raven Brand
            </p>
          </div>

          <div className="flex flex-1 justify-center">
            <SearchForm />
          </div>

          <div className="flex shrink-0 items-center gap-4 ">
            <div className="flex items-center gap-2 rounded-full hover:scale-95 border border-veloura-border px-6 py-2 text-veloura-surface-2">
              <Avatar>
                <Avatar.Fallback className="size-10 bg-veloura-primary text-base font-semibold text-veloura-accent">
                  AC
                </Avatar.Fallback>
              </Avatar>
              <span className="text-sm font-medium">Profile</span>
            </div>

            <Button
              isIconOnly
              className="size-12 rounded-full border border-veloura-border bg-transparent hover:bg-white/5"
            >
              <ShoppingCart className="size-5 text-veloura-accent" />
            </Button>

            <Button className="w-32 rounded-full bg-veloura-primary text-veloura-accent hover:bg-veloura-primary-hover">
              Shop now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};