/* 大模型「斩杀线」数据集 · 采集日期 2026-10-12(上一版 2026-08-27)
 * 价格单位:每 1M tokens,币种见 cur(USD / CNY),页面统一按 meta.fx 换算为 USD
 * 混合价(blended)= 0.7×缓存命中 + 0.2×输入 + 0.1×输出,与 Artificial Analysis 口径一致
 * 能力指数 ii = Artificial Analysis Intelligence Index v4.3.2(与 8 月的 v4.1.1 不可直接比较)
 * verified: official=官方页面直接核实;media=媒体报道/聚合渠道(官方页面无法直读或口径冲突);unverified=第三方来源
 */
export const DATA = {
  meta: {
    asOf: '2026-10-12',
    fx: 6.7313, // 1 USD = 6.7313 CNY,中国货币网 2026-10-12 中间价
    fxSrc: 'https://www.chinamoney.com.cn/chinese/bkccpr/',
    iiVersion: 'AA Intelligence Index v4.3.2',
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
    stepfun:   { name: '阶跃 StepFun', color: '#8b7cf6' },
    meta:      { name: 'Meta',      color: '#0866ff' },
    mistral:   { name: 'Mistral',   color: '#ff7000' },
    other:     { name: '其他',      color: '#94a3b8' },
  },

  channels: {
    official:    { name: '官方直连 API(国际/美元)', short: '官方API' },
    officialCN:  { name: '官方直连 API(中国区/人民币)', short: '官方CN' },
    openrouter:  { name: 'OpenRouter 聚合', short: 'OpenRouter' },
    gpucloud:    { name: 'GPU 云推理(Together/Fireworks/DeepInfra 等)', short: 'GPU云' },
    hyperscale:  { name: '云厂商转售(Bedrock/Vertex/Azure)', short: '云转售' },
    free:        { name: '免费限量(:free)', short: '免费' },
  },

  offerings: [
    /* ---- Anthropic 官方 ---- */
    { id:'an-opus55',   vendor:'anthropic', model:'Claude Opus 5.5',   ii:58, ch:'official', cur:'USD', pIn:4,   pCache:0.2,  pOut:20,  src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'AA 榜 #1/227;缓存写 $5(5m)/$8(1h);Batch 5折 $2/$10' },
    { id:'an-sonnet55', vendor:'anthropic', model:'Claude Sonnet 5.5', ii:56, ch:'official', cur:'USD', pIn:2,   pCache:0.1,  pOut:10,  src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'AA 榜 #2,混合价与 GPT-6.1 Sol 持平但能力分高 4 分;9-29 发布' },
    { id:'an-fable51',  vendor:'anthropic', model:'Claude Fable 5.1',  ii:53, ch:'official', cur:'USD', pIn:10,  pCache:0.25, pOut:50,  src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'缓存读较 Fable 5 降 4 倍;限量版 Mythos 5.1 同价' },
    { id:'an-haiku55',  vendor:'anthropic', model:'Claude Haiku 5.5',  ii:43, ch:'official', cur:'USD', pIn:0.1, pCache:0.01, pOut:0.5, src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'10-07 发布,较 Haiku 4.5 降价 10 倍;>100K 提示加价 5 倍($0.5/$0.05/$2.5)' },
    { id:'an-opus5',    vendor:'anthropic', model:'Claude Opus 5',     ii:51, dep:true, ch:'official', cur:'USD', pIn:5, pCache:0.5, pOut:25, src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official', note:'上代旗舰,仍 Listed 但 AA 已标记被 5.5 取代' },
    { id:'an-sonnet5',  vendor:'anthropic', model:'Claude Sonnet 5',   ii:38, dep:true, ch:'official', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official' },
    { id:'an-fable5',   vendor:'anthropic', model:'Claude Fable 5',    ii:50, dep:true, ch:'official', cur:'USD', pIn:10, pCache:1, pOut:50, src:'https://platform.claude.com/docs/en/about-claude/pricing', verified:'official' },

    /* ---- OpenAI 官方 ---- */
    { id:'oa-gpt61sol', vendor:'openai', model:'GPT-6.1 Sol',   ii:52, ch:'official', cur:'USD', pIn:2,   pCache:0.1,  pOut:10,  src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'9-29 发布,现任主力;>272K $4/$15;Fast 2×/Ultrafast 6×;Batch $1/$5' },
    { id:'oa-gpt6luna', vendor:'openai', model:'GPT-6 Luna',    ii:38, ch:'official', cur:'USD', pIn:0.1, pCache:0.01, pOut:0.5, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'9-22 发布;>272K $0.2/$0.75' },
    { id:'oa-gpt6astra',vendor:'openai', model:'GPT-6 Astra',   ii:53, ch:'official', cur:'USD', pIn:10,  pCache:1,    pOut:50,  src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'9-03 发布的顶级档;Ultrafast $60/$300' },
    { id:'oa-gpt6sol',  vendor:'openai', model:'GPT-6 Sol',     ii:48, dep:true, ch:'official', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'已被 GPT-6.1 Sol 取代' },
    { id:'oa-sol56',    vendor:'openai', model:'GPT-5.6 Sol',   ii:47, dep:true, ch:'official', cur:'USD', pIn:4, pCache:0.4, pOut:20, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'仍 Listed 未停版;促销价承诺至 2026-11-21' },
    { id:'oa-terra56',  vendor:'openai', model:'GPT-5.6 Terra', ii:42, ch:'official', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'GPT-6 系无 Terra 对位,仍在售' },
    { id:'oa-luna56',   vendor:'openai', model:'GPT-5.6 Luna',  ii:37, dep:true, ch:'official', cur:'USD', pIn:0.2, pCache:0.02, pOut:1.2, src:'https://developers.openai.com/api/docs/pricing', verified:'official', note:'被 GPT-6 Luna 取代(价格再砍半)' },

    /* ---- Google 官方 ---- */
    { id:'go-g4argon', vendor:'google', model:'Gemini 4 Argon', ii:53, ch:'official', cur:'USD', pIn:null, pCache:null, pOut:null, src:'https://artificialanalysis.ai/leaderboards/models', verified:'media', note:'AA 榜 53 分的新旗舰;官方定价页尚未列出价格(能力分暂无法入图)' },
    { id:'go-38flash', vendor:'google', model:'Gemini 3.8 Flash', ii:41, ch:'official', cur:'USD', pIn:0.75, pCache:0.075, pOut:3.75, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official', note:'9-02 发布;促销至 2026-12-31,2027-01-01 起翻倍 $1.5/$7.5' },
    { id:'go-31pro',   vendor:'google', model:'Gemini 3.1 Pro Preview', ii:30, ch:'official', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official', note:'仍无 3.2/4.0 Pro 正式版;>200K $4/$18;Batch $1/$6' },
    { id:'go-36flash', vendor:'google', model:'Gemini 3.6 Flash', ii:34, dep:true, ch:'official', cur:'USD', pIn:0.75, pCache:0.075, pOut:3.75, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official', note:'与 3.8 同价,AA 标记被取代' },
    { id:'go-35lite',  vendor:'google', model:'Gemini 3.5 Flash-Lite', ii:22, ch:'official', cur:'USD', pIn:0.3, pCache:0.03, pOut:2.5, src:'https://ai.google.dev/gemini-api/docs/pricing', verified:'official' },

    /* ---- xAI 官方 ---- */
    { id:'xa-47', vendor:'xai', model:'Grok 4.7', ii:46, ch:'official', cur:'USD', pIn:2, pCache:0.5, pOut:6, src:'https://docs.x.ai/docs/models', verified:'official', note:'9-21 发布,「最强 Grok」;≥200K 全部 token 按 $4/$12;无 Grok 5' },
    { id:'xa-46', vendor:'xai', model:'Grok 4.6', ii:44, dep:true, ch:'official', cur:'USD', pIn:2, pCache:0.5, pOut:6, src:'https://docs.x.ai/docs/models', verified:'official' },
    { id:'xa-45', vendor:'xai', model:'Grok 4.5', ii:null, ch:'official', cur:'USD', pIn:2, pCache:0.3, pOut:6, src:'https://docs.x.ai/docs/models', verified:'official', note:'AA v4.3.2 未收录,能力分留空' },
    { id:'xa-43', vendor:'xai', model:'Grok 4.3', ii:null, ch:'official', cur:'USD', pIn:1.25, pCache:0.2, pOut:2.5, src:'https://docs.x.ai/docs/models', verified:'official', note:'1M 上下文预算档' },

    /* ---- DeepSeek(峰时价,闲时半价) ---- */
    { id:'ds-v41flash',  vendor:'deepseek', model:'DeepSeek V4.1 Flash', ii:39, ch:'official', cur:'USD', pIn:0.3, pCache:0.006, pOut:1.2, src:'https://api-docs.deepseek.com/quick_start/pricing', verified:'official', note:'9-10 上线(552B MoE,原生视觉);闲时半价 $0.15/$0.6;旧 v4-flash 停售按此价路由' },
    { id:'ds-v41flashCN',vendor:'deepseek', model:'DeepSeek V4.1 Flash', ii:39, ch:'officialCN', cur:'CNY', pIn:2, pCache:0.04, pOut:8, src:'https://api-docs.deepseek.com/zh-cn/quick_start/pricing', verified:'official', note:'闲时 ¥1/¥4;缓存命中峰 ¥0.04/闲 ¥0.02' },
    { id:'ds-v4pro',     vendor:'deepseek', model:'DeepSeek V4 Pro', ii:36, ch:'official', cur:'USD', pIn:1.32, pCache:0.044, pOut:3.96, src:'https://api-docs.deepseek.com/quick_start/pricing', verified:'official', note:'口径冲突:官方新闻称 9-14 起 V4-Pro 请求按 V4.1-Flash 价路由至 V4.1-Pro 发布,但定价页仍单列本价;闲时半价' },
    { id:'ds-v4proCN',   vendor:'deepseek', model:'DeepSeek V4 Pro', ii:36, ch:'officialCN', cur:'CNY', pIn:9, pCache:0.3, pOut:27, src:'https://api-docs.deepseek.com/zh-cn/quick_start/pricing', verified:'official', note:'同上路由口径冲突;闲时 ¥4.5/¥13.5' },

    /* ---- 智谱 ---- */
    { id:'zp-glm53',    vendor:'zhipu', model:'GLM-5.3', ii:45, open:true, ch:'official', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://docs.z.ai/guides/overview/pricing', verified:'official', note:'开源阵营 AA #2;缓存存储限时免费' },
    { id:'zp-glm53CN',  vendor:'zhipu', model:'GLM-5.3', ii:45, open:true, ch:'officialCN', cur:'CNY', pIn:8, pCache:2, pOut:28, src:'https://docs.bigmodel.cn/cn/guide/start/pricing', verified:'official' },
    { id:'zp-glm53f',   vendor:'zhipu', model:'GLM-5.3-Flash', ii:42, open:true, ch:'official', cur:'USD', pIn:0.15, pCache:0.03, pOut:0.5, src:'https://docs.z.ai/guides/overview/pricing', verified:'official', note:'官方 docs 标准价;开放平台 FAQ 另标「限时五折」¥0.4/¥1.4(无截止日),两处口径不一' },
    { id:'zp-glm53fx',  vendor:'zhipu', model:'GLM-5.3-FlashX', ii:null, ch:'official', cur:'USD', pIn:0.37, pCache:0.075, pOut:1.25, src:'https://docs.bigmodel.cn/cn/guide/start/pricing', verified:'official', note:'9-24 上架,200 tok/s 高速版 Flash;AA 未收录' },
    { id:'zp-glm52',    vendor:'zhipu', model:'GLM-5.2', ii:null, open:true, ch:'official', cur:'USD', pIn:1.4, pCache:0.26, pOut:4.4, src:'https://docs.z.ai/guides/overview/pricing', verified:'official', note:'AA v4.3.2 未收录' },
    { id:'or-glm53',    vendor:'zhipu', model:'GLM-5.3', ii:45, open:true, ch:'openrouter', cur:'USD', pIn:0.079, pCache:0.059, pOut:4.8, src:'https://openrouter.ai/models', verified:'media', note:'聚合路由促销价(输入近零),波动大,不保证长期' },
    { id:'or-glm53f',   vendor:'zhipu', model:'GLM-5.3-Flash', ii:42, open:true, ch:'openrouter', cur:'USD', pIn:0.023, pCache:0.023, pOut:1.2, src:'https://openrouter.ai/models', verified:'media', note:'渠道价与官方 $0.15/$0.5 不符;:batch 恒 5 折' },
    { id:'or-glm53p',   vendor:'zhipu', model:'GLM-5.3-Prime', ii:null, ch:'openrouter', cur:'USD', pIn:2.8, pCache:0.56, pOut:8.8, src:'https://openrouter.ai/models', verified:'media', note:'任何官方渠道均无此 SKU(定价页/模型索引 404),仅聚合在售【未核实】' },
    { id:'or-glm52',    vendor:'zhipu', model:'GLM-5.2', ii:null, open:true, ch:'openrouter', cur:'USD', pIn:0.06, pCache:0.059, pOut:7, src:'https://openrouter.ai/models', verified:'media', note:'渠道价波动异常(输入近零/输出高于官方)' },
    { id:'di-glm52',    vendor:'zhipu', model:'GLM-5.2', ii:null, open:true, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:0.75, pCache:0.14, pOut:2.4, src:'https://deepinfra.com/models', verified:'official', note:'8-27 核实价;AA v4.3.2 未收录' },

    /* ---- Kimi ---- */
    { id:'km-k3',   vendor:'moonshot', model:'Kimi K3', ii:44, open:true, ch:'official', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://platform.kimi.ai/docs/pricing', verified:'official', note:'官方未调价;缓存写 $3(5m)/$6(1h)' },
    { id:'km-k3CN', vendor:'moonshot', model:'Kimi K3', ii:44, open:true, ch:'officialCN', cur:'CNY', pIn:20, pCache:2, pOut:100, src:'https://platform.kimi.com/docs/pricing', verified:'official', note:'国内站未调价' },
    { id:'or-k3',   vendor:'moonshot', model:'Kimi K3', ii:44, open:true, ch:'openrouter', cur:'USD', pIn:0.73, pCache:0.55, pOut:10, src:'https://openrouter.ai/models', verified:'media', note:'渠道价与官方 $3/$15 明显不符(缓存读异常高),疑限时促销路由' },
    { id:'km-k27',  vendor:'moonshot', model:'Kimi K2.7 Code', ii:null, ch:'official', cur:'USD', pIn:0.95, pCache:0.19, pOut:4, src:'https://platform.kimi.ai/docs/pricing', verified:'official', note:'AA v4.3.2 未收录;高速版双倍 $1.9/$8' },
    { id:'or-k27',  vendor:'moonshot', model:'Kimi K2.7 Code', ii:null, ch:'openrouter', cur:'USD', pIn:0.671, pCache:0.18, pOut:3.35, src:'https://openrouter.ai/models', verified:'media' },

    /* ---- 阿里 Qwen ---- */
    { id:'qw-max',      vendor:'alibaba', model:'Qwen3.8-Max', ii:45, ch:'official', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://www.alibabacloud.com/help/en/model-studio/billing-for-model-studio', verified:'official', note:'国际区;北京区更低($1.65/$4.95);与 -0902 快照版同价在售' },
    { id:'qw-maxCN',    vendor:'alibaba', model:'Qwen3.8-Max', ii:45, ch:'officialCN', cur:'CNY', pIn:12, pCache:1.5, pOut:36, src:'https://help.aliyun.com/zh/model-studio/billing-for-model-studio', verified:'official' },
    { id:'qw-maxprimeCN', vendor:'alibaba', model:'Qwen3.8-Max-Prime', ii:null, ch:'officialCN', cur:'CNY', pIn:24, pCache:null, pOut:72, src:'https://help.aliyun.com/zh/model-studio/billing-for-model-studio', verified:'official', note:'9-24 上架的高速 SKU;无免费额度' },
    { id:'or-qwprime',  vendor:'alibaba', model:'Qwen3.8-Max-Prime', ii:null, ch:'openrouter', cur:'USD', pIn:4, pCache:0.5, pOut:12, src:'https://openrouter.ai/models', verified:'media', note:'聚合价与官方 ¥24/¥72 有差,以官方为准;AA 未收录' },
    { id:'qw-24tCN',    vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:40, open:true, ch:'officialCN', cur:'CNY', pIn:12, pCache:1.5, pOut:36, src:'https://help.aliyun.com/zh/model-studio/billing-for-model-studio', verified:'official', note:'开源版与 Max 同价售卖' },
    { id:'or-qw24t',    vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:40, open:true, ch:'openrouter', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://openrouter.ai/models', verified:'official' },
    { id:'qw-flashCN',  vendor:'alibaba', model:'Qwen3.8-Flash', ii:null, ch:'officialCN', cur:'CNY', pIn:0.8, pCache:0.1, pOut:2.7, src:'https://help.aliyun.com/zh/model-studio/billing-for-model-studio', verified:'official', note:'自 ¥1/¥3 下调' },
    { id:'or-qwmax',    vendor:'alibaba', model:'Qwen3.8-Max', ii:45, ch:'openrouter', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://openrouter.ai/models', verified:'official' },

    /* ---- MiniMax ---- */
    { id:'mm-m3',   vendor:'minimax', model:'MiniMax-M3', ii:29, open:true, ch:'official', cur:'USD', pIn:0.3, pCache:0.06, pOut:1.2, src:'https://platform.minimax.io/docs/pricing/overview', verified:'official', note:'标准档「永久五折」;>512K 翻倍;priority ×1.5' },
    { id:'mm-m3CN', vendor:'minimax', model:'MiniMax-M3', ii:29, open:true, ch:'officialCN', cur:'CNY', pIn:2.1, pCache:0.42, pOut:8.4, src:'https://platform.minimax.cn/docs/pricing/overview', verified:'official' },
    { id:'mm-m27',  vendor:'minimax', model:'MiniMax-M2.7', ii:23, dep:true, open:true, ch:'official', cur:'USD', pIn:0.3, pCache:0.06, pOut:1.2, src:'https://platform.minimax.io/docs/pricing/overview', verified:'official', note:'官方未降价(OR 渠道 $0.21/$0.84 与官方不符)' },

    /* ---- Meta / Mistral ---- */
    { id:'mt-muse13', vendor:'meta', model:'Muse Spark 1.3', ii:48, ch:'gpucloud', provider:'AA 市场均价', cur:'USD', pIn:null, pCache:null, pOut:null, blendedOverride:0.78, src:'https://artificialanalysis.ai/models/muse-spark-1-3', verified:'official', note:'Meta 现任 AA 榜旗舰(9-02 发布);无第一方按量 API,价格为 AA 市场均价口径' },
    { id:'mi-l4', vendor:'mistral', model:'Mistral Large 4', ii:38, open:true, ch:'official', cur:'USD', pIn:0.68, pCache:0.07, pOut:2.09, src:'https://docs.mistral.ai/inference/pricing', verified:'official', note:'10-06 发布(v26.10),上市 5 折促销价(标准 $1.36/$0.14/$4.18);开源权重' },

    /* ---- 阶跃 StepFun ---- */
    { id:'sf-step5CN', vendor:'stepfun', model:'Step-5 Preview', ii:44, ch:'officialCN', cur:'CNY', pIn:7, pCache:0.35, pOut:20, src:'https://platform.stepfun.com/docs/zh/guides/pricing/details', verified:'official', note:'9-20 发布,600B/27B 稀疏 MoE,1M 上下文,原生视频输入;官方称 10-15 开源权重;AA #40/227' },
    { id:'or-step5',   vendor:'stepfun', model:'Step-5 Preview', ii:44, ch:'openrouter', cur:'USD', pIn:1.0, pCache:0.05, pOut:2.7, src:'https://openrouter.ai/models', verified:'official', note:'10-08 上架;与官方人民币价按 ~7.0 汇率基本同价' },
    { id:'sf-step37CN', vendor:'stepfun', model:'Step-3.7 Flash', ii:null, ch:'officialCN', cur:'CNY', pIn:1.35, pCache:0.27, pOut:8.1, src:'https://platform.stepfun.com/docs/zh/guides/pricing/details', verified:'official' },
    { id:'sf-step35CN', vendor:'stepfun', model:'Step-3.5 Flash', ii:null, open:true, ch:'officialCN', cur:'CNY', pIn:0.7, pCache:0.14, pOut:2.1, src:'https://platform.stepfun.com/docs/zh/guides/pricing/details', verified:'official', note:'开源' },

    /* ---- OpenRouter 聚合(其余) ---- */
    { id:'or-opus55',  vendor:'anthropic', model:'Claude Opus 5.5', ii:58, ch:'openrouter', cur:'USD', pIn:4, pCache:0.2, pOut:20, src:'https://openrouter.ai/models', verified:'official', note:'与官方同价;充值卡费另计 5.5%' },
    { id:'or-sonnet55',vendor:'anthropic', model:'Claude Sonnet 5.5', ii:56, ch:'openrouter', cur:'USD', pIn:2, pCache:0.1, pOut:10, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-haiku55', vendor:'anthropic', model:'Claude Haiku 5.5', ii:43, ch:'openrouter', cur:'USD', pIn:0.1, pCache:0.01, pOut:0.5, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-g61sol',  vendor:'openai', model:'GPT-6.1 Sol', ii:52, ch:'openrouter', cur:'USD', pIn:2, pCache:0.1, pOut:10, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-g6luna',  vendor:'openai', model:'GPT-6 Luna', ii:38, ch:'openrouter', cur:'USD', pIn:0.1, pCache:0.01, pOut:0.5, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-g6astra', vendor:'openai', model:'GPT-6 Astra', ii:53, ch:'openrouter', cur:'USD', pIn:10, pCache:1, pOut:50, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-g38f',    vendor:'google', model:'Gemini 3.8 Flash', ii:41, ch:'openrouter', cur:'USD', pIn:0.75, pCache:0.075, pOut:3.75, src:'https://openrouter.ai/models', verified:'official', note:'8 月时 3.7 Flash 曾有约官方半价的批价路由,现与官方同价' },
    { id:'or-g47',     vendor:'xai', model:'Grok 4.7', ii:46, ch:'openrouter', cur:'USD', pIn:2, pCache:0.5, pOut:6, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-dsv41f',  vendor:'deepseek', model:'DeepSeek V4.1 Flash', ii:39, ch:'openrouter', cur:'USD', pIn:0.15, pCache:0.003, pOut:0.6, src:'https://openrouter.ai/models', verified:'official', note:'路由为官方闲时价口径;:batch $0.112/$0.336' },
    { id:'or-dsv4p',   vendor:'deepseek', model:'DeepSeek V4 Pro', ii:36, ch:'openrouter', cur:'USD', pIn:0.955, pCache:0.08, pOut:1.911, src:'https://openrouter.ai/models', verified:'media', note:'介于官方峰/闲价之间,显著低于峰价' },
    { id:'or-k3b',     vendor:'moonshot', model:'Kimi K3 (:batch)', ii:44, open:true, ch:'openrouter', cur:'USD', pIn:2.28, pCache:0.228, pOut:11.4, src:'https://openrouter.ai/models', verified:'media', note:'batch 路由价反高于标准路由($0.73/$10),渠道定价混乱' },
    { id:'or-mistral4',vendor:'mistral', model:'Mistral Large 4', ii:38, open:true, ch:'openrouter', cur:'USD', pIn:0.68, pCache:0.07, pOut:2.09, src:'https://openrouter.ai/models', verified:'official', note:'同步官方促销价' },
    { id:'or-m3',      vendor:'minimax', model:'MiniMax-M3', ii:29, open:true, ch:'openrouter', cur:'USD', pIn:0.3, pCache:0.06, pOut:1.2, src:'https://openrouter.ai/models', verified:'official' },
    { id:'or-step5',   vendor:'stepfun', model:'Step-5 Preview', ii:44, ch:'openrouter', cur:'USD', pIn:1.0, pCache:0.05, pOut:2.7, src:'https://openrouter.ai/models', verified:'official', note:'(同 sf-step5CN 的聚合渠道)' },

    /* ---- 免费限量 / 匿名 stealth ---- */
    { id:'or-m3f',    vendor:'minimax', model:'MiniMax-M3 (:free)', ii:29, open:true, ch:'free', cur:'USD', pIn:0, pCache:0, pOut:0, src:'https://openrouter.ai/models', verified:'official', note:'免费限量:充值过 $10 后 1000 次/天,否则 50 次/天' },
    { id:'sb-alpha',  vendor:'other', model:'Space Bunny Alpha(匿名 stealth)', ii:null, ch:'openrouter', cur:'USD', pIn:null, pCache:null, pOut:null, src:'https://openrouter.ai/stealth/space-bunny-alpha', verified:'media', note:'OpenRouter 匿名 stealth 模型(9-23 上架,1M 上下文,已退出公开目录);开发者匿名,社区猜为 MiniMax 系(未证实);无官方价格与 AA 指数,不入图' },

    /* ---- GPU 云(8-27 核实,未逐条复核) ---- */
    { id:'di-v4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:36, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:1.3, pCache:0.1, pOut:2.6, src:'https://deepinfra.com/models', verified:'official', note:'无峰谷之分,输出价低于官方峰价 34%' },
    { id:'di-k3',   vendor:'moonshot', model:'Kimi K3', ii:44, open:true, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:2.85, pCache:0.285, pOut:14.25, src:'https://deepinfra.com/models', verified:'official' },
    { id:'tg-k3',   vendor:'moonshot', model:'Kimi K3', ii:44, open:true, ch:'gpucloud', provider:'Together', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://www.together.ai/pricing', verified:'official' },
    { id:'fw-k3',   vendor:'moonshot', model:'Kimi K3', ii:44, open:true, ch:'gpucloud', provider:'Fireworks', cur:'USD', pIn:3, pCache:0.3, pOut:15, src:'https://docs.fireworks.ai/serverless/pricing', verified:'official', note:'Fast 版 $4.5/$22.5' },
    { id:'tg-v4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:36, ch:'gpucloud', provider:'Together', cur:'USD', pIn:1.32, pCache:0.13, pOut:3.96, src:'https://www.together.ai/pricing', verified:'official', note:'=官方峰价' },
    { id:'fw-v4p',  vendor:'deepseek', model:'DeepSeek V4 Pro', ii:36, ch:'gpucloud', provider:'Fireworks', cur:'USD', pIn:1.32, pCache:1.32, pOut:3.96, src:'https://docs.fireworks.ai/serverless/pricing', verified:'official', note:'Batch 5折' },
    { id:'di-qw24t',vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:40, open:true, ch:'gpucloud', provider:'DeepInfra', cur:'USD', pIn:2, pCache:0.2, pOut:6, src:'https://deepinfra.com/models', verified:'official' },
    { id:'tg-qw24t',vendor:'alibaba', model:'Qwen3.8-2.4T-A95B', ii:40, open:true, ch:'gpucloud', provider:'Together', cur:'USD', pIn:2.5, pCache:0.5, pOut:6.25, src:'https://www.together.ai/pricing', verified:'official' },
    { id:'fw-qwmax',vendor:'alibaba', model:'Qwen3.8-Max', ii:45, ch:'gpucloud', provider:'Fireworks', cur:'USD', pIn:2, pCache:0.25, pOut:6, src:'https://docs.fireworks.ai/serverless/pricing', verified:'official' },
    { id:'gq-k2',   vendor:'moonshot', model:'Kimi K2 (0905)', ii:null, ch:'gpucloud', provider:'Groq', cur:'USD', pIn:1, pCache:0.5, pOut:3, src:'https://groq.com/pricing', verified:'official', note:'Groq 目录仍无 K3/V4.1/GLM-5.x' },
    { id:'cb-gptoss',vendor:'other', model:'GPT-OSS-120B', ii:null, open:true, ch:'gpucloud', provider:'Cerebras', cur:'USD', pIn:0.35, pCache:0.35, pOut:0.75, src:'https://www.cerebras.ai/pricing', verified:'official' },

    /* ---- 云厂商转售 ---- */
    { id:'bed-opus55',   vendor:'anthropic', model:'Claude Opus 5.5', ii:58, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:4, pCache:0.2, pOut:20, src:'https://openrouter.ai/models', verified:'media', note:'Global 端点与官方同价(按 OpenRouter 路由表口径);美国地理端点 +10%' },
    { id:'bed-opus5',    vendor:'anthropic', model:'Claude Opus 5', ii:51, dep:true, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:5, pCache:0.5, pOut:25, src:'https://openrouter.ai/models', verified:'media' },
    { id:'bed-sonnet5',  vendor:'anthropic', model:'Claude Sonnet 5', ii:38, dep:true, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:2, pCache:0.2, pOut:10, src:'https://openrouter.ai/models', verified:'media' },
    { id:'vx-31pro',     vendor:'google', model:'Gemini 3.1 Pro Preview', ii:30, ch:'hyperscale', provider:'Google Vertex', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://cloud.google.com/vertex-ai/generative-ai/pricing', verified:'official', note:'Flex/Batch 半价 $1/$6' },
    { id:'az-sol56',     vendor:'openai', model:'GPT-5.6 Sol', ii:47, dep:true, ch:'hyperscale', provider:'Azure', cur:'USD', pIn:5, pCache:0.5, pOut:30, src:'https://azure.microsoft.com/pricing/details/azure-openai/', verified:'official', note:'比 OpenAI 直连促销价贵 25%(出)/50%(入)' },
    { id:'az-terra56',   vendor:'openai', model:'GPT-5.6 Terra', ii:42, ch:'hyperscale', provider:'Azure', cur:'USD', pIn:2, pCache:0.2, pOut:12, src:'https://azure.microsoft.com/pricing/details/azure-openai/', verified:'official' },
    { id:'bed-k25',      vendor:'moonshot', model:'Kimi K2.5', ii:null, dep:true, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:0.6, pCache:0.6, pOut:3, src:'https://aws.amazon.com/bedrock/pricing/', verified:'official' },
    { id:'bed-glm5',     vendor:'zhipu', model:'GLM-5', ii:null, ch:'hyperscale', provider:'AWS Bedrock', cur:'USD', pIn:1, pCache:1, pOut:3.2, src:'https://aws.amazon.com/bedrock/pricing/', verified:'official' },
  ],

  plans: [
    { vendor:'OpenAI', plan:'ChatGPT Free / Go', fee:'$0 · Go 档低价(含广告)', quota:'Free 宣传「不限量文字对话」;GPT-6 Luna 全档可用;Plus 起解锁 GPT-6 Sol/6.1 Sol/Astra', src:'https://chatgpt.com/pricing/', verified:'official', note:'各档 USD 价格为 JS 渲染,本次未能直读' },
    { vendor:'OpenAI', plan:'ChatGPT Plus / Pro', fee:'Plus $20 · Pro 多档用量(3 档可选,价格 JS 未直读)', quota:'Pro 含常驻 Agent「Dot」与 Ultrafast 响应;GPT-6 世代全面替代 5.6 成为订阅主力', src:'https://chatgpt.com/pricing/', verified:'official' },
    { vendor:'Anthropic', plan:'Claude Pro', fee:'$20/月 · 年付合 $17/月', quota:'含 Opus/Sonnet/Haiku 5.5;Fable 按周限量的 50% 计;Claude Code 随附', src:'https://claude.com/pricing', verified:'official' },
    { vendor:'Anthropic', plan:'Claude Max 5× / 20×', fee:'$100 · $200/月', quota:'新增:各档捆绑 $100-200/月等值 API 额度;20× 档含 Fable 访问', src:'https://claude.com/pricing', verified:'official' },
    { vendor:'Google', plan:'Google AI Plus(原 AI Premium)', fee:'未直读(JS)', quota:'400GB 存储、2× Gemini、3.1 Pro + Deep Research、家庭共享 5 人', src:'https://one.google.com/about/google-ai-plans/', verified:'official' },
    { vendor:'Google', plan:'Google AI Ultra 5× / 20×(拆分新档)', fee:'未直读(JS)', quota:'20/30TB 存储、Deep Think、Project Genie、$40/$100 月度 Cloud 额度', src:'https://one.google.com/about/google-ai-plans/', verified:'official' },
    { vendor:'xAI', plan:'SuperGrok 系', fee:'官方价目页已不可达(此前 $30/$100/$300 为媒体口径)', quota:'x.ai/grok 仅列档位名与权益,无数值', src:'https://x.ai/grok', verified:'media' },
    { vendor:'智谱', plan:'GLM Coding Plan(国际)', fee:'官网口径「$18/月起」(各档明细在 JS 订阅页)', quota:'积分制:Lite 2000/5h+10000周,Pro 12000+60000,Max 28000+140000;非高峰积分 5 折;含 GLM-5.3/Flash + 4 个 MCP', src:'https://docs.z.ai/devpack/overview', verified:'official' },
    { vendor:'智谱', plan:'GLM Coding Plan(国内,积分制)', fee:'新版档位价官方未公开(媒体称 ¥118/¥538/¥1078);V1 续订价 ¥49/¥149/¥469', quota:'2026-07-30 起积分制;GLM-5.3 系数 输入6.9/缓存1.7/输出24 每万tokens;峰时仅工作日 14-18 点;官方称较按量最高省 92%', src:'https://docs.bigmodel.cn/cn/coding-plan/overview', verified:'media' },
    { vendor:'月之暗面', plan:'Kimi 会员(客户端)', fee:'档位价应用端 JS 不可读(此前 $19/$39/$99/$199)', quota:'API 平台明确不提供订阅制;会员权益以 App 内为准', src:'https://platform.kimi.com/docs/pricing', verified:'media' },
    { vendor:'阿里', plan:'百炼 Token Plan 个人版', fee:'官方帮助页现 404,状态不明(此前限时 ¥39/¥139/¥499)', quota:'以控制台订阅页为准', src:'https://help.aliyun.com/zh/model-studio/', verified:'media' },
    { vendor:'MiniMax', plan:'Token Plan(国内)', fee:'Plus ¥49 · Max ¥119 · Ultra ¥469/月', quota:'5小时+周双窗口;积分包 ¥30=4489 分起,365 天有效;超额按目录价折算积分', src:'https://platform.minimax.cn/docs/guides/pricing-token-plan', verified:'official' },
    { vendor:'GitHub', plan:'Copilot Free / Pro / Pro+ / Max', fee:'$0 · $10 · $39 · $100/月', quota:'credits 池模式(1 credit=$0.01);模型选择器随上游更新', src:'https://github.com/features/copilot/plans', verified:'official', note:'8-27 核实,未逐条复核' },
    { vendor:'Cursor', plan:'Hobby / Pro / Pro+ / Ultra', fee:'$0 · $20 · $60 · $200/月', quota:'自有模型池 + 第三方按 API 价后付费', src:'https://cursor.com/pricing', verified:'official', note:'8-27 核实,未逐条复核' },
    { vendor:'Kiro(AWS)', plan:'Free / Pro / Pro+ / Pro Max / Power', fee:'$0 · $20 · $40 · $100 · $200/月', quota:'月度积分 50/1000/2000/5000/10000', src:'https://kiro.dev/pricing', verified:'official', note:'8-27 核实,未逐条复核' },
  ],

  mechanics: [
    { channel:'OpenRouter', how:'预充值积分(卡 5.5% 费、Crypto 5%、支付宝);BYOK 每月 $25k 内免推理费,超出 5%;:free 每日 50-1000 次;:batch 恒 5 折;部分路由存在与官方不符的促销价(如 GLM-5.3、Kimi K3),已标注', src:'https://openrouter.ai/docs/faq' },
    { channel:'OpenCode Zen', how:'预充值 $20 起 + 卡费 4.4%+$0.30;零加价;公开价目文档页已下线(转入登录态 /auth),本次无法逐条核实目录', src:'https://opencode.ai/zen' },
    { channel:'DeepSeek', how:'峰/闲双价:闲时=峰时一半(UTC 工作日 01-04/06-10 点);9-14 起 V4-Pro 请求官方称按 V4.1-Flash 价路由(与定价页口径冲突,见 caveats)', src:'https://api-docs.deepseek.com/news/news260910' },
    { channel:'OpenAI / Anthropic / Google / Fireworks / Bedrock', how:'Batch 恒 5 折;OpenAI Flex 同 5 折、Fast 2×(astra/6.1-sol 另有 Ultrafast 6×);Anthropic Haiku 5.5 >100K 提示 5 倍加价', src:'https://developers.openai.com/api/docs/pricing' },
    { channel:'智谱 GLM Coding Plan', how:'非峰时(峰时仅工作日 14-18 点)积分半价;额度用尽即停;仅限官方指定工具', src:'https://docs.bigmodel.cn/cn/coding-plan/overview' },
    { channel:'MiniMax M3', how:'标准档「永久五折」;>512K 翻倍;优先档 ×1.5', src:'https://platform.minimax.io/docs/pricing/overview' },
  ],

  sources: [
    { name:'OpenAI API Pricing + Deprecations', url:'https://developers.openai.com/api/docs/pricing' },
    { name:'Anthropic Pricing', url:'https://platform.claude.com/docs/en/about-claude/pricing' },
    { name:'Google Gemini API Pricing(2026-10-09 更新)', url:'https://ai.google.dev/gemini-api/docs/pricing' },
    { name:'xAI Models & Pricing', url:'https://docs.x.ai/docs/models' },
    { name:'DeepSeek Pricing + 9-10 上线公告', url:'https://api-docs.deepseek.com/quick_start/pricing' },
    { name:'Z.ai / 智谱 Pricing', url:'https://docs.z.ai/guides/overview/pricing' },
    { name:'智谱 GLM Coding Plan 文档', url:'https://docs.bigmodel.cn/cn/coding-plan/overview' },
    { name:'Kimi Open Platform', url:'https://platform.kimi.ai/docs/pricing' },
    { name:'阿里云百炼计费页', url:'https://help.aliyun.com/zh/model-studio/billing-for-model-studio' },
    { name:'MiniMax Pricing(国际/国内)', url:'https://platform.minimax.io/docs/pricing/overview' },
    { name:'StepFun 定价详情', url:'https://platform.stepfun.com/docs/zh/guides/pricing/details' },
    { name:'Mistral Pricing', url:'https://docs.mistral.ai/inference/pricing' },
    { name:'OpenRouter Models API(2026-10-12 拉取)', url:'https://openrouter.ai/api/v1/models' },
    { name:'OpenRouter Space Bunny Alpha(stealth)', url:'https://openrouter.ai/stealth/space-bunny-alpha' },
    { name:'Artificial Analysis 模型榜(v4.3.2)', url:'https://artificialanalysis.ai/leaderboards/models' },
    { name:'人民币汇率中间价(中国货币网)', url:'https://www.chinamoney.com.cn/chinese/bkccpr/' },
  ],

  caveats: [
    '<b>世代更替</b>:OpenAI GPT-6 家族以 $2/$10 基价上市(约为 GPT-5.6 Sol 促销价一半);GPT-5.6 仍在售未停版(Sol 促销至 11-21)。Anthropic 5.5 世代全面降价:Opus 5.5 $4/$20、Haiku 5.5 较上代降 10 倍。',
    '<b>促销窗口</b>:Gemini 3.8/3.6 Flash 促销至 2026-12-31 后翻倍;Mistral Large 4 为上市 5 折价;GLM-5.3-Flash 官方 docs 标准价 $0.15/$0.5,开放平台 FAQ 另标限时五折,两处口径不一。',
    '<b>DeepSeek 路由冲突</b>:V4.1-Flash 9-10 上线;官方新闻称 9-14 起 V4-Pro 请求按 Flash 价路由,但定价页仍单列 V4-Pro 价目——图中取 V4-Pro 刊例峰价(保守)。',
    '<b>渠道价异常</b>:OpenRouter 上 GLM-5.3(输入 $0.079)、Kimi K3($0.73/$10)、GLM-5.2 等与官方价明显不符,疑为限时促销路由,波动大,已标「媒体口径」。',
    '<b>未核实 SKU</b>:GLM-5.3-Prime 官方渠道不存在(仅聚合在售);Qwen3.8-Max-Prime 官方 ¥24/¥72 与聚合 $4/$12 有差,以官方为准。',
    '<b>能力指数换版</b>:AA 由 v4.1.1 升至 v4.3.2,与 8 月旧分数不可直接比较;GLM-5.2、Kimi K2.7、Grok 4.5/4.3 等未收录模型的旧分已清空而非沿用。',
    '人民币价格按 2026-10-12 中间价 6.7313 折算;免费限量(:free)受每日请求数限制不参与斩杀;Space Bunny Alpha 为匿名 stealth 模型,无价格与指数,仅列说明。',
    'OpenCode Zen 公开价目文档已下线(转登录态),本版未纳入其渠道行;GPU 云与云转售部分行沿用 8-27 核实价,已逐条标注。',
  ],
};
