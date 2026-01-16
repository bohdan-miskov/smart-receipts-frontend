import type { APIRoute } from "astro";
import axios from "axios";

const API_URL = import.meta.env.API_URL;

export const GET: APIRoute = async () => {
  try {
    const response = await axios.get(`${API_URL}/receipts`);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch fro AWS" }), {
      status: 500,
    });
  }
};
