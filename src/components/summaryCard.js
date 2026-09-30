export function summaryCard(label, value, tone = "") {
  return `<article class="summary-card ${tone}"><span>${label}</span><strong>${value}</strong></article>`;
}

export function sectionHeader(title, href, label = "See Details") {
  return `<div class="section-heading"><h2>${title}</h2>${href ? `<a class="text-link" href="${href}">${label}</a>` : ""}</div>`;
}

export function progressBar(percent, color) {
  const width = Math.min(Math.max(Number(percent) || 0, 0), 100);
  return `<div class="progress" aria-label="${width}% complete"><span style="width:${width}%;background:${color};"></span></div>`;
}
