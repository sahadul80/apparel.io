import React from "react";

interface OrderStepProps {
    step: number;
    onNext: () => void;
    onBack: () => void;
}

const OrderStep: React.FC<OrderStepProps> = ({ step, onNext, onBack }) => {
    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Product Selection</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 pl-11">Browse and select items from our catalog. Choose categories that match your preferences.</p>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Customization</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 pl-11">Provide specific details, upload files, or request custom modifications for your order.</p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Details</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 pl-11">Enter your delivery address and preferred shipping method.</p>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 pl-11">Securely complete your payment using credit card, PayPal, or other available methods.</p>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order Confirmed!</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 pl-11">Your order has been successfully processed. Here is your summary:</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-2xl transition-colors duration-300">
            <div className="mb-8">{renderStepContent()}</div>
            <div className="flex justify-between gap-4">
                <button
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                        ${step === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}
                        `}
                    disabled={step === 0}
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                        bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
                        ${step === 4 ? "w-full" : ""}`}
                    onClick={onNext}
                >
                    {step === 4 ? "Finish Order" : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default OrderStep;