// Material UI Components
import { Button } from '@material-ui/core'
// Styles
import { Wrapper } from './Item.styles'
// Types
import { CartItemType } from '../App'

type Props = {
  item: CartItemType
  handleAddToCart: (clickedItem: CartItemType) => void
}

const Item: React.FC<Props> = ({ item, handleAddToCart }) => (
  <Wrapper>
    <img src={item.image} alt={item.title} />
    <div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <h3>{item.price}</h3>
    </div>
    <Button onClick={() => handleAddToCart(item)}>Add to cart</Button>
  </Wrapper>
)

export default Item