import '@personal-okr/guitar/theme.css';
import '@personal-okr/guitar/button.css';
import '@personal-okr/guitar/appLayout.css';
import '@personal-okr/guitar/misc.css';
import { AppLayout, AppLayoutHeader, AppLayoutSidebar, AppLayoutMain } from '@personal-okr/guitar/appLayout';
import { Buttons } from './Buttons.tsx';
import { Typography } from './Typography.tsx';

export default function App() {
	return (
		<AppLayout fullHeight>
			<AppLayoutHeader>Header</AppLayoutHeader>
			<AppLayoutMain>
				<Typography />
				<Buttons />
			</AppLayoutMain>
			<AppLayoutSidebar>Sidebar</AppLayoutSidebar>
		</AppLayout>
	);
}
