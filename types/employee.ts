export type EmployeeRole =
  | 'admin'
  | 'manager'
  | 'chef'
  | 'sous_chef'
  | 'cashier'
  | 'waiter'
  | 'kitchen'
  | 'delivery'
  | 'cleaner';

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'full_day';

export type EmployeeStatus = 'active' | 'on_leave' | 'inactive';

export interface Shift {
  type:      ShiftType;
  startTime: string;
  endTime:   string;
}

export interface Employee {
  id:             number;
  name:           string;
  role:           EmployeeRole;
  shift:          Shift;
  phone:          string;
  email:          string;
  avatar:         string;
  status:         EmployeeStatus;
  hiredAt:        string;
  totalOrders:    number;
  avgRating:      number;
  completionRate: number;
  department:     string;
}
