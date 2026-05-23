import { RefObject, useEffect } from 'react';

export function useClickOutside(
	el: RefObject<HTMLElement | null | undefined>,
	callback: () => void,
	options?: { withoutInteractiveElements: boolean }
) {
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (!el.current) {
				return;
			}
			
			if (el.current.contains(e.target as Node)) return;
			if (options?.withoutInteractiveElements && isInteractiveElement(e.target as HTMLElement)) return;
			callback();
		};
		document.addEventListener("mousedown", handler);
		return () => {
			document.removeEventListener("mousedown", handler);
		}
	}, [callback, el, options?.withoutInteractiveElements]);
}

function isInteractiveElement(element: HTMLElement) {
	const { nodeName } = element;

	if (
		[
			'BUTTON',
			'DETAILS',
			'EMBED',
			'IFRAME',
			'KEYGEN',
			'LABEL',
			'SELECT',
			'TEXTAREA',
			'A'
		].includes(nodeName)
	) {
		return true;
	}

	if (element instanceof HTMLInputElement && !isInputHidden(element)) {
		return true;
	}

	if (
		['AUDIO', 'VIDEO'].includes(nodeName) &&
		element.hasAttribute('controls')
	) {
		return true;
	}

	if (
		['IMG', 'OBJECT'].includes(nodeName) &&
		element.hasAttribute('usemap')
	) {
		return true;
	}

	if (element.hasAttribute('tabindex') && element.tabIndex > -1) {
		return true;
	}

	if(element.parentElement) {
		return isInteractiveElement(element.parentElement);
	}

	return false;
}

const isInputHidden = (input: HTMLInputElement) => input.type === 'hidden';