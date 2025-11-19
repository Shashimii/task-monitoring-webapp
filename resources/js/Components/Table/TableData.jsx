export default function TableData({ children }) {
    return (
        <td className="px-4 py-3 text-sm dark:text-white text-lg font-semibold">
            {children}
        </td>
    )
}