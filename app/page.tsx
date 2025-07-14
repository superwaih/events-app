"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Wine, 
  Utensils, 
  Phone, 
  Instagram, 
  CreditCard, 
  ChefHat,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';

interface TicketCounts {
  vip_available: number;
  regular_available: number;
  vip_total: number;
  regular_total: number;
}

export default function EventBooking() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketType: '',
    pairingChoice: '',
    allergies: '',
    hasAllergies: 'no'
  });
  const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
    vip_available: 6,
    regular_available: 24,
    vip_total: 6,
    regular_total: 24
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTicketCounts();
  }, []);

  const fetchTicketCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('ticket_type');
      
      if (error) throw error;

      const vipCount = data?.filter(reg => reg.ticket_type === 'vip').length || 0;
      const regularCount = data?.filter(reg => reg.ticket_type === 'regular').length || 0;

      setTicketCounts({
        vip_available: 6 - vipCount,
        regular_available: 24 - regularCount,
        vip_total: 6,
        regular_total: 24
      });
    } catch (error) {
      console.error('Error fetching ticket counts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions before registering.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const availableTickets = formData.ticketType === 'vip' ? ticketCounts.vip_available : ticketCounts.regular_available;
      
      if (availableTickets <= 0) {
        toast({
          title: "Tickets Sold Out",
          description: `${formData.ticketType.toUpperCase()} tickets are no longer available.`,
          variant: "destructive"
        });
        return;
      }

      const inviteCode = `CE${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const registrationData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ticket_type: formData.ticketType,
        pairing_choice: formData.pairingChoice,
        allergies: formData.hasAllergies === 'yes' ? formData.allergies : null,
        invite_code: inviteCode,
        registration_date: new Date().toISOString(),
        payment_status: 'pending'
      };

      const { error } = await supabase
        .from('registrations')
        .insert([registrationData]);

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: `Your invite code is: ${inviteCode}. Please save this code and proceed with payment.`,
      });

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        ticketType: '',
        pairingChoice: '',
        allergies: '',
        hasAllergies: 'no'
      });
      setAgreedToTerms(false);
      fetchTicketCounts();

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ backgroundColor: 'var(--eds-ui-100)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--eds-ui-300)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ChefHat style={{ width: '32px', height: '32px', color: 'var(--eds-orange-600)' }} />
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: 'var(--eds-ui-800)', 
                margin: '0',
                lineHeight: '1.2'
              }}>
                An Evening of Culinary Experience
              </h1>
              <p style={{ 
                fontSize: '16px', 
                color: 'var(--eds-ui-600)', 
                margin: '4px 0 0',
                fontWeight: '400'
              }}>
                A production of Mias Kitchen and events • For the True Food Enthusiasts
              </p>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
          
          {/* Main Content */}
          <div>
            {/* Event Hero */}
            <div className="card" style={{ marginBottom: '32px' }}>
              <div className="card-content">
                <div style={{ 
                  backgroundColor: 'var(--eds-orange-600)', 
                  color: '#fff', 
                  padding: '40px', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '32px'
                }}>
                  <h2 style={{ 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    margin: '0 0 16px',
                    lineHeight: '1.2'
                  }}>
                    The Tropics
                  </h2>
                  <p style={{ 
                    fontSize: '18px', 
                    margin: '0',
                    opacity: '0.9'
                  }}>
                    3-Course Culinary Experience with Wine/Juice Pairing
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>29th August 2025</div>
                      <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>Friday</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>5:00 PM</div>
                      <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>Arrival: 4:00-4:50 PM</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>Ijapo Extension</div>
                      <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>Akure</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CreditCard style={{ width: '20px', height: '20px', color: 'var(--eds-orange-600)' }} />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>₦35,000</div>
                      <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>Per ticket</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: 'var(--eds-ui-800)', 
                  margin: '0 0 8px'
                }}>
                  Register for Event
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: 'var(--eds-ui-600)', 
                  margin: '0'
                }}>
                  Unlocking the Power of Culinary Excellence: Shaping the Future with Tropical Flavors!
                </p>
              </div>
              
              <div className="card-content">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Personal Information */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="form-label" htmlFor="fullName">Full name *</label>
                      <input
                        id="fullName"
                        className="form-input"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" htmlFor="email">Email address *</label>
                      <input
                        id="email"
                        type="email"
                        className="form-input"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="phone">Phone number *</label>
                    <div style={{ display: 'flex' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '0 12px', 
                        backgroundColor: 'var(--eds-ui-200)', 
                        border: '2px solid var(--eds-ui-400)', 
                        borderRight: 'none',
                        borderRadius: '4px 0 0 4px',
                        fontSize: '16px',
                        color: 'var(--eds-ui-600)'
                      }}>
                        +234
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        className="form-input"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        style={{ 
                          width: '100%', 
                          borderRadius: '0 4px 4px 0',
                          borderLeft: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Ticket Selection */}
                  <div>
                    <label className="form-label">Ticket Type *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      
                      <div 
                        onClick={() => ticketCounts.vip_available > 0 && handleInputChange('ticketType', 'vip')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px',
                          border: `2px solid ${formData.ticketType === 'vip' ? 'var(--eds-orange-600)' : 'var(--eds-ui-400)'}`,
                          borderRadius: '4px',
                          backgroundColor: formData.ticketType === 'vip' ? '#fef7e6' : '#fff',
                          cursor: ticketCounts.vip_available > 0 ? 'pointer' : 'not-allowed',
                          opacity: ticketCounts.vip_available === 0 ? 0.5 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="radio"
                          name="ticketType"
                          value="vip"
                          checked={formData.ticketType === 'vip'}
                          onChange={(e) => handleInputChange('ticketType', e.target.value)}
                          disabled={ticketCounts.vip_available === 0}
                          style={{ marginRight: '12px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Star style={{ width: '16px', height: '16px', color: 'var(--eds-orange-600)' }} />
                            <span style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>VIP Ticket</span>
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>
                            {ticketCounts.vip_available > 0 
                              ? `${ticketCounts.vip_available} of ${ticketCounts.vip_total} available`
                              : 'SOLD OUT'
                            }
                          </div>
                        </div>
                        {ticketCounts.vip_available === 0 && (
                          <span className="badge badge-error">Sold Out</span>
                        )}
                      </div>

                      <div 
                        onClick={() => ticketCounts.regular_available > 0 && handleInputChange('ticketType', 'regular')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px',
                          border: `2px solid ${formData.ticketType === 'regular' ? 'var(--eds-blue-600)' : 'var(--eds-ui-400)'}`,
                          borderRadius: '4px',
                          backgroundColor: formData.ticketType === 'regular' ? '#eff6ff' : '#fff',
                          cursor: ticketCounts.regular_available > 0 ? 'pointer' : 'not-allowed',
                          opacity: ticketCounts.regular_available === 0 ? 0.5 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="radio"
                          name="ticketType"
                          value="regular"
                          checked={formData.ticketType === 'regular'}
                          onChange={(e) => handleInputChange('ticketType', e.target.value)}
                          disabled={ticketCounts.regular_available === 0}
                          style={{ marginRight: '12px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Users style={{ width: '16px', height: '16px', color: 'var(--eds-blue-600)' }} />
                            <span style={{ fontWeight: '600', color: 'var(--eds-ui-800)' }}>Regular Ticket</span>
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--eds-ui-600)' }}>
                            {ticketCounts.regular_available > 0 
                              ? `${ticketCounts.regular_available} of ${ticketCounts.regular_total} available`
                              : 'SOLD OUT'
                            }
                          </div>
                        </div>
                        {ticketCounts.regular_available === 0 && (
                          <span className="badge badge-error">Sold Out</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pairing Selection */}
                  <div>
                    <label className="form-label" htmlFor="pairing">Pairing Choice *</label>
                    <select
                      id="pairing"
                      className="form-input"
                      value={formData.pairingChoice}
                      onChange={(e) => handleInputChange('pairingChoice', e.target.value)}
                      required
                      style={{ width: '100%' }}
                    >
                      <option value="">Select your preferred pairing</option>
                      <option value="wine">Wine Pairing</option>
                      <option value="juice">Juice Pairing</option>
                    </select>
                  </div>

                  {/* Allergies Section */}
                  <div>
                    <label className="form-label">Dietary Requirements *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="hasAllergies"
                          value="no"
                          checked={formData.hasAllergies === 'no'}
                          onChange={(e) => handleInputChange('hasAllergies', e.target.value)}
                        />
                        <span style={{ fontSize: '16px', color: 'var(--eds-ui-800)' }}>
                          No allergies or dietary restrictions
                        </span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="hasAllergies"
                          value="yes"
                          checked={formData.hasAllergies === 'yes'}
                          onChange={(e) => handleInputChange('hasAllergies', e.target.value)}
                        />
                        <span style={{ fontSize: '16px', color: 'var(--eds-ui-800)' }}>
                          I have allergies or dietary restrictions
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.hasAllergies === 'yes' && (
                    <div>
                      <label className="form-label" htmlFor="allergies">
                        Please specify your allergies or dietary restrictions
                      </label>
                      <textarea
                        id="allergies"
                        className="form-textarea"
                        value={formData.allergies}
                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                        placeholder="Please list your allergies or dietary restrictions..."
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}

                  {/* Terms */}
                  <div style={{ 
                    backgroundColor: 'var(--eds-ui-200)', 
                    padding: '16px', 
                    borderRadius: '4px',
                    border: '1px solid var(--eds-ui-300)'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        style={{ marginTop: '2px' }}
                      />
                      <div style={{ fontSize: '14px', color: 'var(--eds-ui-700)' }}>
                        I agree to the event{' '}
                        <span style={{ color: 'var(--eds-blue-600)', textDecoration: 'underline' }}>
                          terms and conditions
                        </span>
                        {' '}and{' '}
                        <span style={{ color: 'var(--eds-blue-600)', textDecoration: 'underline' }}>
                          privacy policy
                        </span>
                        .
                        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--eds-ui-600)' }}>
                          Please review your registration details before submitting.
                        </div>
                      </div>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting || !agreedToTerms || 
                      (formData.ticketType === 'vip' && ticketCounts.vip_available === 0) || 
                      (formData.ticketType === 'regular' && ticketCounts.regular_available === 0)}
                    style={{ width: '100%', fontSize: '16px' }}
                  >
                    {isSubmitting ? 'Processing Registration...' : 'Register'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Ticket Availability */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--eds-ui-800)', 
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Users style={{ width: '18px', height: '18px' }} />
                  Ticket Availability
                </h4>
              </div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#fef7e6', 
                    border: '1px solid #fed7aa',
                    borderRadius: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Star style={{ width: '14px', height: '14px', color: 'var(--eds-orange-600)' }} />
                        <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--eds-ui-800)' }}>
                          VIP Tickets
                        </span>
                      </div>
                      <span className={`badge ${ticketCounts.vip_available > 0 ? 'badge-success' : 'badge-error'}`}>
                        {ticketCounts.vip_available > 0 ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--eds-ui-600)', marginBottom: '8px' }}>
                      {ticketCounts.vip_available} of {ticketCounts.vip_total} remaining
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      backgroundColor: '#fed7aa', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--eds-orange-600)',
                          width: `${((ticketCounts.vip_total - ticketCounts.vip_available) / ticketCounts.vip_total) * 100}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#eff6ff', 
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users style={{ width: '14px', height: '14px', color: 'var(--eds-blue-600)' }} />
                        <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--eds-ui-800)' }}>
                          Regular Tickets
                        </span>
                      </div>
                      <span className={`badge ${ticketCounts.regular_available > 0 ? 'badge-success' : 'badge-error'}`}>
                        {ticketCounts.regular_available > 0 ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--eds-ui-600)', marginBottom: '8px' }}>
                      {ticketCounts.regular_available} of {ticketCounts.regular_total} remaining
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      backgroundColor: '#bfdbfe', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--eds-blue-600)',
                          width: `${((ticketCounts.regular_total - ticketCounts.regular_available) / ticketCounts.regular_total) * 100}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--eds-ui-800)', 
                  margin: '0'
                }}>
                  Payment Information
                </h4>
              </div>
              <div className="card-content">
                <div style={{ 
                  backgroundColor: 'var(--eds-ui-200)', 
                  padding: '16px', 
                  borderRadius: '4px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--eds-ui-600)', marginBottom: '2px' }}>
                        Account Number
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'monospace' }}>
                        0246160583
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--eds-ui-600)', marginBottom: '2px' }}>
                        Account Name
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        Doyinsola Olomolaye
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--eds-ui-600)', marginBottom: '2px' }}>
                        Bank
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        Guarantee Trust Bank
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--eds-ui-300)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <Instagram style={{ width: '16px', height: '16px', color: '#E4405F' }} />
                      <span>@aneveningofculinaryexperience</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <Phone style={{ width: '16px', height: '16px', color: 'var(--eds-green-600)' }} />
                      <span>08135985005</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Features */}
            <div className="card">
              <div className="card-header">
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--eds-ui-800)', 
                  margin: '0'
                }}>
                  What's Included
                </h4>
              </div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Utensils style={{ width: '18px', height: '18px', color: 'var(--eds-orange-600)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--eds-ui-800)' }}>
                      3-Course Culinary Experience
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Wine style={{ width: '18px', height: '18px', color: 'var(--eds-orange-600)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--eds-ui-800)' }}>
                      Wine/Juice Pairing
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ChefHat style={{ width: '18px', height: '18px', color: 'var(--eds-orange-600)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--eds-ui-800)' }}>
                      Tropical Theme Experience
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}