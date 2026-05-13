import {ErrorPage} from './pages/Error'
import {Routes, Route} from 'react-router-dom'
import { MainLayout } from './layout/layoutMain'
import { Home } from './pages/Home'
import { BookDetails } from './pages/BookDetails'
import { Checkout } from './pages/Checkout'
import { AdminRoute } from './components/adminRoute'
import {AdminDashboard} from './pages/AdminDashboard';

function App() {

  return (
    <Routes>
      <Route path='/' element={<MainLayout/>}>
      <Route index  element={<Home/>}/>
      <Route path='/book/:slug' element={<BookDetails/>}/>
      <Route path='/checkout' element={<Checkout/>}/>
      </Route>
       <Route  element={<AdminRoute/>}>
       <Route path='/admin' element={<AdminDashboard/>} />
      </Route>
      <Route path='*' element={<ErrorPage/>} />
    </Routes>
   
  )
    
}

export default App
