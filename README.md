# Creative Way Solutions landing page

This is a dependency-free static website. Open `index.html` locally or upload the folder as-is to GitHub Pages or any static host.

## Files

- `index.html` — page structure and contact form
- `css/styles.css` — responsive layout and styling
- `js/wave.js` — animated canvas ribbon background
- `js/form.js` — AJAX submission, errors, and the on-page thank-you message
- `assets/logo-mark.png` — high-resolution transparent W-ribbon logo asset and favicon

## Formspree connection

The contact form is already connected to:

```text
https://formspree.io/f/xppzlbpl
```

No form ID changes are required. Upload the site and submit one test inquiry. Confirm that Formspree delivers it to the notification email address configured in your Formspree account.

### Thank-you behavior

The form submits asynchronously through `js/form.js`, so visitors remain on the Creative Way Solutions website. After Formspree confirms a successful submission, the form is replaced with:

> Thank you.
>
> Your message has been received. We’ll be in touch shortly.

The script also provides a sending state and displays an on-page error if the connection fails, Formspree rejects the submission, or the submission limit is reached. If JavaScript is unavailable, the standard HTML form continues to work, but Formspree will control the response page.

### How the fields are created

You do not have to create the Name, Email, Company, and Message fields separately in Formspree. Formspree builds the submission from each field's HTML `name` attribute:

| Visible field | HTML name sent to Formspree | Required |
| --- | --- | --- |
| Name | `name` | Yes |
| Email | `email` | Yes |
| Company | `company` | No |
| How can we help? | `message` | Yes |

Keep these `name` attributes intact unless you also want the labels in Formspree's notification emails to change. The hidden `_subject` value sets the email subject to **New Creative Way Solutions inquiry**.

### Spam protection

The included `_gotcha` field is an invisible honeypot. In Formspree, also enable its built-in spam filtering. For stronger protection, create a Cloudflare Turnstile widget in Managed mode for your final domain, then connect its secret key through Formspree's integration settings. Never place the Turnstile secret key in `index.html` or commit it to GitHub.

Only the public Turnstile site key belongs in the webpage. The final Turnstile markup can be added after the domain and Formspree integration are ready.

## Animation

The background is drawn in real time with the HTML canvas API. It is not a video file and does not require a JavaScript library. Edit the `bands` array in `js/wave.js` to adjust height, amplitude, thickness and speed. Visitors who have Reduce Motion enabled receive a still version automatically.

## Typography

The page uses **Space Grotesk** for the principal headline and **Manrope** for supporting copy, navigation, and the form. Both are loaded from Google Fonts in `index.html`, with system sans-serif fallbacks. If Google Fonts is unavailable, the layout remains functional with the fallback fonts.
