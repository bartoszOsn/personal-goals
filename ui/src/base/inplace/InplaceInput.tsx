import { ForwardedRef, useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/primitive/components/ui/skeleton';
import { cn } from '@/primitive/lib/utils';
import { useMergedRefs } from '@/base/util/useMergedRefs';

export function InplaceInput({
	value,
	onSubmit,
	className,
	ref
}: {
	value: string;
	onSubmit?: (value: string) => Promise<void> | void;
	className?: string;
	ref?: ForwardedRef<HTMLParagraphElement>
}) {
	const internalRef = useRef<HTMLParagraphElement | null>(null);

	const mergedRef = useMergedRefs(internalRef, ref);
	const [state, setState] = useState<'display' | 'edit' | 'pending'>('display');

	useEffect(() => {
		if (state === 'edit') {
			if (!internalRef.current) return;
			internalRef.current.innerText = value;
			internalRef.current.focus();
			const range = document.createRange();
			const selection = window.getSelection();

			range.setStart(internalRef.current.childNodes[0], value.length);
			range.collapse(true);

			selection?.removeAllRanges();
			selection?.addRange(range);
			internalRef.current.scrollTo({ left: internalRef.current.offsetLeft });
		} else {
			internalRef.current?.scrollTo({ left: 0 });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	const submit = (newValue: string) => {
		if (internalRef.current) {
			internalRef.current.innerText = '';
		}
		setState('pending');
		Promise.resolve(onSubmit?.(newValue))
			.finally(() => setState('display'));
	}

	if (state === 'display') {
		return <p ref={mergedRef} className={cn(className, 'relative group/inplaceRoot')} role='button' onClick={() => setState('edit')}>
			<span className='block absolute -inset-x-2 -inset-y-0.5 transition-all duration-100 rounded-lg group-hover/inplaceRoot:bg-muted group-hover/inplaceRoot:text-foreground dark:group-hover/inplaceRoot:bg-muted/50' />
			<span className='z-1 relative'>{value}</span>
		</p>;
	}

	if (state === 'edit') {
		return <p ref={mergedRef}
				  className={cn(className, "outline-offset-4")}
				  style={{ textOverflow: 'unset' }}
				  contentEditable={'plaintext-only'}
				  onBlur={(e) => submit(e.currentTarget.innerText)}
				  onKeyDown={(e) => {
					  if (e.key === 'Enter') {
						  e.preventDefault();
						  submit(e.currentTarget.innerText);
					  }
					  if (e.key === 'Escape') {
						  e.preventDefault();
						  if (internalRef.current) {
							  internalRef.current.innerText = '';
						  }
						  setState('display');
					  }
				  }}
		></p>
	}

	if (state === 'pending') {
		return <p ref={mergedRef} className={cn(className, 'relative')}>
			<Skeleton className='absolute inset-0' />
			<span className='invisible'>{value}</span>
		</p>;
	}
}