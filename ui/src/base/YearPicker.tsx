import { ComponentProps, useState } from 'react';
import { Button } from '@/primitive/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/primitive/components/ui/popover.tsx';
import { Calendar, ChevronDown, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Pagination, PaginationContent, PaginationLink } from '@/primitive/components/ui/pagination';

export function YearPicker({
	value,
	onValueChange,
	...props
}: Omit<ComponentProps<typeof Button>, 'value' | 'onClick' | 'children'> & {
	value: number;
	onValueChange: (value: number) => void;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button {...props}>
					<Calendar /> {value} <ChevronDown />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Pick a year</PopoverTitle>
				</PopoverHeader>
				<YearPickerPopover value={value} onValueChange={onValueChange} />
			</PopoverContent>
		</Popover>
	)
}

function YearPickerPopover({ value, onValueChange }: { value: number, onValueChange: (value: number) => void }) {
	const [startYear, setStartYear] = useState<number>(() => Math.floor(value / 10) * 10);
	const endYear = startYear + 9;
	const years = Array.from({ length: 10 }, (_, i) => startYear + i);

	return (
		<div className='flex flex-col'>
			<Pagination>
				<PaginationContent>
					<PaginationLink onClick={() => setStartYear(startYear - 10)}>
						<ChevronLeftIcon />
					</PaginationLink>
					<div className='px-2 font-medium'>
						{startYear} - {endYear}
					</div>
					<PaginationLink onClick={() => setStartYear(startYear + 10)}>
						<ChevronRightIcon />
					</PaginationLink>
				</PaginationContent>
			</Pagination>
			<div className='w-full grid grid-cols-3 gap-1'>
				{years.map(year => (
					<Button variant={year === value ? 'secondary' : 'ghost'} key={year} onClick={() => onValueChange(year)}>
						{year}
					</Button>
				))}
			</div>
		</div>
	)
}