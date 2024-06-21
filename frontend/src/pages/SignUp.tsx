import React from 'react'
import Quote from '../components/Quote'
import Auth from '../components/Auth'

const SignUp = () => {
  return (
    <div className="bg-white h-screen grid grid-cols-1 lg:grid-cols-2  ">
      <div>
         <Auth type="signup" /> 
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>

    </div>
  )
}

export default SignUp
