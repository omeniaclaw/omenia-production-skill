const PRODUCTION_TOOLS = [
  ['production_map', 'Get the Production Graph route map and invalidation rules', {}],
  ['production_locate', 'Locate a production job/artifact/raw media/CN clip and return next tools', { job_id: 'number?', artifact_id: 'number?', cn_asset_code: 'string?', audio_url: 'string?', mp4_url: 'string?', script: 'string?', payload: 'object?', mode: 'string?' }],
  ['production_create_job', 'Create a Production Graph job', { payload: 'object?', mode: 'string?' }],
  ['production_select_structure', 'Select cognitive narrative structure', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_generate_blueprint', 'Generate production blueprint', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_generate_script', 'Generate production script', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_generate_voice', 'Generate or import production voice', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_analyze_voice_timing', 'Analyze voice timing', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_index_cn_assets', 'Index/read ClawNet CN asset catalog', { payload: 'object?', mode: 'string?' }],
  ['production_get_chroma_profile', 'Get per-clip chroma profile', { cn_asset_code: 'string', payload: 'object?', mode: 'string?' }],
  ['production_apply_chroma', 'Apply or dry-run chroma processing', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_select_cn_assets', 'Select CN assets for timeline', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_build_scene_timeline', 'Build voice-driven scene timeline', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_generate_animation_segments', 'Generate animation segments', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_build_composition', 'Build composition plan', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_validate_timeline', 'Validate production timeline', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_render_preview', 'Render preview video', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_render_final', 'Render final video', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_send_telegram_video', 'Send final video to Telegram using server-stored credentials', { job_id: 'number?', input_artifact_ids: 'object[]?', payload: 'object?', mode: 'string?' }],
  ['production_certify_job', 'Certify a production job', { job_id: 'number?', payload: 'object?', mode: 'string?' }],
];

function schemaFromParams(params) {
  const properties = {};
  const required = [];
  for (const [key, type] of Object.entries(params)) {
    const optional = type.endsWith('?');
    const clean = type.replace('?', '');
    let schema = { type: 'object' };
    if (clean === 'string') schema = { type: 'string' };
    if (clean === 'number') schema = { type: 'number' };
    if (clean === 'boolean') schema = { type: 'boolean' };
    if (clean === 'object[]') schema = { type: 'array', items: { type: 'object' } };
    properties[key] = schema;
    if (!optional) required.push(key);
  }
  return { type: 'object', properties, required };
}

async function omeniaFetch(baseUrl, apiKey, path, options = {}) {
  if (!apiKey) throw new Error('Missing Omenia API key');
  const url = `${baseUrl.replace(/\/$/, '')}/api/v1${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`Omenia API ${response.status}: ${data.error || text}`);
  }
  return data;
}

export default {
  id: 'omenia-production-skill',
  name: 'Omenia Production Skill',
  description: 'Thin authenticated client for Omenia Production Graph tools.',

  register(api) {
    const getConfig = () => ({
      baseUrl: api.getConfig('baseUrl') || process.env.OMENIA_BASE_URL || 'https://omenia.io',
      apiKey: api.getAuth('omenia')?.apiKey || process.env.OMENIA_API_KEY || '',
    });

    for (const [toolName, description, params] of PRODUCTION_TOOLS) {
      api.registerTool({
        name: `omenia_${toolName}`,
        description: `[Omenia Production] ${description}`,
        schema: schemaFromParams(params),
        async execute(input) {
          const { baseUrl, apiKey } = getConfig();
          return await omeniaFetch(baseUrl, apiKey, '/claw/tools', {
            method: 'POST',
            body: JSON.stringify({ tool: toolName, arguments: input }),
          });
        },
      });
    }

    api.registerCli?.({
      command: 'omenia-production',
      description: 'Omenia Production Skill commands',
      subcommands: {
        health: {
          description: 'Check skill/API connectivity',
          async action() {
            const { baseUrl, apiKey } = getConfig();
            const data = await omeniaFetch(baseUrl, apiKey, '/claw/skills', { method: 'GET' });
            const hasProduction = (data.skills || []).some(skill => skill.skill_id === '@production');
            console.log(JSON.stringify({ ok: true, baseUrl, production_skill: hasProduction }, null, 2));
          },
        },
        tools: {
          description: 'List production tools available from this thin client',
          action() {
            for (const [name, description] of PRODUCTION_TOOLS) {
              console.log(`omenia_${name} - ${description}`);
            }
          },
        },
      },
    });
  },
};
