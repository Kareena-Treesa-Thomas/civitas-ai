# 🛒 GroceryAI + 🏘️ Civitas AI — Hyperlocal Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-groceryai--civitas.web.app-22c55e?style=flat-square)](https://groceryai-civitas.web.app/)
[![Gemini API](https://img.shields.io/badge/Gemini-AI%20Engine-4285f4?style=flat-square)](https://ai.google.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend%20%26%20Edge%20Functions-3ecf8e?style=flat-square)](https://supabase.com)
[![Firebase](https://img.shields.io/badge/Firebase-Google%20Cloud%20Hosting-FFA611?style=flat-square)](https://firebase.google.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-Visualizations-ff6384?style=flat-square)](https://chartjs.org)
[![License](https://img.shields.io/badge/License-Educational-f59e0b?style=flat-square)](#license)

> Two AI-powered tools for smarter hyperlocal decisions — find the cheapest grocery store, and find out which local vendors you can actually trust.

---

## 🎬 Live Demo

🚀 **[groceryai-civitas.web.app](https://groceryai-civitas.web.app/)**

Deployed on **Google Cloud (Firebase Hosting)** · Backend on **Supabase Edge Functions** · AI powered by **Google Gemini API**

---

## 🧩 The Problem

**Problem 1 — Grocery:** Comparing prices across Blinkit, Zepto, BigBasket, and five other apps is tedious. Prices shift daily, discounts vary by platform, and delivery fees quietly inflate the final bill. Most people just pick one app out of habit — and overpay.

**Problem 2 — Community Trust:** Hyperlocal areas have invisible "informal knowledge networks" — residents know which vendors overcharge, which shops sell expired stock, which stores are genuinely reliable. This knowledge stays trapped in WhatsApp groups and word-of-mouth, never reaching new residents, migrants, or anyone outside the existing social network. The people who need it most never get it.

---

## ✅ The Solution

### 🛒 GroceryAI
Processes your grocery list through the Gemini API, estimates per-item prices across all major platforms, applies current discounts, adds delivery charges, and surfaces the single best option — with a full breakdown and interactive charts.

### 🏘️ Civitas AI — Hyperlocal Vendor Trust Network
A community-powered trust-verification layer for local vendors and shops. Residents submit short trust notes about local vendors. Gemini AI extracts structured sentiment, category, and confidence data from each note. When 2+ independent reports corroborate the same sentiment, the vendor is marked **Verified** — turning scattered oral community knowledge into a structured, queryable trust layer for anyone in the neighbourhood.

---

## ⚡ Features

### 🛒 GroceryAI
| Feature | Description |
|---|---|
| 🤖 **AI Price Comparison** | Gemini API estimates prices across 8 stores simultaneously |
| 📦 **Item-wise Breakdown** | See each product's price per store side by side |
| 💰 **Discount Calculation** | Discounts applied automatically before totalling |
| 🚚 **Delivery Cost & ETA** | Delivery charges and estimated times included |
| ⭐ **Store Ratings** | Google ratings shown for each platform |
| 🏆 **Best Store Pick** | Clear recommendation for lowest final cost |
| 📊 **Interactive Charts** | Visual price comparison powered by Chart.js |
| 🔗 **Store Redirect Links** | Direct links to order from each platform |

### 🏘️ Civitas AI
| Feature | Description |
|---|---|
| 📝 **Trust Report Submission** | Submit text notes about any local vendor/shop |
| 🤖 **Gemini Sentiment Analysis** | AI extracts sentiment, category, and confidence from each note |
| ✅ **Cross-Corroboration Verification** | Vendor marked Verified only when 2+ reports align |
| 🔍 **Vendor Search** | Query any vendor to see trust status and all community reports |
| 🧠 **AI Reasoning Trail** | View the extracted Gemini data per report transparently |
| 🦸 **Hero Score** | Community members earn points for verified submissions |
| 🔗 **Store Links** | Direct link to each vendor's website or Google Maps listing |

---

## 🏬 Supported Grocery Platforms

| | | | |
|---|---|---|---|
| 🟡 Blinkit | 🟣 Zepto | 🟢 BigBasket | 🟠 Amazon Fresh |
| 🔴 Swiggy Instamart | 🔵 Flipkart Supermart | 🌿 Nature's Basket | 📶 JioMart |

---

## 🛠 Tech Stack

```
Frontend        React · TypeScript · Tailwind CSS · Vite
Backend         Supabase Edge Functions (Deno)
AI Engine       Google Gemini API (gemini-2.0-flash)
Charts          Chart.js
Hosting         Google Cloud — Firebase Hosting
Auth            Supabase Authentication
Version Control Git & GitHub
```

---

## 🔄 How It Works

### GroceryAI Flow
1. **Enter** your grocery list
2. **Gemini API** estimates per-item prices across 8 platforms via Supabase Edge Function
3. **Discounts, delivery fees, and ratings** applied per platform
4. **Chart.js** renders the visual comparison
5. **Best store** recommended with full cost breakdown + redirect links

### Civitas AI Flow
1. **Submit** a trust note about a local vendor (e.g. "overcharges on festival days")
2. **Gemini API** extracts structured data: `{ entity, sentiment, category, confidence }`
3. **Corroboration engine** checks if 2+ reports align on the same vendor
4. **Verified badge** awarded when corroborated — unverified otherwise
5. **Search** any vendor to see community trust status and AI reasoning trail

---

## 🚀 Quick Start

```bash
git clone https://github.com/Kareena-Treesa-Thomas/GroceryAI.git
cd GroceryAI
npm install
npm run dev
```

Open `http://localhost:8080`

---

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
```

Set Gemini API key as a Supabase secret (never in frontend code):
```bash
npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never commit `.env`. All API keys must stay in backend environment variables only.

---

## 📁 Project Structure

```
GroceryAI/
├── src/
│   ├── pages/
│   │   ├── Index.tsx           # GroceryAI main page
│   │   └── Civitas.tsx         # Civitas AI trust network page
│   ├── components/             # Shared UI components
│   └── integrations/
│       └── supabase/           # Supabase client config
├── supabase/
│   └── functions/
│       ├── analyze-groceries/  # Gemini price comparison edge function
│       └── analyze-civitas/    # Gemini sentiment analysis edge function
├── firebase.json               # Firebase Hosting config (GCP deployment)
├── .env.example
└── README.md
```

---

## 🏆 Hackathon Submission

Built for **Vibe2Ship — India's Biggest Vibe Coding Hackathon** by Coding Ninjas x Google for Developers

**Track:** Community Hero — Hyperlocal Problem Solver

**Mandatory Tool Used:** Google AI Studio (Gemini API)

**Deployed on:** Google Cloud (Firebase Hosting) — https://groceryai-civitas.web.app

---

## 🔗 Links

| | |
|---|---|
| 🚀 Live Demo | [groceryai-civitas.web.app](https://groceryai-civitas.web.app/) |
| 💻 GitHub Repo | [github.com/Kareena-Treesa-Thomas/GroceryAI](https://github.com/Kareena-Treesa-Thomas/GroceryAI) |
| 🔥 Firebase Console | [console.firebase.google.com/project/groceryai-civitas](https://console.firebase.google.com/project/groceryai-civitas/overview) |

---

## 👩‍💻 Developer

**Kareena Treesa Thomas**
B.Tech CSE (AI) · Muthoot Institute of Technology and Science, Kochi
[github.com/Kareena-Treesa-Thomas](https://github.com/Kareena-Treesa-Thomas)

---

## 📄 License

Developed for educational and innovation purposes.
