# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React (Vite) with hand-written CSS and design tokens. No component library, no CSS framework. Deploy target: Vercel.

## Users

Primary: small business owners and startup founders in the Philippines who need a website, storefront, or internal system built and currently run the work by hand (paper logs, spreadsheets, chat threads). They arrive from a referral or a social post, usually on a phone, and want to know within seconds whether this person can build the thing they need and whether they are free to take the job.

Secondary: local recruiters and hiring managers checking depth of work. They are not the booking audience.

## Product Purpose

A single-page portfolio for Dy ann Razonado, full-stack developer. It exists to turn a curious visitor into a booked 30-minute call. Success is a Calendly booking, with an email as the fallback.

## Positioning

The page shows three systems already running in production for real operations, not screenshots of tutorials: a React CRUD app, a cake business ordering site with generated QR messages, and a deployed gym management system. The work is proof, so the site's job is to get out of its way.

## Operating Context

Visitors browse on phones and laptops. Booking happens through Calendly's 30-minute event, opened in a modal so the visitor keeps their place on the page. The developer answers enquiries by email at dyann.razonado.5@gmail.com.

## Capabilities and Constraints

- One scrolling page with anchored sections: Home, About, Work, Contact.
- Three projects only. Each links to its live deployment.
- Booking opens https://calendly.com/dyann-razonado-5/30min in a modal dialog with a direct-link fallback.
- No blog, no testimonials, no client logos, no pricing, no resume file.
- No social profiles exist. Contact is email plus Calendly.
- Location stated as the Philippines.
- Project repositories are not published, so cards link to live sites only.

## Brand Commitments

The visitor supplied a reference screenshot that fixes the surface: a warm blush page field, a cream page card with generous radius, near-black type, a coral accent, one headline phrase in italic serif, a floating pill navigation, an availability badge, and a portrait photo on the right that fades into the page. Portrait supplied at `public/profile.jpg`.

## Evidence on Hand

- `public/profile.jpg`, portrait on white, 886x1181.
- https://crud-react-vert-eight.vercel.app/ (Tasksy, live)
- https://crumbcoded.onrender.com/ (CrumbCoded, live)
- https://asgstrength.online/ (Gymhub, live, running as ASG Strength)
- Project screenshots captured from the live sites into `public/work/`.

Missing and not to be fabricated: testimonials, client names, metrics, revenue figures, years of experience, certifications, repository links, social accounts.

## Product Principles

1. The deployed projects are the argument. Give them the most space and the least decoration.
2. Every path out of the page leads to a booking or an email.
3. Write like a person talking to a client, not like a brochure.
4. Load fast on a phone on mobile data. No decorative weight.
5. The portrait and the work are the only images. Skip everything else.

## Accessibility & Inclusion

Keyboard-operable booking modal with focus trapping and Escape to close. Visible focus rings. Body text meets WCAG AA at its rendered size. Scroll reveals disabled under `prefers-reduced-motion`.
