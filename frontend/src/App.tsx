import { ErrorPage } from './pages/Error'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/layoutMain'
import { Home } from './pages/Home'
import { BookDetails } from './pages/BookDetails'
import { Checkout } from './pages/Checkout'
import { CheckoutSuccess } from './pages/CheckoutSuccess'
import { CheckoutCancel } from './pages/CheckoutCancel'
import { SimulatedPayment } from './pages/SimulatedPayment'
import { MyOrders } from './pages/MyOrders'
import { AdminRoute } from './components/adminRoute'
import { AdminDashboard } from './pages/AdminDashboard';

function App() {

  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='/book/:slug' element={<BookDetails />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/checkout/success' element={<CheckoutSuccess />} />
        <Route path='/checkout/cancel' element={<CheckoutCancel />} />
        <Route path='/checkout/payment' element={<SimulatedPayment />} />
        <Route path='/my-orders' element={<MyOrders />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path='/admin' element={<AdminDashboard />} />
      </Route>
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )

}

export default App
