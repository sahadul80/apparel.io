import React from "react";

type AlertType = "error" | "warning" | "success";

interface AlertProps {
    type?: AlertType;
    title: string;
    messages?: string[];
}

const Alert: React.FC<AlertProps> = ({
    type = "error",
    title,
    messages = []
}) => {
    // Configuration type
    type AlertConfig = {
        border: string;
        iconBg: string;
        titleColor: string;
        textColor: string;
        icon: React.ReactNode;
    };

    const config: Record<AlertType, AlertConfig> = {
        error: {
            border: "border-red-500",
            iconBg: "bg-red-100 dark:bg-red-700",
            titleColor: "text-red-600 dark:text-red-400",
            textColor: "text-red-500 dark:text-red-300",
            icon: (
                <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                        fill="currentColor"
                    />
                </svg>
            )
        },
        warning: {
            border: "border-yellow-500",
            iconBg: "bg-yellow-100 dark:bg-yellow-700",
            titleColor: "text-yellow-600 dark:text-yellow-400",
            textColor: "text-yellow-500 dark:text-yellow-300",
            icon: (
                <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                        fill="currentColor"
                    />
                </svg>
            )
        },
        success: {
            border: "border-green-500",
            iconBg: "bg-green-100 dark:bg-green-700",
            titleColor: "text-green-600 dark:text-green-400",
            textColor: "text-green-500 dark:text-green-300",
            icon: (
                <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"
                        fill="currentColor"
                    />
                </svg>
            )
        }
    };

    const { border, iconBg, titleColor, textColor, icon } = config[type];

    return (
        <div className="py-6 px-4 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-2xl mx-auto">
                <div
                    className={`flex items-start md:items-center rounded-lg border-l-4 ${border} bg-white dark:bg-gray-900 shadow-md p-4 md:p-6`}
                >
                    <div
                        className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${iconBg}`}
                    >
                        {icon}
                    </div>
                    <div className="ml-4">
                        <h5 className={`text-base font-medium ${titleColor}`}>{title}</h5>
                        {messages.length > 0 && (
                            <ul className="mt-2 font-normal text-xs list-disc pl-4">
                                {messages.map((message, index) => (
                                    <li
                                        key={index}
                                        className={`text-sm ${textColor}`}
                                    >
                                        {message}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
