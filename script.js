/* ===== EDIT YOUR BUSINESS DETAILS HERE ===== */
const BUSINESS = {
  mobile: "+91 98503 93236",
  whatsapp: "+91 72195 87080",
  email: "omprakashharke17@gmail.com",
  address: "Near Bharat Petrol Pump, Anna Mod, Khaparkheda, Tal. Saoner, Dist. Nagpur"
};
/* ============================================ */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const digits = v => v.replace(/\D/g, "");

// Fill contact details
$("#mobileText").textContent = BUSINESS.mobile;
$("#waText").textContent = BUSINESS.whatsapp;
$("#mailText").textContent = BUSINESS.email;
$("#addrText").textContent = BUSINESS.address;
$("#callBtn").href = "tel:+" + digits(BUSINESS.mobile);
const waBase = "https://wa.me/" + digits(BUSINESS.whatsapp);
$("#waBtn").href = waBase;
$("#mailBtn").href = "mailto:" + BUSINESS.email;
$("#waText2").textContent = BUSINESS.whatsapp;
$("#waFloat").href = waBase;
$("#mbCall").href = "tel:+" + digits(BUSINESS.mobile);
$("#mbWa").href = waBase;
$("#yr").textContent = new Date().getFullYear();

// Loader
window.addEventListener("load", () => {
  setTimeout(() => { $("#loader").classList.add("done"); document.body.classList.add("ready"); }, 700);
});

// Nav: solid on scroll, mobile menu, active link
const nav = $("#nav"), burger = $("#burger"), menu = $("#menu"), toTop = $("#toTop");
const closeMenu = () => { document.body.classList.remove("menu-open"); menu.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.classList.toggle("menu-open", open);
});
$$("#menu a").forEach(a => a.addEventListener("click", closeMenu));

const heroBg = $("[data-parallax]");
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("solid", y > 60);
  toTop.classList.toggle("show", y > 600);
  if (heroBg && y < innerHeight && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    heroBg.style.transform = `translate3d(0,${y * 0.3}px,0)`;
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

const links = $$("#menu a");
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("section[id]").forEach(s => secObs.observe(s));

// Scroll reveal
const revObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); revObs.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 0.1 + "s"; revObs.observe(el); });

// Animated counters
const cntObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, target = +el.dataset.target || 0, suffix = el.dataset.suffix || "";
  const start = performance.now(), dur = 1800;
  (function tick(t) {
    const p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
  cntObs.unobserve(el);
}), { threshold: 0.6 });
$$(".count").forEach(c => cntObs.observe(c));

// Quote form validation
const form = $("#quote"), msg = $("#formMsg");
const rules = {
  name: v => v.trim().length >= 2 || "Enter your name.",
  phone: v => /^(\+?91)?[6-9]\d{9}$/.test(digits(v).replace(/^0/, "")) || "Enter a valid 10-digit Indian mobile number.",
  email: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
  from: () => true,
  to: v => v.trim().length >= 2 || "Enter the delivery location.",
  load: v => !!v || "Select the material."
};
function check(field) {
  const rule = rules[field.name]; if (!rule) return true;
  const res = rule(field.value), ok = res === true;
  field.classList.toggle("bad", !ok);
  const note = field.parentElement.querySelector("em");
  if (note) note.textContent = ok ? "" : res;
  return ok;
}
const sel = $("select[name=load]");
function pick(m) { sel.value = m; check(sel); $$(".chips button").forEach(b => b.classList.toggle("on", b.dataset.m === m)); }
$$(".chips button").forEach(b => b.addEventListener("click", () => pick(b.dataset.m)));
sel.addEventListener("change", () => pick(sel.value));
$$("#materials .card").forEach(card => {
  const t = $("h3", card).textContent, m = t.startsWith("All Types") ? "Other Material" : t;
  card.insertAdjacentHTML("beforeend", '<span class="bk">Book now</span>');
  card.style.cursor = "pointer";
  card.addEventListener("click", () => openBook(m));
});
$$("input,select", form).forEach(f => f.addEventListener("blur", () => check(f)));
form.addEventListener("submit", e => {
  e.preventDefault();
  const ok = $$("input,select", form).map(check).every(Boolean);
  if (!ok) { msg.textContent = "Please fix the highlighted fields."; return; }
  const d = Object.fromEntries(new FormData(form));
  const text = `Material booking – Ganeshay Transport\nMaterial: ${d.load}\nQuantity: ${d.qty || "-"}\nRequired date: ${d.date || "-"}\nName: ${d.name}\nMobile: ${d.phone}\nEmail: ${d.email || "-"}\nPickup: ${d.from || "-"}\nDelivery: ${d.to}\nDetails: ${d.msg || "-"}`;
  msg.textContent = "Thank you! Opening WhatsApp to send your request…";
  window.open(waBase + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  form.reset(); $$(".chips button").forEach(b => b.classList.remove("on"));
  if (modal.classList.contains("open")) setTimeout(closeBook, 2500);
});

// Booking modal: the same form moves into a popup and back
const modal = $("#bookModal"), modalBody = $("#modalBody"), formHome = form.parentElement, formNext = form.nextElementSibling;
function openBook(m) {
  if (m) pick(m);
  form.classList.add("in"); form.style.transitionDelay = "0s";
  modalBody.appendChild(form);
  modal.classList.add("open"); document.body.style.overflow = "hidden";
  setTimeout(() => $("input[name=name]", form).focus(), 60);
}
function closeBook() {
  modal.classList.remove("open"); document.body.style.overflow = "";
  formHome.insertBefore(form, formNext);
}
$(".modal-x").addEventListener("click", closeBook);
modal.addEventListener("click", e => { if (e.target === modal) closeBook(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeBook(); });
document.addEventListener("click", e => { if (menu.classList.contains("open") && !e.target.closest("#nav")) closeMenu(); });
$$("[data-book]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openBook(); }));
