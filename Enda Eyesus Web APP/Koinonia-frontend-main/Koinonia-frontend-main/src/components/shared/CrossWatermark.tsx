export function CrossWatermark() {
    return (
        <div className="cross-watermark" aria-hidden="true">
            <svg
                width="600"
                height="600"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outer ring */}
                <circle cx="100" cy="100" r="90" stroke="#C9A227" strokeWidth="2" fill="none" />
                <circle cx="100" cy="100" r="80" stroke="#C9A227" strokeWidth="0.7" fill="none" />

                {/* Ethiopian Orthodox Cross – main vertical and horizontal bars */}
                {/* Vertical bar */}
                <rect x="93" y="20" width="14" height="160" rx="2" fill="#C9A227" />
                {/* Horizontal bar */}
                <rect x="30" y="65" width="140" height="14" rx="2" fill="#C9A227" />

                {/* Decorative cross ends – top */}
                <rect x="91" y="20" width="4" height="12" rx="1" fill="#C9A227" />
                <rect x="105" y="20" width="4" height="12" rx="1" fill="#C9A227" />
                <rect x="84" y="18" width="32" height="6" rx="2" fill="#C9A227" />

                {/* Decorative cross ends – bottom */}
                <rect x="91" y="168" width="4" height="12" rx="1" fill="#C9A227" />
                <rect x="105" y="168" width="4" height="12" rx="1" fill="#C9A227" />
                <rect x="84" y="176" width="32" height="6" rx="2" fill="#C9A227" />

                {/* Decorative cross ends – left */}
                <rect x="18" y="63" width="12" height="4" rx="1" fill="#C9A227" />
                <rect x="18" y="71" width="12" height="4" rx="1" fill="#C9A227" />
                <rect x="16" y="60" width="6" height="18" rx="2" fill="#C9A227" />

                {/* Decorative cross ends – right */}
                <rect x="170" y="63" width="12" height="4" rx="1" fill="#C9A227" />
                <rect x="170" y="71" width="12" height="4" rx="1" fill="#C9A227" />
                <rect x="178" y="60" width="6" height="18" rx="2" fill="#C9A227" />

                {/* Center circle */}
                <circle cx="100" cy="72" r="8" fill="#C9A227" />
                <circle cx="100" cy="72" r="4" fill="#F8F5F0" />

                {/* Small decorative dots at cross junctions */}
                <circle cx="100" cy="100" r="5" fill="#C9A227" />
            </svg>
        </div>
    );
}
