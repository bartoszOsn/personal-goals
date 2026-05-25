import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/primitive/components/ui/skeleton';
import { cn } from '@/primitive/lib/utils';

export function InplaceInput({
	value,
	onSubmit,
	className
}: {
	value: string;
	onSubmit?: (value: string) => Promise<void> | void;
	className?: string;
}) {
	const ref = useRef<HTMLParagraphElement | null>(null);
	const [state, setState] = useState<'display' | 'edit' | 'pending'>('display');

	useEffect(() => {
		if (state === 'edit') {
			if (!ref.current) return;
			ref.current.innerText = value;
			ref.current.focus();
			const range = document.createRange();
			const selection = window.getSelection();

			range.setStart(ref.current.childNodes[0], value.length);
			range.collapse(true);

			selection?.removeAllRanges();
			selection?.addRange(range);
			ref.current.scrollTo({ left: ref.current.offsetLeft });
		} else {
			ref.current?.scrollTo({ left: 0 });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	const submit = (newValue: string) => {
		if (ref.current) {
			ref.current.innerText = '';
		}
		setState('pending');
		Promise.resolve(onSubmit?.(newValue))
			.finally(() => setState('display'));
	}

	if (state === 'display') {
		return <p ref={ref} className={cn(className, 'relative group/inplaceRoot')} role='button' onClick={() => setState('edit')}>
			<span className='block absolute -inset-x-2 -inset-y-0.5 transition-all duration-100 rounded-lg group-hover/inplaceRoot:bg-muted group-hover/inplaceRoot:text-foreground dark:group-hover/inplaceRoot:bg-muted/50' />
			<span className='z-1 relative'>{value}</span>
		</p>;
	}

	if (state === 'edit') {
		return <p ref={ref}
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
						  if (ref.current) {
							  ref.current.innerText = '';
						  }
						  setState('display');
					  }
				  }}
		></p>
	}

	if (state === 'pending') {
		return <p className={cn(className, 'relative')}>
			<Skeleton className='absolute inset-0' />
			<span className='invisible'>{value}</span>
		</p>;
	}
}