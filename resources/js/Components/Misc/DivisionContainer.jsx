export default function DivisionContainer({ children, bgcolor }) {
    return (
        <span className={`w-full py-2 px-4 text-white font-semibold rounded ${bgcolor}`}>
            {children}
        </span>
    )
}