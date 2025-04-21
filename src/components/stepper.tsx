'use client'
import React from "react";
interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    if (currentStep < 0 || currentStep >= steps.length) {
        console.error("Invalid currentStep value");
        return null;
    }

    return (
        <div className="w-full px-4 py-8">
            <div className="relative grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isUpcoming = index > currentStep;

                    return (
                        <div
                            key={step}
                            className="relative z-10 flex flex-col items-center"
                            aria-current={isCurrent ? "step" : undefined}
                        >
                            {/* Step indicator */}
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                transition-all duration-300
                                ${isCompleted
                                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                                    : isCurrent
                                        ? "border-4 border-blue-500 bg-white dark:bg-gray-900 text-blue-500 dark:text-blue-400 scale-125"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"}
                                ${!isUpcoming ? "ring-8 ring-blue-100/50 dark:ring-blue-900/20" : ""}
                            `}>
                                {isCompleted ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <span className="font-semibold">{index + 1}</span>
                                )}
                            </div>

                            {/* Step label */}
                            <p className={`
                                mt-4 text-sm font-medium text-center
                                ${isCompleted
                                    ? "text-gray-600 dark:text-gray-300"
                                    : isCurrent
                                        ? "text-blue-600 dark:text-blue-400 font-bold"
                                        : "text-gray-400 dark:text-gray-500"}
                            `}>
                                {step}
                            </p>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className={`
                                    absolute top-5 left-[calc(50%+2rem)] w-full h-1
                                    ${isCompleted
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                        : "bg-gray-200 dark:bg-gray-700"}
                                    transform translate-x-1/2
                                `} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;