(function() {
  'use strict';

  let project = null;
  let documentContent = '';

  function init() {
    loadProject();
    if (!project) return;
    bindUI();
    runAnalysis();
    const main = document.getElementById('pageMain');
    if (main) main.style.opacity = '1';
  }

  function loadProject() {
    const saved = sessionStorage.getItem('presenta-current-project') ||
                  localStorage.getItem('presenta-current-project');
    if (!saved) {
      showEmptyState('请先上传文档');
      return;
    }

    try {
      project = JSON.parse(saved);
      documentContent = project?.source_materials?.[0]?.parsed_text ||
                        project?.source_materials?.[0]?.content ||
                        project?.source_materials?.[0]?.raw_input || '';

      if (!documentContent) {
        showEmptyState('文档内容为空，请重新上传');
        return;
      }

      const src = project.source_materials?.[0];
      if (src) {
        const typeMap = { pdf: 'PDF 文档', markdown: 'Markdown', text: '文本', link: '网页' };
        const info = document.getElementById('docInfo');
        if (info) info.textContent = '已加载：' + (typeMap[src.type] || '文档');
      }

      if (project.wizard_answers) applyAnswers(project.wizard_answers);
    } catch (e) {
      console.error('[Wizard] load failed:', e);
      showEmptyState('数据加载失败');
    }
  }

  function showEmptyState(msg) {
    const main = document.getElementById('pageMain');
    if (main) {
      main.innerHTML = '<div style="text-align:center;padding:80px 20px">' +
        '<p style="color:var(--color-text-muted);margin-bottom:20px">' + msg + '</p>' +
        '<a href="../index.html" style="color:var(--color-primary);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px">返回首页上传文档</a></div>';
      main.style.opacity = '1';
    }
  }

  function bindUI() {
    // ── Combo 选择器 ──
    document.querySelectorAll('#comboOptions .combo-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#comboOptions .combo-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        switchMoodGrid(card.dataset.value);
      });
    });

    document.querySelectorAll('#audienceOptions .tag-option').forEach(tag => {
      tag.addEventListener('click', () => {
        document.querySelectorAll('#audienceOptions .tag-option').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
      });
    });

    document.querySelectorAll('#moodOptions .mood-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#moodOptions .mood-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    document.querySelectorAll('#apertureMoodOptions .mood-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#apertureMoodOptions .mood-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    const slider = document.getElementById('pageSlider');
    const pageValue = document.getElementById('pageValue');
    if (slider && pageValue) {
      slider.addEventListener('input', () => { pageValue.textContent = slider.value; });
    }

    const genBtn = document.getElementById('generateBtn');
    if (genBtn) genBtn.addEventListener('click', startGeneration);
  }

  async function runAnalysis() {
    const dot = document.getElementById('analysisDot');
    const text = document.getElementById('analysisText');
    const status = document.getElementById('analysisStatus');

    if (project?.analysis) {
      applyAnswers(project.analysis);
    } else if (documentContent) {
      const result = localAnalyze(documentContent);
      if (project) {
        project.analysis = result;
        const ser = JSON.stringify(project);
        localStorage.setItem('presenta-current-project', ser);
        sessionStorage.setItem('presenta-current-project', ser);
      }
      applyAnswers(result);
    }

    if (dot) dot.classList.add('done');
    if (text) text.textContent = '文档已就绪';
  }

  function localAnalyze(text) {
    const len = text.length;
    const pageCount = len < 2000 ? 6 : len < 5000 ? 8 : len < 10000 ? 12 : len < 20000 ? 16 : 20;

    const kw = (words) => words.some(w => text.includes(w));

    let reportType = '专业报告';
    if (kw(['融资', '投资', '估值', '路演'])) reportType = '融资路演';
    else if (kw(['季度', 'Q1', 'Q2', 'Q3', 'Q4', '汇报', '总结'])) reportType = '工作汇报';
    else if (kw(['竞品', '竞争', '对标'])) reportType = '竞品分析';
    else if (kw(['产品介绍', '功能', '特性', '解决方案'])) reportType = '产品介绍';
    else if (kw(['战略', '规划', '提案'])) reportType = '战略提案';
    else if (kw(['行业', '市场', '趋势', '报告'])) reportType = '行业报告';

    let audience = '内部团队';
    if (kw(['投资人', '投资者', '融资'])) audience = '投资人';
    else if (kw(['客户', '用户', '合作'])) audience = '客户';
    else if (kw(['高管', '决策', '董事'])) audience = '高管决策层';
    else if (kw(['技术', '架构', '开发', 'API'])) audience = '技术人员';

    let mood = 'editorial-swiss';
    if (kw(['科技', 'AI', '算法', '数据', '开发', 'API', '技术'])) mood = 'tech-dark-mode';
    else if (kw(['奢侈', '高端', '酒店', '珠宝', '美妆', '精品'])) mood = 'luxury-editorial';
    else if (kw(['建筑', '地产', '空间', '工艺', '设计'])) mood = 'minimal-architectural';
    else if (kw(['创意', '时尚', '生活', '文化', '艺术'])) mood = 'moodboard-collage';
    else if (kw(['品牌', '发布', '营销', '传播'])) mood = 'magazine-big-type';

    return {
      reportType,
      audienceRecommendation: audience,
      recommendedMood: mood,
      suggestedPageCount: pageCount,
      recommendedScenario: '数据叙事',
      coreThesis: '',
      chapterOutline: []
    };
  }

  function applyAnswers(a) {
    if (a.audienceRecommendation || a.audience) {
      const val = a.audienceRecommendation || a.audience;
      document.querySelectorAll('#audienceOptions .tag-option').forEach(t => {
        if (t.dataset.value === val) t.classList.add('active');
      });
    }

    if (a.recommendedMood || a.mood) {
      const val = a.recommendedMood || a.mood;
      document.querySelectorAll('#moodOptions .mood-card').forEach(c => {
        if (c.dataset.value === val) c.classList.add('active');
      });
    }

    if (a.suggestedPageCount || a.pageCount) {
      const val = a.suggestedPageCount || a.pageCount;
      const slider = document.getElementById('pageSlider');
      const display = document.getElementById('pageValue');
      if (slider && val >= 6 && val <= 24) { slider.value = val; if (display) display.textContent = val; }
    }

    if (a.coreThesis || a.title) {
      const val = a.title || a.coreThesis.replace(/[.。!！?？]+.*$/, '').slice(0, 30);
      const input = document.getElementById('titleInput');
      if (input && val.length > 3) input.value = val;
    }
  }

  function switchMoodGrid(comboId) {
    const classicGrid = document.getElementById('moodOptions');
    const apertureGrid = document.getElementById('apertureMoodOptions');
    if (!classicGrid || !apertureGrid) return;

    if (comboId === 'aperture') {
      classicGrid.style.display = 'none';
      apertureGrid.style.display = '';
      if (!apertureGrid.querySelector('.mood-card.active')) {
        const first = apertureGrid.querySelector('.mood-card');
        if (first) first.classList.add('active');
      }
    } else {
      classicGrid.style.display = '';
      apertureGrid.style.display = 'none';
      if (!classicGrid.querySelector('.mood-card.active')) {
        const first = classicGrid.querySelector('.mood-card');
        if (first) first.classList.add('active');
      }
    }
  }

  function collectAnswers() {
    const combo = document.querySelector('#comboOptions .combo-card.active')?.dataset.value || 'classic';
    const audience = document.querySelector('#audienceOptions .tag-option.active')?.dataset.value || '';

    let mood = '';
    if (combo === 'aperture') {
      mood = document.querySelector('#apertureMoodOptions .mood-card.active')?.dataset.value || 'default_deep';
    } else {
      mood = document.querySelector('#moodOptions .mood-card.active')?.dataset.value || '';
    }

    const pageCount = parseInt(document.getElementById('pageSlider')?.value || '12');
    const title = document.getElementById('titleInput')?.value?.trim() || '';
    const scenario = project?.analysis?.recommendedScenario || '';

    return { combo, audience, mood, pageCount, title, scenario };
  }

  async function startGeneration() {
    const genBtn = document.getElementById('generateBtn');
    if (genBtn) {
      genBtn.disabled = true;
      genBtn.textContent = '正在准备…';
    }

    const answers = collectAnswers();

    if (project) {
      project.wizard_answers = answers;
      project.updated_at = new Date().toISOString();
      const ser = JSON.stringify(project);
      localStorage.setItem('presenta-current-project', ser);
      sessionStorage.setItem('presenta-current-project', ser);
    }

    if (typeof GenerationModal === 'undefined' || typeof AIServiceIntegrated === 'undefined') {
      alert('组件未加载，请刷新页面');
      if (genBtn) { genBtn.disabled = false; genBtn.textContent = '生成演示文稿'; }
      return;
    }

    AIServiceIntegrated.loadPreferences();

    GenerationModal.show({
      onRetry: () => {
        if (genBtn) { genBtn.disabled = false; genBtn.textContent = '生成演示文稿'; }
        startGeneration();
      },
      onSettings: () => window.location.href = '../index.html'
    });

    try {
      await AIServiceIntegrated.generate(documentContent, answers, {
        onProgress: (data) => {
          GenerationModal.onProgress({ progress: data.progress || 0, message: data.message || '' });
        },
        onPlanningComplete: ({ planningYaml }) => {
          if (planningYaml && project) {
            project.planning_yaml = planningYaml;
            const ser = JSON.stringify(project);
            localStorage.setItem('presenta-current-project', ser);
          }
        },
        onSlideRender: (slide) => {
          console.log('[Wizard] slide', slide.index, 'rendered');
        },
        onComplete: ({ slides, planningYaml }) => {
          if (project) {
            project.slides = slides;
            project.planning_yaml = planningYaml;
            project.updated_at = new Date().toISOString();
            const ser = JSON.stringify(project);
            sessionStorage.setItem('presenta-current-project', ser);
            localStorage.setItem('presenta-current-project', ser);
            localStorage.setItem('presenta-draft', ser);
          }
          GenerationModal.onSuccess(slides);
          setTimeout(() => { window.location.href = 'editor.html'; }, 1500);
        },
        onError: (msg) => {
          GenerationModal.onError(msg);
          if (genBtn) { genBtn.disabled = false; genBtn.textContent = '生成演示文稿'; }
        }
      });
    } catch (err) {
      console.error('[Wizard] generation error:', err);
      GenerationModal.onError(err.message || '生成失败');
      if (genBtn) { genBtn.disabled = false; genBtn.textContent = '生成演示文稿'; }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
