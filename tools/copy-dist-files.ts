import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

fs.writeFileSync(
  "dist/package.json",
  JSON.stringify(
    {
      dependencies: pkg.dependencies,
      description: pkg.description,
      license: pkg.license,
      main: pkg.main,
      name: pkg.name,
      peerDependencies: pkg.peerDependencies,
      repository: pkg.repository,
      version: pkg.version,
    },
    null,
    2,
  ),
);

fs.copyFileSync("LICENSE", "dist/LICENSE");
fs.copyFileSync("README.md", "dist/README.md");
