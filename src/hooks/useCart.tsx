import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { getProduct, getProductStock } from '../services/products';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
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

  const updatedCartAmount = (updatedCart: Product[]) => {
    setCart(updatedCart)
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
  }

  const addProduct = async (productId: number) => {
    try {
      const { amount: amountOnStock } = await getProductStock(productId)

      const updatedCart = [...cart]
      const hasItemOnCart = updatedCart.find(item => item.id === productId)
      const currentAmout = hasItemOnCart ? hasItemOnCart.amount : 0
      const newAmount = currentAmout + 1

      if (newAmount > amountOnStock) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      if (hasItemOnCart) {
        hasItemOnCart.amount = newAmount

      } else {
        const productInfos = await getProduct(productId)

        const newProduct = {
          ...productInfos,
          amount: 1
        }

        updatedCart.push(newProduct)
      }

      updatedCartAmount(updatedCart)
    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const updatedCart = [...cart]
      const findProductIndex = updatedCart.findIndex(product => product.id === productId)
      const hasProductOnCart = findProductIndex >= 0

      if (hasProductOnCart) {
        updatedCart.splice(findProductIndex, 1)

        updatedCartAmount(updatedCart)
      } else {
        throw Error()
      }
    } catch {
      toast.error('Erro na remoção do produto');
      return
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) return

      const { amount: amountOnStock } = await getProductStock(productId)

      const updatedCart = [...cart]
      const hasItemOnCart = updatedCart.find(item => item.id === productId)

      if (amount > amountOnStock) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      if (hasItemOnCart) {
        hasItemOnCart.amount = amount

        updatedCartAmount(updatedCart)
      } else {
        throw Error()
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
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



