import { printToFileAsync } from "expo-print";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import type { kwitansi } from "../types";

export const generateKwitansiPDF = (kwitansi: kwitansi) => {
  const html = `
    <html>
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet">
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
          }
          * {
            margin: 0;
            padding: 0;
          }
          .body {
            text-align: center;
          }
          .container {
            border: 4px solid black;
            padding:5px;
          }
          .container-2 {
            border: 2px solid black;
          }
          .title {
            text-align: center;
          }
          h1 {
            font-size: 50px;
            font-weight: extra-bold;
            font-family: 'Lilita One', cursive;
          }
          .title-details {
            font-size: 20px;
            font-style: italic;
            font-weight: bold;
          }
          .line {
            border-bottom: 2px solid black;
            padding: 2px 0;
            border-top: 2px solid black;
            margin-bottom: 7px;
          }
          .content {
            padding: 10px;
          }
          .content-title {
            font-size: 50px;
            font-weight: extra-bold;
            font-family: 'Lilita One', cursive;
            text-decoration: underline;
            text-decoration-thickness: 4px;
          }
          td {
            font-size: 20px;
            padding: 10 0px;
          }
          .separator {
            text-align: left;
          }
          .row-data {
            border-bottom : 2px solid black;
            width: 79%;
            font-weight: bold;
            font-style: italic;
          }
          .row-data-2 {
            border-bottom : 2px solid black;
            width: 70%;
          }
          .property {
            display: flex;
            justify-content: space-between;
          }
          .property span {
            padding: 0 10px;
          }
          .additional-content {
            display: flex;
            width: 100%;         
            justify-content: space-between; 
            gap: 20px;
          }

          .additional-content table {
            width: 100%
          }
          .total-date {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 5rem;
          }
          .total {
            font-size: 30px;
            font-weight: bold;
          }
          .total-box {
            border: 2px solid black;
            padding: 5px;
            margin: 0px 3px;
          }
          .buyer-seller {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 10rem;
          }
          .ttd {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5rem 8rem 2rem 8rem;
          }
          .btm-line {
            border-bottom: 2px solid black;
            width: 8rem;
          }
          .catatan {
            text-align: left;
            font-weight: bold;
            font-style: italic;
            font-size: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="container-2">
            <div class="title">
              <h1>JUAL BELI SEPEDA MOTOR BEKAS</h1>
              <p class="title-details">Jl. Pelita Jaya - Parit 9 Tembilahan</p>
              <p class="title-details">HP. 0812 6842 4910</p>
              <div class="line"/>
            </div>
            <div class="content-container">
              <h2 class="content-title">KWITANSI PENJUALAN</h2>
              <div class="content">
                <table>
                  <tr>
                    <td class="property">Telah terima dari<span>:</span></td>
                    <td class="row-data">${kwitansi?.diterima}</td>
                  </tr>
                  <tr>
                    <td class="property">Alamat<span>:</span></td>
                    <td class="row-data">${kwitansi?.alamat}</td>
                  </tr>
                  <tr>
                    <td class="property">No. HP<span>:</span></td>
                    <td class="row-data">${kwitansi?.noHp}</td>
                  </tr>
                  <tr>
                    <td class="property">Uang Sejumlah<span>:</span></td>
                    <td class="row-data">${new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 2,
                    }).format(kwitansi?.pembayaran)}</td>
                  </tr>
                  <tr>
                    <td class="property">Untuk Pembayaran<span>:</span></td>
                    <td class="row-data">1 Unit Sepeda Motor ${
                      kwitansi?.motor.model
                    }</td>
                  </tr>
                </table>
                
                <div class="additional-content">
                  <table class="first">
                    <tr>
                      <td class="property">Type<span>:</span></td>
                      <td class="row-data-2">Honda Beat</td>
                    </tr>
                    <tr>
                      <td class="property">No. Rangka<span>:</span></td>
                      <td class="row-data-2">${kwitansi?.motor.no_rangka}</td>
                    </tr>
                    <tr>
                      <td class="property">No. Mesin<span>:</span></td>
                      <td class="row-data-2">${kwitansi?.motor.no_mesin}</td>
                    </tr>
                  </table>
                  <table class="second">
                    <tr>
                      <td class="property">No. Polisi<span>:</span></td>
                      <td class="row-data-2">${kwitansi?.motor.no_mesin}</td>
                    </tr>
                    <tr>
                      <td class="property">Tahun<span>:</span></td>
                      <td class="row-data-2">${kwitansi?.motor.tahun}</td>
                    </tr>
                    <tr>
                      <td class="property">Warna<span>:</span></td>
                      <td class="row-data-2">${kwitansi?.motor.warna}</td>
                    </tr>
                  </table>

                  </div>
                <div class="total-date">
                  <p class="total">Rp.<span class="total-box">${kwitansi?.motor.harga_jual.toLocaleString(
                    "id-ID"
                  )}</span></p>
                  <p>Tembilahan, ${kwitansi?.tanggal
                    .toDate()
                    .toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}</p>
                </div>
                <div class="buyer-seller">
                  <p class="pembeli">Pembeli,</p>
                  <p>Penjual</p>
                </div>
                <div class="ttd">
                  <p class="btm-line"></p>
                  <p class="btm-line"></p>
                </div>
                <div>
                  <p class="catatan">Catatan : ${kwitansi?.keterangan ?? ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

    const pdfName = `${uri.slice(0, uri.lastIndexOf("/") + 1)}${
      kwitansi.invoiceId
    }_${new Date().getTime()}.pdf`;

    await FileSystem.moveAsync({
      from: uri,
      to: pdfName,
    });

    await shareAsync(pdfName);
  };

  return { generatePdf };
};
