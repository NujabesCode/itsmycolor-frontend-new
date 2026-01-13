'use client';

import { ENV } from '@/configs/app/env';
import { useGetUser } from '@/serivces/user/query';
import {
  loadTossPayments,
  TossPaymentsWidgets,
} from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';

export const useTossWidget = (amount: number) => {
  const [{ data: user }] = useGetUser();
  const customerKey = user?.id;

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      if (!customerKey) return;

      const tossPayments = await loadTossPayments(ENV.TOSS_CLIENT_KEY);

      const widgets = tossPayments.widgets({
        customerKey,
      });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount({
        currency: 'KRW',
        value: amount,
      });

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, amount]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount({
      currency: 'KRW',
      value: amount,
    });
  }, [widgets, amount]);

  const requestPayment = async (
    orderId: string,
    orderName: string,
    name: string,
    phone: string
  ) => {
    if (widgets == null || !user || !ready) {
      return;
    }

    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: window.location.origin + '/payment/success',
        failUrl: window.location.origin + '/payment/fail',
        customerEmail: user.email,
        customerName: name,
        customerMobilePhone: phone,
      });
    } catch (error) {
      alert(error);
    }
  };

  return { requestPayment };
};
