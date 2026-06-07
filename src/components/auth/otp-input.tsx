"use client";
import React, { useEffect, useRef, useState } from "react";

type InputProps = {
  length?: number;
  onComplete: (pin: string) => void;
};

const OTPInput = ({ length = 5, onComplete }: InputProps) => {
  const inputRef: any = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [OTP, setOTP] = useState<string[]>(Array(length).fill(""));

  const handleTextChange = (input: string, index: number) => {
    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      onComplete(newPin.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (OTP[index] === "" && index > 0) {
        inputRef.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current[0].focus();
    }
  }, []);

  return (
    <div dir="ltr" className=" grid grid-cols-5 gap-x-1">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="number"
          maxLength={1}
          value={OTP[index]}
          onChange={(e) => handleTextChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el: any) => (inputRef.current[index] = el)}
          className=" border border-blue-600 rounded-md text-sm text-center font-bold"
          style={{ marginRight: index === length - 1 ? "0" : "0px" }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
