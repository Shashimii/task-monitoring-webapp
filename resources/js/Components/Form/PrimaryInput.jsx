export default function PrimaryInput({ type, placeholder, value, onChange, disabled = false, error, autoComplete = "off" }) {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                autoComplete={autoComplete}
                className={`
                    w-full px-4 py-2 border 
                    ${error ? "border-red-500" : "border-gray-400"}
                    rounded
                    focus:outline-none 
                    focus:ring-1
                    ${error ? "focus:ring-red-500" : "focus:ring-green-600"}    
                    transition duration-300
                    disabled:opacity-70
                    disabled:bg-gray-100
                    disabled:cursor-not-allowed
                `}
            />
            {error &&
                <p className="text-sm text-red-500">
                    {error}
                </p>
            }
        </div>
    )
}