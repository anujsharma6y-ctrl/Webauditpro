

# Free SaaS Security & Web Tools Platform

## Overview
A modern, Stripe/Vercel-inspired SaaS platform with 5 client-side tools, dark/light theme, and a professional dashboard. No backend needed — all tools run in the browser.

## Pages & Layout

### Global Layout
- **Navbar**: Logo, nav links (Dashboard, Tools), dark/light theme toggle
- **Footer**: "Made by Anuj Sharma" with LinkedIn & Twitter/X icons on all pages
- Clean sans-serif typography, smooth fade/scale animations

### Dashboard (Home)
- Hero section with tagline and CTA
- 5 tool cards in a responsive grid, each with icon, title, description, and "Launch" button
- Subtle hover animations on cards

### Tool Pages (one route per tool)

1. **Website Audit Tool** (`/tools/website-audit`)
   - URL input → client-side analysis generating scores (Design, SEO, Trust, Security, Performance) with progress bars and improvement suggestions

2. **Fake Link Checker** (`/tools/link-checker`)
   - URL input → risk score, SSL check, suspicious word detection, phishing warnings

3. **Password Strength Checker** (`/tools/password-checker`)
   - Password input → strength meter, entropy calculation, security tips

4. **Privacy Policy Generator** (`/tools/privacy-policy`)
   - Form (website name, email, country, ads y/n, analytics y/n) → generated policy text with copy & download buttons

5. **Report Generator** (`/tools/report`)
   - Combines results from previously used tools into a report card with copy & download options

## Features
- **Dark/Light toggle** using `next-themes`
- **Share button** (Web Share API with clipboard fallback)
- **Copy & Download** on all tool results
- **No login required** — all tools functional immediately
- **Optional login placeholder** for future saved reports (UI only, no backend)
- **Responsive** mobile-first design
- **Smooth animations** on page transitions and interactions

## Design Style
- Vercel/Stripe-inspired: neutral grays, subtle gradients, generous whitespace
- Card-based layout with soft shadows and rounded corners
- Lucide icons for each tool and UI element

