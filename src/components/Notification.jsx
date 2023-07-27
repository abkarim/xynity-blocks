/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import {
    useNotification,
    useNotificationUpdate,
} from "../context/notification.jsx";

const typeMap = {
    warning: {
        fgClass: "text-yellow-400",
    },
    error: {
        fgClass: "text-red-400",
    },
    info: {
        fgClass: "text-white",
    },
    default: {
        fgClass: "text-emerald-400",
    },
};

export default function Notification({ ...props }) {
    const containerRef = useRef(null);

    const setNotification = useNotificationUpdate();
    const notification = useNotification();

    useEffect(() => {
        if (containerRef.current === null) return;
        containerRef.current.classList.add("opacity-0");

        setTimeout(() => {
            containerRef.current.classList.remove("opacity-0");
        }, 200);

        // Clear notification after 5 seconds
        const timer = setTimeout(() => {
            removeNotification();
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification]);

    const { fgClass } = typeMap[notification.type] || typeMap.default;

    const removeNotification = () => setNotification({});

    return (
        notification.type && (
            <div
                className="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-60"
                ref={containerRef}>
                <div className="flex justify-between p-3 text-sm shadow-lg bg-slate-800 text-slate-50 md:rounded">
                    <div className={`font-medium font-lato ${fgClass}`}>
                        {notification.text}
                    </div>
                    <button
                        className="pl-2 ml-3 border-l border-gray-700 text-slate-500 hover:text-slate-400"
                        onClick={removeNotification}>
                        <span className="sr-only">Close</span>
                        <svg
                            className="w-4 h-4 fill-current shrink-0"
                            viewBox="0 0 16 16">
                            <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    );
}
