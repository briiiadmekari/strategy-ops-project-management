import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestOtpSchema, verifyOtpSchema } from '../schema/loginSchema';
import { toast } from 'sonner';

import { useCountdown } from './useCountdown';
import { useRequestOtp, useVerifyOtp } from '../composables/mutation';

import { TOKEN_KEY } from '@/constant/auth';
import { OTP_COOLDOWN_SECONDS } from '@/constant/login';
import { getErrorMessage } from '@/utils/getErrorMessage';

export type Step = 'email' | 'otp';

export const useLogin = () => {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { countdown, start: startCountdown } = useCountdown();
  const { mutate: requestOtp, isPending: isRequestOtpPending, isError: isRequestOtpError } = useRequestOtp();
  const { mutate: verifyOtp, isPending: isVerifyOtpPending, isError: isVerifyOtpError } = useVerifyOtp();

  const handleRequestOtp = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const result = requestOtpSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (countdown > 0) {
      setError(`Please wait ${countdown} seconds before requesting a new OTP.`);
      return;
    }

    requestOtp(
      { email },
      {
        onSuccess: () => {
          setStep('otp');
          setOtp('');
          setError(null);
          startCountdown(OTP_COOLDOWN_SECONDS);
          toast.success('OTP sent to your email');
        },
        onError: (err) => {
          setError(getErrorMessage(err));
        },
      },
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = verifyOtpSchema.safeParse({ email, otp });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    verifyOtp(
      { email, otp },
      {
        onSuccess: (data) => {
          const newToken = data.data?.token;
          if (newToken) {
            sessionStorage.setItem(TOKEN_KEY, newToken);
            toast.success('Signed in successfully');
            window.location.href = '/';
          } else {
            setError('Authentication succeeded, but no token was received.');
          }
        },
        onError: (err) => {
          setError(getErrorMessage(err));
        },
      },
    );
  };

  const handleResendOtp = () => {
    handleRequestOtp();
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        router.replace('/');
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  return {
    isCheckingAuth,
    step,
    email,
    setEmail,
    otp,
    setOtp,
    error,
    countdown,
    handleRequestOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleBackToEmail,
    isRequestOtpPending,
    isVerifyOtpPending,
  };
};
