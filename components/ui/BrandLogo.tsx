import Link from 'next/link';

interface BrandLogoProps {
    textSize?: string;
    iconSize?: string;
    isMobile?: boolean; // legacy prop, use showText instead if possible or keep for compat
    showText?: boolean;
    className?: string; // Allow passing extra classes like 'hidden md:block'
    textClassName?: string;
}

export default function BrandLogo({
    textSize = "text-2xl",
    iconSize = "w-8 h-8",
    isMobile = false,
    showText = true,
    className = "",
    textClassName = ""
}: BrandLogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}>
            <div className={`flex items-center justify-center p-2 rounded-full bg-[var(--color-accent-primary)]/40 backdrop-blur-sm`}>
                <img src="/assets/lemina-new.png" alt="Lemina" className={`${iconSize} rounded-full`} />
            </div>
            {showText && !isMobile && (
                <div className={`font-bold ${textSize} tracking-tight text-[var(--color-text-primary)] ${textClassName}`}>
                    Lemina
                </div>
            )}
        </Link>
    );
}
