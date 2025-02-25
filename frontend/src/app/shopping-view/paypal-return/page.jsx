import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { capture_order } from '@/store/shop/order-slice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const PaypalReturnPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if(payerId && paymentId) {
      const getCurrentOrderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capture_order({paymentId, payerId, orderId: getCurrentOrderId})).then(data => {
        if(data?.payload?.success){
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      })
    }
  }, [paymentId, payerId, dispatch]);

  console.log("Paymet ID = ", paymentId);
  console.log("Payer ID = ", payerId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default PaypalReturnPage;