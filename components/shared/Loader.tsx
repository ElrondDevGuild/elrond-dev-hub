export default function Loader({ hasPadding = true, size = "32" }) {
  return (
    <div
      className={`mx-auto ${
        hasPadding && "py-32"
      } flex flex-col items-center justify-center w-${size} text-theme-title dark:text-theme-title-dark`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-16 w-16 animate-spin`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {/* <span className="mt-2 block text-sm font-medium  pt-2">Loading...</span> */}
    </div>
  );
}
