import React from 'react'

type QuoteProps ={

}
const Quote:React.FC<QuoteProps> = () => {
  return (
    <div className=" bg-slate-200 h-screen flex justify-center flex-col ">
      <div className="flex justify-center">
        <div className="max-w-lg ">
          <div className='text-center text-3xl font-extrabold' >
          It's never too late to start anything 
          </div>
          <div className="max-w-md text-2xl text-left font-semibold mt-3 " >
            Sahith Kanmanthreddy 
          </div>
          <div className=" max-w-md text-2xl text-left font-normal mt-1" >
            CEO | Sonic Solutions
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quote



