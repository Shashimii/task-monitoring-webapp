export default function ActionData({ children, colSpan, className = "" }) {
    const baseClassName = "w-full px-4 py-3 flex justify-center";
    const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;
    
    return (
        <td className={combinedClassName} colSpan={colSpan}>
            {children}
        </td>
    )
}