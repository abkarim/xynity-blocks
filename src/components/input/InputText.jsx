export default function TextInput({ className, ...props }) {
    return (
        <input
            {...props}
            className={`inline-block text-base !bg-transparent w-full h-full p-2 rounded-sm ${className}`}
        />
    );
}
