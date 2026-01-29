'use client';

import React, { useEffect, useState } from 'react';

export default function PlusGridBackdrop({ className = "", baseOpacity = 0.3 }: { className?: string, baseOpacity?: number }) {
    const [opacityMap, setOpacityMap] = useState<number[]>([]);

    useEffect(() => {
        // Hydration matching: initialize with 0s then randomize on mount
        setOpacityMap(new Array(400).fill(0).map(() => Math.random()));
    }, []);

    // Create a grid of +'s spanning the container
    return (
        <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 70%)`
                }}
            />
            <div className="w-full h-full grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))]" style={{ opacity: baseOpacity }}>
                {Array.from({ length: 1000 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center text-[var(--color-text-secondary)] transition-opacity duration-[2000ms]"
                        style={{
                            opacity: (opacityMap[i] || 0.1) * 0.5
                        }}
                    >
                        +
                    </div>
                ))}
            </div>
        </div>
    );
}
