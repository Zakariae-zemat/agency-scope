'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, Eye, TrendingUp, Zap, Award, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardClientProps {
  totalAgencies: number;
  totalContacts: number;
  todayViews: number;
}

export default function DashboardClient({ totalAgencies, totalContacts, todayViews }: DashboardClientProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  
  const remainingViews = Math.max(0, 50 - todayViews);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large decorative circles */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-50 opacity-40"
          style={{
            transform: mounted ? `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` : 'none',
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-purple-50 opacity-30"
          style={{
            transform: mounted ? `translate(${-mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)` : 'none',
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-cyan-50 opacity-35"
          style={{
            transform: mounted ? `translate(${mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)` : 'none',
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Floating shapes */}
        <svg className="absolute top-20 left-1/4 w-12 h-12 text-blue-200 opacity-20 animate-float" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <svg className="absolute bottom-1/4 right-1/3 w-16 h-16 text-purple-200 opacity-20 animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-16 bg-blue-500 rounded-full" />
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Live Dashboard</span>
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-3">
              Dashboard
            </h1>
            <p className="text-xl text-slate-500 font-medium">
              Welcome back! Here's your activity overview.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Building2,
              title: 'Total Agencies',
              value: totalAgencies.toLocaleString(),
              subtitle: 'Verified government agencies',
              color: 'blue',
              delay: 0
            },
            {
              icon: Users,
              title: 'Total Contacts',
              value: totalContacts.toLocaleString(),
              subtitle: 'Decision-makers and contacts',
              color: 'purple',
              delay: 100
            },
            {
              icon: Eye,
              title: 'Views Remaining',
              value: `${remainingViews}/50`,
              subtitle: 'Resets daily at midnight',
              color: 'cyan',
              delay: 200
            }
          ].map((stat, i) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
              purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
              cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' }
            };
            const colorClasses = colorMap[stat.color as keyof typeof colorMap];

            return (
              <div
                key={i}
                className={`group relative bg-white rounded-3xl border-2 border-slate-100 p-8 hover:border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses.light} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`relative p-4 ${colorClasses.light} rounded-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <div className={`absolute inset-0 ${colorClasses.bg} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      <Icon className={`w-7 h-7 ${colorClasses.text} relative z-10`} strokeWidth={2.5} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-400 font-medium">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${colorClasses.bg} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions Card */}
          <div 
            className={`bg-white rounded-3xl border-2 border-slate-100 p-8 hover:shadow-2xl transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-900 rounded-xl">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Quick Actions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Building2,
                  title: 'Browse Agencies',
                  subtitle: `Explore ${totalAgencies} verified agencies`,
                  color: 'blue',
                  href: '/dashboard/agencies'
                },
                {
                  icon: Users,
                  title: 'View Contacts',
                  subtitle: `Access ${totalContacts.toLocaleString()} contact profiles`,
                  color: 'purple',
                  href: '/dashboard/contacts'
                }
              ].map((action, i) => {
                const Icon = action.icon;
                const colorMap = {
                  blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
                  purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' }
                };
                const colorClasses = colorMap[action.color as keyof typeof colorMap];

                return (
                  <Link key={i} href={action.href}>
                    <button className="group w-full flex items-center gap-4 p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-900 bg-white hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02]">
                      <div className={`relative flex-shrink-0 p-4 ${colorClasses.light} rounded-xl group-hover:${colorClasses.bg} transition-all duration-300`}>
                        <Icon className={`w-6 h-6 ${colorClasses.text} group-hover:text-white transition-colors duration-300`} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-slate-900 text-lg mb-1">{action.title}</div>
                        <div className="text-sm text-slate-500 font-medium">{action.subtitle}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Account Status Card */}
          <div 
            className={`bg-white rounded-3xl border-2 border-slate-100 p-8 hover:shadow-2xl transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-900 rounded-xl">
                <Award className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Account Status</h2>
            </div>

            <div className="space-y-6">
              {/* Progress Section */}
              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Daily View Limit
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {todayViews}/50 used
                  </span>
                </div>
                
                {/* Custom Progress Bar */}
                <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(todayViews / 50) * 100}%`,
                      transitionDelay: '500ms'
                    }}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
                </div>

                {/* Percentage indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-xs font-black text-slate-400">
                    {Math.round((todayViews / 50) * 100)}%
                  </span>
                </div>
              </div>

              {/* Status Message */}
              {remainingViews === 0 ? (
                <div className="relative overflow-hidden p-6 rounded-2xl bg-orange-50 border-2 border-orange-200">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-30" />
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <p className="text-sm font-black text-orange-900 uppercase tracking-wide">
                        Daily limit reached
                      </p>
                    </div>
                    <p className="text-sm text-orange-700 font-medium leading-relaxed">
                      You've used all 50 contact views today. Upgrade for unlimited access.
                    </p>
                    <Link href="/dashboard/upgrade">
                      <button className="group flex items-center gap-2 text-sm font-bold text-orange-900 hover:gap-3 transition-all duration-300">
                        View upgrade options
                        <ArrowRight className="w-4 h-4" strokeWidth={3} />
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-700">
                        You have <span className="font-black text-emerald-900">{remainingViews}</span> contact views remaining today.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievement Badge */}
              <div className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <Award className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-blue-900 mb-1">Free Tier Active</p>
                    <p className="text-xs text-blue-600 font-medium">50 daily views • Basic features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
