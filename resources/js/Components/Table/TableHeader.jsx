export default function TableHeader({ children }) {
    return (
        <th className="w-1/12 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider dark:text-white">
            {children}
        </th>
    )
}