import { navbarLinks } from "@/config/navbar"
import { MainNav } from "@/components/main-nav"

type HomeLayoutProps = {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  )
} 
