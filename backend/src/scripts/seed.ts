/**
 * Seed script: Deletes existing books & categories, creates real books
 * with cover images uploaded to Cloudinary.
 *
 * Run: npx tsx src/scripts/seed.ts
 */
import "dotenv/config";
import { prisma } from "../lib/prisma";
import cloudinary from "../lib/cloudinary";

// ── helpers ──────────────────────────────────────────────────────────────────

async function uploadFromUrl(url: string, folder = "tienda-libros"): Promise<string> {
  const result = await cloudinary.uploader.upload(url, { folder });
  return result.secure_url;
}

// ── seed data ────────────────────────────────────────────────────────────────

const categories = [
  { name: "Fiction", slug: "fiction" },
  { name: "Science Fiction", slug: "science-fiction" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Classic", slug: "classic" },
  { name: "Horror", slug: "horror" },
  { name: "Non-Fiction", slug: "non-fiction" },
] as const;

type CategorySlug = (typeof categories)[number]["slug"];

interface SeedBook {
  title: string;
  slug: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  isbn: string;
  categorySlug: CategorySlug;
  coverUrl: string; // Open Library cover URL (large)
  featured: boolean;
}

const books: SeedBook[] = [
  // ── Fiction ──
  {
    title: "To Kill a Mockingbird",
    slug: "to-kill-a-mockingbird",
    author: "Harper Lee",
    description:
      "A gripping, heart-wrenching tale of racial injustice in the Deep South, seen through the innocent eyes of young Scout Finch. This Pulitzer Prize-winning novel explores courage, compassion, and the moral complexity of a small Alabama town in the 1930s.",
    price: 14.99,
    stock: 25,
    isbn: "978-0-06-112008-4",
    categorySlug: "fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    featured: true,
  },
  {
    title: "The Great Gatsby",
    slug: "the-great-gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "Set in the Jazz Age on Long Island, this classic novel follows the mysterious millionaire Jay Gatsby and his obsessive pursuit of the beautiful Daisy Buchanan. A brilliant exploration of decadence, idealism, and the American Dream.",
    price: 12.99,
    stock: 30,
    isbn: "978-0-7432-7356-5",
    categorySlug: "classic",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    featured: true,
  },
  {
    title: "One Hundred Years of Solitude",
    slug: "one-hundred-years-of-solitude",
    author: "Gabriel García Márquez",
    description:
      "The epic multi-generational story of the Buendía family in the fictional town of Macondo. A landmark of magical realism that weaves together love, war, revolution, and the relentless passage of time in Latin America.",
    price: 16.99,
    stock: 20,
    isbn: "978-0-06-088328-7",
    categorySlug: "fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg",
    featured: true,
  },

  // ── Science Fiction ──
  {
    title: "Dune",
    slug: "dune",
    author: "Frank Herbert",
    description:
      "On the desert planet Arrakis, young Paul Atreides is thrust into a struggle for control of the most valuable substance in the universe — the spice melange. A sweeping epic of politics, religion, ecology, and human potential.",
    price: 18.99,
    stock: 22,
    isbn: "978-0-441-17271-9",
    categorySlug: "science-fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
    featured: true,
  },
  {
    title: "Neuromancer",
    slug: "neuromancer",
    author: "William Gibson",
    description:
      "The groundbreaking cyberpunk novel that defined a genre. Washed-up hacker Case is hired for the ultimate hack — breaking into a powerful AI. A dark, neon-lit vision of a future where cyberspace is as real as the streets.",
    price: 15.99,
    stock: 18,
    isbn: "978-0-441-56956-4",
    categorySlug: "science-fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780441569564-L.jpg",
    featured: false,
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    slug: "the-hitchhikers-guide-to-the-galaxy",
    author: "Douglas Adams",
    description:
      "Seconds before Earth is demolished for a galactic freeway, Arthur Dent is rescued by his friend Ford Prefect, a researcher for the electronic travel guide. A hilarious, absurdist adventure through space, time, and the meaning of life (it's 42).",
    price: 13.99,
    stock: 28,
    isbn: "978-0-345-39180-3",
    categorySlug: "science-fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg",
    featured: false,
  },

  // ── Fantasy ──
  {
    title: "The Hobbit",
    slug: "the-hobbit",
    author: "J.R.R. Tolkien",
    description:
      "Bilbo Baggins, a comfort-loving hobbit, is swept into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug. A timeless adventure of courage, friendship, and discovery in Middle-earth.",
    price: 14.99,
    stock: 35,
    isbn: "978-0-547-92822-7",
    categorySlug: "fantasy",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
    featured: true,
  },
  {
    title: "A Game of Thrones",
    slug: "a-game-of-thrones",
    author: "George R.R. Martin",
    description:
      "In the Seven Kingdoms of Westeros, noble families wage war for control of the Iron Throne while an ancient enemy stirs beyond the Wall. A richly complex tale of ambition, betrayal, and the brutal cost of power.",
    price: 17.99,
    stock: 20,
    isbn: "978-0-553-10354-0",
    categorySlug: "fantasy",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg",
    featured: true,
  },
  {
    title: "The Name of the Wind",
    slug: "the-name-of-the-wind",
    author: "Patrick Rothfuss",
    description:
      "Kvothe, the legendary figure known as the Kingkiller, tells his own story — from orphaned child to the most notorious wizard his world has ever seen. A beautifully written epic about the power of music, magic, and naming.",
    price: 16.99,
    stock: 15,
    isbn: "978-0-7564-0407-9",
    categorySlug: "fantasy",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780756404079-L.jpg",
    featured: false,
  },

  // ── Classic ──
  {
    title: "Pride and Prejudice",
    slug: "pride-and-prejudice",
    author: "Jane Austen",
    description:
      "The spirited Elizabeth Bennet and the proud Mr. Darcy navigate the complexities of love, class, and misunderstanding in Regency-era England. Austen's sharpest and most beloved novel, full of wit and unforgettable characters.",
    price: 11.99,
    stock: 30,
    isbn: "978-0-14-143951-8",
    categorySlug: "classic",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    featured: false,
  },
  {
    title: "1984",
    slug: "1984",
    author: "George Orwell",
    description:
      "In a totalitarian society where Big Brother watches everything, Winston Smith dares to think forbidden thoughts and seeks truth in a world of lies. A chilling, prophetic masterpiece about surveillance, propaganda, and freedom.",
    price: 13.99,
    stock: 40,
    isbn: "978-0-451-52493-5",
    categorySlug: "classic",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    featured: true,
  },
  {
    title: "Brave New World",
    slug: "brave-new-world",
    author: "Aldous Huxley",
    description:
      "In a gleaming future where humans are genetically engineered and conditioned for happiness, one man discovers the terrifying cost of a world without pain, love, or freedom. A darkly satirical vision of utopia gone wrong.",
    price: 12.99,
    stock: 25,
    isbn: "978-0-06-085052-4",
    categorySlug: "classic",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg",
    featured: false,
  },

  // ── Horror ──
  {
    title: "The Shining",
    slug: "the-shining",
    author: "Stephen King",
    description:
      "Jack Torrance takes his family to the remote Overlook Hotel as winter caretaker, hoping for a fresh start. But the hotel has plans of its own, and young Danny's psychic gift — the shining — awakens its darkest horrors.",
    price: 15.99,
    stock: 20,
    isbn: "978-0-307-74386-0",
    categorySlug: "horror",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307743862-L.jpg",
    featured: true,
  },
  {
    title: "Frankenstein",
    slug: "frankenstein",
    author: "Mary Shelley",
    description:
      "Victor Frankenstein, driven by ambition and scientific obsession, creates a living creature from dead tissue — only to be consumed by horror at what he has done. The original science-fiction horror novel about creation, responsibility, and the monster within.",
    price: 10.99,
    stock: 30,
    isbn: "978-0-14-143947-1",
    categorySlug: "horror",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg",
    featured: false,
  },
  {
    title: "Dracula",
    slug: "dracula",
    author: "Bram Stoker",
    description:
      "Told through letters, diary entries, and newspaper clippings, this Gothic masterpiece follows Count Dracula's journey from Transylvania to England and the desperate battle to stop him. The vampire novel that defined the genre.",
    price: 11.99,
    stock: 25,
    isbn: "978-0-14-143984-6",
    categorySlug: "horror",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg",
    featured: false,
  },

  // ── Non-Fiction ──
  {
    title: "Sapiens: A Brief History of Humankind",
    slug: "sapiens-a-brief-history-of-humankind",
    author: "Yuval Noah Harari",
    description:
      "From the emergence of Homo sapiens in Africa to the present, Harari surveys the entire sweep of human history. How did our species conquer the world? What makes us believe in gods, nations, and human rights? A bold, provocative bestseller.",
    price: 19.99,
    stock: 35,
    isbn: "978-0-06-231609-7",
    categorySlug: "non-fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    featured: true,
  },
  {
    title: "Atomic Habits",
    slug: "atomic-habits",
    author: "James Clear",
    description:
      "Tiny changes, remarkable results. James Clear reveals practical strategies for forming good habits, breaking bad ones, and mastering the tiny behaviors that lead to extraordinary outcomes. The definitive guide to building a better life, one small habit at a time.",
    price: 17.99,
    stock: 45,
    isbn: "978-0-7352-1129-2",
    categorySlug: "non-fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    featured: false,
  },
  {
    title: "Educated: A Memoir",
    slug: "educated-a-memoir",
    author: "Tara Westover",
    description:
      "Born to survivalist parents in the mountains of Idaho, Tara Westover was kept out of school. Through sheer determination she taught herself enough to earn a PhD from Cambridge. A stunning account of the transformative power of education.",
    price: 16.99,
    stock: 20,
    isbn: "978-0-399-59050-4",
    categorySlug: "non-fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
    featured: false,
  },
];

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🗑️  Cleaning existing data...");

  // Delete in order to respect FK constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();

  console.log("✅ Old data deleted.\n");

  // ── Create categories ──
  console.log("📁 Creating categories...");
  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const created = await prisma.category.create({ data: { name: cat.name, slug: cat.slug } });
    categoryMap.set(cat.slug, created.id);
    console.log(`   ✓ ${cat.name}`);
  }
  console.log();

  // ── Create books (with Cloudinary uploads) ──
  console.log("📚 Creating books (uploading covers to Cloudinary)...\n");

  for (const book of books) {
    const categoryId = categoryMap.get(book.categorySlug);
    if (!categoryId) {
      console.error(`   ✗ Category "${book.categorySlug}" not found for "${book.title}"`);
      continue;
    }

    let imageUrl: string;
    try {
      imageUrl = await uploadFromUrl(book.coverUrl);
      console.log(`   ☁️  Uploaded cover for "${book.title}"`);
    } catch (err) {
      console.warn(`   ⚠️  Could not upload cover for "${book.title}", using original URL`);
      imageUrl = book.coverUrl;
    }

    await prisma.book.create({
      data: {
        title: book.title,
        slug: book.slug,
        author: book.author,
        description: book.description,
        price: book.price,
        stock: book.stock,
        isbn: book.isbn,
        imageUrl,
        categoryId,
        published: true,
      },
    });

    console.log(`   ✓ ${book.title} — $${book.price}`);
  }

  console.log(`\n🎉 Seed complete! ${books.length} books created across ${categories.length} categories.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
