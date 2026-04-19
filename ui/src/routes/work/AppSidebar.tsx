import { createLink, Link } from '@tanstack/react-router';
import { AppShell, Box, Button, Loader, Menu, NavLink, ScrollAreaAutosize } from '@mantine/core';
import { IconExternalLink, IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateDocumentMutation, useDeleteDocumentMutation, useDocumentsQuery } from '@/api/document/document-hooks';
import { ContextMenu } from '@/base/context-menu/api/ContextMenu';
import { UserButton } from '@/core/UserButton';

export function AppSidebar({ context }: { context: number }) {
	const documentsQuery = useDocumentsQuery(context);
	const createDocumentMutation = useCreateDocumentMutation(context);
	const deleteDocumentMutation = useDeleteDocumentMutation(context);
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
											documentsQuery.data.map(d => (
												<ContextMenu key={d.id} dropdown={(
													<>
														<MenuItemLink to={'/work/$context/document/$documentId'}
																	  params={{ context: context.toString(), documentId: d.id }}
																	  target="_blank">Open in new tab</MenuItemLink>
														<Menu.Item leftSection={<IconTrash size={18} stroke={1.5} />}
																   color="red"
																   onClick={() => deleteDocumentMutation.mutate([d.id])}>Delete</Menu.Item>
													</>
												)}>
													<CustomNavLink key={d.id}
																   to={'/work/$context/document/$documentId'}
																   params={{ context: context.toString(), documentId: d.id }}
																   leftSection={deleteDocumentMutation.variables?.includes(d.id) && <Loader color="red" size='sm' />}
																   label={d.name} />
												</ContextMenu>
											))
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
			<AppShell.Section mt='auto'>
				<Box p="md">
					<UserButton />
				</Box>
			</AppShell.Section>
		</AppShell.Navbar>
	);
}

const CustomNavLink = createLink(NavLink<'a'>);
const MenuItemLink = createLink(Menu.Item.withProps({ component: Link, leftSection: <IconExternalLink size={18} stroke={1.5} /> }));