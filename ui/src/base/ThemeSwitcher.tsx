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
								<Icon Icon={schemeToIcon[option]} /> {schemeToLabel[option]}
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

function useColorScheme() {
	const [stateScheme, setStateScheme] = useState<Scheme>(localStorage.getItem(schemeLSKey) as Scheme ?? Scheme.light);
	const preferredColorScheme = usePreferredColorScheme();

	const setScheme = (newScheme: Scheme) => {
		setStateScheme(newScheme as Scheme);
		localStorage.setItem(schemeLSKey, newScheme as Scheme);
	}

	useEffect(() => {
		if (stateScheme === Scheme.system) {
			document.documentElement.classList.toggle('dark', preferredColorScheme === Scheme.dark);
		} else {
			document.documentElement.classList.toggle('dark', stateScheme === Scheme.dark)
		}
	}, [stateScheme, preferredColorScheme]);

	useEffect(() => {
		const handler = (e: StorageEvent) => {
			if (e.key !== schemeLSKey) {
				return;
			}

			setStateScheme(e.newValue as Scheme);
		}
		window.addEventListener('storage', handler);
		return () => window.removeEventListener('storage', handler);
	}, []);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			if (document.documentElement.classList.contains('dark')) {
				setScheme(Scheme.dark);
			} else {
				setScheme(Scheme.light);
			}
		});

		observer.observe(document.documentElement, {
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	});

	return [stateScheme, setScheme] as const;
}

function usePreferredColorScheme(): Scheme.light | Scheme.dark {
	const [preferredColorScheme, setPreferredColorScheme] = useState<Scheme.light | Scheme.dark>(Scheme.light);

	useEffect(() => {
		const mql = window.matchMedia(`(prefers-color-scheme: light)`)
		const onChange = (ev: MediaQueryListEvent) => {
			setPreferredColorScheme(ev.matches ? Scheme.light : Scheme.dark)
		}
		mql.addEventListener("change", onChange)
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setPreferredColorScheme(mql.matches ? Scheme.light : Scheme.dark)
		return () => mql.removeEventListener("change", onChange)
	}, []);

	return preferredColorScheme;
}
