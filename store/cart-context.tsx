import { createContext, ReactElement, useEffect, useState } from 'react'

type ShoppingCartItem = {
  product_name: string
  product_id: number
  quantity: number
  price: number
}

type ItemToAdd = { id: number; name: string; price: number }

interface CartContextInterface {
  cartItems: ShoppingCartItem[]
  removeItemFromCart: (productId: number) => Promise<boolean>
  addItemToCart: (product: ItemToAdd) => void
  saveOrder: () => Promise<null | number>
  getCalculatedTaxOnCartItems: () => number
  getCartSubTotal: () => number
  getCartTotal: () => number
}

interface CartContextProviderProps {
  children?: React.ReactNode
}

export const CartContext = createContext<CartContextInterface | null>(null)

export const CartContextProvider: React.FC<CartContextProviderProps> = (
  props
): ReactElement => {
  const [cartItems, setCartItems] = useState<ShoppingCartItem[]>([])

  useEffect(() => {
    async function getCartItems() {
      const response = await fetch('/api/cart')
      const items = await response.json()
      const cartItemsFromAPI = items.map((i: any) => {
        return {
          product_name: i.product.name,
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.price
        }
      })
      setCartItems(cartItemsFromAPI)
    }

    getCartItems()
  }, [])

  const removeCartItemHandler: (productId: number) => Promise<boolean> = async (
    productId: number
  ) => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(`/api/cart/remove?product=${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return reject(false)
      }

      setCartItems((prevCartItems: ShoppingCartItem[]) => {
        const cartItemIndex = prevCartItems.findIndex(
          (item) => item.product_id === productId
        )
        let newCartItems = prevCartItems.slice()
        if (newCartItems[cartItemIndex].quantity > 1) {
          newCartItems[cartItemIndex].quantity--
        } else {
          newCartItems = prevCartItems.filter(
            (item) => item.product_id !== productId
          )
        }
        return newCartItems
      })

      resolve(true)
    })
  }

  const addCartItemHandler = async (itemToAdd: ItemToAdd) => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(`/api/cart/add?product=${itemToAdd.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return reject(false)
      }

      setCartItems((prevCartItems: ShoppingCartItem[]) => {
        const cartItemIndex = prevCartItems.findIndex(
          (item) => item.product_id === itemToAdd.id
        )
        let newCartItems = prevCartItems.slice()

        if (cartItemIndex >= 0) {
          newCartItems[cartItemIndex].quantity++
        } else {
          newCartItems = [
            ...prevCartItems,
            {
              product_name: itemToAdd.name,
              product_id: itemToAdd.id,
              price: itemToAdd.price,
              quantity: 1
            }
          ]
        }
        return newCartItems
      })

      resolve(true)
    })
  }

  const saveOrder: () => Promise<null | number> = async () => {
    return new Promise(async (resolve, reject) => {
      const orderSummary = {
        subTotal: getCartSubTotal(),
        tax: getCalculatedTaxOnCartItems(),
        total: getCartTotal()
      }

      const response = await fetch(`/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderSummary)
      })

      if (!response.ok) {
        resolve(null)
      }

      const deleteCartItemsRespone = await fetch(`/api/cart/clear`, {
        method: 'DELETE'
      })

      if (deleteCartItemsRespone.ok) {
        setCartItems([])
      }

      const orderResponse = await response.json()
      resolve(orderResponse.orderDetails.id)
    })
  }

  const getCartSubTotal = () => {
    const subTotalOfCartItems = cartItems.reduce(
      (total: number, item: ShoppingCartItem) => {
        return total + item.price * item.quantity
      },
      0
    )

    return +subTotalOfCartItems.toFixed(2)
  }

  const getCalculatedTaxOnCartItems = () => {
    const taxPercentage = 7 / 100
    return +(getCartSubTotal() * taxPercentage).toFixed(2)
  }

  const getCartTotal = () => {
    return +(getCartSubTotal() + getCalculatedTaxOnCartItems()).toFixed(2)
  }

  const context: CartContextInterface = {
    cartItems,
    getCartSubTotal,
    getCartTotal,
    getCalculatedTaxOnCartItems,
    removeItemFromCart: removeCartItemHandler,
    addItemToCart: addCartItemHandler,
    saveOrder
  }

  return (
    <CartContext.Provider value={context}>
      {props.children}
    </CartContext.Provider>
  )
}
