import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required = false, error, children }: FormFieldProps) {
  return (
    <div>
      <label 
        htmlFor={htmlFor}
        className="block text-sm font-medium text-emerald-900 mb-2"
      >
        {label} {required && '*'}
      </label>
      {children}
      {error && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}