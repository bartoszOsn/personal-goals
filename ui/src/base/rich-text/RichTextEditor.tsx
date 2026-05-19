import { useDebouncedCallback } from '@mantine/hooks';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import './RichTextEditor.css';
import { RichTextEditorMenuBar } from '@/base/rich-text/RichTextEditorMenuBar';

export interface RichTextEditorProps {
	content: string;
	placeholder?: string;
	onChange?: (value: string) => void;
	onChangeThrottle?: (value: string) => void;
}

export function RichTextEditor(props: RichTextEditorProps) {
	const onChange = (text: string) => {
		props.onChange?.(text);
	}
	
	const onChangeThrottle = useDebouncedCallback(
		(value: string) => {
			props.onChangeThrottle?.(value);
		},
		1000
	);

	const editor = useEditor({
		content: props.content,
		shouldRerenderOnTransaction: true,
		extensions: [
			StarterKit.configure(),
			Placeholder.configure({ placeholder: props.placeholder ?? '' })
		],
		onUpdate: (props) => {
			onChange(props.editor.getHTML());
			onChangeThrottle(props.editor.getHTML());
		}
	})

	return (
		<div className='rich-text-editor relative flex flex-col gap-2'>
			<RichTextEditorMenuBar editor={editor} />
			<EditorContent editor={editor} className='rich-text-editor__content' />
		</div>
	)
}