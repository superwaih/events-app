import { TicketCounts } from '@/types/indext';
import { Users, Leaf } from 'lucide-react';

interface TicketAvailabilityProps {
  ticketCounts: TicketCounts;
}

export function TicketAvailability({ ticketCounts }: TicketAvailabilityProps) {
  const soldPercentage = ((ticketCounts.total - ticketCounts.available) / ticketCounts.total) * 100;
  
  return (
    <div className="bg-amber-50 border border-emerald-200 rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="bg-emerald-50 p-4 border-b border-emerald-200">
        <h4 className="text-lg font-semibold text-emerald-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Ticket Availability
        </h4>
      </div>
      <div className="p-4">
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-md">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-sm text-emerald-900">
                Tropical Experience Tickets
              </span>
            </div>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-amber-50 ${
              ticketCounts.available > 0 ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              {ticketCounts.available > 0 ? 'Available' : 'Sold Out'}
            </span>
          </div>
          <div className="text-xs text-emerald-700 mb-2">
            {ticketCounts.available} of {ticketCounts.total} remaining
          </div>
          <div className="w-full h-1.5 bg-emerald-300 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-300 ease-out"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
          {ticketCounts.available <= 5 && ticketCounts.available > 0 && (
            <div className="mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-800 text-center font-medium">
              ⚡ Only {ticketCounts.available} tickets left!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}