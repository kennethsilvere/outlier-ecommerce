import { Product, ShoppingCart } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../src/database'
import { getProducts } from '../products'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const products = await getProducts()
    const selectedProduct: Product | undefined = products.find(
      (p) => +req.query.product! === p.id
    )
    if (!selectedProduct) {
      return res.send({
        msg: 'Product not available!'
      })
    }
    const itemInCart = await checkIfItemInCart(selectedProduct)
    await removeProductFromCart(selectedProduct, itemInCart, req, res)
  }
}

const checkIfItemInCart = async (selectedProduct: Product) => {
  const itemInCart: ShoppingCart | null =
    await prismaClient.shoppingCart.findUnique({
      where: {
        productId: selectedProduct.id
      }
    })
  return itemInCart
}

const removeProductFromCart = async (
  selectedProduct: Product,
  itemInCart: ShoppingCart | null,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (itemInCart && itemInCart?.quantity > 1) {
    await prismaClient.shoppingCart.update({
      where: {
        productId: selectedProduct.id
      },
      data: {
        quantity: itemInCart.quantity - 1
      }
    })
  } else if (itemInCart && itemInCart?.quantity === 1) {
    await prismaClient.shoppingCart.delete({
      where: {
        productId: selectedProduct.id
      }
    })
  }
  return res.status(201).send(`Removed ${itemInCart} item from cart `)
}
