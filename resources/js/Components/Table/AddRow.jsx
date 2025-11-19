export default function AddRow({ children }) {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td colSpan={7}>
                <button className="w-full py-2 px-4 bg-green-400 text-left hover:bg-green-500 dark:bg-violet-800 dark:text-white cursor-pointer dark:hover:bg-violet-600">
                    {children}
                </button>
            </td>
        </tr>
    )
}