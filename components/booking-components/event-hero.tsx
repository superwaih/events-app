// import { EventDetails } from '@/types/indext';
// import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';

// interface EventHeroProps {
//   eventDetails: EventDetails;
// }

// export function EventHero({ eventDetails }: EventHeroProps) {
//   return (
//     <div className="card" style={{ marginBottom: '32px' }}>
//       <div className="card-content">
//         <div style={{ 
//           backgroundColor: 'var(--eds-orange-600)', 
//           color: '#fff', 
//           padding: '40px', 
//           borderRadius: '8px',
//           textAlign: 'center',
//           marginBottom: '32px'
//         }}>
//           <h2 style={{ 
//             fontSize: '36px', 
//             fontWeight: '700', 
//             margin: '0 0 16px',
//             lineHeight: '1.2'
//           }}>
//             {eventDetails.title}
//           </h2>
//           <p style={{ 
//             fontSize: '18px', 
//             margin: '0',
//             opacity: '0.9'
//           }}>
//             {eventDetails.subtitle}
//           </p>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <Calendar style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
//             <div>
//               <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>{eventDetails.date}</div>
//               <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>{eventDetails.day}</div>
//             </div>
//           </div>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <Clock style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
//             <div>
//               <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>{eventDetails.time}</div>
//               <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>Arrival: {eventDetails.arrivalTime}</div>
//             </div>
//           </div>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <MapPin style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
//             <div>
//               <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>{eventDetails.location}</div>
//               <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>{eventDetails.city}</div>
//             </div>
//           </div>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <CreditCard style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
//             <div>
//               <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>{eventDetails.price}</div>
//               <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>Per ticket</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { EventDetails } from '@/types/indext';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';

interface EventHeroProps {
  eventDetails: EventDetails;
}

export function EventHero({ eventDetails }: EventHeroProps) {
  return (
    <div className="bg-amber-50 border border-emerald-200 rounded-lg shadow-md mb-8 overflow-hidden">
      <div className="p-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-amber-50 p-8 md:p-10 rounded-lg text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {eventDetails.title}
          </h2>
          <p className="text-lg md:text-xl opacity-95">
            {eventDetails.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-emerald-900">{eventDetails.date}</div>
              <div className="text-sm text-emerald-700">{eventDetails.day}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-emerald-900">{eventDetails.time}</div>
              <div className="text-sm text-emerald-700">Arrival: {eventDetails.arrivalTime}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-emerald-900">{eventDetails.location}</div>
              <div className="text-sm text-emerald-700">{eventDetails.city}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-emerald-900">{eventDetails.price}</div>
              <div className="text-sm text-emerald-700">Per ticket</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}