import { Link, useSearchParams } from "react-router-dom";

export const Checkout = () => {
	const [searchParams] = useSearchParams();
	const bookId = searchParams.get("book") ?? "sin libro";

	return (
		<section className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col justify-center px-6 py-16 text-veloura-surface-2">
			<h1 className="mb-3 font-display text-5xl">Checkout</h1>
			<p className="mb-8 text-lg text-veloura-surface-offset/85">
				Libro seleccionado para carrito: <span className="font-semibold text-veloura-accent">{bookId}</span>
			</p>

			<Link
				to="/"
				className="w-fit rounded-full border border-veloura-border/60 px-5 py-2 text-sm font-semibold uppercase tracking-wide transition hover:border-veloura-accent hover:text-veloura-accent"
			>
				Volver al inicio
			</Link>
		</section>
	);
};
