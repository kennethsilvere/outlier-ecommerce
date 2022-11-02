import { ReactElement, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { CartContext } from '../../store/cart-context'
import { Box, Button, List, ListItemText, ListItem, CircularProgress } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

const ShoppingCart: React.FC = (props): ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const cartCtx = useContext(CartContext)
  const router = useRouter()

  const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    padding: 2
  }

  const checkoutCart = async () => {
    setIsLoading(true)
    const orderId = await cartCtx?.saveOrder()
    setIsLoading(false)
    router.push(`/checkout/${orderId}`)
  }

  const removeItemFromCart = async (product_id: number) => {
    setIsLoading(true)
    await cartCtx!.removeItemFromCart(product_id)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            width: '100%',
            zIndex: 99999,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#f0f8ffb7',
              position: 'absolute'
            }}
          ></div>
          <CircularProgress />
        </Box>
      )}

      <List sx={style} component='nav' aria-label='Shopping Cart'>
        {cartCtx?.cartItems &&
          cartCtx?.cartItems.map((item) => {
            return (
              <Box key={item.product_id} mr={1}>
                <ListItem divider>
                  <div>
                    <div>
                      <ListItemText
                        primary={item.product_name}
                        secondary={`X ${item.quantity}`}
                      />
                    </div>
                    <div
                      onClick={() => removeItemFromCart(item.product_id)}
                      style={{ position: 'relative', right: '2px' }}
                    >
                      <RemoveCircleIcon style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                </ListItem>
              </Box>
            )
          })}

        {cartCtx?.cartItems.length == 0 && <p>No items in cart.</p>}
        <Box>
          <h5>Subtotal: {cartCtx?.getCartSubTotal()}</h5>
          <h5>Tax: {cartCtx?.getCalculatedTaxOnCartItems()}</h5>
          <h5>Total: {cartCtx?.getCartTotal()}</h5>
        </Box>

        {cartCtx && cartCtx?.cartItems.length > 0 && (
          <Button
            variant='contained'
            onClick={() => {
              checkoutCart()
            }}
          >
            Checkout
          </Button>
        )}
      </List>
    </>
  )
}

export default ShoppingCart
