export interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export function getProduct<T>(product: T): T {
  return product;
}
