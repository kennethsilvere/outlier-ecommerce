import React from 'react'
import { Product } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { getProducts } from './api/products'

import NavBar from '../src/components/NavBar'
import styles from '../styles/index.module.css'
import ProductItem from '../src/components/ProductItem'

interface HomeProps {
  products: Product[] | string
}

const Home: NextPage<HomeProps> = ({ products }) => {
  const productsArray = JSON.parse(products as string)

  return (
    <div id={styles.appContainer}>
      <NavBar />
      <div className={styles.flexContainer}>
        {productsArray.map((p: Product) => {
          return <ProductItem data={p} key={p.id} />
        })}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Write code for fetching product listings from API call
  const products = getProducts()
  return {
    props: {
      products: JSON.stringify(await products)
    }
  }
}

export default Home
