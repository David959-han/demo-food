export type LoyaltyTier   = 'bronze' | 'silver' | 'gold' | 'platinum';
export type LoyaltyStatus = 'active' | 'inactive';

export type PointsTransactionType = 'earned' | 'redeemed' | 'expired' | 'bonus';

export interface PointsTransaction {
  id:          number;
  type:        PointsTransactionType;
  points:      number;
  description: string;
  date:        string;
}

export interface LoyaltyMember {
  id:          number;
  name:        string;
  phone:       string;
  email:       string;
  avatar:      string;
  tier:        LoyaltyTier;
  status:      LoyaltyStatus;
  points:      number;
  totalOrders: number;
  totalSpent:  number;
  joinedAt:    string;
  lastVisit:   string;
  history:     PointsTransaction[];
}
