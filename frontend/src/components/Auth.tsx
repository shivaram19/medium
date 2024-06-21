import { SignUpInput } from '@shivaram19/medium-common';
import React, { ChangeEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from "axios"
import { BACKEND_URL } from '../config';

const Auth = ({type} : { type: "signup" | "signin" }) => {
  const navigate = useNavigate()
  const [ postInputs, setPostInputs ] = useState<SignUpInput>({
    email: "",
    password:""
  });
  async function sendRequest(){
    try {
      const response = await axios.post(`${BACKEND_URL}api/v1/user/${ type === "signin" ? "sigin" : "signup" }`, postInputs)
      const jwt = response.data ;
      localStorage.setItem("token", jwt);
      navigate("/blogs")
    } catch (error) {
      console.error("error is ", error)
    }
  }
      
  return (
    <div className="flex justify-center flex-col h-screen" >
      <div className="flex  justify-center" >
        <div className="" >
          <div className="px-15">
            <div className="text-center font-extrabold  text-2xl">
              Create an Account 
            </div>
            <div className="text-center text-slate-500 text-lg" >
              { type === "signin" ? "Don't have an account ?" : "Already have an account?"  } 
              <Link to={ type === "signin" ? "/signup" : "/signin" } className="pl-2 underline hover:to-slate-300 cursor-pointer" >{ type==="signin" ? "SignUp" : "Login" }</Link> 
            </div>
          </div>
          <div className="pt-4" >
            <LabelledInput label='Email' onChange={(e) => {
              setPostInputs({
                ...postInputs,
                email: e.target.value
              })
            }} placeholder="shivarammmmmm@gmail.com" type='email' />
            <LabelledInput label='Password' onChange={(e) => {
              setPostInputs({
                ...postInputs, // lets you overwrite the password, at the same time you can retain the values that's alrady present  in the object
                password: e.target.value
              })
            }} placeholder='*******' type='password' />
            <button type="button" className=" mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-full"  onClick={sendRequest} >{ type === "signin" ? "Sign In" : "Sign Up" }</button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LabelledInputTypes {
  label: string;
  placeholder: string;
  type: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export function LabelledInput({ label, placeholder,type, onChange }: LabelledInputTypes){
  return(
    <div>
      <div>
            <label  className="block mb-1 text-lg font-bold text-gray-900 pt-4 ">{label}</label>
            <input type={type} className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:border-orange-300" placeholder={placeholder}  onChange={onChange} required />
        </div>
    </div>
  )
}
export default Auth

