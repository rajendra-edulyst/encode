import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/ShadcnButton'
import { Input } from '@/components/ui/ShadcnInput'
import { sendOtp } from '@/services/auth/AccountService'
import { useThemeStore } from '@/store/themeStore'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import OauthSignIn from '../SignIn/components/OauthSignIn'

const SignUp = () => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signupProfile = useThemeStore((state) => state.loginProfile);

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: () => {
      sessionStorage.setItem('accountEmail', email);
      toast.success('OTP Sent', {
        description: 'Please check your email for the OTP.',
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f0f4f8',
          color: '#333',
        },
      });
      navigate('/account-verify');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError(error?.response?.data?.message || 'Something went wrong.');
    },
  });

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate(email);
  };


  useEffect(() => {
    const storedEmail = sessionStorage.getItem('accountEmail');
    const verifiedEmail = sessionStorage.getItem('verified-email');

    if (verifiedEmail) {
      navigate('/personal-info');
    }

    if (storedEmail) {
      navigate('/account-verify');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <h1 className="text-3xl font-bold mb-1 text-cblue">Sign up as <span className='capitalize'>{signupProfile}</span></h1>
      <p className="text-gray-600 mb-4"></p>
      <div className="flex flex-col gap-4">
        <form className="flex flex-col gap-6" onSubmit={handleSendEmail}>
          <div className='flex flex-col gap-2'>
            <Label className='font-bold text-base text-[#263A43]'>Email<span className='text-red-500'>*</span></Label>
            <Input
              required
              value={email}
              type="email"
              placeholder="Enter your email"
              className='placeholder:font-normal focus-visible:ring-0 focus-visibl:outline-0 focus-visible:ring-offset-0 mt-1 focus:ring-[#d63384] focus-within:ring-[#d63384] focus-within:border-[#d63384] focus:border-[#d63384]'
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-full rounded-lg px-8 py-2 font-semibold"
          >
            {mutation.isPending && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
            Send OTP
          </Button>
        </form>
        <div className='flex flex-col gap-6' >
          <div className='flex items-center justify-center gap-2 text-gray-500'>
            <div className='h-px bg-gray-300 w-32'></div>
            <div>or</div>
            <div className='h-px bg-gray-300 w-32'></div>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <GoogleOAuthProvider clientId="909003757464-qrb4u24iacv0taqdn1v4ov153obfhltn.apps.googleusercontent.com" >
              <OauthSignIn disableSubmit={false} setMessage={() => { }} />
            </GoogleOAuthProvider>
            {/* <AppleSignIn /> */}
          </div>

          {/* have an account */}
          <div className="text-center text-gray-500 mt-0">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-cpink font-semibold hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp