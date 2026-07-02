import type { IUser } from "./user.types.js";
import type { Model, PopulateOptions } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: (IUser & { _id: Types.ObjectId }) | null;
      tokenKey?: HydratedDocument<IToken> | null;
    }
    interface Response {
      getModelList: (
        Model: Model<any>,
        populate?: PopulateOptions | PopulateOptions[] |null,
      ) => Promise<any[]>;
      getModelListDetails: (Model: Model<any>) => Promise<object>;
    }
  }
}

// TypeScript'te normalde, bir .ts dosyasında import/export kullanıyorsan, o dosyadaki tüm tanımlar (interface, type) sadece o dosyaya/modüle özel kalır, başka dosyalar otomatik göremez. declare global {...} bir istisna kapısı: "bu blok içinde yazdığım şey, tüm projede, her dosyadan görünür olsun, modül sınırını aşsın" demek.
//namespace Express { interface Request {...} } — Burada işin can alıcı noktası şu: Express'in kendi type tanımları (@types/express paketinin içinde) zaten şöyle bir yapı kullanıyor:

// declare global {
//   namespace Express {
//     interface Request {
//       headers: ...;
//       body: any;
//       params: any;
//       // ... Express'in kendi tanımladığı tüm alanlar
//     }
//   }
// }
//Yani Express, kendi Request tipini tam bu şekilde (Express namespace'i içinde, Request interface'i olarak) tanımlamış, sonra bunu export = express ile dışa aktarmış.
//TypeScript'in "declaration merging" özelliği: Normalde aynı isimde iki class tanımlarsan hata alırsın ("duplicate declaration"). Ama interface'ler farklı davranır — TypeScript, aynı isimde (aynı namespace içinde) birden fazla interface tanımı görürse, hata vermez, bunun yerine hepsini birleştirir (merge eder), tek bir geniş interface gibi davranır.
// Bu, yeni bir Request tipi yaratmıyor — Express'in zaten var olan Express.Request interface'ini "yeniden açıp", içine senin eklediğin user alanını ekliyor. İsimler (namespace adı Express, interface adı Request) birebir aynı olduğu için TS bunları otomatik birleştiriyor.
// Sonuç: Projenin her yerinde, express'ten Request tipini kullandığında (örneğin controller'larında req: Request yazdığında), TS artık hem Express'in orijinal alanlarını (body, params, headers...) hem de senin eklediğin user/tokenKey alanlarını bilir — ikisi tek bir tipte birleşmiş gibi davranır.
