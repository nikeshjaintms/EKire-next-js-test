// app/finance/FinanceSearchHandler.jsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const FinanceSearchHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (!paymentStatus) return;

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    if (paymentStatus === 'success') {
      Toast.fire({ icon: 'success', title: '🎉 Payment was successful!' });
    } else if (paymentStatus === 'failed') {
      Toast.fire({ icon: 'error', title: '❌ Payment failed!' });
    } else if (paymentStatus === 'add-balance') {
      Toast.fire({ icon: 'info', title: '💳 Please add balance to continue.' });
    }

    router.replace('/finance');
  }, [searchParams]);

  return null;
};

export default FinanceSearchHandler;
