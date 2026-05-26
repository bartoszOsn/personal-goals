alias yarn="./yarn/yarn";
corepack yarn install;
corepack yarn workspaces foreach -Rip --from @personal-okr/shared run build;
corepack yarn install;
corepack yarn workspaces foreach -Rip --from @personal-okr/api run build;