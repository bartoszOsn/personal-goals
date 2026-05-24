import { LucideIcon } from 'lucide-react';
import { ComponentProps } from 'react';

export function Icon({ Icon, ...iconProps }: { Icon: LucideIcon} & ComponentProps<LucideIcon>) {
	return <Icon {...iconProps} />;
}