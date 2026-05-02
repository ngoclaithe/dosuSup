# PRD — Website Bán Thực Phẩm Chức Năng

**Phiên bản:** v1.1
**Ngày:** 02/05/2026
**Trạng thái:** Draft
**Người viết:** DOSU Co., Ltd — Lại Thế Ngọc
**Giao diện tham chiếu:** [Figma Prototype](https://unit-marsh-22600897.figma.site/)
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Prisma · PostgreSQL

---

## Mục lục

1. [Mục tiêu & Phạm vi](#1-mục-tiêu--phạm-vi)
2. [Người dùng & User Stories](#2-người-dùng--user-stories)
3. [Design System & UI](#3-design-system--ui)
4. [Đặc tả chức năng](#4-đặc-tả-chức-năng)
5. [Admin Dashboard](#5-admin-dashboard)
6. [Tích hợp Thanh toán — SePay](#6-tích-hợp-thanh-toán--sepay)
7. [Hệ thống Email](#7-hệ-thống-email)
8. [Kiến trúc kỹ thuật](#8-kiến-trúc-kỹ-thuật)
9. [Data Model (Prisma Schema)](#9-data-model-prisma-schema)
10. [Biến môi trường (.env)](#10-biến-môi-trường-env)
11. [SEO & Performance](#11-seo--performance)
12. [API Routes](#12-api-routes)
13. [QA Checklist](#13-qa-checklist)
14. [Rủi ro & Ghi chú](#14-rủi-ro--ghi-chú)

---

## 1. Mục tiêu & Phạm vi

### 1.1 Mục tiêu kinh doanh

- Xây dựng kênh bán hàng trực tuyến chuyên nghiệp cho thương hiệu thực phẩm chức năng
- Tăng khả năng tiếp cận khách hàng, giảm phụ thuộc vào mạng xã hội
- Cung cấp trải nghiệm mua hàng đơn giản, uy tín từ duyệt sản phẩm đến thanh toán
- Xây dựng nền tảng nội dung (blog sức khỏe) tăng organic SEO

### 1.2 Mục tiêu kỹ thuật

- Lighthouse Score ≥ 85 (Performance, SEO, Accessibility)
- Tốc độ tải trang < 3s trên mobile 4G
- Mobile-first, pixel-perfect theo Figma prototype
- Source code TypeScript, type-safe, có thể bảo trì và mở rộng
- Production deploy với SSL, không downtime

### 1.3 Trong scope

| Hạng mục | Ghi chú |
|---|---|
| Toàn bộ UI frontend | Next.js 14, pixel-perfect theo Figma |
| Luồng mua hàng đầy đủ | Duyệt → Giỏ hàng → Checkout → Thanh toán |
| 2 phương thức thanh toán | COD + Chuyển khoản QR (SePay webhook tự động) |
| Email xác nhận đơn hàng | SMTP private, config qua `.env` |
| Admin dashboard | Quản lý đơn, sản phẩm, blog |
| Blog / tin tức sức khỏe | Rich text editor, SEO per post |
| Tích hợp Zalo OA / Messenger | Nút chat nổi |
| SEO kỹ thuật | Meta, OG, sitemap, robots.txt |
| Deploy VPS | Nginx + PM2 + SSL (Let's Encrypt) |

### 1.4 Ngoài scope (v1)

- Cổng thanh toán tự động khác (VNPAY, Momo, ZaloPay)
- Hệ thống tài khoản khách hàng (register/login)
- Mã voucher, điểm thưởng, chương trình loyalty
- Tích hợp ERP / phần mềm kho hàng bên thứ ba
- Ứng dụng mobile (iOS / Android)
- Nội dung sản phẩm, ảnh sản phẩm ban đầu (khách hàng cung cấp)

---

## 2. Người dùng & User Stories

### 2.1 Vai trò

| Vai trò | Mô tả | Quyền truy cập |
|---|---|---|
| `Guest` (khách) | Người dùng chưa đăng nhập | Toàn bộ frontend, checkout |
| `Admin` | Chủ shop / nhân viên quản lý | `/admin/*` sau khi xác thực |

### 2.2 User Stories

#### US-01 — Duyệt & lọc sản phẩm

```
Là khách hàng,
Tôi muốn duyệt danh mục sản phẩm và lọc theo danh mục / giá / thương hiệu,
Để tìm đúng sản phẩm tôi cần mua.
```

**Acceptance Criteria:**
- [ ] Hiển thị danh sách SP dạng grid, 12 SP/trang, có phân trang
- [ ] Bộ lọc: Danh mục (checkbox), Khoảng giá (range slider), Thương hiệu (checkbox)
- [ ] Sort: Mặc định / Giá tăng / Giá giảm / Mới nhất / Bán chạy
- [ ] Skeleton loading khi fetch dữ liệu
- [ ] Empty state khi không có kết quả lọc
- [ ] URL phản ánh filter state (`?category=&minPrice=&sort=`)

---

#### US-02 — Xem chi tiết & thêm giỏ hàng

```
Là khách hàng,
Tôi muốn xem đầy đủ thông tin sản phẩm và thêm vào giỏ hàng,
Để quyết định mua hàng và tiếp tục mua sắm.
```

**Acceptance Criteria:**
- [ ] Trang chi tiết: ảnh gallery (lightbox), tên, giá, thành phần, công dụng, cách dùng
- [ ] Chọn số lượng (+/-), giới hạn theo `stock`
- [ ] Nút "Thêm vào giỏ" → toast notification "Đã thêm vào giỏ hàng ✓"
- [ ] Icon giỏ hàng trên Header cập nhật badge số lượng ngay lập tức
- [ ] Giỏ hàng lưu `localStorage` — không mất khi reload
- [ ] Nút "Mua ngay" → redirect thẳng tới `/dat-hang`

---

#### US-03 — Đặt hàng & thanh toán

```
Là khách hàng,
Tôi muốn điền thông tin giao hàng và chọn phương thức thanh toán,
Để hoàn tất đơn hàng một cách nhanh chóng.
```

**Phương thức thanh toán (2 lựa chọn):**

| Phương thức | Mô tả | Xử lý |
|---|---|---|
| `COD` | Thanh toán khi nhận hàng | Tạo đơn, status = `PENDING_CONFIRM`, gửi email xác nhận |
| `BANK_TRANSFER` | Chuyển khoản QR qua SePay | Hiển thị QR SePay, lắng nghe webhook, tự động xác nhận |

**Acceptance Criteria — Chung:**
- [ ] Stepper 3 bước: Thông tin → Xác nhận → Thanh toán
- [ ] Form bắt buộc: Họ tên, **Email**, Số điện thoại (10 số), Địa chỉ, Tỉnh/Thành, Quận/Huyện, Phường/Xã
- [ ] Email là trường bắt buộc, validate định dạng `example@domain.com`
- [ ] Validation realtime, highlight lỗi dưới field khi blur
- [ ] Nút "Xác nhận đặt hàng" tạo đơn trong DB, sinh `orderCode` (VD: `ORD-20260502-001`)
- [ ] Sau khi tạo đơn → gửi email xác nhận tới địa chỉ email khách hàng

**Acceptance Criteria — COD:**
- [ ] Bước 3 hiển thị: thông báo "Bạn sẽ thanh toán khi nhận hàng", tóm tắt đơn, hotline hỗ trợ
- [ ] Status đơn hàng khởi tạo: `PENDING_CONFIRM`
- [ ] Redirect tới trang cảm ơn `/dat-hang/xac-nhan/[orderCode]`

**Acceptance Criteria — BANK_TRANSFER (SePay):**
- [ ] Bước 3 hiển thị widget QR SePay (iframe hoặc ảnh QR động từ SePay API)
- [ ] Hiển thị: Số tài khoản, Tên ngân hàng, Số tiền, **Nội dung chuyển khoản = `orderCode`**
- [ ] Status đơn hàng khởi tạo: `PENDING_PAYMENT`
- [ ] Polling hoặc realtime check: Khi SePay webhook gửi về → tự động đổi status → `PAID`
- [ ] Sau khi xác nhận thanh toán → gửi email cập nhật trạng thái tới khách
- [ ] Timeout 15 phút: nếu chưa thanh toán → hiển thị cảnh báo, vẫn giữ đơn

---

#### US-04 — Theo dõi trạng thái đơn

```
Là khách hàng,
Tôi muốn biết đơn hàng của mình đang ở trạng thái nào,
Để yên tâm chờ nhận hàng.
```

**Acceptance Criteria:**
- [ ] Trang `/dat-hang/xac-nhan/[orderCode]` hiển thị timeline trạng thái trực quan
- [ ] Các trạng thái và màu sắc:

```
PENDING_PAYMENT   → ⏳ Chờ thanh toán     (vàng)  — chỉ BANK_TRANSFER
PENDING_CONFIRM   → 📋 Chờ xác nhận       (xanh nhạt) — COD
PAID              → ✅ Đã thanh toán       (xanh)
PACKING           → 📦 Đang đóng gói       (xanh)
SHIPPING          → 🚚 Đang giao hàng      (xanh)
DONE              → 🎉 Giao thành công     (xanh đậm)
CANCELLED         → ❌ Đã huỷ             (đỏ)
```

- [ ] Nút "Liên hệ hỗ trợ" → mở Zalo/Messenger
- [ ] Nút "Tiếp tục mua sắm" → về trang chủ

---

#### US-05 — Admin quản lý đơn hàng

```
Là admin,
Tôi muốn xem và xử lý danh sách đơn hàng,
Để đảm bảo đơn hàng được xử lý kịp thời.
```

**Acceptance Criteria:**
- [ ] Bảng đơn hàng: Mã đơn / Tên KH / Email / SĐT / Tổng tiền / Phương thức TT / Trạng thái / Ngày đặt
- [ ] Filter theo status (dropdown), tìm theo mã đơn / SĐT / email
- [ ] Xem chi tiết đơn: SP đặt, thông tin giao hàng, lịch sử thay đổi status
- [ ] Với đơn COD: nút "Xác nhận đơn hàng" → `PENDING_CONFIRM` → `PAID`
- [ ] Cập nhật trạng thái qua dropdown: `PAID` → `PACKING` → `SHIPPING` → `DONE` / `CANCELLED`
- [ ] Mỗi lần đổi trạng thái → gửi email thông báo tới khách

---

#### US-06 — Admin quản lý sản phẩm

```
Là admin,
Tôi muốn thêm, sửa, xóa sản phẩm và quản lý tồn kho,
Để danh mục sản phẩm luôn cập nhật.
```

**Acceptance Criteria:**
- [ ] CRUD sản phẩm đầy đủ (xem US-06 trong Admin Dashboard)
- [ ] Upload ảnh, preview trước khi lưu
- [ ] Soft delete (ẩn frontend, giữ dữ liệu DB)
- [ ] Cập nhật tồn kho, cảnh báo khi `stock <= 5`

---

#### US-07 — Admin quản lý blog

```
Là admin,
Tôi muốn viết và đăng bài blog sức khỏe,
Để thu hút organic traffic qua SEO.
```

**Acceptance Criteria:**
- [ ] CRUD bài viết với rich text editor (TipTap)
- [ ] Toggle Published / Draft
- [ ] Upload ảnh thumbnail
- [ ] SEO fields: custom meta title, meta description per post

---

## 3. Design System & UI

### 3.1 Nguyên tắc

- **Pixel-perfect:** Bám sát 100% Figma prototype đã duyệt
- **Mobile-first:** Thiết kế từ 320px mở rộng lên 1440px
- **Health & Wellness tone:** Xanh lá chủ đạo, trắng sạch, không rối
- **Accessibility:** Contrast đạt WCAG AA, focus states rõ ràng

### 3.2 Design Tokens

```css
/* Colors */
--color-primary:      #1A5C38;   /* Deep green — header, nút chính, tiêu đề */
--color-accent:       #27AE60;   /* Green — CTA, badge, icon active */
--color-bg:           #FFFFFF;
--color-bg-alt:       #F0FBF5;   /* Section xen kẽ */
--color-bg-dark:      #0F3D25;   /* Footer */
--color-text:         #1C1C1C;
--color-text-muted:   #6B7280;
--color-border:       #D1FAE5;
--color-success:      #10B981;
--color-warning:      #F59E0B;
--color-error:        #EF4444;

/* Spacing scale (Tailwind default) */
/* Typography */
--font-sans: 'Be Vietnam Pro', 'Inter', sans-serif;

/* Border radius */
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 20px;
```

### 3.3 Typography

| Style | Size | Weight | Dùng cho |
|---|---|---|---|
| `display` | 48px | 700 | Hero headline |
| `h1` | 36px | 700 | Page title |
| `h2` | 28px | 700 | Section heading |
| `h3` | 22px | 600 | Card title |
| `h4` | 18px | 600 | Sub-section |
| `body` | 15–16px | 400 | Mô tả, paragraph |
| `small` | 13–14px | 400 | Caption, label |
| `button` | 14–16px | 600 | CTA |

### 3.4 Breakpoints

```
xs:  320px  — 639px    Mobile (1 cột)
sm:  640px  — 767px    Mobile lớn (2 cột)
md:  768px  — 1023px   Tablet (2–3 cột)
lg:  1024px — 1279px   Desktop (3–4 cột)
xl:  1280px+           Wide (4 cột, max-width 1440px)
```

### 3.5 Component List

| Component | Props chính | States |
|---|---|---|
| `ProductCard` | `product`, `onAddCart` | default / hover / out-of-stock |
| `CartItem` | `item`, `onQtyChange`, `onRemove` | normal / updating / removing |
| `Button` | `variant` (primary/secondary/ghost), `loading` | default / hover / loading / disabled |
| `Input` | `label`, `error`, `required` | empty / focus / filled / error |
| `Toast` | `type` (success/error/info), `message` | enter / visible / exit |
| `Badge` | `type` (new/sale/hot/soldout) | — |
| `Skeleton` | `width`, `height`, `count` | — |
| `Stepper` | `steps[]`, `currentStep` | — |
| `QRPaymentBlock` | `orderCode`, `amount`, `sepayData` | waiting / confirmed / timeout |
| `OrderTimeline` | `status`, `history[]` | per status |
| `Breadcrumb` | `items[]` | — |

---

## 4. Đặc tả chức năng

### 4.1 Trang chủ — `/`

**Render:** SSG (revalidate: 3600s)

#### Sections theo thứ tự:

1. **Hero Banner**
   - Slider tối đa 3 slides, mỗi slide: ảnh nền full-width, headline ≤ 60 ký tự, subtext ≤ 120 ký tự, 1–2 CTA buttons
   - Auto-play 5s, dot navigation, prev/next arrows
   - Ảnh dùng `next/image` với `priority={true}`

2. **Category Grid**
   - 4–6 danh mục chính dạng icon card
   - Click → `/san-pham?category=[slug]`

3. **Sản phẩm nổi bật**
   - 8 SP có flag `isFeatured = true`
   - Grid: 4 cột desktop / 2 cột mobile
   - Mỗi card: ảnh, tên, giá gốc, giá sale (nếu có), badge, nút "Thêm giỏ"

4. **Banner khuyến mãi**
   - 1 banner full-width hoặc 2 × 50/50
   - Nội dung cấu hình từ Admin (text + image + link)

5. **Sản phẩm mới nhất**
   - 4 SP mới nhất theo `createdAt DESC`

6. **Blog mini**
   - 3 bài viết mới nhất: thumbnail, tiêu đề, tóm tắt 2 dòng, ngày đăng

---

### 4.2 Danh sách sản phẩm — `/san-pham`

**Render:** SSR (mỗi request, do filter động)

**URL params:** `?category=&minPrice=&maxPrice=&brand=&sort=&page=`

#### Layout:
- Desktop: Sidebar lọc (240px) + Grid sản phẩm
- Mobile: Drawer filter (toggle button)

#### Filter sidebar:
```
[ ] Danh mục        — checkbox list, multi-select
[ ] Khoảng giá      — range slider (0 → 2.000.000đ)
[ ] Thương hiệu     — checkbox list
[ ] Đánh giá        — star filter (optional v1)
```

#### Sort options:
```
Mặc định | Giá tăng dần | Giá giảm dần | Mới nhất | Bán chạy nhất
```

#### Grid: 12 SP/trang, phân trang URL-based (`?page=N`)

---

### 4.3 Chi tiết sản phẩm — `/san-pham/[slug]`

**Render:** SSG + ISR (revalidate: 60s)

#### Cấu trúc trang:
```
Breadcrumb: Trang chủ > Sản phẩm > [Danh mục] > [Tên SP]

[Left col — 55%]
  Ảnh chính (lightbox zoom)
  Thumbnails row

[Right col — 45%]
  Thương hiệu (badge)
  Tên sản phẩm (H1)
  Giá gốc + Giá sale (nếu có)
  Trạng thái tồn kho (còn hàng / hết hàng / còn N sản phẩm)
  Chọn số lượng (spinner +/-)
  [Thêm vào giỏ hàng]  [Mua ngay]
  Divider
  Tóm tắt nhanh: ✓ Hàng chính hãng  ✓ Giao hàng toàn quốc  ✓ Đổi trả 7 ngày

[Full width]
  Tabs: Mô tả | Thành phần & Công dụng | Hướng dẫn sử dụng | Lưu ý

[Sản phẩm liên quan]
  4 SP cùng danh mục
```

**Meta SEO:**
```typescript
title: `${product.name} | [Tên thương hiệu]`
description: product.description.slice(0, 155)
og:image: product.images[0]
```

---

### 4.4 Giỏ hàng — `/gio-hang`

**Render:** CSR (Client Side)

**State management:** Zustand store + `localStorage` persist

```typescript
// CartStore interface
interface CartItem {
  productId: number
  name: string
  slug: string
  image: string
  price: number      // giá tại thời điểm thêm
  salePrice?: number
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product, qty) => void
  removeItem: (productId) => void
  updateQty: (productId, qty) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}
```

**Layout:**
```
[Danh sách sản phẩm]
  Ảnh (60px) | Tên + Slug link | Đơn giá | Qty spinner | Thành tiền | [X xóa]

[Sidebar / Bottom summary]
  Tạm tính:      XXX.XXX đ
  Phí vận chuyển: Tính ở bước tiếp theo
  ─────────────────────────────
  Tổng cộng:     XXX.XXX đ
  [Tiếp tục mua sắm]   [Đặt hàng →]
```

**Empty state:** Ảnh minh họa + "Giỏ hàng của bạn đang trống" + nút "Khám phá sản phẩm"

---

### 4.5 Checkout — `/dat-hang`

**Render:** CSR

#### Stepper:
```
[1. Thông tin] ──→ [2. Xác nhận] ──→ [3. Thanh toán]
```

#### Bước 1 — Thông tin giao hàng

**Form fields:**

| Field | Type | Validate | Bắt buộc |
|---|---|---|---|
| `fullName` | text | min 2 ký tự | ✅ |
| `email` | email | regex email | ✅ |
| `phone` | text | `/^(0[3-9][0-9]{8})$/` | ✅ |
| `address` | text | min 10 ký tự | ✅ |
| `province` | select | — | ✅ |
| `district` | select | phụ thuộc province | ✅ |
| `ward` | select | phụ thuộc district | ✅ |
| `note` | textarea | — | ❌ |

> **Chú ý:** Email là trường bắt buộc. Sẽ dùng để gửi email xác nhận đơn hàng.

**Library:** React Hook Form + Zod schema validation

```typescript
const checkoutSchema = z.object({
  fullName:  z.string().min(2, "Vui lòng nhập họ tên"),
  email:     z.string().email("Email không hợp lệ"),
  phone:     z.string().regex(/^(0[3-9][0-9]{8})$/, "Số điện thoại không hợp lệ"),
  address:   z.string().min(10, "Vui lòng nhập địa chỉ chi tiết"),
  province:  z.string().min(1, "Vui lòng chọn Tỉnh/Thành"),
  district:  z.string().min(1, "Vui lòng chọn Quận/Huyện"),
  ward:      z.string().min(1, "Vui lòng chọn Phường/Xã"),
  note:      z.string().optional(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]),
})
```

#### Bước 2 — Xác nhận đơn hàng

- Hiển thị lại toàn bộ thông tin: danh sách SP, thông tin giao hàng, phương thức TT đã chọn
- Radio chọn phương thức thanh toán:
  ```
  ○ 💵 Thanh toán khi nhận hàng (COD)
  ● 📱 Chuyển khoản QR (SePay) — Xác nhận tự động
  ```
- Nút "Quay lại" và "Xác nhận đặt hàng"
- Khi click "Xác nhận": gọi `POST /api/orders/create` → nhận `orderCode` → chuyển Bước 3

#### Bước 3 — Thanh toán

**Nếu COD:**
```
✅ Đặt hàng thành công!
Mã đơn hàng: ORD-20260502-001

Bạn sẽ thanh toán [XXX.XXX đ] khi nhận hàng.
Chúng tôi sẽ liên hệ xác nhận trong vòng 2–4 giờ làm việc.

[Xem trạng thái đơn hàng]  [Tiếp tục mua sắm]
```

**Nếu BANK_TRANSFER:**
```
Quét mã QR để thanh toán
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  QR CODE từ SePay  ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ngân hàng:     [Tên NH từ config]
Số tài khoản:  [Số TK từ config]
Tên TK:        [Tên TK từ config]
Số tiền:       XXX.XXX đ
Nội dung CK:   ORD-20260502-001  [Copy]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hết hạn sau: 14:32  (countdown 15 phút)

[Đang chờ xác nhận thanh toán... ⏳]
→ Tự động chuyển trang khi nhận được tiền
```

- Polling `GET /api/orders/[orderCode]/status` mỗi 5 giây
- Khi status = `PAID` → redirect `/dat-hang/xac-nhan/[orderCode]`

---

### 4.6 Trang xác nhận — `/dat-hang/xac-nhan/[orderCode]`

**Render:** SSR

```
🎉 Cảm ơn bạn đã đặt hàng!
Mã đơn hàng: ORD-20260502-001

[Order timeline — 5 bước]

[Tóm tắt đơn hàng]
  - Sản phẩm 1 × 2 = 200.000đ
  - ...
  Tổng: XXX.XXX đ

[Thông tin giao hàng]
  Người nhận: ...
  SĐT: ...
  Địa chỉ: ...

[Email xác nhận đã gửi tới: example@email.com]

[Xem trạng thái đơn]  [Tiếp tục mua sắm]  [Liên hệ hỗ trợ]
```

---

### 4.7 Blog — `/blog` & `/blog/[slug]`

**Render:** SSG + ISR (revalidate: 300s)

**Danh sách:** Grid 3 cột, lọc theo danh mục, phân trang 9 bài/trang

**Chi tiết bài viết:**
- Breadcrumb, H1, ảnh header, nội dung rich text (HTML)
- Sidebar: bài mới nhất (3 bài), danh mục, tags
- Meta SEO: `title`, `description`, `og:image` theo từng bài
- `getStaticPaths` cho tất cả published posts

---

### 4.8 Giới thiệu — `/gioi-thieu`

**Render:** SSG

Nội dung: Về thương hiệu, lịch sử, chứng nhận chất lượng, cam kết, đội ngũ

---

### 4.9 Liên hệ — `/lien-he`

**Render:** SSG

- Form liên hệ: Họ tên, Email, SĐT, Nội dung → `POST /api/contact`
- Google Maps embed
- Địa chỉ, hotline, email công ty
- Zalo / Messenger links

---

## 5. Admin Dashboard

**Base URL:** `/admin`
**Bảo vệ:** Next.js middleware kiểm tra session token JWT trong cookie

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
export const config = { matcher: ['/admin/:path*'] }
```

### 5.1 Layout Admin

- Sidebar navigation: Dashboard / Đơn hàng / Sản phẩm / Blog / Cài đặt
- Header: Tên admin, nút logout
- Responsive: sidebar collapse trên tablet

### 5.2 Quản lý Đơn hàng — `/admin/don-hang`

**Bảng danh sách:**

| Cột | Ghi chú |
|---|---|
| Mã đơn | Link tới trang chi tiết |
| Khách hàng | Họ tên + Email |
| SĐT | — |
| Tổng tiền | Định dạng VNĐ |
| Phương thức TT | Badge: COD / QR |
| Trạng thái | Badge màu theo status |
| Ngày đặt | dd/MM/yyyy HH:mm |
| Hành động | Xem / Cập nhật |

**Filter & Search:**
- Dropdown filter: Tất cả / Chờ xác nhận / Chờ TT / Đã TT / Đang giao / Hoàn tất / Huỷ
- Search: Mã đơn, SĐT, email

**Chi tiết đơn hàng:** Modal hoặc trang `/admin/don-hang/[id]`
- Danh sách SP, thông tin khách, địa chỉ giao, ghi chú, lịch sử status
- Dropdown cập nhật status
- **COD:** Nút "Xác nhận đã nhận tiền" → `PENDING_CONFIRM` → `PAID`
- Mỗi lần đổi status → trigger gửi email thông báo khách hàng

### 5.3 Quản lý Sản phẩm — `/admin/san-pham`

**Form thêm/sửa SP (`ProductForm`):**

```typescript
interface ProductFormData {
  name:        string       // bắt buộc
  slug:        string       // auto-generate, có thể sửa tay
  categoryId:  number       // bắt buộc
  description: string       // mô tả ngắn
  ingredients: string       // thành phần
  usage:       string       // hướng dẫn sử dụng
  benefits:    string       // công dụng
  warning:     string       // lưu ý
  price:       number       // giá gốc, bắt buộc
  salePrice?:  number       // giá sale, nullable
  stock:       number       // tồn kho, bắt buộc
  unit:        string       // hộp / gói / lọ / chai
  brand:       string
  images:      File[]       // upload, tối đa 5 ảnh
  isFeatured:  boolean
  isNew:       boolean
  isBestSeller: boolean
}
```

**Upload ảnh:** Multer (lưu `/public/uploads/products/`) hoặc Cloudinary free tier

**Soft delete:** `isDeleted = true` ẩn khỏi frontend, admin thấy nhãn "Đã ẩn" + nút khôi phục

### 5.4 Quản lý Blog — `/admin/blog`

**Form bài viết:**

```typescript
interface BlogPostFormData {
  title:           string    // bắt buộc
  slug:            string    // auto-generate
  category:        string    // Dinh dưỡng / Sức khỏe / Tips / Sản phẩm
  summary:         string    // tóm tắt ≤ 200 ký tự
  content:         string    // HTML từ TipTap editor
  thumbnail:       File      // ảnh đại diện
  metaTitle?:      string    // SEO override, mặc định = title
  metaDescription?: string   // SEO override, mặc định = summary
  published:       boolean
}
```

**Rich text editor:** TipTap với extensions: Heading (H2/H3), Bold, Italic, BulletList, OrderedList, Blockquote, Link, Image

---

## 6. Tích hợp Thanh toán — SePay

### 6.1 Tổng quan SePay

SePay là dịch vụ trung gian cho phép theo dõi giao dịch ngân hàng và gửi webhook về server khi có thanh toán khớp với nội dung chuyển khoản.

**Luồng hoạt động:**
```
Khách hàng
  │
  ├─ Quét QR / chuyển khoản với nội dung = orderCode
  │
  └─→ Ngân hàng xử lý
          │
          └─→ SePay nhận biến động số dư
                    │
                    └─→ POST Webhook → /api/webhook/sepay
                                │
                                └─→ Verify → Cập nhật đơn → Gửi email
```

### 6.2 Cấu hình SePay

```env
SEPAY_API_KEY=<your_sepay_api_key>
SEPAY_WEBHOOK_SECRET=<your_webhook_secret>
SEPAY_ACCOUNT_NUMBER=<so_tai_khoan>
SEPAY_BANK_NAME=<ten_ngan_hang>
SEPAY_ACCOUNT_NAME=<chu_tai_khoan>
```

### 6.3 Tạo thông tin QR

SePay cung cấp URL tạo QR chuẩn VietQR:

```typescript
// lib/sepay.ts
export function generateQRUrl(orderCode: string, amount: number): string {
  // SePay VietQR format
  const bankId = process.env.SEPAY_BANK_ID   // VD: "MB", "TCB", "VCB"
  const accountNo = process.env.SEPAY_ACCOUNT_NUMBER
  const template = "compact2"  // hoặc "qr_only"
  const description = orderCode  // Nội dung CK = orderCode

  return `https://qr.sepay.vn/img?bank=${bankId}&acc=${accountNo}&template=${template}&amount=${amount}&des=${description}`
}
```

**Hiển thị QR trong component:**
```tsx
// components/QRPaymentBlock.tsx
<Image
  src={generateQRUrl(orderCode, totalAmount)}
  alt="QR thanh toán"
  width={240} height={240}
  priority
/>
```

### 6.4 Webhook Handler

```typescript
// app/api/webhook/sepay/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderPaidEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // 1. Verify webhook signature
  const signature = req.headers.get('x-api-key')
  if (signature !== process.env.SEPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /*
  SePay Webhook payload (tham khảo docs.sepay.vn):
  {
    id: number,
    gateway: string,          // tên ngân hàng
    transactionDate: string,
    accountNumber: string,
    code: string | null,      // nội dung chuyển khoản — đây là orderCode
    content: string,          // full nội dung giao dịch
    transferType: "in" | "out",
    transferAmount: number,
    accumulated: number,
    referenceCode: string,
    description: string
  }
  */

  const { code, transferAmount, transferType } = body

  // 2. Chỉ xử lý giao dịch nhận tiền (in)
  if (transferType !== 'in') {
    return NextResponse.json({ status: 'ignored' })
  }

  // 3. Tìm đơn hàng theo orderCode (= nội dung CK)
  if (!code) {
    return NextResponse.json({ status: 'no_code' })
  }

  const order = await prisma.order.findUnique({
    where: { orderCode: code }
  })

  if (!order) {
    return NextResponse.json({ status: 'order_not_found' })
  }

  // 4. Kiểm tra số tiền
  if (transferAmount < order.totalAmount) {
    // Ghi log nhưng không tự động xác nhận
    console.warn(`[SePay] Số tiền không khớp: ${transferAmount} < ${order.totalAmount}`)
    return NextResponse.json({ status: 'amount_mismatch' })
  }

  // 5. Cập nhật trạng thái đơn hàng
  if (order.status === 'PENDING_PAYMENT') {
    await prisma.order.update({
      where: { orderCode: code },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        sepayTransactionId: String(body.id),
      }
    })

    // 6. Gửi email xác nhận thanh toán
    await sendOrderPaidEmail(order)
  }

  return NextResponse.json({ status: 'ok' })
}
```

> **Lưu ý bảo mật:** SePay gửi header `x-api-key` chứa `SEPAY_WEBHOOK_SECRET`. Luôn verify trước khi xử lý. Đăng ký URL webhook trong SePay dashboard: `https://yourdomain.com/api/webhook/sepay`

### 6.5 Polling từ Frontend

```typescript
// hooks/useOrderStatus.ts
export function useOrderStatus(orderCode: string) {
  const [status, setStatus] = useState<OrderStatus>('PENDING_PAYMENT')

  useEffect(() => {
    if (status === 'PAID') return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderCode}/status`)
      const data = await res.json()
      setStatus(data.status)
      if (data.status === 'PAID') {
        clearInterval(interval)
        router.push(`/dat-hang/xac-nhan/${orderCode}`)
      }
    }, 5000)  // poll mỗi 5 giây
    return () => clearInterval(interval)
  }, [orderCode, status])

  return status
}
```

---

## 7. Hệ thống Email

### 7.1 Cấu hình SMTP

Sử dụng SMTP server riêng (private mailbox), cấu hình hoàn toàn qua `.env`:

```env
SMTP_HOST=mail.yourdomain.com      # VD: mail.tpcn-brand.com
SMTP_PORT=587                       # 587 (STARTTLS) hoặc 465 (SSL)
SMTP_SECURE=false                   # true nếu dùng port 465
SMTP_USER=no-reply@yourdomain.com  # Địa chỉ gửi
SMTP_PASS=<your_email_password>
SMTP_FROM_NAME=Tên Thương Hiệu     # Hiển thị tên người gửi
SMTP_FROM_EMAIL=no-reply@yourdomain.com
```

### 7.2 Thư viện

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

```typescript
// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

async function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  })
}
```

### 7.3 Các loại email

#### Email 1 — Xác nhận đơn hàng (gửi ngay sau khi đặt)

**Trigger:** `POST /api/orders/create` thành công
**Subject:** `[Mã đơn: ORD-XXXXXXXX] Xác nhận đơn hàng của bạn`

**Nội dung:**
```
Xin chào [Họ tên],

Đơn hàng #ORD-XXXXXXXX của bạn đã được tiếp nhận thành công.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chi tiết đơn hàng:
  [Tên SP 1]  × [SL]   [Giá]đ
  [Tên SP 2]  × [SL]   [Giá]đ
  ─────────────────────────────
  Tổng cộng:           [Tổng]đ

Phương thức thanh toán: [COD / Chuyển khoản QR]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thông tin giao hàng:
  [Họ tên] — [SĐT]
  [Địa chỉ đầy đủ]

[Nếu BANK_TRANSFER]
⚠️ Lưu ý: Vui lòng chuyển khoản [Tổng]đ
   Nội dung CK: ORD-XXXXXXXX
   Đơn hàng sẽ được xử lý sau khi nhận được thanh toán.

[Xem trạng thái đơn hàng] → link tới /dat-hang/xac-nhan/[orderCode]

Trân trọng,
[Tên thương hiệu]
Hotline: [SĐT]
```

#### Email 2 — Xác nhận đã thanh toán

**Trigger:** Webhook SePay xác nhận `PAID` (BANK_TRANSFER) hoặc Admin bấm "Xác nhận đã nhận tiền" (COD)
**Subject:** `[Mã đơn: ORD-XXXXXXXX] Thanh toán thành công — Đơn hàng đang được xử lý`

```
Xin chào [Họ tên],

Chúng tôi đã xác nhận thanh toán cho đơn hàng #ORD-XXXXXXXX.
Đơn hàng của bạn đang được chuẩn bị và sẽ sớm được giao.

[Xem trạng thái đơn hàng]
```

#### Email 3 — Thông báo đang giao hàng

**Trigger:** Admin cập nhật status → `SHIPPING`
**Subject:** `[Mã đơn: ORD-XXXXXXXX] Đơn hàng đang được giao đến bạn 🚚`

```
Xin chào [Họ tên],

Đơn hàng #ORD-XXXXXXXX đã được giao cho đơn vị vận chuyển
và đang trên đường đến địa chỉ của bạn.

Vui lòng để ý điện thoại để nhận hàng.

[Xem trạng thái đơn hàng]
```

#### Email 4 — Giao hàng thành công

**Trigger:** Admin cập nhật status → `DONE`
**Subject:** `[Mã đơn: ORD-XXXXXXXX] Giao hàng thành công — Cảm ơn bạn! 🎉`

```
Xin chào [Họ tên],

Đơn hàng của bạn đã được giao thành công.
Cảm ơn bạn đã tin tưởng và mua sắm tại [Tên thương hiệu]!

Nếu có bất kỳ vấn đề gì, vui lòng liên hệ chúng tôi trong vòng 7 ngày.

Hotline: [SĐT]   |   Zalo: [Link]
```

### 7.4 HTML Email Template

Dùng template inline CSS đơn giản để đảm bảo tương thích với mọi email client:

```typescript
// lib/email-templates.ts
export function orderConfirmTemplate(order: Order): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background: #1A5C38; padding: 24px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 20px;">Xác nhận đơn hàng</h1>
      <p style="color: #D5F5E3; margin: 8px 0 0;">#${order.orderCode}</p>
    </div>
    <!-- Body -->
    <div style="padding: 24px;">
      <p>Xin chào <strong>${order.customerName}</strong>,</p>
      <p>Đơn hàng của bạn đã được tiếp nhận thành công.</p>
      <!-- Items table -->
      <!-- ... -->
      <!-- CTA -->
      <div style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dat-hang/xac-nhan/${order.orderCode}"
           style="background: #27AE60; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Xem trạng thái đơn hàng
        </a>
      </div>
    </div>
    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 16px; text-align: center; color: #666; font-size: 13px;">
      <p>© ${new Date().getFullYear()} ${process.env.SMTP_FROM_NAME}</p>
    </div>
  </div>
</body>
</html>
  `
}
```

---

## 8. Kiến trúc kỹ thuật

### 8.1 Tech Stack

| Layer | Công nghệ | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI State (cart) | Zustand | 4.x |
| Form | React Hook Form + Zod | RHF 7.x / Zod 3.x |
| Database | PostgreSQL | 15.x |
| ORM | Prisma | 5.x |
| Auth (admin) | NextAuth.js v5 (credentials) | 5.x |
| Email | Nodemailer | 6.x |
| Rich Text | TipTap | 2.x |
| Payment | SePay (VietQR + Webhook) | — |
| File Upload | Multer (local) | 1.x |
| HTTP Client | Native fetch / Axios | — |
| Deploy | Nginx + PM2 + VPS | — |
| SSL | Let's Encrypt (Certbot) | — |

### 8.2 Cấu trúc thư mục

```
/
├── app/
│   ├── (public)/                    # Layout public (Header + Footer)
│   │   ├── page.tsx                 # Trang chủ
│   │   ├── san-pham/
│   │   │   ├── page.tsx             # Danh sách SP
│   │   │   └── [slug]/page.tsx      # Chi tiết SP
│   │   ├── gio-hang/page.tsx        # Giỏ hàng
│   │   ├── dat-hang/
│   │   │   ├── page.tsx             # Checkout
│   │   │   └── xac-nhan/[code]/page.tsx  # Trang cảm ơn
│   │   ├── blog/
│   │   │   ├── page.tsx             # Danh sách blog
│   │   │   └── [slug]/page.tsx      # Chi tiết bài viết
│   │   ├── gioi-thieu/page.tsx
│   │   └── lien-he/page.tsx
│   │
│   ├── admin/                       # Layout admin (Sidebar)
│   │   ├── login/page.tsx
│   │   ├── page.tsx                 # Dashboard tổng quan
│   │   ├── don-hang/
│   │   │   ├── page.tsx             # Danh sách đơn
│   │   │   └── [id]/page.tsx        # Chi tiết đơn
│   │   ├── san-pham/
│   │   │   ├── page.tsx
│   │   │   ├── them/page.tsx
│   │   │   └── [id]/chinh-sua/page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       ├── them/page.tsx
│   │       └── [id]/chinh-sua/page.tsx
│   │
│   └── api/
│       ├── orders/
│       │   ├── create/route.ts      # POST — tạo đơn
│       │   └── [code]/
│       │       └── status/route.ts  # GET — check status (polling)
│       ├── admin/orders/
│       │   ├── route.ts             # GET list
│       │   └── [id]/route.ts        # GET detail, PATCH status
│       ├── admin/products/route.ts  # GET, POST
│       ├── admin/products/[id]/route.ts  # GET, PUT, DELETE
│       ├── admin/blog/route.ts
│       ├── admin/blog/[id]/route.ts
│       ├── webhook/sepay/route.ts   # POST — SePay webhook
│       ├── contact/route.ts         # POST — form liên hệ
│       └── upload/route.ts          # POST — upload ảnh
│
├── components/
│   ├── ui/                          # Button, Input, Badge, Toast...
│   ├── product/                     # ProductCard, ProductGrid, Filter...
│   ├── cart/                        # CartItem, CartSummary, MiniCart...
│   ├── checkout/                    # Stepper, CheckoutForm, QRPaymentBlock...
│   ├── order/                       # OrderTimeline, OrderSummary...
│   ├── blog/                        # BlogCard, BlogGrid...
│   ├── admin/                       # DataTable, ProductForm, BlogEditor...
│   └── layout/                      # Header, Footer, AdminSidebar...
│
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── email.ts                     # Nodemailer transporter + sendMail
│   ├── email-templates.ts           # HTML email templates
│   ├── sepay.ts                     # SePay QR URL generator
│   ├── auth.ts                      # NextAuth config
│   └── utils.ts                     # Helper functions
│
├── store/
│   └── cart.ts                      # Zustand cart store + persist
│
├── hooks/
│   ├── useCart.ts
│   ├── useOrderStatus.ts            # Polling hook
│   └── useToast.ts
│
├── types/
│   └── index.ts                     # Shared TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                      # Sample data
│
├── public/
│   └── uploads/                     # Ảnh upload (nếu dùng local storage)
│
├── middleware.ts                    # Protect /admin routes
├── .env.local                       # Local dev
├── .env.example                     # Template biến môi trường
└── next.config.ts
```

---

## 9. Data Model (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// Sản phẩm
// ─────────────────────────────────────────────

model Category {
  id        Int       @id @default(autoincrement())
  name      String
  slug      String    @unique
  image     String?
  products  Product[]
  createdAt DateTime  @default(now())
}

model Product {
  id           Int      @id @default(autoincrement())
  name         String
  slug         String   @unique
  categoryId   Int
  category     Category @relation(fields: [categoryId], references: [id])
  description  String?  @db.Text
  ingredients  String?  @db.Text
  usage        String?  @db.Text
  benefits     String?  @db.Text
  warning      String?  @db.Text
  price        Int                       // VNĐ
  salePrice    Int?                      // nullable
  stock        Int      @default(0)
  unit         String   @default("hộp") // hộp / gói / lọ / chai
  brand        String?
  images       String[]                  // array of URLs
  isFeatured   Boolean  @default(false)
  isNew        Boolean  @default(false)
  isBestSeller Boolean  @default(false)
  isDeleted    Boolean  @default(false)  // soft delete
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ─────────────────────────────────────────────
// Đơn hàng
// ─────────────────────────────────────────────

enum PaymentMethod {
  COD
  BANK_TRANSFER
}

enum OrderStatus {
  PENDING_PAYMENT    // Chờ thanh toán (BANK_TRANSFER)
  PENDING_CONFIRM    // Chờ xác nhận (COD)
  PAID               // Đã thanh toán
  PACKING            // Đang đóng gói
  SHIPPING           // Đang giao hàng
  DONE               // Giao thành công
  CANCELLED          // Đã huỷ
}

model Order {
  id                 Int           @id @default(autoincrement())
  orderCode          String        @unique  // ORD-YYYYMMDD-NNN
  customerName       String
  customerEmail      String                 // Bắt buộc
  customerPhone      String
  address            String
  province           String
  district           String
  ward               String
  note               String?
  items              Json                   // OrderItem[]
  totalAmount        Int                    // VNĐ
  paymentMethod      PaymentMethod
  status             OrderStatus   @default(PENDING_PAYMENT)
  sepayTransactionId String?                // ID giao dịch SePay
  paidAt             DateTime?
  statusHistory      OrderHistory[]
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
}

// items JSON structure:
// [{ productId, name, slug, image, price, salePrice, quantity }]

model OrderHistory {
  id        Int         @id @default(autoincrement())
  orderId   Int
  order     Order       @relation(fields: [orderId], references: [id])
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())
}

// ─────────────────────────────────────────────
// Blog
// ─────────────────────────────────────────────

model BlogPost {
  id              Int      @id @default(autoincrement())
  title           String
  slug            String   @unique
  category        String
  summary         String   @db.Text
  content         String   @db.Text    // HTML từ TipTap
  thumbnail       String
  metaTitle       String?
  metaDescription String?
  published       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ─────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────

model Admin {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String                      // bcrypt hash
  name      String
  createdAt DateTime @default(now())
}
```

---

## 10. Biến môi trường (.env)

```env
# ─── App ───────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production

# ─── Database ──────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/tpcn_db

# ─── NextAuth (Admin) ──────────────────────────────────────────
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<random_32_char_secret>

# ─── Email (Private SMTP Mailbox) ──────────────────────────────
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false                     # true nếu dùng port 465 (SSL)
SMTP_USER=no-reply@yourdomain.com
SMTP_PASS=<mailbox_password>
SMTP_FROM_NAME=Tên Thương Hiệu
SMTP_FROM_EMAIL=no-reply@yourdomain.com

# ─── SePay ─────────────────────────────────────────────────────
SEPAY_WEBHOOK_SECRET=<secret_key_from_sepay_dashboard>
SEPAY_BANK_ID=MB                      # Mã ngân hàng: MB/TCB/VCB/...
SEPAY_ACCOUNT_NUMBER=1234567890
SEPAY_ACCOUNT_NAME=TEN CHU TAI KHOAN
SEPAY_BANK_NAME=MB Bank

# ─── Upload ────────────────────────────────────────────────────
UPLOAD_DIR=./public/uploads           # Local storage
MAX_FILE_SIZE=5242880                 # 5MB

# ─── Admin ─────────────────────────────────────────────────────
ADMIN_DEFAULT_EMAIL=admin@yourdomain.com
ADMIN_DEFAULT_PASSWORD=<bcrypt_hashed_password>
```

**File `.env.example`** (commit lên git, không commit `.env.local`):

```env
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM_NAME=
SMTP_FROM_EMAIL=
SEPAY_WEBHOOK_SECRET=
SEPAY_BANK_ID=
SEPAY_ACCOUNT_NUMBER=
SEPAY_ACCOUNT_NAME=
SEPAY_BANK_NAME=
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=5242880
ADMIN_DEFAULT_EMAIL=
ADMIN_DEFAULT_PASSWORD=
```

> **Bảo mật:** Không bao giờ commit `.env.local` hay `.env` thật lên git. Thêm vào `.gitignore`.

---

## 11. SEO & Performance

| Hạng mục | Yêu cầu | Cách thực hiện |
|---|---|---|
| Meta Title | Unique, ≤ 60 ký tự, có keyword | `generateMetadata()` per route |
| Meta Description | Unique, ≤ 160 ký tự | `generateMetadata()` per route |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:url` | `generateMetadata()` |
| Sitemap | Auto-generate `sitemap.xml` | `app/sitemap.ts` — Next.js built-in |
| Robots | Block `/admin/*`, allow rest | `app/robots.ts` |
| Image | WebP, lazy load, responsive | `next/image` toàn bộ |
| Font | Self-hosted, no layout shift | `next/font/google` — Be Vietnam Pro |
| Render | SSG trang tĩnh, SSR trang động | Per-route render strategy |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 | Skeleton, priority images, no FOUC |
| Lighthouse | ≥ 85 Performance, 100 SEO | Audit bắt buộc trước bàn giao |
| Canonical URL | Tránh duplicate content | `<link rel="canonical">` |
| Structured Data | Product schema, Breadcrumb schema | `<script type="application/ld+json">` |

---

## 12. API Routes

### Public

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/products` | Danh sách SP (filter, sort, paginate) |
| `GET` | `/api/products/[slug]` | Chi tiết SP |
| `GET` | `/api/categories` | Danh sách danh mục |
| `POST` | `/api/orders/create` | Tạo đơn hàng mới |
| `GET` | `/api/orders/[code]/status` | Check trạng thái đơn (polling) |
| `GET` | `/api/blog` | Danh sách bài viết (published) |
| `GET` | `/api/blog/[slug]` | Chi tiết bài viết |
| `POST` | `/api/contact` | Gửi form liên hệ |
| `POST` | `/api/webhook/sepay` | SePay webhook receiver |

### Admin (yêu cầu session)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/admin/orders` | Danh sách đơn hàng (filter, search) |
| `GET` | `/api/admin/orders/[id]` | Chi tiết đơn |
| `PATCH` | `/api/admin/orders/[id]` | Cập nhật status đơn |
| `GET` | `/api/admin/products` | Danh sách SP (bao gồm deleted) |
| `POST` | `/api/admin/products` | Tạo SP mới |
| `PUT` | `/api/admin/products/[id]` | Cập nhật SP |
| `DELETE` | `/api/admin/products/[id]` | Soft delete SP |
| `GET` | `/api/admin/blog` | Danh sách bài viết (bao gồm draft) |
| `POST` | `/api/admin/blog` | Tạo bài viết |
| `PUT` | `/api/admin/blog/[id]` | Cập nhật bài viết |
| `DELETE` | `/api/admin/blog/[id]` | Xóa bài viết |
| `POST` | `/api/upload` | Upload ảnh, trả về URL |

---

## 13. QA Checklist

### Functional

- [ ] Thêm SP → giỏ hàng cập nhật badge ngay lập tức
- [ ] Giỏ hàng persist sau khi reload trang
- [ ] Form checkout: submit thiếu email → hiển thị lỗi "Email không hợp lệ"
- [ ] Form checkout: submit thiếu trường bắt buộc → highlight lỗi đúng field
- [ ] Đặt hàng COD → tạo đơn DB, status = `PENDING_CONFIRM`, email gửi đến khách
- [ ] Đặt hàng QR → tạo đơn DB, status = `PENDING_PAYMENT`, hiển thị QR SePay
- [ ] Gửi webhook SePay giả lập → đơn chuyển `PAID`, email "đã thanh toán" gửi đến khách
- [ ] Polling frontend nhận `PAID` → tự động redirect trang xác nhận
- [ ] Admin xác nhận COD → status `PAID`, email gửi khách
- [ ] Admin cập nhật status `SHIPPING` → email gửi khách
- [ ] Admin CRUD sản phẩm → ISR revalidate, frontend cập nhật

### Email

- [ ] Email xác nhận đơn hàng gửi thành công (không vào spam)
- [ ] Email hiển thị đúng trên Gmail, Outlook, Yahoo Mail
- [ ] Link "Xem trạng thái đơn" trong email hoạt động đúng
- [ ] SMTP credentials sai → log lỗi rõ ràng, không crash app

### SePay Webhook

- [ ] Webhook với sai `SEPAY_WEBHOOK_SECRET` → trả về 401
- [ ] Webhook `transferType = "out"` → bỏ qua (ignored)
- [ ] Webhook `code` không khớp đơn nào → trả về `order_not_found`
- [ ] Webhook số tiền thấp hơn tổng đơn → log warning, không xác nhận
- [ ] Webhook hợp lệ → cập nhật status, gửi email, trả về 200

### Responsive

- [ ] iPhone SE (320px): Không overflow, checkout form dùng được
- [ ] iPhone 14 (390px): Grid 2 cột, giỏ hàng đẹp
- [ ] iPad (768px): Layout 2–3 cột, sidebar filter
- [ ] Desktop 1440px: 4 cột grid, max-width chuẩn

### Cross-browser

- [ ] Chrome 120+ (Desktop & Android)
- [ ] Safari 17+ (macOS & iOS)
- [ ] Firefox 120+
- [ ] Edge 120+

### Security

- [ ] Truy cập `/admin` không có auth → redirect `/admin/login`
- [ ] API `/api/admin/*` không có session → trả về 401
- [ ] Webhook SePay không có header `x-api-key` → trả về 401
- [ ] Upload file: chỉ chấp nhận `image/jpeg`, `image/png`, `image/webp`, size ≤ 5MB

### Performance

- [ ] Lighthouse Performance ≥ 85 (trang chủ + trang SP)
- [ ] Lighthouse SEO = 100
- [ ] LCP < 3s trên mobile 4G (throttled)
- [ ] Không có console errors trên production build

---

## 14. Rủi ro & Ghi chú

### Rủi ro

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| Khách chậm cung cấp nội dung SP & ảnh | Cao | Yêu cầu trước Ngày 3; dùng placeholder nếu trễ |
| Thay đổi thiết kế sau khi lập trình | Trung bình | Đóng băng prototype sau khi ký HĐ; thay đổi lớn = báo giá bổ sung |
| SePay webhook bị delay / miss | Thấp | Có nút "Kiểm tra lại" thủ công cho admin; polling từ frontend làm safety net |
| VPS thiếu RAM (Next.js cần ≥ 1GB) | Thấp | Khuyến nghị VPS ≥ 2GB RAM, 2 vCPU; dùng PM2 cluster mode |
| Email vào spam | Trung bình | Cấu hình SPF, DKIM, DMARC cho domain gửi mail |
| SMTP host bị block / downtime | Thấp | Log lỗi, retry 3 lần; queue email nếu cần (v2) |

### Ghi chú kỹ thuật

- `orderCode` format: `ORD-YYYYMMDD-NNN` (NNN = 3 chữ số, increment theo ngày)
- Giá lưu DB dạng `Int` (VNĐ, không dùng float để tránh lỗi làm tròn)
- `items` trong Order lưu dạng JSON snapshot — không FK tới Product để tránh lỗi khi SP bị xóa
- Ảnh upload lưu local `/public/uploads/` — nếu cần scale lên, migrate sang Cloudinary (không thay đổi API interface)
- SePay QR URL không cần gọi API — là URL tĩnh theo chuẩn VietQR, build phía client

### Khuyến nghị v2 (sau khi vận hành ổn định)

- [ ] Tích hợp cổng TT tự động đầy đủ (VNPAY, Momo, ZaloPay)
- [ ] Hệ thống tài khoản khách hàng (đăng ký, đăng nhập, lịch sử đơn)
- [ ] Đánh giá & review sản phẩm
- [ ] Mã giảm giá / voucher
- [ ] Email queue (Bull/BullMQ) để xử lý async
- [ ] Dashboard analytics (doanh thu, sản phẩm bán chạy)
- [ ] Tích hợp Giao hàng nhanh / GHTK API

---

*Tài liệu này là cơ sở thống nhất kỹ thuật giữa DOSU Co., Ltd và Quý khách hàng. Mọi thay đổi scope cần được 2 bên xác nhận bằng văn bản trước khi thực hiện.*

**— DOSU Co., Ltd — Lại Thế Ngọc — 0346 437 915 —**
