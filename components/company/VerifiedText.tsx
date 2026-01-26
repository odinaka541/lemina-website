import React from 'react';

export interface VerifiedValue {
    value: string;
    isEstimated?: boolean;
}

interface VerifiedTextProps {
    data?: VerifiedValue | string;
    className?: string;
}

export default function VerifiedText({ data, className = "" }: VerifiedTextProps) {
    if (!data) return <span className={className}>N/A</span>;

    const text = typeof data === 'string' ? data : data.value;
    const isEstimated = typeof data === 'string' ? false : data.isEstimated;

    return (
        <span className={`${className} ${isEstimated ? 'text-amber-500 font-medium' : ''}`} title={isEstimated ? "Estimated Data" : "Verified Data"}>
            {text} {isEstimated && '*'}
        </span>
    );
}
