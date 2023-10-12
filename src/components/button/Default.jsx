export default function DefaultButton({ children, className, ...props }) {
    return (
        <button
            type="button"
            className={`bg-blue-500 hover:bg-blue-600 transition-colors rounded text-white px-2 py-1 ${className}`}
            {...props}>
            {children}
        </button>
    );
}
