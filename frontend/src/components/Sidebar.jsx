import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Key, Bike, MessageSquare, Plus, User, Info, LogOut, Menu, X, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink 
      to={to} 
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-purple-700 text-white",
        isActive ? "bg-purple-600" : ""
      )}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{children}</span>
    </NavLink>
  );
};

export const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      {isMobile && (
        <button 
          onClick={toggleSidebar} 
          className="fixed top-4 left-4 z-50 p-3 bg-purple-600 text-white rounded-md shadow-md"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      
      <aside 
        className={cn(
          "bg-purple-900 text-white h-screen fixed top-0 left-0 z-40 transition-all duration-300 flex flex-col shadow-lg",
          isOpen ? "w-64 translate-x-0" : isMobile ? "-translate-x-full w-64" : "w-16"
        )}
      >
        <div className="py-6 px-4">
  <h1 className={cn("text-lg font-bold text-white", isOpen ? "text-xl" : "text-center text-sm")}>
    {isOpen ? "Admin Panel" : "AP"}
  </h1>
</div>

<nav className="flex-1 items-center justify-center">
  <SidebarLink to="/dashboard/Admin" icon={Home} >
    {isOpen ? "Dashboard" : <Home />}
  </SidebarLink>
  <SidebarLink to="/admin/key-management" icon={Key}>
    {isOpen ? "Key Management" : <Key />}
  </SidebarLink>
  <SidebarLink to="/admin/bicycle-management" icon={Bike}>
    {isOpen ? "Bicycle Management" : <Bike />}
  </SidebarLink>
  <SidebarLink to="/admin/feedback" icon={MessageSquare}>
    {isOpen ? "Feedback" : <MessageSquare />}
  </SidebarLink>
  
  <SidebarLink to="/admin/assign-cr" icon={Plus}>
    {isOpen ? "Assign CR" : <Plus />}
    </SidebarLink>
    <SidebarLink to="/admin/history" icon={History}>
    {isOpen ? "History" : <History />}
    </SidebarLink>

    <SidebarLink to="/admin/user-management" icon={Info}>
    {isOpen ? "UserManagement" : "UM"}
  </SidebarLink>


  <SidebarLink to="/admin/profile" icon={User}>
    {isOpen ? "Profile" : <User />}
    </SidebarLink>

  <SidebarLink to="/about" icon={Info}>
    {isOpen ? "About" : <Info />}
  </SidebarLink>
  
</nav>

        
        <div className="mt-auto p-4">
          <button className="w-full flex items-center gap-4 p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
        
        {!isMobile && (
          <div className="mt-4 px-4">
            <button 
              onClick={toggleSidebar}
              className="w-full p-2 rounded-lg bg-purple-700 text-white hover:bg-purple-600 transition-all flex items-center justify-center"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? <Menu size={20} className="rotate-90" /> : <Menu size={20} className="-rotate-90" />}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
