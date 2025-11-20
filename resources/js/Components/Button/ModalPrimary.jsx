export default function ModalPrimary({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex w-full justify-center rounded bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-400 sm:ml-3 sm:w-auto"
        >
            {children}
        </button>
    )
}