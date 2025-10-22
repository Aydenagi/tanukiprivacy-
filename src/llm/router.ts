import { env } from '../config.js';

export type Provider = 'openai' | 'anthropic' | 'deepseek';

export interface LLMRequest {
  system?: string;
  prompt: string;
  max_tokens?: number;
}

export interface LLMResponse {
  text: string;
}

export async function callLLM(req: LLMRequest): Promise<LLMResponse> {
  if (process.env.LLM_ENABLED !== 'true') {
    throw new Error('LLM is disabled. Set LLM_ENABLED=true in .env');
  }
  const provider = (process.env.LLM_PROVIDER || 'openai') as Provider;
  if (provider === 'openai') return callOpenAI(req);
  if (provider === 'anthropic') return callAnthropic(req);
  if (provider === 'deepseek') return callDeepseek(req);
  throw new Error(`Unknown LLM provider: ${provider}`);
}

async function callOpenAI({ system, prompt, max_tokens = 128 }: LLMRequest): Promise<LLMResponse> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const url = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const res = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        system ? { role: 'system', content: system } : null,
        { role: 'user', content: prompt }
      ].filter(Boolean),
      temperature: 0.2,
      max_tokens
    })
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  return { text };
}

async function callAnthropic({ system, prompt, max_tokens = 128 }: LLMRequest): Promise<LLMResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  const url = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com') + '/v1/messages';
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens,
      system,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error(`Anthropic error: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  const text = data.content?.[0]?.text ?? '';
  return { text };
}

async function callDeepseek({ system, prompt, max_tokens = 128 }: LLMRequest): Promise<LLMResponse> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error('DEEPSEEK_API_KEY missing');
  const url = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com') + '/chat/completions';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        system ? { role: 'system', content: system } : null,
        { role: 'user', content: prompt }
      ].filter(Boolean),
      temperature: 0.2,
      max_tokens
    })
  });
  if (!res.ok) throw new Error(`Deepseek error: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  return { text };
}
