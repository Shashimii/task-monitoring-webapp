export default function ModalSecondary({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="mt-3 inline-flex w-full justify-center rounded bg-gray-800 px-3 py-2 text-sm font-semibold text-black ring-1 ring-inset ring-white/5 dark:bg-white/10 text-white dark:hover:bg-white/20 sm:mt-0 sm:w-auto"
        >
            {children}
        </button>
    )
}