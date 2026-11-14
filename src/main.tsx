import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.tsx'
import Layout from './components/Layout.tsx'
import Login from './features/auth/Login.tsx'
import Register from './features/auth/Register.tsx'
import Cart from './features/cart/Cart.tsx'
import Product from './features/catalog/Product.tsx'
import Browser from './features/search/Browser.tsx'
import NotFoundPage from './NotFoundPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/producto/:id" element={<Product />} />
          <Route path="/buscar" element={<Browser />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/ingresar" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
