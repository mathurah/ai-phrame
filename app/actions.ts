"use server";

import axios from "axios";

export const generateImage = async (prevState: any, formData: FormData) => {
  console.log("poop");
  const prompt = formData.get("prompt") as string;
  try {
    console.log("Generating image...");
    const headers = {
      Authorization: `Bearer ${process.env.WOMBO_API_KEY}`,
      "Content-Type": "application/json",
    };

    // Step 1: Create the task
    const { data: postResponse } = await axios.post(
      "https://api.luan.tools/api/tasks/",
      { use_target_image: false },
      { headers }
    );

    // Step 3: Provide the input specifications
    const task_id = postResponse.id;
    const input_spec = {
      style: 5,
      prompt: prompt,
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
        console.log("Image generated!");
        return { imageUrl: getStateResponse.result };
      } else {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }

  return {
    imageUrl: "",
  };
};
