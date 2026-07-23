import React from "react";
import { Loader2 } from "lucide-react";

export function LoaderOne({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-brand-orange border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export function LoaderThree({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className="w-3 h-3 rounded-full bg-brand-orange animate-[bounce_1s_infinite_0ms]"></div>
      <div className="w-3 h-3 rounded-full bg-brand-orange animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-3 h-3 rounded-full bg-brand-orange animate-[bounce_1s_infinite_400ms]"></div>
    </div>
  );
}

// A bonus premium loader
export function LoaderPremium({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-orange-100/30 animate-[spin_3s_linear_infinite]"></div>
        
        {/* Inner spinning gradient ring */}
        <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-brand-orange border-r-brand-orange animate-spin"></div>
        
        {/* Center icon */}
        <div className="absolute">
          <Loader2 className="w-5 h-5 text-brand-orange animate-spin duration-1000" />
        </div>
      </div>
    </div>
  );
}
