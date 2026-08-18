
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../utilities/bookInterface";
import { CreateCartItem } from "../hooks/createCartItemHook";




type CarouselProps = {
    items: Book[];
};

export const Carousel = ({ items }: CarouselProps) => {
    const [current, setCurrent] = useState(0);
    const {requestCreateCartItem } = CreateCartItem();

    if (items.length === 0) {
        return (
            <section className="relative min-h-screen overflow-hidden text-veloura-surface-2">
                <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                    <p className="text-xl text-veloura-surface-offset/80">No books to show.</p>
                </div>
            </section>
        );
    }

    const next = () => {
        setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const goTo = (index: number) => {
        setCurrent(index);
    };

    const activeItem = items[current];

    return (
        <section className="relative min-h-screen overflow-hidden text-veloura-surface-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,60,20,0.35),transparent_48%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.4),rgba(0,0,0,0.08))]" />

            <button
                type="button"
                onClick={prev}
                aria-label="Previous book"
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-veloura-border/40 bg-black/30 px-4 py-3 text-2xl font-bold text-veloura-surface-2 transition hover:scale-105 hover:bg-black/45"
            >
                ←
            </button>
            <button
                type="button"
                onClick={next}
                aria-label="Next book"
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-veloura-border/40 bg-black/30 px-4 py-3 text-2xl font-bold text-veloura-surface-2 transition hover:scale-105 hover:bg-black/45"
            >
                →
            </button>

            <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10 lg:px-16">
                <div className="max-w-xl">
                    <span className="mb-5 inline-flex rounded-full border border-veloura-border/40 bg-veloura-primary/40 px-4 py-1 text-sm tracking-wider text-veloura-surface-2">
                        {activeItem.category?.name}
                    </span>

                    <h1 className="mb-2 font-display text-5xl font-bold leading-none md:text-6xl">{activeItem.title}</h1>
                    <p className="mb-6 text-2xl text-veloura-surface-2/85">{activeItem.author}</p>
                    <p className="mb-8 max-w-lg leading-8 text-base text-veloura-surface-offset/85">{activeItem.description}</p>

                    <p className="mb-8 text-3xl font-semibold text-veloura-accent">${activeItem.price.toFixed(2)}</p>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => requestCreateCartItem(activeItem.id)}
                            className="rounded-full border border-veloura-accent bg-veloura-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-veloura-text transition hover:scale-105 hover:bg-[#d6b17b]"
                        >
                            Add to cart
                        </button>
                        <Link
                            to={`/book/${activeItem.slug}`}
                            className="rounded-full border border-veloura-border/60 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-veloura-surface-2 transition hover:scale-105 hover:border-veloura-accent hover:text-veloura-accent"
                        >
                            View details
                        </Link>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-md">
                      <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle,rgba(198,161,106,0.28),transparent_70%)]" />
                    <img
                        src={activeItem.imageUrl}
                        alt={`Cover of ${activeItem.title}`}
                        className="relative z-10 h-140 w-full rounded-[2rem] border border-veloura-border/50 object-cover shadow-2xl"
                    />
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-veloura-border/35 bg-black/30 px-4 py-2">
                {items.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => goTo(index)}
                        aria-label={`Go to book ${index + 1}`}
                        className={`h-3 w-3 rounded-full transition ${
                            current === index ? "scale-125 bg-veloura-accent" : "bg-veloura-surface-offset/70 hover:bg-veloura-surface-2"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
};
