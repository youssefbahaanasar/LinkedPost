import { createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './Layout/Layout'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import BookMarks from './pages/BookMarks'
import EditProfile from './pages/EditProfile'
import Post from './pages/Post'
import Suggestions from './pages/Suggestions/Suggestions'
import Followers from './pages/Followers'
import Followings from './pages/Followings'
import Notifications from './pages/Notifications'
import Setttings from './pages/Settings'

const routers =createHashRouter(
  [
    {
      path:'/',
      element:<Layout/> ,
      children:[
        {index:true,element:<Home/>},
        {path:"login",element:<Login/>},
        {path:"signup",element:<SignUp/>},
        {path:"suggestions",element:<Suggestions/>},
        {path:"settings",element:<Setttings/>},
        {path:"notifications",element:<Notifications/>},
        {path:"profile/:id",element:<Profile/>},
        {path:"followers/:id",element:<Followers/>},
        {path:"followings/:id",element:<Followings/>},
        {path:"post/:id",element:<Post/>},
        {path:"bookmarks",element:<BookMarks/>},
        {path:"edit-profile",element:<EditProfile/>},
        {path:"*",element:<NotFound/>},
      ]
    } ])

function App() {
 

  return <>
    <RouterProvider router={routers}>
      
    </RouterProvider>
  </>
}

export default App
