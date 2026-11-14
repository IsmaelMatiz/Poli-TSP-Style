import { Link } from 'react-router'

function Header() {
  return (
    <header className="flex items-center gap-4 p-4 bg-second-bg">
      <Link to="/" className="font-bold text-verde">polistyle</Link>
      {/* aquí irá la barra de búsqueda (Karen, S2-08) */}
      <nav className="flex gap-4 ml-auto">
        <Link to="/buscar">Buscar</Link>
        <Link to="/carrito">Carrito</Link>
        <Link to="/ingresar">Ingresar</Link>
      </nav>
    </header>
  )
}

export default Header
