export type Role = "customer" | "staff" | "admin";

export type Customer = {
  id: string;
  phone: string;
  name: string;
  pinHash: string;
  points: number;
  walletPkr: number;
  cardNumber: string;
  createdAt: string;
};

export type PublicCustomer = Omit<Customer, "pinHash" | "cardNumber"> & {
  cardMasked: string;
};

export type Session = {
  token: string;
  role: Role;
  customerId?: string;
  createdAt: string;
};

export type Fill = {
  id: string;
  code: string;
  litres: number;
  amount: number;
  points: number;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  usedBy: string | null;
};

export type LedgerEntry = {
  id: string;
  customerId: string;
  type: "earn" | "redeem" | "bonus" | "cashback";
  points: number;
  pkr?: number;
  note: string;
  at: string;
};

export type Reward = {
  id: string;
  name: string;
  points: number;
  detail: string;
  kind: "item" | "discount";
  discountPkr: number;
};

export type RedeemRequest = {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  rewardId: string;
  rewardName: string;
  points: number;
  status: "pending" | "done" | "cancelled";
  createdAt: string;
  doneAt: string | null;
};

export type Feedback = {
  id: string;
  customerId: string;
  customerName: string;
  stars: number;
  topic: string;
  comment: string;
  at: string;
};

export type Settings = {
  pointsPerLitre: number;
  qrMinutes: number;
  pkrPerPoint: number;
  lastCashbackMonth: string;
  staffPinHash: string;
  adminEmail: string;
  adminPasswordHash: string;
  rewards: Reward[];
};

export type StoreData = {
  customers: Customer[];
  sessions: Session[];
  fills: Fill[];
  ledger: LedgerEntry[];
  redeems: RedeemRequest[];
  feedback: Feedback[];
  settings: Settings;
};
