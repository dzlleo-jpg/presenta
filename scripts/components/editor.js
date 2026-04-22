/**
 * =============================================
 * Presenta - Editor Component (V2 极简版)
 * AI 负责排版，人只改内容 + 调整体风格
 * =============================================
 */

(function() {
  'use strict';

  // ============================================
  // DOM Elements
  // ============================================
  const slideList      = document.getElementById('slideList');
  const slideCanvas    = document.getElementById('slideCanvas');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlideNum  = document.getElementById('totalSlideNum');
  const prevSlideBtn   = document.getElementById('prevSlideBtn');
  const nextSlideBtn   = document.getElementById('nextSlideBtn');
  const zoomInBtn      = document.getElementById('zoomInBtn');
  const zoomOutBtn     = document.getElementById('zoomOutBtn');
  const fitBtn         = document.getElementById('fitBtn');
  const zoomLevel      = document.getElementById('zoomLevel');
  const previewBtn     = document.getElementById('previewBtn');
  const panelTabs      = document.querySelectorAll('.panel-tab');
  const tabContents    = document.querySelectorAll('.tab-content');
  const imagePopup     = document.getElementById('imagePopup');

  // Style sliders
  const fontSizeSlider  = document.getElementById('fontSizeSlider');
  const lineHeightSlider = document.getElementById('lineHeightSlider');
  const paddingXSlider  = document.getElementById('paddingXSlider');
  const densitySlider   = document.getElementById('densitySlider');
  const fontPresets     = document.querySelectorAll('.font-preset');

  // ============================================
  // State
  // ============================================
  let project    = null;
  let slides     = [];
  let currentIdx = 0;
  let zoom       = 1;

  // ============================================
  // Init
  // ============================================
  function init() {
    loadProject();
    console.log('[Editor] project:', !!project, '| slides:', slides?.length);
    if (!project || !slides.length) {
      // 无 slides，跳转 outline 重新生成
      window.location.href = 'wizard.html';
      return;
    }
    // 恢复上次的滑块设置（从 project 里读）
    restoreStyleSettings();
    // 渲染缩略图
    renderSlideList();
    // 渲染当前幻灯片
    renderCurrentSlide();
    updateNavigation();
    bindEvents();
    // 应用初始样式
    applyAllSliders();
  }

  // ============================================
  // Load
  // ============================================
  function loadProject() {
    try {
      const saved = sessionStorage.getItem('presenta-current-project') ||
                    localStorage.getItem('presenta-current-project');
      project = JSON.parse(saved || 'null');
      if (project) {
        slides = project.slides || [];
      }
    } catch (e) {
      project = null;
      slides  = [];
    }
  }

  function saveProject() {
    if (!project) return;
    project.slides = slides;
    localStorage.setItem('presenta-current-project', JSON.stringify(project));
  }

  // ============================================
  // Render Slide List (thumbnail nav)
  // ============================================
  function renderSlideList() {
    if (!slideList) return;
    slideList.innerHTML = '';
    slides.forEach((slide, i) => {
      const item = document.createElement('div');
      item.className = 'thumb' + (i === currentIdx ? ' active' : '');
      item.dataset.index = i;

      // 缩略图内容：用 iframe 或 div 预览
      // 由于每张 slide 是独立 HTML，这里用简化的方式渲染
      const preview = document.createElement('div');
      preview.className = 'thumb-preview';
      preview.innerHTML = `
        <div class="thumb-bg" style="background:${getSlideBg(slide)}">
          <span class="thumb-role">${getRoleEmoji(slide.role)}</span>
        </div>
        <span class="thumb-label">${i + 1}</span>
      `;

      item.appendChild(preview);
      item.addEventListener('click', () => switchToSlide(i));
      slideList.appendChild(item);
    });
  }

  function getRoleEmoji(role) {
    const map = { cover: '🏠', chapter_break: '📂', climax: '💡', support: '📊', insight: '💬', comparison: '⚖️', closing: '✅' };
    return map[role] || '📄';
  }

  function getSlideBg(slide) {
    // 简单提取背景色（从 HTML 的 style 里找）
    if (!slide.html) return 'var(--bg, #1a1a2e)';
    const m = slide.html.match(/background:\s*([^;]+)/);
    return m ? m[1] : 'var(--bg, #1a1a2e)';
  }

  // ============================================
  // Render Current Slide
  // ============================================
  function renderCurrentSlide() {
    if (!slideCanvas || !slides[currentIdx]) return;
    const slide = slides[currentIdx];
    // 将 HTML 注入画布
    slideCanvas.innerHTML = slide.html || '';
    // 标记文字区域（点击可编辑）
    markEditableAreas();
    // 更新图片列表
    renderImageList();
  }

  // 标记可编辑的文字区域
  function markEditableAreas() {
    if (!slideCanvas) return;
    // 所有文字节点加上 data-text，双击进入编辑
    const textEls = slideCanvas.querySelectorAll('h1,h2,h3,h4,p,li,span:not(.hero-number):not(.secondary-label)');
    textEls.forEach(el => {
      if (!el.hasAttribute('data-text')) {
        el.setAttribute('data-text', 'true');
        el.setAttribute('contenteditable', 'false');
        // 双击编辑
        el.addEventListener('dblclick', startTextEdit);
        // 失焦保存
        el.addEventListener('blur', saveTextEdit);
      }
    });
    // 图片点击
    const imgs = slideCanvas.querySelectorAll('img');
    imgs.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', handleImageClick);
    });
  }

  function startTextEdit(e) {
    e.target.setAttribute('contenteditable', 'true');
    e.target.focus();
    // 把光标移到末尾
    const range = document.createRange();
    range.selectNodeContents(e.target);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function saveTextEdit(e) {
    const el = e.target;
    if (!el.hasAttribute('data-text')) return;
    el.setAttribute('contenteditable', 'false');
    // 保存到 slide 对象
    if (slides[currentIdx]) {
      slides[currentIdx].html = slideCanvas.innerHTML;
      saveProject();
    }
  }

  // ============================================
  // Image Click → Popup
  // ============================================
  function handleImageClick(e) {
    e.stopPropagation();
    const img = e.currentTarget;
    showImagePopup(img, img.getBoundingClientRect());
  }

  function showImagePopup(imgEl, rect) {
    // 隐藏已存在的浮层
    hideImagePopup();
    // 记录当前操作的图片
    imagePopup.dataset.imgSrc    = imgEl.src;
    imagePopup.dataset.imgAlt    = imgEl.alt || '';
    imagePopup.dataset.slideIdx = currentIdx;

    // 定位浮层
    const popupW = 200;
    const popupH = 160;
    let left = rect.left + rect.width / 2 - popupW / 2;
    let top  = rect.bottom + 8;

    // 屏幕边缘检测
    if (left < 8) left = 8;
    if (left + popupW > window.innerWidth - 8) left = window.innerWidth - popupW - 8;
    if (top + popupH > window.innerHeight - 8) top = rect.top - popupH - 8;

    imagePopup.style.left = left + 'px';
    imagePopup.style.top  = top + 'px';
    imagePopup.style.display = 'block';
  }

  function hideImagePopup() {
    if (imagePopup) imagePopup.style.display = 'none';
  }

  // 图片操作处理
  imagePopup?.querySelectorAll('.popup-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const slideIdx = parseInt(imagePopup.dataset.slideIdx);
      const imgSrc   = imagePopup.dataset.imgSrc;
      hideImagePopup();

      if (action === 'upload') {
        triggerImageUpload(slideIdx, imgSrc);
      } else if (action === 'replace') {
        triggerImageReplace(slideIdx, imgSrc);
      } else if (action === 'regenerate') {
        triggerImageRegenerate(slideIdx, imgSrc);
      }
    });
  });

  function triggerImageUpload(slideIdx, currentSrc) {
    const input = document.createElement('input');
    input.type  = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        replaceImageInSlide(slideIdx, currentSrc, ev.target.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function triggerImageReplace(slideIdx, currentSrc) {
    // 简单：让用户粘贴图片 URL
    const url = prompt('请输入新图片 URL：', '');
    if (url && url.trim()) {
      replaceImageInSlide(slideIdx, currentSrc, url.trim());
    }
  }

  function triggerImageRegenerate(slideIdx, currentSrc) {
    // 目前用 Mock：直接替换 src 为 placeholder
    // 真实场景：调用 AIServiceIntegrated.regenerateImage()
    const placeholder = 'https://picsum.photos/800/450?random=' + Date.now();
    replaceImageInSlide(slideIdx, currentSrc, placeholder);
  }

  function replaceImageInSlide(slideIdx, oldSrc, newSrc) {
    if (!slides[slideIdx]) return;
    // 替换 HTML 中的 src
    slides[slideIdx].html = slides[slideIdx].html.replace(
      new RegExp(escapeRegex(oldSrc), 'g'),
      newSrc
    );
    saveProject();
    // 如果是当前页，立即刷新
    if (slideIdx === currentIdx) {
      renderCurrentSlide();
    }
    renderImageList();
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ============================================
  // Image List (右侧面板)
  // ============================================
  function renderImageList() {
    const pageList   = document.getElementById('pageImageList');
    const allGrid    = document.getElementById('allImageGrid');
    const currentSlide = slides[currentIdx];

    // 当前页图片
    if (pageList) {
      const imgs = currentSlide?.html ? [...currentSlide.html.matchAll(/<img[^>]+src="([^"]+)"/g)] : [];
      if (imgs.length === 0) {
        pageList.innerHTML = '<p class="empty-hint">本页暂无图片</p>';
      } else {
        pageList.innerHTML = imgs.map((m, i) => `
          <div class="img-item" data-src="${m[1]}">
            <img src="${m[1]}" alt="图片${i+1}" loading="lazy">
            <div class="img-actions">
              <button data-action="replace">替换</button>
              <button data-action="upload">上传</button>
              <button data-action="regenerate">重新生成</button>
            </div>
          </div>
        `).join('');
        pageList.querySelectorAll('.img-item').forEach(item => {
          item.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
              const action = btn.dataset.action;
              const src    = item.dataset.src;
              if (action === 'upload')   triggerImageUpload(currentIdx, src);
              if (action === 'replace')  triggerImageReplace(currentIdx, src);
              if (action === 'regenerate') triggerImageRegenerate(currentIdx, src);
            });
          });
        });
      }
    }

    // 全部图片网格
    if (allGrid) {
      const allImgs = [];
      slides.forEach((s, si) => {
        if (!s.html) return;
        const matches = [...s.html.matchAll(/<img[^>]+src="([^"]+)"/g)];
        matches.forEach(m => allImgs.push({ src: m[1], slideIdx: si }));
      });
      if (allImgs.length === 0) {
        allGrid.innerHTML = '<p class="empty-hint">暂无图片</p>';
      } else {
        allGrid.innerHTML = allImgs.map(({ src, slideIdx }) => `
          <div class="all-img-thumb" data-slide="${slideIdx}" title="第${slideIdx+1}页">
            <img src="${src}" alt="" loading="lazy">
          </div>
        `).join('');
        allGrid.querySelectorAll('.all-img-thumb').forEach(el => {
          el.addEventListener('click', () => switchToSlide(parseInt(el.dataset.slide)));
        });
      }
    }
  }

  // ============================================
  // Navigation
  // ============================================
  function switchToSlide(idx) {
    if (idx < 0 || idx >= slides.length) return;
    // 先保存当前页
    if (slides[currentIdx]) {
      slides[currentIdx].html = slideCanvas.innerHTML;
      saveProject();
    }
    currentIdx = idx;
    renderCurrentSlide();
    updateNavigation();
    // 更新缩略图高亮
    document.querySelectorAll('.thumb').forEach((t, i) => {
      t.classList.toggle('active', i === currentIdx);
    });
  }

  function updateNavigation() {
    if (currentSlideNum) currentSlideNum.textContent = currentIdx + 1;
    if (totalSlideNum)   totalSlideNum.textContent   = slides.length;
    if (prevSlideBtn)   prevSlideBtn.disabled = currentIdx === 0;
    if (nextSlideBtn)   nextSlideBtn.disabled = currentIdx === slides.length - 1;
  }

  // ============================================
  // Zoom
  // ============================================
  function updateZoom() {
    if (!slideCanvas) return;
    slideCanvas.style.transform = `scale(${zoom})`;
    slideCanvas.style.transformOrigin = 'top left';
    if (zoomLevel) zoomLevel.textContent = Math.round(zoom * 100) + '%';
  }

  // ============================================
  // Tab Switching
  // ============================================
  function switchTab(tabName) {
    panelTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    tabContents.forEach(c => c.classList.toggle('active', c.id === tabName + 'Tab'));
  }

  // ============================================
  // Style Controls (CSS 变量)
  // ============================================
  function applyAllSliders() {
    applyFontSize(parseInt(fontSizeSlider?.value || 24));
    applyLineHeight(parseFloat(lineHeightSlider?.value || 1.6));
    applyPaddingX(parseInt(paddingXSlider?.value || 64));
    applyDensity(parseFloat(densitySlider?.value || 1.0));
  }

  function applyFontSize(val) {
    const base = val;
    const root = document.documentElement;
    root.style.setProperty('--font-size-base',  val + 'px');
    root.style.setProperty('--font-size-h1',    (val * 3.3) + 'px');
    root.style.setProperty('--font-size-h2',    (val * 2.3) + 'px');
    root.style.setProperty('--font-size-h3',    (val * 1.5) + 'px');
    root.style.setProperty('--font-size-h4',    (val * 1.3) + 'px');
    root.style.setProperty('--font-size-body',  (val * 0.75) + 'px');
    root.style.setProperty('--font-size-small', (val * 0.67) + 'px');
    root.style.setProperty('--font-size-xs',    (val * 0.58) + 'px');
    root.style.setProperty('--font-size-hero',  (val * 6.7) + 'px');
    root.style.setProperty('--font-size-stat',  (val * 2.0) + 'px');
    if (document.getElementById('fontSizeVal')) {
      document.getElementById('fontSizeVal').textContent = val + 'px';
    }
    saveStyleSettings();
  }

  function applyLineHeight(val) {
    document.documentElement.style.setProperty('--line-height', val);
    document.documentElement.style.setProperty('--line-height-tight',  Math.max(1.0, val - 0.4));
    document.documentElement.style.setProperty('--line-height-loose',  Math.min(2.0, val + 0.2));
    if (document.getElementById('lineHeightVal')) {
      document.getElementById('lineHeightVal').textContent = val.toFixed(1);
    }
    saveStyleSettings();
  }

  function applyPaddingX(val) {
    document.documentElement.style.setProperty('--slide-padding-x', val + 'px');
    document.documentElement.style.setProperty('--slide-padding-y', Math.round(val * 0.75) + 'px');
    if (document.getElementById('paddingXVal')) {
      document.getElementById('paddingXVal').textContent = val + 'px';
    }
    saveStyleSettings();
  }

  function applyDensity(val) {
    document.documentElement.style.setProperty('--slide-density', val);
    document.documentElement.style.setProperty('--slide-gap',         Math.round(48 * val) + 'px');
    document.documentElement.style.setProperty('--slide-element-gap', Math.round(16 * val) + 'px');
    const labels = { '0.7': '宽松', '0.8': '宽松', '0.9': '略松', '1.0': '标准', '1.1': '略紧', '1.2': '紧凑', '1.3': '紧凑' };
    const label = labels[val.toFixed(1)] || '标准';
    if (document.getElementById('densityVal')) {
      document.getElementById('densityVal').textContent = label;
    }
    saveStyleSettings();
  }

  function applyFontPreset(heading, body) {
    document.documentElement.style.setProperty('--slide-font-heading', heading);
    document.documentElement.style.setProperty('--slide-font-body',   body);
    saveStyleSettings();
  }

  // ============================================
  // Style Persistence
  // ============================================
  function saveStyleSettings() {
    if (!project) return;
    project.styleSettings = {
      fontSize:   parseInt(fontSizeSlider?.value || 24),
      lineHeight: parseFloat(lineHeightSlider?.value || 1.6),
      paddingX:   parseInt(paddingXSlider?.value || 64),
      density:    parseFloat(densitySlider?.value || 1.0),
      heading:    getComputedStyle(document.documentElement).getPropertyValue('--slide-font-heading').trim() || 'Noto Serif SC',
      body:       getComputedStyle(document.documentElement).getPropertyValue('--slide-font-body').trim() || 'Noto Sans SC'
    };
    localStorage.setItem('presenta-current-project', JSON.stringify(project));
  }

  function restoreStyleSettings() {
    if (!project?.styleSettings) return;
    const s = project.styleSettings;
    if (fontSizeSlider)   fontSizeSlider.value   = s.fontSize   || 24;
    if (lineHeightSlider) lineHeightSlider.value = s.lineHeight || 1.6;
    if (paddingXSlider)   paddingXSlider.value   = s.paddingX   || 64;
    if (densitySlider)    densitySlider.value    = s.density    || 1.0;
    if (s.heading) document.documentElement.style.setProperty('--slide-font-heading', s.heading);
    if (s.body)    document.documentElement.style.setProperty('--slide-font-body',   s.body);
    // 更新字体预设按钮状态
    fontPresets.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.heading === s.heading);
    });
  }

  // ============================================
  // Event Bindings
  // ============================================
  function bindEvents() {
    // 导航
    prevSlideBtn?.addEventListener('click', () => switchToSlide(currentIdx - 1));
    nextSlideBtn?.addEventListener('click', () => switchToSlide(currentIdx + 1));

    // 键盘导航
    document.addEventListener('keydown', (e) => {
      if (e.target.hasAttribute('contenteditable')) return;
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   switchToSlide(currentIdx - 1);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') switchToSlide(currentIdx + 1);
    });

    // 缩放
    zoomInBtn?.addEventListener('click',  () => { zoom = Math.min(2, zoom + 0.1); updateZoom(); });
    zoomOutBtn?.addEventListener('click', () => { zoom = Math.max(0.3, zoom - 0.1); updateZoom(); });
    fitBtn?.addEventListener('click', () => { zoom = 1; updateZoom(); });
    slideCanvas?.parentElement?.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoom = Math.max(0.3, Math.min(2, zoom - e.deltaY * 0.001));
        updateZoom();
      }
    }, { passive: false });

    // 预览
    previewBtn?.addEventListener('click', () => {
      // 先保存
      if (slides[currentIdx]) {
        slides[currentIdx].html = slideCanvas.innerHTML;
        saveProject();
      }
      window.location.href = 'preview.html';
    });

    // Tab 切换
    panelTabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // 样式滑块
    fontSizeSlider?.addEventListener('input', (e) => applyFontSize(parseInt(e.target.value)));
    lineHeightSlider?.addEventListener('input', (e) => applyLineHeight(parseFloat(e.target.value)));
    paddingXSlider?.addEventListener('input', (e) => applyPaddingX(parseInt(e.target.value)));
    densitySlider?.addEventListener('input', (e) => applyDensity(parseFloat(e.target.value)));

    // 字体预设
    fontPresets.forEach(btn => {
      btn.addEventListener('click', () => {
        fontPresets.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFontPreset(btn.dataset.heading, btn.dataset.body);
      });
    });

    // 点击其他地方关闭图片浮层
    document.addEventListener('click', (e) => {
      if (!imagePopup?.contains(e.target) && !e.target.closest('img')) {
        hideImagePopup();
      }
    });
  }

  // ============================================
  // Start
  // ============================================
  init();

})();
