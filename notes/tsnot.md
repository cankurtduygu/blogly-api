### Type inference
 app.get("/", (req, res) => {
        res.send("Hello");
  });
  * Burda mesela TypeScript şunu görüyor:app.get(path, handler)
    ve Express'in tiplerinden handler'ın: (req: Request, res: Response) => void
    olduğunu biliyor.Yani bağlam (context) var.Bu yüzden:tiplerini otomatik çıkarabiliyor.
    Buna Contextual Typing denir. (Type Inference'in bir çeşidi.)
  * Ayrı fonksiyonda bağlam kayboluyor
    import { Request, Response } from "express";

        export const getUsers = (
            req: Request,
            res: Response
        ) => {
            res.send("Hello");
        };
### Type Interface
# User
- new mongoose.Schema<IUser>() ile Bu schema IUser yapısındaki veri tutacak demis oluyoruz
- TypeScript interface
    → field adı ve field tipi kontrol eder
    → email mi mail mi, string mi number mı
# Category
# Blog
- Burda karsimiza iliskisel type tanimlama cikti
  * userId: Types.ObjectId; Neden string değil? Mesela MongoDB'de User'ın id'si:685c32f487ab4d51f3ab1234 olarak durur. Ama Mongoose bunu Types.ObkjectId olarak temsil eder.
- comments neden array. Bir blogada birden cok yorum olabilir bu yüzden comments: Types.ObjectId[];
  ** Schema disinda export kismindan önce
     tokenSchema.index(
  { createdAt: 1 },//TTL bu alani takip edecek diyoruz
  { expireAfterSeconds: Number(process.env.TOKEN_TTL) },
);
    bu sekilde tanimladik. 
  ** Burda kullandigimiz expire süresini env de tanimladik ama ordan gelen veri string geldigi icin Numbera cevirdik.
# bcrypt func daki ts tipleri
 - async (password: string): Promise<string> burda password string diye belirttik ve func async olup da promise dönecegini Promise<string> ile belirtiriz.
 - (): Promise<string> Bu fonksiyon Promise döndürüyor ve Promise'in içindeki değer string.