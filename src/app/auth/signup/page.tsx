'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Corrected: Use 'next/router' for Pages Router
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// --- Reusable Components for UI Feedback ---
const Alert: React.FC<{ message: string; type: 'error' | 'success' }> = ({ message, type }) => {
  if (!message) return null;
  const baseClasses = 'w-full text-center p-3 rounded-lg mb-4 text-sm';
  const typeClasses = type === 'error'
    ? 'bg-red-100 border border-red-400 text-red-700'
    : 'bg-green-100 border border-green-400 text-green-700';

  return <div className={`${baseClasses} ${typeClasses}`} role="alert">{message}</div>;
};

// --- Main Sign-Up Page Component ---
const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  // State for the entire form's data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNo: '',
    brandName: '', // Only for organizers
  });

  // State for UI control
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // This effect safely reads the 'role' from the URL query after the router is ready on the client-side
  useEffect(() => {
    // router.isReady ensures that the router.query object is populated
    if (router.isReady) {
        const { role: roleFromUrl } = router.query;
        if (roleFromUrl === 'admin') {
            setRole('organizer');
        } else if (roleFromUrl === 'user') {
            setRole('attendee');
        } else {
            console.error("No valid role specified in URL.");
            router.push('/choose-role');
        }
    }
  }, [router.isReady, router.query, router]);

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
      const signupUrl = process.env.NEXT_PUBLIC_USER_SIGNUP!;
      await axios.post(signupUrl, fullAccountData);
      setShowVerificationModal(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during sign-up.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationAndProfileCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const verifyUrl = process.env.NEXT_PUBLIC_VERIFY_CODE!;
      const verifyResponse = await axios.post(verifyUrl, {
        email: formData.email,
        code: verificationCode,
      });

      const userId = verifyResponse.data?.profile?.user_id;

      if (!userId) {
        throw new Error("Verification succeeded, but user ID was not returned.");
      }

      const profileUrl = role === 'organizer'
        ? process.env.NEXT_PUBLIC_CREATOR_PROFILE!
        : process.env.NEXT_PUBLIC_USER_PROFILE!;

      const profilePayload = {
        user_id: userId,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNo: formData.phoneNo,
        address: formData.address,
        ...(role === 'organizer' && { brandName: formData.brandName }),
      };

      await axios.post(profileUrl, profilePayload);

      alert("Account and profile created successfully! Redirecting to login...");
      router.push('/auth/signin');

    } catch (err: any) {
      setError(err.response?.data?.message || "Verification or profile creation failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Render a loading state until the role has been determined from the URL
  if (!role) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

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
              <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none" required />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none" required />
            </div>
            <input type="email" name="email" placeholder="Email" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none" required />
            <input type="text" name="phoneNo" placeholder="Phone Number" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none" required />
            <input type="text" name="address" placeholder="Address" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none" required />

            {role === 'organizer' && (
              <input type="text" name="brandName" placeholder="Brand Name" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none" required />
            )}

            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 pl-4 pr-10 text-black" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5">
                {showPassword ? <Eye className="w-5 h-5 text-gray-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange} className="w-full border border-black rounded-lg py-3 pl-4 pr-10 text-black" required />
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

      {/* Verification Modal */}
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
                    {/* Corrected JSX syntax */}
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


// Main Page Component Wrapper - no longer needs Suspense for this specific fix
export default SignUpPage;
