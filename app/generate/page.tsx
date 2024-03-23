"use client";

import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [imageURL, setImageURL] = useState(""); // To store the generated image URL
  const [isGenerating, setIsGenerating] = useState(false); // To manage the loading state

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_WOMBO_API_KEY}`, // Ensure this is prefixed with NEXT_PUBLIC_ if it is used in the browser
        "Content-Type": "application/json",
      };

      // Step 1: Create the task
      const { data: postResponse } = await axios.post(
        "https://api.luan.tools/api/tasks/",
        { use_target_image: false },
        { headers }
      );

      // Step 2 (omitted since use_target_image is false)

      // Step 3: Provide the input specifications
      const task_id = postResponse.id;
      const input_spec = {
        style: 5, // Example: Fantasy Art. Replace with user input if necessary.
        prompt: prompt,
        // Include other specs if necessary
      };

      await axios.put(
        `https://api.luan.tools/api/tasks/${task_id}`,
        { input_spec },
        { headers }
      );

      // Step 4: Poll for the completed image
      let state = "queued";
      while (state !== "completed" && state !== "failed") {
        const { data: getStateResponse } = await axios.get(
          `https://api.luan.tools/api/tasks/${task_id}`,
          { headers }
        );
        state = getStateResponse.state;
        if (state === "completed") {
          setImageURL(getStateResponse.result.final);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setIsGenerating(false);
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-6 gap-6 flex flex-col items-center justify-center place-content-center">
      <div className="text-2xl font-bold">phrame ai 🖼️</div>
      <div className="container max-w-xlg">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a prompt for your artwork here"
        />
      </div>
      <Button onClick={generateImage} disabled={isGenerating}>
        Generate
      </Button>
      {isGenerating && <p>Generating your image...</p>}
      {imageURL && (
        <Image src={imageURL} alt="Generated Art" width="960" height="1560" />
      )}
    </div>
  );
}
