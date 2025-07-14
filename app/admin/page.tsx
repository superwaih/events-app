"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Ticket, 
  Calendar, 
  Mail, 
  Phone, 
  Wine, 
  AlertTriangle,
  Star,
  RefreshCw,
  Search
} from 'lucide-react';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  ticket_type: 'vip' | 'regular';
  pairing_choice: 'wine' | 'juice';
  allergies: string | null;
  invite_code: string;
  registration_date: string;
  payment_status: 'pending' | 'paid';
}

interface Statistics {
  total_registrations: number;
  vip_tickets_sold: number;
  regular_tickets_sold: number;
  vip_tickets_available: number;
  regular_tickets_available: number;
  wine_pairing_count: number;
  juice_pairing_count: number;
  allergies_count: number;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total_registrations: 0,
    vip_tickets_sold: 0,
    regular_tickets_sold: 0,
    vip_tickets_available: 6,
    regular_tickets_available: 24,
    wine_pairing_count: 0,
    juice_pairing_count: 0,
    allergies_count: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: registrations, error } = await supabase
        .from('registrations')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) throw error;

      setRegistrations(registrations || []);
      calculateStatistics(registrations || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatistics = (data: Registration[]) => {
    const stats = {
      total_registrations: data.length,
      vip_tickets_sold: data.filter(r => r.ticket_type === 'vip').length,
      regular_tickets_sold: data.filter(r => r.ticket_type === 'regular').length,
      vip_tickets_available: 6 - data.filter(r => r.ticket_type === 'vip').length,
      regular_tickets_available: 24 - data.filter(r => r.ticket_type === 'regular').length,
      wine_pairing_count: data.filter(r => r.pairing_choice === 'wine').length,
      juice_pairing_count: data.filter(r => r.pairing_choice === 'juice').length,
      allergies_count: data.filter(r => r.allergies !== null).length,
    };
    setStatistics(stats);
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phone.includes(searchTerm) ||
    reg.invite_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-teal-50">
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">An Evening of Culinary Experience</p>
            </div>
            <Button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Registrations</p>
                  <p className="text-3xl font-bold text-blue-600">{statistics.total_registrations}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">VIP Tickets</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {statistics.vip_tickets_sold}/6
                  </p>
                  <p className="text-xs text-gray-500">
                    {statistics.vip_tickets_available} available
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Regular Tickets</p>
                  <p className="text-3xl font-bold text-green-600">
                    {statistics.regular_tickets_sold}/24
                  </p>
                  <p className="text-xs text-gray-500">
                    {statistics.regular_tickets_available} available
                  </p>
                </div>
                <Ticket className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pairing Preferences</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Wine: {statistics.wine_pairing_count}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Juice: {statistics.juice_pairing_count}
                    </Badge>
                  </div>
                </div>
                <Wine className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, phone, or invite code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm">
                  {filteredRegistrations.length} results
                </Badge>
                {statistics.allergies_count > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {statistics.allergies_count} allergies
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Details */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Registration Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Registrations</TabsTrigger>
                <TabsTrigger value="vip">VIP Tickets</TabsTrigger>
                <TabsTrigger value="regular">Regular Tickets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="space-y-4">
                  {filteredRegistrations.map((registration) => (
                    <Card key={registration.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{registration.full_name}</span>
                              <Badge variant={registration.ticket_type === 'vip' ? 'default' : 'secondary'}>
                                {registration.ticket_type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span>{registration.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{registration.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Wine className="h-3 w-3 text-purple-500" />
                              <span>{registration.pairing_choice === 'wine' ? 'Wine' : 'Juice'} Pairing</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              <span>{formatDate(registration.registration_date)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Invite Code: </span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {registration.invite_code}
                              </code>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Badge 
                              variant={registration.payment_status === 'paid' ? 'default' : 'destructive'}
                              className="w-fit"
                            >
                              {registration.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                            </Badge>
                            {registration.allergies && (
                              <div className="bg-red-50 border border-red-200 rounded p-2">
                                <div className="flex items-center gap-1 text-sm text-red-700">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span className="font-medium">Allergies:</span>
                                </div>
                                <p className="text-sm text-red-600 mt-1">{registration.allergies}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="vip" className="space-y-4">
                <div className="space-y-4">
                  {filteredRegistrations.filter(r => r.ticket_type === 'vip').map((registration) => (
                    <Card key={registration.id} className="border-yellow-200">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{registration.full_name}</span>
                              <Badge className="bg-yellow-500">VIP</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span>{registration.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{registration.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Wine className="h-3 w-3 text-purple-500" />
                              <span>{registration.pairing_choice === 'wine' ? 'Wine' : 'Juice'} Pairing</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              <span>{formatDate(registration.registration_date)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Invite Code: </span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {registration.invite_code}
                              </code>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Badge 
                              variant={registration.payment_status === 'paid' ? 'default' : 'destructive'}
                              className="w-fit"
                            >
                              {registration.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                            </Badge>
                            {registration.allergies && (
                              <div className="bg-red-50 border border-red-200 rounded p-2">
                                <div className="flex items-center gap-1 text-sm text-red-700">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span className="font-medium">Allergies:</span>
                                </div>
                                <p className="text-sm text-red-600 mt-1">{registration.allergies}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="regular" className="space-y-4">
                <div className="space-y-4">
                  {filteredRegistrations.filter(r => r.ticket_type === 'regular').map((registration) => (
                    <Card key={registration.id} className="border-green-200">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{registration.full_name}</span>
                              <Badge variant="secondary">REGULAR</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span>{registration.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{registration.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Wine className="h-3 w-3 text-purple-500" />
                              <span>{registration.pairing_choice === 'wine' ? 'Wine' : 'Juice'} Pairing</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              <span>{formatDate(registration.registration_date)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Invite Code: </span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {registration.invite_code}
                              </code>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Badge 
                              variant={registration.payment_status === 'paid' ? 'default' : 'destructive'}
                              className="w-fit"
                            >
                              {registration.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                            </Badge>
                            {registration.allergies && (
                              <div className="bg-red-50 border border-red-200 rounded p-2">
                                <div className="flex items-center gap-1 text-sm text-red-700">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span className="font-medium">Allergies:</span>
                                </div>
                                <p className="text-sm text-red-600 mt-1">{registration.allergies}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}