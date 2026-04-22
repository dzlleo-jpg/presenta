/**
 * =============================================
 * Presenta - Upload Component
 * =============================================
 * Handles file uploads, drag & drop, and navigation to wizard
 */

(function() {
  'use strict';
  console.log('[Presenta] upload.js 开始执行');

  // ============================================
  // DOM Elements
  // ============================================
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const themeToggle = document.getElementById('themeToggle');
  
  // Modals
  const markdownModal = document.getElementById('markdownModal');
  const urlModal = document.getElementById('urlModal');
  const processingModal = document.getElementById('processingModal');
  
  // Modal Buttons
  const pasteMarkdownBtn = document.getElementById('pasteMarkdownBtn');
  const enterUrlBtn = document.getElementById('enterUrlBtn');
  const lastDraftBtn = document.getElementById('lastDraftBtn');
  
  const closeMarkdownModal = document.getElementById('closeMarkdownModal');
  const cancelMarkdown = document.getElementById('cancelMarkdown');
  const submitMarkdown = document.getElementById('submitMarkdown');
  const markdownInput = document.getElementById('markdownInput');
  
  const closeUrlModal = document.getElementById('closeUrlModal');
  const cancelUrl = document.getElementById('cancelUrl');
  const submitUrl = document.getElementById('submitUrl');
  const urlInput = document.getElementById('urlInput');
  const fetchUrl = document.getElementById('fetchUrl');

  // Processing Modal
  const processingBar = document.getElementById('processingBar');
  const processingStatus = document.getElementById('processingStatus');

  // ============================================
  // State
  // ============================================
  let currentTheme = 'dark';
  let currentProject = null;  // 保存当前 project，避免跨 AppState 实例丢失

  // ============================================
  // Theme Toggle
  // ============================================
  function initTheme() {
    const savedTheme = localStorage.getItem('presenta-theme');
    if (savedTheme) {
      currentTheme = savedTheme;
      applyTheme(savedTheme);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('presenta-theme', newTheme);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // ============================================
  // Drag & Drop
  // ============================================
  function initDragDrop() {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadZone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    uploadZone.addEventListener('drop', handleDrop, false);

    // Click to upload
    uploadZone.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    });
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight(e) {
    uploadZone.classList.add('drag-over');
  }

  function unhighlight(e) {
    uploadZone.classList.remove('drag-over');
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  function handleFiles(files) {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/markdown', 'text/plain'];
    const validExtensions = ['.pdf', '.md', '.markdown', '.txt'];
    
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      showError('不支持的文件格式，请上传 PDF、Markdown 或文本文件');
      return;
    }

    // Check file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('文件过大，请上传小于 50MB 的文件');
      return;
    }

    // Process the file
    processFile(file);
  }

  // ============================================
  // File Processing
  // ============================================
  async function processFile(file) {
    console.log('[Presenta] 开始处理文件:', file.name, '大小:', file.size);
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    let type = 'other';
    if (ext === '.pdf') type = 'pdf';
    else if (['.md', '.markdown'].includes(ext)) type = 'markdown';
    else if (ext === '.txt') type = 'text';

    showProcessingModal();
    processingStatus.textContent = '正在读取文件…';
    processingBar.style.width = '10%';

    try {
      let parsed_text = '';
      let word_count = 0;
      let page_count = 1;

      if (type === 'markdown' || type === 'text') {
        // 真实读取文件内容
        parsed_text = await readFileAsText(file);
        word_count = countWords(parsed_text);
        processingStatus.textContent = '文件读取完成，正在分析…';
        processingBar.style.width = '60%';
      } else if (type === 'pdf') {
        let pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) {
          processingStatus.textContent = '正在加载 PDF 解析器…';
          for (let i = 0; i < 20; i++) {
            await sleep(500);
            if (window.pdfjsLib) { pdfjsLib = window.pdfjsLib; break; }
          }
        }
        if (pdfjsLib) {
          processingStatus.textContent = '正在解析 PDF…';
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          page_count = pdf.numPages;
          processingStatus.textContent = `正在提取文字（共 ${page_count} 页）…`;
          const textParts = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            textParts.push(content.items.map(item => item.str).join(' '));
            processingBar.style.width = (30 + i / pdf.numPages * 50) + '%';
          }
          parsed_text = textParts.join('\n\n');
          word_count = countWords(parsed_text);
        } else {
          hideProcessingModal();
          showError('PDF 解析器加载失败（网络问题），请稍后重试或改用 Markdown 格式上传');
          return;
        }
      } else {
        parsed_text = await readFileAsText(file);
        word_count = countWords(parsed_text);
      }

      console.log('[Presenta] 解析完成，文字长度:', parsed_text.length, '字数:', word_count);

      const sourceMaterial = {
        id: window.Models.generateId(),
        type: type,
        raw_input: file.name,
        parsed_text: parsed_text,
        parse_confidence: parsed_text.length > 50 ? 0.95 : 0.5,
        page_count: page_count,
        word_count: word_count,
        status: 'done',
        error_message: null
      };

      processingStatus.textContent = '完成！';
      processingBar.style.width = '100%';
      await sleep(300);

      const appState = new window.Models.AppState();
      appState.initProject(sourceMaterial);
      currentProject = appState.getState().project;
      console.log('[Presenta] 项目已创建，parsed_text 长度:', currentProject?.source_materials?.[0]?.parsed_text?.length);

      saveDraft(currentProject);

      setTimeout(() => {
        hideProcessingModal();
        navigateToWizard();
      }, 400);

    } catch (err) {
      console.error('[Presenta] processFile 失败:', err);
      hideProcessingModal();
      showError('文件处理失败: ' + err.message);
    }
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function countWords(text) {
    return text.replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ============================================
  // Modal Handling
  // ============================================
  function initModals() {
    // Markdown Modal
    pasteMarkdownBtn.addEventListener('click', () => openModal(markdownModal));
    closeMarkdownModal.addEventListener('click', () => closeModal(markdownModal));
    cancelMarkdown.addEventListener('click', () => closeModal(markdownModal));
    submitMarkdown.addEventListener('click', handleMarkdownSubmit);

    // URL Modal
    enterUrlBtn.addEventListener('click', () => openModal(urlModal));
    closeUrlModal.addEventListener('click', () => closeModal(urlModal));
    cancelUrl.addEventListener('click', () => closeModal(urlModal));
    submitUrl.addEventListener('click', handleUrlSubmit);
    fetchUrl.addEventListener('click', handleFetchUrl);

    // Last Draft
    lastDraftBtn.addEventListener('click', handleLastDraft);

    // Close on overlay click
    [markdownModal, urlModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(markdownModal);
        closeModal(urlModal);
      }
    });
  }

  function openModal(modal) {
    modal.classList.add('active');
    // Focus first input if exists
    const input = modal.querySelector('input, textarea');
    if (input) setTimeout(() => input.focus(), 100);
  }

  function closeModal(modal) {
    modal.classList.remove('active');
  }

  // ============================================
  // Markdown Submit
  // ============================================
  async function handleMarkdownSubmit() {
    const content = markdownInput.value.trim();
    if (!content) { showError('请输入 Markdown 内容'); return; }
    if (content.length < 20) { showError('内容太短（至少 20 字）'); return; }

    closeModal(markdownModal);
    showProcessingModal();

    // 真实解析 Markdown 文本（不用 simulateProcessing 假循环）
    processingStatus.textContent = '正在分析文档内容…';
    processingBar.style.width = '50%';
    await sleep(200);

    const word_count = content.replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
    const sourceMaterial = {
      id: window.Models.generateId(),
      type: 'markdown',
      raw_input: '粘贴内容',
      parsed_text: content,
      parse_confidence: 1.0,
      page_count: 1,
      word_count: word_count,
      status: 'done',
      error_message: null
    };
    processingStatus.textContent = '完成！';
    processingBar.style.width = '100%';
    await sleep(200);

    const appState = new window.Models.AppState();
    appState.initProject(sourceMaterial);
    currentProject = appState.getState().project;
    console.log('[Presenta] Markdown 项目已创建，parsed_text 长度:', content.length);
    saveDraft(currentProject);

    setTimeout(() => { hideProcessingModal(); navigateToWizard(); }, 300);
  }

  // ============================================
  // URL Submit
  // ============================================
  async function handleUrlSubmit() {
    const url = urlInput.value.trim();
    
    if (!url) {
      showError('请输入网址');
      return;
    }

    if (!isValidUrl(url)) {
      showError('请输入有效的网址');
      return;
    }

    closeModal(urlModal);
    showProcessingModal();

    // Simulate URL fetching
    processingStatus.textContent = '正在抓取网页内容...';
    await sleep(1500);

    const sourceMaterial = {
      id: window.Models.generateId(),
      type: 'link',
      raw_input: url,
      parsed_text: `从 ${new URL(url).hostname} 抓取的内容...`,
      parse_confidence: 0.85,
      page_count: 1,
      word_count: Math.floor(Math.random() * 3000) + 500,
      status: 'done',
      error_message: null
    };

    await simulateProcessing({ name: 'web-content.md' }, 'markdown');

    const appState = new window.Models.AppState();
    appState.initProject(sourceMaterial);
    currentProject = appState.getState().project;
    saveDraft(currentProject);

    setTimeout(() => {
      hideProcessingModal();
      navigateToWizard();
    }, 300);
  }

  async function handleFetchUrl() {
    const url = urlInput.value.trim();
    if (!url) {
      showError('请先输入网址');
      return;
    }
    if (!isValidUrl(url)) {
      showError('请输入有效的网址');
      return;
    }

    // Simulate URL preview
    fetchUrl.innerHTML = '<span class="animate-spin">⟳</span> 抓取中...';
    fetchUrl.disabled = true;
    
    await sleep(1500);
    
    fetchUrl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg> 已抓取`;

    setTimeout(() => {
      fetchUrl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg> 抓取`;
      fetchUrl.disabled = false;
    }, 2000);
  }

  // ============================================
  // Last Draft
  // ============================================
  function handleLastDraft() {
    const draft = localStorage.getItem('presenta-draft');
    
    if (!draft) {
      showError('没有找到上次草稿');
      return;
    }

    try {
      const project = JSON.parse(draft);
      currentProject = project;
      const appState = new window.Models.AppState();
      appState.setState({ project });
      navigateToWizard();
    } catch (e) {
      showError('草稿解析失败，请重新开始');
      localStorage.removeItem('presenta-draft');
    }
  }

  // ============================================
  // Draft Management
  // ============================================
  function saveDraft(project) {
    localStorage.setItem('presenta-draft', JSON.stringify(project));
  }

  // ============================================
  // Processing Modal
  // ============================================
  function showProcessingModal() {
    processingBar.style.width = '0%';
    processingModal.classList.add('active');
  }

  function hideProcessingModal() {
    processingModal.classList.remove('active');
  }

  // ============================================
  // Navigation
  // ============================================
  function navigateToWizard() {
    // 使用 currentProject（在 processFile/handleMarkdownSubmit/handleUrlSubmit 中设置）
    // 而不是重新创建空 AppState（之前每次 new AppState() 都丢失了 project！）
    console.log('[Presenta] navigateToWizard 调用, currentProject 存在:', !!currentProject);
    if (currentProject) {
      localStorage.setItem('presenta-current-project', JSON.stringify(currentProject));
      sessionStorage.setItem('presenta-current-project', JSON.stringify(currentProject));
    } else {
      // 兜底：尝试从 localStorage 恢复
      const draft = localStorage.getItem('presenta-draft');
      if (draft) {
        try {
          currentProject = JSON.parse(draft);
          localStorage.setItem('presenta-current-project', draft);
          sessionStorage.setItem('presenta-current-project', draft);
        } catch (e) {
          console.error('草稿解析失败:', e);
        }
      }
    }

    // Navigate to analysis page (new flow: analysis before wizard)
    window.location.href = 'pages/wizard.html';
  }

  // ============================================
  // Utilities
  // ============================================
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  function showError(message) {
    // Simple alert for now - replace with toast notification later
    alert(message);
  }

  // ============================================
  // AI Model Selection Modal
  // ============================================
  function initAiModal() {
    const modal       = document.getElementById('aiModal');
    const overlay    = document.getElementById('aiModalOverlay');
    const modelBtn   = document.getElementById('aiModelBtn');
    const closeBtn   = document.getElementById('closeAiModal');
    const cancelBtn  = document.getElementById('cancelAiModal');
    const saveBtn    = document.getElementById('saveAiModal');
    const testBtn    = document.getElementById('btnTestApi');
    const keyInput   = document.getElementById('indexApiKeyInput');
    const hint       = document.getElementById('aiModalHint');
    const valStatus  = document.getElementById('validateStatus');
    const valText    = document.getElementById('validateText');
    const radios     = document.querySelectorAll('input[name="index-ai-provider"]');
    const required   = document.getElementById('apiKeyRequired');

    if (!modal) return;

    let isValidating = false;
    let currentValidation = null; // abort controller

    function showValidate(type, msg) {
      if (!valStatus) return;
      valStatus.className = 'ai-validate-status ' + type;
      valStatus.style.display = '';
      valText.textContent = msg;
    }

    function hideValidate() {
      if (!valStatus) return;
      valStatus.style.display = 'none';
    }

    function updateCheckIcon(provider, state) {
      const el = document.getElementById('check-' + provider);
      if (!el) return;
      el.className = 'ai-provider-check';
      if (state === 'ok') { el.textContent = '✓'; el.classList.add('ok'); }
      else if (state === 'bad') { el.textContent = '✗'; el.classList.add('bad'); }
      else { el.textContent = ''; }
    }

    async function validateApi(provider, key) {
      if (isValidating) {
        currentValidation?.abort();
      }
      isValidating = true;
      currentValidation = new AbortController();

      showValidate('validating', '正在验证 API Key…');

      try {
        const result = await window.AIServiceIntegrated?.validateApiKey?.(provider, key);
        if (currentValidation.signal.aborted) return;

        if (result?.valid) {
          showValidate('success', '✓ API Key 验证成功！');
          updateCheckIcon(provider, 'ok');
        } else {
          showValidate('error', '✗ API Key 无效，请检查');
          updateCheckIcon(provider, 'bad');
        }
      } catch (e) {
        if (currentValidation.signal.aborted) return;
        showValidate('error', '验证失败：' + (e.message || '网络错误'));
        updateCheckIcon(provider, 'bad');
      } finally {
        isValidating = false;
      }
    }

    function loadSaved() {
      const savedProvider = localStorage.getItem('presenta-ai-provider') || 'mock';
      const savedKey = localStorage.getItem('presenta-ai-key-' + savedProvider) || '';
      radios.forEach(r => { r.checked = r.value === savedProvider; });
      keyInput.value = savedKey;
      updateModelLabel(savedProvider);
    }

    function updateModelLabel(provider) {
      const label = document.getElementById('aiModelLabel');
      if (!label) return;
      const names = { minimax: 'MiniMax', openai: 'GPT-4o', siliconflow: 'SiliconFlow', deepseek: 'DeepSeek', anthropic: 'Claude', mock: 'Mock' };
      label.textContent = names[provider] || provider;
    }

    function openModal() {
      loadSaved();
      hideValidate();
      hint.style.display = 'none';
      modal.style.display = '';
      overlay.style.display = '';
      document.body.style.overflow = 'hidden';
      // Clear all check icons
      ['minimax', 'openai', 'siliconflow', 'deepseek', 'anthropic'].forEach(p => updateCheckIcon(p, ''));
      // Show validation for currently selected if key exists
      const sel = document.querySelector('input[name="index-ai-provider"]:checked');
      if (sel && keyInput.value) {
        // Show as "未验证" until user clicks test
      }
    }

    function closeModal() {
      currentValidation?.abort();
      modal.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }

    modelBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // Update check icon when provider changes
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        hideValidate();
        ['minimax', 'openai', 'siliconflow', 'deepseek', 'anthropic'].forEach(p => updateCheckIcon(p, ''));
      });
    });

    // Test API button
    testBtn?.addEventListener('click', async () => {
      const selected = document.querySelector('input[name="index-ai-provider"]:checked');
      const provider = selected?.value;
      const key = keyInput.value.trim();
      if (!provider) { showValidate('error', '请先选择一个 AI 模型'); return; }
      if (!key) { showValidate('error', '请输入 API Key'); return; }
      await validateApi(provider, key);
    });

    // Key input: auto-validate on blur
    keyInput?.addEventListener('blur', async () => {
      const selected = document.querySelector('input[name="index-ai-provider"]:checked');
      const provider = selected?.value;
      const key = keyInput.value.trim();
      if (provider && key && key.length > 10) {
        await validateApi(provider, key);
      }
    });

    saveBtn?.addEventListener('click', () => {
      const selected = document.querySelector('input[name="index-ai-provider"]:checked');
      if (!selected) { hint.textContent = '请选择一个 AI 模型'; hint.style.display = ''; return; }
      const provider = selected.value;
      const key = keyInput.value.trim();

      if (provider !== 'mock' && !key) {
        required.style.display = '';
        hint.textContent = '请输入 API Key'; hint.style.display = '';
        return;
      }
      required.style.display = 'none';

      localStorage.setItem('presenta-ai-provider', provider);
      if (key) localStorage.setItem('presenta-ai-key-' + provider, key);
      else localStorage.removeItem('presenta-ai-key-' + provider);

      updateModelLabel(provider);
      closeModal();
    });

    // ESC to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.style.display !== 'none') closeModal();
    });
  }

  // ============================================
  // Initialize
  // ============================================
  function init() {
    console.log('[Presenta] upload.js init(), uploadZone:', !!uploadZone, 'fileInput:', !!fileInput, 'Models:', !!window.Models);
    initTheme();
    initDragDrop();
    initModals();
    initAiModal();
  }

  // Wait for DOM and Models to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
