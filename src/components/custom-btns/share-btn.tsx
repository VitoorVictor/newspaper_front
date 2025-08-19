import { Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

interface ShareBtnProps {
  url: string;
}

export default function ShareBtn({ url }: ShareBtnProps) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm z-10 cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(url);
        toast.success("Link copiado para a área de transferência", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
