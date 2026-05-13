import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  BarChart3,
  BookOpen,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Edit3,
  LayoutDashboard,
  LogOut,
  Plus,
  ShieldCheck,
  Tags,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBookStore } from "../store/bookStore";
import { authStore } from "../store/authStore";
import { getBooksHook } from "../hooks/getBookHook";
import { getCategoryHook } from "../hooks/getCategoryHooks";
import { createBookHook } from "../hooks/createBookHook";
import { updateBookHook } from "../hooks/updateBookHook";
import { deleteBookHook } from "../hooks/deleteBookHook";
import { createCategoryHook } from "../hooks/createCategoryHook";
import { deleteCategoryHook } from "../hooks/deleteCategoryHook";
import { getAllOrdersHook } from "../hooks/getAllOrdersHook";
import { updateOrderStatusHook } from "../hooks/updateOrderStatusHook";
import type { Book } from "../utilities/bookInterface";

type DashboardSection = "Overview" | "Books" | "Categories" | "Orders" | "Inventory";
type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type AdminOrder = {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
};

type BookFormState = {
  title: string;
  slug: string;
  author: string;
  description: string;
  price: string;
  stock: string;
  isbn: string;
  categoryId: string;
};

const emptyBookForm: BookFormState = {
  title: "",
  slug: "",
  author: "",
  description: "",
  price: "",
  stock: "",
  isbn: "",
  categoryId: "",
};

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Books", icon: BookOpen },
  { label: "Categories", icon: Tags },
  { label: "Orders", icon: Truck },
  { label: "Inventory", icon: Boxes },
] as const;

const orderStatuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const formatCurrency = (value: number) => `$${Number(value || 0).toFixed(2)}`;

const createSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<DashboardSection>("Overview");
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookForm, setBookForm] = useState<BookFormState>(emptyBookForm);
  const [bookImage, setBookImage] = useState<File | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { User, logOut } = authStore();
  const { allBooks, category } = useBookStore();
  const { getApiBook, loading: loadingBooks, error: getBooksError } = getBooksHook();
  const { getApiCategory, loading: loadingCategories, error: getCategoriesError } = getCategoryHook();
  const { createBook, loading: creatingBook, error: createBookError } = createBookHook();
  const { updateBook, loading: updatingBook, error: updateBookError } = updateBookHook();
  const { deleteBook, loading: deletingBook, error: deleteBookError } = deleteBookHook();
  const { createCategory, loading: creatingCategory, error: createCategoryError } = createCategoryHook();
  const { deleteCategory, loading: deletingCategory, error: deleteCategoryError } = deleteCategoryHook();
  const { getAllOrders, loading: loadingOrders, error: getOrdersError, orders } = getAllOrdersHook();
  const { updateOrderStatus, loading: updatingOrder, error: updateOrderError } = updateOrderStatusHook();

  const adminOrders = (orders ?? []) as AdminOrder[];
  const pendingOrders = adminOrders.filter((order) => order.status === "PENDING").length;
  const lowStockBooks = allBooks.filter((book) => book.stock <= 5).length;
  const totalRevenue = adminOrders.reduce((total, order) => total + Number(order.total || 0), 0);
  const dashboardError = getBooksError || getCategoriesError || createBookError || updateBookError || deleteBookError || createCategoryError || deleteCategoryError || getOrdersError || updateOrderError;

  const stats = [
    { label: "Total Books", value: String(allBooks.length), detail: `${lowStockBooks} low stock`, icon: BookOpen },
    { label: "Categories", value: String(category.length), detail: "Organized shelves", icon: Tags },
    { label: "Orders", value: String(adminOrders.length), detail: `${pendingOrders} pending`, icon: ClipboardList },
    { label: "Revenue", value: formatCurrency(totalRevenue), detail: "Total orders", icon: CircleDollarSign },
  ];

  const adminInitials = User?.user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("") || "A";

  useEffect(() => {
    getApiBook();
    getApiCategory();
    getAllOrders();
  }, []);

  const refreshDashboard = async () => {
    await getApiBook();
    await getApiCategory();
    await getAllOrders();
  };

  const handleAdminLogOut = () => {
    logOut();
    navigate("");
  };

  const handleBookInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && !editingBook ? { slug: createSlug(value) } : {}),
    }));
  };

  const openCreateBookForm = () => {
    setEditingBook(null);
    setBookForm({ ...emptyBookForm, categoryId: category[0]?.id ?? "" });
    setBookImage(null);
    setBookFormOpen(true);
    setActiveSection("Books");
  };

  const openEditBookForm = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      slug: book.slug,
      author: book.author,
      description: book.description,
      price: String(book.price),
      stock: String(book.stock),
      isbn: book.isbn ?? "",
      categoryId: book.categoryId,
    });
    setBookImage(null);
    setBookFormOpen(true);
    setActiveSection("Books");
  };

  const closeBookForm = () => {
    setBookFormOpen(false);
    setEditingBook(null);
    setBookForm(emptyBookForm);
    setBookImage(null);
  };

  const handleSubmitBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (editingBook) {
      const result = await updateBook(editingBook.id, bookForm);
      if (!result) return;

      setMessage("Book updated successfully");
      closeBookForm();
      await getApiBook();
      return;
    }

    if (!bookImage) {
      setMessage("Book image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", bookForm.title);
    formData.append("slug", bookForm.slug);
    formData.append("author", bookForm.author);
    formData.append("description", bookForm.description);
    formData.append("price", bookForm.price);
    formData.append("stock", bookForm.stock);
    formData.append("isbn", bookForm.isbn);
    formData.append("categoryId", bookForm.categoryId);
    formData.append("image", bookImage);

    const result = await createBook(formData);
    if (!result) return;

    setMessage("Book created successfully");
    closeBookForm();
    await getApiBook();
  };

  const handleDeleteBook = async (bookId: string) => {
    const shouldDelete = window.confirm("Delete this book?");
    if (!shouldDelete) return;

    const result = await deleteBook(bookId);
    if (!result) return;

    setMessage("Book deleted successfully");
    await getApiBook();
  };

  const handleCreateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const finalSlug = categorySlug || createSlug(categoryName);
    const result = await createCategory(categoryName, finalSlug);
    if (!result) return;

    setCategoryName("");
    setCategorySlug("");
    setMessage("Category created successfully");
    await getApiCategory();
  };

  const handleDeleteCategory = async (id: string) => {
    const shouldDelete = window.confirm("Delete this category? It must be empty.");
    if (!shouldDelete) return;

    const result = await deleteCategory(id);
    if (!result) return;

    setMessage("Category deleted successfully");
    await getApiCategory();
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    const result = await updateOrderStatus(id, status);
    if (!result) return;

    setMessage("Order status updated successfully");
    await getAllOrders();
  };

  const categoryNameById = (categoryId: string) => category.find((item) => item.id === categoryId)?.name ?? "No category";

  return (
    <div className="min-h-screen bg-[#0d0806] text-veloura-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-veloura-accent/15 bg-[#120c0a]/80 px-5 py-6 shadow-2xl shadow-black/60 backdrop-blur-3xl lg:flex lg:flex-col">
        <div className="rounded-[1.6rem] border border-veloura-accent/20 bg-veloura-surface/5 p-5 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-veloura-accent text-veloura-text shadow-lg shadow-veloura-accent/20">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-veloura-accent">Raven Admin</p>
              <p className="text-xs uppercase tracking-[0.28em] text-veloura-surface-2/50">Private Shelf</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.label;

            return (
              <button
                key={item.label}
                className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-veloura-accent/35 bg-veloura-accent/15 text-veloura-accent shadow-lg shadow-black/20"
                    : "border-transparent text-veloura-surface-2/65 hover:border-veloura-accent/15 hover:bg-veloura-surface/5 hover:text-veloura-surface"
                }`}
                type="button"
                onClick={() => setActiveSection(item.label)}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </span>
                <ChevronRight className="size-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            );
          })}
        </nav>

        <div className="rounded-[1.4rem] border border-veloura-border/10 bg-black/25 p-4">
          <p className="text-sm font-semibold text-veloura-surface">Admin access</p>
          <p className="mt-1 text-xs leading-5 text-veloura-surface-2/55">Only users with the ADMIN role should reach this room.</p>
        </div>
      </aside>

      <main className="lg:pl-72">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
          <header className="rounded-[2rem] border border-veloura-accent/15 bg-linear-to-br from-[#1a100c]/80 via-[#120c0a]/75 to-black/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-3xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-veloura-accent/70">Dashboard</p>
                <h1 className="mt-3 font-display text-4xl font-bold text-veloura-surface sm:text-5xl">Admin Control Room</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-veloura-surface-2/60">Manage the bookstore catalog, categories and orders from one dark coffee command center.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 rounded-full border border-veloura-accent/20 bg-black/25 px-3 py-2 shadow-lg shadow-black/20">
                  <div className="flex size-10 items-center justify-center rounded-full bg-veloura-accent text-sm font-bold text-veloura-text">
                    {adminInitials}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="max-w-36 truncate text-sm font-semibold text-veloura-surface">{User?.user.name ?? "Admin"}</p>
                    <p className="text-xs text-veloura-accent/70">{User?.user.role ?? "ADMIN"}</p>
                  </div>
                </div>
                <button onClick={openCreateBookForm} className="inline-flex items-center gap-2 rounded-full border border-veloura-accent/25 bg-veloura-accent px-5 py-3 text-sm font-semibold text-veloura-text shadow-lg shadow-black/30 transition hover:bg-veloura-surface-offset" type="button">
                  <Plus className="size-4" />
                  New Book
                </button>
                <button onClick={refreshDashboard} className="inline-flex items-center gap-2 rounded-full border border-veloura-border/15 bg-veloura-surface/5 px-5 py-3 text-sm font-semibold text-veloura-surface-2 transition hover:border-veloura-accent/30 hover:text-veloura-surface" type="button">
                  <BarChart3 className="size-4" />
                  Refresh
                </button>
                <button onClick={handleAdminLogOut} className="inline-flex items-center gap-2 rounded-full border border-red-300/15 bg-red-950/30 px-5 py-3 text-sm font-semibold text-red-100 shadow-lg shadow-black/30 transition hover:bg-red-900/45" type="button">
                  <LogOut className="size-4" />
                  Log out
                </button>
              </div>
            </div>
          </header>

          {(message || dashboardError) && (
            <div className={`rounded-2xl border px-5 py-4 text-sm ${dashboardError ? "border-red-300/20 bg-red-950/25 text-red-100" : "border-veloura-accent/20 bg-veloura-accent/10 text-veloura-accent"}`}>
              {dashboardError || message}
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article key={stat.label} className="rounded-[1.6rem] border border-veloura-accent/15 bg-veloura-surface/[0.04] p-5 shadow-xl shadow-black/25 backdrop-blur-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-veloura-surface-2/55">{stat.label}</p>
                      <p className="mt-3 font-display text-4xl font-bold text-veloura-surface">{stat.value}</p>
                    </div>
                    <div className="rounded-2xl bg-veloura-accent/15 p-3 text-veloura-accent">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-veloura-accent/60">{stat.detail}</p>
                </article>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <article className="rounded-[2rem] border border-veloura-accent/15 bg-[#140d0a]/70 p-5 shadow-2xl shadow-black/35 backdrop-blur-3xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-veloura-surface">Books Management</h2>
                  <p className="mt-1 text-sm text-veloura-surface-2/55">Create, edit and delete catalog books.</p>
                </div>
                <button onClick={openCreateBookForm} className="inline-flex items-center justify-center gap-2 rounded-full bg-veloura-accent px-4 py-2 text-sm font-semibold text-veloura-text transition hover:bg-veloura-surface-offset" type="button">
                  <Plus className="size-4" />
                  Create
                </button>
              </div>

              {bookFormOpen && (
                <form onSubmit={handleSubmitBook} className="mt-6 rounded-[1.5rem] border border-veloura-accent/15 bg-black/20 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold text-veloura-surface">{editingBook ? "Edit Book" : "Create Book"}</h3>
                    <button onClick={closeBookForm} type="button" className="rounded-full border border-veloura-border/15 p-2 text-veloura-surface-2 transition hover:text-veloura-accent">
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <input required name="title" value={bookForm.title} onChange={handleBookInput} placeholder="Title" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                    <input required name="slug" value={bookForm.slug} onChange={handleBookInput} placeholder="Slug" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                    <input required name="author" value={bookForm.author} onChange={handleBookInput} placeholder="Author" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                    <select required name="categoryId" value={bookForm.categoryId} onChange={handleBookInput} className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent">
                      <option value="">Select category</option>
                      {category.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                    <input required name="price" value={bookForm.price} onChange={handleBookInput} placeholder="Price" type="number" step="0.01" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                    <input required name="stock" value={bookForm.stock} onChange={handleBookInput} placeholder="Stock" type="number" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                    <input name="isbn" value={bookForm.isbn} onChange={handleBookInput} placeholder="ISBN optional" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                    {!editingBook && <input required type="file" accept="image/*" onChange={(e) => setBookImage(e.target.files?.[0] ?? null)} className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text file:mr-3 file:rounded-full file:border-0 file:bg-veloura-accent file:px-3 file:py-1 file:text-veloura-text" />}
                    <textarea required name="description" value={bookForm.description} onChange={handleBookInput} placeholder="Description" className="min-h-28 rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent md:col-span-2" />
                  </div>

                  <button disabled={creatingBook || updatingBook} type="submit" className="mt-4 rounded-full bg-veloura-accent px-5 py-3 text-sm font-semibold text-veloura-text transition hover:bg-veloura-surface-offset disabled:opacity-60">
                    {editingBook ? "Save changes" : "Create book"}
                  </button>
                </form>
              )}

              <div className="mt-6 overflow-x-auto rounded-[1.4rem] border border-veloura-border/10">
                <div className="min-w-[820px]">
                  <div className="grid grid-cols-[1.4fr_1fr_0.9fr_0.6fr_0.7fr_0.8fr] bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.18em] text-veloura-surface-2/45">
                    <span>Book</span>
                    <span>Author</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Stock</span>
                    <span>Actions</span>
                  </div>

                  {loadingBooks && <p className="border-t border-veloura-border/10 px-4 py-5 text-sm text-veloura-surface-2/60">Loading books...</p>}
                  {!loadingBooks && allBooks.length === 0 && <p className="border-t border-veloura-border/10 px-4 py-5 text-sm text-veloura-surface-2/60">No books found.</p>}
                  {allBooks.map((book) => (
                    <div key={book.id} className="grid grid-cols-[1.4fr_1fr_0.9fr_0.6fr_0.7fr_0.8fr] items-center border-t border-veloura-border/10 px-4 py-4 text-sm text-veloura-surface-2/75 transition hover:bg-veloura-surface/[0.03]">
                      <span className="font-semibold text-veloura-surface">{book.title}</span>
                      <span>{book.author}</span>
                      <span>{book.category?.name ?? categoryNameById(book.categoryId)}</span>
                      <span className="text-veloura-accent">{formatCurrency(book.price)}</span>
                      <span>{book.stock}</span>
                      <span className="flex gap-2">
                        <button onClick={() => openEditBookForm(book)} className="rounded-full border border-veloura-accent/20 p-2 text-veloura-accent transition hover:bg-veloura-accent/10" type="button">
                          <Edit3 className="size-4" />
                        </button>
                        <button disabled={deletingBook} onClick={() => handleDeleteBook(book.id)} className="rounded-full border border-red-300/15 p-2 text-red-200 transition hover:bg-red-950/30 disabled:opacity-60" type="button">
                          <Trash2 className="size-4" />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-veloura-accent/15 bg-[#140d0a]/70 p-5 shadow-2xl shadow-black/35 backdrop-blur-3xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl font-bold text-veloura-surface">Categories</h2>
                  <p className="mt-1 text-sm text-veloura-surface-2/55">Create shelves and remove empty ones.</p>
                </div>
              </div>

              <form onSubmit={handleCreateCategory} className="mt-6 grid gap-3 rounded-[1.4rem] border border-veloura-border/10 bg-black/20 p-4">
                <input required value={categoryName} onChange={(e) => { setCategoryName(e.target.value); if (!categorySlug) setCategorySlug(createSlug(e.target.value)); }} placeholder="Category name" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                <input required value={categorySlug} onChange={(e) => setCategorySlug(createSlug(e.target.value))} placeholder="category-slug" className="rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent" />
                <button disabled={creatingCategory} className="inline-flex items-center justify-center gap-2 rounded-full bg-veloura-accent px-4 py-3 text-sm font-semibold text-veloura-text transition hover:bg-veloura-surface-offset disabled:opacity-60" type="submit">
                  <Plus className="size-4" />
                  Create category
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {loadingCategories && <p className="text-sm text-veloura-surface-2/60">Loading categories...</p>}
                {!loadingCategories && category.length === 0 && <p className="text-sm text-veloura-surface-2/60">No categories found.</p>}
                {category.map((item) => {
                  const booksCount = allBooks.filter((book) => book.categoryId === item.id).length;

                  return (
                    <div key={item.id} className="rounded-2xl border border-veloura-border/10 bg-black/20 p-4 transition hover:border-veloura-accent/25">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-veloura-surface">{item.name}</p>
                          <p className="mt-1 text-xs text-veloura-surface-2/45">/{item.slug}</p>
                        </div>
                        <button disabled={deletingCategory} onClick={() => handleDeleteCategory(item.id)} className="rounded-full border border-red-300/15 p-2 text-red-200 transition hover:bg-red-950/30 disabled:opacity-60" type="button">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-veloura-accent/55">{booksCount} books</p>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>

          <section className="rounded-[2rem] border border-veloura-accent/15 bg-[#140d0a]/70 p-5 shadow-2xl shadow-black/35 backdrop-blur-3xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-veloura-surface">Recent Orders</h2>
                <p className="mt-1 text-sm text-veloura-surface-2/55">Review orders and update their status.</p>
              </div>
              <button onClick={getAllOrders} className="rounded-full border border-veloura-accent/20 px-4 py-2 text-sm font-semibold text-veloura-accent transition hover:bg-veloura-accent/10" type="button">Refresh orders</button>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {loadingOrders && <p className="text-sm text-veloura-surface-2/60">Loading orders...</p>}
              {!loadingOrders && adminOrders.length === 0 && <p className="text-sm text-veloura-surface-2/60">No orders found.</p>}
              {adminOrders.map((order) => (
                <div key={order.id} className="rounded-[1.4rem] border border-veloura-border/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-veloura-surface">{order.user?.name ?? "Unknown customer"}</p>
                      <p className="mt-1 text-xs text-veloura-surface-2/45">{order.user?.email ?? "No email"}</p>
                      <p className="mt-1 text-xs text-veloura-surface-2/45">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full border border-veloura-accent/20 bg-veloura-accent/10 px-3 py-1 text-xs font-semibold text-veloura-accent">{order.status}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-veloura-border/10 pt-4">
                    <span className="font-display text-2xl font-bold text-veloura-surface">{formatCurrency(order.total)}</span>
                    <select disabled={updatingOrder} value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)} className="rounded-full border border-veloura-border/20 bg-veloura-surface/95 px-3 py-2 text-xs font-semibold text-veloura-text outline-none focus:border-veloura-accent disabled:opacity-60">
                      {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
