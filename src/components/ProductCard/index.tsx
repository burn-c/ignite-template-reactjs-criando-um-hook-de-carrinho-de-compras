import { MdAddShoppingCart } from "react-icons/md"
import { useCart } from "../../hooks/useCart"

type ProductProps = {
  image: string
  title: string
  price: number
  priceFormatted: string
  id: number
}

type ProductCardProps = {
  product: ProductProps
}

const ProductCard = ({ product: { id, price, priceFormatted, image, title } }: ProductCardProps): JSX.Element => {
  const { addProduct } = useCart()

  const handleAddProduct = (productId: number) => {
    addProduct(productId)
  }


  return (
    <li key={`product-card-${id}`}>
      <img src={image} alt={title} />
      <strong>{title}</strong>
      <span>{priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => handleAddProduct(id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {/* {cartItemsAmount[product.id] || 0} */} 2
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  )
}

export default ProductCard