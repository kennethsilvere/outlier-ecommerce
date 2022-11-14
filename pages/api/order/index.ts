import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../src/database'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const order = await findOrderWithOrderId(+req.query.id!)
    if (!order) {
      return res.status(404).send(`Order ${req.query.id!} does not exist`)
    }
    const orderDetails = {
      ...order,
      summary: JSON.parse(order.summary)
    }
    return res.status(200).send(orderDetails)
  }

  if (req.method === 'POST') {
    const orderDetails = await prismaClient.order.create({
      data: {
        summary: JSON.stringify(req.body)
      }
    })
    return res.status(201).send({ orderDetails })
  }
}

export const findOrderWithOrderId = async (
  order_id: number | string | undefined
) => {
  const order = await prismaClient.order.findUnique({
    where: {
      id: order_id as number
    }
  })
  return order
}
