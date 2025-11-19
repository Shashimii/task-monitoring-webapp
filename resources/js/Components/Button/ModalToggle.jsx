export default function ModalToggle({ children, disabled, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            type="button"
            className={`inline-flex items-center rounded-md border border-transparent 
                bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white 
                transition duration-150 ease-in-out 
                hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                active:bg-gray-900 dark:bg-violet-800 dark:text-white dark:hover:bg-violet-600 
                dark:focus:bg-violet-600 dark:focus:ring-offset-violet-800 dark:active:bg-violet-300 ${disabled && 'opacity-25'}`}
        >
            {children}
        </button>
    )
}