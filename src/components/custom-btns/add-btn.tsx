import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface AddBtnProps {
  onClick: () => void;
  label: string;
}

export default function AddBtn({ onClick, label }: AddBtnProps) {
  return (
    <Button onClick={onClick} className="cursor-pointer">
      <Plus className="w-4 h-4 md:mr-2" />
      <span className="md:flex hidden">{label}</span>
    </Button>
  );
}
