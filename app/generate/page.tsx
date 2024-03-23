"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { generateImage } from "../actions";

const initialState = {
  imageUrl: "",
};

const Page = () => {
  const [state, formAction] = useFormState(generateImage, initialState);

  return (
    <div className="p-6 gap-6 flex flex-col items-center justify-center place-content-center">
      <div className="text-2xl font-bold">phrame ai 🖼️</div>
      <form action={formAction}>
        <div className="container max-w-xlg">
          <Textarea
            name="prompt"
            placeholder="Type a prompt for your artwork here"
          />
        </div>
        <Button type="submit">Generate</Button>
      </form>
      {state.imageUrl && (
        <div className="mt-6">
          <img src={state.imageUrl} alt="Generated image" />
        </div>
      )}
    </div>
  );
};

export default Page;
