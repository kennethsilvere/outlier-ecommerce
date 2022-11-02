import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../src/database'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    await prismaClient.shoppingCart.deleteMany({
      where: {}
    })
    return res.status(200).json({})
  }
}
