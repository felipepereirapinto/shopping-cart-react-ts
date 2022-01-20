import { useState } from 'react'
import { useQuery } from 'react-query'
// My components
import Item from './Item/Item'
import Cart from './Cart/Cart'
// Material UI Components
import { Badge, Drawer, Grid, LinearProgress } from '@material-ui/core'
import { AddShoppingCart } from '@material-ui/icons'
// Styled Components
import { StyledButton, Wrapper } from './App.styles'
// Types
export type CartItemType = {
  id: number
  category: string
  description: string
  image: string
  price: number
  title: string
  amount: number
}

const getProducts = async (): Promise<CartItemType[]> =>
  await (
    await fetch('https://fakestoreapi.com/products')
  ).json()

const App = () => {
  const [cartIsOpen, setCartIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as CartItemType[])

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  )
  console.log(data)

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((acc: number, item) => acc + item.amount, 0)

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(previous => {
      // 1. Is the item already in the cart?
      const isItemInCart = previous.find(item => item.id === clickedItem.id)

      if(isItemInCart) {
        return previous.map(item => (
          item.id === clickedItem.id
            ? {...item, amount: item.amount + 1}
            : item
        ))
      }

      // First time the item is added
      return [...previous, {...clickedItem, amount: 1}]
    })
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(previous => (
      previous.reduce((acc, item) => {
        if (item.id === id) {
          if (item.amount === 1) return acc
          return [...acc, {...item, amount: item.amount - 1}]
        } else {
          return [...acc, item]
        }
      }, [] as CartItemType[])
    ))
  }

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went wrong...</div>

  return (
    <Wrapper>
      <Drawer anchor='right' open={cartIsOpen} onClose={() => setCartIsOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>

      <StyledButton onClick={() => setCartIsOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCart />
        </Badge>
      </StyledButton>

      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App
