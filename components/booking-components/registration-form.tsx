import { UseFormReturn } from 'react-hook-form';

import { AlertTriangle } from 'lucide-react';
import { TicketCounts } from '@/types/indext';
import { EventRegistrationForm } from '@/utils/schemas';
import { FormField } from './form-field';
import { useState } from 'react';

interface RegistrationFormProps {
  form: UseFormReturn<EventRegistrationForm>;
  isSubmitting: boolean;
  ticketCounts: TicketCounts;
  onSubmit: (data: EventRegistrationForm) => void;
}

export function RegistrationForm({ 
  form, 
  isSubmitting, 
  ticketCounts, 
  onSubmit
}: RegistrationFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = form;
  const hasAllergies = watch('hasAllergies');
  const [agreedToTerms, setAgree] = useState(false)

  return (
    <div className="bg-amber-50 border border-emerald-200 rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-50 p-6 border-b border-emerald-200">
        <h3 className="text-xl md:text-2xl font-bold text-emerald-900 mb-2">
          Register for Event
        </h3>
        <p className="text-sm md:text-base text-emerald-700">
          Unlocking the Power of Culinary Excellence: Shaping the Future with Tropical Flavors!
        </p>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField 
              label="Full name" 
              htmlFor="fullName" 
              required 
              error={errors.fullName?.message}
            >
              <input
                id="fullName"
                placeholder="Enter your full name"
                {...register('fullName')}
                className={`w-full px-3 py-3 border-2 rounded-md text-base bg-amber-50 text-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.fullName ? 'border-red-500' : 'border-emerald-200'
                }`}
              />
            </FormField>

            <FormField 
              label="Email address" 
              htmlFor="email" 
              required 
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
                className={`w-full px-3 py-3 border-2 rounded-md text-base bg-amber-50 text-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.email ? 'border-red-500' : 'border-emerald-200'
                }`}
              />
            </FormField>
          </div>

          <FormField 
            label="Phone number" 
            htmlFor="phone" 
            required 
            error={errors.phone?.message}
          >
            <div className="flex">
              <div className="flex items-center px-3 bg-emerald-50 border-2 border-emerald-200 border-r-0 rounded-l-md text-base text-emerald-700 font-medium">
                +234
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register('phone')}
                className={`w-full px-3 py-3 border-2 border-l-0 rounded-r-md text-base bg-amber-50 text-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.phone ? 'border-red-500' : 'border-emerald-200'
                }`}
              />
            </div>
          </FormField>

          {/* Pairing Selection */}
          <FormField 
            label="Pairing Choice" 
            htmlFor="pairing" 
            required 
            error={errors.pairingChoice?.message}
          >
            <select
              id="pairing"
              {...register('pairingChoice')}
              className={`w-full px-3 py-3 border-2 rounded-md text-base bg-amber-50 text-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.pairingChoice ? 'border-red-500' : 'border-emerald-200'
              }`}
            >
              <option value="">Select your preferred pairing</option>
              <option value="wine">Wine Pairing</option>
              <option value="juice">Juice Pairing</option>
            </select>
          </FormField>

          {/* Allergies Section */}
          <FormField 
            label="Dietary Requirements" 
            required 
            error={errors.hasAllergies?.message}
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <input
                  type="radio"
                  value="no"
                  {...register('hasAllergies')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-emerald-900">
                  No allergies or dietary restrictions
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <input
                  type="radio"
                  value="yes"
                  {...register('hasAllergies')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-emerald-900">
                  I have allergies or dietary restrictions
                </span>
              </label>
            </div>
          </FormField>

          {hasAllergies === 'yes' && (
            <FormField 
              label="Please specify your allergies or dietary restrictions" 
              htmlFor="allergies" 
              required 
              error={errors.allergies?.message}
            >
              <textarea
                id="allergies"
                {...register('allergies')}
                placeholder="Please list your allergies or dietary restrictions..."
                rows={3}
                className={`w-full px-3 py-3 border-2 rounded-md text-base bg-amber-50 text-emerald-900 transition-colors resize-vertical min-h-[5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.allergies ? 'border-red-500' : 'border-emerald-200'
                }`}
              />
            </FormField>
          )}

          {/* Terms */}
          <div className={`bg-emerald-50 p-4 rounded-md border ${
            !agreedToTerms ? 'border-red-500' : 'border-emerald-200'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
 checked={agreedToTerms}
  onChange={() => setAgree(!agreedToTerms)}

                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-sm text-emerald-700">
                I agree to the event{' '}
                <span className="text-emerald-600 underline hover:text-emerald-800 transition-colors">
                  terms and conditions
                </span>
                {' '}and{' '}
                <span className="text-emerald-600 underline hover:text-emerald-800 transition-colors">
                  privacy policy
                </span>
                .
                <div className="mt-2 text-xs text-emerald-600">
                  Please review your registration details before submitting.
                </div>
              </div>
            </label>
            {!agreedToTerms && (
              <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
               Please Kindly Agree to terms
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || ticketCounts.available === 0}
            className={`w-full text-base font-semibold py-3.5 px-6 rounded-md border-none transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              ticketCounts.available === 0 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : isSubmitting
                  ? 'bg-emerald-500 text-amber-50 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-amber-50 cursor-pointer hover:from-emerald-700 hover:to-emerald-800'
            }`}
          >
            {isSubmitting 
              ? 'Processing Registration...' 
              : ticketCounts.available === 0 
                ? 'Event Sold Out' 
                : 'Register'
            }
          </button>
        </form>
      </div>
    </div>
  );
}