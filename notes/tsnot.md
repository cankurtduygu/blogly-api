# Type inference
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