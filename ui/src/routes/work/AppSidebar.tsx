import { createLink } from '@tanstack/react-router';
import { AppShell, Box, Button, Loader, NavLink, ScrollAreaAutosize } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useCreateDocumentMutation, useDocumentsQuery } from '@/api/document/document-hooks';

export function AppSidebar({ context }: { context: number }) {
	const documentsQuery = useDocumentsQuery(context);
	const createDocumentMutation = useCreateDocumentMutation(context);

	return (
		<AppShell.Navbar>
			<AppShell.Section component={ScrollAreaAutosize}>
				<Box p="md">
					<CustomNavLink to="/work/$context/sprint-overview/{-$sprintId}" params={{ context: context.toString() }} label="Sprint overview" />
					<CustomNavLink to="/work/$context/roadmap" params={{ context: context.toString() }} label="Roadmap" />
					<NavLink label="Docs">
						{
							documentsQuery.isLoading || !documentsQuery.data
								? <Loader />
								: (
									<>
										{
											documentsQuery.data.map(d => <CustomNavLink key={d.id} to={'/work/$context/document/$documentId'} params={{ context: context.toString(), documentId: d.id }} label={d.name} />)
										}
										<Button fullWidth
												color="gray"
												variant="subtle"
												leftSection={<IconPlus size={18} stroke={1.5} />}
												loading={createDocumentMutation.isPending}
												onClick={() => createDocumentMutation.mutate()}>
											New document
										</Button>
									</>
								)
						}
					</NavLink>
					<CustomNavLink to="/work/$context/sprint-settings" params={{ context: context.toString() }} label="Sprint settings" />
				</Box>
			</AppShell.Section>
		</AppShell.Navbar>
	);
}

const CustomNavLink = createLink(NavLink<'a'>);