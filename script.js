/* NOVA BOOST — order calculator and WhatsApp checkout */
"use strict";

/*
  UBAH PENGATURAN DI BAWAH INI:
  - brand: nama website kamu
  - whatsappAdmin: nomor admin format internasional, tanpa +, spasi, atau strip
  - prices: harga estimasi per unit dalam Rupiah
*/
const CONFIG = {
  brand: "NOVA BOOST",
  whatsappAdmin: "6287790193050",
  prices: {
    rank: 15000,   // harga per bintang
    wr: 10000,     // harga per match
    custom: 0      // custom request dikonfirmasi admin
  },
  currency: "IDR",
  locale: "id-ID"
};

const $ = (id) => document.getElementById(id);
const serviceLabels = {
  rank: "Rank Boost",
  wr: "Win Rate Boost",
  custom: "Custom Request"
};

let pendingOrder = null;

function formatRupiah(value) {
  return new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
    maximumFractionDigits: 0
  }).format(value);
}

function getFormValues() {
  const type = $("serviceType").value;
  const rawQuantity = Number.parseInt($("quantity").value, 10);
  const quantity = Number.isFinite(rawQuantity) ? Math.min(100, Math.max(1, rawQuantity)) : 1;
  const unitPrice = CONFIG.prices[type] ?? 0;

  return {
    customer: $("customerName").value.trim(),
    serviceType: type,
    service: serviceLabels[type],
    currentRank: $("currentRank").value,
    target: $("targetRank").value,
    quantity,
    contact: $("contact").value.trim(),
    notes: $("notes").value.trim(),
    estimatedTotal: unitPrice * quantity
  };
}

function updateSummary() {
  const order = getFormValues();
  $("summaryService").textContent = order.service;
  $("summaryCurrent").textContent = order.currentRank;
  $("summaryTarget").textContent = order.target;
  $("summaryQuantity").textContent = order.quantity + (order.serviceType === "wr" ? " match" : order.serviceType === "rank" ? " unit" : "");
  $("summaryPrice").textContent = order.serviceType === "custom"
    ? "KONFIRMASI ADMIN"
    : formatRupiah(order.estimatedTotal);

  $("quantityLabel").innerHTML = order.serviceType === "wr"
    ? 'Jumlah match <em>*</em>'
    : order.serviceType === "custom"
      ? 'Jumlah (opsional)'
      : 'Jumlah bintang <em>*</em>';
}

function addReviewRow(container, label, value) {
  const row = document.createElement("div");
  row.className = "review-row";
  const left = document.createElement("span");
  const right = document.createElement("b");
  left.textContent = label;
  right.textContent = value || "-";
  row.append(left, right);
  container.appendChild(row);
}

function openReview(order) {
  const details = $("reviewDetails");
  details.replaceChildren();

  addReviewRow(details, "Nama / nickname", order.customer);
  addReviewRow(details, "Layanan", order.service);
  addReviewRow(details, "Rank saat ini", order.currentRank);
  addReviewRow(details, "Target", order.target);
  addReviewRow(details, "Jumlah", String(order.quantity));
  addReviewRow(details, "Kontak pelanggan", order.contact || "-");
  addReviewRow(details, "Catatan", order.notes || "-");
  addReviewRow(details, "Estimasi harga", order.serviceType === "custom" ? "Dikonfirmasi admin" : formatRupiah(order.estimatedTotal));

  const dialog = $("reviewDialog");
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeReview() {
  const dialog = $("reviewDialog");
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function buildWhatsAppMessage(order) {
  const price = order.serviceType === "custom"
    ? "Dikonfirmasi admin"
    : formatRupiah(order.estimatedTotal);

  return [
    `Halo admin ${CONFIG.brand}, saya ingin konfirmasi pesanan:`,
    "",
    `Nama / nickname: ${order.customer}`,
    `Layanan: ${order.service}`,
    `Rank saat ini: ${order.currentRank}`,
    `Target: ${order.target}`,
    `Jumlah: ${order.quantity}`,
    `Kontak saya: ${order.contact || "-"}`,
    `Estimasi harga: ${price}`,
    `Catatan: ${order.notes || "-"}`,
    "",
    "Mohon konfirmasi harga final, ketersediaan, dan estimasi pengerjaan. Terima kasih."
  ].join("\n");
}

function sendToWhatsApp() {
  if (!pendingOrder) return;

  const phone = String(CONFIG.whatsappAdmin).replace(/\D/g, "");
  if (!phone) {
    alert("Nomor WhatsApp admin belum diatur. Silakan periksa CONFIG di script.js.");
    return;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage(pendingOrder))}`;
  window.open(url, "_blank", "noopener,noreferrer");
  closeReview();
}

function chooseService(type) {
  if (!serviceLabels[type]) return;
  $("serviceType").value = type;
  updateSummary();
  $("order").scrollIntoView({ behavior: "smooth" });
}

function initMenu() {
  const toggle = $("menuToggle");
  const nav = $("mainNav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function init() {
  $("year").textContent = new Date().getFullYear();

  ["serviceType", "currentRank", "targetRank", "quantity"].forEach((id) => {
    $(id).addEventListener("input", updateSummary);
    $(id).addEventListener("change", updateSummary);
  });

  $("orderForm").addEventListener("submit", (event) => {
    event.preventDefault();

    if (!$("orderForm").reportValidity()) return;

    pendingOrder = getFormValues();
    if (!pendingOrder.customer) {
      $("customerName").focus();
      return;
    }
    openReview(pendingOrder);
  });

  document.querySelectorAll(".choose-service").forEach((button) => {
    button.addEventListener("click", () => chooseService(button.dataset.service));
  });

  $("closeDialog").addEventListener("click", closeReview);
  $("editOrder").addEventListener("click", closeReview);
  $("sendWhatsApp").addEventListener("click", sendToWhatsApp);

  $("reviewDialog").addEventListener("click", (event) => {
    if (event.target === $("reviewDialog")) closeReview();
  });

  initMenu();
  updateSummary();
}

document.addEventListener("DOMContentLoaded", init);
