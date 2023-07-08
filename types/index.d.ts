export type kwitansi = {
  id: string;
  invoiceId: string;
  diterima: string;
  alamat: string;
  tanggal: any;
  pembayaran: number;
  tanggal: string;
  noHp: string;
  keterangan?: string;
  motor: {
    id: string;
    model: string;
    harga_jual: number;
    no_mesin: string;
    no_polisi: string;
    no_rangka: string;
    tahun: number;
    type: string;
    warna: string;
    sisa_stok: number;
  };
};

export type motor = {
  id: string;
  foto: string;
  model: string;
  merk: string;
  harga_jual: number;
  harga_modal: number;
  no_mesin: string;
  no_polisi: string;
  no_rangka: string;
  tahun: number;
  warna: string;
  stok: number;
  tanggal_masuk: any;
};
