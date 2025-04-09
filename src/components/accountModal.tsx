'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailLogin = async () => {
        try {
            const res = await signIn('email', { email, redirect: false });
            if (res?.error) {
                setErrorMessage('Failed to sign in. Please check your email and try again.');
            } else {
                onClose();
            }
        } catch (error) {
            console.error('Email login error:', error);
            setErrorMessage('An error occurred during email login.');
        }
    };

    const handleSignUp = async () => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Signup failed. Please try again.');
            }

            const result = await response.json();
            console.log('Signup successful:', result);
            setIsLoginView(true);
        } catch (error) {
            console.error('Signup error:', error);
            setErrorMessage('Failed to create an account. Please try again.');
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-center mb-6">
                                    <Link href="/" className="flex items-center space-x-2 transition duration-500 hover:scale-110">
                                        <svg
                                            className="h-8 w-8 text-gray-900 dark:text-gray-100"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            apparel.io
                                        </span>
                                    </Link>
                                </div>

                                <div className="flex space-x-4 mb-6">
                                    <button
                                        className={`flex-1 py-2 font-medium hover:cursor-pointer ${isLoginView
                                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                        onClick={() => setIsLoginView(true)}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className={`flex-1 py-2 font-medium hover:cursor-pointer ${!isLoginView
                                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                        onClick={() => setIsLoginView(false)}
                                    >
                                        Create Account
                                    </button>
                                </div>

                                {errorMessage && (
                                    <div className="mb-4 text-sm text-red-500">{errorMessage}</div>
                                )}

                                {isLoginView ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                                            onClick={handleEmailLogin}
                                        >
                                            LogIn
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="signup-email"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="signup-email"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="signup-password"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="signup-password"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="signup-cpassword"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="signup-cpassword"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                                            onClick={handleSignUp}
                                        >
                                            Create Account
                                        </button>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AccountModal;
