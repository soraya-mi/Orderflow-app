export type Product = {
  id: string;
  name: string;
  priceCents: number;
};

export type Address = {
  fullName: string;
  line1: string;
  city: string;
  country: string;
};

export type Payment = {
  cardNumber: string;
  exp: string;
  cvc: string;
};

export type OrderForm = {
  address: Address;
  payment: Payment;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "error";
