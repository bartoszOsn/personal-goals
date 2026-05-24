import { Link, ToOptions, useMatchRoute } from '@tanstack/react-router';
import { useCreateDocumentMutation, useDeleteDocumentMutation, useDocumentsQuery } from '@/api/document/document-hooks';
import { UserButton } from '@/core/UserButton';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from '@/primitive/components/ui/sidebar';
import { ChevronDown, ChevronUp, ExternalLink, Plus, Trash } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/primitive/components/ui/collapsible';
import { Spinner } from '@/primitive/components/ui/spinner';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/primitive/components/ui/context-menu';
import { YearPicker } from '@/base/YearPicker';
import { ReactNode } from 'react';

export function AppSidebar({ context, setContext }: { context: number, setContext: (next: number) => void, }) {
	const documentsQuery = useDocumentsQuery(context);
	const createDocumentMutation = useCreateDocumentMutation(context);
	const deleteDocumentMutation = useDeleteDocumentMutation(context);

	return (
		<Sidebar>
			<SidebarHeader>
				<SidebarGroup>
					<SidebarGroupContent>
						<div className="flex items-center text-xl gap-2 mb-2">
							<img src="/logo.svg" className="w-6 h-6" alt="" />
							<h1 className="font-bold text-purple-500 dark:text-purple-300 text-nowrap">Personal Goals</h1>
						</div>
						<YearPicker value={context} onValueChange={setContext} variant='outline' className='w-full' />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<MenuButtonLink to="/work/$context/sprint-overview/{-$sprintId}" params={{ context: context.toString() }}>
									Sprint overview
								</MenuButtonLink>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<MenuButtonLink to="/work/$context/roadmap" params={{ context: context.toString() }}>
									Roadmap
								</MenuButtonLink>
							</SidebarMenuItem>
							<Collapsible className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton>
											<ChevronDown className="group-data-[state=open]/collapsible:hidden" />
											<ChevronUp className="group-data-[state=closed]/collapsible:hidden" />
											Docs
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<SidebarMenuAction onClick={() => createDocumentMutation.mutate()}>
										<Plus />
									</SidebarMenuAction>
									<CollapsibleContent>
										<SidebarMenuSub>
											{
												documentsQuery.isLoading || !documentsQuery.data
													? <SidebarMenuSkeleton /> /*This is wrong*/
													:
													documentsQuery.data.map(d => (
														<ContextMenu key={d.id}>
															<ContextMenuTrigger asChild>
																<SidebarMenuSubItem>
																	<MenuButtonLink sub to={'/work/$context/document/$documentId'}
																					params={{ context: context.toString(), documentId: d.id }}>
																		{
																			deleteDocumentMutation.variables?.includes(d.id) &&
																			<Spinner />
																		}
																		{d.name}
																	</MenuButtonLink>
																</SidebarMenuSubItem>
															</ContextMenuTrigger>
															<ContextMenuContent>
																<ContextMenuItem asChild>
																	<Link to={'/work/$context/document/$documentId'}
																		  params={{ context: context.toString(), documentId: d.id }}
																		  target="_blank">
																		<ExternalLink /> Open in new tab
																	</Link>
																</ContextMenuItem>
																<ContextMenuItem variant="destructive" onClick={() => deleteDocumentMutation.mutate([d.id])}>
																	<Trash /> Delete
																</ContextMenuItem>
															</ContextMenuContent>
														</ContextMenu>
													))
											}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
							<SidebarMenuItem>
								<MenuButtonLink to="/work/$context/sprint-settings" params={{ context: context.toString() }}>
									Sprint settings
								</MenuButtonLink>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<UserButton context={context} />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}

function MenuButtonLink({ children, sub = false, ...toOptions }: ToOptions & { children: ReactNode, sub?: boolean}) {
	const matchRoute = useMatchRoute();
	const Component = sub ? SidebarMenuSubButton : SidebarMenuButton;

	return (
		<Component asChild isActive={!!matchRoute(toOptions)}>
			<Link {...toOptions}>
				{children}
			</Link>
		</Component>
	);
}