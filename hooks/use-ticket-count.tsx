import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TicketCounts } from '@/types/indext';

export function useTicketCounts() {
  const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
    available: 20,
    total: 20
  });

  const fetchTicketCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id');
      
      if (error) throw error;

      const registeredCount = data?.length || 0;

      setTicketCounts({
        available: 20 - registeredCount,
        total: 20
      });
    } catch (error) {
      console.error('Error fetching ticket counts:', error);
    }
  };

  useEffect(() => {
    fetchTicketCounts();
  }, []);

  return { ticketCounts, refetchTicketCounts: fetchTicketCounts };
}