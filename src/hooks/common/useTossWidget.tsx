'use client';

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
      if (!customerKey) {
        console.log('useTossWidget: customerKey가 없어 위젯을 초기화할 수 없습니다.');
        return;
      }

      const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
      if (!tossClientKey) {
        console.error('useTossWidget: TOSS_CLIENT_KEY가 설정되지 않았습니다.');
        return;
      }

      try {
        console.log('useTossWidget: Toss 결제 위젯 초기화 시작', { 
          clientKey: tossClientKey ? `${tossClientKey.substring(0, 10)}...` : 'empty',
          customerKey 
        });
        
        const tossPayments = await loadTossPayments(tossClientKey);

        const widgets = tossPayments.widgets({
          customerKey,
        });

        console.log('useTossWidget: 위젯 초기화 완료');
        setWidgets(widgets);
      } catch (error: any) {
        console.error('useTossWidget: 위젯 초기화 실패', error);
        // 에러가 발생해도 위젯을 null로 설정하여 다시 시도할 수 있도록 함
        setWidgets(null);
      }
    }

    fetchPaymentWidgets();
  }, [customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      
      // DOM이 준비되었는지 확인
      const paymentMethodElement = document.querySelector('#payment-method');
      const agreementElement = document.querySelector('#agreement');
      
      if (!paymentMethodElement || !agreementElement) {
        console.log('결제 위젯 DOM 요소가 아직 준비되지 않았습니다. 잠시 후 재시도합니다.', {
          paymentMethod: !!paymentMethodElement,
          agreement: !!agreementElement
        });
        // DOM이 준비될 때까지 약간의 지연 후 재시도
        setTimeout(() => {
          renderPaymentWidgets();
        }, 100);
        return;
      }

      try {
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

        console.log('결제 위젯 렌더링 완료');
        setReady(true);
      } catch (error) {
        console.error('결제 위젯 렌더링 에러:', error);
        // 에러가 발생해도 ready를 true로 설정하여 결제를 진행할 수 있도록 함
        // (위젯이 이미 렌더링되었을 수도 있음)
        setReady(true);
      }
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
    console.log('requestPayment 호출됨', { widgets: widgets != null, user: !!user, ready, orderId });
    
    if (widgets == null) {
      alert('결제 위젯이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    if (!user) {
      alert('로그인이 필요합니다.');
      window.location.href = '/sign-in.html';
      return;
    }
    
    if (!ready) {
      alert('결제 위젯이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      console.log('widgets.requestPayment 호출 시작');
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: window.location.origin + '/payment/success.html',
        failUrl: window.location.origin + '/payment/fail.html',
        customerEmail: user.email,
        customerName: name,
        customerMobilePhone: phone,
      });
      console.log('widgets.requestPayment 호출 완료');
    } catch (error: any) {
      console.error('widgets.requestPayment 에러:', error);
      const errorMessage = error?.message || String(error) || '결제 중 오류가 발생했습니다.';
      alert(errorMessage);
      throw error;
    }
  };

  return { requestPayment };
};
