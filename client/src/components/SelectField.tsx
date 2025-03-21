interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectField({ label, name, value, options, onChange }: SelectFieldProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 p-2 border rounded w-full"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
