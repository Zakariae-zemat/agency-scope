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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Search, Eye, EyeOff, ExternalLink, TrendingUp, Download } from 'lucide-react';
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
}

export function ContactsTable({
  contacts,
  viewedContactIds,
  currentPage,
  totalPages,
  total,
  remainingViews,
}: ContactsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [viewingContact, setViewingContact] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', '1');

    startTransition(() => {
      router.push(`/contacts?${params.toString()}`);
    });
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    startTransition(() => {
      router.push(`/contacts?${params.toString()}`);
    });
  };

  const handleExport = async () => {
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
    if (remainingViews === 0) {
      setShowUpgradeModal(true);
      return;
    }

    if (viewedContactIds.has(contactId)) {
      setViewingContact(contactId);
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
      <div className="space-y-4">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts by name, title, or department..."
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
              
              <Button variant="outline" onClick={handleExport} disabled={isPending}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Warning banner when low on views */}
        {remainingViews <= 10 && remainingViews > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">
                      Only {remainingViews} views remaining today
                    </p>
                    <p className="text-sm text-orange-700">
                      Upgrade to get unlimited access to all contacts
                    </p>
                  </div>
                </div>
                <Link href="/upgrade">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                        No contacts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => {
                      const isViewed = viewedContactIds.has(contact.id);
                      const isViewing = viewingContact === contact.id;

                      return (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div>
                                {contact.firstName} {contact.lastName}
                              </div>
                              {isViewed && (
                                <span title="Already viewed">
                                  <EyeOff className="h-4 w-4 text-slate-400" />
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {contact.title ? (
                              <Badge variant="secondary">{contact.title}</Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {contact.agency ? (
                              <div>
                                <div className="text-sm">{contact.agency.name}</div>
                                {contact.agency.state && (
                                  <div className="text-xs text-slate-500">
                                    {contact.agency.state}
                                  </div>
                                )}
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {contact.department || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={isViewed ? 'outline' : 'default'}
                              onClick={() => handleViewContact(contact.id)}
                              disabled={isPending}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {isViewed ? 'View Again' : 'View Details'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
              {Math.min(currentPage * 20, total)} of {total} contacts
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

      {/* Contact Details Dialog */}
      <Dialog open={viewingContact !== null} onOpenChange={() => setViewingContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              Full information for this contact
            </DialogDescription>
          </DialogHeader>
          {viewingContact && (() => {
            const contact = contacts.find((c) => c.id === viewingContact);
            if (!contact) return null;

            return (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <p className="text-lg font-semibold">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>

                {contact.title && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Title</label>
                    <p>{contact.title}</p>
                  </div>
                )}

                {contact.department && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Department</label>
                    <p>{contact.department}</p>
                  </div>
                )}

                {contact.email && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:underline block"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}

                {contact.phone && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:underline block"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}

                {contact.agency && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Agency</label>
                    <p>{contact.agency.name}</p>
                    {contact.agency.state && (
                      <p className="text-sm text-slate-600">{contact.agency.state}</p>
                    )}
                  </div>
                )}

                {contact.contactFormUrl && (
                  <div>
                    <a
                      href={contact.contactFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      Contact Form
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daily Limit Reached</DialogTitle>
            <DialogDescription>
              You've reached your daily limit of 50 contact views
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                Upgrade to Premium to get <strong>unlimited</strong> access to all contacts
                and agencies.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeModal(false)}>
                Maybe Later
              </Button>
              <Link href="/upgrade" className="flex-1">
                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
