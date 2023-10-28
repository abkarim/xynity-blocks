export default function SaveButton({ children, className, ...props }) {
    return (
        <button
            type="button"
            className={`bg-green-500 hover:bg-green-600 transition-colors rounded text-white px-2 py-1 ${className}`}
            {...props}>
            {children}
        </button>
    );
}
