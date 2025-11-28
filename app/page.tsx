'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.5}px)`,
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgb(59 130 246 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(59 130 246 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          transition: 'transform 0.2s ease-out'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{
            animationDelay: '2s',
            transform: `translate(${-mousePosition.x * 0.03}px, ${-mousePosition.y * 0.03}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{
            animationDelay: '4s',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Glassmorphic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-white/10 backdrop-blur-xl bg-white/80 dark:bg-slate-950/50">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              AgencyScope
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/sign-in" className="relative px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-colors group">
              Sign In
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/sign-up" className="relative px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/50 block">
              Get Started
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 hover:opacity-20 transition-opacity duration-300" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="container mx-auto px-6 pt-40 pb-32">
          <div className="mx-auto max-w-5xl text-center" style={parallaxStyle}>
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 backdrop-blur-sm animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Contact Intelligence Platform
              </span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="mb-8 text-7xl font-black tracking-tight sm:text-8xl animate-fade-in">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-2xl">
                Access Verified
              </span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Agencies & Contacts
              </span>
            </h1>

            <p className="mb-12 text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
              Discover detailed information about government agencies and their key contacts. 
              Perfect for outreach, research, and building powerful connections.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-16 animate-fade-in-delay-2">
              <button className="group relative px-10 py-4 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/50 hover:shadow-cyan-500/50">
                <span className="relative z-10">Start Free Today</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="group px-10 py-4 text-lg font-bold text-white rounded-2xl border-2 border-white/20 hover:border-cyan-400/50 bg-white/5 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                View Demo
                <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-delay-3">
              {[
                { value: '500+', label: 'Verified Agencies' },
                { value: '10K+', label: 'Direct Contacts' },
                { value: '99.9%', label: 'Data Accuracy' }
              ].map((stat, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-200/70 font-medium">{stat.label}</div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/30 to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-4">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AgencyScope
                </span>
                ?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  ),
                  title: 'Verified Agencies',
                  description: 'Access hundreds of verified government agencies with detailed information and contact data.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  ),
                  title: 'Direct Contacts',
                  description: 'Find key decision-makers with direct email addresses and phone numbers for efficient outreach.',
                  gradient: 'from-cyan-500 to-blue-500'
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  ),
                  title: 'Smart Limits',
                  description: '50 free contact views per day. Upgrade anytime for unlimited access to our database.',
                  gradient: 'from-blue-500 to-purple-500'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-105"
                  style={{
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur transition-all duration-500`} />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="mb-4 text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100/70 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover arrow */}
                  <div className="mt-6 flex items-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-sm font-semibold">Learn more</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32">
          <div className="container mx-auto px-6">
            <div className="relative max-w-4xl mx-auto text-center p-16 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 animate-pulse" />
              
              <div className="relative z-10">
                <h2 className="text-5xl font-black text-white mb-6">
                  Ready to Transform Your Outreach?
                </h2>
                <p className="text-xl text-blue-100/80 mb-10">
                  Join thousands of professionals accessing verified agency contacts
                </p>
                <button className="group relative px-12 py-5 text-xl font-bold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/50 hover:shadow-cyan-500/50">
                  <span className="relative z-10">Start Your Free Trial</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-xl py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-blue-200/60 text-sm">
            &copy; 2025 AgencyScope. Built with Next.js, Prisma, and Clerk.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-blue-400/60 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.2s forwards;
        }
        
        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.4s forwards;
        }
        
        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.6s forwards;
        }
      `}</style>
    </div>
  );
}