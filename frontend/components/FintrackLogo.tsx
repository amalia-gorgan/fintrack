interface FintrackLogoProps {
    /** Overall size of the icon (text scales a bit with it) */
    size?: "sm" | "md" | "lg";
    /** Show the tagline under the name */
    showTagline?: boolean;
}

const iconSizeMap: Record<NonNullable<FintrackLogoProps["size"]>, number> = {
    sm: 40,
    md: 56,
    lg: 72,
};

export default function FintrackLogo({
                                         size = "md",
                                         showTagline = true,
                                     }: FintrackLogoProps) {
    const iconSize = iconSizeMap[size];

    return (
        <div className="inline-flex flex-col items-center text-center">
            {/* Geometric icon */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 64 64"
                aria-hidden="true"
                className="mb-2"
            >
                {/* Outer polygon */}
                <polygon
                    points="32 4 56 20 50 48 32 60 14 48 8 20"
                    fill="none"
                    stroke="#1F3F63"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Inner lines to mimic the faceted look */}
                <polyline
                    points="32 4 14 48 56 20 8 20 50 48 32 4"
                    fill="none"
                    stroke="#1F3F63"
                    strokeWidth={2.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <polyline
                    points="14 48 32 32 56 20"
                    fill="none"
                    stroke="#1F3F63"
                    strokeWidth={2.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <polyline
                    points="8 20 32 32 32 60"
                    fill="none"
                    stroke="#1F3F63"
                    strokeWidth={2.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Brand name */}
            <span
                className={`
          font-extrabold tracking-wide text-[#174A7B]
          ${size === "sm" ? "text-lg" : ""}
          ${size === "md" ? "text-xl" : ""}
          ${size === "lg" ? "text-2xl" : ""}
        `}
            >
        FINTRACK
      </span>

            {/* Tagline */}
            {showTagline && (
                <span
                    className={`
            mt-1 uppercase tracking-[0.10em] text-[#174A7B]
            ${size === "sm" ? "text-[0.55rem]" : ""}
            ${size === "md" ? "text-xs" : ""}
            ${size === "lg" ? "text-sm" : ""}
          `}
                >
          Smart Money, Simplified
        </span>
            )}
        </div>
    );
}
