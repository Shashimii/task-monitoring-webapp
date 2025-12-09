export default function IconButton({icon, iconColor, onClick }) {
    return (
        <button 
            className={`text-${iconColor} hover:text-${iconColor}-dark focus:outline-none`} 
            onClick={onClick}
        >
            {icon}
        </button>
    )
}