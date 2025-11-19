export default function StatusContainer({ children, bgcolor }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`p-3 rounded-full ${bgcolor}`}>
            </span>

            <p className="text-black font-semibold dark:text-white">
                {children}
            </p>
        </div>
    )
}