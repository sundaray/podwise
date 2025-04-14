import { navbarLinks } from "@/config/navbar";
import { MainNav } from "@/components/main-nav";

type TagsLayoutProps = {
  children: React.ReactNode;
};

export default function TagsLayout({ children }: TagsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <MainNav items={navbarLinks.main} />
      </header>
      <main className="flex-1 py-32">{children}</main>
    </div>
  );
}
