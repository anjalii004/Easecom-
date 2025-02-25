import { Button } from '@/components/ui/button';
import React from 'react';

const PayemntSuccess = () => {
  // window.location.href = "";
  function handleReturnButton() {
    window.location.href = "/shop/home";
  }
  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='text-4xl font-bold bg-white text-black px-5 py-3 '>Hurray!!.. Payment Successfull!</div>
      <Button onClick={() => handleReturnButton()} className="">Return to homepage</Button>
    </div>
  )
}

export default PayemntSuccess;