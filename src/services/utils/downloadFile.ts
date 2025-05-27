import { saveAs } from "file-saver"
import { toast } from "sonner";
import { getCookies } from "../profileService";

export const DownloadFile = async (mdUrl: string, title: string) => {
  try {
    let blob: Blob;

    if (mdUrl.endsWith(".pdf")) {
      const response = await fetch(mdUrl);

      if (!response.ok) throw new Error("Erro ao buscar PDF direto");
      blob = await response.blob();
    } else {

      const toastId = toast.loading("Carregando...");
      const jwt = await getCookies();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/generate-pdf`, {
        method: "POST",
        headers: {
          Authorization: jwt,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mdUrl }),
      });

      if (!response.ok) {
        toast.dismiss(toastId);
        toast.error("Houve um problema ao baixar o arquivo.");
        return;
      }
      toast.dismiss(toastId);
      blob = await response.blob();
    }

    const finalName = title.endsWith(".pdf") ? title : `${title}.pdf`;
    saveAs(blob, finalName);
  } catch (err) {
    toast.error("Erro ao gerar o PDF");
    console.error(err);
  }
};
