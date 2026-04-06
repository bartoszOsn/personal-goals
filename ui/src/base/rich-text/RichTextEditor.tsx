import { useDebouncedCallback } from '@mantine/hooks';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Link, RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';
import './RichTextEditor.css';

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
			StarterKit.configure({ link: false }),
			Link,
			Placeholder.configure({ placeholder: props.placeholder ?? '' })
		],
		onUpdate: (props) => {
			onChange(props.editor.getHTML());
			onChangeThrottle(props.editor.getHTML());
		}
	})

	return (
		<MantineRichTextEditor editor={editor} variant='subtle' className='rich-text-editor'>
			<MantineRichTextEditor.Toolbar sticky stickyOffset="calc(2 * var(--mantine-spacing-xl))">
				<MantineRichTextEditor.ControlsGroup>
					<MantineRichTextEditor.Bold />
					<MantineRichTextEditor.Italic />
					<MantineRichTextEditor.Underline />
					<MantineRichTextEditor.Strikethrough />
					<MantineRichTextEditor.ClearFormatting />
					<MantineRichTextEditor.Code />
				</MantineRichTextEditor.ControlsGroup>

				<MantineRichTextEditor.ControlsGroup>
					<MantineRichTextEditor.H1 />
					<MantineRichTextEditor.H2 />
					<MantineRichTextEditor.H3 />
					<MantineRichTextEditor.H4 />
				</MantineRichTextEditor.ControlsGroup>

				<MantineRichTextEditor.ControlsGroup>
					<MantineRichTextEditor.Blockquote />
					<MantineRichTextEditor.Hr />
					<MantineRichTextEditor.BulletList />
					<MantineRichTextEditor.OrderedList />
				</MantineRichTextEditor.ControlsGroup>

				<MantineRichTextEditor.ControlsGroup>
					<MantineRichTextEditor.Link />
					<MantineRichTextEditor.Unlink />
				</MantineRichTextEditor.ControlsGroup>

				<MantineRichTextEditor.ControlsGroup>
					<MantineRichTextEditor.Undo />
					<MantineRichTextEditor.Redo />
				</MantineRichTextEditor.ControlsGroup>
			</MantineRichTextEditor.Toolbar>

			<MantineRichTextEditor.Content />
		</MantineRichTextEditor>
	);
}