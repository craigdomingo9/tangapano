import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSignIcon,
  LucideIcon,
  PhoneIcon,
  UserIcon,
  Building2Icon,
  ChevronDownIcon,
} from "lucide-react";

interface AgentFormData {
  full_name: string;
  campus: string;
  phone_number: string;
  agent_fee: string;
}

interface AgentEditorFormProps {
  updateField: (key: keyof AgentFormData, value: string) => void;
  formData: AgentFormData;
  campuses: Campus[]; // Added campuses prop
}

// --- Main Form Component ---

function AgentEditorForm({
  formData,
  updateField,
  campuses,
}: AgentEditorFormProps) {
  return (
    <div className="w-full space-y-4">
      {/* Full Name */}
      <AgentInput
        Icon={UserIcon}
        id="fullname"
        label="Full Name"
        placeholder="Chris T K"
        value={formData.full_name}
        onChange={(e) => updateField("full_name", e.target.value)}
      />

      {/* Campus - Native Select */}
      <div className="space-y-2">
        <Label htmlFor="campus">Campus</Label>
        <div className="relative">
          {/* Optional: Icon for consistency */}
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
            <Building2Icon className="size-4" />
          </div>

          <SelectNative
            id="campus"
            value={formData.campus}
            onChange={(e) => updateField("campus", e.target.value)}
            className="pl-9" // Add padding to accommodate the icon
          >
            <option value="" disabled>
              Select a campus
            </option>
            {campuses &&
              campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
          </SelectNative>
        </div>
      </div>

      {/* Phone Number */}
      <AgentInput
        Icon={PhoneIcon}
        id="phone_number"
        label="Phone Number"
        placeholder="+263776808964"
        value={formData.phone_number}
        onChange={(e) => updateField("phone_number", e.target.value)}
      />

      {/* Agent Fee */}
      <AgentInput
        Icon={DollarSignIcon}
        id="agent_fee"
        label="Agent Fee"
        placeholder="10"
        type="number"
        value={formData.agent_fee}
        onChange={(e) => updateField("agent_fee", e.target.value)}
      />
    </div>
  );
}

export default AgentEditorForm;

// --- Helper Components ---

// 1. Reusable Input Wrapper
interface AgentInputProps {
  label: string;
  Icon: LucideIcon;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function AgentInput({
  label,
  Icon,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
}: AgentInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <Icon className="size-4" />
          <span className="sr-only">{label}</span>
        </div>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className="peer pl-9 text-sm"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// 2. SelectNative Helper (Styled to match shadcn Input)
interface SelectNativeProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

function SelectNative({ className, children, ...props }: SelectNativeProps) {
  return (
    <div className="relative">
      <select
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  );
}
