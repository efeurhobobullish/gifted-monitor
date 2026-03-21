
import { Link } from "react-router-dom";
import ModeToggle from "../ui/mode-toggle";

export default function Header() {
 

  
  return (
    <>
      <header className="sticky z-100 w-full top-0 bg-gradient-to-b from-background via-background/80 to-transparent">
        <nav className="container flex items-center justify-between h-[90px] text-main">
          <Link to="/">
            <h3 className="font-semibold text-lg font-space">
              EmpireHost <span className="text-primary text-2xl">&bull;</span>{" "}
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary border border-primary/30">Admin</span>
            </h3>
          </Link>

         

          <div className="flex items-center gap-4">
            <ModeToggle />
           
          </div>
        </nav>
      </header>

     
    </>
  );
}
