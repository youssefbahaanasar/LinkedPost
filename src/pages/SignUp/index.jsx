import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import axios from "axios"
import { useEffect, useState } from "react"
import Cookies  from 'js-cookie'
import {useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Controller, useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Spinner } from "@/components/ui/spinner"

export default function SignUp() {
  const navigate = useNavigate();
  useEffect(() => {
    if(Cookies.get('userToken')){ navigate('/');}
  }, [navigate])
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },];

  const schema = zod.object({
    name: zod.string().nonempty("name is requierd").min(3,"name should be at least 3 charcters").max(15,"name is too long no more than 21 characters"),
    username: zod.string().nonempty("a username is requierd").regex( /^[a-z0-9_]{3,30}$/,"atleast 3 characters and atmost 30 characters") ,
    email: zod.string().nonempty("an email is required").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"write a valid email"),
    password: zod.string().nonempty("password is requierd").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'please follow the rules'),
    rePassword: zod.string().nonempty("rePassword is requierd"),
    dateOfBirth: zod.coerce.date("date is requierd").refine((value)=>{
      const currentYear= new Date().getFullYear();
      const birthDate= value.getFullYear();
      const age = currentYear - birthDate;
      return age>16
    },"your age is below 16"),
    gender: zod.string().nonempty("gender is requierd")
  }).refine((values)=>{return values.rePassword===values.password;},
              {path:["rePassword"],message:"Password didn't match"})

  const {handleSubmit, register,control,formState,setError} = useForm({
  defaultValues:{
    name:"",
    username:"",
    email: "",
    dateOfBirth: "",
    gender: "",
    password:"",
    rePassword:"",},
    resolver: zodResolver(schema)
  },)
  
  
  async function signUp(values){

    try {
      setIsLoading(true);
      const response = await axios.post('https://route-posts.routemisr.com/users/signup',
       {"name": values.name,
         "username": values.username,
         "email": values.email,
         "dateOfBirth": "2005-07-05",
         "gender": values.gender,
         "password": values.password,
         "rePassword": values.rePassword},
       {headers:{"Content-Type":"application/json"}})
       const session =response.data;
       if(session.success){
        Cookies.set('userToken',session.data.token,{
          expires:session.data.expiresin,
          sameSite:"strict",
          secure:true})
        navigate('/login');
       };
       setIsLoading(false);
      } catch (error) {
        console.log(error.response);
        if(error.response.data.errors == "user already exists."){
          setError("email",{message:error.response.data.message});
        }else if(error.response.data.errors == "username already exists."){
          setError("username",{type:"server",message:error.response.data.message});
        }
        setIsLoading(false);
      
    }
    

    
  }

  return<>
        <form onSubmit={handleSubmit(signUp)} className="w-full max-w-md mx-auto ">
      <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="flex flex-col gap-4">

            <div className="grid gap-2">
               <Field>
                  <FieldLabel htmlFor="input-invalid">Name</FieldLabel>
                  <Input id="name" aria-invalid={!!formState.errors.name?.message} {...register('name',{required:"name is required"})}  />
                  {!!formState.errors.name?.message&&<FieldError>
                   { formState.errors.name?.message}
                  </FieldError>}
                </Field>
            </div>
            <div className="grid gap-2">
               <Field >
                <FieldLabel htmlFor="userName">User name</FieldLabel>
                <Input id="userName" aria-invalid={!!formState.errors.username?.message} {...register('username',{required:"user name is required"})}  />
                {!!formState.errors.username?.message&&<FieldError>
                  {formState.errors.username?.message}
                </FieldError>}
              </Field>
            </div>

            <div className="grid gap-2">
              <Field >
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type={'email'} aria-invalid={!!formState.errors.email?.message} {...register('email',{required:"Email is required"})} placeholder="m@example.com"  />
                {!!formState.errors.email?.message&&<FieldError>
                  {formState.errors.email?.message}
                </FieldError>}
              </Field>
            </div>
            

            <div className="grid gap-2">
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" aria-invalid={!!formState.errors.password?.message} {...register('password',{required:"password is required"})}  />
                {!!formState.errors.password?.message&&<FieldError>
                  {formState.errors.password?.message}
                </FieldError>}
              </Field>
            </div>

            <div className="grid gap-2">
               <Field>
                <FieldLabel htmlFor="rePassword">Confirm Password</FieldLabel>
                <Input id="rePassword" type="password" aria-invalid={!!formState.errors.rePassword?.message} {...register('rePassword',{required:"password doesn't match"})}  />
                {!!formState.errors.rePassword?.message&&<FieldError>
                  {formState.errors.rePassword?.message}
                </FieldError>}
              </Field>
            </div>
            <div className="flex gap-2">

              <Field data-invalid={!!formState.errors.dateOfBirth?.message} className="mx-auto w-full">
                <FieldLabel htmlFor="date">Date of birth</FieldLabel>
                <Controller control={control} name="dateOfBirth" rules={{required:"pleese select date"}} 
                render={({field})=>(
                  <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger aria-invalid={!!formState.errors.dateOfBirth?.message} render={<Button variant="outline" id="date" className="justify-start font-normal">{field.value ? new Date(field.value).toLocaleDateString() : "Select date"}</Button>} />
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      defaultMonth={field.value}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        field.onChange(date)
                        setOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                )}/>

                <FieldError>{formState.errors.dateOfBirth?.message}</FieldError>
              </Field>
              
            
            <Field data-invalid={!!formState.errors.gender?.message} className="w-full max-w-48">
              <FieldLabel>Gender</FieldLabel>
              <Controller control={control} name="gender" rules={{required:"please select gender"}}
              render={({field})=>(
              <Select value={field.value} onValueChange={field.onChange} gender={gender}>
                <SelectTrigger  aria-invalid={!!formState.errors.gender?.message}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup >
                    {gender.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              )}
              />
              <FieldError>{formState.errors.gender?.message}</FieldError> 
            </Field>
            
            </div>
            
          </div>
      </CardContent>
      <CardFooter className="flex-col pt-0">
      <CardAction className='m-0 '>
          <Button onClick={()=>{navigate('/login')}} variant="link" className='ps-1'>
           I allready have an account.
            </Button>
        </CardAction>
        
      <Button type="submit"  disabled={isLoading} variant="default" className='w-full'>
        Register
        {isLoading&&<Spinner data-icon="inline-start" />}
      </Button>
      </CardFooter>
    </Card>
        </form>
  </>

}
