# Smart Mart — Ecommerce starter

This project is generated from the supplied `itemlist.pdf` price list dated 13/08/2026. The PDF contains 757 pages; the extracted catalog currently contains 4,906 priced product/variant rows. Source-derived examples include POHA 500 GM ₹30, AALU CHIPS 100 GM ₹25, and AADHAR OIL 1 LT ₹140.

## Included
- Responsive ecommerce storefront
- Search, category filter, sorting and pagination
- Add-to-cart, quantity controls and checkout form
- Order ID generation
- Helper/admin dashboard
- Browser notification support
- Demo mode using localStorage/BroadcastChannel
- Production-ready Supabase REST/realtime hook
- `assets/products.json` generated from the supplied list

## Production order notifications
1. Create a Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. Put the Supabase project URL and public anon key into `js/config.js`.
4. Deploy the folder to Netlify/Vercel or any static host.
5. Keep `admin.html` open for the helper. New orders are inserted into the `orders` table.

> Important: the supplied PDF has OCR/layout artifacts on some pages. The catalog parser preserves source text rather than silently inventing corrections. Review unusual product names before going live.

## Image behavior
Each catalog item has a generated, lightweight product-card illustration based on its item name. This keeps the catalog fast and avoids inventing branded packaging. Replace individual SVG card images with real product photos when you have authorized photos.
