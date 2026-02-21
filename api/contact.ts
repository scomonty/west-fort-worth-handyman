import { Resend } from "resend";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // required for FormData
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const form = formidable({ multiples: true });

    const [fields] = await form.parse(req);

    const name = fields.name?.[0] || "";
    const email = fields.email?.[0] || "";
    const phone = fields.phone?.[0] || "";
    const message = fields.message?.[0] || "";

    const photoUrls = fields.photoUrls?.[0]
      ? JSON.parse(fields.photoUrls[0])
      : [];

    // Honeypot check
    if (fields.project_budget_reference_id?.[0]) {
      return res.status(200).json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "West Fort Worth Handyman <hello@fortworthhandyman.com>",
      to: "scomonty@gmail.com",
      subject: "New Contact Request",
      html: `
        <h2>New Lead</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>

        ${
          photoUrls.length
            ? `<h3>Photos:</h3>
               ${photoUrls.map(url => `<p><a href="${url}">${url}</a></p>`).join("")}`
            : ""
        }
      `,
    });

    // Send confirmation email to customer
if (email) {
  await resend.emails.send({
    from: "West Fort Worth Handyman <onboarding@resend.dev>",
    to: email,
    subject: "We received your request",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">
        <h2>Thanks for contacting West Fort Worth Handyman</h2>

        <p>Hi ${name || "there"},</p>

        <p>
          We received your project request and will contact you soon to discuss
          details and provide an estimate.
        </p>

        <p><strong>Your request:</strong></p>

        <p>${message || "Project details received."}</p>

        <hr />

        <p>
          <strong>West Fort Worth Handyman</strong><br/>
          Affordable & Reliable Home Services<br/>
          Fort Worth, TX
        </p>

        <p>
          We appreciate the opportunity to help with your home project.
        </p>
      </div>
    `,
  });
}

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("CONTACT ERROR:", error);
    return res.status(500).json({ error: "Email failed" });
  }
}
