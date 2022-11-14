import React, { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'

import classes from '../../styles/order.module.css'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

type OrderSummary = {
  subTotal: number | string
  tax: number | string
  total: number | string
}

type OrderDetails = { id: number | null; summary: OrderSummary | null }

const OrdersPage: NextPage<{ orderDetails: OrderDetails }> = () => {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | undefined>()

  const orderId = router.query.id

  const getOrderDetails = useCallback(async () => {
    fetch(`/api/order?id=${orderId}`).then(async (orderDetailsResponse) => {
      if (!orderDetailsResponse.ok) {
        setOrderDetails(undefined)
      } else {
        const orderDetails = await orderDetailsResponse.json()
        setOrderDetails({ id: orderDetails.id!, summary: orderDetails.summary })
      }
    })
  }, [orderId])

  useEffect(() => {
    if (orderId) {
      getOrderDetails()
    }
    return () => {}
  }, [getOrderDetails, orderId])

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
              <b>Subtotal:</b> <em>${orderDetails?.summary?.subTotal}</em>
            </p>
            <p>
              <b>Tax:</b> <em>${orderDetails?.summary?.tax}</em>
            </p>
            <p>
              <b>Total:</b> <em>${orderDetails?.summary?.total}</em>
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

export default OrdersPage
