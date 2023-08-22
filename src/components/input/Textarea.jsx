export default function Textarea({ className, value = "", ...props }) {
    return (
        <textarea
            {...props}
            className={`w-full !h-60 !rounded-sm bg-gray-50 !p-2 !outline-none focus:!outline-none !border-2 text-base ${className}`}>
            {value}
        </textarea>
    );
}
