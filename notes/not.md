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
### Controller durumlari
# Auth Controller
 - passwrod icin select: false sunu engeller await User.findOne(...) ama sunu engellemez await User.create(...)
# User Controller
 - createUser olusturdum. token burda üretildi inceleyecegin zaman bak
   * create ile olusturaln obje de geriye dönen sey elimizdeki sey oldugu icin passwordu kaldirmamiz gerekiyordu. bunun icin userModel'e bi yapi koyduk password-tojson-transfomn notunda var
 

### Router durumlari
# Auth Route
 - routeri burda yazdiktan sonra app.ts de eklyioruz app.use icinde