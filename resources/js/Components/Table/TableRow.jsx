export default function TableRow({ children, colspan, onClick, className = "" }) {
    const baseClassName = "hover:bg-green-100 dark:hover:bg-green-800";
    const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;
    
    return (
        <tr className={combinedClassName} onClick={onClick}>
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
