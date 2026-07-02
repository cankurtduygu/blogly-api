# Blog Like Toggle — Notlar
## Genel Mantık
Kullanıcı like butonuna her bastığında:
- Daha önce like atmışsa → like'ı geri al ($pull)
- Daha önce like atmamışsa → like ekle ($addToSet)
---
## includes() Neden Kullanılmaz?
`blog.likes` array'i `ObjectId` tipinde tutuyor.
`.includes()` referans eşitliği ile karşılaştırır:
```typescript
ObjectId("abc123") === ObjectId("abc123")  // false ❌
// Aynı değer ama farklı iki obje — bellekte farklı adreste
Yani aynı kullanıcı daha önce like atmış olsa bile .includes() false döner. Toggle yanlış çalışır.

some() Neden Kullanılır?
.some() her elemanı tek tek gezip koşulu kontrol eder. .toString() ile ObjectId'yi string'e çevirince değer karşılaştırması yapılır:
.some() ne yapar?
Array'i baştan sona gezer, koşulu sağlayan ilk elemanı bulunca durur ve true döner. Hepsini saymaz.Hiçbiri koşulu sağlamazsa false döner.

Yani "bu array'de şu değer var mı?" sorusuna cevap veriyor — kaç tane olduğuyla ilgilenmiyor, var mı yok mu diye bakıyor. Varsa true, yoksa false.

.filter() kaç tane olduğunu sayar, .find() ilk bulunanı döndürür, .some() sadece "var mı?" diye sorar.

const alreadyLiked = blog.likes.some(
  (id) => id.toString() === req.user!._id.toString()
);
"abc123" === "abc123"  // true ✅
$addToSet vs $push
                $addToSet	                           $push
Zaten varsa     Eklemez (unique tutar)                 Yine ekler (duplicate olur)
Kullanım yeri   Like, viewer gibi benzersiz listeler   Sıraya önem verilen listeler

Like için $addToSet kullanılır — aynı kişi birden fazla kez eklenemez.

$pull
Array'den eşleşen elemanı çıkarır:

{ $pull: { likes: req.user!._id } }
likes array'inden o kullanıcının id'sini siler.

didUserLike Neden !alreadyLiked?
alreadyLiked işlem öncesindeki durumu tutar. didUserLike işlem sonrasındaki durumu dönmeli — tersi olur.

alreadyLiked	         İşlem	             didUserLike
true (vardı)    $pull ile çıkarıldı      false (artık yok)
false (yoktu)   $addToSet ile eklendi    true (artık var)
Frontend bu değere bakıp like butonunu dolu/boş gösterir.

returnDocument: "after" Neden Gerekli?
findByIdAndUpdate default olarak güncelleme öncesi dökümanı döndürür. returnDocument: "after" ile güncel hali gelir.

countOfLikes için güncel likes.length'e ihtiyaç var:

const updatedBlog = await Blog.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user!._id } },
  { returnDocument: "after" }
);
countOfLikes: updatedBlog!.likes.length  // güncel sayı