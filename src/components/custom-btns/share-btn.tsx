import { Share2 } from "lucide-react";
import { Button } from "../ui/button";

export default function ShareBtn() {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm z-10"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
