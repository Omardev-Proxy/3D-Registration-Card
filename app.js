const cardInner = document.getElementById("cardInner");
const success = document.getElementById("success");

const form = document.getElementById("form");
const finishBtn = document.getElementById("finishBtn");
const continueBtn = document.getElementById("continueBtn");
const restartBtn = document.getElementById("restartBtn");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const dob = document.getElementById("dob");
const address = document.getElementById("address");
const phone = document.getElementById("phone");
const email = document.getElementById("email");

const vFirst = document.getElementById("vFirst");
const vLast = document.getElementById("vLast");
const vDob = document.getElementById("vDob");
const vAddress = document.getElementById("vAddress");
const vPhone = document.getElementById("vPhone");
const vEmail = document.getElementById("vEmail");

const slotFirst = document.getElementById("slotFirst");
const slotLast = document.getElementById("slotLast");
const slotDob = document.getElementById("slotDob");
const slotAddress = document.getElementById("slotAddress");
const slotPhone = document.getElementById("slotPhone");
const slotEmail = document.getElementById("slotEmail");

const focusFront = document.getElementById("focusFront");
const focusBack = document.getElementById("focusBack");

const errFirstName = document.getElementById("errFirstName");
const errLastName = document.getElementById("errLastName");
const errDob = document.getElementById("errDob");
const errAddress = document.getElementById("errAddress");
const errPhone = document.getElementById("errPhone");
const errEmail = document.getElementById("errEmail");

const pillName = document.getElementById("pillName");
const pillEmail = document.getElementById("pillEmail");
const pillPhone = document.getElementById("pillPhone");

const toSafe = (s) => (s || "").trim();

function fmtDate(iso) {
  if (!iso) return "DD / MM / YYYY";
  const [y, m, d] = iso.split("-");
  return `${d} / ${m} / ${y}`;
}

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function setFieldState(inputEl, errEl, message) {
  const field = inputEl.closest(".field");
  field.classList.remove("is-invalid", "is-valid");
  errEl.textContent = message || "";
  if (message) field.classList.add("is-invalid");
  else field.classList.add("is-valid");
}

