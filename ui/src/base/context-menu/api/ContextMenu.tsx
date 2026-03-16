import { ReactNode, useState } from 'react';
import { Menu } from '@mantine/core';
import { useEventListener, useWindowEvent } from '@mantine/hooks';

export interface ContextMenuProps {
	children?: ReactNode;
	dropdown: ReactNode;
	onChange?: (open: boolean) => void;
	disabled?: boolean;
}

export function ContextMenu({ children, dropdown, onChange, disabled = false }: ContextMenuProps) {
	const [open, setOpen] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 });

	const change = (open: boolean, e?: PointerEvent) => {
		setOpen(open);
		onChange?.(open);

		if (open && e) {
			e.stopPropagation();
			e.preventDefault();
			setPos({ x: e.clientX + 8, y: e.clientY + 8 });
		}
	}

	const targetRef = useEventListener('contextmenu', e => {
		change(true, e);
	});

	useWindowEvent('scroll', () => setOpen(false), { capture: true});

	if (disabled) {
		return children;
	}

	return (
		<Menu offset={0} opened={open} onClose={() => change(false)} clickOutsideEvents={['mousedown', 'touchstart', 'keydown', 'scroll']} floatingStrategy='fixed' styles={{ dropdown: { position: 'fixed', left: pos.x, top: pos.y} }}>
			<Menu.Target ref={targetRef}>
				{children}
			</Menu.Target>
			<Menu.Dropdown>
				{dropdown}
			</Menu.Dropdown>
		</Menu>
	);
}