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

- 采集与核实日期:**2026-10-12**(上一版 2026-08-27;全部来源当日访问核实)
- 汇率:1 USD = 6.7313 CNY(中国货币网中间价)
- 能力口径:Artificial Analysis Intelligence Index **v4.3.2**(与 8 月的 v4.1.1 不可直接比较;未收录新版的模型能力分留空而非沿用旧分)
- 价格口径:混合价 = **0.7×缓存命中 + 0.2×输入 + 0.1×输出**(与 AA 相同的 7:2:1 加权);可切换纯输入/输出口径

### 更新数据

编辑 `src/data/models.js`(价格均为每 1M tokens、原币种),提交推送到 `main` 即自动重新部署。
标注约定:`verified:'official'` = 官方页面直接核实;`'media'` = 官方页面 JS 渲染无法直读、采用权威媒体报道。

## 主要发现(2026-10 快照)

1. **斩杀线 6 个点位**(当前在售):Claude Haiku 5.5 官方($0.08,43 分)→ Step-5 Preview@OpenRouter($0.51,44)→ GLM-5.3@OpenRouter 促销路由($0.54,45)→ Muse Spark 1.3($0.78,48)→ Claude Sonnet 5.5 官方($1.47,56)→ Claude Opus 5.5 官方($2.94,58)。61 个在售报价中 54 个被斩杀。
2. **Anthropic 5.5 世代屠榜又降价**:Opus 5.5($4/$20)登顶 AA #1,Sonnet 5.5($2/$10)以 #2 的能力分站上斩杀线;Haiku 5.5 较上代降 10 倍成为最便宜的线上点(>100K 提示另有 5 倍加价)。
3. **OpenAI GPT-6 世代半价接棒**:gpt-6-sol $2/$10 基价(约为 5.6 Sol 促销价一半),但 GPT-6.1 Sol(52 分)在同价位被 Sonnet 5.5(56 分)斩杀;GPT-6 Astra($10/$50)被 Opus 5.5 斩杀。GPT-5.6 仍在售未停版。
4. **新面孔**:阶跃 Step-5 Preview(¥7/¥20,AA 44 分)10-08 上架 OpenRouter 即进入斩杀线;Mistral Large 4(上市 5 折 $0.68/$2.09)暂被 Haiku 压制;Google Gemini 4 Argon 已上榜(53 分)但官方定价页尚未挂牌。
5. **渠道价异常**:OpenRouter 上 GLM-5.3(输入 $0.079)、Kimi K3($0.73/$10)等促销路由与官方价明显不符,直接改变斩杀线形态,已全部标注「媒体口径」;同模型最大渠道价差 ×3.6(DeepSeek V4 Pro,含 Fireworks 缓存价未公布的口径因素)。
6. **DeepSeek V4.1-Flash**(9-10 上线)闲时 $0.15/$0.6,但混合价仍被 Haiku 5.5 压制;官方新闻称 V4-Pro 请求 9-14 起按 Flash 价路由,与定价页单列价目存在口径冲突。
7. **Space Bunny Alpha** 为 OpenRouter 匿名 stealth 模型(社区猜为 MiniMax 系,未证实),无官方价格与能力指数,仅列说明不入图。

## 口径限制

- 促销价快照:GPT-5.6 Sol(至 2026-11-21)、Gemini 3.6/3.7 Flash(至 2026-12-31)、GLM-5.3-Flash(至 2026-09-09)、MiniMax M3(永久五折)。
- DeepSeek 全系峰/闲双价,图表取峰时价(闲时一律半价)。
- 智谱国内 API 刊例价、新版 Coding Plan 月费、Kimi 国内会员价等无法从官方静态页核实,已标"媒体口径"。
- AA 已停更 SWE-bench Verified 与按模型 Coding Index,本页统一用 Intelligence Index v4.1.1。

## License

MIT · 数据以各厂商官网实时页面为准 · [Mappedinfo](https://github.com/Mappedinfo)
