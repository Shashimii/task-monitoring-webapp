import { Input } from '@/Components/ui/input';
import Label from '@/Components/Form/Label';

export default function PrimaryInput({ type, placeholder, label, ...props }) {
    return (
        <div className="space-y-2">
            <Label
                title={label}
            />

            <Input
                type={type}
                placeholder={placeholder}
                {...props}
            />
        </div>
    )
}