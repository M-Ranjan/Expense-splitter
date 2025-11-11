export interface Person {
  id: string;
  name: string;
}


export interface ExpenseSplit {
  personId: string;
  amount: number;
}


export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splitType: 'equal' | 'custom';
  splits: ExpenseSplit[];
}


export interface Balance {
  personId: string;
  personName: string;
  balance: number;
  paid: number;
  owes: number;
}


export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
