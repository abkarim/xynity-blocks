export default function Select({ className, children, ...props }) {
    return (
        <select
            {...props}
            className={`p-2 border-2 bg-gray-50 cursor-pointer rounded-sm outline-none focus:outline-none border-red-700 ${className}`}>
            {children}
        </select>
    );
}
