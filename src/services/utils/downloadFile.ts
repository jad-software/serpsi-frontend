import { toast } from "sonner";

export const DownloadFile = async (image: string, title: string) => {
  const response = await fetch(image);
  if (response.status !== 200) {
    toast.error("Houve um problema ao baixar o Arquivo. Por favor, tente mais tarde.");
    return;
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = title;
  a.click();
};
