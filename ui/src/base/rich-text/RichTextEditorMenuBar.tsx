import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { richTextEditorMenuBarStateSelector } from '@/base/rich-text/richTextEditorMenuBarStateSelector.ts';
import { ButtonGroup } from '@/primitive/components/ui/button-group';
import {
	BoldIcon,
	CodeIcon,
	CornerDownLeftIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	ItalicIcon,
	ListIcon,
	ListOrderedIcon,
	LucideProps,
	MinusIcon,
	QuoteIcon,
	RedoIcon,
	RemoveFormattingIcon,
	SquareCodeIcon,
	StrikethroughIcon,
	TypeIcon,
	UndoIcon
} from 'lucide-react';
import { Toggle } from '@/primitive/components/ui/toggle';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitive/components/ui/tooltip';

export const RichTextEditorMenuBar = ({ editor }: { editor: Editor }) => {
	const editorState = useEditorState({
		editor,
		selector: richTextEditorMenuBarStateSelector,
	})

	if (!editor) {
		return null
	}

	return (
		<ButtonGroup className='flex-wrap sticky top-0 bg-background p-2 z-1'>
			{
				groups.map((group, index) => (
					<ButtonGroup key={index}>
						{
							group.items.map(item => (
								<Tooltip>
									<TooltipTrigger asChild>
										<Toggle variant='outline' onClick={() => item.onClick(editor)} pressed={item.isPressed(editorState)} disabled={item.isDisabled(editorState)}>
											<item.icon />
										</Toggle>
									</TooltipTrigger>
									<TooltipContent>{item.tooltip}</TooltipContent>
								</Tooltip>
							))
						}
					</ButtonGroup>
				))
			}
		</ButtonGroup>
	)
}

interface Group {
	items: Item[];
}

type EditorState = ReturnType<typeof richTextEditorMenuBarStateSelector>;

interface Item {
	tooltip: string;
	icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
	isPressed: (editorState: EditorState) => boolean;
	isDisabled: (editorState: EditorState) => boolean;
	onClick: (editor: Editor) => void;
}

const groups: Group[] = [
	{
		items: [
			{
				tooltip: 'Bold',
				icon: BoldIcon,
				onClick: (editor) => editor.chain().focus().toggleBold().run(),
				isDisabled: (editorState) => !editorState.canBold,
				isPressed: (editorState) => editorState.isBold,
			},
			{
				tooltip: 'Italic',
				icon: ItalicIcon,
				onClick: (editor) => editor.chain().focus().toggleItalic().run(),
				isDisabled: (editorState) => !editorState.canItalic,
				isPressed: (editorState) => editorState.isItalic,
			},
			{
				tooltip: 'Strike',
				icon: StrikethroughIcon,
				onClick: (editor) => editor.chain().focus().toggleStrike().run(),
				isDisabled: (editorState) => !editorState.canStrike,
				isPressed: (editorState) => editorState.isStrike,
			},
			{
				tooltip: 'Code',
				icon: CodeIcon,
				onClick: (editor) => editor.chain().focus().toggleCode().run(),
				isDisabled: (editorState) => !editorState.canCode,
				isPressed: (editorState) => editorState.isCode,
			}
		]
	},
	{
		items: [
			{
				tooltip: 'Clear marks',
				icon: RemoveFormattingIcon,
				onClick: (editor) => editor.chain().focus().unsetAllMarks().run(),
				isDisabled: (editorState) => !editorState.canClearMarks,
				isPressed: () => false,
			},
			{
				tooltip: 'Clear nodes',
				icon: RemoveFormattingIcon,
				onClick: (editor) => editor.chain().focus().clearNodes().run(),
				isDisabled: () => false,
				isPressed: () => false,
			}
		]
	},
	{
		items: [
			{
				tooltip: 'Paragraph',
				icon: TypeIcon,
				onClick: (editor) => editor.chain().focus().setParagraph().run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isParagraph,
			},
			{
				tooltip: 'Heading 1',
				icon: Heading1Icon,
				onClick: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isHeading1,
			},
			{
				tooltip: 'Heading 2',
				icon: Heading2Icon,
				onClick: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isHeading2,
			},
			{
				tooltip: 'Heading 3',
				icon: Heading3Icon,
				onClick: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isHeading3,
			},
			{
				tooltip: 'Heading 4',
				icon: Heading4Icon,
				onClick: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isHeading4,
			},
			{
				tooltip: 'Heading 5',
				icon: Heading5Icon,
				onClick: (editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isHeading5,
			},
			{
				tooltip: 'Heading 6',
				icon: Heading6Icon,
				onClick: (editor) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isHeading6,
			}
		]
	},
	{
		items: [
			{
				tooltip: 'Bullet list',
				icon: ListIcon,
				onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isBulletList,
			},
			{
				tooltip: 'Ordered list',
				icon: ListOrderedIcon,
				onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isOrderedList,
			}
		]
	},
	{
		items: [
			{
				tooltip: 'Code block',
				icon: SquareCodeIcon,
				onClick: (editor) => editor.chain().focus().toggleCodeBlock().run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isCodeBlock,
			},
			{
				tooltip: 'Blockquote',
				icon: QuoteIcon,
				onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
				isDisabled: () => false,
				isPressed: (editorState) => editorState.isBlockquote,
			}
		]
	},
	{
		items: [
			{
				tooltip: 'Horizontal rule',
				icon: MinusIcon,
				onClick: (editor) => editor.chain().focus().setHorizontalRule().run(),
				isDisabled: () => false,
				isPressed: () => false,
			},
			{
				tooltip: 'Hard break',
				icon: CornerDownLeftIcon,
				onClick: (editor) => editor.chain().focus().setHardBreak().run(),
				isDisabled: () => false,
				isPressed: () => false,
			}
		]
	},
	{
		items: [
			{
				tooltip: 'Undo',
				icon: UndoIcon,
				onClick: (editor) => editor.chain().focus().undo().run(),
				isDisabled: () => false,
				isPressed: (editorState) => !editorState.canUndo,
			},
			{
				tooltip: 'Redo',
				icon: RedoIcon,
				onClick: (editor) => editor.chain().focus().redo().run(),
				isDisabled: () => false,
				isPressed: (editorState) => !editorState.canRedo,
			}
		]
	}
]