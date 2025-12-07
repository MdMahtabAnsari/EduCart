"use client";
import React, { useEffect } from 'react';

// Define Razorpay types
export interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface RazorpayOptions {
    key: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    [key: string]: unknown;
}

export interface RazorpayInstance {
    open: () => void;
}

declare global {
    interface Window {
        Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface PaymentProviderProps {
    children: React.ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {

    useEffect(() => {
        // Check if Razorpay script is already loaded
        if (window.Razorpay) {
            return;
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            console.log('Razorpay script loaded successfully');
        };
        script.onerror = () => {
            console.error('Failed to load Razorpay script');
        };

        document.body.appendChild(script);

        // Cleanup
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return <>{children}</>;
};