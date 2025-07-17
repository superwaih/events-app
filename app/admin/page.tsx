"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Mail,
  Phone,
  Wine,
  AlertTriangle,
  RefreshCw,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// shadcn/ui dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  ticket_type?: string;
  pairing_choice: "wine" | "juice";
  allergies: string | null;
  invite_code: string;
  registration_date: string;
  payment_status: "pending" | "paid";
}

interface Statistics {
  total_registrations: number;
  vip_tickets_sold: number;
  regular_tickets_sold: number;
  vip_tickets_available: number;
  regular_tickets_available: number;
  wine_pairing_count: number;
  juice_pairing_count: number;
  allergies_count: number;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total_registrations: 0,
    vip_tickets_sold: 0,
    regular_tickets_sold: 0,
    vip_tickets_available: 6,
    regular_tickets_available: 24,
    wine_pairing_count: 0,
    juice_pairing_count: 0,
    allergies_count: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // dialog state
  const [confirmTarget, setConfirmTarget] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: registrations, error } = await supabase
        .from("registrations")
        .select("*")
        .order("registration_date", { ascending: false });

      if (error) throw error;

      setRegistrations(registrations || []);
      calculateStatistics(registrations || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Failed to fetch registrations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatistics = (data: Registration[]) => {
    const stats = {
      total_registrations: data.length,
      vip_tickets_sold: data.filter((r) => r.ticket_type === "vip").length,
      regular_tickets_sold: data.filter((r) => r.ticket_type === "regular").length,
      vip_tickets_available: 6 - data.filter((r) => r.ticket_type === "vip").length,
      regular_tickets_available: 24 - data.filter((r) => r.ticket_type === "regular").length,
      wine_pairing_count: data.filter((r) => r.pairing_choice === "wine").length,
      juice_pairing_count: data.filter((r) => r.pairing_choice === "juice").length,
      allergies_count: data.filter(
        (r) => r.allergies !== null && r.allergies.trim() !== ""
      ).length,
    };
    setStatistics(stats);
  };

  // Called after user confirms in the dialog
  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", confirmTarget.id);
      if (error) throw error;

      setRegistrations((prev) => {
        const updated = prev.filter((r) => r.id !== confirmTarget.id);
        // recalc stats from updated list
        calculateStatistics(updated);
        return updated;
      });

      toast({
        title: "Registration deleted",
        description: `${confirmTarget.full_name}'s registration has been removed.`,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Failed to delete registration.",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmTarget(null);
    }
  };

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.invite_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmTarget}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setConfirmTarget(null);
          }
        }}
      >
        <DialogContent className="bg-black border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-400">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This action cannot be undone. This will permanently remove the
              registration from the database.
            </DialogDescription>
          </DialogHeader>

          {confirmTarget && (
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <span className="text-white/60">Name:</span>{" "}
                <span className="font-medium text-white">{confirmTarget.full_name}</span>
              </p>
              <p>
                <span className="text-white/60">Invite Code:</span>{" "}
                <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono">
                  {confirmTarget.invite_code}
                </code>
              </p>
              {confirmTarget.ticket_type && (
                <p>
                  <span className="text-white/60">Ticket:</span>{" "}
                  <span className="uppercase">{confirmTarget.ticket_type}</span>
                </p>
              )}
            </div>
          )}

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isDeleting}
              onClick={() => setConfirmTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={confirmDelete}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page */}
      <div className="min-h-screen bg-black text-white font-sans">
        <header className="border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-white/40 text-sm mt-1">
                An Evening of Culinary Experience
              </p>
            </div>
            <Button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-white rounded-[8px] text-black hover:bg-white/90 transition"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          <Card className="bg-white/5 border border-white/10 shadow-none">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search by name, email, phone, or invite code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 text-white border-white/20 focus:ring-white/10"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Badge className="bg-white/10 text-white border-white/10">
                    {filteredRegistrations.length} results
                  </Badge>
                  {statistics.allergies_count > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-400/30">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {statistics.allergies_count} allergies
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsContent value="all" className="space-y-4">
                  {filteredRegistrations.map((registration) => (
                    <Card
                      key={registration.id}
                      className="bg-white/5 border border-white/10 transition hover:border-white/20"
                    >
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Full name + ticket */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white">
                              <Users className="h-4 w-4 text-white/40" />
                              <span className="font-medium">
                                {registration.full_name}
                              </span>
                              {registration.ticket_type && (
                                <Badge className="bg-white/10 text-white/80 border-white/10 uppercase">
                                  {registration.ticket_type}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-white/60 flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {registration.email}
                            </div>
                            <div className="text-sm text-white/60 flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              0{registration.phone}
                            </div>
                          </div>

                          {/* Pairing + Date + Invite */}
                          <div className="space-y-2">
                            <div className="text-sm text-white/60 flex items-center gap-2">
                              <Wine className="h-3 w-3" />
                              {registration.pairing_choice === "wine"
                                ? "Wine"
                                : "Juice"}{" "}
                              Pairing
                            </div>
                            <div className="text-sm text-white/60 flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {formatDate(registration.registration_date)}
                            </div>
                            <div className="text-sm text-white/60">
                              <span className="font-medium text-white">
                                Invite Code:{" "}
                              </span>
                              <code className="bg-white/10 px-2 py-1 rounded text-xs font-mono">
                                {registration.invite_code}
                              </code>
                            </div>
                          </div>

                          {/* Payment status + allergies */}
                          <div className="space-y-2">
                            <Badge
                              className={`w-fit px-3 py-1 border ${
                                registration.payment_status === "paid"
                                  ? "bg-green-600/30 border-green-500 text-green-300"
                                  : "bg-red-600/30 border-red-500 text-red-300"
                              }`}
                            >
                              {registration.payment_status === "paid"
                                ? "Paid"
                                : "Pending Payment"}
                            </Badge>

                            {registration.allergies && (
                              <div className="bg-red-500/10 border border-red-400/20 rounded p-2">
                                <div className="text-sm text-red-300 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span className="font-medium">Allergies:</span>
                                </div>
                                <p className="text-sm text-red-300 mt-1">
                                  {registration.allergies}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => setConfirmTarget(registration)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
