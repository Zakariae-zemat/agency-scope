'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ExternalLink, Search, Users, Download } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search agencies or counties..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch} disabled={isPending}>
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              
              <Button variant="outline" onClick={handleExport} disabled={isPending}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agency Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Population</TableHead>
                  <TableHead className="text-center">Contacts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      No agencies found
                    </TableCell>
                  </TableRow>
                ) : (
                  agencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{agency.name}</div>
                          {agency.county && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {agency.county}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {agency.type && (
                          <Badge variant="secondary">{agency.type}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {agency.state && (
                          <div className="flex items-center gap-1">
                            <span>{agency.state}</span>
                            {agency.stateCode && (
                              <span className="text-xs text-slate-500">
                                ({agency.stateCode})
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {agency.population
                          ? agency.population.toLocaleString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span>{agency._count.contacts}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {agency.website && (
                          <a
                            href={agency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {(currentPage - 1) * 20 + 1} to{' '}
            {Math.min(currentPage * 20, total)} of {total} agencies
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
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
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    disabled={isPending}
                    className="min-w-[2.5rem]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || isPending}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
