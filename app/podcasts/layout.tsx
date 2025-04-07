import { navbarLinks } from "@/config/navbar"
import { MainNav } from "@/components/main-nav"

type PodcastsLayoutProps = {
  children: React.ReactNode
}

export default function PodcastsLayout({ children }: PodcastsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <MainNav items={navbarLinks.main} />
      </header>
      <main className="flex-1 py-16">{children}</main>
    </div>
  )
}
