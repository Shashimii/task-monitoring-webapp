export default function TableRow({ children, colspan }) {
    return (
        <tr className="hover:bg-green-100 dark:hover:bg-green-800">
            {colspan ? (
                <td colSpan={colspan} className="text-center py-4">
                    {children}
                </td>
            ) : (
                children
            )}
        </tr>
    );
}
