import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category,
      experience,
      arrivalDate,
      departureDate,
      guests,
      notes,
      fullName,
      email,
      phone,
    } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.NOTIFICATION_EMAIL;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY in environment variables.");
      return NextResponse.json(
        { error: "Booking email service is not configured (missing API Key)." },
        { status: 500 }
      );
    }

    if (!toEmail) {
      console.error("Missing NOTIFICATION_EMAIL in environment variables.");
      return NextResponse.json(
        { error: "Booking email service is not configured (missing recipient email)." },
        { status: 500 }
      );
    }

    // Format dates to DD/MM/YYYY
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const parts = dateStr.split("-");
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const formattedArrival = category === "LEISURE" ? formatDate(arrivalDate) : formatDate(arrivalDate);
    const formattedDeparture = category === "LEISURE" ? departureDate : formatDate(departureDate);

    // Build email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Zhisusa Reservation Request</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #F7F4EE;
            color: #1F3A36;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            border: 1px solid rgba(31,58,54,0.08);
            box-shadow: 0 10px 30px rgba(0,0,0,0.02);
            overflow: hidden;
          }
          .header {
            background-color: #1F3A36;
            color: #F7F4EE;
            padding: 40px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 300;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 11px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            opacity: 0.7;
          }
          .content {
            padding: 40px;
          }
          .section-title {
            font-size: 10px;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #4E7C7A;
            margin-bottom: 15px;
            border-bottom: 1px solid rgba(31,58,54,0.08);
            padding-bottom: 8px;
            font-weight: 600;
          }
          .grid {
            margin-bottom: 30px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
            line-height: 1.5;
          }
          .label {
            color: rgba(31,58,54,0.6);
            font-weight: 400;
          }
          .val {
            font-weight: 500;
            text-align: right;
          }
          .notes-box {
            background-color: #F7F4EE;
            border-radius: 8px;
            padding: 16px;
            font-style: italic;
            font-size: 13px;
            line-height: 1.6;
            color: rgba(31,58,54,0.8);
            margin-top: 10px;
          }
          .footer {
            background-color: #F7F4EE;
            text-align: center;
            padding: 20px;
            font-size: 11px;
            color: rgba(31,58,54,0.5);
            border-top: 1px solid rgba(31,58,54,0.06);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Zhisusa</h1>
            <p>New Reservation Request</p>
          </div>
          
          <div class="content">
            <!-- Customer Section -->
            <div class="section-title">Customer Details</div>
            <div class="grid">
              <div class="row">
                <span class="label">Full Name:</span>
                <span class="val">${fullName}</span>
              </div>
              <div class="row">
                <span class="label">Email Address:</span>
                <span class="val">${email}</span>
              </div>
              <div class="row">
                <span class="label">Phone Number:</span>
                <span class="val">${phone}</span>
              </div>
            </div>
            
            <!-- Reservation Section -->
            <div class="section-title">Booking Parameters</div>
            <div class="grid">
              <div class="row">
                <span class="label">Category:</span>
                <span class="val" style="text-transform: uppercase; font-weight: bold; color: #4E7C7A;">${category}</span>
              </div>
              <div class="row">
                <span class="label">Selected Experience:</span>
                <span class="val">${experience}</span>
              </div>
              <div class="row">
                <span class="label">${category === "LEISURE" ? "Preferred Date" : "Arrival Date (Check-in)"}:</span>
                <span class="val">${formattedArrival}</span>
              </div>
              <div class="row">
                <span class="label">${category === "LEISURE" ? "Preferred Time" : "Departure Date (Check-out)"}:</span>
                <span class="val">${formattedDeparture}</span>
              </div>
              <div class="row">
                <span class="label">Guests:</span>
                <span class="val">${guests} ${Number(guests) === 1 ? "Person" : "People"}</span>
              </div>
            </div>
            
            <!-- Notes Section -->
            <div class="section-title">Additional Requests</div>
            <div class="notes-box">
              ${notes ? notes.replace(/\n/g, "<br>") : "No additional requests."}
            </div>
          </div>
          
          <div class="footer">
            This is an automated reservation alert from your Zhisusa website.
          </div>
        </div>
      </body>
      </html>
    `;

    // Call Resend REST API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Zhisusa Bookings <bookings@zhisusa.com>",
        to: toEmail,
        reply_to: email,
        subject: `New Request: ${category} - ${fullName}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API Error details:", JSON.stringify(resendData));
      return NextResponse.json(
        { error: resendData.message || "Failed to send email via Resend API." },
        { status: resendResponse.status }
      );
    }

    return NextResponse.json({ success: true, id: resendData.id });
  } catch (error: unknown) {
    console.error("Booking API Route error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
