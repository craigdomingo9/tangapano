import { Card, CardContent } from "@/components/ui/card";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface OptionSelectionCardProps {
  title: string;
  description: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  showDescriptions?: boolean;
}

export const OptionSelectionCard: React.FC<OptionSelectionCardProps> = ({
  title,
  description,
  options,
  selectedValue,
  onSelect,
  showDescriptions = false,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h4 className="font-medium mb-4">{title}</h4>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        <div
          className={`space-y-3 ${showDescriptions ? "" : "grid grid-cols-1"}`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedValue === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              data-testid={`option-${option.value}`}
            >
              <div className="font-medium">{option.label}</div>
              {showDescriptions && option.description && (
                <div className="text-sm text-gray-600 mt-1">
                  {option.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
