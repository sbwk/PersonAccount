export type BillingCycle = 'monthly' | 'quarterly' | 'yearly' | 'one_time' | 'unknown';

export type Billing = {
  isPaid: boolean;
  cycle: BillingCycle;
  amount?: number;
  currency?: string;
  renewAt?: string;
};

export type AccountKey = {
  id: string;
  name: string;
  value: string;
  expiresAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type Account = {
  id: string;
  title: string;
  category: string;
  login: string;
  password: string;
  keys?: AccountKey[];
  url?: string;
  registeredAt?: string;
  level?: string;
  expiresAt?: string;
  billing?: Billing;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type VaultPlain = {
  accounts: Account[];
};
