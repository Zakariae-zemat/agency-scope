'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ExternalLink, Search, Users, Building2, MapPin, Globe, Phone, List, LayoutGrid, Loader2 } from 'lucide-react';
import { useState, useTransition, useEffect, useRef, useCallback } from 'react';

export interface Agency {
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

export interface AdminAgenciesTableProps {
  agencies: Agency[];
  states: string[];
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function AdminAgenciesTable({
  agencies,
  states,
  currentPage,
  totalPages,
  total,
  pageSize,
}: AdminAgenciesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Lazy loading state for cards view
  const [displayedAgencies, setDisplayedAgencies] = useState<Agency[]>(agencies);
  const [hasMore, setHasMore] = useState(agencies.length < total);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const updateFilters = (newSearch: string, newState: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newState) params.set('state', newState);
    params.set('page', '1');

    startTransition(() => {
      router.push(`/admin/agencies?${params.toString()}`);
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
      router.push(`/admin/agencies?${params.toString()}`);
    });
  };

  // Load more agencies for infinite scroll
  const loadMoreAgencies = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = Math.floor(displayedAgencies.length / pageSize) + 1;
      const params = new URLSearchParams();
      params.set('page', nextPage.toString());
      params.set('limit', pageSize.toString());
      if (search) params.set('search', search);
      if (selectedState) params.set('state', selectedState);

      const response = await fetch(`/api/agencies?${params.toString()}`);
      const data = await response.json();

      if (data.agencies && data.agencies.length > 0) {
        setDisplayedAgencies(prev => [...prev, ...data.agencies]);
        setHasMore(displayedAgencies.length + data.agencies.length < total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more agencies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, displayedAgencies.length, pageSize, search, selectedState, total]);

  // Reset displayed agencies when filters change or initial data changes
  useEffect(() => {
    setDisplayedAgencies(agencies);
    setHasMore(agencies.length < total);
  }, [agencies, total]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (viewMode !== 'grid') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreAgencies();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [viewMode, hasMore, isLoadingMore, loadMoreAgencies]);

  return (
    <div className="space-y-6">
      {/* Search & Filters - Fully Responsive */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {/* Search Input Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search agencies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-10 pl-10 pr-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:border-cyan-500 dark:focus:border-cyan-500 focus:outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <button 
              onClick={handleSearch} 
              disabled={isPending}
              className="px-4 h-10 bg-cyan-600 dark:bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 disabled:opacity-50 transition-all whitespace-nowrap"
            >
              <span className="hidden sm:inline">Search</span>
              <Search className="h-4 w-4 sm:hidden" />
            </button>
          </div>

          {/* Filters & Controls Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:border-cyan-500 dark:focus:border-cyan-500 focus:outline-none text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex-1 sm:flex-initial sm:min-w-[150px]"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden w-full sm:w-auto sm:ml-auto">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium transition-all flex-1 sm:flex-initial ${
                  viewMode === 'table' 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border-l border-slate-300 dark:border-slate-700 transition-all flex-1 sm:flex-initial ${
                  viewMode === 'grid' 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{viewMode === 'grid' ? displayedAgencies.length : agencies.length}</span> of <span className="font-bold text-slate-900 dark:text-slate-100">{total.toLocaleString()}</span> agencies
        </p>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="py-3 px-4 text-left">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Agency</span>
                  </th>
                  <th className="py-3 px-4 text-left hidden sm:table-cell">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">State</span>
                  </th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Type</span>
                  </th>
                  <th className="py-3 px-4 text-left hidden lg:table-cell">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contacts</span>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {agencies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                          <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500" strokeWidth={2} />
                        </div>
                        <p className="text-lg font-bold text-slate-500 dark:text-slate-400">No agencies found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  agencies.map((agency) => (
                    <tr key={agency.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{agency.name}</div>
                          {agency.county && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                              {agency.county}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        {agency.state ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{agency.state}</span>
                            {agency.stateCode && (
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                ({agency.stateCode})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {agency.type ? (
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                            {agency.type}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" strokeWidth={2} />
                          <span className="font-bold text-slate-900 dark:text-slate-100">{agency._count.contacts}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {agency.website ? (
                          <a
                            href={agency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white text-sm font-bold hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all"
                          >
                            <span className="hidden sm:inline">Website</span>
                            <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Grid View with Lazy Loading */
        <div>
          {displayedAgencies.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Building2 className="h-12 w-12 text-slate-400 dark:text-slate-500" strokeWidth={2} />
                </div>
                <p className="text-xl font-bold text-slate-500 dark:text-slate-400">No agencies found</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayedAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                        <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {agency.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {agency.county && `${agency.county}, `}{agency.state}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap ml-2">
                      {agency._count.contacts} contacts
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {agency.type && (
                      <div className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                        {agency.type}
                      </div>
                    )}
                    
                    {agency.population !== null && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span>Population: {agency.population.toLocaleString()}</span>
                      </div>
                    )}

                    {agency.website && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Globe className="w-3 h-3 flex-shrink-0" />
                        <a 
                          href={agency.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate"
                        >
                          {agency.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      </div>
                    )}
                    
                    {agency.phone && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {agency.phone}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Loading more agencies...</span>
                </div>
              </div>
            )}

            {/* End of results message */}
            {!hasMore && displayedAgencies.length > 0 && displayedAgencies.length < total && (
              <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                No more agencies to load
              </div>
            )}
          </>
          )}
        </div>
      )}

      {/* Pagination - Only show for table view */}
      {viewMode === 'table' && totalPages > 1 && (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of {total} agencies
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
                          ? 'bg-cyan-600 dark:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 dark:shadow-cyan-500/30'
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
  );
}
