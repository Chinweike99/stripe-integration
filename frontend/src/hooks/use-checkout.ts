import { useMutation } from '@tanstack/react-query';
import { checkoutService } from '@/services/checkout-service';

export const useCreateSubscriptionCheckout = () => {
  return useMutation({
    mutationFn: checkoutService.createSubscriptionCheckout,
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
};

export const useCreatePaymentCheckout = () => {
  return useMutation({
    mutationFn: checkoutService.createPaymentCheckout,
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
};

export const useCreatePortalSession = () => {
  return useMutation({
    mutationFn: checkoutService.createPortalSession,
    onSuccess: (data) => {
      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
};