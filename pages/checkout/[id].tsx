import React, { useCallback, useEffect, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import classes from '../../styles/order.module.css'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { findOrderWithOrderId } from '../api/order'
import Link from 'next/link'

type OrderSummary = {
  subTotal: number | string
  tax: number | string
  total: number | string
}

type OrderDetails = { id: number; summary: OrderSummary }

const OrdersPage: NextPage<{ orderDetails: OrderDetails }> = (props) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | undefined>(
    props.orderDetails
  )
  const router = useRouter()
  const orderId = router.query.id

  const getOrderDetails = useCallback(async () => {
    const orderDetailsResponse = await fetch(`/api/order?id=${orderId}`)
    if (!orderDetailsResponse.ok) {
      setOrderDetails(undefined)
    } else {
      const orderDetails = await orderDetailsResponse.json()
      setOrderDetails({ id: orderDetails.id!, summary: orderDetails.summary })
    }
  }, [orderId])

  useEffect(() => {
    getOrderDetails()
  }, [getOrderDetails])

  return (
    <div className={classes.orderContainer}>
      <Card sx={{ minWidth: 575, padding: 5 }}>
        {orderDetails && (
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            >
              Thank you for your order
            </Typography>
            <Typography variant='h5' component='div'>
              Order Summary
            </Typography>

            <p>
              <b>Order Id:</b> <em>{orderDetails.id}</em>
            </p>
            <p>
              <b>Subtotal:</b> <em>${orderDetails.summary.subTotal}</em>
            </p>
            <p>
              <b>Tax:</b> <em>${orderDetails.summary.tax}</em>
            </p>
            <p>
              <b>Total:</b> <em>${orderDetails.summary.total}</em>
            </p>

            <Link href={`/`}>Home page</Link>
          </CardContent>
        )}

        {!orderDetails && (
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h5' component='div'>
              Order does not exist.
            </Typography>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const orderId = params!.id

  const order: any = await findOrderWithOrderId(orderId! as string)
  let orderDetails: OrderDetails | null = null
  if (order) {
    orderDetails = {
      ...order,
      summary: JSON.parse(order.summary)
    }
  }

  return {
    props: {
      order: orderDetails
    }
  }
}

export default OrdersPage
