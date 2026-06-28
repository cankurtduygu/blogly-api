# Zod Validation Notları (Blogly Backend)

## 1. Validation vs Transformation farkı

Zod iki farklı iş yapar, ikisini ayırmak gerekiyor:

- **Validation (doğrulama):** "Bu veri kurallara uyuyor mu?" → `min()`, `max()`, `email()` gibi
  kontroller. Uymuyorsa **reddedilir** (400 döner), hiçbir şekilde "düzeltilip kabul edilmez".
- **Transformation (dönüştürme):** Veri **zaten geçerliyse**, onu standart bir forma çevirme işi.
  `.trim()`, `.toLowerCase()`, `.default()`, `z.coerce.number()` gibi metodlar buna girer.

### Neden transform gerekli? (email örneği)
- `Test@Example.com` ve `test@example.com` ikisi de **geçerli** email formatı, ikisi de validasyondan geçer.
- Ama bunlar gerçekte **aynı email adresi** (Gmail gibi sağlayıcılar `@` öncesinde case-insensitive çalışır).
- Eğer DB'ye olduğu gibi (dönüştürmeden) kaydedersek:
  - `unique: true` index aynı email'in iki farklı yazılışını **ayrı** kabul eder → aynı kişi 2 hesap açabilir.
  - Login'de kullanıcı email'i farklı case ile yazarsa (`test@..` vs DB'de `Test@..`) → eşleşme bulunamaz, giriş yapamaz.
- `toLowerCase()` + `trim()` ile her geçerli email'i **tek bir kanonik forma** sokuyoruz, DB'de ve aramada tutarlılık garanti ediyoruz.

## 2. `safeParse()` nasıl çalışıyor?

- Kendi yazdığımız `registerSchema` / `loginSchema` sadece **kurallar tanımı** — kendi başına bir şey yapmaz.
- `schema.safeParse(data)` çağrıldığında Zod'un **kendi iç motoru** çalışır:
  - Veriyi kurallara göre kontrol eder.
  - `.trim()` / `.toLowerCase()` gibi transformları uygular.
  - Sonucu kendi sabit formatında döner:
    ```
    { success: true,  data: <dönüştürülmüş/temiz veri> }
    { success: false, error: <hata detayları (issues)> }
    ```
- `result.data`, Zod'un **bizim için ürettiği temiz veri** — bunu biz yazmıyoruz, kütüphane hesaplıyor.
- **Önemli hata:** `result.success === true` olduğunda sadece `next()` çağırıp `result.data`'yı
  kullanmazsak, Zod'un yaptığı trim/lowercase işi boşa gider; controller'a hâlâ ham `req.body` gider.
  Bu yüzden başarı durumunda `req.body`'yi `result.data.body` ile **değiştirmemiz** gerekiyor.

## 3. Generic `validate` middleware — TypeScript tuzağı

`schema: ZodType` (generic parametresiz) yazılırsa, Zod 4'te `result.data` tipi `unknown`/`output<T>`
olur ve `.body` erişimi TS hatası verir (`Property 'body' does not exist on type 'output<T>'`).

Çözüm: fonksiyonu generic yapıp, `body`'ye erişirken bilinçli ve **dar kapsamlı** bir `any` cast kullanmak
(tüm fonksiyonu any yapmadan, sadece bu tek noktada):

```typescript
import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";
import type { ZodType } from "zod";

export const validate = <T extends ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new CustomError("Validation failed", 400, result.error.issues),
      );
    }

    req.body = (result.data as any).body;
    next();
  };
```

> Not: `z.infer<T>` ile `output<T>` aynı tip (alias), o yüzden cast'i `z.infer<T>` yapmak da
> aynı hatayı verir — sorunu çözen şey `any`'ye geçmek, isim değiştirmek değil.

## 4. Auth validation şemaları (son hali)

```typescript
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(15),
    password: z.string().min(6).max(50),
    email: z.string().trim().email().toLowerCase(),
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),
    image: z.string().trim().optional(),
    city: z.string().trim().optional(),
    bio: z.string().trim().max(500).optional(), // ⚠️ modelde maxlength: 2000, hizalanmalı
  }),
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().trim().min(1), // hem username hem email kabul edilecek, format sıkılaştırılmadı
    password: z.string().min(1),
  }),
});
```

**Bilinçli karar:** `registerSchema`'da `isActive` / `isAdmin` / `isStaff` yok — kullanıcı
kendi yetkisini signup'ta belirleyemesin diye.

**Açık iş:** `bio` maxlength'i Zod'da (500) ile modelde (2000) hizalanmalı, hangisi doğruysa
ikisi de aynı sayı olmalı.

## 5. asyncHandler kararı

- Express 5 kullanıyoruz → async route handler'larda fırlatılan/reddedilen hatalar
  **otomatik olarak** error handler middleware'ine gidiyor.
- Bu yüzden `asyncHandler` wrapper'a **gerek yok** — controller'larda direkt
  `async (req, res, next) => { throw new CustomError(...) }` yazılabilir, manuel
  `try/catch` veya wrapper fonksiyon gereksiz boilerplate olur (Express 4 döneminden kalma bir refleks).

## 6. CustomError yapısı (karar)

- Tek bir `CustomError` sınıfı yerine, **hata türüne göre ayrı sınıflar** kullanılacak
  (örn. `NotFoundError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`).
- Her alt sınıf kendi `statusCode`'unu sabit taşır (yanlış status code yazma riski ortadan kalkar).
- Base class (`src/utils/customError.ts`):
  ```typescript
  export class CustomError extends Error {
    constructor(
      message: string,
      public statusCode = 500,
      public cause?: unknown,
    ) {
      super(message);
      this.name = "CustomError";
    }
  }
  ```
