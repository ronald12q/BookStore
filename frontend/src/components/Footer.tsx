import { Heart, BookOpen } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t border-veloura-border/20">
            <div className="container mx-auto py-16 px-4 max-w-5xl">
                <div className="grid md:grid-cols-4 gap-10">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-4 mb-4">
                            <BookOpen className="text-veloura-accent" />
                            <h3 className="text-veloura-accent font-bold">Raven Brand</h3>
                        </div>
                        <p className="text-veloura-surface-2/70 text-sm leading-relaxed text-muted-foreground">
                            Tu biblioteca digital favorita. Descubre, explora y enamórate de la lectura.
                        </p>
                    </div>

                    {[
                        {
                            title: "Explorar",
                            links: ["Bestsellers", "Novedades", "Clásicos", "Recomendados"],
                        },
                        {
                            title: "Categorías",
                            links: ["Ficción", "No Ficción", "Ciencia", "Arte"],
                        },
                        {
                            title: "Compañía",
                            links: ["Sobre Nosotros", "Blog", "Contacto", "Términos"],
                        },
                    ].map((col) => (
                        <div key={col.title}>
                            <h4 className="font-display font-semibold text-veloura-inverse font-bold mb-4">
                                {col.title}
                            </h4>

                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-veloura-accent text-veloura-inverse/70 transition-colors font-body"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-veloura-border/40 mt-6 pt-8 border-border justify-between flex flex-col md:flex-row items-center">
                    <p className="text-veloura-surface-2 text-sm">
                        © 2026 Raven Brand. Todos los derechos reservados.
                    </p>

                    <p className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-veloura-surface-2">
                        <span>Hecho con </span>
                        <Heart className="h-3.5 w-3.5 fill-veloura-accent text-veloura-accent" />
                        <span>para los amantes de libros</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
