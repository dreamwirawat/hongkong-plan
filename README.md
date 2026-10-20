# ฮ่องกง 25–28 พ.ย. 2026 — เว็บแพลนทริป

เว็บแสดงแพลนจาก `HongKong-Plan-25-28Nov2026.pdf` แบบละเอียด: ไทม์ไลน์รายวัน, รายละเอียดทุกสถานที่ (41 จุด), รูปจริงจาก Wikimedia Commons (201 รูป พร้อมเครดิต), แผนที่ OpenStreetMap, งบ และเช็คลิสต์

## รัน

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/ (เอาไปวางบน hosting ไหนก็ได้)
```

## ภาษา

3 ภาษา: ไทย `/th/`, English `/en/`, 繁體中文 `/zh/` — หน้า `/` เลือกภาษาตามเบราว์เซอร์ และมีปุ่มสลับภาษาที่ header (อยู่หน้าเดิม)

## โครงสร้างข้อมูล

| ไฟล์ | เนื้อหา |
|---|---|
| `src/content/th.json` | ต้นฉบับภาษาไทย: แผนเดิมจาก PDF (meta, days, paceCheck, budget, checklist) + updates + practical + ข้อความของแต่ละสถานที่ |
| `src/content/en.json`, `zh.json` | คำแปล — โครงสร้างต้องตรงกับ `th.json` ทุกจุด (slug, วันที่, เส้นทาง, ตัวเลข, sources) ไม่ตรง build จะ fail |
| `src/content/places-base.json` | ข้อมูลที่ไม่ขึ้นกับภาษา: พิกัด, หมวด, ชื่อ EN/ZH, เว็บทางการ, sources, ระดับความมั่นใจ |
| `src/content/photos.json` | รูปที่คัดแล้ว + ผู้ถ่าย + license (ไฟล์อยู่ `public/images/<slug>/`) |
| `src/i18n/dict.ts` | ข้อความ UI ทั้ง 3 ภาษา |

แก้เนื้อหาเมื่อไหร่ ให้แก้ทั้ง 3 ไฟล์ภาษาพร้อมกัน — ตัวตรวจ parity ใน `src/content/index.ts` จะบอกว่าภาษาไหนไม่ตรง
# hongkong-plan
# hongkong-plan
