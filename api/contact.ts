import { Resend } from "resend";

export default async function handler(req, res) {

    const { name, email, phone, message, project_budget_reference_id } = req.body;

// Honeypot check
if (project_budget_reference_id) {
  return res.status(200).json({ success: true });
}
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, phone, message } = req.body;

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

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Email failed" });
  }
}
