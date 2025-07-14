// import { ChefHat } from 'lucide-react';

// export function EventHeader() {
//   return (
//     <header style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--eds-ui-300)' }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <ChefHat style={{ width: '32px', height: '32px', color: 'var(--eds-orange-600)' }} />
//           <div>
//             <h1 style={{ 
//               fontSize: '28px', 
//               fontWeight: '700', 
//               color: 'var(--eds-ui-800)', 
//               margin: '0',
//               lineHeight: '1.2'
//             }}>
//               An Evening of Culinary Experience
//             </h1>
//             <p style={{ 
//               fontSize: '16px', 
//               color: 'var(--eds-ui-600)', 
//               margin: '4px 0 0',
//               fontWeight: '400'
//             }}>
//               A production of Mias Kitchen and events • For the True Food Enthusiasts
//             </p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

import { ChefHat } from 'lucide-react';

export function EventHeader() {
  return (
    <header className="bg-amber-50 border-b border-emerald-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="flex items-center gap-4 flex-wrap">
          <ChefHat className="w-8 h-8 text-emerald-600 flex-shrink-0" />
          <div className="flex-1 min-w-[250px]">
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 leading-tight">
              An Evening of Culinary Experience
            </h1>
            <p className="text-sm md:text-base text-emerald-700 mt-1 font-normal">
              A production of Mias Kitchen and events • For the True Food Enthusiasts
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}