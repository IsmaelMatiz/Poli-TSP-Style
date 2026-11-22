import { Fragment } from 'react'
import { useSearchParams } from 'react-router'

function Browser() {

  const [params] = useSearchParams()
  const q = params.get('q')
  
  return (
    <Fragment>
      <h1>Pagina de busqueda</h1>
      <p>Buscaste: {q}</p>
    </Fragment>
  )
}

export default Browser
