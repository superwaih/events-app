export interface TicketCounts {
  available: number;
  vip_available: number;
  regular_available: number;
  vip_total: number;
  regular_total: number;
}

export interface EventDetails {
  title: string;
  subtitle: string;
  date: string;
  day: string;
  time: string;
  arrivalTime: string;
  location: string;
  city: string;
  price: string;
}