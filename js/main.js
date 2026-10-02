import { renderState } from "./modules/ui.js";

document.querySelectorAll("[data-estado]").forEach((btn) => {
    btn.addEventListener("click", () => renderState(btn.dataset.estado));
});