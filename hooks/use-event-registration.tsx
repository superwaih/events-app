import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { TicketCounts } from '@/types/indext';
import { EventRegistrationForm, eventRegistrationSchema } from '@/utils/schemas';

export function useEventRegistration(ticketCounts: TicketCounts, onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventRegistrationForm>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      pairingChoice: undefined,
      hasAllergies: 'no',
      allergies: '',
    }
  });

  const onSubmit = async (data: EventRegistrationForm) => {
    setIsSubmitting(true);

    try {
      if (ticketCounts.available <= 0) {
        toast({
          title: "Event Sold Out",
          description: "All tickets have been reserved. Please contact us to join the waitlist.",
          variant: "destructive"
        });
        return;
      }

    // ✅ Force null for allergies if 'no'
    const hasAllergies = data.hasAllergies === 'yes';
   const allergies = hasAllergies && (data.allergies ?? '').trim() !== ''
  ? (data.allergies ?? '').trim()
  : "none";

    const inviteCode = `CE${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

const registrationData = {
  full_name: data.fullName,
  email: data.email,
  phone: data.phone,
  pairing_choice: data.pairingChoice,
  has_allergies: data.hasAllergies, // ✅ string: 'yes' or 'no'
  allergies:
    data.hasAllergies === 'yes' && (data.allergies ?? '').trim() !== ''
      ? (data.allergies ?? '').trim()
      : "N/A",
  invite_code: inviteCode,
  registration_date: new Date().toISOString(),
  payment_status: 'pending',
  agreed_to_terms: true
};

    console.log('Data to submit:', registrationData);
      const { error } = await supabase
        .from('registrations')
        .insert([registrationData]);

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: `Your invite code is: ${inviteCode}. Please save this code and proceed with payment.`,
      });

      form.reset();
      onSuccess();

    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
}