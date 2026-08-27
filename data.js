/* 大模型「斩杀线」数据集 · 采集日期 2026-08-27
 * 价格单位:每 1M tokens,币种见 cur(USD / CNY),页面统一按 meta.fx 换算为 USD
 * 混合价(blended)= 0.7×缓存命中 + 0.2×输入 + 0.1×输出,与 Artificial Analysis 口径一致
 * 能力指数 ii = Artificial Analysis Intelligence Index v4.1.1
 * verified: official=官方页面直接核实;media=媒体报道(官方页面JS渲染无法直读);unverified=第三方来源
 */
const DATA = {
  meta: {
    asOf: '2026-08-27',
    fx: 6.784, // 1 USD = 6.784 CNY,中国货币网 2026-08-27 中间价
    fxSrc: 'https://www.chinamoney.com.cn/chinese/bkccpr/',
    iiVersion: 'AA Intelligence Index v4.1.1',
    iiSrc: 'https://artificialanalysis.ai/methodology/intelligence-benchmarking',
    blendedNote: '混合价 = 0.7×缓存命中 + 0.2×输入 + 0.1×输出(AA 7:2:1 口径)',
  },

  vendors: {
    anthropic: { name: 'Anthropic', color: '#d97757' },
    openai:    { name: 'OpenAI',    color: '#10a37f' },
    google:    { name: 'Google',    color: '#4285f4' },
    xai:       { name: 'xAI',       color: '#e8e8e8' },
    deepseek:  { name: 'DeepSeek',  color: '#4d6bfe' },
    zhipu:     { name: '智谱 Z.ai', color: '#38bdf8' },
    moonshot:  { name: '月之暗面',   color: '#a78bfa' },
    alibaba:   { name: '阿里 Qwen', color: '#f59e0b' },
    minimax:   { name: 'MiniMax',   color: '#f43f5e' },
    meta:      { name: 'Meta',      color: '#0866ff' },
    other:     { name: '其他',      color: '#94a3b8' },
  },

  channels: {
    official:    { name: '官方直连 API(国际/美元)', short: '官方API' },
    officialCN:  { name: '官方直连 API(中国区/人民币)', short: '官方CN' },
    openrouter:  { name: 'OpenRouter 聚合', short: 'OpenRouter' },
    zen:         { name: 'OpenCode Zen', short: 'Zen' },
    gpucloud:    { name: 'GPU 云推理(Together/Fireworks/DeepInfra 等)', short: 'GPU云' },
    hyperscale:  { name: '云厂商转售(Bedrock/Vertex/Azure)', short: '云转售' },
    free:        { name: '免费限量(:free)', short: '免费' },
  },

  /* ============ 按量/按token offerings(散点图 + 全量表) ============ */
  offerings: [
    /* ---- Anthropic 官方 ---- */
    { id:'an-opus5',    vendor:'anthropic', model:'Claude Opus 5',   ii:63, ch:'official', cur:'USD', pIn:5,   pCache:0.5,  pOut:25,  src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'当前能力榜第一;1M 上下文同价;Batch 5折' },
    { id:'an-fable5',   vendor:'anthropic', model:'Claude Fable 5',  ii:62, ch:'official', cur:'USD', pIn:10,  pCache:1,    pOut:50,  src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'全新高端产品线,与限量版 Mythos 5 同价' },
    { id:'an-sonnet5',  vendor:'anthropic', model:'Claude Sonnet 5', ii:55, ch:'official', cur:'USD', pIn:2,   pCache:0.2,  pOut:10,  src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'原定 2026-09-01 涨回 $3/$15,官方已宣布取消' },
    { id:'an-opus48',   vendor:'anthropic', model:'Claude Opus 4.8', ii:57, dep:true, ch:'official', cur:'USD', pIn:5, pCache:0.5, pOut:25, src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'上代旗舰,AA 已标停售' },
    { id:'an-sonnet46', vendor:'anthropic', model:'Claude Sonnet 4.6', ii:35, iiNote:'AA 不完整评测', dep:true, ch:'official', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official' },
    { id:'an-haiku45',  vendor:'anthropic', model:'Claude Haiku 4.5', ii:30, ch:'official', cur:'USD', pIn:1, pCache:0.1, pOut:5, src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'Batch $0.5/$2.5' },

    /* ---- OpenAI 官方 ---- */
    { id:'oa-sol',    vendor:'openai', model:'GPT-5.6 Sol',   ii:61, ch:'official', cur:'USD', pIn:4, pCache:0.4, pOut:20, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'促销价承诺至 2026-11-21;Batch/Flex 半价 $2/$10;长上下文 $8/$30' },
    { id:'oa-terra',  vendor:'openai', model:'GPT-5.6 Terra', ii:57, ch:'official', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'Batch/Flex $1/$6' },
    { id:'oa-luna',   vendor:'openai', model:'GPT-5.6 Luna',  ii:52, ch:'official', cur:'USD', pIn:0.2, pCache:0.02, pOut:1.2, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'Batch/Flex $0.1/$0.6' },
    { id:'oa-gpt55',  vendor:'openai', model:'GPT-5.5',       ii:56, dep:true, ch:'official', cur:'USD', pIn:5, pCache:0.5, pOut:30, src:'https://developers.openai.com/api/docs/pricing', verified:'official' },

    /* ---- Google 官方 ---- */
    { id:'go-31pro',  vendor:'google', model:'Gemini 3.1 Pro Preview', ii:48, ch:'official', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official', note:'>200K 上下文 $4/$18;不支持 Batch' },
    { id:'go-37flash',vendor:'google', model:'Gemini 3.7 Flash',  ii:56, ch:'official', cur:'USD', pIn:0.75, pCache:0.075, pOut:3.75, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official', note:'促销价至 2026-12-31,2027-01-01 起翻倍至 $1.5/$7.5' },
    { id:'go-36flash',vendor:'google', model:'Gemini 3.6 Flash',  ii:52, ch:'official', cur:'USD', pIn:0.75, pCache:0.075, pOut:3.75, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official', note:'同上促销,2027 年翻倍' },
    { id:'go-35lite', vendor:'google', model:'Gemini 3.5 Flash-Lite', ii:37, ch:'official', cur:'USD', pIn:0.3, pCache:0.03, pOut:2.5, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official' },
    { id:'go-35flash',vendor:'google', model:'Gemini 3.5 Flash', ii:52, dep:true, ch:'official', cur:'USD', pIn:1.5, pCache:0.15, pOut:9, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official' },

    /* ---- xAI 官方 ---- */
    { id:'xa-46',  vendor:'xai', model:'Grok 4.6',   ii:61, ch:'official', cur:'USD', pIn:2, pCache:0.5, pOut:6, src:'https://docs.x.ai/developers/pricing', verified:'official', note:'GPQA 第一(94.9);≥200K 全部token按 $4/$12 计' },
    { id:'xa-45',  vendor:'xai', model:'Grok 4.5',   ii:56, ch:'official', cur:'USD', pIn:2, pCache:0.3, pOut:6, src:'https://docs.x.ai/developers/pricing', verified:'official' },
    { id:'xa-420', vendor:'xai', model:'Grok 4.20',  ii:38, dep:true, ch:'official', cur:'USD', pIn:1.25, pCache:0.2, pOut:2.5, src:'https://docs.x.ai/developers/pricing', verified:'official', note:'1M 上下文;批量8折;Grok 4.3 同价' },

    /* ---- DeepSeek 官方(峰时价,闲时半价) ---- */
    { id:'ds-v4pro',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:53, ch:'official', cur:'USD', pIn:1.32, pCache:0.044, pOut:3.96, src:'https://api-docs.deepseek.com/quick_start/pricing', verified:'official', note:'闲时半价 $0.66/$1.98;峰时=UTC 工作日 01-04/06-10 点' },
    { id:'ds-v4proCN', vendor:'deepseek', model:'DeepSeek V4 Pro', ii:53, ch:'officialCN', cur:'CNY', pIn:9, pCache:0.3, pOut:27, src:'https://api-docs.deepseek.com/zh-cn/quick_start/pricing', verified:'official', note:'闲时半价 ¥4.5/¥13.5;峰时=北京时间工作日 9-12/14-18 点' },
    { id:'ds-v4flash', vendor:'deepseek', model:'DeepSeek V4 Flash', ii:52, ch:'official', cur:'USD', pIn:0.44, pCache:0.014, pOut:1.32, src:'https://api-docs.deepseek.com/quick_start/pricing', verified:'official', note:'闲时半价 $0.22/$0.66' },
    { id:'ds-v4flashCN', vendor:'deepseek', model:'DeepSeek V4 Flash', ii:52, ch:'officialCN', cur:'CNY', pIn:3, pCache:0.1, pOut:9, src:'https://api-docs.deepseek.com/zh-cn/quick_start/pricing', verified:'official', note:'闲时半价 ¥1.5/¥4.5' },

    /* ---- 智谱 z.ai(国际美元价;国内刊例价页面JS渲染未能核实) ---- */
    { id:'zp-glm53',  vendor:'zhipu', model:'GLM-5.3', ii:60, ch:'official', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://docs.z.ai/guides/overview/pricing.md', verified:'official', note:'开源阵营最强之一;国内 Coding Plan 另有超低价(见订阅面板)' },
    { id:'zp-glm53f', vendor:'zhipu', model:'GLM-5.3-Flash', ii:57, ch:'official', cur:'USD', pIn:0.075, pCache:0.015, pOut:0.25, src:'https://docs.z.ai/guides/overview/pricing.md', verified:'official', note:'促销至 2026-09-09;原价 $0.15/$0.5(混合价 $0.10)' },
    { id:'zp-glm52',  vendor:'zhipu', model:'GLM-5.2', ii:53, open:true, ch:'official', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://docs.z.ai/guides/overview/pricing.md', verified:'official', note:'MIT 开源' },

    /* ---- Kimi(月之暗面)官方:国际 + 中国区 ---- */
    { id:'km-k3',    vendor:'moonshot', model:'Kimi K3', ii:60, ch:'official', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://platform.kimi.ai/docs/pricing/chat-k3', verified:'official', note:'开源权重第一(与 GLM-5.3 并列区间);1M 上下文' },
    { id:'km-k3CN',  vendor:'moonshot', model:'Kimi K3', ii:60, ch:'officialCN', cur:'CNY', pIn:20, pCache:2, pOut:100, src:'https://platform.kimi.com/docs/pricing/chat-k3', verified:'official', note:'国内站原价(平台已迁移至 platform.kimi.com)' },
    { id:'km-k27',   vendor:'moonshot', model:'Kimi K2.7 Code', ii:43, ch:'official', cur:'USD', pIn:0.95, pCache:0.19, pOut:4, src:'https://platform.kimi.ai/docs/pricing/chat-k27-code', verified:'official' },
    { id:'km-k27CN', vendor:'moonshot', model:'Kimi K2.7 Code', ii:43, ch:'officialCN', cur:'CNY', pIn:6.5, pCache:1.3, pOut:27, src:'https://platform.kimi.com/docs/pricing/chat-k27-code', verified:'official' },
    { id:'km-k27hs', vendor:'moonshot', model:'Kimi K2.7 Code (高速版)', ii:43, ch:'official', cur:'USD', pIn:1.9, pCache:0.38, pOut:8, src:'https://platform.kimi.ai/docs/pricing/chat-k27-code', verified:'official', note:'约 180 tok/s' },

    /* ---- 阿里 Qwen:国际 + 中国区 ---- */
    { id:'qw-max',   vendor:'alibaba', model:'Qwen3.8-Max', ii:58, ch:'official', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://www.alibabacloud.com/help/en/model-studio/qwen3-8-max', verified:'official', note:'新加坡国际区;北京等区 $1.65/$4.95 更低' },
    { id:'qw-maxCN', vendor:'alibaba', model:'Qwen3.8-Max', ii:58, ch:'officialCN', cur:'CNY', pIn:12, pCache:1.5, pOut:36, src:'https://help.aliyun.com/zh/model-studio/qwen3-8-max', verified:'official', note:'百炼 Batch ¥6/¥18' },
    { id:'qw-24tCN', vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:58, open:true, ch:'officialCN', cur:'CNY', pIn:12, pCache:1.5, pOut:36, src:'https://help.aliyun.com/zh/model-studio/qwen3-8-2-4t-a95b', verified:'official', note:'开源版在百炼与 Max 同价售卖' },
    { id:'qw-flashCN', vendor:'alibaba', model:'Qwen3.8-Flash', ii:null, ch:'officialCN', cur:'CNY', pIn:1, pCache:0.1, pOut:3, src:'https://help.aliyun.com/zh/model-studio/qwen3-8-flash', verified:'official', note:'AA 未收录该模型能力分' },
    { id:'qw-flash', vendor:'alibaba', model:'Qwen3.8-Flash', ii:null, ch:'official', cur:'USD', pIn:0.16, pCache:0.016, pOut:0.47, src:'https://www.alibabacloud.com/help/en/model-studio/qwen3-8-flash', verified:'official' },

    /* ---- MiniMax 官方 ---- */
    { id:'mm-m3',   vendor:'minimax', model:'MiniMax-M3', ii:45, ch:'official', cur:'USD', pIn:0.3, pCache:0.06, pOut:1.2, src:'https://platform.minimax.io/docs/guides/pricing-paygo', verified:'official', note:'标准档「永久五折」;>512K 上下文翻倍' },
    { id:'mm-m3CN', vendor:'minimax', model:'MiniMax-M3', ii:45, ch:'officialCN', cur:'CNY', pIn:2.1, pCache:0.42, pOut:8.4, src:'https://platform.minimaxi.com/docs/guides/pricing-paygo', verified:'official' },
    { id:'mm-m27',  vendor:'minimax', model:'MiniMax-M2.7', ii:39, dep:true, ch:'official', cur:'USD', pIn:0.3, pCache:0.06, pOut:1.2, src:'https://platform.minimax.io/docs/guides/pricing-paygo', verified:'official' },

    /* ---- Meta(开源市场均价口径) ---- */
    { id:'mt-muse', vendor:'meta', model:'Muse Spark 1.2', ii:57, open:true, ch:'gpucloud', provider:'AA 市场均价', cur:'USD', pIn:null, pCache:null, pOut:null, blendedOverride:0.78, src:'https://artificialanalysis.ai/models/muse-spark-1-2', verified:'official', note:'Meta 当前 AA 榜旗舰;无第一方按量 API,价格为 AA 市场均价口径' },

    /* ---- OpenRouter 聚合(标价;另有 5.5% 充值卡费) ---- */
    { id:'or-sol',    vendor:'openai', model:'GPT-5.6 Sol', ii:61, ch:'openrouter', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://openrouter.ai/openai/gpt-5.6-sol', verified:'official', note:'OpenAI 路由 5 折(直连为 $4/$20);Azure 路由 $5/$30;充值卡费另计 5.5%' },
    { id:'or-terra',  vendor:'openai', model:'GPT-5.6 Terra', ii:57, ch:'openrouter', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://openrouter.ai/models', verified:'official', note:'与官方同价;+5.5% 充值费' },
    { id:'or-luna',   vendor:'openai', model:'GPT-5.6 Luna', ii:52, ch:'openrouter', cur:'USD', pIn:0.2, pCache:0.02, pOut:1.2, src:'https://openrouter.ai/models', verified:'official', note:'与官方同价;+5.5% 充值费' },
    { id:'or-opus5',  vendor:'anthropic', model:'Claude Opus 5', ii:63, ch:'openrouter', cur:'USD', pIn:5, pCache:0.5, pOut:25, src:'https://openrouter.ai/anthropic/claude-opus-5', verified:'official', note:'与官方同价;Batch 5折;+5.5% 充值费' },
    { id:'or-sonnet5',vendor:'anthropic', model:'Claude Sonnet 5', ii:55, ch:'openrouter', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://openrouter.ai/anthropic/claude-sonnet-5', verified:'official', note:'与官方同价' },
    { id:'or-haiku',  vendor:'anthropic', model:'Claude Haiku 4.5', ii:30, ch:'openrouter', cur:'USD', pIn:1, pCache:0.1, pOut:5, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-glm53',  vendor:'zhipu', model:'GLM-5.3', ii:60, ch:'openrouter', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-glm53f', vendor:'zhipu', model:'GLM-5.3-Flash', ii:57, ch:'openrouter', cur:'USD', pIn:0.075, pCache:0.015, pOut:0.25, src:'https://openrouter.ai/models', verified:'official', note:'同步官方促销价' },
    { id:'or-glm52',  vendor:'zhipu', model:'GLM-5.2', ii:53, open:true, ch:'openrouter', cur:'USD', pIn:1.19, pCache:0.221, pOut:3.74, src:'https://openrouter.ai/models', verified:'official', note:'低于 z.ai 官方约 15%' },
    { id:'or-k3',     vendor:'moonshot', model:'Kimi K3', ii:60, ch:'openrouter', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://openrouter.ai/models', verified:'official', note:'与国际官方同价' },
    { id:'or-k27',    vendor:'moonshot', model:'Kimi K2.7 Code', ii:43, ch:'openrouter', cur:'USD', pIn:0.67, pCache:0.19, pOut:3.4, src:'https://openrouter.ai/models', verified:'official', note:'比国际官方便宜约 30%' },
    { id:'or-k26',    vendor:'moonshot', model:'Kimi K2.6', ii:45, dep:true, ch:'openrouter', cur:'USD', pIn:0.95, pCache:0.16, pOut:4, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-dsv4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:53, ch:'openrouter', cur:'USD', pIn:1.122, pCache:0.037, pOut:3.366, src:'https://openrouter.ai/models', verified:'official', note:'第三方路由,介于官方峰/闲价之间' },
    { id:'or-dsv4f',  vendor:'deepseek', model:'DeepSeek V4 Flash', ii:52, ch:'openrouter', cur:'USD', pIn:0.06, pCache:0.012, pOut:0.12, src:'https://openrouter.ai/models', verified:'official', note:'显著低于官方价,第三方部署价格波动大' },
    { id:'or-dsv32',  vendor:'deepseek', model:'DeepSeek V3.2', ii:44, iiNote:'AA 不完整评测', dep:true, ch:'openrouter', cur:'USD', pIn:0.26, pCache:0.13, pOut:0.38, src:'https://openrouter.ai/models', verified:'official', note:'DeepSeek 官方已下架 V3.2,聚合渠道仍有第三方供应' },
    { id:'or-qwmax',  vendor:'alibaba', model:'Qwen3.8-Max', ii:58, ch:'openrouter', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-qw24t',  vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:58, open:true, ch:'openrouter', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-m3',     vendor:'minimax', model:'MiniMax-M3', ii:45, ch:'openrouter', cur:'USD', pIn:0.3, pCache:0.06, pOut:1.2, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-g37f',   vendor:'google', model:'Gemini 3.7 Flash', ii:56, ch:'openrouter', cur:'USD', pIn:0.375, pCache:0.037, pOut:1.875, src:'https://openrouter.ai/models', verified:'official', note:'约为官方促销价的一半(路由批价)' },
    { id:'or-g46',    vendor:'xai', model:'Grok 4.6', ii:61, ch:'openrouter', cur:'USD', pIn:2, pCache:0.5, pOut:6, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-g45',    vendor:'xai', model:'Grok 4.5', ii:56, ch:'openrouter', cur:'USD', pIn:2, pCache:0.3, pOut:6, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-glm52f', vendor:'zhipu', model:'GLM-5.2 (:free)', ii:53, open:true, ch:'free', cur:'USD', pIn:0, pCache:0, pOut:0, src:'https://openrouter.ai/models', verified:'official', note:'免费限量:充值过$10后 1000 次/天,否则 50 次/天;256K 上下文' },
    { id:'or-m3f',    vendor:'minimax', model:'MiniMax-M3 (:free)', ii:45, ch:'free', cur:'USD', pIn:0, pCache:0, pOut:0, src:'https://openrouter.ai/models', verified:'official', note:'免费限量:1000 次/天(需$10充值记录)' },

    /* ---- OpenCode Zen(零加价,充值卡费 4.4%+$0.30/次) ---- */
    { id:'zen-opus5',  vendor:'anthropic', model:'Claude Opus 5', ii:63, ch:'zen', cur:'USD', pIn:5, pCache:0.5, pOut:25, src:'https://opencode.ai/docs/zen', verified:'official', note:'与官方同价;opencode 终端内置' },
    { id:'zen-sonnet5',vendor:'anthropic', model:'Claude Sonnet 5', ii:55, ch:'zen', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://opencode.ai/docs/zen', verified:'official' },
    { id:'zen-sol',    vendor:'openai', model:'GPT-5.6 Sol', ii:61, ch:'zen', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://opencode.ai/docs/zen', verified:'official', note:'5 折价至 2026-09-18(OpenAI 自家至 11-21)' },
    { id:'zen-k3',     vendor:'moonshot', model:'Kimi K3', ii:60, ch:'zen', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://opencode.ai/docs/zen', verified:'official' },
    { id:'zen-glm52',  vendor:'zhipu', model:'GLM-5.2', ii:53, open:true, ch:'zen', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://opencode.ai/docs/zen', verified:'official' },
    { id:'zen-dsv4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:53, ch:'zen', cur:'USD', pIn:1.32, pCache:0.044, pOut:3.96, src:'https://opencode.ai/docs/zen', verified:'official', note:'自动透传 DeepSeek 峰/闲时段(闲时半价)' },
    { id:'zen-g46',    vendor:'xai', model:'Grok 4.6', ii:61, ch:'zen', cur:'USD', pIn:2, pCache:0.5, pOut:6, src:'https://opencode.ai/docs/zen', verified:'official' },
    { id:'zen-m3',     vendor:'minimax', model:'MiniMax-M3', ii:45, ch:'zen', cur:'USD', pIn:0.3, pCache:0.06, pOut:1.2, src:'https://opencode.ai/docs/zen', verified:'official' },
    { id:'zen-qw37max',vendor:'alibaba', model:'Qwen3.7-Max', ii:null, ch:'zen', cur:'USD', pIn:2.5, pCache:0.25, pOut:7.5, src:'https://opencode.ai/docs/zen', verified:'official', note:'上一代 Qwen 旗舰,AA 未收录现行能力分' },

    /* ---- GPU 云推理 ---- */
    { id:'di-v4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:53, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:1.3, pCache:0.1, pOut:2.6, src:'https://deepinfra.com/models', verified:'official', note:'无峰谷之分,输出价比官方峰价低 34%' },
    { id:'di-glm52',vendor:'zhipu', model:'GLM-5.2', ii:53, open:true, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:0.75, pCache:0.14, pOut:2.4, src:'https://deepinfra.com/models', verified:'official', note:'比官方直连便宜约 46%' },
    { id:'di-k3',   vendor:'moonshot', model:'Kimi K3', ii:60, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:2.85, pCache:0.285, pOut:14.25, src:'https://deepinfra.com/models', verified:'official' },
    { id:'di-qw24t',vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:58, open:true, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:2, pCache:0.2, pOut:6, src:'https://deepinfra.com/models', verified:'official' },
    { id:'tg-v4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:53, ch:'gpucloud', provider:'Together', cur:'USD', pIn:1.32, pCache:0.13, pOut:3.96, src:'https://www.together.ai/pricing', verified:'official', note:'=官方峰价,无闲时优惠' },
    { id:'tg-k3',   vendor:'moonshot', model:'Kimi K3', ii:60, ch:'gpucloud', provider:'Together', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://www.together.ai/pricing', verified:'official' },
    { id:'tg-glm52',vendor:'zhipu', model:'GLM-5.2', ii:53, open:true, ch:'gpucloud', provider:'Together', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://www.together.ai/pricing', verified:'official' },
    { id:'tg-qw24t',vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:58, open:true, ch:'gpucloud', provider:'Together', cur:'USD', pIn:2.5, pCache:0.5, pOut:6.25, src:'https://www.together.ai/pricing', verified:'official' },
    { id:'fw-v4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:53, ch:'gpucloud', provider:'Fireworks', cur:'USD', pIn:1.32, pCache:1.32, pOut:3.96, src:'https://docs.fireworks.ai/serverless/pricing', verified:'official', note:'缓存价未公布,暂按输入价计;Batch 5折' },
    { id:'fw-k3',   vendor:'moonshot', model:'Kimi K3', ii:60, ch:'gpucloud', provider:'Fireworks', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://docs.fireworks.ai/serverless/pricing', verified:'official', note:'Fast 版 $4.5/$22.5' },
    { id:'fw-glm52',vendor:'zhipu', model:'GLM-5.2', ii:53, open:true, ch:'gpucloud', provider:'Fireworks', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://docs.fireworks.ai/serverless/pricing', verified:'official' },
    { id:'fw-qwmax',vendor:'alibaba', model:'Qwen3.8-Max', ii:58, ch:'gpucloud', provider:'Fireworks', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://docs.fireworks.ai/serverless/pricing', verified:'official' },
    { id:'gq-k2',   vendor:'moonshot', model:'Kimi K2 (0905)', ii:null, ch:'gpucloud', provider:'Groq', cur:'USD', pIn:1, pCache:0.5, pOut:3, src:'https://groq.com/pricing', verified:'official', note:'Groq 目录尚未上架 K3/V4/GLM-5.x' },
    { id:'cb-gptoss',vendor:'other', model:'GPT-OSS-120B', ii:null, open:true, ch:'gpucloud', provider:'Cerebras', cur:'USD', pIn:0.35, pCache:0.35, pOut:0.75, src:'https://www.cerebras.ai/pricing', verified:'official', note:'Cerebras 公开目录仅此旗舰级开源模型' },

    /* ---- 云厂商转售 ---- */
    { id:'bed-opus5', vendor:'anthropic', model:'Claude Opus 5', ii:63, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:5, pCache:0.5, pOut:25, src:'https://aws.amazon.com/bedrock/pricing/', verified:'official', note:'Global 端点与官方同价;Batch 5折' },
    { id:'bed-opus5us', vendor:'anthropic', model:'Claude Opus 5', ii:63, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:5.5, pCache:0.55, pOut:27.5, src:'https://openrouter.ai/anthropic/claude-opus-5', verified:'official', note:'美国地理/合规端点 +10%' },
    { id:'bed-sonnet5', vendor:'anthropic', model:'Claude Sonnet 5', ii:55, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://openrouter.ai/anthropic/claude-sonnet-5', verified:'official' },
    { id:'bed-sonnet5us', vendor:'anthropic', model:'Claude Sonnet 5', ii:55, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:2.2, pCache:0.22, pOut:11, src:'https://openrouter.ai/anthropic/claude-sonnet-5', verified:'official', note:'美国地理端点 +10%' },
    { id:'vx-31pro', vendor:'google', model:'Gemini 3.1 Pro Preview', ii:48, ch:'hyperscale', provider:'Google Vertex', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://cloud.google.com/vertex-ai/generative-ai/pricing', verified:'official', note:'与 Gemini API 同价;Flex/Batch 半价 $1/$6' },
    { id:'az-sol',   vendor:'openai', model:'GPT-5.6 Sol', ii:61, ch:'hyperscale', provider:'Azure', cur:'USD', pIn:5, pCache:0.5, pOut:30, src:'https://azure.microsoft.com/pricing/details/azure-openai/', verified:'official', note:'比 OpenAI 直连贵 25%(出)/50%(入);长上下文 $10/$45' },
    { id:'az-terra', vendor:'openai', model:'GPT-5.6 Terra', ii:57, ch:'hyperscale', provider:'Azure', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://azure.microsoft.com/pricing/details/azure-openai/', verified:'official', note:'与 OpenAI 同价' },
    { id:'az-luna',  vendor:'openai', model:'GPT-5.6 Luna', ii:52, ch:'hyperscale', provider:'Azure', cur:'USD', pIn:0.2, pCache:0.02, pOut:1.2, src:'https://azure.microsoft.com/pricing/details/azure-openai/', verified:'official', note:'与 OpenAI 同价' },
    { id:'bed-k25',  vendor:'moonshot', model:'Kimi K2.5', ii:null, dep:true, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:0.6, pCache:0.6, pOut:3, src:'https://aws.amazon.com/bedrock/pricing/', verified:'official', note:'Bedrock 开源权重转售,普遍贵于 GPU 云' },
    { id:'bed-glm5', vendor:'zhipu', model:'GLM-5', ii:null, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:1, pCache:1, pOut:3.2, src:'https://aws.amazon.com/bedrock/pricing/', verified:'official' },
    { id:'bed-m25',  vendor:'minimax', model:'MiniMax-M2.5', ii:null, dep:true, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:0.3, pCache:0.3, pOut:1.2, src:'https://aws.amazon.com/bedrock/pricing/', verified:'official' },
  ],

  /* ============ 订阅 / Token 包 / 会员(月费制,不进散点图) ============ */
  plans: [
    /* --- 厂商自营订阅 --- */
    { vendor:'OpenAI', plan:'ChatGPT Plus', fee:'$20/月', quota:'GPT-5.6 全系(Sol/Terra/Luna),54K 即时/256K 推理上下文,"限额适用"', src:'https://chatgpt.com/pricing', verified:'official' },
    { vendor:'OpenAI', plan:'ChatGPT Pro', fee:'$100/月(5×Plus)· $200/月(20×Plus)', quota:'$200 档解锁 Sol Pro、128K/400K 上下文,Sol/Terra/Luna「不限量*」', src:'https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers', verified:'official' },
    { vendor:'OpenAI', plan:'ChatGPT Business', fee:'标准席 $20-25 · 高级席 $100-125/人/月', quota:'高级席 5×用量、无5小时限制', src:'https://openai.com/business/pricing', verified:'official' },
    { vendor:'OpenAI', plan:'Codex 加油包(信用点)', fee:'按量', quota:'1 credit=$0.01;Sol 折算 $1/$0.1/$5 每百万tokens,约等于API价2.5-4折', src:'https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan', verified:'media', note:'learn.chatgpt.com 口径' },
    { vendor:'Anthropic', plan:'Claude Pro', fee:'$20/月(年付$17)', quota:'5小时滚动窗口(≥5×免费版)+周上限;含 Claude Code', src:'https://claude.com/pricing', verified:'official' },
    { vendor:'Anthropic', plan:'Claude Max 5× / 20×', fee:'$100/月 · $200/月', quota:'5×/20× Pro 用量;20× 档含 Fable 5 访问;超额按 API 价信用点扣费', src:'https://support.claude.com/en/articles/11049741-what-is-the-max-plan', verified:'official' },
    { vendor:'Google', plan:'Google AI Pro', fee:'$19.99/月', quota:'Gemini 4× 访问优先,1M 上下文,$10 云额度', src:'https://one.google.com/about/google-ai-plans/', verified:'official' },
    { vendor:'Google', plan:'Google AI Ultra 5× / 20×', fee:'$99.99/月 · $199.99/月', quota:'5×/20× Pro 用量,Deep Think、Project Genie', src:'https://blog.google/products-and-platforms/products/google-one/google-ai-subscriptions/', verified:'official' },
    { vendor:'xAI', plan:'SuperGrok', fee:'$30/月', quota:'Grok 4.6,更高速率限制,Expert 模式', src:'https://x.ai/pricing', verified:'official' },
    { vendor:'xAI', plan:'SuperGrok Plus / Heavy', fee:'$100/月 · $300/月(Heavy 价未经官方页直接核实)', quota:'Plus: 高级用量+1080p;Heavy: 最高限额+新功能优先', src:'https://x.ai/pricing', verified:'media' },
    { vendor:'智谱', plan:'GLM Coding Plan(V2 存量价)', fee:'Lite ¥49 · Pro ¥149 · Max ¥469/月', quota:'每5小时约 80/400/1600 prompts;每周 400/2000/8000;支持 Claude Code 等官方指定工具', src:'https://docs.bigmodel.cn/cn/coding-plan/notice/usage-revision.md', verified:'official' },
    { vendor:'智谱', plan:'GLM Coding Plan(2026-07-30 新积分制)', fee:'¥118/¥538/¥1078(月费为媒体报道,官方文档仅公布积分)', quota:'每5小时 2000/12000/28000 积分;每周 10000/60000/140000;GLM-5.3 系数:输入6.9/缓存1.7/输出24 积分每万tokens;非峰时(仅工作日14-18点为峰)半价抵扣;官方称比按量API最高省92%', src:'https://docs.bigmodel.cn/cn/coding-plan/overview.md', verified:'media', note:'按系数折算:Pro 周积分≈可跑 1.2 亿混合tokens(峰时口径)' },
    { vendor:'智谱', plan:'z.ai GLM Coding Plan(国际)', fee:'$18/月起(Pro $72/Max $160 为媒体报道)', quota:'积分结构与国内版相同;支持 Claude Code/Cline/OpenCode', src:'https://docs.z.ai/devpack/overview.md', verified:'media' },
    { vendor:'月之暗面', plan:'Kimi 会员(国际)', fee:'Moderato $19 · Allegretto $39 · Allegro $99 · Vivace $199/月', quota:'Agent 额度 60/150/360/720 次;Vivace 独享 K3 百万级长对话;K2.6 聊天免费', src:'https://www.kimi.ai/zh-hans/help/membership/membership-pricing', verified:'official' },
    { vendor:'月之暗面', plan:'Kimi 会员(国内)', fee:'¥49/¥99/¥199/¥699(媒体口径)', quota:'2026-07-19 起因 K3 算力紧缺暂停新用户订阅;Kimi Code 随会员共享额度;加油包按量、单次最低¥25', src:'https://www.kimi.com/code/docs/kimi-code/membership.html', verified:'media' },
    { vendor:'阿里', plan:'百炼 Token Plan 个人版', fee:'限时 ¥39/¥139/¥499(原 ¥60/¥180/¥600)/月', quota:'每7天 2500/10000/40000 Credits;qwen3.8-max 与 DeepSeek V4 Pro 夜间22-08点五折;用量包 ¥100=20000 Credits;模型抵扣系数未公开', src:'https://help.aliyun.com/zh/model-studio/token-plan-personal-overview', verified:'official', note:'可调 Qwen3.8/DeepSeek-V4/GLM-5.2,适配 Claude Code/Cursor' },
    { vendor:'MiniMax', plan:'Token Plan(国内)', fee:'Plus ¥49 · Max ¥119 · Ultra ¥469/月', quota:'5小时+周双窗口;覆盖 M3/M2.7/图像/语音;积分包 ¥7=1000积分(等值预存,无折扣);超额按目录价折算积分', src:'https://platform.minimaxi.com/docs/guides/pricing-token-plan', verified:'official' },
    { vendor:'MiniMax', plan:'Token Plan(国际)', fee:'Plus $22 · Max $55 · Ultra $132/月', quota:'结构同国内版;积分包 $5/$25/$100', src:'https://platform.minimax.io/docs/guides/pricing-token-plan', verified:'official' },
    /* --- IDE / 编程工具订阅 --- */
    { vendor:'GitHub', plan:'Copilot Free / Pro / Pro+ / Max', fee:'$0 · $10 · $39 · $100/月', quota:'Pro 1500 AI credits/月(1 credit=$0.01,约$15等值);Pro+ 7000;Max 20000;模型选择器含 Claude/GPT/Gemini/Grok/Kimi', src:'https://github.com/features/copilot/plans', verified:'official' },
    { vendor:'Cursor', plan:'Hobby / Pro / Pro+ / Ultra', fee:'$0 · $20 · $60 · $200/月', quota:'Pro 含自有模型池(Grok 4.6 等);第三方模型按 API 价后付费(Teams 再+$0.25/M)', src:'https://cursor.com/pricing', verified:'official' },
    { vendor:'Kiro(AWS)', plan:'Free / Pro / Pro+ / Pro Max / Power', fee:'$0 · $20 · $40 · $100 · $200/月', quota:'积分 50/1000/2000/5000/10000 每月;$0.04/credit 加购;免费档含 Qwen/DeepSeek/MiniMax 开源模型', src:'https://kiro.dev/pricing', verified:'official' },
    { vendor:'Devin(含Windsurf)', plan:'Free / Pro / Max / Teams', fee:'$0 · $20 · $200/月 · Teams $80+$40/席', quota:'Pro 2000 ACU/月;Max 10000 ACU/月', src:'https://devin.ai/pricing', verified:'official', note:'Windsurf 独立定价页已 301 至 Devin' },
  ],

  /* ============ 渠道计费机制(影响实际成本) ============ */
  mechanics: [
    { channel:'OpenRouter', how:'预充值积分(Stripe 卡 5.5% 费、Crypto 5%、支付宝);BYOK 每月 $25k 内免推理费,超出 5%;:free 每日 50-1000 次;:batch 恒 5 折(24h 窗口)', src:'https://openrouter.ai/docs/faq' },
    { channel:'OpenCode Zen', how:'预充值 $20 起,自动续充;卡费 4.4%+$0.30 按充值次数收;token 零加价、按官方降价同步', src:'https://opencode.ai/docs/zen' },
    { channel:'DeepSeek', how:'峰/闲双价:闲时=峰时一半(北京时区工作日白天为峰);所有模型适用', src:'https://api-docs.deepseek.com/quick_start/pricing' },
    { channel:'OpenAI / Anthropic / Google / Fireworks / Bedrock', how:'Batch 恒 5 折;OpenAI 另有 Flex 同为 5 折、Priority/Fast 2×', src:'https://developers.openai.com/api/docs/pricing' },
    { channel:'智谱 GLM Coding Plan', how:'非峰时(峰时仅工作日 14-18 点)积分半价抵扣;额度用尽即停,不透支;仅限官方指定工具(Claude Code/OpenCode 等)', src:'https://docs.bigmodel.cn/cn/coding-plan/overview.md' },
    { channel:'MiniMax M3', how:'标准档「永久五折」;>512K 上下文部分翻倍;优先档 ×1.5', src:'https://platform.minimax.io/docs/guides/pricing-paygo' },
  ],

  sources: [
    { name:'OpenAI API Pricing', url:'https://developers.openai.com/api/docs/pricing' },
    { name:'Anthropic Pricing', url:'https://platform.claude.com/docs/en/about-claude/pricing' },
    { name:'Google Gemini API Pricing', url:'https://ai.google.dev/gemini-api/docs/pricing' },
    { name:'xAI Pricing', url:'https://docs.x.ai/developers/pricing' },
    { name:'DeepSeek Pricing(中/英)', url:'https://api-docs.deepseek.com/quick_start/pricing' },
    { name:'Z.ai Pricing', url:'https://docs.z.ai/guides/overview/pricing.md' },
    { name:'智谱 GLM Coding Plan 文档', url:'https://docs.bigmodel.cn/cn/coding-plan/overview.md' },
    { name:'Kimi Open Platform(国际/国内)', url:'https://platform.kimi.ai/docs/pricing/chat-k3' },
    { name:'阿里云百炼 Qwen3.8 / Token Plan', url:'https://help.aliyun.com/zh/model-studio/token-plan-personal-overview' },
    { name:'MiniMax Pricing(国际/国内)', url:'https://platform.minimax.io/docs/guides/pricing-paygo' },
    { name:'OpenRouter Models API', url:'https://openrouter.ai/api/v1/models' },
    { name:'OpenCode Zen 文档', url:'https://opencode.ai/docs/zen' },
    { name:'Together / Fireworks / DeepInfra / Groq / Cerebras', url:'https://www.together.ai/pricing' },
    { name:'AWS Bedrock / Google Vertex / Azure AI Foundry', url:'https://aws.amazon.com/bedrock/pricing/' },
    { name:'Artificial Analysis 模型榜 + 方法论', url:'https://artificialanalysis.ai/leaderboards/models' },
    { name:'Cursor / Copilot / Kiro / Devin 定价页', url:'https://cursor.com/pricing' },
    { name:'人民币汇率中间价(中国货币网)', url:'https://www.chinamoney.com.cn/chinese/bkccpr/' },
  ],

  caveats: [
    'GPT-5.6 Sol 官方 $4/$20 为促销价(承诺至 2026-11-21);OpenRouter/Zen 的 OpenAI 路由目前另享 5 折。',
    'Gemini 3.6/3.7 Flash 为促销价,2027-01-01 起翻倍;GLM-5.3-Flash 促销至 2026-09-09。',
    'DeepSeek 全系峰/闲双价,图表取峰时价(更保守);闲时一律半价。',
    'MiniMax M3 标准档为「永久五折」后的价格。',
    '中国区人民币价格按 2026-08-27 中间价 6.784 折算美元,未含税费差异。',
    '智谱国内 API 刊例价与新版 Coding Plan 月费、Kimi 国内会员价、SuperGrok Heavy 等为媒体报道口径(官方页面 JS 渲染),已标注。',
    '免费限量模型(:free)受每日请求数限制,不参与斩杀线计算。',
    'AA 已停更 SWE-bench Verified 与按模型 Coding Index,能力分统一采用 Intelligence Index v4.1.1。',
  ],
};
