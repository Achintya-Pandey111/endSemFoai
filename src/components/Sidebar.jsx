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
        "fixed inset-y-0 left-0 z-50 w-64 bg-background transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-border/20",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-foreground text-foreground">
                <Orbit size={20} />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-foreground uppercase">OrbitScope</h1>
            </div>
            <button className="lg:hidden text-foreground" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <span className="t11-label">Navigation</span>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.id, item.path)}
                className={cn(
                  "flex items-center justify-between w-full p-3 transition-all group border-b border-border/10",
                  location.pathname === item.path 
                    ? "text-foreground font-bold" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} />
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase">{item.label}</span>
                </div>
                {location.pathname === item.path && <div className="w-1 h-1 bg-foreground rounded-full" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-border/20 space-y-6">
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-between w-full p-2 text-foreground group"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase">{isDark ? 'Light' : 'Dark'}</span>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <div className="p-4 border border-foreground/10 bg-foreground/[0.02]">
              <span className="t11-label !mb-2">System Status</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-foreground animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
