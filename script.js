const kuotaMaksimal = 50;
let jumlahPeserta = 0;

const form = document.getElementById("form");
const pesan = document.getElementById("pesan");
const jumlah = document.getElementById("jumlah");
const list = document.getElementById("list");
const resetBtn = document.getElementById("reset");

const dataPeserta = JSON.parse(localStorage.getItem("dataPeserta")) || [];
jumlahPeserta = dataPeserta.length;
jumlah.textContent = jumlahPeserta;

function renderList() {
  list.innerHTML = "";
  dataPeserta.forEach((p, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      ${p.nama} • ${p.kategori}
      <button class="hapus" data-index="${index}">✖</button>
    `;
    list.appendChild(item);
  });
}

renderList();

function showMessage(text, type = "error") {
  pesan.textContent = text;
  pesan.style.opacity = "1";
  pesan.style.transition = "opacity 0.3s ease";

  pesan.style.color =
    type === "success" ? "#4CAF50" :
    type === "warning" ? "#d4af37" :
    "#ff4d4d";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const hp = document.getElementById("hp").value.trim();
  const kategori = document.getElementById("kategori").value;

  if (!nama || !email || !hp || !kategori) {
    showMessage("Semua input wajib diisi");
    return;
  }

  if (!email.includes("@")) {
    showMessage("Format email tidak valid");
    return;
  }

  if (!/^\d+$/.test(hp)) {
    showMessage("Nomor HP hanya boleh angka");
    return;
  }

  const duplikat = dataPeserta.some(
    p => p.email === email || p.hp === hp
  );

  if (duplikat) {
    showMessage("Email atau Nomor HP sudah terdaftar");
    return;
  }

  if (jumlahPeserta >= kuotaMaksimal) {
    showMessage("Pendaftaran ditutup, kuota sudah penuh", "warning");
    return;
  }

  dataPeserta.push({ nama, email, hp, kategori });
  localStorage.setItem("dataPeserta", JSON.stringify(dataPeserta));

  jumlahPeserta = dataPeserta.length;
  jumlah.textContent = jumlahPeserta;

  renderList();
  showMessage("Pendaftaran berhasil 🎉", "success");
  form.reset();
});

list.addEventListener("click", function (e) {
  if (e.target.classList.contains("hapus")) {
    const index = e.target.dataset.index;
    dataPeserta.splice(index, 1);
    localStorage.setItem("dataPeserta", JSON.stringify(dataPeserta));
    jumlahPeserta = dataPeserta.length;
    jumlah.textContent = jumlahPeserta;
    renderList();
    showMessage("Peserta dihapus", "warning");
  }
});

resetBtn.addEventListener("click", function () {
  if (confirm("Yakin ingin menghapus semua data?")) {
    localStorage.removeItem("dataPeserta");
    dataPeserta.length = 0;
    jumlahPeserta = 0;
    jumlah.textContent = "0";
    list.innerHTML = "";
    showMessage("Semua data berhasil direset", "warning");
  }
});
