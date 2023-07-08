import type { kwitansi } from "../types";
import { printToFileAsync } from "expo-print";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

export const generateSalesPDF = (sales: kwitansi[]) => {
  const tableHeaderColor = "#1d3767";

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const tableRows = sales
    ?.map(
      (item) => `
    <tr>
      <td>${item.invoiceId}</td>
      <td>${item.diterima}</td>
      <td>${item.motor.model}</td>
      <td>${formatter.format(item.motor.harga_jual)}</td>
      <td>1</td>
      <td>${item.tanggal.toDate().toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</td>
    </tr>
  `
    )
    .join("");

  const html = `        
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 5px;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 15px;
            text-align: left;
          }
          table#t01 tr:nth-child(even) {
            background-color: #eee;
          }
          table#t01 tr:nth-child(odd) {
            background-color: #fff;
          }
          table#t01 th {
            background-color: ${tableHeaderColor};
            color: white;
          }
        </style>
      </head>
      <body>
        <h2>Daftar Transaksi</h2>
        <table id="t01">
          <tr>
            <th>Invoice ID</th>
            <th>Pembeli</th>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Tanggal Beli</th>
          </tr>
          ${tableRows}
        </table>
      </body>
    </html>
    `;

  const generatePdf = async () => {
    const { uri } = await printToFileAsync({
      html: html,
      width: 794,
      height: 1123,
      base64: false,
    });

    const pdfName = `${uri.slice(
      0,
      uri.lastIndexOf("/") + 1
    )}data_transaksi_${new Date().getTime()}.pdf`;

    await FileSystem.moveAsync({
      from: uri,
      to: pdfName,
    });

    await shareAsync(pdfName);
  };

  return { generatePdf };
};
