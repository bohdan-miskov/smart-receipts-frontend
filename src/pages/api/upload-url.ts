import type { APIRoute } from "astro";
import axios from "axios";

const API_URL = import.meta.env.API_URL;

export const POST: APIRoute = async () => {
  try {
    const response = await axios.post(`${API_URL}/upload-url`);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to get upload URL" }), {
      status: 500,
    });
  }
};
