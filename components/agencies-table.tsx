'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ExternalLink, Search, Users, Download, Building2, MapPin, Award, List, LayoutGrid } from 'lucide-react';
import { useState, useTransition } from 'react';
import { exportAgenciesToCSV } from '@/lib/export';

interface Agency {
  id: string;
  name: string;
  state: string | null;
  stateCode: string | null;
  type: string | null;
  population: number | null;
  website: string | null;
  county: string | null;
  phone: string | null;
  _count: {
    contacts: number;
  };
}

interface AgenciesTableProps {
  agencies: Agency[];
  states: string[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export function AgenciesTable({
  agencies,
  states,
  currentPage,
  totalPages,
  total,
}: AgenciesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const updateFilters = (newSearch: string, newState: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newState) params.set('state', newState);
    params.set('page', '1');

    startTransition(() => {
      router.push(`/dashboard/agencies?${params.toString()}`);
    });
  };

  const handleSearch = () => {
    updateFilters(search, selectedState);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    updateFilters(search, state);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    startTransition(() => {
      router.push(`/dashboard/agencies?${params.toString()}`);
    });
  };

  const handleExport = async () => {
    startTransition(async () => {
      const csv = await exportAgenciesToCSV({ search, state: selectedState });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agencies-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search agencies or counties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-10 pl-10 pr-3 border border-slate-300 dark:border-slate-700 focus:border-slate-500 dark:focus:border-slate-500 focus:outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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

            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-10 px-3 border border-slate-300 dark:border-slate-700 focus:border-slate-500 dark:focus:border-slate-500 focus:outline-none text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            
            <button 
              onClick={handleExport} 
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 h-10 border border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Agency Name</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Type</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Location</span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Population</span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Contacts</span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {agencies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-100 rounded-full">
                          <Building2 className="h-8 w-8 text-slate-400" strokeWidth={2} />
                        </div>
                        <p className="text-lg font-bold text-slate-400">No agencies found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  agencies.map((agency) => (
                    <tr key={agency.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{agency.name}</div>
                          {agency.county && (
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                              {agency.county}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {agency.type ? (
                          <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700">
                            {agency.type}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {agency.state ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900">{agency.state}</span>
                            {agency.stateCode && (
                              <span className="text-xs text-slate-500 font-medium">
                                ({agency.stateCode})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-900">
                          {agency.population ? agency.population.toLocaleString() : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <Users className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" strokeWidth={2.5} />
                          <span className="font-bold text-slate-900 dark:text-slate-100">{agency._count.contacts}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {agency.website ? (
                          <a
                            href={agency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-slate-900/20 dark:shadow-slate-700/20"
                          >
                            Website
                            <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div>
          {agencies.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-100 p-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-slate-100 rounded-full">
                  <Building2 className="h-12 w-12 text-slate-400" strokeWidth={2} />
                </div>
                <p className="text-xl font-bold text-slate-400">No agencies found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {agencies.map((agency) => (
                <div
                  key={agency.id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
                >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        <Building2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {agency.name}
                      </h3>
                    </div>
                    {agency.county && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        {agency.county}
                      </p>
                    )}
                    {agency.type && (
                      <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded">
                        {agency.type}
                      </span>
                    )}

                    <div className="mt-3 space-y-2 text-sm">
                      {agency.state && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {agency.state}
                            {agency.stateCode && <span> ({agency.stateCode})</span>}
                          </span>
                        </div>
                      )}
                      {agency.population !== null && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Award className="h-4 w-4" />
                          <span>{agency.population.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Users className="h-4 w-4" />
                        <span>{agency._count.contacts} contacts</span>
                      </div>
                    </div>
                  </div>

                  {agency.website && (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Visit
                    </a>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold text-slate-600">
              Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total} agencies
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 font-bold transition-all duration-300 disabled:opacity-50 disabled:hover:border-slate-200"
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
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                          : 'border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50'
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 font-bold transition-all duration-300 disabled:opacity-50 disabled:hover:border-slate-200"
              >
                Next
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}