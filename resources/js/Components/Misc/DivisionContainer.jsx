export default function DivisionContainer({ children, bgcolor }) {
    return (
        <span 
            className="w-full py-2 px-4 text-black font-semibold rounded"
            style={{ backgroundColor: bgcolor || '#gray' }}
        >
            {children}
        </span>
    )
}