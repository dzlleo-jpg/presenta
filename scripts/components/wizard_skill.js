(function() {
  'use strict';

  let project = null;
  let documentContent = '';

  function init() {
    loadProject();
    bindUI();
    runAnalysis();
  }

  function loadProject() {
    const saved = sessionStorage.getItem('presenta-current-project') ||
                  localStorage.getItem('presenta-current-project');
    if (!saved) { window.location.href = '../index.html'; return; }

    try {
      project = JSON.parse(saved);
      documentContent = project?.source_materials?.[0]?.parsed_text ||
                        project?.source_materials?.[0]?.content ||
                        project?.source_materials?.[0]?.raw_input || '';

      const src = project.source_materials?.[0];
      if (src) {
        const typeMap = { pdf: 'PDF 文档', markdown: 'Markdown', text: '文本', link: '网页' };
        const info = document.getElementById('docInfo');
        if (info) info.textContent = '已加载：' + (typeMap[src.type] || '文档');
      }

      if (project.wizard_answers) applyAnswers(project.wizard_answers);
    } catch (e) {
      console.error('[Wizard] load failed:', e);
      window.location.href = '../index.html';
    }
  }

  function bindUI() {
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
      if (dot) dot.classList.add('done');
      if (text) text.textContent = '文档分析完成';
      return;
    }

    if (!documentContent || typeof AIServiceIntegrated === 'undefined') {
      if (status) status.style.display = 'none';
      return;
    }

    try {
      AIServiceIntegrated.loadPreferences();
      const result = await AIServiceIntegrated.analyzeDocument(documentContent);

      if (result && project) {
        project.analysis = result;
        const ser = JSON.stringify(project);
        localStorage.setItem('presenta-current-project', ser);
        sessionStorage.setItem('presenta-current-project', ser);
        applyAnswers(result);
      }

      if (dot) dot.classList.add('done');
      if (text) text.textContent = '文档分析完成';
    } catch (e) {
      console.error('[Wizard] analysis failed:', e);
      if (status) status.style.display = 'none';
    }
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

  function collectAnswers() {
    const audience = document.querySelector('#audienceOptions .tag-option.active')?.dataset.value || '';
    const mood = document.querySelector('#moodOptions .mood-card.active')?.dataset.value || '';
    const pageCount = parseInt(document.getElementById('pageSlider')?.value || '12');
    const title = document.getElementById('titleInput')?.value?.trim() || '';
    const scenario = project?.analysis?.recommendedScenario || '';

    return { audience, mood, pageCount, title, scenario };
  }

  async function startGeneration() {
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
      return;
    }

    AIServiceIntegrated.loadPreferences();

    GenerationModal.show({
      onRetry: () => startGeneration(),
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
        }
      });
    } catch (err) {
      console.error('[Wizard] generation error:', err);
      GenerationModal.onError(err.message || '生成失败');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
