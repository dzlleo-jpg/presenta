/**
 * =============================================
 * Presenta - AI Provider with ppt-skills-v9 Integration
 * 两阶段生成：Planner → Renderer
 * =============================================
 */

const APIProvidersSkill = {

  // ============================================
  // Mock Provider（开发/演示用）
  // ============================================
  mock: {
    name: 'Mock AI (Skill Mode)',

    async generatePlanning(documentContent, wizardAnswers, options = {}) {
      const { onProgress, onComplete, promptOverride } = options;
      const steps = 15;

      // 模拟逐阶段生成
      const stages = [
        { progress: 10, message: '📖 分析文档结构…' },
        { progress: 20, message: '🎯 识别报告类型…' },
        { progress: 30, message: '🎨 推断视觉主题…' },
        { progress: 40, message: '📊 选择叙事框架…' },
        { progress: 50, message: '💡 提炼核心论点…' },
        { progress: 60, message: '📑 设计章节结构…' },
        { progress: 70, message: '🎭 规划情绪节奏…' },
        { progress: 80, message: '📝 逐页内容规划…' },
        { progress: 90, message: '🔍 全局视觉审查…' },
        { progress: 100, message: '✅ 生成完成' }
      ];

      for (const stage of stages) {
        await sleep(200 + Math.random() * 300);
        if (onProgress) {
          onProgress({
            type: 'progress',
            progress: stage.progress,
            message: stage.message
          });
        }
      }

      // 生成示例 planning.yaml（根据 combo 选择格式）
      const isAperture = wizardAnswers?.combo === 'aperture' || !!promptOverride;
      const planningYaml = isAperture
        ? this.buildApertureMockPlanning(documentContent, wizardAnswers)
        : this.buildMockPlanning(documentContent, wizardAnswers);

      if (onComplete) onComplete({ planningYaml });
      return planningYaml;
    },

    buildMockPlanning(content, answers) {
      const title = answers.title || '融资路演演示文稿';
      const audience = answers.audience || '投资人';
      const pageCount = Math.max(5, Math.min(parseInt(answers.pageCount, 10) || 12, 20));
      const mood = answers.mood || '高端品牌';

      const presetMap = {
        '硬核科技感': 'tech-dark-mode',
        '高端品牌': 'editorial-swiss',
        '稳重大气': 'editorial-swiss',
        '明快创意': 'moodboard-collage',
        'editorial-swiss': 'editorial-swiss',
        'magazine-big-type': 'magazine-big-type',
        'minimal-architectural': 'minimal-architectural',
        'moodboard-collage': 'moodboard-collage',
        'luxury-editorial': 'luxury-editorial',
        'tech-dark-mode': 'tech-dark-mode'
      };
      const preset = presetMap[mood] || 'editorial-swiss';

      const slides = this.buildMockSlides({ title, pageCount });
      const chapters = this.groupSlidesByChapter(slides);
      const transitionTypes = ['fade', 'slide-left', 'scale-in', 'wipe'];
      const transitions = slides.slice(0, -1).map((slide, index) => ({
        from: index + 1,
        to: index + 2,
        type: transitionTypes[index % transitionTypes.length]
      }));

      return this.formatMockPlanning({
        title,
        audience,
        pageCount: slides.length,
        mood,
        preset,
        chapters,
        transitions
      });
    },

    buildMockSlides({ title, pageCount }) {
      const essentialSlides = [
        {
          chapterName: '第一章：开场',
          page_role: 'cover',
          title,
          page_intent: '建立第一印象，传递品牌调性',
          director_note: '【情绪定调】全篇情绪起点，高对比度+大留白，建立高端感。\n【内容载体】品牌名+一句话定位，不需要图表。\n【视觉主角】品牌名是绝对主角，字号不低于80px。\n【空间分配】品牌名占页面中心，副标题在下方1/3处。\n【演讲配合】演讲者自我介绍后停顿2秒，让观众看清品牌名。',
          sidebar: '',
          insight: '',
          items: [`重新定义${title.slice(0, 6) || '行业'}的增长逻辑`],
          transcript: '大家好，我是创始人。今天我想和大家分享一个我们观察了三年才发现的机会。'
        },
        {
          chapterName: '第二章：市场分析',
          page_role: 'support',
          title: '市场规模达千亿级',
          page_intent: "从'市场存在'到'机会很大'，用数据建立可信度",
          director_note: '【情绪定调】支撑页，信息密度中等，建立专业感。\n【内容载体】核心数字+趋势图表，用数据说话。\n【视觉主角】千亿级数字是绝对主角，至少120px，强调动画从0跳动到目标值。\n【空间分配】数字占页面左侧60%，右侧放简化趋势图。\n【演讲配合】说完“千亿级”停顿3秒，让观众感受数字分量。',
          sidebar: '数据来源：艾瑞咨询，2024',
          insight: '年复合增长率25%，赛道仍在加速',
          items: [
            '**1200亿** | 市场规模 | 2024年整体规模',
            '**25%** | 年复合增长率 | 未来五年预测',
            '**Top3** | 市场集中度 | 头部效应明显'
          ],
          chart: {
            chart_type: 'line',
            data: {
              type: 'line',
              labels: ['2020', '2021', '2022', '2023', '2024'],
              datasets: [
                {
                  label: '市场规模（亿元）',
                  data: [500, 680, 850, 1020, 1200]
                }
              ],
              source: '艾瑞咨询，2024'
            }
          },
          transcript: '先看市场规模。2024年整体规模达到1200亿，年复合增长率25%。这不是存量博弈，而是增量市场。'
        },
        {
          chapterName: '第二章：市场分析',
          page_role: 'climax',
          title: '结构性拐点已出现',
          page_intent: "全篇情绪最高点，让观众意识到'机会窗口正在关闭'",
          director_note: '【情绪定调】全篇高潮，大留白+高对比度，不超过两种颜色。\n【内容载体】纯数字，不需要图表，数字本身就是视觉。\n【视觉主角】40%是绝对主角，字号至少160px。强调动画从0跳动到40%。\n【空间分配】40%占左侧2/3，右侧竖排辅助数字，字号差距3倍以上。\n【演讲配合】说完“40%”停顿3秒。静态降级：所有元素同时显示。',
          sidebar: '',
          insight: '渗透率突破临界点，竞争格局即将固化',
          items: [
            '**40%** | 市场渗透率 | 历史性突破',
            '**2倍** | 增速对比 | vs 行业平均'
          ],
          transcript: '但关键不是规模，而是渗透率。40%意味着每10个用户就有4个选择了这个品类。窗口期正在关闭。'
        },
        {
          chapterName: '第三章：解决方案',
          page_role: 'support',
          title: '差异化定位：效率提升3倍',
          page_intent: '展示核心产品价值',
          director_note: '【情绪定调】支撑页，用对比建立优势感。\n【内容载体】对比结构，传统方案和我们的方案并置。\n【视觉主角】3倍效率提升是绝对主角，大号数字+对比色。\n【空间分配】左右对比布局，左侧传统，右侧强调。\n【演讲配合】先讲左侧痛点，再讲右侧解法，形成对比张力。',
          sidebar: '基于1024份用户调研',
          insight: '不是功能堆砌，是体验重构',
          items: [
            '传统方案：平均耗时8小时',
            '我们的方案：平均耗时2.5小时',
            '效率提升：**3倍**'
          ],
          transcript: '我们的解法很简单：把8小时压缩到2.5小时。不是功能更多，而是体验重构。'
        },
        {
          chapterName: '第四章：总结',
          page_role: 'closing',
          title: '一起创造新品类',
          page_intent: '强化核心论点，留下行动号召',
          director_note: '【情绪定调】结尾页，回归品牌色，建立信任感。\n【内容载体】核心结论+行动建议，简洁有力。\n【视觉主角】“一起创造新品类”是绝对主角，字号至少56px。\n【空间分配】文字居中，下方留白放联系方式或二维码。\n【演讲配合】演讲者总结后，邀请提问。',
          sidebar: '',
          insight: '期待与您合作',
          items: [
            '市场窗口期：12-18个月',
            '团队已验证商业模式',
            '寻求战略投资加速扩张'
          ],
          transcript: '总结一下：千亿市场，拐点已现，我们提供3倍效率提升。期待与您一起创造这个新品类。'
        }
      ];

      if (pageCount >= 6) {
        essentialSlides.splice(1, 0, {
          chapterName: '第一章：开场',
          page_role: 'chapter_break',
          title: '市场机会',
          page_intent: '引入话题，建立期待',
          director_note: '【情绪定调】过渡页，情绪稍降，为下一章铺垫。\n【内容载体】章节编号+标题，全出血图片或纯色背景。\n【视觉主角】“第一章”和“市场机会”上下排列，字号差距明显。\n【空间分配】文字居左或居中，留出呼吸空间。\n【演讲配合】快速翻过，不停留。',
          sidebar: '',
          insight: '',
          items: [],
          transcript: ''
        });
      }

      if (pageCount >= 7) {
        essentialSlides.splice(essentialSlides.length - 2, 0, {
          chapterName: '第三章：解决方案',
          page_role: 'chapter_break',
          title: '我们的解法',
          page_intent: '过渡，建立期待',
          director_note: '【情绪定调】过渡页，为解决方案章节铺垫。\n【内容载体】章节标题，简洁有力。\n【视觉主角】“第三章”小字，“我们的解法”大字。\n【空间分配】居中偏上，留出下方空间。\n【演讲配合】快速翻过。',
          sidebar: '',
          insight: '',
          items: [],
          transcript: ''
        });
      }

      let supplementalIndex = 0;
      while (essentialSlides.length < pageCount) {
        essentialSlides.splice(
          essentialSlides.length - 1,
          0,
          this.buildSupplementalSlide(supplementalIndex++)
        );
      }

      return essentialSlides;
    },

    buildSupplementalSlide(index) {
      const blueprints = [
        {
          chapterName: '第二章：市场分析',
          page_role: 'support',
          title: '增长驱动因素正在叠加',
          page_intent: '解释为什么增长不是偶然，而是多因素共振',
          director_note: '【情绪定调】支撑页，承接增长结论继续加固信心。\n【内容载体】三组驱动力并列，适合图标+短句。\n【视觉主角】政策、技术、用户三类驱动并列出现。\n【空间分配】左中右三列平均分布。\n【演讲配合】逐列展开，最后回扣增长持续性。',
          sidebar: '行业访谈摘要',
          insight: '供给、需求、政策三端同时发力',
          items: [
            '**政策** | 补贴退坡后仍有拉动 | 地方配套延续',
            '**技术** | 电池成本持续下降 | 产品力明显提升',
            '**用户** | 心智教育完成 | 复购与推荐率上升'
          ],
          transcript: '增长并不是偶发事件，而是政策、技术、用户三股力量一起推动的结果。'
        },
        {
          chapterName: '第二章：市场分析',
          page_role: 'comparison',
          title: '竞争格局正在重排',
          page_intent: '说明市场不仅在增长，而且份额正在重构',
          director_note: '【情绪定调】对比页，制造紧迫感。\n【内容载体】传统玩家与新势力的对比。\n【视觉主角】右侧新势力优势用强调色突出。\n【空间分配】左右各一列，信息密度均衡。\n【演讲配合】先讲旧格局，再切入新格局替代。',
          sidebar: '',
          insight: '不是线性竞争，而是范式切换',
          items: [
            '传统玩家：渠道深但产品更新慢',
            '传统玩家：利润稳定但创新不足',
            '新势力：软件体验更强',
            '新势力：用户运营更高频'
          ],
          transcript: '更重要的是竞争格局在重排。旧优势不再稳固，新优势正在形成。'
        },
        {
          chapterName: '第二章：市场分析',
          page_role: 'insight',
          title: '用户心智已经被彻底教育',
          page_intent: '用一句话拔高认知，把“采用成本”讲透',
          director_note: '【情绪定调】短暂收束，用一句判断统一前文。\n【内容载体】大字金句，不需要图表。\n【视觉主角】整句观点本身。\n【空间分配】大面积留白，文字居中。\n【演讲配合】说完后停顿2秒，让观众消化。',
          sidebar: '',
          insight: '',
          items: ['用户调研，2024'],
          transcript: '一旦用户相信新方案更好，增长就不再取决于教育市场，而取决于谁能更快交付。'
        },
        {
          chapterName: '第二章：市场分析',
          page_role: 'support',
          title: '基础设施仍是关键瓶颈',
          page_intent: '承认问题，避免结论过度乐观',
          director_note: '【情绪定调】理性回落，用风险识别建立可信度。\n【内容载体】问题清单+优先级排序。\n【视觉主角】“瓶颈”两个字形成张力。\n【空间分配】左侧问题、右侧解决路径。\n【演讲配合】先讲风险，再讲为何风险可控。',
          sidebar: '调研覆盖12个城市',
          insight: '真正的机会，往往来自未被解决的摩擦',
          items: [
            '补能效率仍不稳定',
            '区域覆盖差异明显',
            '配套服务体验参差不齐'
          ],
          transcript: '我们并不回避问题。基础设施仍是行业最大瓶颈，但也恰恰意味着最大的改进空间。'
        },
        {
          chapterName: '第三章：解决方案',
          page_role: 'comparison',
          title: '传统方案 vs 智能方案',
          page_intent: '把产品差异讲清楚，帮助观众快速形成偏好',
          director_note: '【情绪定调】理性对比，用结构胜出。\n【内容载体】左右对照，信息颗粒度一致。\n【视觉主角】右侧智能方案的结果指标。\n【空间分配】左右50/50，对齐展示。\n【演讲配合】一一对应讲解，节奏明确。',
          sidebar: '',
          insight: '竞争力来自系统效率，而不是单点功能',
          items: [
            '传统方案：人工配置，链路更长',
            '传统方案：数据反馈滞后',
            '智能方案：自动编排，实时响应',
            '智能方案：结果可追踪、可复用'
          ],
          transcript: '差异化不在某一个功能点，而在于整条链路是否被重新设计。'
        },
        {
          chapterName: '第三章：解决方案',
          page_role: 'support',
          title: '商业模式具备规模效应',
          page_intent: '说明解法不仅有效，而且具备扩张性',
          director_note: '【情绪定调】支撑页，把产品价值过渡到商业价值。\n【内容载体】收入、成本、复购三个指标。\n【视觉主角】复购率和边际成本下降趋势。\n【空间分配】数字卡片与注释并列。\n【演讲配合】先讲收入质量，再讲扩张弹性。',
          sidebar: '内部测算模型',
          insight: '收入增长和效率提升同步发生',
          items: [
            '**65%** | 复购占比 | 收入质量更高',
            '**-32%** | 边际交付成本 | 自动化带来改善',
            '**18个月** | 回本周期 | 可接受且在下降'
          ],
          transcript: '如果只讲功能，故事是不完整的。真正打动投资人的，是这套解法还能规模化复制。'
        },
        {
          chapterName: '第三章：解决方案',
          page_role: 'support',
          title: '执行路径已经明确',
          page_intent: '证明团队不是停留在概念，而是已经有路线图',
          director_note: '【情绪定调】支撑页，把愿景收束到执行。\n【内容载体】阶段目标+里程碑。\n【视觉主角】未来三个阶段的节奏感。\n【空间分配】横向时间轴布局。\n【演讲配合】逐阶段说明目标与验证指标。',
          sidebar: '2026执行计划',
          insight: '路线越清晰，风险越容易被管理',
          items: [
            '阶段一：完成标杆客户复制',
            '阶段二：开放渠道合作网络',
            '阶段三：建立行业标准能力'
          ],
          transcript: '我们不是先融资再想路径，而是路径已经清楚，融资只是帮助我们加速。'
        },
        {
          chapterName: '第四章：总结',
          page_role: 'support',
          title: '未来18个月执行路线图',
          page_intent: '让收尾更具行动感，减少抽象感',
          director_note: '【情绪定调】总结前的执行页，稳住信任。\n【内容载体】里程碑与资源配置。\n【视觉主角】18个月的阶段目标。\n【空间分配】上半部分时间轴，下半部分资源分配。\n【演讲配合】边讲时间轴边给出验收口径。',
          sidebar: '按季度滚动复盘',
          insight: '执行路线比愿景更能建立信任',
          items: [
            '**Q1** | 打磨样板案例 | 验证交付效率',
            '**Q2** | 扩展区域复制 | 建立销售飞轮',
            '**Q3-Q4** | 完成融资目标 | 放大市场份额'
          ],
          transcript: '接下来的18个月，我们只做三件事：验证、复制、放大。'
        },
        {
          chapterName: '第四章：总结',
          page_role: 'support',
          title: '团队优势与关键里程碑',
          page_intent: '补强“为什么是你们能赢”',
          director_note: '【情绪定调】支撑页，补足团队可信度。\n【内容载体】团队能力、里程碑、关键数据。\n【视觉主角】里程碑事实，而非口号。\n【空间分配】左侧团队，右侧结果。\n【演讲配合】用事实而不是形容词讲团队。',
          sidebar: '核心团队平均从业10年',
          insight: '团队壁垒来自持续兑现结果',
          items: [
            '连续3个版本按期上线',
            '头部客户已完成付费验证',
            '核心成员覆盖产品、技术、商业化'
          ],
          transcript: '市场机会很重要，但最后能不能赢，还是取决于谁能持续兑现。'
        },
        {
          chapterName: '第四章：总结',
          page_role: 'support',
          title: '融资用途与回报预期',
          page_intent: '把资金用途讲清楚，减少不确定性',
          director_note: '【情绪定调】理性收尾，用资金计划建立透明度。\n【内容载体】用途拆分+预期结果。\n【视觉主角】资金与结果的映射关系。\n【空间分配】左侧用途，右侧产出。\n【演讲配合】先讲钱怎么花，再讲为什么能带来回报。',
          sidebar: '本轮融资计划',
          insight: '资金不是补漏洞，而是加速验证过的飞轮',
          items: [
            '**40%** | 产品研发 | 提升智能化能力',
            '**35%** | 市场拓展 | 建立区域复制体系',
            '**25%** | 交付与运营 | 保证增长质量'
          ],
          transcript: '这笔钱的用途非常清楚：研发、市场、交付，每一部分都直接服务于增长目标。'
        }
      ];

      const cycle = Math.floor(index / blueprints.length);
      const blueprint = JSON.parse(JSON.stringify(blueprints[index % blueprints.length]));

      if (cycle > 0) {
        blueprint.title += `（补充${cycle + 1}）`;
        blueprint.insight = blueprint.insight ? `${blueprint.insight} · 扩展视角` : '';
        blueprint.transcript += ' 这一页用于补充更细的论据。';
      }

      return blueprint;
    },

    groupSlidesByChapter(slides) {
      const chapters = [];
      slides.forEach((slide) => {
        let chapter = chapters.find((item) => item.name === slide.chapterName);
        if (!chapter) {
          chapter = { name: slide.chapterName, slides: [] };
          chapters.push(chapter);
        }
        const slideCopy = { ...slide };
        delete slideCopy.chapterName;
        chapter.slides.push(slideCopy);
      });
      return chapters;
    },

    yamlQuote(value) {
      return `"${String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    },

    yamlInlineArray(items) {
      return `[${items.map((item) => this.yamlQuote(item)).join(', ')}]`;
    },

    formatBlock(key, value, indent) {
      const spaces = ' '.repeat(indent);
      if (!value) {
        return `${spaces}${key}: ""`;
      }
      return [
        `${spaces}${key}: |`,
        ...String(value).split('\n').map((line) => `${spaces}  ${line}`)
      ].join('\n');
    },

    formatChartYaml(chart, indent) {
      if (!chart) return '';
      const spaces = ' '.repeat(indent);
      const child = ' '.repeat(indent + 2);
      const dataset = chart.data?.datasets?.[0] || {};
      return [
        `${spaces}chart:`,
        `${child}chart_type: ${this.yamlQuote(chart.chart_type || 'line')}`,
        `${child}data:`,
        `${child}  type: ${this.yamlQuote(chart.data?.type || chart.chart_type || 'line')}`,
        `${child}  labels: ${this.yamlInlineArray(chart.data?.labels || [])}`,
        `${child}  datasets:`,
        `${child}    - label: ${this.yamlQuote(dataset.label || '数据')}`,
        `${child}      data: [${(dataset.data || []).join(', ')}]`,
        `${child}  source: ${this.yamlQuote(chart.data?.source || '')}`
      ].join('\n');
    },

    formatSlideYaml(slide, indent) {
      const spaces = ' '.repeat(indent);
      const child = ' '.repeat(indent + 2);
      const lines = [
        `${spaces}- page_role: ${this.yamlQuote(slide.page_role)}`,
        `${child}title: ${this.yamlQuote(slide.title)}`,
        `${child}page_intent: ${this.yamlQuote(slide.page_intent || '')}`,
        this.formatBlock('director_note', slide.director_note, indent + 2),
        `${child}sidebar: ${this.yamlQuote(slide.sidebar || '')}`,
        `${child}insight: ${this.yamlQuote(slide.insight || '')}`
      ];

      if (slide.items?.length) {
        lines.push(`${child}items:`);
        slide.items.forEach((item) => {
          lines.push(`${child}  - ${this.yamlQuote(item)}`);
        });
      } else {
        lines.push(`${child}items: []`);
      }

      if (slide.chart) {
        lines.push(this.formatChartYaml(slide.chart, indent + 2));
      }

      var imgRole = 'none';
      var imgScale = 'none';
      var imgBrief = '';
      if (slide.page_role === 'cover') { imgRole = 'atmospheric'; imgScale = 'full-bleed'; imgBrief = '品牌氛围背景'; }
      else if (slide.page_role === 'chapter_break') { imgRole = 'atmospheric'; imgScale = 'full-bleed'; imgBrief = '章节过渡氛围'; }
      else if (slide.page_role === 'closing') { imgRole = 'atmospheric'; imgScale = 'full-bleed'; imgBrief = '结尾氛围'; }
      lines.push(`${child}imagery:`);
      lines.push(`${child}  role: ${this.yamlQuote(imgRole)}`);
      lines.push(`${child}  scale: ${this.yamlQuote(imgScale)}`);
      lines.push(`${child}  content_brief: ${this.yamlQuote(imgBrief)}`);

      lines.push(this.formatBlock('transcript', slide.transcript, indent + 2));
      return lines.join('\n');
    },

    buildApertureMockPlanning(content, answers) {
      const title = answers.title || '融资路演演示文稿';
      const audience = answers.audience || '投资人';
      const pageCount = Math.max(5, Math.min(parseInt(answers.pageCount, 10) || 12, 20));
      const subsystem = answers.mood || 'default_deep';

      const subsystemReasonMap = {
        default_deep: '科技/金融项目，深色基底传递专业感',
        deep_petrol: '环保/可持续主题，蓝绿色调传递信任',
        light_paper: '学术/咨询场景，暖纸色传递温度',
        color_block: '品牌/创意项目，色块构图传递活力',
        japanese_editorial: '文化/高端场景，极致留白传递品质',
        data_palette: '数据密集型报告，信息可视化优先'
      };

      const yaml = [
        'schema_version: "aperture-1.0"',
        `title: ${this.yamlQuote(title)}`,
        `audience: ${this.yamlQuote(audience)}`,
        `page_count: ${pageCount}`,
        'narrative_framework: "E"',
        `framework_reason: ${this.yamlQuote('故事驱动，建立情感连接')}`,
        `core_thesis: ${this.yamlQuote('我们不是在卖产品，而是在创造一个新的市场品类')}`,
        '',
        `subsystem: "${subsystem}"`,
        `subsystem_reason: ${this.yamlQuote(subsystemReasonMap[subsystem] || '默认深色')}`,
        'variance_dial: 2',
        `global_mood: ${this.yamlQuote('克制而精密，数据驱动的叙事')}`,
        '',
        'chapters:',
        `  - name: ${this.yamlQuote('开场')}`,
        '    slides:',
        `      - page_role: "cover"`,
        `        title: ${this.yamlQuote(title)}`,
        `        page_intent: "建立第一印象"`,
        '        director_note: |',
        '          【情绪定调】全篇起点，高对比度+大留白',
        '          【视觉主角】品牌名，字号≥96px',
        '          【空间分配】Stage 70% / Info 30%',
        '        sidebar: ""',
        '        insight: ""',
        '        stage_zone:',
        '          content_type: "hero-text"',
        `          hero_text: ${this.yamlQuote(title)}`,
        '          scale: "full"',
        '        info_zone:',
        '          layout: "single"',
        '          items_count: 1',
        '        imagery:',
        '          role: "atmospheric"',
        '          scale: "full-bleed"',
        '          content_brief: "抽象科技纹理"',
        '        items:',
        `          - ${this.yamlQuote('重新定义' + (title.slice(0, 6) || '行业') + '的增长逻辑')}`,
        '',
        `  - name: ${this.yamlQuote('市场分析')}`,
        '    slides:',
        '      - page_role: "support"',
        `        title: ${this.yamlQuote('市场规模达千亿级')}`,
        '        page_intent: "用数据建立可信度"',
        '        director_note: |',
        '          【情绪定调】支撑页，信息密度中等',
        '          【视觉主角】千亿级数字，≥96px',
        '          【空间分配】Stage 50% / Info 50%',
        '        sidebar: "数据来源：艾瑞咨询，2024"',
        '        insight: "年复合增长率25%"',
        '        stage_zone:',
        '          content_type: "hero-number"',
        '          hero_text: "1200亿"',
        '          scale: "compact"',
        '        info_zone:',
        '          layout: "bento-2x2"',
        '          items_count: 3',
        '        imagery:',
        '          role: "none"',
        '          scale: "none"',
        '          content_brief: ""',
        '        items:',
        '          - "**1200亿** | 市场规模 | 2024年整体规模"',
        '          - "**25%** | 年复合增长率 | 未来五年预测"',
        '          - "**Top3** | 市场集中度 | 头部效应明显"',
        '        chart:',
        '          chart_type: "line"',
        '          data:',
        '            type: "line"',
        '            labels: ["2020", "2021", "2022", "2023", "2024"]',
        '            datasets:',
        '              - label: "市场规模（亿元）"',
        '                data: [500, 680, 850, 1020, 1200]',
        '            source: "艾瑞咨询，2024"',
        '',
        '      - page_role: "climax"',
        `        title: ${this.yamlQuote('结构性拐点已出现')}`,
        '        page_intent: "全篇情绪最高点"',
        '        director_note: |',
        '          【情绪定调】高潮，大留白+高对比度',
        '          【视觉主角】40%，字号≥140px',
        '          【空间分配】Stage 70% / Info 30%',
        '        sidebar: ""',
        '        insight: "渗透率突破临界点"',
        '        stage_zone:',
        '          content_type: "hero-number"',
        '          hero_text: "40%"',
        '          scale: "full"',
        '        info_zone:',
        '          layout: "bento-2x1"',
        '          items_count: 2',
        '        imagery:',
        '          role: "none"',
        '          scale: "none"',
        '          content_brief: ""',
        '        items:',
        '          - "**40%** | 市场渗透率 | 历史性突破"',
        '          - "**2倍** | 增速对比 | vs 行业平均"',
        '',
        `  - name: ${this.yamlQuote('解决方案')}`,
        '    slides:',
        '      - page_role: "support"',
        `        title: ${this.yamlQuote('差异化定位：效率提升3倍')}`,
        '        page_intent: "展示核心产品价值"',
        '        director_note: |',
        '          【情绪定调】支撑页，用对比建立优势感',
        '          【视觉主角】3倍效率提升',
        '          【空间分配】Stage 40% / Info 60%',
        '        sidebar: "基于1024份用户调研"',
        '        insight: "不是功能堆砌，是体验重构"',
        '        stage_zone:',
        '          content_type: "hero-text"',
        '          hero_text: "3×"',
        '          scale: "compact"',
        '        info_zone:',
        '          layout: "bento-1x3"',
        '          items_count: 3',
        '        imagery:',
        '          role: "none"',
        '          scale: "none"',
        '          content_brief: ""',
        '        items:',
        '          - "传统方案：平均耗时8小时"',
        '          - "我们的方案：平均耗时2.5小时"',
        '          - "效率提升：**3倍**"',
        '',
        `  - name: ${this.yamlQuote('总结')}`,
        '    slides:',
        '      - page_role: "closing"',
        `        title: ${this.yamlQuote('一起创造新品类')}`,
        '        page_intent: "强化核心论点，留下行动号召"',
        '        director_note: |',
        '          【情绪定调】结尾，回归品牌色',
        '          【视觉主角】结语，字号≥56px',
        '          【空间分配】Stage 60% / Info 40%',
        '        sidebar: ""',
        '        insight: "期待与您合作"',
        '        stage_zone:',
        '          content_type: "hero-text"',
        '          hero_text: "一起创造新品类"',
        '          scale: "full"',
        '        info_zone:',
        '          layout: "stack"',
        '          items_count: 3',
        '        imagery:',
        '          role: "atmospheric"',
        '          scale: "full-bleed"',
        '          content_brief: "品牌色渐变"',
        '        items:',
        '          - "市场窗口期：12-18个月"',
        '          - "团队已验证商业模式"',
        '          - "寻求战略投资加速扩张"'
      ];

      return yaml.join('\n');
    },

    formatMockPlanning({ title, audience, pageCount, mood, preset, chapters, transitions }) {
      const yaml = [
        'schema_version: "2.0"',
        'schema_name: "Presenta Planning Schema"',
        '',
        `title: ${this.yamlQuote(title)}`,
        `audience: ${this.yamlQuote(`${audience}，关注增长潜力和商业模式`)}`,
        `page_count: ${pageCount}`,
        `duration: ${this.yamlQuote(`约${Math.round(pageCount * 1.5)}分钟`)}`,
        '',
        `narrative_framework: ${this.yamlQuote('E（故事驱动）')}`,
        `framework_reason: ${this.yamlQuote('融资路演需要用故事建立情感连接，再展示数据')}`,
        `core_thesis: ${this.yamlQuote('我们不是在卖产品，而是在创造一个新的市场品类')}`,
        '',
        `archetype: ${this.yamlQuote(preset)}`,
        `preset_reason: ${this.yamlQuote(`${mood}最能传递${audience === '投资人' ? '增长愿景' : '专业可信度'}`)}`,
        '',
        'chapters:'
      ];

      chapters.forEach((chapter) => {
        yaml.push(`  - name: ${this.yamlQuote(chapter.name)}`);
        yaml.push('    slides:');
        chapter.slides.forEach((slide) => {
          yaml.push(this.formatSlideYaml(slide, 6));
        });
      });

      yaml.push('');
      yaml.push('transitions:');
      transitions.forEach((transition) => {
        yaml.push(`  - from: ${transition.from}`);
        yaml.push(`    to: ${transition.to}`);
        yaml.push(`    type: ${this.yamlQuote(transition.type)}`);
      });

      return yaml.join('\n');
    }
  },

  // ============================================
  // OpenAI Provider（生产环境）
  // ============================================
  openai: {
    name: 'OpenAI GPT-4o',

    async generatePlanning(documentContent, wizardAnswers, options = {}) {
      const { apiKey, model = 'gpt-4o', onProgress, onComplete, signal, promptOverride } = options;

      if (!apiKey) {
        throw new Error('OPENAI_API_KEY 未设置，请在设置中配置。');
      }

      // combo 路由：promptOverride 存在时替换默认 system prompt
      const systemPrompt = promptOverride || this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(documentContent, wizardAnswers);

      try {
        if (onProgress) {
          onProgress({ type: 'progress', progress: 10, message: '📖 正在分析文档…' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 5000
          }),
          signal
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `API 请求失败 (${response.status})`);
        }

        if (onProgress) {
          onProgress({ type: 'progress', progress: 80, message: '📝 正在整理规划…' });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        const planningYaml = this.extractYaml(content);

        if (!planningYaml) {
          throw new Error('AI 返回格式异常，无法解析 planning.yaml');
        }

        if (onProgress) {
          onProgress({ type: 'progress', progress: 100, message: '✅ 规划完成' });
        }

        if (onComplete) onComplete({ planningYaml });
        return planningYaml;

      } catch (err) {
        if (err.name === 'AbortError') {
          throw new Error('生成已取消');
        }
        throw err;
      }
    },

    buildSystemPrompt() {
      return `你是 PPT 内容规划专家。根据材料和偏好，生成 planning.yaml。严格只输出 YAML。

## 输出格式

\`\`\`yaml
schema_version: "2.0"
title: "标题"
audience: "受众"
page_count: 12
narrative_framework: "A/B/C/D/E/F"
framework_reason: "一句话"
core_thesis: "核心论点"
archetype: "editorial-swiss/magazine-big-type/minimal-architectural/moodboard-collage/luxury-editorial/tech-dark-mode"
archetype_reason: "一句话"
chapters:
  - name: "章节名"
    slides:
      - page_role: "cover/chapter_break/climax/support/insight/comparison/closing"
        title: "观点句≤20字"
        page_intent: "叙事功能"
        director_note: |
          【情绪定调】情绪曲线位置
          【视觉主角】主角元素与强调方式
          【空间分配】主角占比与布局
        sidebar: "边栏内容，无则留空"
        insight: "洞察≤15字，无则留空"
        imagery:
          role: "hero/supporting/atmospheric/none"
          scale: "full-bleed/ultra-small/none"
          content_brief: "图片内容描述"
        items:
          - "要素≤25字"
        chart:
          chart_type: "bar/line/pie/donut"
          data:
            type: "line"
            labels: ["标签"]
            datasets:
              - label: "名称"
                data: [数值]
            source: "来源"
\`\`\`

## 规则
- cover/closing 各1页，climax 最多2页，不能连续3页 support
- chart: 趋势→line，对比→bar，占比→pie/donut，单一数字不画图表
- 每页只有一个视觉焦点，留白≥40%
- imagery: ≥30%的页面需要图片(hero/supporting/atmospheric)，图片尺寸二选一：full-bleed(全屏)或ultra-small(≤12%面积)，禁止中间尺寸
- cover和chapter_break适合atmospheric全屏图，climax和insight通常无图
- 紧凑输出，不要冗余描述

直接输出 YAML，不要其他内容。`;
    },

    buildUserPrompt(documentContent, wizardAnswers) {
      const { audience, scenario, pageCount, mood, title } = wizardAnswers;

      var archetype = mood || 'editorial-swiss';
      var archetypeData = window.DesignArchetypes ? window.DesignArchetypes[archetype] : null;
      var imageryHint = '';
      if (archetypeData && archetypeData.imagery_script) {
        var s = archetypeData.imagery_script;
        imageryHint = '\n- 图像风格：' + s.primary_language + '，色调：' + s.tonal_treatment +
          '\n- 图像覆盖率目标：' + s.coverage_target +
          '\n- 文字与图片关系：' + s.type_image_relation;
      }

      return `材料内容：
${documentContent.slice(0, 6000)}

用户已确认的偏好（直接使用，不需要重新推断）：
- 目标受众：${audience || '通用'}
- 篇幅：${pageCount || 12}页
- 风格原型：${archetype}
${title ? `- 标题：${title}` : '- 标题：由你根据内容生成'}
${scenario ? `- 叙事框架偏好：${scenario}` : ''}${imageryHint}

生成 planning.yaml。`;
    },

    extractYaml(content) {
      // 1. ```yaml ... ``` 代码块
      const fenceMatch = content.match(/```(?:yaml|yml)?\s*\n?([\s\S]*?)```/);
      if (fenceMatch) return fenceMatch[1].trim();

      // 2. 以 schema_version 开头的裸 YAML
      const yamlMatch = content.match(/(schema_version:[\s\S]*)/);
      if (yamlMatch) return yamlMatch[1].trim();

      // 3. 以 title: 开头（有些模型跳过 schema_version）
      const titleMatch = content.match(/(title:[\s\S]*chapters:[\s\S]*)/);
      if (titleMatch) return titleMatch[1].trim();

      return null;
    }
  },

  // ============================================
  // Anthropic Claude Provider（支持浏览器 CORS）
  // ============================================
  anthropic: {
    name: 'Anthropic Claude',

    async generatePlanning(documentContent, wizardAnswers, options = {}) {
      const { apiKey, model = 'claude-sonnet-4-20250514', onProgress, onComplete, signal, promptOverride } = options;

      if (!apiKey) throw new Error('Anthropic API Key 未设置，请在设置中配置。');

      const systemPrompt = promptOverride || APIProvidersSkill.openai.buildSystemPrompt();
      const userPrompt = APIProvidersSkill.openai.buildUserPrompt(documentContent, wizardAnswers);

      try {
        if (onProgress) onProgress({ type: 'progress', progress: 10, message: '📖 正在分析文档…' });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model,
            max_tokens: 5000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
          }),
          signal
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `请求失败 (${response.status})`);
        }

        const data = await response.json();
        const content = data.content?.[0]?.text || '';
        const planningYaml = APIProvidersSkill.openai.extractYaml(content);

        if (!planningYaml) throw new Error('解析失败，Claude 返回格式异常');

        if (onProgress) onProgress({ type: 'progress', progress: 100, message: '✅ 规划完成' });
        if (onComplete) onComplete({ planningYaml });
        return planningYaml;

      } catch (err) {
        if (err.name === 'AbortError') throw new Error('生成已取消');
        throw err;
      }
    },

    async generateRenderer(documentContent, wizardAnswers, planningYaml, options = {}) {
      const { apiKey, model = 'claude-sonnet-4-20250514', onProgress, onComplete, signal } = options;

      if (!apiKey) throw new Error('Anthropic API Key 未设置');

      const systemPrompt = APIProvidersSkill.openai.buildRendererSystemPrompt();
      const userPrompt = APIProvidersSkill.openai.buildRendererUserPrompt(documentContent, wizardAnswers, planningYaml);

      try {
        if (onProgress) onProgress({ type: 'progress', progress: 10, message: '🎨 正在生成幻灯片…' });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model,
            max_tokens: 5000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
          }),
          signal
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `请求失败 (${response.status})`);
        }

        const data = await response.json();
        const content = data.content?.[0]?.text || '';
        const slides = JSON.parse(content);

        if (!Array.isArray(slides)) throw new Error('幻灯片格式异常');

        if (onProgress) onProgress({ type: 'progress', progress: 100, message: '✅ 渲染完成' });
        if (onComplete) onComplete({ slides });
        return slides;

      } catch (err) {
        if (err.name === 'AbortError') throw new Error('生成已取消');
        throw err;
      }
    }
  },



  // ============================================
  // DeepSeek Provider（OpenAI 兼容模式）
  // ============================================
  deepseek: {
    name: 'DeepSeek',

    async generatePlanning(documentContent, wizardAnswers, options = {}) {
      const { apiKey, model = 'deepseek-chat', onProgress, onComplete, signal, promptOverride } = options;

      if (!apiKey) {
        throw new Error('请在设置中配置 DeepSeek API Key');
      }

      const systemPrompt = promptOverride || APIProvidersSkill.openai.buildSystemPrompt();
      const userPrompt = APIProvidersSkill.openai.buildUserPrompt(documentContent, wizardAnswers);

      try {
        if (onProgress) {
          onProgress({ type: 'progress', progress: 10, message: '📖 正在分析文档…' });
        }

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 5000
          }),
          signal
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `API 请求失败 (${response.status})`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const planningYaml = APIProvidersSkill.openai.extractYaml(content);

        if (!planningYaml) {
          throw new Error('解析失败，AI 返回格式异常');
        }

        if (onProgress) {
          onProgress({ type: 'progress', progress: 100, message: '✅ 规划完成' });
        }

        if (onComplete) {
          onComplete({ planningYaml });
        }

        return planningYaml;
      } catch (err) {
        console.error('[DeepSeek] generatePlanning 错误:', err);
        if (onProgress) {
          onProgress({ type: 'error', message: 'DeepSeek API 错误: ' + err.message });
        }
        throw err;
      }
    }
  },

  // ============================================
  // SiliconFlow Provider（国产平价 API）
  // ============================================
  siliconflow: {
    name: 'SiliconFlow (DeepSeek)',

    async generatePlanning(documentContent, wizardAnswers, options = {}) {
      const { apiKey, model = 'deepseek-ai/DeepSeek-V3', onProgress, onComplete, signal, promptOverride } = options;

      if (!apiKey) {
        throw new Error('请在设置中配置 SiliconFlow API Key');
      }

      const systemPrompt = promptOverride || APIProvidersSkill.openai.buildSystemPrompt();
      const userPrompt = APIProvidersSkill.openai.buildUserPrompt(documentContent, wizardAnswers);

      try {
        if (onProgress) {
          onProgress({ type: 'progress', progress: 10, message: '📖 正在分析文档…' });
        }

        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 5000
          }),
          signal
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `API 请求失败 (${response.status})`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const planningYaml = APIProvidersSkill.openai.extractYaml(content);

        if (!planningYaml) {
          throw new Error('解析失败，AI 返回格式异常');
        }

        if (onProgress) {
          onProgress({ type: 'progress', progress: 100, message: '✅ 规划完成' });
        }

        if (onComplete) onComplete({ planningYaml });
        return planningYaml;

      } catch (err) {
        if (err.name === 'AbortError') throw new Error('生成已取消');
        throw err;
      }
    }
  },

  // ============================================
  // MiniMax Provider（国产大模型）
  // ============================================
  minimax: {
    name: 'MiniMax',

    async generatePlanning(documentContent, wizardAnswers, options = {}) {
      const { apiKey, model = 'MiniMax-Text-01', onProgress, onComplete, signal, promptOverride } = options;

      if (!apiKey) {
        throw new Error('MiniMax API Key 未设置，请在设置中配置。');
      }

      const systemPrompt = promptOverride || APIProvidersSkill.openai.buildSystemPrompt();
      const userPrompt = APIProvidersSkill.openai.buildUserPrompt(documentContent, wizardAnswers);

      try {
        if (onProgress) {
          onProgress({ type: 'progress', progress: 10, message: '📖 正在分析文档…' });
        }

        const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 5000
          }),
          signal
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.base_error?.message || err.error?.message || `API 请求失败 (${response.status})`);
        }

        if (onProgress) {
          onProgress({ type: 'progress', progress: 80, message: '📝 正在整理规划…' });
        }

        const data = await response.json();

        // MiniMax 响应格式兼容：v2 用 message.content，旧版用 messages[0].text
        let content = data.choices?.[0]?.message?.content
          || data.choices?.[0]?.messages?.[0]?.text
          || data.reply
          || '';

        if (!content) {
          throw new Error('MiniMax 返回内容为空，请重试');
        }

        const planningYaml = APIProvidersSkill.openai.extractYaml(content);

        if (!planningYaml) {
          throw new Error('解析失败，AI 返回格式异常');
        }

        if (onProgress) {
          onProgress({ type: 'progress', progress: 100, message: '✅ 规划完成' });
        }

        if (onComplete) onComplete({ planningYaml });
        return planningYaml;

      } catch (err) {
        if (err.name === 'AbortError') throw new Error('生成已取消');
        throw err;
      }
    }
  }
};

// ============================================
// Helpers
// ============================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export for use
window.APIProvidersSkill = APIProvidersSkill;
if (window.PresentaSkills) window.PresentaSkills.register('api-providers', APIProvidersSkill);
