export default function TableContainer({ children }) {
    return (
        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            {children}
        </div>
    )
}