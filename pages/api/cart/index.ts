import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../src/database'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cartItems = await prismaClient.shoppingCart.findMany({
      select: {
        product: true,
        quantity: true
      }
    })
    res.status(200).json(cartItems)
  }
}
