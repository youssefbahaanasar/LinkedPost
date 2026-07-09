import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Cookies from "js-cookie";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {useNavigate } from "react-router-dom"
import * as zod from 'zod'
export default function Login() {
  const navigate = useNavigate()
  useEffect(() => {
    if(Cookies.get('userToken')){ navigate('/');}

  }, [navigate])
  
  const [isLoading, setIsLoading] = useState(false)
  const schema = zod.object({
    email: zod.string().nonempty("email is requierd").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"write a valid email"),
    password:  zod.string().nonempty("please enter password").regex( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"please follow password rules"),
  });
 const {register,formState,handleSubmit,setError} =useForm({defaultValues:{
    email:'',
    password:''
  },resolver:zodResolver(schema)});

  
  async function login(values) {
    try{
      setIsLoading(true);
      const response = await axios.post('https://route-posts.routemisr.com/users/signin',
       {
         "email": values.email,
         "password": values.password
       }
       ,{
         headers:{
           'Content-Type': 'application/json',
         }
       }
     )
     if(response.data.success){
       const token = response.data.data.token;
       const time = response.data.data.expiresIn;
       // navigate("/")
       Cookies.set("userToken",token,{
         expires:+time,
         secure: true,   
         sameSite: "strict"
       })
      setIsLoading(false);
      window.location.reload()
      navigate('/');
    }
    
  }catch(error){
    const session =error.response.data;
    if(session.errors){
      setError("password",{message:session.message})
    }else{
      console.log(error.response);
    }
  }
  setIsLoading(false);
  }
 
  


  return <>
        <form className=" w-full max-w-md mx-auto" onSubmit={handleSubmit(login)}>
  <Card className="w-full ">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardAction>
          <Button onClick={()=>{navigate('/signup')}} variant="link">
            Sign Up
            </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" placeholder="m@example.com" type="email" aria-invalid={!!formState.errors.email?.message} {...register('email')}  />
                {!!formState.errors.email?.message&&
                <FieldError>
                  {formState.errors.email?.message}
                </FieldError>}
              </Field>
            </div>
            <div className="grid gap-2">
                <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" aria-invalid={!!formState.errors.password?.message} {...register('password')}  />
                {!!formState.errors.password?.message&&<FieldError>
                  {formState.errors.password?.message}
                </FieldError>}
              </Field>  
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
          <Button type='submit' disabled={isLoading} variant="default" className='w-full'>
            Login
            {isLoading&&<Spinner data-icon="inline-start" />}
          </Button>
      </CardFooter>
    </Card>
        </form>
  </>
}