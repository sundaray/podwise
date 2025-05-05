import { navbarLinks } from "@/config/navbar";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

type AboutLayoutProps = {
  children: React.ReactNode;
};

export default function AboutLayout({ children }: AboutLayoutProps) {
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
