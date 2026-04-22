/**
 * =============================================
 * Presenta - Integrated AI Service (Skill Mode)
 * 两阶段生成：Planner → Renderer
 * =============================================
 */

const AIServiceIntegrated = {
  // 当前使用的 provider
  provider: 'mock',
  apiKey: '',

  // 加载保存的偏好
  loadPreferences() {
    this.provider = localStorage.getItem('presenta-ai-provider') || 'mock';
    this.apiKey = localStorage.getItem('presenta-ai-key-' + this.provider) || '';
    return this;
  },

  // 获取/设置 Provider
  getProvider() {
    return this.provider;
  },

  // 切换提供商
  setProvider(name) {
    this.provider = name;
    localStorage.setItem('presenta-ai-provider', name);
  },

  // 获取 API Key
  getApiKey() {
    return this.apiKey;
  },

  // 获取自定义模型
  getModel() {
    return this.model || '';
  },

  // 设置自定义模型
  setModel(model) {
    this.model = model || '';
  },

  // 设置 API Key
  setApiKey(key) {
    this.apiKey = key;
    if (key) {
      localStorage.setItem('presenta-ai-key-' + this.provider, key);
    }
  },

  // ============================================
  // 主生成方法（两阶段）
  // ============================================
  async generate(documentContent, wizardAnswers, callbacks = {}) {
    const { onProgress, onPlanningComplete, onSlideRender, onComplete, onError } = callbacks;
    let simInterval = null;

    try {
      console.log('[AIService] ===== generate() 开始 =====');
      console.log('[AIService] documentContent length:', documentContent?.length);
      console.log('[AIService] wizardAnswers:', JSON.stringify(wizardAnswers));
      console.log('[AIService] this.provider:', this.provider, '| this.apiKey:', !!this.apiKey);
      // ========== 第一阶段：Planner ==========
      if (onProgress) {
        onProgress({ phase: 'planner', progress: 0, message: '🎬 开始内容规划…' });
      }

      const plannerMessages = [
        '📖 正在分析文档结构…',
        '🎯 识别报告类型与受众…',
        '📊 选择叙事框架…',
        '💡 提炼核心论点…',
        '📑 设计章节结构…',
        '🎭 规划情绪节奏…',
        '📝 AI 正在生成完整规划…',
        '🔍 等待 AI 响应中…'
      ];
      let simPct = 10;
      let simMsgIdx = 0;
      simInterval = this.provider !== 'mock' ? setInterval(() => {
        if (simPct < 85) {
          simPct += 2 + Math.random() * 3;
          simPct = Math.min(simPct, 85);
        }
        simMsgIdx = Math.min(simMsgIdx + 1, plannerMessages.length - 1);
        onProgress?.({ phase: 'planner', progress: Math.round(simPct), message: plannerMessages[simMsgIdx] });
      }, 1500) : null;

      console.log('[AIService] runPlanner 开始...');
      const planningYaml = await this.runPlanner(documentContent, wizardAnswers, {
        onProgress: (p) => {
          console.log('[AIService] Planner progress:', p.progress, p.message);
          if (p.progress > simPct) {
            onProgress?.({ phase: 'planner', ...p });
          }
        }
      });

      if (simInterval) clearInterval(simInterval);

      onProgress?.({ phase: 'planner', progress: 80, message: '✅ 规划完成，准备渲染…' });

      console.log('[AIService] runPlanner 返回, planningYaml length:', planningYaml?.length, '前80字:', planningYaml?.slice(0,80));
      if (onPlanningComplete) {
        console.log('[AIService] 调用 onPlanningComplete');
        onPlanningComplete({ planningYaml });
      }

      // ========== 第二阶段：Renderer ==========
      if (onProgress) {
        onProgress({ phase: 'renderer', progress: 0, message: '🎨 开始渲染幻灯片…' });
      }

      console.log('[AI Service] 开始 runRenderer, planningYaml 长度:', planningYaml?.length);
      console.log('[AIService] runRenderer 开始...');
      const slides = await this.runRenderer(planningYaml, {
        onProgress: (p) => {
          console.log('[AIService] Renderer progress:', p.progress, p.message);
          onProgress?.({ phase: 'renderer', ...p });
        },
        onSlideComplete: onSlideRender
      });

      console.log('[AI Service] runRenderer 完成, slides:', slides?.length);
      console.log('[AIService] ===== generate 即将完成 =====');
      console.log('[AIService] slides:', slides?.length, 'planningYaml:', planningYaml?.length);
      if (onComplete) {
        console.log('[AI Service] 调用 onComplete');
        onComplete({ slides, planningYaml });
      }
      console.log('[AIService] generate 完成');

      return { slides, planningYaml };

    } catch (err) {
      if (simInterval) clearInterval(simInterval);
      console.error('[AIService] generate 捕获异常:', err.message);
      console.error('[AIService] stack:', err.stack);
      if (onError) {
        console.log('[AIService] 调用 onError:', err.message);
        onError(err.message || '生成失败');
      }
      throw err;
    }
  },

  // ============================================
  // 第一阶段：Planner（AI 生成 planning.yaml）
  // ============================================
  async runPlanner(documentContent, wizardAnswers, options = {}) {
    const provider = APIProvidersSkill[this.provider];

    if (!provider) {
      throw new Error('未知的 AI 提供商: ' + this.provider);
    }

    const plannerOptions = {
      apiKey: this.apiKey,
      onProgress: options.onProgress,
      onComplete: (result) => result.planningYaml
    };

    // OpenAI/SiliconFlow 需要 signal 支持取消
    if (this.provider !== 'mock') {
      this._abortController = new AbortController();
      plannerOptions.signal = this._abortController.signal;
    }

    return await provider.generatePlanning(documentContent, wizardAnswers, plannerOptions);
  },

  // ============================================
  // 第二阶段：Renderer（YAML → HTML）
  // ============================================
  async runRenderer(planningYaml, options = {}) {
    const renderer = new RendererSkill();

    return await renderer.renderSlides(planningYaml, {
      onProgress: options.onProgress,
      onSlideComplete: options.onSlideComplete
    });
  },

  // ============================================
  // 取消生成
  // ============================================
  abort() {
    if (this._abortController) {
      this._abortController.abort();
    }
  },

  // ============================================
  // 获取当前提供商信息
  // ============================================
  getProviderInfo() {
    const providerNames = {
      mock: 'Mock AI (演示模式)',
      openai: 'OpenAI GPT-4o',
      siliconflow: 'SiliconFlow (DeepSeek)',
      deepseek: 'DeepSeek',
      minimax: 'MiniMax',
      anthropic: 'Anthropic Claude'
    };
    return {
      id: this.provider,
      name: providerNames[this.provider] || this.provider
    };
  },

  // ============================================
  // 验证 API Key
  // ============================================
  async validateApiKey(provider, key) {
    console.log('[validateApiKey] provider:', provider, 'key length:', key?.length);
    
    if (provider === 'mock') return { valid: true, message: 'Mock 模式可用' };

    if (provider === 'openai') {
      try {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        console.log('[validateApiKey] OpenAI response:', res.status, res.statusText);
        if (res.ok) return { valid: true, message: 'OpenAI 连接成功' };
        const data = await res.json().catch(() => ({}));
        return { valid: false, message: data.error?.message || `HTTP ${res.status}` };
      } catch (e) {
        console.error('[validateApiKey] OpenAI error:', e);
        return { valid: false, message: 'CORS 错误: ' + e.message };
      }
    }

    if (provider === 'siliconflow') {
      // SiliconFlow 尝试多个可能可用的模型
      const siliconModels = [
        'Qwen/Qwen2.5-7B-Instruct',
        'THUDM/glm-4-9b-chat',
        'deepseek-ai/DeepSeek-Coder-V2',
        'Qwen/Qwen2-7B-Instruct'
      ];
      
      for (const model of siliconModels) {
        try {
          console.log('[validateApiKey] SiliconFlow 尝试模型:', model);
          const res = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: 'hi' }],
              max_tokens: 5
            })
          });
          if (res.ok) return { valid: true, message: `SiliconFlow 连接成功 (${model})` };
          const data = await res.json().catch(() => ({}));
          console.log('[validateApiKey] SiliconFlow 模型', model, '失败:', data);
          // 如果是 30003 跳过一个模型继续试
          if (data?.code === 30003) continue;
          return { valid: false, message: data.error?.message || data.message || `HTTP ${res.status}` };
        } catch (e) {
          console.error('[validateApiKey] SiliconFlow 模型', model, '异常:', e);
          continue;
        }
      }
      return { valid: false, message: '所有 SiliconFlow 模型都不可用，请检查 API Key 权限' };
    }

    if (provider === 'minimax') {
      // MiniMax 没有 /models 端点，用 chatcompletion_v2 发极短请求验证
      try {
        const res = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'MiniMax-Text-01',
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 1
          })
        });
        if (res.ok) return { valid: true };
        const data = await res.json().catch(() => ({}));
        const msg = data.base_error?.message || data.error?.message || '';
        return { valid: false, message: msg };
      } catch (e) {
        return { valid: false, message: e.message || '网络错误' };
      }
    }

    if (provider === 'deepseek') {
      try {
        console.log('[validateApiKey] DeepSeek: 发送测试请求...');
        const res = await fetch('https://api.deepseek.com/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        console.log('[validateApiKey] DeepSeek response:', res.status, res.statusText);
        if (res.ok) return { valid: true, message: 'DeepSeek 连接成功' };
        const data = await res.json().catch(() => ({}));
        console.log('[validateApiKey] DeepSeek error data:', data);
        return { valid: false, message: data.error?.message || `HTTP ${res.status}` };
      } catch (e) {
        console.error('[validateApiKey] DeepSeek error:', e);
        return { valid: false, message: 'CORS 错误: ' + e.message };
      }
    }

    if (provider === 'anthropic') {
      try {
        console.log('[validateApiKey] Anthropic: 发送测试请求...');
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'hi' }]
          })
        });
        console.log('[validateApiKey] Anthropic response:', res.status, res.statusText);
        if (res.ok) return { valid: true, message: 'Claude 连接成功' };
        const data = await res.json().catch(() => ({}));
        console.log('[validateApiKey] Anthropic error data:', data);
        return { valid: false, message: data.error?.message || `HTTP ${res.status}` };
      } catch (e) {
        console.error('[validateApiKey] Anthropic error:', e);
        return { valid: false, message: 'CORS 错误: ' + e.message };
      }
    }

    return { valid: false };
  },

  // ============================================
  // 分析文档内容（Phase 1 of ppt-content-planner）
  // ============================================
  async analyzeDocument(documentContent, callbacks = {}) {
    const { onProgress, onComplete, onError } = callbacks;
    this.loadPreferences();

    const provider = window.APIProvidersSkill?.[this.provider];
    if (!provider) {
      const err = '未知的 AI 提供商: ' + this.provider;
      if (onError) onError(err);
      throw new Error(err);
    }

    try {
      if (onProgress) onProgress({ phase: 'analyzing', message: '正在分析文档内容…', progress: 10 });

      // 调用 provider 的 analyzeDocument 方法
      if (typeof provider.analyzeDocument === 'function') {
        const result = await provider.analyzeDocument(documentContent, {
          apiKey: this.apiKey,
          onProgress: (p) => onProgress?.({ phase: 'analyzing', ...p })
        });
        if (onComplete) onComplete(result);
        return result;
      } else {
        // Fallback: provider 没有 analyzeDocument 时，用 _analyzeWithPlanning
        if (onProgress) onProgress({ phase: 'planning', message: '正在调用 AI 分析…', progress: 15 });
        const result = await this._analyzeWithPlanning(documentContent, { onProgress });
        if (onProgress) onProgress({ phase: 'done', message: '分析完成', progress: 95 });
        if (onComplete) onComplete(result);
        return result;
      }
    } catch (err) {
      if (onError) onError(err.message || '分析失败');
      throw err;
    }
  },

  // Fallback: 用生成 planning 的 prompt 来做分析（提取报告类型和核心信息）
  async _analyzeWithPlanning(documentContent, { onProgress } = {}) {
    const provider = window.APIProvidersSkill?.[this.provider];
    if (!provider) throw new Error('Provider not found');

    // 使用 OpenAI 的 system prompt 做分析（不生成完整 YAML，只提取分析结果）
    const analysisPrompt = this._buildAnalysisPrompt(documentContent);

    // 带 30 秒超时的 fetch
    // AbortController 供 abort 时用
    let _ac = null;
    const _makeAc = () => {
      _ac = new AbortController();
      return _ac;
    };
    const _clearAc = () => {
      if (_ac) { clearTimeout(_ac.timeoutId); _ac = null; }
    };

    try {
      const ac = _makeAc();
      ac.timeoutId = setTimeout(() => { try { ac.abort(); } catch(e){} }, 30000);
      if (onProgress) onProgress({ phase: 'planning', message: 'AI 正在分析文档…', progress: 30 });

      const isAnthropic = this.provider === 'anthropic';
      const apiUrl = isAnthropic
        ? 'https://api.anthropic.com/v1/messages'
        : this.provider === 'minimax'
        ? 'https://api.minimax.chat/v1/text/chatcompletion_v2'
        : this.provider === 'siliconflow'
        ? 'https://api.siliconflow.cn/v1/chat/completions'
        : this.provider === 'deepseek'
        ? 'https://api.deepseek.com/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';

      const headers = isAnthropic
        ? {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          }
        : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          };

      const systemContent = '你是一个专业的PPT内容分析专家。请简洁分析文档内容，返回JSON格式的分析结果。';
      const body = isAnthropic
        ? {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: systemContent,
            messages: [{ role: 'user', content: analysisPrompt }]
          }
        : {
            model: this.provider === 'minimax' ? 'MiniMax-Text-01'
                : this.provider === 'siliconflow' ? 'Qwen/Qwen2.5-7B-Instruct'
                : this.provider === 'deepseek' ? 'deepseek-chat'
                : 'gpt-4o',
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: analysisPrompt }
            ],
            temperature: 0.3,
            max_tokens: 2048
          };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: ac.signal
      });
      clearTimeout(ac.timeoutId);

      if (!response.ok) {
        let errMsg = `API 请求失败 (HTTP ${response.status})`;
        try {
          const errBody = await response.json();
          errMsg = errBody.error?.message || errBody.base_error?.message || errBody.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const data = await response.json();

      // Anthropic 用 content[0].text；OpenAI/MiniMax/SiliconFlow 用 choices[0].message.content
      const text = isAnthropic
        ? (data.content?.[0]?.text || '')
        : (data.choices?.[0]?.message?.content || '');

      if (!text || text.trim().length < 5) {
        throw new Error('AI 返回内容为空，请重试');
      }

      _clearAc();
      return this._parseAnalysisResult(text);
    } catch (err) {
      _clearAc();
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        throw new Error('请求超时（30秒），请检查网络后重试');
      }
      throw err;
    }
  },

  _buildAnalysisPrompt(content) {
    const truncated = content.slice(0, 5000);
    // 注意：不要在 prompt 里嵌入 JSON 示例！MiniMax 会把它当 JSON 解析导致语法错误
    return `你是一个专业的PPT演示设计师。请分析下面的文档内容，推断：
1. 报告类型（行业报告/工作汇报/战略提案/融资路演/竞品分析/产品介绍/培训教材/其他）
2. 核心论点（一句话概括）
3. 推荐的叙事框架（结论先行/问题驱动/数据叙事/时间线/故事驱动）
4. 推荐的视觉风格（硬核科技感/高端品牌/稳重大气/明快创意）
5. 推荐的页数（6-20之间，根据内容量判断）
6. 章节大纲（3-6个章节名称）
7. 目标受众

请用JSON格式返回分析结果，只返回纯JSON，不要有任何其他文字说明。

文档内容：
${truncated}`;
  },

  _parseAnalysisResult(text) {
    const trimmed = text.trim();
    let jsonStr = '';
    // 找 JSON 代码块
    const codeBlock = trimmed.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlock) { jsonStr = codeBlock[1]; }
    else {
      const first = trimmed.indexOf('{');
      const last = trimmed.lastIndexOf('}');
      if (first >= 0 && last > first) { jsonStr = trimmed.slice(first, last + 1); }
    }

    let raw = {};
    if (jsonStr) { try { raw = JSON.parse(jsonStr); } catch { /* ignore */ } }

    if (!Object.keys(raw).length) {
      return {
        reportType: '专业报告',
        coreThesis: trimmed.slice(0, 200),
        recommendedScenario: '数据叙事',
        scenarioReason: '',
        recommendedMood: '稳重大气',
        moodReason: '',
        suggestedPageCount: 12,
        chapterOutline: [],
        audienceRecommendation: '待定'
      };
    }

    // 工具函数
    const str = (v, fallback) => (typeof v === 'string' && v.length > 1) ? v : fallback;
    const num = (v, fallback) => { const n = parseInt(v, 10); return (n >= 3 && n <= 30) ? n : fallback; };
    const arr = (v) => Array.isArray(v) ? v.map(String) : [];

    // 字段名映射（驼峰 + 蛇形 + 中文）
    const g = (k) => raw[k] || raw[k.replace(/([A-Z])/g, '_$1').toLowerCase()] || raw[k.replace(/([A-Z])/g,'_$1')] || raw[k.replace(/_/g,'')] || undefined;

    const rk = (k) => raw[k] !== undefined ? raw[k] : undefined;
    return {
      reportType: str(
        rk('reportType') || rk('report_type') || rk('报告类型') || rk('类型') || rk('主题') || '专业报告',
        '专业报告'
      ),
      coreThesis: str(
        rk('coreThesis') || rk('core_thesis') || rk('coreArgument') || rk('core_argument') ||
        rk('核心论点') || rk('核心观点') || rk('summary') || rk('摘要') || rk('主要结论') || '',
        trimmed.slice(0, 200)
      ),
      recommendedScenario: str(
        rk('recommendedScenario') || rk('recommended_scenario') ||
        rk('narrativeStructure') || rk('narrative_structure') ||
        rk('recommended_narrative_structure') || rk('recommendedNarrativeStructure') ||
        rk('推荐的叙事框架') || rk('叙事框架') || rk('scenario') || '数据叙事'
      ),
      scenarioReason: str(rk('scenarioReason') || rk('scenario_reason') || rk('框架理由') || '', ''),
      recommendedMood: str(
        rk('recommendedMood') || rk('recommended_mood') ||
        rk('visualStyle') || rk('visual_style') ||
        rk('recommended_visual_style') || rk('recommendedVisualStyle') ||
        rk('推荐的视觉风格') || rk('视觉风格') || rk('mood') || '稳重大气'
      ),
      moodReason: str(rk('moodReason') || rk('mood_reason') || '', ''),
      suggestedPageCount: num(
        rk('suggestedPageCount') || rk('suggested_pages') ||
        rk('pageCount') || rk('page_count') ||
        rk('recommended_page_count') || rk('recommendedPageCount') ||
        rk('推荐页数') || rk('页数') || rk('pages') || 12, 12
      ),
      chapterOutline: arr(
        rk('chapterOutline') || rk('chapter_outline') || rk('outline') ||
        rk('sectionOutline') || rk('chapter_outline') ||
        rk('章节大纲') || rk('章节') || rk('sections') || []
      ),
      audienceRecommendation: str(
        rk('audienceRecommendation') || rk('audience_recommendation') ||
        rk('targetAudience') || rk('target_audience') ||
        rk('目标受众') || rk('受众') || '待定'
      )
    }
  },

  // ============================================
  // 工具方法：提取 planning 摘要
  // ============================================
  extractPlanningSummary(planningYaml) {
    // 简单提取关键信息用于展示
    const title = planningYaml.match(/title:\s*["']?([^"'\n]+)/)?.[1] || '未命名';
    const pageCount = planningYaml.match(/page_count:\s*(\d+)/)?.[1] || '?';
    const preset = planningYaml.match(/visual_preset:\s*["']?([^"'\n]+)/)?.[1] || 'tech';
    const framework = planningYaml.match(/narrative_framework:\s*["']?([^"'\n]+)/)?.[1] || '';
    const thesis = planningYaml.match(/core_thesis:\s*["']?([^"'\n]+)/)?.[1] || '';

    return { title, pageCount, preset, framework, thesis };
  }
};

// 加载偏好
AIServiceIntegrated.loadPreferences();

// Export
window.AIServiceIntegrated = AIServiceIntegrated;
