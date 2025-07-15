"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Instagram, Phone, Copy } from "lucide-react";

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  inviteCode: string;
  onClose: () => void;
}

export const RegistrationSuccessModal = ({
  isOpen,
  inviteCode,
  onClose,
}: RegistrationSuccessModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("0246160583");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] h-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-700 text-xl font-semibold">
            🎉 Registration Confirmed!
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-emerald-800 space-y-3 mb-4">
          <p>Thank you for registering.</p>
          <p>
            Your invite code is: <span className="font-bold">{inviteCode}</span>
          </p>
          <p>
            <span className="font-medium text-emerald-700">Note:</span> Attendance will only be confirmed after successful payment.
          </p>
          <p className="text-[13px] text-red-600">
            <strong>Note:</strong> attendance will only be confirmed after successful payment is made within <strong>24hrs</strong>. If not, it’s <strong>void</strong>.
          </p>
        </div>

        {/* Payment Info */}
        <div className="bg-amber-50 border border-emerald-200 rounded-lg p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 mb-2">
              Payment Information
            </h4>
            <div className="bg-emerald-50 p-3 rounded-md border border-emerald-200 space-y-3">
              <div>
                <div className="text-xs text-emerald-700">Account Number</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-emerald-900 font-mono tracking-wider">
                    0246160583
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center text-xs text-emerald-700 hover:text-emerald-900"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-xs text-emerald-700">Account Name</div>
                <div className="text-sm font-semibold text-emerald-900">
                  Doyinsola Olomolaye
                </div>
              </div>

              <div>
                <div className="text-xs text-emerald-700">Bank</div>
                <div className="text-sm font-semibold text-emerald-900">
                  Guaranty Trust Bank
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Instagram className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <a
                href="https://instagram.com/_aecexperience"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-900 underline hover:text-emerald-700"
              >
                @_aecexperience
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-900">08135985005</span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 h-fit">
          <Button onClick={onClose} className="bg-emerald-600 text-white hover:bg-emerald-700">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
