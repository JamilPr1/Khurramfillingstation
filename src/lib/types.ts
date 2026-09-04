export type Role = "customer" | "staff";

export type Customer = {
  id: string;
  phone: string;
  name: string;
  points: number;
  createdAt: string;
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
  type: "earn" | "redeem" | "bonus";
  points: number;
  note: string;
  at: string;
};

export type Reward = {
  id: string;
  name: string;
  points: number;
  detail: string;
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

export type StoreData = {
  customers: Customer[];
  sessions: Session[];
  fills: Fill[];
  ledger: LedgerEntry[];
  redeems: RedeemRequest[];
  feedback: Feedback[];
};
