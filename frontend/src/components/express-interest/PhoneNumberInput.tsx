import { Input } from "@/components/ui/input";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const formatPhoneNumber = (input: string): string => {
    const numbers = input.replace(/\D/g, "");

    const chunks = [
      numbers.slice(0, 4),
      numbers.slice(4, 7),
      numbers.slice(7, 10),
    ];

    return chunks
      .map((chunk, index) =>
        index === chunks.length - 1 ? chunk : `${chunk} `
      )
      .join("")
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <>
      <Input
        id="whatsappNumber"
        placeholder="0771 234 567"
        value={value}
        onChange={handleChange}
        className={error ? "border-red-500" : ""}
        data-testid="phone-input"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
};
