import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      keyExists: !!process.env.RESEND_API_KEY,
    }),
    { status: 200 }
  );
};
