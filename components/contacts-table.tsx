'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, Eye, EyeOff, ExternalLink, TrendingUp, Download, Mail, Phone, Sparkles, AlertCircle, CheckCircle2, List, LayoutGrid } from 'lucide-react';
import { useState, useTransition } from 'react';
import { trackContactView } from '@/lib/actions';
import { exportContactsToCSV } from '@/lib/export';
import Link from 'next/link';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  department: string | null;
  contactFormUrl: string | null;
  agency: {
    id: string;
    name: string;
    state: string | null;
  } | null;
}

interface ContactsTableProps {
  contacts: Contact[];
  viewedContactIds: Set<string>;
  currentPage: number;
  totalPages: number;
  total: number;
  remainingViews: number;
  isPro?: boolean;
}

export function ContactsTable({
  contacts,
  viewedContactIds,
  currentPage,
  totalPages,
  total,
  remainingViews,
  isPro = false,
}: ContactsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [viewingContact, setViewingContact] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleSearch = (immediate = false) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', '1');

    if (isPro && immediate) {
      // Pro users get instant search as they type
      startTransition(() => {
        router.push(`/dashboard/contacts?${params.toString()}`);
      });
    } else if (!immediate) {
      // Free users and manual search (Enter key/button)
      startTransition(() => {
        router.push(`/dashboard/contacts?${params.toString()}`);
      });
    }
  };

  const handleSearchInput = (value: string) => {
    setSearch(value);
    if (isPro) {
      // Pro users get real-time search
      handleSearch(true);
    }
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    startTransition(() => {
      router.push(`/dashboard/contacts?${params.toString()}`);
    });
  };

  const handleExport = async () => {
    // Show upgrade modal for free users
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    startTransition(async () => {
      const csv = await exportContactsToCSV({ search });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleViewContact = async (contactId: string) => {
    // Allow viewing already-viewed contacts regardless of limit
    if (viewedContactIds.has(contactId)) {
      setViewingContact(contactId);
      return;
    }

    // Pro users have unlimited views
    if (!isPro && remainingViews === 0) {
      setShowUpgradeModal(true);
      return;
    }

    startTransition(async () => {
      const result = await trackContactView(contactId);
      
      if (result.limitReached) {
        setShowUpgradeModal(true);
      } else if (result.success) {
        setViewingContact(contactId);
        viewedContactIds.add(contactId);
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                {isPro && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2" title="Pro: Real-time search">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>
                )}
                <input
                  type="text"
                  placeholder={isPro ? "Search contacts (real-time)..." : "Search contacts by name, title, or department..."}
                  value={search}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-10 pl-10 pr-10 border border-slate-300 dark:border-slate-700 focus:border-slate-500 dark:focus:border-slate-500 focus:outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button 
                onClick={handleSearch} 
                disabled={isPending}
                className="px-4 h-10 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-50"
              >
                Search
              </button>
            </div>
            
            <div className="flex gap-2">
              {/* View Toggle */}
              <div className="flex items-center border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium ${
                    viewMode === 'table' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-l border-slate-300 dark:border-slate-700 ${
                    viewMode === 'grid' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Cards
                </button>
              </div>

              <button 
                onClick={handleExport} 
                disabled={isPending}
                title="Export only contacts you've viewed today"
                className="flex items-center gap-1.5 px-3 h-10 border border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {remainingViews <= 10 && remainingViews > 0 && (
          <div className="relative overflow-hidden bg-orange-50 rounded-3xl border-2 border-orange-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-30" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black text-orange-900 text-lg">
                    Only {remainingViews} views remaining today
                  </p>
                  <p className="text-sm text-orange-700 font-medium mt-1">
                    Upgrade to get unlimited access to all contacts
                  </p>
                </div>
              </div>
              <Link href="/dashboard/upgrade">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-900 text-white font-bold hover:bg-orange-800 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
                  Upgrade
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                    <th className="py-4 px-4 text-left">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Name</span>
                    </th>
                    <th className="py-4 px-4 text-left">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Title</span>
                    </th>
                    <th className="py-4 px-4 text-left">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Agency</span>
                    </th>
                    <th className="py-4 px-4 text-left">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Department</span>
                    </th>
                    <th className="py-4 px-4 text-left">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <Search className="h-8 w-8 text-slate-400 dark:text-slate-500" strokeWidth={2} />
                          </div>
                          <p className="text-lg font-bold text-slate-500 dark:text-slate-400">No contacts found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => {
                      const isViewed = viewedContactIds.has(contact.id);
                      
                      return (
                        <tr key={contact.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {contact.firstName} {contact.lastName}
                              </span>
                              {isViewed && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                                  <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {contact.title ? (
                              <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700">
                                {contact.title}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {contact.agency ? (
                              <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{contact.agency.name}</div>
                                {contact.agency.state && (
                                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    {contact.agency.state}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {contact.department || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleViewContact(contact.id)}
                              disabled={isPending}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                                isViewed 
                                  ? 'border-2 border-slate-200 hover:border-slate-900 bg-white text-slate-900' 
                                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'
                              }`}
                            >
                              <Eye className="h-4 w-4" strokeWidth={2.5} />
                              {isViewed ? 'View' : 'View'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div>
            {contacts.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-slate-100 p-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-slate-100 rounded-full">
                    <Search className="h-12 w-12 text-slate-400" strokeWidth={2} />
                  </div>
                  <p className="text-xl font-bold text-slate-400">No contacts found</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {contacts.map((contact) => {
                  const isViewed = viewedContactIds.has(contact.id);
                  
                  return (
                    <div
                      key={contact.id}
                      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
                    >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded ${isViewed ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            {isViewed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              {contact.firstName} {contact.lastName}
                            </h3>
                            {contact.title && (
                              <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded">
                                {contact.title}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          {contact.department && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 dark:text-slate-400">Department:</span>
                              <span className="text-slate-700 dark:text-slate-300">{contact.department}</span>
                            </div>
                          )}
                          {contact.agency && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 dark:text-slate-400">Agency:</span>
                              <span className="text-slate-700 dark:text-slate-300">{contact.agency.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewContact(contact.id)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-slate-600">
                Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total} contacts
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:hover:border-slate-200 dark:disabled:hover:border-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        disabled={isPending}
                        className={`min-w-[2.5rem] px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                          currentPage === pageNum
                            ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-lg shadow-slate-900/30 dark:shadow-slate-700/30'
                            : 'border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:hover:border-slate-200 dark:disabled:hover:border-slate-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Details Modal */}
      {viewingContact && (() => {
        const contact = contacts.find((c) => c.id === viewingContact);
        if (!contact) return null;

        return (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingContact(null)}>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Contact Details</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full contact information</p>
                  </div>
                  <button
                    onClick={() => setViewingContact(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Name</label>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">
                      {contact.firstName} {contact.lastName}
                    </p>
                  </div>

                  {contact.title && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Title</label>
                      <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">{contact.title}</p>
                    </div>
                  )}

                  {contact.department && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Department</label>
                      <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">{contact.department}</p>
                    </div>
                  )}

                  {contact.email && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</label>
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mt-1"
                      >
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </a>
                    </div>
                  )}

                  {contact.phone && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone</label>
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mt-1"
                      >
                        <Phone className="h-4 w-4" />
                        {contact.phone}
                      </a>
                    </div>
                  )}

                  {contact.agency && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Agency</label>
                      <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">{contact.agency.name}</p>
                      {contact.agency.state && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{contact.agency.state}</p>
                      )}
                    </div>
                  )}

                  {contact.contactFormUrl && (
                    <a
                      href={contact.contactFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full p-3 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Contact Form
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Daily Limit Reached</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium">You've reached your daily limit of 50 contact views</p>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                  Upgrade to Premium to get <strong className="font-black">unlimited</strong> access to all contacts and agencies.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 font-bold transition-all duration-300"
                >
                  Maybe Later
                </button>
                <Link href="/pricing" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all duration-300 hover:scale-105">
                    <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
                    Upgrade Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}