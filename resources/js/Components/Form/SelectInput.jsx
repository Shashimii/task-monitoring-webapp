import Label from '@/Components/Form/Label';

import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectInput({ label, placeholder, children, value, onChange, error }) {
    return (
        <div className="space-y-2">
            <Label
                title={label}
            />
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {children}
                </SelectContent>
            </Select>
            
            <p className="text-red-600 dark:text-red-500">{error}</p>
        </div>
    )
}