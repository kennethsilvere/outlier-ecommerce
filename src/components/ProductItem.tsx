import { ReactElement, useContext, useState, FC } from 'react'

import { Prisma } from '@prisma/client'

import {
  CircularProgress,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button
} from '@mui/material'

import { CartContext } from '../../store/cart-context'

type ProductItemProps = {
  data: {
    id: number
    name: string
    description: string
    price: Prisma.Decimal | number
    imgSrc: string
  }
}

const ProductItem: FC<ProductItemProps> = (props): ReactElement => {
  const cartCtx = useContext(CartContext)
  const [isLoading, setIsLoading] = useState(false)

  const addItemsInCartContext = async () => {
    await cartCtx?.addItemToCart({
      id: props.data.id,
      name: props.data.name,
      price: props.data.price as number
    })
    return
  }

  const addItemToCart = () => {
    setIsLoading(true)
    addItemsInCartContext()
    setIsLoading(false)
  }

  return (
    <Card sx={{ minWidth: 250 }}>
      <CardMedia
        component='img'
        alt={props.data.name}
        height='250'
        image={`/${props.data.imgSrc}`}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {props.data.name}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          {props.data.description}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          <b>${props.data.price as number}</b>
        </Typography>
      </CardContent>
      <CardActions>
        {!isLoading && (
          <Button variant='contained' onClick={addItemToCart}>
            Add to cart
          </Button>
        )}
        {isLoading && <CircularProgress />}
      </CardActions>
    </Card>
  )
}

export default ProductItem
