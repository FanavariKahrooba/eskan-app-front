
import { ZodIssue } from "zod";
export type ValidationError = Partial<Pick<ZodIssue, "path" | "message">>;
import Pusher from "pusher-js";

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}
export interface FormState {
    data?: string | null;
    error?: ValidationError[] | null;
}

export type NavLink = {
    titleKey: string;
    href: string;
};
export type NavLinksProp = NavLink[];

export type ToolbarSectionType = {
    titleKey: string;
    link: string;
};
export type ToolbarSectionProps = ToolbarSectionType[];


export interface Exhibition {
    id: number;
    title: string;
    description: string;
    image: string | null;
    link: string;
    user: { name: string } | null;
}

export interface AuctionImage {
    id: number;
    image: string;
}

export interface Auction {
    id: number;
    title: string;
    description: string;
    images: AuctionImage[];
    type?: any;
}


export enum AuthSteps {
    login = "login",
    register = "register",
    verifyOtp = "verifyOtp",
    done = "done"
}

export interface AuthContextProps {
    isAuthenticated: boolean;
    user: any;
    registerOtp: ({ setErrors, ...props }: any) => any;
    VerifyOtp: ({ setErrors, ...props }: any) => any;
    register: ({ setErrors, ...props }: any) => any;
    logout: ({ setErrors, ...props }: any) => any;
}
export interface AuthFlowContextProps {
    step: AuthSteps;
    setStep: (step: AuthSteps) => void;
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}


export interface ProjectImage {
    id: number;
    url: string;
    alt?: string;
    order?: number;
}

export interface Project {
    id: number;
    title: string;
    description?: string;
    status?: string;
    meta_title?: string;
    meta_description?: string;
    featured_image?: string | null;
    images: ProjectImage[];
}
