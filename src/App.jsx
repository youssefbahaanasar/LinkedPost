import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './Layout/Layout'
import SignUp from './pages/SignUp'

const routers =createBrowserRouter(
  [
    {
      path:'/',
      element:<Layout/> ,
      children:[
        {index:true,element:<Home/>},
        {path:"/login",element:<Login/>},
        {path:"/signup",element:<SignUp/>},
        {path:"/*",element:<NotFound/>},
      ]
    }
  
  
])

function App() {
 

  return <>
    <RouterProvider router={routers}>
      
    </RouterProvider>
  </>
}

export default App
