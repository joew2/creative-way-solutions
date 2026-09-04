# Creative Way Solutions landing page

This is a dependency-free static website. Open `index.html` locally or upload the folder as-is to GitHub Pages or any static host.

## Files

- `index.html` — page structure and contact form
- `css/styles.css` — responsive layout and styling
- `js/wave.js` — animated canvas ribbon background
- `assets/logo-mark.png` — high-resolution transparent W-ribbon logo asset and favicon

## Connect the form to Formspree

1. Create or sign in to your Formspree account.
2. Create a **New Form** and give it a recognizable name such as **Creative Way Solutions Website**.
3. Set the notification email address where you want inquiries delivered.
4. Formspree will provide an endpoint resembling `https://formspree.io/f/abcdefgh`.
5. Open `index.html` and find this line:

   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="post">
   ```

6. Replace `YOUR_FORM_ID` with the ID at the end of your endpoint. Do not place your personal email address in the HTML.
7. Upload the site and submit one test inquiry. The first submission may require you to verify the receiving email address.

### How the fields are created

You do not have to create the Name, Email, Company, and Message fields separately in Formspree. Formspree builds the submission from each field's HTML `name` attribute:

| Visible field | HTML name sent to Formspree | Required |
| --- | --- | --- |
| Name | `name` | Yes |
| Email | `email` | Yes |
| Company | `company` | No |
| How can I help? | `message` | Yes |

Keep these `name` attributes intact unless you also want the labels in Formspree's notification emails to change. The hidden `_subject` value sets the email subject to **New Creative Way Solutions inquiry**.

### Spam protection

The included `_gotcha` field is an invisible honeypot. In Formspree, also enable its built-in spam filtering. For stronger protection, create a Cloudflare Turnstile widget in Managed mode for your final domain, then connect its secret key through Formspree's integration settings. Never place the Turnstile secret key in `index.html` or commit it to GitHub.

Only the public Turnstile site key belongs in the webpage. The final Turnstile markup can be added after the domain and Formspree integration are ready.

## Animation

The background is drawn in real time with the HTML canvas API. It is not a video file and does not require a JavaScript library. Edit the `bands` array in `js/wave.js` to adjust height, amplitude, thickness and speed. Visitors who have Reduce Motion enabled receive a still version automatically.

## Typography

The page uses **Space Grotesk** for the principal headline and **Manrope** for supporting copy, navigation, and the form. Both are loaded from Google Fonts in `index.html`, with system sans-serif fallbacks. If Google Fonts is unavailable, the layout remains functional with the fallback fonts.
