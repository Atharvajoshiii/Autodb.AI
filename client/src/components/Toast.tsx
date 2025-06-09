import { CheckIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ToastProps {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  id?: string;
}

export default function Toast({ type, title, message, id }: ToastProps) {
  const { dismiss } = useToast();

  const handleDismiss = () => {
    if (id) {
      dismiss(id);
    }
  };

  const bgColor = type === "success" 
    ? "bg-success bg-opacity-95" 
    : type === "error" 
      ? "bg-destructive bg-opacity-95" 
      : "bg-primary bg-opacity-95";

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded-md shadow-lg flex items-center mb-3`}>
      {type === "success" && <CheckIcon className="mr-2 h-5 w-5" />}
      {type === "error" && <XIcon className="mr-2 h-5 w-5" />}
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-white text-opacity-90">{message}</div>
      </div>
      <button 
        className="ml-auto text-white text-opacity-80 hover:text-opacity-100"
        onClick={handleDismiss}
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
