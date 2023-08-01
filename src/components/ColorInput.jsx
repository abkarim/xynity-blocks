export default function ColorInput({ className = "", ...props }) {
    return (
        <input
            type="color"
            className={`w-10 h-10 !p-0 !border-none !outline-none cursor-pointer ${className}`}
            {...props}
        />
    );
}
