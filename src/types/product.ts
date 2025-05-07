import { Product, getProduct } from './types';

const product: Product = {
  id: 'abc123',
  name: 'Laptop',
  price: '1500',
  quantity: 3
};

const result = getProduct(product);
console.log(result);
