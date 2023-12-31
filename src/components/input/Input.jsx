const Input = ({ placeholder, className = "", ...props }) => {
    return (
        <input
            type="number"
            placeholder={placeholder}
            className={`w-full h-full !rounded-sm bg-gray-50 !p-2 !outline-none focus:!outline-none !border-2 text-base ${className}`}
            {...props}
        />
    );
};

export default Input;
