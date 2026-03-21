import { NavLink, useNavigate } from "react-router-dom";  
import { X, LogOut, Lock } from "lucide-react";  
import { motion, AnimatePresence } from "framer-motion";  
import { navlinks } from "@/constants/data";  
import useAuthStore from "@/store/useAuthStore";  
  
interface SlidingMenuProps {  
  isOpen: boolean;  
  onClose: () => void;  
}  
  
export default function SlidingMenu({ isOpen, onClose }: SlidingMenuProps) {  
  const navigate = useNavigate();  
  const { user, logout } = useAuthStore();  
  
  if (!user) return null;  
  
  const avatar =  
    user.avatar ||  
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(  
      user.fullName  
    )}`;  
  
  const handleLogout = () => {  
    logout();  
    onClose();  
    navigate("/login", { replace: true });  
  };  
  
  return (  
    <AnimatePresence>  
      {isOpen && (  
        <motion.div  
          className="fixed inset-0 z-50 bg-main/40 backdrop-blur-sm"  
          onClick={onClose}  
          initial={{ opacity: 0 }}  
          animate={{ opacity: 1 }}  
          exit={{ opacity: 0 }}  
        >  
          <motion.aside  
            initial={{ x: "-100%" }}  
            animate={{ x: 0 }}  
            exit={{ x: "-100%" }}  
            transition={{ type: "spring", damping: 25, stiffness: 220 }}  
            onClick={(e) => e.stopPropagation()}  
            className="  
              h-full w-80 max-w-[85vw]  
              bg-background  
              text-main  
              border-r border-line  
              shadow-2xl  
              flex flex-col  
            "  
          >  
            {/* Header */}  
            <div className="flex items-center justify-between px-6 h-[70px] border-b border-line">  
              <h3 className="font-space font-semibold text-lg">  
                EmpireHost <span className="text-primary">&bull;</span>  
              </h3>  
              <button  
                onClick={onClose}  
                className="h-9 w-9 rounded-full hover:bg-foreground flex items-center justify-center text-main"  
              >  
                <X size={18} />  
              </button>  
            </div>  
  
            {/* User */}  
            <div className="px-6 py-5 border-b border-line flex items-center gap-4">  
              <div className="h-12 w-12 rounded-full overflow-hidden bg-foreground border border-line">  
                <img  
                  src={avatar}  
                  alt={user.fullName}  
                  className="w-full h-full object-cover"  
                />  
              </div>  
              <div>  
                <p className="font-medium">{user.fullName}</p>  
                <p className="text-xs text-muted">{user.email}</p>  
              </div>  
            </div>  
  
            {/* Navigation */}  
            <nav className="p-4 space-y-1 flex-1">  
              {navlinks.map((link) => (  
                <NavLink  
                  key={link.title}  
                  to={link.href}  
                  end={link.href === "/dashboard"}  
                  onClick={onClose}  
                  className={({ isActive }) =>  
                    `  
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition  
                      ${  
                        isActive  
                          ? "bg-foreground text-primary font-medium"  
                          : "text-muted hover:bg-foreground"  
                      }  
                    `  
                  }  
                >  
                  <link.icon size={18} />  
                  {link.title}  
                </NavLink>  
              ))}  
            </nav>  
  
            {/* Actions */}  
            <div className="p-4 border-t border-line space-y-2">  
              <button  
                onClick={() => {  
                  onClose();  
                  navigate("/profile");  
                }}  
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm text-main hover:bg-foreground"  
              >  
                <Lock size={18} />  
                Account & Security  
              </button>  
  
              <button  
                onClick={handleLogout}  
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20"  
              >  
                <LogOut size={18} />  
                Logout  
              </button>  
            </div>  
          </motion.aside>  
        </motion.div>  
      )}  
    </AnimatePresence>  
  );  
}