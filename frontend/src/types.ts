export interface ChatMessage {
  id: string;
  employeeName: string;
  text: string;
  createdAt: string;
}
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Employee {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  firstName: string;
  middleInitial?: string | null;
  lastName: string;
}

export interface Order {
  id: number;
  salesPersonId: number;
  customerId: number;
  productId: number;
  quantity: number;
}
