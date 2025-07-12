import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type RHFPasswordInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
};

const RHFPasswordInput = ({
  name,
  label = "Password",
  placeholder = "Enter your password",
}: RHFPasswordInputProps) => {
  const { control } = useFormContext();
  const [show, setShow] = useState<boolean>(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                {...field}
              />
              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFPasswordInput;
