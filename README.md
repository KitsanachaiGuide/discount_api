# Discount Calculation API

A comprehensive discount calculation system with intelligent product categorization and multiple campaign types.

## Features

- **Multiple discount types**: Fixed amount, percentage, category-based, points, and seasonal discounts
- **Automatic product categorization**: Smart categorization using fuzzy matching
- **Campaign prioritization and stacking**: Organized discount application order
- **Built-in typo correction**: Handles common spelling mistakes in product names
- **Flexible format support**: Compatible with multiple data formats
- **Precise calculations**: Decimal precision control and negative price protection

## Campaign Types

| Campaign Type | Format 1 (params object) | Format 2 (direct fields) | Description |
|---------------|---------------------------|---------------------------|-------------|
| **`fixed_amount`** | `{ "params": { "amount": 1000 } }` | `{ "discount_amount": 1000, "maximum_discount": 2000 }` | Fixed THB amount discount |
| **`percentage`** | `{ "params": { "percentage": 10 } }` | `{ "discount_percentage": 15, "maximum_discount": 500 }` | Percentage-based discount |
| **`category_percentage`** | `{ "params": { "category": "Electronics", "amount": 20 } }` | `{ "applicable_categories": ["Clothing"], "discount_percentage": 25 }` | Category-specific percentage discount |
| **`points`** | `{ "params": { "customerPoints": 100 } }` | `{ "points_used": 300, "maximum_discount": 400 }` | Points redemption (1 point = 1 THB, max 20% of total) |
| **`seasonal`** | `{ "params": { "everyXTHB": 1000, "discountYTHB": 100 } }` | `{ "discount_percentage": 30, "start_date": "2025-06-01", "end_date": "2025-08-31" }` | Step-based or time-limited percentage discount |

### Additional Parameters

| Parameter | Description | Applicable To |
|-----------|-------------|---------------|
| `minimum_amount` | Minimum cart value required | All types |
| `maximum_discount` | Maximum discount amount limit | All types |
| `start_date` / `end_date` | Campaign validity period | Seasonal (Format 2) |
| `applicable_categories` | Target categories for discount | Category, Seasonal |

## Business Rules

- **ลำดับการคำนวณ**: Coupon → On Top → Seasonal
- **ใน Coupon category**: จะใช้ได้แค่ 1 แคมเปญ
- **Points discount**: จำกัดไม่เกิน 20% ของราคารวม
- **Seasonal discount**: ตรวจสอบวันที่เริ่มต้นและสิ้นสุด
- **ราคาจะไม่ติดลบ**: minimum 0
- **ทศนิยม**: 2 ตำแหน่ง

## Advanced Features (ระบบที่ทำขึ้นเพื่มเติม)

### ระบบจัดหมวดหมู่อัตโนมัติ (Auto Categorization)
- **ไม่ต้องระบุ category**: ระบบจะจัดหมวดหมู่ให้อัตโนมัติ
- **Fuzzy Matching**: ค้นหาและจับคู่ชื่อสินค้าแม้มีการพิมพ์ผิด (typos)
- **Partial Matching**: ค้นหาคำที่คล้ายกันหรือบางส่วนของชื่อสินค้า

### ระบบ Strategy Pattern
- **Modular Design**: แยกการคำนวณแต่ละประเภทเป็น Strategy คนละตัว
- **Extensible**: เพิ่มประเภทส่วนลดใหม่ได้ง่าย
- **Maintainable**: โค้ดแยกส่วนชัดเจน แก้ไขง่าย

### รองรับ Format หลากหลาย
- **รองรับ format ที่ใช้ params object**: `{ "params": { "amount": 1000 } }`
- **รองรับ format ที่ใช้ field ตรงๆ**: `{ "discount_amount": 1000 }`

### การคำนวณและรายงาน
- **Detailed Response**: แสดงราคาเริ่มต้น, ราคาสุดท้าย, ส่วนลดรวม
- **Campaign Breakdown**: แสดงแคมเปญที่ใช้และส่วนลดแต่ละอัน
- **Precision Control**: ควบคุมทศนิยม 2 ตำแหน่ง
- **Negative Price Protection**: ป้องกันราคาติดลบ

### การทดสอบและ Debugging
- **Edge Case Handling**: จัดการกรณีพิเศษ เช่น ตะกร้าว่าง, ไม่มีแคมเปญ
- **Data Validation**: ตรวจสอบข้อมูลที่ไม่ถูกต้อง

## Smart Categorization

Configuration files:
- `src/data/product-keywords.json` - Category mappings
- `src/data/common-typos.json` - Typo corrections

## Campaign Priority

Discounts apply in order: **Coupon** → **On Top** → **Seasonal**

## Testing

## Unit Tests
สามารทดสอบระบบ (Unit Tests) ด้วยคำสั่ง:
```bash
npm test
```

### Postman Collection
สำหรับการทดสอบ API ผ่าน Postman กรุณาดูรายละเอียดและ Test Cases ทั้งหมดได้ที่ไฟล์ `discount-module\examples\postman-collection.json`

## Installation
Install all required dependencies:

```bash
npm install
```
