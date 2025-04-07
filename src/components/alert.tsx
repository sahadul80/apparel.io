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
            border: "border-red",
            iconBg: "bg-red",
            titleColor: "text-[#BC1C21]",
            textColor: "text-red-light",
            icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    {/* SVG paths */}
                </svg>
            )
        },
        warning: {
            border: "border-orange",
            iconBg: "bg-orange",
            titleColor: "text-[#C7761E]",
            textColor: "text-orange-light",
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {/* SVG paths */}
                </svg>
            )
        },
        success: {
            border: "border-green",
            iconBg: "bg-green",
            titleColor: "text-[#2A913C]",
            textColor: "text-green-light",
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {/* SVG paths */}
                </svg>
            )
        }
    };

    const { border, iconBg, titleColor, textColor, icon } = config[type];

    return (
        <div className="bg-white py-10 dark:bg-dark">
            <div className="container">
                <div className={`flex w-full rounded-lg border-l-[6px] ${border} bg-${type}-light-6 px-7 py-8 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] md:p-9`}>
                    <div className={`mr-5 flex h-[34px] w-full max-w-[34px] items-center justify-center rounded-lg ${iconBg}`}>
                        {icon}
                    </div>
                    <div className="w-full">
                        <h5 className={`mb-3 text-base font-semibold ${titleColor}`}>
                            {title}
                        </h5>
                        {messages.length > 0 && (
                            <ul className="list-inside list-disc">
                                {messages.map((message, index) => (
                                    <li key={index} className={`text-base leading-relaxed ${textColor}`}>
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