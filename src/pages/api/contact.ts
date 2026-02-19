import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("KEY EXISTS:", !!process.env.RESEND_API_KEY);


  if (!process.env.RESEND_API_KEY) {
    return new Response("Missing API key", { status: 500 });
  }

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
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return new Response(
      JSON.stringify({ error: error?.message || error }),
      { status: 500 }
    );
  }
};
