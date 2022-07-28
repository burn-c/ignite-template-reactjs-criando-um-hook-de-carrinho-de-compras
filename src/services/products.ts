import { api } from "./api";

interface ProductProps {
  id: number;
  title: string;
  price: number;
  image: string;
}

type getAllProductsData = {
  (): Promise<Array<ProductProps>>
}
export const getAllProducts: getAllProductsData = async () => {
  const { data } = await api.get('/products')

  return data
}

export const getProductStock = async (productId: number) => {
  const { data } = await api.get(`/stock/${productId}`)

  return data
}

export const getProduct = async (productId: number) => {
  const { data } = await api.get(`/products/${productId}`)

  return data
}