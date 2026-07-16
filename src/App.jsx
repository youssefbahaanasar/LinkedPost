import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './Layout/Layout'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import BookMarks from './pages/BookMarks'
import EditProfile from './pages/EditProfile'

const routers =createBrowserRouter(
  [
    {
      path:'/',
      element:<Layout/> ,
      children:[
        {index:true,element:<Home/>},
        {path:"login",element:<Login/>},
        {path:"signup",element:<SignUp/>},
        {path:"my-profile",element:<Profile/>},
        {path:"bookmarks",element:<BookMarks/>},
        {path:"edit-profile",element:<EditProfile/>},
        {path:"*",element:<NotFound/>},
      ]
    } ],{

    basename: "/linkedPost" 
  })

function App() {
 

  return <>
    <RouterProvider router={routers}>
      
    </RouterProvider>
  </>
}

export default App
