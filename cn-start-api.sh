alias yarn="./yarn/yarn";
corepack yarn workspaces foreach -Rip --from @personal-okr/api run start:prod;