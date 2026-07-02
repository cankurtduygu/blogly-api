# Kurulum (dosya)
   - mkdir blogapp
   - cd blogapp
   - mkdir server
   - cd server
   - npm init -y ( paket.json olusturmak icin )
   - npm install express (express indirmek icin)
   - npm install nodemon --save-dev (nodemon indirdik)
   - npm i dotenv mongoose
   - server icinde mkdir src
   - src icinde config controllers middlewares models routes utils kuruldu
   - src icinde touch app.ts server.ts
   - npm i -D typescript @types/node @types/express @tsconfig/node22
   - npm i -D ts-node-dev
   - package.json da deve "dev": "ts-node-dev --respawn src/server.ts" bunu ekledim
   - npx tsc --init (Bu projede TypeScript kullanacağım, bana bir tsconfig.json oluştur.)
    * Bu komutun React, Node.js, Express veya başka bir framework ile ilgisi yok. TypeScript kullanıyorsan ve config dosyan yoksa kullanılır. Modern araçlar (Vite, Next.js vb.) ise bunu senin yerine otomatik yapar.
   - ts.config dosyasinin icerigini düzenledim
   - package.json da type module yaptik ESM kullanacagim cunku 

   Bir hata aldim server ayaga kaldirirken bundan dolayi
   - npm remove ts-node-dev
   - npm i -D tsx
   - "scripts": {
        "dev": "tsx watch src/server.ts"
     }

# app.ts kurulumu
   - import express from "express";
     const app = express(); 
     * Burada TypeScript otomatik olarak şunu anlar: const app: Express Sen yazmasan da tipini çıkarır (type inference= Tip Çıkarımı).
   - app.use(express.json()); body den gelen jsoni parse etmek icin.
   - app.get("/", (req, res) => {
        res.send({
        message: "WELCOME TO BLOG API",
        });
    }); ekledik
   - export default app;
# server.ts kurulumu
  - app.js import edildi
  - import "dotenv/config";
  - env olusturduk 
# gitignore ekledik
# src/config dbConnection.ts actik
# dbConnection func server da cagirdik.
### Model yapisi
# User Model
  - hasleme icin bcyrpt kullacilak
  - modelde user typelini ifade etmek icin src iicnde types onun icinde user.types.ts dosyasi actim. icinde inetrfac tanimladim
  **** Not: Burda import ederken dosya uzantisi .js oluyor cunku ts derlenince dist icinde onlari runtime de .js olarak ayrica cikariyor.
  *** Not: Burda bcyrpt durumuna karar verirken su soruya takildim
      Hashleme: schema'da set ile mi, controller'da mı?
      Schema'da set transformer veya pre("save") hook:
      Avantajı: "hashlemeyi unuttum" riski sıfırlanır, her save'de otomatik tetiklenir.
Kritik tuzak: Bu yaklaşım yalnızca document.save() çağrıldığında güvenilir çalışır (yani önce findById ile dokümanı çekip, alanı değiştirip, save() dersen). Eğer profil güncellemede findByIdAndUpdate(id, {password: "..."}) gibi tek adımlı bir query kullanırsan, Mongoose'un pre("save") hook'u çalışmaz — çünkü orada bir doküman instance'ı oluşturup save etmiyorsun, direkt DB'ye query atıyorsun. set transformer'ı da query-based update'lerde varsayılan olarak tetiklenmez (özel bir ayar açman gerekir).
Ayrıca naif bir set kullanırsan, kullanıcı şifresini değiştirmeden sadece bio güncellese bile (eğer kodun her save'de password alanını yeniden set ediyorsa) hash'i tekrar hash'leme riski oluşur — bunu önlemek için isModified("password") kontrolü eklemen gerekir.
      Controller'da manuel:
Tam olarak ne zaman, hangi koşulda hashleneceğini sen görürsün ve kontrol edersin: "body'de password geldi mi? Geldiyse hashle. Gelmediyse dokunma."
findByIdAndUpdate gibi tek adımlı update pattern'leriyle de sorunsuz uyumlu çalışır, çünkü hash işlemini zaten query'den önce, elindeki body objesi üzerinde yapıyorsun.
# Category Model
 - comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ], seklinde berlitmemiz gerekir comnet bir arry ve bu comnet tablöosundan gelecek
# Auth/Token Model
 - hashleme icin bcyrpt kullanacagim icin;
      npm i bcrypt ve ts icin de 
      npm i -D @types/bcrypt paket yüklemesi yapildi.
 - Modeli yazarken simple Token dusundugumuz icin kullanci logout almayi unutursa token expire olsun diye TTL index kullandik (Time To Live )
# bcyprt/auth islemleri
 - hashleme ve compare func lari yazdik password icin
# ErrorHandler ve customError yazdik
# Zod validation 
 - npm i zod indirdim
 - src/validations folder olusturdum icindede auth.validation.ts olusturdum login ve register shemayi yazdim
 - middleware icinde validate.ts dosyasi actim.



