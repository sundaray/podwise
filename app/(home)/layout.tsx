import { navbarLinks } from "@/config/navbar"
import { MainNav } from "@/components/main-nav"

type HomeLayoutProps = {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <MainNav items={navbarLinks.main} />
      </header>
      <main className="flex-1 border py-16">{children}</main>
    </div>
  )
}
