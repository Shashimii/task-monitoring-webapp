export default function TableRow({children}) {
    return (
        <tr className="hover:bg-green-100 dark:hover:bg-green-800">
            {children}
        </tr>
    )
}