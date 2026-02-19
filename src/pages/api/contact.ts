import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request }) => {

  // ✅ Allow same-origin form posts (fixes Vercel 403)
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && !origin.includes(host)) {
    return new Response("Forbidden", { status: 403 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const data = await request.formData();

  const name = data.get("name");
  const email = data.get("email");
  const phone = data.get("phone");
  const message = data.get("message");

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "scomonty@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h2>New Lead</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
};
