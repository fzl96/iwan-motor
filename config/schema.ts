import * as z from "zod";

export const MotorSchema = z.object({
  model: z.string().nonempty({ message: "Model harus diisi" }),
  modal: z.number().positive({ message: "Harga modal harus diisi" }),
  jual: z.number().positive({ message: "Harga jual harus diisi" }),
  stok: z.number().positive({ message: "Stok harus diisi" }),
  rangka: z.string().nonempty({ message: "No. Rangka harus diisi" }),
  mesin: z.string().nonempty({ message: "No. Mesin harus diisi" }),
  polisi: z.string().nonempty({ message: "No. Polisi harus diisi" }),
  tahun: z.number().positive({ message: "Tahun harus diisi" }),
  warna: z.string().nonempty({ message: "Warna harus diisi" }),
});

export const MotorUpdateSschema = z.object({
  model: z.string().nonempty({ message: "Model harus diisi" }),
  modal: z.union([
    z.string().nonempty({ message: "Modal harus diisi" }),
    z.number().positive({ message: "Modal harus diisi" }),
  ]),
  jual: z.union([
    z.string().nonempty({ message: "Harga Jual harus diisi" }),
    z.number().positive({ message: "Harga Jual harus diisi" }),
  ]),
  stok: z.union([
    z.string().nonempty({ message: "Stok harus diisi" }),
    z.number().positive({ message: "Stok harus diisi" }),
  ]),
  rangka: z.string().nonempty({ message: "No. Rangka harus diisi" }),
  mesin: z.string().nonempty({ message: "No. Mesin harus diisi" }),
  polisi: z.string().nonempty({ message: "No. Polisi harus diisi" }),
  tahun: z.union([
    z.string().nonempty({ message: "Tahun harus diisi" }),
    z.number().positive({ message: "Tahun harus diisi" }),
  ]),
  warna: z.string().nonempty({ message: "Warna harus diisi" }),
});

export const salesSchema = z.object({
  diterima: z.string().nonempty({ message: "Diterima harus diisi" }),
  alamat: z.string().nonempty({ message: "Alamat harus diisi" }),
  noHp: z.string().nonempty({ message: "No. HP harus diisi" }),
  pembayaran: z.number().positive({ message: "Pembayaran harus diisi" }),
  keterangan: z.string().optional(),
});

export const saleUpdateSchema = z.object({
  diterima: z.string().nonempty({ message: "Diterima harus diisi" }),
  alamat: z.string().nonempty({ message: "Alamat harus diisi" }),
  noHp: z.string().nonempty({ message: "No. HP harus diisi" }),
  pembayaran: z.union([
    z.string().nonempty({ message: "Tahun harus diisi" }),
    z.number().positive({ message: "Tahun harus diisi" }),
  ]),
  keterangan: z.string().optional(),
});
