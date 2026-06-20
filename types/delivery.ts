export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface DeliveryItem {
  name:     string;
  quantity: number;
}

export interface Rider {
  id:              string;
  name:            string;
  phone:           string;
  isOnline:        boolean;
  activeOrderId:   string | null;
  rating:          number;
  deliveriesToday: number;
}

export interface DeliveryOrder {
  id:               string;
  customerName:     string;
  customerPhone:    string;
  address:          string;
  district:         string;
  status:           DeliveryStatus;
  riderId:          string | null;
  riderName:        string | null;
  items:            DeliveryItem[];
  totalAmount:      number;
  distanceKm:       number;
  estimatedMinutes: number;
  createdAt:        string;
  notes?:           string;
}

/** JSON shape — `minutesAgo` resolved to `createdAt` by the service */
export interface RawDeliveryOrder extends Omit<DeliveryOrder, 'createdAt'> {
  minutesAgo: number;
}
