import React, { cloneElement, ReactNode, useState } from 'react';
import { Box, Menu } from '@mantine/core';
import { useEventListener, useMergedRef, useWindowEvent } from '@mantine/hooks';

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
	};

	const targetRef = useEventListener('contextmenu', e => {
		if (!open) {
			change(true, e);
		} else {
			change(false);
		}
	});

	useWindowEvent('scroll', () => setOpen(false), { capture: true });

	const child = React.Children.only(children);
	if (!React.isValidElement<{ ref: (instance: never) => void }>(child)) {
		throw new Error('useContextMenu must be a valid DOM element');
	}

	const mergedRef = useMergedRef(
		targetRef,
		child.props.ref
	);

	if (disabled) {
		return children;
	}

	return (
		<>
			{cloneElement(child, { ref: mergedRef })}
			<Menu offset={0} position='bottom-start' opened={open} onClose={() => change(false)} clickOutsideEvents={['mousedown', 'touchstart', 'keydown', 'scroll']}
				  floatingStrategy="fixed">
				<Menu.Target>
					<Box w={1} h={1} style={{position: 'fixed', left: pos.x, top: pos.y, pointerEvents: 'none' }} />
				</Menu.Target>
				<Menu.Dropdown>
					{dropdown}
				</Menu.Dropdown>
			</Menu>
		</>
	);
}