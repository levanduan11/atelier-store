import Link from "next/link";

const columns = [
  {
    title: "Client Care",
    links: ["Contact us", "Shipping", "Returns & exchanges", "Book an appointment"],
  },
  {
    title: "The House",
    links: ["Our story", "Craftsmanship", "Sustainability", "Careers"],
  },
  {
    title: "Legal",
    links: ["Terms of use", "Privacy policy", "Cookie settings"],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper section">
      <div className="container-page grid gap-10 md:grid-cols-4">
        <p className="text-heading tracking-[0.3em]">Atelier</p>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-eyebrow mb-4">{col.title}</h2>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <Link href="#" className="link-nav normal-case! font-normal!">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="container-page text-fine mt-16">
        © 2026 Atelier Store. Sample storefront; imagery courtesy of Unsplash.
      </p>
    </footer>
  );
}
