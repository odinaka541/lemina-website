export default function BottomGrid() {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
            {/* Grid Pattern with Fade In from Top */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
            />
        </div>
    );
}
