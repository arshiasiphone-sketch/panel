import { fileURLToPath } from 'url';
import path from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const domain = process.argv[2] || 'khane.nama.app';

async function run(){
  // Load project
  const providersModule = await import(path.join(__dirname, '..', '..', 'src', 'lib', 'providers', 'supabase', 'index.js'));
  const { createSupabaseAdminProviders } = providersModule;
  const { WorkspaceRepository } = await import(path.join(__dirname, '..', '..', 'src', 'lib', 'core', 'workspace', 'repository.js'));
  const { getLogger } = await import(path.join(__dirname, '..', '..', 'src', 'lib', 'logger.js'));

  const repoDeps = {
    ...createSupabaseAdminProviders(),
    logger: getLogger(),
  };

  const repo = new WorkspaceRepository(repoDeps);
  try{
    console.log('[NODE RUNNER] Running findByDomain for', domain);
    const res = await repo.findByDomain(domain);
    console.log('[NODE RUNNER] Result:', res);
  }catch(e){
    console.error('[NODE RUNNER] Error:', e);
    process.exit(2);
  }
}

run();
