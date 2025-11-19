import Label from '@/Components/Form/Label';

import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectInput({ label, placeholder, children }) {
    return (
        <>
            <Label
                title={label}
            />
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {children}
                </SelectContent>
            </Select>
        </>
    )
}