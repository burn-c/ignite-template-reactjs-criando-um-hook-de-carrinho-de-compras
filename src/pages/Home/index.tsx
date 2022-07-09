import { useState, useEffect } from 'react';

import { ProductList } from './styles';
// import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
// import { useCart } from '../../hooks/useCart';
import { getAllProducts } from '../../services/products';
import { ProductCard } from '../../components';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

// interface CartItemsAmount {
//   [key: number]: number;
// }

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  // const { addProduct, cart } = useCart();

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //   // TODO
  // }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      try {
        const allProducts = await getAllProducts()

        const allProductsFormatted = allProducts?.map(product => {
          return {
            ...product,
            priceFormatted: formatPrice(product.price)
          }
        })

        setProducts(allProductsFormatted)
      } catch (e) {
        toast.error('Erro ao carregar produtos, tente novamente :(')
      }
    }

    loadProducts();
  }, []);

  // function handleAddProduct(id: number) {
  //   // TODO
  // }

  return (
    <ProductList>
      {
        products.map(product => (<ProductCard product={product} />))
      }
    </ProductList>
  );
};

export default Home;
