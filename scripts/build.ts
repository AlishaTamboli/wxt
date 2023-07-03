import tsup from 'tsup';
import glob from 'fast-glob';
import pc from 'picocolors';
import path from 'path';
import { formatDuration } from '../src/core/utils/formatDuration';
import ora from 'ora';
import fs from 'fs-extra';
import { consola } from 'consola';

const spinner = ora('Building WXT').start();

const startTime = Date.now();
const outDir = 'dist';
const clientTemplates = ['background', 'content-script'];

await fs.rm(outDir, { recursive: true, force: true });

await Promise.all([
  tsup.build({
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    sourcemap: true,
    dts: true,
    silent: true,
  }),
  tsup.build({
    entry: { cli: 'src/cli/index.ts' },
    format: ['cjs'],
    sourcemap: 'inline',
    silent: true,
  }),
  tsup.build({
    entry: { client: 'src/client/index.ts' },
    format: ['esm'],
    sourcemap: 'inline',
    dts: true,
    silent: true,
  }),
  ...clientTemplates.map((templateName) =>
    tsup.build({
      entry: {
        [`templates/virtual-${templateName}`]: `src/client/templates/virtual-${templateName}.ts`,
      },
      format: ['esm'],
      sourcemap: true,
      silent: true,
      external: [`virtual:user-${templateName}`],
    }),
  ),
  tsup.build({
    entry: {
      'templates/reload-html': `src/client/templates/reload-html.ts`,
    },
    format: ['esm'],
    sourcemap: true,
    silent: true,
  }),
]).catch((err) => {
  spinner.fail();
  console.error(err);
  process.exit(1);
});

spinner.succeed();

const duration = Date.now() - startTime;
const outFiles = await glob(`${outDir}/**`);
outFiles.forEach((file, i) => {
  const color = file.endsWith('.map')
    ? pc.dim
    : file.endsWith('.d.ts')
    ? pc.blue
    : pc.cyan;
  const prefix = i === outFiles.length - 1 ? '  └─' : '  ├─';
  console.log(
    `${pc.gray(prefix)} ${pc.dim(outDir + path.sep)}${color(
      path.relative(outDir, file),
    )}`,
  );
});
consola.success(`Finished in ${formatDuration(duration)}`);