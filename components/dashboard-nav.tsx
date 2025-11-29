'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Building2, Users, LayoutDashboard, TrendingUp, Menu, X, Sparkles, Moon, Sun, Shield } from 'lucide-react';

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agencies', href: '/dashboard/agencies', icon: Building2 },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Upgrade', href: '/dashboard/upgrade', icon: TrendingUp },
];

interface DashboardNavProps {
  isAdmin?: boolean;
}

export function DashboardNav({ isAdmin = false }: DashboardNavProps) {
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
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b-2 border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50' 
            : 'bg-white dark:bg-slate-900 border-b-2 border-slate-100 dark:border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="group">
              <span className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-cyan-700 dark:from-cyan-400 dark:to-cyan-600 bg-clip-text text-transparent hover:from-cyan-600 hover:to-cyan-800 dark:hover:from-cyan-300 dark:hover:to-cyan-500 transition-all duration-300" style={{ fontFamily: 'serif' }}>
                AgencyScope
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {baseNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative group"
                  >
                    <div
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        isActive
                          ? 'text-white dark:text-white bg-slate-900 dark:bg-slate-800 shadow-lg shadow-slate-900/30'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.5} />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
              
              {/* Admin Panel Link - Only visible to admins */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="relative group"
                >
                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border ${
                      pathname.startsWith('/admin')
                        ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 border-slate-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 hover:border-cyan-200 dark:hover:border-cyan-800'
                    }`}
                  >
                    <Shield className="h-4 w-4" strokeWidth={2.5} />
                    Admin Panel
                  </div>
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden md:flex items-center justify-center w-11 h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 hover:scale-110"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-slate-300 dark:text-slate-300" strokeWidth={2.5} />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-700 dark:text-slate-700" strokeWidth={2.5} />
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
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={2.5} />
                ) : (
                  <Menu className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="px-6 py-6 space-y-3 bg-slate-50 dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800">
            {baseNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-slate-900 dark:bg-slate-800 shadow-lg shadow-slate-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  {item.name}
                </Link>
              );
            })}
            
            {/* Admin Panel - Mobile */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-base transition-all duration-300 border-2 ${
                  pathname.startsWith('/admin')
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 border-slate-200 dark:border-slate-700 hover:border-cyan-200 dark:hover:border-cyan-800'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  pathname.startsWith('/admin') ? 'bg-cyan-100 dark:bg-cyan-900/50' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  <Shield className="h-5 w-5" strokeWidth={2.5} />
                </div>
                Admin Panel
              </Link>
            )}

            {/* Mobile Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-bold text-base text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <Moon className="w-5 h-5" strokeWidth={2.5} />
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
          className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}