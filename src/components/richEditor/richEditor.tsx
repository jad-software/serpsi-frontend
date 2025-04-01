import dynamic from 'next/dynamic';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import '@/components/richEditor/quill-custom.css';
import { useMemo } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
}

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Carregando editor...</p>
});

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, readOnly }) => {
  // Configuração dos módulos do Quill
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false, // Preserva formatação ao colar
    }
  }), []);

  return (
    <QuillNoSSRWrapper
      theme="snow"
      readOnly={readOnly}
      value={value}
      onChange={onChange}
      modules={modules}
      className={`h-[45vh] ${readOnly? 'opacity-50 cursor-not-allowed' : ''}` }
      placeholder='Digite o relato da sessão aqui...'
      formats={[
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
      ]}
    />
  );
};

export default RichTextEditor;