import { passiveSupport } from "passive-events-support/src/utils";

import dynamic from "next/dynamic";
import "quill/dist/quill.bubble.css"; // ou o estilo que você preferir
import "quill/dist/quill.snow.css";
import "@/components/richEditor/quill-custom.css";
import { useEffect, useMemo } from "react";

passiveSupport({ events: ["touchstart", "touchmove"] });

const QuillNoSSRWrapper = dynamic(() => import("react-quill-new"), {
	ssr: false,
	loading: () => <p>Carregando editor...</p>
});

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	readOnly: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
	value,
	onChange,
	readOnly
}) => {
	// Configuração dos módulos do Quill
	const modules = useMemo(
		() => ({
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				["bold", "italic", "underline", "strike"],
				[{ list: "ordered" }, { list: "bullet" }], // Isso está correto para o toolbar
				["link", "image"],
				["clean"]
			],
			clipboard: {
				matchVisual: false // Preserva formatação ao colar
			}
		}),
		[]
	);

	return (
		<QuillNoSSRWrapper
			theme="snow"
			readOnly={readOnly}
			value={value}
			onChange={onChange}
			modules={modules}
			className={`h-[45vh] ${readOnly ? "cursor-not-allowed opacity-50" : ""}`}
			placeholder="Digite o relato da sessão aqui..."
			formats={[
				"header",
				"bold",
				"italic",
				"underline",
				"strike",
				"list", // Remova 'bullet' daqui, pois 'list' já cobre ambos os tipos
				"link",
				"image"
			]}
		/>
	);
};

export default RichTextEditor;
