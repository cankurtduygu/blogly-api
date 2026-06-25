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