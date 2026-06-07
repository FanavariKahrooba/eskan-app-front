import { type ClassValue, clsx } from "clsx"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const changeTheme = (theme: string) => {
  document.querySelector("html")?.setAttribute("data-theme", theme);
};


export function focusOnErrorPath(errorPath?: string | number) {
  if (!errorPath) {
    return
  }

  const inputElement = document.getElementsByName(
    errorPath.toString(),
  )[0] as HTMLInputElement

  if (inputElement) {
    inputElement.focus()
  }
}

// export function ImageResolver(input: string) {

//   if (!input) {
//     return ``;

//   }
//   return process.env.NEXT_PUBLIC_BACKEND_URL + input;

//   // return input?.startsWith("/storage/")
//   //   ? input
//   //   : `${process.env.NEXT_PUBLIC_BACKEND_URL}${input}`;


//   // return process.env.NEXT_PUBLIC_BACKEND_URL + input;
//   // //  return input?.startsWith("/storage/")
//   // //               ? process.env.NEXT_PUBLIC_BACKEND_URL + input
//   // //               : input
// }
export function ImageResolver(input: string) {
  if (!input) return "/assets/img/teams/avatar.jpg";

  if (input.startsWith("http")) return input;

  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  return `${base}${input.startsWith("/") ? "" : "/"}${input}`;
}

export function AudioResolver(input: string) {
  return process.env.NEXT_PUBLIC_BACKEND_URL + input;

  // return input?.startsWith("/storage/")
  //              ? process.env.NEXT_PUBLIC_BACKEND_URL + input
  //              : input
}


export function CoverResolver(input: string) {
  if (!input) {
    return ``;
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL + input;
}



export function setCookieTime(hours: number) {
  const date = new Date();
  return date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
}

export const reverseText = (input: string) => {
  let ReText = "";
  for (let char of input) {
    ReText = char + ReText;
  }
  return ReText;
};


export const NumEnToFa = (input: number | string, separator: boolean = true) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  // تابع جایگزین برای افزودن کاما هر سه رقم
  const addCommas = (numStr: string) => {
    let result = '';
    let count = 0;
    for (let i = numStr.length - 1; i >= 0; i--) {
      result = numStr[i] + result;
      count++;
      if (count % 3 === 0 && i !== 0) result = ',' + result;
    }
    return result;
  };

  let str = input.toString();

  if (separator) {
    str = addCommas(str);
  }

  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};
export const jumpSmooth = (targetId: string, offset = 260) => {
  const target = document.getElementById(targetId)
  if (target) {
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: "smooth",
    })
  }
}