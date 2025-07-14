import { Utensils, Wine, ChefHat, NetworkIcon } from 'lucide-react';

export function EventFeatures() {
  return (
    <div className="bg-amber-50 border border-emerald-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-emerald-50 p-4 border-b border-emerald-200">
        <h4 className="text-lg font-semibold text-emerald-900">
          What&apos;s Included
        </h4>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors">
            <Utensils className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm text-emerald-900">
              3-Course Culinary Experience
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors">
            <Wine className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm text-emerald-900">
              Wine/Juice Pairing
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors">
            <ChefHat className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm text-emerald-900">
              Tropical Theme Experience
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors">
            <NetworkIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm text-emerald-900">
              Networking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}