function validateName(value) {
  const v = toSafe(value);
  if (!v) return "This field is required.";
  if (v.length < 2) return "Too short (min 2 characters).";
  if (v.length > 30) return "Too long (max 30 characters).";
  if (!/^[a-zA-Z\s'-]+$/.test(v)) return "Only letters and spaces are allowed.";
  return "";
}

function validateDob(value) {
  const v = toSafe(value);
  if (!v) return "Date of birth is required.";
  if (v > todayISO()) return "Date cannot be in the future.";

  const now = new Date();
  const birth = new Date(v);
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  if (age < 13) return "You must be at least 13 years old.";
  return "";
}

function validateAddress(value) {
  const v = toSafe(value);
  if (!v) return "Address is required.";
  if (v.length < 5) return "Address is too short.";
  return "";
}

function validatePhone(value) {
  const v = toSafe(value);
  if (!v) return "Phone number is required.";
  const cleaned = v.replace(/\s+/g, "");
  if (!/^\+?[0-9]{9,15}$/.test(cleaned)) return "Use 9–15 digits (optional +).";
  return "";
}

function validateEmail(value) {
  const v = toSafe(value);
  if (!v) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Invalid email format.";
  return "";
}

let rafId = null;

function highlight(slotEl, side) {
  const focusEl = side === "back" ? focusBack : focusFront;
  cancelAnimationFrame(rafId);

  rafId = requestAnimationFrame(() => {
    const sideEl = document.getElementById(side === "back" ? "back" : "front");
    const sideRect = sideEl.getBoundingClientRect();
    const r = slotEl.getBoundingClientRect();

    let x = r.left - sideRect.left;
    let y = r.top - sideRect.top;
    const w = r.width;
    const h = r.height;

    const pad = 8;
    x = Math.max(pad, Math.min(x, sideRect.width - w - pad));
    y = Math.max(pad, Math.min(y, sideRect.height - h - pad));

    focusEl.style.width = w + "px";
    focusEl.style.height = h + "px";
    focusEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    focusEl.classList.add("active");
  });
}

function clearHighlight() {
  focusFront.classList.remove("active");
  focusBack.classList.remove("active");
}

function flip(side) {
  if (side === "back") cardInner.classList.add("is-flipped");
  else cardInner.classList.remove("is-flipped");
}

function bind(inputEl, slotEl, side, onInput) {
  inputEl.addEventListener("focus", () => {
    flip(side);
    highlight(slotEl, side);
  });

  inputEl.addEventListener("blur", () => setTimeout(clearHighlight, 120));
  inputEl.addEventListener("input", onInput);
}

bind(firstName, slotFirst, "front", () => {
  const v = toSafe(firstName.value);
  vFirst.textContent = v ? v.toUpperCase() : "—";
  setFieldState(firstName, errFirstName, validateName(firstName.value));
});

bind(lastName, slotLast, "front", () => {
  const v = toSafe(lastName.value);
  vLast.textContent = v ? v.toUpperCase() : "—";
  setFieldState(lastName, errLastName, validateName(lastName.value));
});

bind(dob, slotDob, "front", () => {
  vDob.textContent = fmtDate(dob.value);
  setFieldState(dob, errDob, validateDob(dob.value));
});

bind(address, slotAddress, "back", () => {
  vAddress.textContent = toSafe(address.value) || "—";
  setFieldState(address, errAddress, validateAddress(address.value));
});

bind(phone, slotPhone, "back", () => {
  vPhone.textContent = toSafe(phone.value) || "—";
  setFieldState(phone, errPhone, validatePhone(phone.value));
});

bind(email, slotEmail, "back", () => {
  const v = toSafe(email.value).toLowerCase();
  email.value = v;
  vEmail.textContent = v || "—";
  setFieldState(email, errEmail, validateEmail(email.value));
});

function validateAll() {
  const e1 = validateName(firstName.value);
  const e2 = validateName(lastName.value);
  const e3 = validateDob(dob.value);
  const e4 = validateAddress(address.value);
  const e5 = validatePhone(phone.value);
  const e6 = validateEmail(email.value);

  setFieldState(firstName, errFirstName, e1);
  setFieldState(lastName, errLastName, e2);
  setFieldState(dob, errDob, e3);
  setFieldState(address, errAddress, e4);
  setFieldState(phone, errPhone, e5);
  setFieldState(email, errEmail, e6);

  const firstInvalid = [
    [firstName, e1, slotFirst, "front"],
    [lastName, e2, slotLast, "front"],
    [dob, e3, slotDob, "front"],
    [address, e4, slotAddress, "back"],
    [phone, e5, slotPhone, "back"],
    [email, e6, slotEmail, "back"],
  ].find((x) => x[1]);

  if (firstInvalid) {
    const [el, , slot, side] = firstInvalid;
    flip(side);
    highlight(slot, side);
    el.focus();
    return false;
  }
  return true;
}

function showSuccess() {
  const fn = toSafe(firstName.value);
  const ln = toSafe(lastName.value);

  pillName.textContent = `${fn} ${ln}`.trim() || "—";
  pillEmail.textContent = toSafe(email.value).toLowerCase() || "—";
  pillPhone.textContent = toSafe(phone.value) || "—";

  flip("back");
  success.classList.add("show");
}

function resetAll() {
  form.reset();

  vFirst.textContent = "—";
  vLast.textContent = "—";
  vDob.textContent = "DD / MM / YYYY";
  vAddress.textContent = "—";
  vPhone.textContent = "—";
  vEmail.textContent = "—";

  document
    .querySelectorAll(".field")
    .forEach((f) => f.classList.remove("is-invalid", "is-valid"));

  [errFirstName, errLastName, errDob, errAddress, errPhone, errEmail].forEach(
    (e) => (e.textContent = "")
  );

  clearHighlight();
  flip("front");
  success.classList.remove("show");

  requestAnimationFrame(() => firstName.focus());
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateAll()) return;
  showSuccess();
});

restartBtn.addEventListener("click", resetAll);

continueBtn.addEventListener("click", () => {
  alert("Proceed to the next step or dashboard in a real application.");
});

requestAnimationFrame(() => firstName.focus());
