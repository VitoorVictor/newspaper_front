import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

interface SlugColumnBtnProps {
  slug: string;
  url: string;
}

export default function SlugColumnBtn({ slug, url }: SlugColumnBtnProps) {
  const router = useRouter();
  return (
    <button className="flex gap-1 cursor-pointer" onClick={() => router.push(url)}>
      <Badge variant="outline">{slug}</Badge>
    </button>
  );
}
