import { Instagram, Phone } from 'lucide-react';

export function PaymentInformation() {
  return (
    <div className="bg-amber-50 border border-emerald-200 rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="bg-emerald-50 p-4 border-b border-emerald-200">
        <h4 className="text-lg font-semibold text-emerald-900">
          Payment Information
        </h4>
      </div>
      <div className="p-4">
        <div className="bg-emerald-50 p-4 rounded-md mb-4 border border-emerald-200">
          <div className="space-y-2">
            <div>
              <div className="text-xs text-emerald-700 mb-0.5">
                Account Number
              </div>
              <div className="text-lg font-bold text-emerald-900 font-mono tracking-wider">
                0246160583
              </div>
            </div>
            <div>
              <div className="text-xs text-emerald-700 mb-0.5">
                Account Name
              </div>
              <div className="text-sm font-semibold text-emerald-900">
                Doyinsola Olomolaye
              </div>
            </div>
            <div>
              <div className="text-xs text-emerald-700 mb-0.5">
                Bank
              </div>
              <div className="text-sm font-semibold text-emerald-900">
                Guarantee Trust Bank
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-emerald-200 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Instagram className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <span className="text-emerald-900 break-all">@_aecexperience</span>
            </div>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-900">08135985005</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}