import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut, 
  Store, 
  Search,
  Command,
  Home,
  Users,
  ShoppingBag,
  Settings,
  User,
  Zap
} from 'lucide-react';

// Mock auth context for demo
const useAuth = () => ({
  user: { name: 'John Doe', email: 'john@example.com' },
  logout: () => console.log('Logged out'),
  isAuthenticated: true,
  isMerchant: true
});

const Navbar = () => {
  const { user, logout, isAuthenticated, isMerchant } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Command palette items
  const commandItems = [
    { id: 'home', label: 'Go to Home', icon: Home, action: () => navigate('/'), type: 'navigation' },
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => navigate('/dashboard'), type: 'navigation' },
    { id: 'shops', label: 'Browse Shops', icon: Store, action: () => navigate('/shops'), type: 'navigation' },
    { id: 'products', label: 'View Products', icon: ShoppingBag, action: () => navigate('/products'), type: 'navigation' },
    { id: 'profile', label: 'Edit Profile', icon: User, action: () => navigate('/profile'), type: 'action' },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => navigate('/settings'), type: 'action' },
  ];

  const filteredItems = commandItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Command palette keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      if (commandPaletteOpen) {
        if (e.key === 'Escape') {
          setCommandPaletteOpen(false);
          setSearchQuery('');
          setSelectedIndex(0);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
            setCommandPaletteOpen(false);
            setSearchQuery('');
            setSelectedIndex(0);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredItems, selectedIndex]);

  // Focus search input when command palette opens
  useEffect(() => {
    if (commandPaletteOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [commandPaletteOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Generate avatar from initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const NavLink = ({ to, children, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-white/20 ${
          isActive 
            ? "text-white bg-white/20 border-white/20 shadow-lg" 
            : "text-white/80 hover:text-white"
        }`}
      >
        {children}
        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-1/2 w-1 h-1 bg-white rounded-full"
            layoutId="dot"
            initial={false}
            style={{ x: '-50%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Spacer */}
      <div className={`transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}></div>
      
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-gradient-to-r from-blue-600/95 via-purple-600/95 to-blue-800/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
            : 'bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-blue-800/80 backdrop-blur-md shadow-lg'
        }`}
        animate={{ 
          height: scrolled ? 64 : 80,
          paddingTop: scrolled ? 0 : 8,
          paddingBottom: scrolled ? 0 : 8
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex h-full items-center justify-between">
            {/* Animated Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 text-xl font-bold text-white group"
            >
              <motion.div
                className="relative p-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.6 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Store className="h-6 w-6 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                  animate={{ 
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </motion.div>
              <motion.span 
                className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-extrabold tracking-wide"
                whileHover={{
                  background: "linear-gradient(45deg, #fff, #ffd700, #fff)",
                  backgroundClip: "text",
                  transition: { duration: 0.3 }
                }}
              >
                Bazario
              </motion.span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/">Home</NavLink>
              {isAuthenticated && isMerchant && <NavLink to="/dashboard">Dashboard</NavLink>}
              
              {/* Command Palette Trigger */}
              <motion.button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
                <div className="flex gap-1 ml-2">
                  <kbd className="px-1.5 py-0.5 text-xs bg-white/20 rounded border border-white/20">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 text-xs bg-white/20 rounded border border-white/20">K</kbd>
                </div>
              </motion.button>
              
              <div className="ml-4 flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="relative group">
                    <motion.button
                      className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        whileHover={{ 
                          boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                          scale: 1.1
                        }}
                      >
                        {getInitials(user?.name || 'User')}
                      </motion.div>
                      <span className="font-medium">{user?.name || 'User'}</span>
                    </motion.button>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-2">
                          <div className="px-4 py-3 border-b border-white/20">
                            <p className="text-white font-medium">{user?.name}</p>
                            <p className="text-white/60 text-sm">{user?.email}</p>
                          </div>
                          {isMerchant && (
                            <Link 
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                          )}
                          <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all duration-200 w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link 
                      to="/login"
                      className="px-6 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register"
                      className="px-6 py-2 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/20 bg-white/10 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-3">
                <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </NavLink>
                {isAuthenticated && isMerchant && (
                  <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </NavLink>
                )}
                
                <div className="pt-4 border-t border-white/20">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(user?.name || 'User')}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user?.name}</p>
                          <p className="text-white/60 text-sm">{user?.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link 
                        to="/login" 
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full px-4 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium text-center"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
            onClick={() => setCommandPaletteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl mx-4 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 px-6 py-4 border-b border-white/20">
                <Search className="h-5 w-5 text-white/60" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for actions, pages, or features..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg"
                />
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 text-xs bg-white/20 text-white/80 rounded border border-white/20">ESC</kbd>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setCommandPaletteOpen(false);
                        setSearchQuery('');
                        setSelectedIndex(0);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 text-left ${
                        index === selectedIndex
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-xl ${
                        item.type === 'navigation' 
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-white/60 capitalize">{item.type}</div>
                      </div>
                      {index === selectedIndex && (
                        <div className="ml-auto">
                          <kbd className="px-2 py-1 text-xs bg-white/20 text-white/80 rounded border border-white/20">↵</kbd>
                        </div>
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-white/60">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No results found</p>
                    <p className="text-sm mt-1">Try searching for something else</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;