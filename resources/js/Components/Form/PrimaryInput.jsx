import { Input } from '@/Components/ui/input';
import Label from '@/Components/Form/Label';

export default function PrimaryInput({ type, placeholder, label }) {
    return (
        <>
            <Label
                title={label}
            />

            <Input
                type={type}
                placeholder={placeholder}
            />
        </>
    )
}