# `HydratedDocument` ve `req.tokenKey` — İki Yaklaşım (Blogly Backend)

## Kavram: Düz veri vs Hydrated Document

- **`IToken` (interface):** Sadece veri şekli — `{userId: ObjectId, token: string}`.
  Hiçbir metod taşımaz, sadece "hangi alanlar var" bilgisidir.
- **Hydrated Document:** `Token.findOne(...)` gibi bir sorgudan dönen **gerçek Mongoose nesnesi**.
  Düz veriye ek olarak `.save()`, `.deleteOne()`, `.populate()` gibi **metodlar** da taşır.
  ("Hydrate" = düz veriye davranış/metod katılmış hali.)

`HydratedDocument<IToken>`, Mongoose'un verdiği bir yardımcı tip: "IToken'ın şeklini al,
üzerine standart doküman metodlarını ekle" der. Bunu kullanmazsan, TS sadece düz veri bilir,
`.deleteOne()` gibi bir metoda erişmene izin vermez.

### Neden `.deleteOne()` gerçekten DB'den siliyor (kopya değil)?

Bir Mongoose dokümanı, içinde gizli bir `_id` taşır — "ben veritabanındaki şu spesifik satırım"
bilgisi objeye yapışıktır (kütüphaneden ödünç alınan kitaptaki "Raf 5, Sıra 12" etiketi gibi).
`tokenDoc.deleteOne()` çağırdığında:

1. Bellekteki obje silinmiyor (o zaten request bitince çöp toplanır, önemsiz).
2. Mongoose, objenin içindeki `_id`'yi kullanarak **MongoDB'ye gerçek bir ağ isteği** gönderir:
   "bu `_id`'ye sahip dokümanı veritabanından sil."
3. MongoDB, gerçek kaydı bulur ve **gerçekten siler**.

Yani `tokenDoc.deleteOne()` ile `Token.deleteOne({_id: tokenDoc._id})` **aynı sonucu** üretir —
farkları, ilkinin DB'de tekrar arama yapmaması (zaten elde olan dokümanın ID'sini kullanması).

---

## Seçenek A — Sadece `token` string'ini saklamak (basit)

**Tip tanımı** (`types/express.d.ts` içinde, `declare global { namespace Express { interface Request {...} } }` bloğunda):
```typescript
tokenKey?: string | null;
```

**`authentication.ts` içinde atama:**
```typescript
req.tokenKey = tokenArr[1]; // header'dan parse edilen düz token string'i
```

**`logout` controller'ında:**
```typescript
await Token.deleteOne({ token: req.tokenKey });
```
Bu satır, DB'de `token` alanına göre **tekrar arama yapıp** sonra siler — bir ekstra sorgu.

---

## Seçenek B — Tüm Token dokümanını saklamak (daha verimli)

**Tip tanımı:**
```typescript
tokenKey?: HydratedDocument<IToken> | null;
```
(`HydratedDocument`, `mongoose` paketinden import edilir: `import type { HydratedDocument } from "mongoose";`)

**`authentication.ts` içinde atama** — `tokenArr[1]` (string) değil, sorgudan dönen **tüm dokümanı** koyuyoruz:
```typescript
const tokenDoc = await Token.findOne({ token: tokenArr[1] })
  .populate<{ userId: IUser & { _id: Types.ObjectId } }>("userId");

if (tokenDoc && tokenDoc.userId && tokenDoc.userId.isActive) {
  req.user = tokenDoc.userId;
  req.tokenKey = tokenDoc; // 👈 string değil, tüm doküman
}
```

**`logout` controller'ında:**
```typescript
await req.tokenKey?.deleteOne();
```
Burada **yeniden arama yapılmıyor** — `authentication` middleware'i zaten bu dokümanı bulmuştu,
logout sadece elindeki objenin `_id`'sini kullanarak direkt silme komutu gönderiyor.

---

## Karşılaştırma

| | Seçenek A (string) | Seçenek B (HydratedDocument) |
|---|---|---|
| Tip basitliği | Daha basit (`string \| null`) | Biraz daha karmaşık (generic tip) |
| Logout'ta DB sorgusu sayısı | 2 (authentication'da find + logout'ta tekrar find/delete) | 1 (authentication'da find, logout'ta direkt delete) |
| Performans | Biraz daha fazla DB round-trip | Daha verimli |

**Tercih:** Seçenek B — gereksiz tekrar sorgudan kaçınmak, gerçek dünyada daha yaygın tercih edilen yol.
