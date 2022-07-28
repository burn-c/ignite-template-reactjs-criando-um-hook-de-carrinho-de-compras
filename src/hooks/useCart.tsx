import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { getProduct, getProductStock } from '../services/products';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount?: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {


    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  console.log('#cart', cart)


  const addProduct = async (productId: number) => {
    try {

      const { amount: amountOnStock } = await getProductStock(productId)
      const productInfos = await getProduct(productId)


      const hasItemOnList = cart.find(item => item.id === productId)

      console.log('#hasItemOnList', hasItemOnList)

      if (hasItemOnList) {
        const quantityOnCart = hasItemOnList.amount

        if ((quantityOnCart + 1) > amountOnStock) {
          toast.error('Quantidade não disponível no estoque!')
          return
        }

        return updateProductAmount({ productId })
      }


      setCart([...cart, { ...productInfos, amount: 1, }])
      toast('Produto adicionado com sucesso! :) ')
    } catch {
      // TODO

      toast.error('Erro ao tentar adicionar produto ao carrinho, tente novamente! :(')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      const updatedCart = cart.map(product => {
        if (product.id === productId) {

          return {
            ...product,
            amount: product.amount + 1
          }
        }

        return product
      })

      setCart(updatedCart)
      toast('Produto adicionado com sucesso! :) ')
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
