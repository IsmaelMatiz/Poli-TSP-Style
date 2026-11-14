import { Fragment } from 'react'
import { useParams } from 'react-router'

function Product() {
  const { id } = useParams<{ id: string }>()

  return (
    <Fragment>
      <h1>Pagina de producto con id {id}</h1>
    </Fragment>
  )
}

export default Product
