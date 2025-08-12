"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Send,
  CreditCard,
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

const EVENT_DATE = 'Friday, August 29th, 2025 at 8:00 PM'
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
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [sendingPaymentReminders, setSendingPaymentReminders] = useState<Set<string>>(new Set());

  // dialog state
  const [confirmTarget, setConfirmTarget] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // email editing state
  const [emailEditTarget, setEmailEditTarget] = useState<Registration | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const [emailType, setEmailType] = useState<"reminder" | "payment">("reminder");

  const fetchData = useCallback(async () => {
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
      toast({
        title: "Failed to fetch registrations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const sendEmailReminder = async (registration: Registration) => {
    setSendingEmails(prev => new Set(prev).add(registration.id));
    
    try {
      const response = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: registration.email,
          fullName: registration.full_name,
          inviteCode: registration.invite_code,
          ticketType: registration.ticket_type,
          pairingChoice: registration.pairing_choice,
          eventDate: EVENT_DATE, // Update this with actual event date
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      toast({
        title: "Email reminder sent!",
        description: `Reminder sent to ${registration.full_name} at ${registration.email}`,
      });
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Failed to send email reminder",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSendingEmails(prev => {
        const updated = new Set(prev);
        updated.delete(registration.id);
        return updated;
      });
    }
  };

  const sendPaymentReminder = async (registration: Registration) => {
    setSendingPaymentReminders(prev => new Set(prev).add(registration.id));
    
    try {
      const response = await fetch('/api/send-payment-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: registration.email,
          fullName: registration.full_name,
          inviteCode: registration.invite_code,
          ticketType: registration.ticket_type,
          pairingChoice: registration.pairing_choice,
          eventDate: EVENT_DATE // Update this with actual event date
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send payment reminder');
      }

      toast({
        title: "Payment reminder sent!",
        description: `Payment reminder sent to ${registration.full_name} at ${registration.email}`,
      });
    } catch (error) {
      console.error('Payment reminder sending error:', error);
      toast({
        title: "Failed to send payment reminder",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSendingPaymentReminders(prev => {
        const updated = new Set(prev);
        updated.delete(registration.id);
        return updated;
      });
    }
  };

  // Email editor functions
  const openEmailEditor = (registration: Registration, type: "reminder" | "payment") => {
    setEmailEditTarget(registration);
    setEmailType(type);
    
    // Set default content based on email type
    if (type === "reminder") {
      setEmailContent(`Dear ${registration.full_name},

This is a friendly reminder about your upcoming event registration.

Event Details:
- Name: ${registration.full_name}
- Ticket Type: ${registration.ticket_type}
- Invite Code: ${registration.invite_code}
- Pairing Choice: ${registration.pairing_choice}
- Event Date: ${EVENT_DATE}

Please keep this email for your records and bring your invite code to the event.

If you have any questions, please don't hesitate to contact us.

Best regards,
The Event Team`);
    } else {
      setEmailContent(`Dear ${registration.full_name},

⚠️ URGENT: Payment Required for Your Event Registration

We noticed that your payment for the event registration is still pending.

Registration Details:
- Name: ${registration.full_name}
- Ticket Type: ${registration.ticket_type}
- Invite Code: ${registration.invite_code}

IMPORTANT: Please complete your payment as soon as possible to secure your spot at the event.

Payment Instructions:
1. Use your invite code: ${registration.invite_code}
2. Contact our payment team at [payment contact]
3. Complete payment within 24 hours to avoid cancellation

If you have already made the payment, please ignore this email or contact us with your payment confirmation.

For immediate assistance, please contact us at [contact information].

Best regards,
The Event Team`);
    }
  };

  const sendEditedEmail = async () => {
    if (!emailEditTarget) return;
    
    const apiEndpoint = emailType === "reminder" ? "/api/send-reminder" : "/api/send-payment-reminder";
    const sendingStateSetter = emailType === "reminder" ? setSendingEmails : setSendingPaymentReminders;
    
    sendingStateSetter(prev => new Set(prev).add(emailEditTarget.id));
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailEditTarget.email,
          fullName: emailEditTarget.full_name,
          inviteCode: emailEditTarget.invite_code,
          ticketType: emailEditTarget.ticket_type,
          pairingChoice: emailEditTarget.pairing_choice,
          eventDate: EVENT_DATE,
          customContent: emailContent, // Send custom content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      toast({
        title: `${emailType === "reminder" ? "Email reminder" : "Payment reminder"} sent!`,
        description: `Email sent to ${emailEditTarget.full_name} at ${emailEditTarget.email}`,
      });
      
      // Close the dialog
      setEmailEditTarget(null);
      setEmailContent("");
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: `Failed to send ${emailType === "reminder" ? "email reminder" : "payment reminder"}`,
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      sendingStateSetter(prev => {
        const updated = new Set(prev);
        updated.delete(emailEditTarget.id);
        return updated;
      });
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

      {/* Email Edit Dialog */}
      <Dialog open={emailEditTarget !== null} onOpenChange={() => setEmailEditTarget(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {emailType === "reminder" ? "Edit Email Reminder" : "Edit Payment Reminder"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Review and customize the email content before sending to {emailEditTarget?.full_name} ({emailEditTarget?.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Email Content
              </label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[300px] bg-zinc-800 border-zinc-700 text-white resize-none"
                placeholder="Enter email content..."
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setEmailEditTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={sendEditedEmail}
              disabled={
                !emailContent.trim() ||
                !!(
                  emailEditTarget &&
                  (sendingEmails.has(emailEditTarget.id) ||
                    sendingPaymentReminders.has(emailEditTarget.id))
                )
              }
            >
              {emailEditTarget && (sendingEmails.has(emailEditTarget.id) || sendingPaymentReminders.has(emailEditTarget.id)) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Email
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

                        {/* Action buttons */}
                        <div className="mt-4 flex justify-end gap-2">
                          {/* Payment reminder button - only show for pending payments */}
                          {registration.payment_status === "pending" && (
                            <Button
                              variant="outline"
                              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                              onClick={() => openEmailEditor(registration, "payment")}
                              disabled={sendingPaymentReminders.has(registration.id)}
                            >
                              {sendingPaymentReminders.has(registration.id) ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CreditCard className="h-4 w-4 mr-2" />
                              )}
                              {sendingPaymentReminders.has(registration.id) ? 'Sending...' : 'Payment Reminder'}
                            </Button>
                          )}
                          
                          {/* General event reminder button */}
                          <Button
                            variant="outline"
                            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            onClick={() => openEmailEditor(registration, "reminder")}
                            disabled={sendingEmails.has(registration.id)}
                          >
                            {sendingEmails.has(registration.id) ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-2" />
                            )}
                            {sendingEmails.has(registration.id) ? 'Sending...' : 'Send Reminder'}
                          </Button>
                          
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
