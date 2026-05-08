import { LayoutDashboard, Newspaper, Settings, Info, Moon, Sun, Menu, X, Orbit } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (id, path) => {
    if (path) {
      navigate(path);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dash', path: '/' },
    { icon: Newspaper, label: 'News', id: 'news', path: '/news' },
    { icon: Info, label: 'About', id: 'dash', path: '/' }, 
    { icon: Settings, label: 'Settings', id: 'dash', path: '/' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 glass transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-border",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/30">
                <Orbit size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">OrbitScope</h1>
            </div>
            <button className="lg:hidden text-muted-foreground" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.id, item.path)}
                className={cn(
                  "flex items-center gap-3 w-full p-3 rounded-xl transition-all group",
                  location.pathname === item.path 
                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <item.icon size={20} className={cn(location.pathname !== item.path && "group-hover:scale-110 transition-transform")} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border space-y-4">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all text-foreground"
            >
              {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
              <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold">All Systems GO</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
