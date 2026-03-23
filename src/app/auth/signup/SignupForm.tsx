'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Alert: React.FC<{ message: string; type: 'error' | 'success' }> = ({ message, type }) => {
  if (!message) return null;
  const baseClasses = 'w-full text-center p-3 rounded-lg mb-4 text-sm';
  const typeClasses = type === 'error'
    ? 'bg-red-100 border border-red-400 text-red-700'
    : 'bg-green-100 border border-green-400 text-green-700';

  return <div className={`${baseClasses} ${typeClasses}`} role="alert">{message}</div>;
};

const SignupForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNo: '',
    brandName: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl === 'admin') {
      setRole('organizer');
    } else if (roleFromUrl === 'user') {
      setRole('attendee');
    } else {
      router.push('/choose-role');
    }
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInitialSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const fullAccountData = {
      username: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phoneNo: formData.phoneNo,
      address: formData.address,
      ...(role === 'organizer' && { brandName: formData.brandName }),
    };

    try {
      const signupUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
      await axios.post(`${signupUrl}/auth/signup`, fullAccountData);
      setShowVerificationModal(true);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail));
      } else {
        setError(err.response?.data?.message || "An error occurred during sign-up.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationAndProfileCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const verifyUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') + '';
      const verifyResponse = await axios.post(`${verifyUrl}/auth/verify-code`, {
        email: formData.email,
        code: verificationCode,
      });

      // Automatically login to get the required access token
      const loginResponse = await axios.post(`${verifyUrl}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      const token = loginResponse.data?.access_token;
      if (!token) {
        throw new Error("Verification succeeded, but no authentication token was returned to create profile.");
      }

      const profileBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
      const profileUrl = role === 'organizer'
        ? `${profileBaseUrl}/profile/creatorProfile`
        : `${profileBaseUrl}/profile/userProfile`;

      const profilePayload: Record<string, string> = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone_no: formData.phoneNo, // Match the schema's snake_case
        address: formData.address,
      };

      if (role === 'organizer' && formData.brandName) {
        profilePayload.brand_name = formData.brandName; // Match the schema's snake_case
      }

      // Convert payload to application/x-www-form-urlencoded format
      const formEncodedData = new URLSearchParams(profilePayload);

      console.log('Creating profile at:', profileUrl);
      console.log('Profile payload:', profilePayload);
      console.log('Token:', token);

      await axios.post(profileUrl, formEncodedData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`
        }
      });

      alert("Account and profile created successfully! Redirecting to login...");
      router.push('/auth/signin');
    } catch (err: any) {
      console.error('Profile creation error:', err);
      if (err.response?.data?.detail) {
        setError(typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail));
      } else if (err.response?.status === 404) {
        setError(`Profile endpoint not found (404). Tried: ${role === 'organizer' ? '/profile/creatorProfile' : '/profile/userProfile'}`);
      } else {
        setError(err.response?.data?.message || err.message || "Verification or profile creation failed.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isClient || !role) return null;

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10 backdrop-blur-lg bg-white/30"
        style={{ backgroundImage: "url('/assets/ba.jpg')" }}
      >
        <div className="w-full max-w-xl backdrop-blur-lg bg-black/30 border border-white/40 rounded-2xl p-8 shadow-xl">
          <div className="mx-auto mb-6 text-center">
            <div className="w-28 h-28 mx-auto rounded-full bg-black flex items-center justify-center">
              <img src="/assets/capo.svg" alt="Logo" className="h-16 object-contain" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-black text-center">
            Create Your {role === 'organizer' ? 'Creator' : 'User'} Account
          </h1>

          <form className="space-y-3" onSubmit={handleInitialSignUp}>
            <div className="flex gap-4">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-white placeholder-white-400 focus:outline-none" required />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-white placeholder-white-400 focus:outline-none" required />
            </div>
            <input type="email" name="email" placeholder="Email" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-white placeholder-white-400 focus:outline-none" required />
            <input type="text" name="phoneNo" placeholder="Phone Number" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-white placeholder-white-400 focus:outline-none" required />
            <input type="text" name="address" placeholder="Address" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-white placeholder-white-400 focus:outline-none" required />
            {role === 'organizer' && (
              <input type="text" name="brandName" placeholder="Brand Name" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-white placeholder-white-400 focus:outline-none" required />
            )}
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 pl-4 pr-10 text-white" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5">
                {showPassword ? <Eye className="w-5 h-5 text-gray-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 pl-4 pr-10 text-white" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5">
                {showConfirmPassword ? <Eye className="w-5 h-5 text-gray-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            {error && <Alert message={error} type="error" />}
            <button type="submit" className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-900 transition" disabled={isLoading}>
              {isLoading ? 'Sending Verification...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-black mt-6 text-center">
            Already have an account?{' '}
            <a href="/auth/signin" className="text-blue-600 font-semibold underline">Sign In</a>
          </p>
        </div>
      </div>

      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl text-black max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">A verification code has been sent to your email. Please enter it below.</p>
            <form onSubmit={handleVerificationAndProfileCreation}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full text-center tracking-[1em] text-2xl border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                maxLength={6}
                required
              />
              {error && <div className="mt-4"><Alert message={error} type="error" /></div>}
              <button type="submit" className="mt-6 w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-900 transition" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify & Complete Profile'}
              </button>
              <button type="button" onClick={() => setShowVerificationModal(false)} className="mt-2 w-full text-sm text-gray-500 hover:underline">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupForm;
