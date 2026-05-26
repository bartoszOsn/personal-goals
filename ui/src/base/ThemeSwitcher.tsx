import { ComponentProps, ReactNode, useEffect, useState } from 'react';
import { ComputerIcon, LucideIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/primitive/components/ui/select.tsx';
import { Icon } from '@/base/Icon.tsx';

export function ThemeSwitcher({ children }: { children: ReactNode }) {
	const [scheme, setScheme] = useColorScheme();
	const options: Scheme[] = [Scheme.light, Scheme.dark, Scheme.system];

	return (
		<Select value={scheme} onValueChange={(newScheme) => setScheme(newScheme as Scheme)}>
			<SelectTrigger>
				{children}
			</SelectTrigger>
			<SelectContent position='popper'>
				<SelectGroup>
					{
						options.map((option) => (
							<SelectItem key={option} value={option}>
								<Icon Icon={schemeToIcon[option]} /> {schemeToLabel[option]
							}
							</SelectItem>
						))
					}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

export function ThemeIcon(props: ComponentProps<LucideIcon>) {
	const [scheme] = useColorScheme();
	const Icon = schemeToIcon[scheme];

	return <Icon {...props} />
}

enum Scheme {
	light = 'light',
	dark = 'dark',
	system = 'light dark'
}

const schemeToIcon: Record<Scheme, LucideIcon> = {
	[Scheme.light]: SunIcon,
	[Scheme.dark]: MoonIcon,
	[Scheme.system]: ComputerIcon,
}

const schemeToLabel: Record<Scheme, string> = {
	[Scheme.light]: 'Light',
	[Scheme.dark]: 'Dark',
	[Scheme.system]: 'System',
}

const schemeLSKey = 'theme-scheme';

function useColorSchemeMetaElement() {
	const [element] = useState(() => {
		const element = document.querySelector('meta[name="color-scheme"]');

		if (element) {
			return element;
		}

		const newElement = document.createElement('meta');
		newElement.setAttribute('name', 'color-scheme');
		newElement.setAttribute('content', Scheme.system);

		document.head.appendChild(newElement);

		return newElement;
	});

	return element;
}

function useColorScheme() {
	const meta = useColorSchemeMetaElement();

	const [scheme, setScheme] = useState<Scheme>(() => meta.getAttribute('content') as Scheme);

	const applyScheme = (newScheme: Scheme) => {
		meta.setAttribute('content', newScheme);
		if (newScheme === Scheme.dark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem(schemeLSKey, newScheme);
	};

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setScheme(meta.getAttribute('content') as Scheme);
		});

		observer.observe(meta, { attributeFilter: ['content']});

		applyScheme(localStorage.getItem(schemeLSKey) as Scheme ?? Scheme.system);

		return () => observer.disconnect();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [meta]);

	return [scheme, applyScheme] as const;
}