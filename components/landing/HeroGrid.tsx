export default function HeroGrid() {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none select-none h-[120vh]">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />

            {/* Subtle Glow at top center (optional, based on "Touch of Class" ref) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-accent-primary)]/10 blur-[100px] rounded-full mix-blend-screen opacity-50" />
        </div>
    );
}
