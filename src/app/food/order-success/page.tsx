// src/app/food/order-success/page.tsx
import React, { Suspense } from 'react';
import OrderSuccessContent from './OrderSuccessContent';


export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
