export default function TableContainer({ children, tableIcon, tableTitle, borderColor, headerContent }) {
    return (
        <div className={`p-6 overflow-hidden bg-white shadow-lg sm:rounded-lg dark:bg-gray-800 border-l-8 ${borderColor}`}>
            <div className="w-full flex flex-col items-center justify-between sm:flex-row">
                <span className="flex items-center gap-1 ">
                    <p className="ml-3 mb-4 text-3xl font-semibold">
                        {tableIcon}
                    </p>
                    <p className="ml-3 mb-4 text-3xl font-semibold">
                        {tableTitle}
                    </p>
                </span>
                {headerContent}
            </div>
            {children}
        </div>
    )
}