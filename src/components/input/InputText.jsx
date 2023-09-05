export default function TextInput({ className, ...props }) {
    return (
        <input
            {...props}
            className={`inline-block !bg-transparent ${className}`}
        />
    );
}
