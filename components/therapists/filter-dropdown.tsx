import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { ChevronDown } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type FilterDropdownOption = { label: string; value: string };

export function FilterDropdown({
  label,
  options,
  onChange,
  widthClassName = "w-[200px]",
}: {
  label: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  widthClassName?: string;
}) {
  const { subtle } = useAuthTheme();

  return (
    <View className={widthClassName}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TouchableOpacity className="h-[52px] px-3 flex-row items-center justify-between border border-border rounded-lg bg-card">
            <Text
              className="text-foreground"
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {label}
            </Text>
            <ChevronDown size={16} color={subtle} />
          </TouchableOpacity>
        </DropdownMenuTrigger>
        <DropdownMenuContent matchTriggerWidth align="start">
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => onChange(opt.value)}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}
