'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { 
  Shield, 
  BarChart3, 
  Users, 
  Building2, 
  Settings, 
  Database,
  Activity,
  Menu, 
  X, 
  Moon, 
  Sun 
} from 'lucide-react';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Metrics', href: '/admin/metrics', icon: Activity },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Agencies', href: '/admin/agencies', icon: Building2 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
            : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-cyan-500/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with Admin Badge */}
            <Link href="/admin" className="group flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-all" style={{ fontFamily: 'serif' }}>
                  AgencyScope
                </span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-600/60 dark:text-cyan-500/60">Admin Panel</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative group"
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        isActive
                          ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.5} />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-cyan-500/50 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-800 transition-all duration-300"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" strokeWidth={2.5} />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" strokeWidth={2.5} />
                  )}
                </button>
              )}

              {/* User Button */}
              <div className="hidden md:flex items-center justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2.5} />
                ) : (
                  <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="px-6 py-6 space-y-2 bg-slate-900/50 border-t border-slate-800">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 bg-slate-800/50 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded ${
                    isActive ? 'bg-cyan-500/20' : 'bg-slate-700'
                  }`}>
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  {item.name}
                </Link>
              );
            })}
            
            {/* User View Link - Mobile */}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all duration-300"
            >
              <div className="p-1.5 rounded bg-slate-700">
                <Users className="h-4 w-4" strokeWidth={2.5} />
              </div>
              User View
            </Link>

            {/* Mobile Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-semibold text-base text-slate-400 hover:text-cyan-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all duration-300"
              >
                <div className="p-1.5 rounded bg-slate-700">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <Moon className="w-4 h-4" strokeWidth={2.5} />
                  )}
                </div>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
