export default function TableContainer({ children, tableTitle, borderColor, headerContent }) {
    return (
        <div className={`p-6 overflow-hidden bg-white shadow-lg sm:rounded-lg dark:bg-gray-800 border-l-8 ${borderColor}`}>
            <div className="w-full flex items-center justify-between">
                <p className="ml-3 mb-4 text-3xl font-semibold">
                    {tableTitle}
                </p>
                {headerContent}
            </div>
            {children}
        </div>
    )
}