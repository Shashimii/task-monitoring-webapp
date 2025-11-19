export default function TableRow({children}) {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
            {children}
        </tr>
    )
}