# Controller durumlari
# Auth Controller
 - passwrod icin select: false sunu engeller await User.findOne(...) ama sunu engellemez await User.create(...)
 - login logout refresh durumalrini burda yapacagiz
 - login yapildi
 - loginden sonra autehntication middleware yazdim. orda Hydrated-document diye bir ts yapisi ögrendim onun notu ayri md dosyasinda.(C:\Users\dygca\Desktop\blogly-api\notes\hydrated-document-notlari-ts.md)
 - logout'u yazarken nu swagger dökümaninda get ile cagirdigimizi gördüm anlam veremedim cunku post yapmak daha mantikli get ile geirecegi birsey yokki postta gerci gönderecegi bir api yok aslinda. Burda RPC tarzi diye birsey cikti karsima bu RPC ile REST iki farkli API tasarim yaklasimiymis. Uzakta bir funci cagiriyormus gibi API kullanmak. Remote Procedure Call
# User Controller
 - createUser olusturdum. token burda üretildi inceleyecegin zaman bak
   * create ile olusturaln obje de geriye dönen sey elimizdeki sey oldugu icin passwordu kaldirmamiz gerekiyordu. bunun icin userModel'e bi yapi koyduk password-tojson-transfomn notunda var
 - listUser da birsey ögrnedim
   * NOT: Mongoose — Boş Alanların Response'a Dahil Edilmemesi Mongoose, şemada tanımlı olsa bile değeri hiç set edilmemiş (undefined) alanları JSON response'a dahil etmez.
    Örnek:
    // Şemada var ama değer verilmemiş
        image: String,
        city: String,
        bio: String,
        → Bu kullanıcı kaydedilirken image, city, bio verilmemişse response'da bu alanlar görünmez.

        Çözüm: Opsiyonel alanlara default: null ekle:

        image: { type: String, default: null },
        city:  { type: String, trim: true, default: null },
        bio:   { type: String, maxlength: 2000, trim: true, default: null },
        → Artık değer verilmese bile "image": null olarak response'a dahil edilir.

        Dikkat: default ekledikten sonra eski kayıtlar otomatik güncellenmez, sadece yeni kayıtlar için geçerlidir. Eski kayıtlar için PUT ile güncelleme yapılması gerekir.
 - readUser yazarken sunu gördüm idValidation icin expressin kedni tanimladigi yapi varmis zaten yani id abc gibi sacma birsey girince tam bizim gibi hata dönüyorda expressin kendi hata mesaji dönyüor bunu error handler da düzelttik.
  * runValidators Mongoose şema validasyonlarını update sırasında da çalıştır demek.
Normalde Mongoose validasyonları sadece .create() ve .save() sırasında çalışır. findOneAndUpdate veya findByIdAndUpdate kullandığında şema kuralları default olarak çalışmaz.
# Permission
 - isLogin yazarken orda isAuthenticated yadigim func da && Bu satırın döndürdüğü tip boolean değil — JavaScript'in && operatörü, soldaki değer "falsy" ise onu, değilse sağdaki değeri döndürür. Yani bu fonksiyon aslında şunlardan birini döndürebilir: null (user yoksa), undefined (user var ama isActive tanımsızsa), ya da true/false (isActive'in gerçek değeri). if (!isAuthenticated(req)) satırı pratikte doğru çalışır (çünkü !null, !undefined, !false hepsi true olur) ama tip olarak temiz değil — TS'in strict modunda bazen "bu fonksiyon boolean dönmüyor" diye bir uyarı/öneri çıkarabilir (hata vermeyebilir de, IDE'de sarı çizgi olarak görünebilir).
Daha temiz olması için çift !! (boolean'a zorlama) ekleyebilirsin:
 - isOwnerorAdmin yazdim
      De Morgan yasası olarak da düşünebilirsin:
      İzin vermek istediğin durum: isOwner || isAdmin
      Reddetmek istediğin durum (bunun tersi): !isOwner && !isAdmin
 

### Router durumlari
# Auth Route
 - routeri burda yazdiktan sonra app.ts de eklyioruz app.use icinde

# Blog Route
 ********* 
 - router.route('/:id') bir path tanımlıyor — o path için HTTP metodlarını zinciriyor. .get(), .post(), .put(), .delete() metodları burada path değil, handler alıyor.

 router.route('/:id')
  .get(handler)      // ← sadece handler
  .post(handler)     // ← sadece handler, path yok
  .post("/postLike", handler)  // ← bu çalışmaz, post() path almıyor

 Ne zaman string geçebilirsin?
router.route() çağrısında geçersin
router.route('/:id/postLike')   // ← buraya path
  .post(isLogin, toggleLikeBlog)  // ← buraya handler
Ya da direkt router.post() ile:
router.post('/:id/postLike', isLogin, toggleLikeBlog)
// ↑ buraya path     ↑ buraya handler