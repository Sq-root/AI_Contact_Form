export async function downloadImage(url: string, filename: string) {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank");
  }
}
