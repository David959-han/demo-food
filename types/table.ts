export type TableStatus  = 'free' | 'occupied' | 'reserved' | 'cleaning';
export type TableSection = 'main' | 'terrace' | 'vip';

export interface Table {
  id:             number;
  number:         number;
  capacity:       number;
  section:        TableSection;
  status:         TableStatus;
  currentOrderId: number | null;
}
