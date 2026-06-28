# Password Response'ta Sızması — toJSON Transform (Blogly Backend)

## Sorun

`select: false`, **sadece sorgu metodlarında** (`find`, `findOne`, `findById`, `findOneAndUpdate`...)
işe yarar — Mongoose bu metodlarda MongoDB'ye "hangi alanları getir" diye bir projection gönderir,
`select: false` bu projection'ı ayarlar.

`User.create({...})` / `.save()` ile dönen doküman ise hiçbir zaman "sorgulanmış" değil — sen onu
zaten bellekte kendin doldurdun (`password: hashedPassword` dahil), Mongoose sana elindekini olduğu
gibi geri veriyor. Burada "getirme" diye bir adım çalışmadığı için `select: false` devreye girmiyor,
**password (hash hâli) response'a sızabiliyor.**

| Metod | `select: false` etkili mi? |
|---|---|
| `find()`, `findOne()`, `findById()` | ✅ Evet |
| `findOneAndUpdate()`, `findByIdAndUpdate()` | ✅ Evet |
| `create()`, `save()` (yeni doküman) | ❌ Hayır |

## Çözüm — `toJSON` transform

Modelin `toJSON` davranışını override ediyoruz, böylece **her türlü** senaryoda (create, find, hepsi)
response'a giderken password otomatik çıkarılıyor — `select: false`'un kapatamadığı boşluğu kapatıyor.

```typescript
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password, ...rest } = ret;
    return rest;
  },
});
```

Bu, **modeli oluşturmadan (`mongoose.model(...)`) önce** eklenmeli — sıra önemli, aksi halde
ayar modele "yapışmaz".

`delete ret.password` yazmadık çünkü `IUser` interface'inde `password: string` **zorunlu**
(optional değil), TS "zorunlu alanı silemezsin" diyor (`ts(2790)`). Bunun yerine
**destructuring + spread** ile password'süz **yeni bir obje** oluşturduk — sonuç aynı,
ama TS'in kısıtlamasına çarpmıyor.

## Destructuring / Spread mini-not

```javascript
const obj = { name: "Ali", age: 25, city: "Ankara" };
const { name, ...rest } = obj;
// name = "Ali"
// rest = { age: 25, city: "Ankara" }  ← name dışında kalan her şey
```

- `const { x } = obj` → objeden bir alanı kısayoldan çıkarma (`obj.x` yazmanın kısayolu).
- `...rest` → "ismini belirttiklerim dışında kalan her şeyi yeni bir objede topla" demek.
- `const { password, ...rest } = ret; return rest;` → password'ü ayırıp, kalanını (password'süz)
  yeni bir obje olarak döndürüyoruz — `delete` kullanmadan aynı sonucu elde ediyoruz.
