export function IconGamepad({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <path d="M7 10v4M5 12h4" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
