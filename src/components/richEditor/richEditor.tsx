import dynamic from 'next/dynamic';
import 'quill/dist/quill.bubble.css'; 
import 'quill/dist/quill.snow.css'; 
import '@/components/richEditor/quill-custom.css'


interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Carregar dinamicamente para evitar problemas com SSR no Next.js
const QuillNoSSRWrapper = dynamic(() => import('react-quill'), { ssr: false });
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <QuillNoSSRWrapper
      theme="snow"
      value={value}
      placeholder='Text'
      onChange={onChange}
      className='h-[45vh]'
    />
  );
};

export default RichTextEditor;
