"use client";

import { EventFeatures } from "@/components/booking-components/event-features";
import { EventHeader } from "@/components/booking-components/event-header";
import { EventHero } from "@/components/booking-components/event-hero";
import { PaymentInformation } from "@/components/booking-components/payment-information";
import { RegistrationForm } from "@/components/booking-components/registration-form";
import { RegistrationSuccessModal } from "@/components/booking-components/registration-success";
import { TicketAvailability } from "@/components/booking-components/ticket-availability";
import { useEventRegistration } from "@/hooks/use-event-registration";
import { useTicketCounts } from "@/hooks/use-ticket-count";
import { EVENT_DETAILS } from "@/utils/constants";
import { useState } from "react";


export default function EventBooking() {
  const [inviteCode, setInviteCode] = useState('');
const [modalOpen, setModalOpen] = useState(false);
  const { ticketCounts, refetchTicketCounts } = useTicketCounts();
const { form, isSubmitting, onSubmit: handleSubmit } = useEventRegistration(
  ticketCounts, 
  () => {
    refetchTicketCounts();
    setModalOpen(true);
  },
  setInviteCode 
);
  return (
    <div className="min-h-screen bg-white">
      <EventHeader />

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_400px] lg:gap-8">
          {/* Main Content */}
          <div className="min-w-0">
            <EventHero eventDetails={EVENT_DETAILS} />
            <RegistrationForm
              form={form}
              isSubmitting={isSubmitting}
              ticketCounts={ticketCounts}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TicketAvailability ticketCounts={ticketCounts} />
            <PaymentInformation />
            <EventFeatures />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          <EventHero eventDetails={EVENT_DETAILS} />
                    <PaymentInformation />
          <EventFeatures />

          {/* <TicketAvailability ticketCounts={ticketCounts} /> */}
          <RegistrationForm
            form={form}
            isSubmitting={isSubmitting}
            ticketCounts={ticketCounts}
              onSubmit={handleSubmit}

          />

          <RegistrationSuccessModal
  isOpen={modalOpen}
  inviteCode={inviteCode}
  onClose={() => setModalOpen(false)}
/>
        </div>
      </div>
    </div>
  );
}