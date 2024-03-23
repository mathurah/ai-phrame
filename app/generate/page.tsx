import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="p-6 gap-6 flex flex-col items-center justify-center place-content-center">
      <div className="text-2xl font-bold">phrame ai 🖼️</div>
      <div className="container max-w-xl">
        <Textarea placeholder="Type a prompt for your artwork here" />
      </div>
      <Button>Generate</Button>
    </div>
  );
}
