// Carrega PDF.js via CDN (Cloudflare Workers não suporta o pacote npm).
export function carregarPdfJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).pdfjsLib) return resolve();
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve();
    };
    script.onerror = () => reject(new Error("Falha ao carregar PDF.js"));
    document.head.appendChild(script);
  });
}

export async function extrairTextoPdf(file: File): Promise<string> {
  await carregarPdfJs();
  const pdfjsLib = (window as any).pdfjsLib;
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let texto = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    texto += content.items.map((item: any) => item.str).join(" ") + "\n";
  }
  return texto;
}
