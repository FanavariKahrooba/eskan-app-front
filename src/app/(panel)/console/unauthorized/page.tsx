/**
 * UnauthorizedPage Component
 *
 * This page is displayed when a user tries to access a restricted area
 * without having the required permissions or authentication.
 *
 * It shows a simple message informing the user that the access is denied
 * and provides a link to navigate back to the home page.
 *
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل ادمین | دسترسی غیر مجاز",
  description: "دسترسی غیر مجاز",
};
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-sm lg:text-2xl font-bold text-red-600">
        دسترسی غیرمجاز
      </h1>
      <p className="mt-4 text-gray-600">
        کاربر گرامی شما اجازه دسترسی به این بخش را ندارید.
      </p>
      <Link
        href="/"
        className=" text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 my-4 rounded-xl text-sm"
      >
        خانه
      </Link>
    </div>
  );
}
