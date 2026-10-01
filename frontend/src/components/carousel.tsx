
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../utilities/bookInterface";
import { CreateCartItem } from "../hooks/createCartItemHook";

const AUTOSCROLL_MS = 6000;

type CarouselProps = {
    items: Book[];
};

export const Carousel = ({ items }: CarouselProps) => {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const {requestCreateCartItem } = CreateCartItem();

    // Refs to keep interval/animation state stable across renders
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── auto-scroll logic ────────────────────────────────────────────────

    const clearTimers = useCallback(() => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
    }, []);

    const startTimers = useCallback(() => {
        clearTimers();
        setProgress(0);

        // Progress bar ticks every 50ms for a smooth fill
        const tick = 50;
        progressRef.current = setInterval(() => {
            setProgress((prev) => Math.min(prev + (tick / AUTOSCROLL_MS) * 100, 100));
        }, tick);

        // Advance slide after AUTOSCROLL_MS
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
            setProgress(0);
        }, AUTOSCROLL_MS);
    }, [items.length, clearTimers]);

    useEffect(() => {
        if (!paused && items.length > 1) {
            startTimers();
        } else {
            clearTimers();
            setProgress(0);
        }
        return clearTimers;
    }, [paused, items.length, startTimers, clearTimers]);

    // Reset progress whenever the current slide changes (manual or auto)
    useEffect(() => {
        setProgress(0);
    }, [current]);

    // ── navigation handlers ──────────────────────────────────────────────

    const next = () => {
        setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
        if (!paused) startTimers(); // restart timer on manual nav
    };

    const prev = () => {
        setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
        if (!paused) startTimers();
    };

    const goTo = (index: number) => {
        setCurrent(index);
        if (!paused) startTimers();
    };

    // ── render ───────────────────────────────────────────────────────────

    if (items.length === 0) {
        return (
            <section className="relative min-h-screen overflow-hidden text-veloura-surface-2">
                <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                    <p className="text-xl text-veloura-surface-offset/80">No books to show.</p>
                </div>
            </section>
        );
    }

    const activeItem = items[current];

    return (
        <section
            className="relative min-h-screen overflow-hidden text-veloura-surface-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
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

            {/* Dot indicators with progress bar */}
            <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-veloura-border/35 bg-black/30 px-4 py-2">
                {items.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => goTo(index)}
                        aria-label={`Go to book ${index + 1}`}
                        className={`relative h-3 overflow-hidden rounded-full transition-all duration-300 ${
                            current === index ? "w-8 bg-veloura-accent/30" : "w-3 bg-veloura-surface-offset/70 hover:bg-veloura-surface-2"
                        }`}
                    >
                        {current === index && (
                            <span
                                className="absolute inset-y-0 left-0 rounded-full bg-veloura-accent transition-[width] duration-75"
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
};
