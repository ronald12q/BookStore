import { useNavigate, useParams } from "react-router-dom";
import { useBookStore } from "../store/bookStore";
import type { Book } from "../utilities/bookInterface";
import { ReviewSection } from "../components/ReviewSection";
import { CreateCartItem } from "../hooks/createCartItemHook";

export const BookDetails = () => {
	const { slug } = useParams();
	const navigate = useNavigate();

	const {allBooks, category} = useBookStore();
	const { requestCreateCartItem } = CreateCartItem();

	const current : Book | undefined = allBooks.find(book => book.slug === slug); 
	const categoryName = current ? (current.category?.name ?? category.find((item) => item.id === current.categoryId)?.name) : undefined;

	if (!current) {
		return (
			<main className="min-h-screen bg-[#141210] px-4 py-10 text-veloura-surface-2 sm:px-6 lg:px-8">
				<div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center rounded-[2rem] border border-[#3b332d] bg-[radial-gradient(circle_at_top,rgba(198,161,106,0.12),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))] p-8 text-center shadow-2xl">
					<div className="max-w-md">
						<p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Book details</p>
						<h1 className="mt-4 text-3xl font-semibold text-veloura-accent">Book not found</h1>
						<p className="mt-3 text-sm leading-6 text-veloura-inverse/65">The selected book is not available right now.</p>
						<button
							type="button"
							onClick={() => navigate("/")}
							className="mt-8 rounded-full bg-veloura-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-veloura-text transition hover:bg-[#d6b17b]"
						>
							Back to home
						</button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#141210] px-4 py-10 text-veloura-surface-2 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
					<div>
						<p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Book details</p>
						<h1 className="mt-3 text-3xl font-semibold tracking-tight text-veloura-accent sm:text-5xl">{current.title}</h1>
					</div>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="rounded-full border border-[#5a4e44] bg-black/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-veloura-accent transition hover:border-[#8a786a] hover:bg-white/5"
					>
						Back to home
					</button>
				</div>

				<div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
					<div className="space-y-8">
						<div className="relative mx-auto max-w-[26rem] overflow-hidden rounded-[2rem] border-2 border-[#3b332d] bg-black/20 shadow-2xl">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,161,106,0.14),transparent_45%)]" />
							<div className="relative p-4">
								<img
									src={current.imageUrl}
									alt={current.title}
									className="block aspect-[3/4] w-full rounded-[1.5rem] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
								/>
							<div className="absolute left-8 top-8 rounded-full border border-[#5a4e44] bg-[#141210]/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-veloura-accent backdrop-blur-md">
									{categoryName ?? "No category"}
								</div>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							<div className="rounded-3xl border border-[#3b332d] bg-[#1b1714] p-5">
								<p className="text-[11px] uppercase tracking-[0.22em] text-veloura-inverse/45">Price</p>
								<p className="mt-3 text-2xl font-semibold text-veloura-accent">${current.price.toFixed(2)}</p>
							</div>
							<div className="rounded-3xl border border-[#3b332d] bg-[#1b1714] p-5">
								<p className="text-[11px] uppercase tracking-[0.22em] text-veloura-inverse/45">Stock</p>
								<p className="mt-3 text-2xl font-semibold text-veloura-surface-2">{current.stock}</p>
							</div>
							<div className="rounded-3xl border border-[#3b332d] bg-[#1b1714] p-5">
								<p className="text-[11px] uppercase tracking-[0.22em] text-veloura-inverse/45">Status</p>
								<p className="mt-3 text-2xl font-semibold text-veloura-surface-2">{current.published ? "Available" : "Draft"}</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col rounded-[2rem] border border-[#3b332d] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))] p-7 shadow-2xl">
						<div className="border-b border-white/10 pb-6">
							<p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Overview</p>
							<p className="mt-4 text-2xl font-medium text-veloura-surface-2">{current.author}</p>
							<p className="mt-5 max-w-2xl text-sm leading-7 text-veloura-inverse/70 sm:text-base">
								{current.description}
							</p>
						</div>

						<div className="grid gap-4 py-6 sm:grid-cols-2">
							<div className="rounded-2xl border border-white/5 bg-white/5 p-4">
								<p className="text-[11px] uppercase tracking-[0.2em] text-veloura-inverse/45">Availability</p>
								<p className="mt-2 text-sm font-medium text-veloura-surface-2">{current.published ? "Available now" : "Coming soon"}</p>
							</div>
							<div className="rounded-2xl border border-white/5 bg-white/5 p-4">
								<p className="text-[11px] uppercase tracking-[0.2em] text-veloura-inverse/45">ISBN</p>
								<p className="mt-2 text-sm text-veloura-surface-2">{current.isbn ?? "Not provided"}</p>
							</div>
						</div>

						<div className="mt-auto space-y-4 border-t border-white/10 pt-6">
							<div className="rounded-2xl border border-[#3b332d] bg-[#1b1714] p-4">
								<div className="flex items-center justify-between text-sm text-veloura-inverse/65">
									<span>Current price</span>
									<span className="text-lg font-semibold text-veloura-accent">${current.price.toFixed(2)}</span>
								</div>
								<div className="mt-3 flex items-center justify-between text-sm text-veloura-inverse/65">
									<span>Stock left</span>
									<span>{current.stock}</span>
								</div>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<button
									type="button"
									onClick={() => requestCreateCartItem(current.id)}
									className="flex-1 rounded-full bg-veloura-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-veloura-text transition hover:bg-[#d6b17b]"
								>
									Add to cart
								</button>
								<button
									type="button"
									onClick={() => navigate("/")}
									className="flex-1 rounded-full border border-[#5a4e44] bg-transparent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-veloura-accent transition hover:border-[#8a786a] hover:bg-white/5"
								>
									Back to home
								</button>
							</div>
						</div>
					</div>
				</div>

				<ReviewSection bookId={current.id} />
			</div>
		</main>
	);
};
