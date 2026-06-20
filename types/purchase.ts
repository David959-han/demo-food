export type PurchaseStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export interface Supplier {
  id:      number;
  name:    string;
  contact: string;
  phone:   string;
  email:   string;
  address: string;
}

export interface PurchaseItem {
  name:      string;
  quantity:  number;
  unit:      string;
  unitPrice: number;
  total:     number;
}

export interface Purchase {
  id:          number;
  orderNumber: string;
  supplierId:  number;
  supplier:    string;
  items:       PurchaseItem[];
  status:      PurchaseStatus;
  totalAmount: number;
  orderedAt:   string;
  expectedAt:  string;
  deliveredAt: string | null;
  notes?:      string;
}
