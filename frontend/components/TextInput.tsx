import { ChangeEvent } from "react";

interface TextInputProps {
    label: string;
    type?: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    autoComplete?: string;
}

export default function TextInput({
                                      label,
                                      type = "text",
                                      name,
                                      value,
                                      onChange,
                                      placeholder,
                                      error,
                                      autoComplete,
                                  }: TextInputProps) {
    return (
        <div className="space-y-1">
            <label
                htmlFor={name}
                className="block text-xs font-medium uppercase tracking-wide text-slate-700"
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition
          ${error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"}
          focus:ring-2 focus:ring-blue-300 focus:border-blue-400`}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
