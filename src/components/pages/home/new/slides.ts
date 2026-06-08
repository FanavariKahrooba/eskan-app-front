// components/hero/slides.ts
export type HeroSlide = {
    src: string;
    alt: string;
    title: string;
    subtitle?: string;
    cta?: { label: string; href: string };
};

export const heroSlides: HeroSlide[] = [
    {
        src: "/assets/images/hero/140412002.jpg",
        alt: "حضرت آیت الله خامنه ای",
        title: "",
        subtitle: "",
        // cta: { label: "مشاهده سراها", href: "/shelters" },
    },
    {
        src: "/assets/images/hero/140412003.jpg",
        alt: "حضرت آیت الله خامنه ای",
        title: "",
        subtitle: "",
        // cta: { label: "شروع رزرو", href: "/login-otp" },
    },
    {
        src: "/assets/images/hero/background.jpg",
        alt: "حضرت آیت الله خامنه ای",
        title: "",
        subtitle: "",
        // cta: { label: "درباره سامانه", href: "/about" },
    },
];
