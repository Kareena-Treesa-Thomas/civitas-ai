# 🛒 GroceryAI — AI-Powered Grocery Price Comparison

[![Live Demo](https://img.shields.io/badge/Live%20Demo-grocery--ai.vercel.app-22c55e?style=flat-square)](https://grocery-ai-topaz.vercel.app/)
[![Gemini API](https://img.shields.io/badge/Gemini-AI%20Engine-4285f4?style=flat-square)](https://ai.google.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=flat-square)](https://supabase.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-Visualizations-ff6384?style=flat-square)](https://chartjs.org)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Educational-f59e0b?style=flat-square)](#license)

> Stop switching between apps. Enter your grocery list once — GroceryAI finds the cheapest store across 8 platforms in seconds.

---

## 🎬 Live Demo

🚀 **[grocery-ai-topaz.vercel.app](https://grocery-ai-topaz.vercel.app/)**

---

## 🧩 The Problem

Comparing grocery prices across Blinkit, Zepto, BigBasket, and five other apps is tedious. Prices shift daily, discounts vary by platform, and delivery fees quietly inflate the final bill. Most people just pick one app out of habit — and overpay.

## ✅ The Solution

GroceryAI processes your grocery list through the Gemini API, estimates per-item prices across all major platforms, applies current discounts, adds delivery charges, and surfaces the single best option — with a full breakdown so you can verify.

---

## ⚡ Features

| Feature | Description |
|---|---|
| 🤖 **AI Price Comparison** | Gemini API estimates prices across 8 stores simultaneously |
| 📦 **Item-wise Breakdown** | See each product's price per store side by side |
| 💰 **Discount Calculation** | Discounts applied automatically before totalling |
| 🚚 **Delivery Cost & ETA** | Delivery charges and estimated times included in comparison |
| ⭐ **Store Ratings** | Google ratings shown for each platform |
| 🏆 **Best Store Pick** | Clear recommendation for lowest final cost |
| 📊 **Interactive Charts** | Visual price comparison powered by Chart.js |
| 📜 **Comparison History** | Logged-in users can revisit previous searches |
| 🔐 **Google Sign-In** | Secure auth via Supabase + Google OAuth |
| 📱 **Responsive UI** | Clean dashboard optimised for desktop and mobile |

---

## 🏬 Supported Platforms

| | | | |
|---|---|---|---|
| 🟡 Blinkit | 🟣 Zepto | 🟢 BigBasket | 🟠 Amazon Fresh |
| 🔴 Swiggy Instamart | 🔵 Flipkart Supermart | 🌿 Nature's Basket | 📶 JioMart |

---

## 🛠 Tech Stack

```
Frontend        HTML · CSS · JavaScript
Backend         Supabase (PostgreSQL)
Auth            Supabase Authentication · Google OAuth
AI              Gemini API
Charts          Chart.js
Deployment      Vercel
Version Control Git & GitHub
```

---

## 🔄 How It Works

1. **Enter** your grocery list
2. **Gemini API** processes each item and estimates store prices
3. **Discounts, delivery fees, and ratings** are applied per platform
4. **Chart.js** renders the visual comparison
5. **Best store** is recommended with full cost breakdown

---

## 🚀 Quick Start

```bash
git clone https://github.com/Kareena-Treesa-Thomas/GroceryAI.git
cd GroceryAI
npm install
npm start
```

Open `http://localhost:3000`

---

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never commit `.env`. All API keys must stay in backend environment variables only.

---

## 📁 Project Structure

```
GroceryAI/
├── index.html              # Landing page
├── dashboard.html          # Main comparison UI
├── auth/                   # Google Sign-In flow
├── assets/
│   ├── css/                # Styles
│   └── js/                 # Frontend logic + Chart.js setup
├── supabase/               # DB schema + edge functions
├── .env.example
└── README.md
```

---

## 🔗 Links

| | |
|---|---|
| 🚀 Live Demo | [grocery-ai-topaz.vercel.app](https://grocery-ai-topaz.vercel.app/) |
| 💻 GitHub Repo | [github.com/Kareena-Treesa-Thomas/GroceryAI](https://github.com/Kareena-Treesa-Thomas/GroceryAI/tree/main/supabase) |

---

## 👩‍💻 Developers

Built by **Team Sarvam Maya**

**Kareena Treesa Thomas** · [github.com/Kareena-Treesa-Thomas](https://github.com/Kareena-Treesa-Thomas)

---

## 📄 License

Developed for educational and innovation purposes.


