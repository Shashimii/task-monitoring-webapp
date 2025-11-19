export default function TableContainer({ children, tableTitle }) {
    return (
        <div className="p-6 overflow-hidden bg-white shadow-lg sm:rounded-lg dark:bg-gray-800 border-l-8 border-green-300 dark:border-green-600">
            <p className="ml-3 mb-4 text-3xl font-semibold">
                {tableTitle}
            </p>
            {children}
        </div>
    )
}