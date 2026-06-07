import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

interface TimerProps {
  cookieKey: string;
  durationInSeconds: number;
  onExpire?: () => void;
}

const OtpTimerModal: React.FC<TimerProps> = ({
  cookieKey,
  durationInSeconds,
  onExpire
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(1);
  const cookies = getCookie("ExpTime");
  useEffect(() => {
    const now = new Date().getTime();
    const storedTime: any = getCookie("ExpTime");

    if (storedTime) {
      const expiryTime = new Date(storedTime).getTime();
      const remainingTime = Math.max((expiryTime - now) / 1000, 0);
      setTimeLeft(remainingTime);
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cookieKey, durationInSeconds, cookies]);

  useEffect(() => {
    if (timeLeft === 0 && onExpire) {
      onExpire();
      // setStep("login");
    }
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);

  return (
    <div className=" w-full flex gap-x-2 justify-center items-center">
      <span className=" text-xs lg:text-sm">ارسال مجدد کد تایید بعد از </span>
      <p className="text-xs lg:text-sm text-orange-300 ">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
};

export default OtpTimerModal;
