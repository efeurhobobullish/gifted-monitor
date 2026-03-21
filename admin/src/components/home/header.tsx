import { Menu } from "lucide-react";  
import { Link } from "react-router-dom";  
import { useState } from "react";  
import { ModeToggle } from "../ui";  
import SlidingMenu from "../ui/SlidingMenu";  
import useAuthStore from "@/store/useAuthStore";  
  
export default function Header() {  
  const { user, isAuthenticated } = useAuthStore();  
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  
  if (!isAuthenticated || !user) return null;  
  
  const avatar =  
    user.avatar ||  
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(  
      user.fullName  
    )}`;  
  
  return (  
    <>  
      <header className="sticky top-0 z-50 w-full border-b border-line bg-background">  
        <nav className="main h-[90px] flex items-center justify-between text-main">  
          {/* Logo */}  
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="font-space font-semibold text-lg">
              EmpireHost <span className="text-primary">&bull;</span>
            </span>
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary border border-primary/30">Admin</span>
          </Link>
  
          {/* Right actions */}  
          <div className="flex items-center gap-3">  
            <ModeToggle />  
  
            {/* Avatar */}  
            <div className="h-10 w-10 rounded-full overflow-hidden bg-foreground border border-line">  
              <img  
                src={avatar}  
                alt={user.fullName}  
                className="w-full h-full object-cover"  
              />  
            </div>  
  
            {/* Menu */}  
            <button  
              onClick={() => setIsMenuOpen(true)}  
              className="  
                h-10 w-10  
                rounded-full  
                border border-line  
                bg-background  
                hover:bg-foreground  
                flex items-center justify-center  
                text-main  
                transition-colors  
              "  
              aria-label="Open menu"  
            >  
              <Menu size={20} />  
            </button>  
          </div>  
        </nav>  
      </header>  
  
      <SlidingMenu  
        isOpen={isMenuOpen}  
        onClose={() => setIsMenuOpen(false)}  
      />  
    </>  
  );  
}