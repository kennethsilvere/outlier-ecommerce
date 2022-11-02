import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../src/database'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const products = await getProducts()
    res.status(200).json(products)
  }
}

export const getProducts = async () => {
  const products = await prismaClient.product.findMany()
  return products
}
