# 大模型斩杀线 · LLM Price–Capability Kill Line

> 横轴价格、纵轴能力,红色阶梯线是「斩杀线」(帕累托前沿):线上的点不存在**更便宜且更强**的对手;线右下方的报价已被斩杀。
> 覆盖 **官方直连 API / 中国区官方价 / OpenRouter / OpenCode Zen / GPU 云推理 / 云厂商转售 / 免费限量** 七类购买渠道,以及各厂商订阅与 Token 包(智谱 GLM Coding Plan、阿里 Token Plan、MiniMax Token Plan、ChatGPT/Claude/Gemini 订阅、Copilot/Cursor/Kiro 等)。

**在线访问**:https://mappedinfo.github.io/llm-price-kill-line/

数据渠道:官方直连(国际/中国区)· OpenRouter · **OpenCode Go 订阅** · GPU 云 · 云厂商转售 · 免费限量

## 功能特性(v2.1)

- **双视图**:`按量报价`(渠道刊例 + 斩杀线)与 `订阅真实价`(月费 ÷ 月可用 tokens,OC Go 官方额度 / ChatGPT·Claude 社区实测 / GLM Coding Plan 积分推导,带置信度标签)
- **混合口径切换**:`均衡 7:2:1`(AA 口径)↔ `重度 agent 97:2.5:0.5`(编码代理真实账单结构),全站价格与订阅真实价同步重算
- **URL 状态分享**:视图/口径/渠道/厂商/开关全部写入 hash,刷新与分享均还原(如 `#lang=zh&mode=subs&mix=agent`)
- **图表交互**:拖拽平移、滚轮缩放、Shift+框选缩放、方向键平移、`+/-` 缩放、`0` 或双击复位
- **数据来源**:real-api-pricing(订阅实测月量,MIT)已作为数据源之一接入并在来源区署名

## 技术栈(v2 重写)

- **React 18 + Vite** 组件化开发:筛选区、散点图、各面板均为独立组件(`src/components/`)
- **自绘 SVG 散点图**:点位用 CSS transform 过渡,筛选切换时平滑重排(替换此前动画生硬的方案);支持模型名标签开关、仅突出斩杀线模式
- **i18n**:中英双语一键切换(含 URL 同步)(`src/i18n/`),界面全量文案、状态标签、方法论与机制说明均双语;数据备注类长文本暂以中文原文为准
- 每个筛选组(渠道/厂商)均带 **全选 / 清空** 快捷操作,另有「重置全部筛选」

## 本地开发

```bash
npm install
npm run dev        # 开发服务器
npm run build      # 产出 dist/
npm run preview    # 预览构建产物(base=/llm-price-kill-line/)
```

推送 `main` 后由 GitHub Actions 自动构建并部署 Pages(`.github/workflows/deploy.yml`)。

## 数据快照

- 采集与核实日期:**2026-10-12**(上一版 2026-08-27;全部来源当日访问核实)
- 汇率:1 USD = 6.7313 CNY(中国货币网中间价)
- 能力口径:Artificial Analysis Intelligence Index **v4.3.2**(与 8 月的 v4.1.1 不可直接比较;未收录新版的模型能力分留空而非沿用旧分)
- 价格口径:混合价 = **0.7×缓存命中 + 0.2×输入 + 0.1×输出**(与 AA 相同的 7:2:1 加权);可切换纯输入/输出口径

### 更新数据

编辑 `src/data/models.js`(价格均为每 1M tokens、原币种),提交推送到 `main` 即自动重新部署。
标注约定:`verified:'official'` = 官方页面直接核实;`'media'` = 官方页面 JS 渲染无法直读、采用权威媒体报道。

## 主要发现(2026-10 快照,含 OpenCode Go 渠道)

1. **斩杀线只剩 3 个点位**:Muse Spark 1.3 Contributor@OC Go($0.04,48 分,以训练数据换折扣)→ Claude Sonnet 5.5 官方($1.47,56)→ Claude Opus 5.5 官方($2.94,58)。69 个在售报价中 66 个被斩杀——包括此前的中价位幸存者(Step-5、GLM-5.3、Haiku 5.5)。
2. **Anthropic 5.5 世代屠榜又降价**:Opus 5.5($4/$20)登顶 AA #1,Sonnet 5.5($2/$10)以 #2 能力分镇守中价位;Haiku 5.5 较上代降 10 倍(>100K 提示 5 倍加价)。
3. **OpenCode Go($10/月)作为新渠道收录**:每模型每月美元额度、批发价直传;其 Contributor 系列重写了价格-能力边界。MiMo-V2.6-Pro(小米,AA 开源第一 46 分,混合价 $0.18)在同价位斩杀 Grok 4.7。
4. **OpenAI GPT-6 世代半价接棒**:gpt-6-sol $2/$10 基价,但 GPT-6.1 Sol(52 分)被 Sonnet 5.5 斩杀;GPT-5.6 仍在售未停版(Sol 促销至 11-21)。
5. **新厂商入场**:腾讯混元 Hy4 preview(770B/49B,Apache 2.0)、美团 LongCat-2.0(MIT)、小米 MiMo-V2.6、阶跃 Step-5 Preview(AA 44 分,Go 档限时免费不限量)。
6. **渠道价异常与未证实 SKU**:OpenRouter 上 GLM-5.3/Kimi K3 促销路由与官方明显不符;GLM-5.3-Prime 官方渠道不存在;Space Bunny 在 Go 有真实售价($0.15/$0.6)但开发者仍匿名(强证据指向 MiniMax M3.1-Flash)。
7. **DeepSeek V4.1-Flash**(9-10 上线)闲时 $0.15/$0.6;"V4-Pro 请求按 Flash 价路由"与定价页单列价目存在官方口径冲突,图中取保守峰价。

## 口径限制

- 促销价快照:GPT-5.6 Sol(至 2026-11-21)、Gemini 3.6/3.7 Flash(至 2026-12-31)、GLM-5.3-Flash(至 2026-09-09)、MiniMax M3(永久五折)。
- DeepSeek 全系峰/闲双价,图表取峰时价(闲时一律半价)。
- 智谱国内 API 刊例价、新版 Coding Plan 月费、Kimi 国内会员价等无法从官方静态页核实,已标"媒体口径"。
- AA 已停更 SWE-bench Verified 与按模型 Coding Index,本页统一用 Intelligence Index v4.1.1。

## License

MIT · 数据以各厂商官网实时页面为准 · [Mappedinfo](https://github.com/Mappedinfo)
