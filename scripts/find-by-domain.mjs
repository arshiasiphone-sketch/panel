#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import process from 'process';

const node = process.execPath;
const script = path.resolve(process.cwd(), 'src', 'scripts', 'find-by-domain-runner.mjs');
const res = spawnSync(node, [script, 'khane.nama.app'], { stdio: 'inherit', env: process.env });
process.exit(res.status || 0);
