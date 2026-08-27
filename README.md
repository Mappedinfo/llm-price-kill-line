# 大模型斩杀线 · LLM Price–Capability Kill Line

> 横轴价格、纵轴能力,红色阶梯线是「斩杀线」(帕累托前沿):线上的点不存在**更便宜且更强**的对手;线右下方的报价已被斩杀。
> 覆盖 **官方直连 API / 中国区官方价 / OpenRouter / OpenCode Zen / GPU 云推理 / 云厂商转售 / 免费限量** 七类购买渠道,以及各厂商订阅与 Token 包(智谱 GLM Coding Plan、阿里 Token Plan、MiniMax Token Plan、ChatGPT/Claude/Gemini 订阅、Copilot/Cursor/Kiro 等)。

**在线访问**:https://mappedinfo.github.io/llm-price-kill-line/

## 技术栈(v2 重写)

- **React 18 + Vite** 组件化开发:筛选区、散点图、各面板均为独立组件(`src/components/`)
- **自绘 SVG 散点图**:点位用 CSS transform 过渡,筛选切换时平滑重排(替换此前动画生硬的方案);支持模型名标签开关、仅突出斩杀线模式
- **i18n**:中英双语一键切换(`src/i18n/`),界面全量文案、状态标签、方法论与机制说明均双语;数据备注类长文本暂以中文原文为准
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

- 采集与核实日期:**2026-08-27**(全部来源当日访问核实)
- 汇率:1 USD = 6.784 CNY(中国货币网中间价)
- 能力口径:Artificial Analysis Intelligence Index **v4.1.1**(智能体 34% + 编码 24% + 科学推理 24% + 通用 18%)
- 价格口径:混合价 = **0.7×缓存命中 + 0.2×输入 + 0.1×输出**(与 AA 相同的 7:2:1 加权);可切换纯输入/输出口径

### 更新数据

编辑 `src/data/models.js`(价格均为每 1M tokens、原币种),提交推送到 `main` 即自动重新部署。
标注约定:`verified:'official'` = 官方页面直接核实;`'media'` = 官方页面 JS 渲染无法直读、采用权威媒体报道。

## 主要发现(2026-08 快照)

1. **斩杀线只有 5 个点位**(默认视图,当前在售):DeepSeek V4 Flash@OpenRouter($0.03,52 分)→ GLM-5.3-Flash 官方($0.05,57 分)→ GLM-5.3 官方($0.90,60 分)→ Grok 4.6 官方($1.35,61 分)→ Claude Opus 5 官方($3.85,63 分)。其余在售报价全部被斩杀——包括 GPT-5.6 全系(Sol 被 Grok 4.6 以不到一半的价格同分斩杀,Luna 被 GLM-5.3-Flash 低价高分斩杀)与 Gemini 全系。
2. **聚合渠道出现"倒挂"**:OpenRouter 的 DeepSeek V4 Flash 只有官方峰价 1/7;Gemini 3.7 Flash 路由价约为官方促销价一半;GPT-5.6 Sol 在 OpenRouter/Zen 享 5 折;GLM-5.2 聚合价低于官方 15%。**同模型最大渠道价差 ×7.1**,GPT-5.6 Sol 达 ×2.8(Azure vs OpenRouter)。
3. **Azure 转售 GPT-5.6 Sol 比 OpenAI 直连贵 25-50%**,Bedrock 地理端点 +10%;超大规模云只在合规场景有意义。
4. **开源三强**(Kimi K3、GLM-5.3、Qwen3.8-2.4T)能力分 58-60 已逼近闭源旗舰(61-63),价格低 2-4 倍;DeepInfra 的 GLM-5.2 比官方再低 46%。
5. **编程 Token 包是单位成本最低的正规渠道**:智谱 GLM Coding Plan 官方口径"比按量 API 最高省 92%"(积分系数:GLM-5.3 输入 6.9/缓存 1.7/输出 24 积分每万 tokens,非峰时再半价);阿里 Token Plan(¥39 起)与 MiniMax Token Plan(¥49 起)同类。
6. **免费限量层**真实存在:OpenRouter 的 GLM-5.2:free(能力 53 分)每日 1000 次,轻量个人使用几乎零成本。

## 口径限制

- 促销价快照:GPT-5.6 Sol(至 2026-11-21)、Gemini 3.6/3.7 Flash(至 2026-12-31)、GLM-5.3-Flash(至 2026-09-09)、MiniMax M3(永久五折)。
- DeepSeek 全系峰/闲双价,图表取峰时价(闲时一律半价)。
- 智谱国内 API 刊例价、新版 Coding Plan 月费、Kimi 国内会员价等无法从官方静态页核实,已标"媒体口径"。
- AA 已停更 SWE-bench Verified 与按模型 Coding Index,本页统一用 Intelligence Index v4.1.1。

## License

MIT · 数据以各厂商官网实时页面为准 · [Mappedinfo](https://github.com/Mappedinfo)
