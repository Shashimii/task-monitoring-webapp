export default function TableData({ children, colSpan, className = "" }) {
    const baseClassName = "px-4 py-3 text-sm dark:text-white text-lg font-semibold";
    const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;
    
    return (
        <td className={combinedClassName} colSpan={colSpan}>
            {children}
        </td>
    )
}