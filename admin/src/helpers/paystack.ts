interface PaystackProps {
  email: string;
  amount: number;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export const payWithPaystack = ({
  email,
  amount,
  onSuccess,
  onCancel,
}: PaystackProps) => {
  const handler = (window as any).PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(amount * 100),
    currency: "NGN",

    callback: function (response: any) {
      onSuccess(response.reference);
    },

    onClose: function () {
      onCancel?.();
    },
  });

  handler.openIframe();
};