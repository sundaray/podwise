import { navbarLinks } from "@/config/navbar";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

type MelRobbinsPodcastLayoutProps = {
  children: React.ReactNode;
};

export default function MelRobbinsPodcastLayout({
  children,
}: MelRobbinsPodcastLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <MainNav items={navbarLinks.main} />
      </header>
      <main className="flex-1 py-32">{children}</main>
      <Footer />
    </div>
  );
}
