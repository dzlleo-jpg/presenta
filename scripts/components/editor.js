/**
 * =============================================
 * Presenta - Editor Component
 * WYSIWYG slide iframe rendering + global style controls
 * =============================================
 */

(function() {
  'use strict';

  const SLIDE_WIDTH = 1280;
  const SLIDE_HEIGHT = 720;
  const DEFAULT_STYLE_SETTINGS = {
    fontSize: 24,
    lineHeight: 1.6,
    paddingX: 64,
    density: 1.0,
    heading: 'Noto Serif SC',
    body: 'Noto Sans SC'
  };
  const MIN_ZOOM = 0.45;
  const MAX_ZOOM = 1;
  const ZOOM_STEP = 0.08;
  const CANVAS_INSET = 24;

  const slideList = document.getElementById('slideList');
  const slideCanvas = document.getElementById('slideCanvas');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlideNum = document.getElementById('totalSlideNum');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const fitBtn = document.getElementById('fitBtn');
  const zoomLevel = document.getElementById('zoomLevel');
  const previewBtn = document.getElementById('previewBtn');
  const panelTabs = document.querySelectorAll('.panel-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const imagePopup = document.getElementById('imagePopup');

  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const lineHeightSlider = document.getElementById('lineHeightSlider');
  const paddingXSlider = document.getElementById('paddingXSlider');
  const densitySlider = document.getElementById('densitySlider');
  const fontPresets = document.querySelectorAll('.font-preset');

  let project = null;
  let slides = [];
  let currentIdx = 0;
  let zoom = 1;
  let currentScale = 1;
  let slideFrame = null;
  let slideRuntimeShell = null;
  let resizeObserver = null;

  function init() {
    loadProject();
    if (!project || !slides.length) {
      window.location.href = 'wizard.html';
      return;
    }

    restoreStyleSettings();
    bindEvents();
    observeCanvasResize();
    renderSlideList();
    renderCurrentSlide();
    updateNavigation();
  }

  function loadProject() {
    try {
      const saved = sessionStorage.getItem('presenta-current-project') ||
                    localStorage.getItem('presenta-current-project');
      project = JSON.parse(saved || 'null');
      slides = project?.slides || [];
      if (project && !project.styleSettings) {
        project.styleSettings = { ...DEFAULT_STYLE_SETTINGS };
      }
    } catch (e) {
      project = null;
      slides = [];
    }
  }

  function saveProject() {
    if (!project) return;
    project.slides = slides;
    const serialized = JSON.stringify(project);
    localStorage.setItem('presenta-current-project', serialized);
    sessionStorage.setItem('presenta-current-project', serialized);
  }

  function getCurrentStyleSettings() {
    return {
      fontSize: parseInt(fontSizeSlider?.value || project?.styleSettings?.fontSize || DEFAULT_STYLE_SETTINGS.fontSize, 10),
      lineHeight: parseFloat(lineHeightSlider?.value || project?.styleSettings?.lineHeight || DEFAULT_STYLE_SETTINGS.lineHeight),
      paddingX: parseInt(paddingXSlider?.value || project?.styleSettings?.paddingX || DEFAULT_STYLE_SETTINGS.paddingX, 10),
      density: parseFloat(densitySlider?.value || project?.styleSettings?.density || DEFAULT_STYLE_SETTINGS.density),
      heading: project?.styleSettings?.heading || DEFAULT_STYLE_SETTINGS.heading,
      body: project?.styleSettings?.body || DEFAULT_STYLE_SETTINGS.body
    };
  }

  function quoteFontFamily(name) {
    if (!name) return '';
    return name
      .split(',')
      .map((part) => {
        const trimmed = part.trim().replace(/^['"]|['"]$/g, '');
        if (!trimmed) return '';
        return /[\s\u4e00-\u9fff-]/.test(trimmed) ? `'${trimmed}'` : trimmed;
      })
      .filter(Boolean)
      .join(', ');
  }

  function setScaledLengthProperty(root, variableName, value) {
    root.style.setProperty(`${variableName}-base`, value);
    root.style.setProperty(variableName, `calc(var(${variableName}-base) * var(--content-fit, 1))`);
  }

  function applyStyleSettingsToDocument(doc, settings) {
    if (!doc || !doc.documentElement) return;

    const root = doc.documentElement;
    const headingFamily = quoteFontFamily(settings.heading || DEFAULT_STYLE_SETTINGS.heading);
    const bodyFamily = quoteFontFamily(settings.body || DEFAULT_STYLE_SETTINGS.body);

    root.style.setProperty('--content-fit', '1');
    setScaledLengthProperty(root, '--font-size-base', `${settings.fontSize}px`);
    setScaledLengthProperty(root, '--font-size-h1', `${Math.round(settings.fontSize * 3.3)}px`);
    setScaledLengthProperty(root, '--font-size-h2', `${Math.round(settings.fontSize * 2.3)}px`);
    setScaledLengthProperty(root, '--font-size-h3', `${Math.round(settings.fontSize * 1.5)}px`);
    setScaledLengthProperty(root, '--font-size-h4', `${Math.round(settings.fontSize * 1.3)}px`);
    setScaledLengthProperty(root, '--font-size-body', `${Math.round(settings.fontSize * 0.75)}px`);
    setScaledLengthProperty(root, '--font-size-small', `${Math.round(settings.fontSize * 0.67)}px`);
    setScaledLengthProperty(root, '--font-size-xs', `${Math.round(settings.fontSize * 0.58)}px`);
    setScaledLengthProperty(root, '--font-size-hero', `${Math.round(settings.fontSize * 6.7)}px`);
    setScaledLengthProperty(root, '--font-size-stat', `${Math.round(settings.fontSize * 2)}px`);
    root.style.setProperty('--line-height', `${settings.lineHeight}`);
    root.style.setProperty('--line-height-tight', `${Math.max(1.0, settings.lineHeight - 0.4)}`);
    root.style.setProperty('--line-height-loose', `${Math.min(2.0, settings.lineHeight + 0.2)}`);
    setScaledLengthProperty(root, '--slide-padding-x', `${settings.paddingX}px`);
    setScaledLengthProperty(root, '--slide-padding-y', `${Math.round(settings.paddingX * 0.75)}px`);
    root.style.setProperty('--slide-density', `${settings.density}`);
    setScaledLengthProperty(root, '--slide-gap', `${Math.round(48 * settings.density)}px`);
    setScaledLengthProperty(root, '--slide-element-gap', `${Math.round(16 * settings.density)}px`);
    root.style.setProperty('--font-heading', headingFamily);
    root.style.setProperty('--font-cn', bodyFamily);
    root.style.setProperty('--font-en', bodyFamily);
  }

  function getPreparedSlideHTML(rawHtml, options = {}) {
    if (!rawHtml) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    applyStyleSettingsToDocument(doc, getCurrentStyleSettings());

    if (!options.allowScripts) {
      doc.querySelectorAll('script').forEach((node) => node.remove());
    }

    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }

  function serializeSlideDocument(doc) {
    if (!doc || !doc.documentElement) return slides[currentIdx]?.html || '';

    const clone = doc.documentElement.cloneNode(true);
    clone.querySelectorAll('script[src*="chart.js"]').forEach((node) => node.remove());
    clone.querySelectorAll('style[data-editor-helper]').forEach((node) => node.remove());
    clone.querySelectorAll('[data-editor-text]').forEach((node) => node.removeAttribute('data-editor-text'));
    clone.querySelectorAll('[data-editor-editing]').forEach((node) => node.removeAttribute('data-editor-editing'));
    clone.querySelectorAll('[contenteditable]').forEach((node) => node.removeAttribute('contenteditable'));

    return '<!DOCTYPE html>\n' + clone.outerHTML;
  }

  function persistCurrentSlide() {
    if (!slides[currentIdx] || !slideFrame?.contentDocument) return;
    slides[currentIdx].html = serializeSlideDocument(slideFrame.contentDocument);
    saveProject();
  }

  function updateCurrentThumbHighlight() {
    slideList.querySelectorAll('.thumb').forEach((thumb, index) => {
      thumb.classList.toggle('active', index === currentIdx);
    });
    const activeThumb = slideList.querySelector('.thumb.active');
    activeThumb?.scrollIntoView({ block: 'nearest' });
  }

  function renderSlideList() {
    if (!slideList) return;

    slideList.innerHTML = '';

    slides.forEach((slide, index) => {
      const item = document.createElement('div');
      item.className = 'thumb' + (index === currentIdx ? ' active' : '');
      item.dataset.index = String(index);

      const preview = document.createElement('div');
      preview.className = 'thumb-preview';

      const frame = document.createElement('div');
      frame.className = 'thumb-frame';

      const iframe = document.createElement('iframe');
      iframe.className = 'thumb-iframe';
      iframe.tabIndex = -1;
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('sandbox', 'allow-same-origin');
      iframe.srcdoc = getPreparedSlideHTML(slide.html, { allowScripts: false });

      const label = document.createElement('span');
      label.className = 'thumb-label';
      label.textContent = `${index + 1} · ${getSlideLabel(slide)}`;

      frame.appendChild(iframe);
      preview.appendChild(frame);
      item.appendChild(preview);
      item.appendChild(label);
      item.addEventListener('click', () => switchToSlide(index));

      slideList.appendChild(item);
    });

    requestAnimationFrame(updateThumbnailScales);
  }

  function getSlideLabel(slide) {
    if (slide?.title) return slide.title.slice(0, 24);
    return slide?.role || slide?.page_role || 'Slide';
  }

  function updateThumbnailScales() {
    slideList.querySelectorAll('.thumb-frame').forEach((frame) => {
      const iframe = frame.querySelector('.thumb-iframe');
      if (!iframe) return;
      const width = frame.clientWidth || 1;
      const scale = width / SLIDE_WIDTH;
      frame.style.height = `${Math.round(SLIDE_HEIGHT * scale)}px`;
      iframe.style.width = `${SLIDE_WIDTH}px`;
      iframe.style.height = `${SLIDE_HEIGHT}px`;
      iframe.style.transform = `scale(${scale})`;
      iframe.style.transformOrigin = 'top left';
    });
  }

  function renderCurrentSlide() {
    if (!slideCanvas || !slides[currentIdx]) return;

    hideImagePopup();
    slideCanvas.innerHTML = '';

    slideRuntimeShell = document.createElement('div');
    slideRuntimeShell.className = 'canvas-runtime-shell';

    slideFrame = document.createElement('iframe');
    slideFrame.className = 'slide-runtime-frame';
    slideFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    slideFrame.srcdoc = getPreparedSlideHTML(slides[currentIdx].html, { allowScripts: true });
    slideFrame.addEventListener('load', handleSlideFrameLoad, { once: true });

    slideRuntimeShell.appendChild(slideFrame);
    slideCanvas.appendChild(slideRuntimeShell);

    updateZoom();
    renderImageList();
    updateCurrentThumbHighlight();
  }

  function handleSlideFrameLoad() {
    const doc = slideFrame?.contentDocument;
    if (!doc) return;

    applyStyleSettingsToDocument(doc, getCurrentStyleSettings());
    injectEditorHelperStyle(doc);
    bindEditableText(doc);
    bindImageClicks(doc);
    requestSlideRefit();
    updateZoom();
    renderImageList();
  }

  function requestSlideRefit() {
    const win = slideFrame?.contentWindow;
    if (!win) return;
    win.requestAnimationFrame(() => {
      win.dispatchEvent(new win.Event('resize'));
    });
  }

  function injectEditorHelperStyle(doc) {
    if (!doc.head || doc.head.querySelector('style[data-editor-helper]')) return;

    const style = doc.createElement('style');
    style.dataset.editorHelper = 'true';
    style.textContent = `
      [data-editor-text="true"] { cursor: text; }
      [data-editor-editing="true"] {
        outline: 1px dashed rgba(164, 64, 47, 0.72);
        outline-offset: 2px;
        background: rgba(164, 64, 47, 0.06);
      }
    `;
    doc.head.appendChild(style);
  }

  function bindEditableText(doc) {
    const elements = getEditableTextElements(doc.body);
    elements.forEach((element) => {
      if (element.dataset.editorText === 'true') return;

      element.dataset.editorText = 'true';
      element.setAttribute('contenteditable', 'false');
      element.addEventListener('dblclick', startTextEdit);
      element.addEventListener('blur', finishTextEdit);
      element.addEventListener('keydown', handleTextEditKeydown);
    });
  }

  function getEditableTextElements(root) {
    if (!root) return [];

    const excluded = new Set(['SCRIPT', 'STYLE', 'CANVAS', 'SVG', 'PATH', 'IMG', 'BR', 'HR', 'IFRAME']);

    return Array.from(root.querySelectorAll('*')).filter((element) => {
      if (excluded.has(element.tagName)) return false;
      if (!element.isConnected) return false;
      if (element.closest('script, style, svg, canvas')) return false;

      return Array.from(element.childNodes).some((node) => (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent &&
        node.textContent.replace(/\s+/g, ' ').trim()
      ));
    });
  }

  function startTextEdit(event) {
    event.preventDefault();
    event.stopPropagation();

    const element = event.currentTarget;
    element.dataset.editorEditing = 'true';
    element.setAttribute('contenteditable', 'true');
    element.focus();

    const selection = element.ownerDocument.defaultView.getSelection();
    const range = element.ownerDocument.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function handleTextEditKeydown(event) {
    const element = event.currentTarget;
    if (event.key === 'Escape') {
      event.preventDefault();
      element.blur();
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey && isSingleLineTextElement(element)) {
      event.preventDefault();
      element.blur();
    }
  }

  function isSingleLineTextElement(element) {
    return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'STRONG', 'EM', 'A', 'LABEL', 'CITE', 'SMALL'].includes(element.tagName);
  }

  function finishTextEdit(event) {
    const element = event.currentTarget;
    if (element.dataset.editorText !== 'true') return;

    element.removeAttribute('contenteditable');
    delete element.dataset.editorEditing;

    persistCurrentSlide();
    renderSlideList();
    renderImageList();
  }

  function bindImageClicks(doc) {
    doc.querySelectorAll('img').forEach((image) => {
      if (image.dataset.editorImgBound === 'true') return;

      image.dataset.editorImgBound = 'true';
      image.style.cursor = 'pointer';
      image.addEventListener('click', handleImageClick);
    });
  }

  function handleImageClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const image = event.currentTarget;
    const rect = image.getBoundingClientRect();
    const iframeRect = slideFrame.getBoundingClientRect();
    const scaledRect = {
      left: iframeRect.left + rect.left * currentScale,
      top: iframeRect.top + rect.top * currentScale,
      width: rect.width * currentScale,
      height: rect.height * currentScale,
      bottom: iframeRect.top + (rect.top + rect.height) * currentScale
    };

    showImagePopup(image, scaledRect);
  }

  function showImagePopup(imgEl, rect) {
    hideImagePopup();

    imagePopup.dataset.imgSrc = imgEl.currentSrc || imgEl.src;
    imagePopup.dataset.imgAlt = imgEl.alt || '';
    imagePopup.dataset.slideIdx = String(currentIdx);

    const popupW = 200;
    const popupH = 160;
    let left = rect.left + rect.width / 2 - popupW / 2;
    let top = rect.bottom + 8;

    if (left < 8) left = 8;
    if (left + popupW > window.innerWidth - 8) left = window.innerWidth - popupW - 8;
    if (top + popupH > window.innerHeight - 8) top = rect.top - popupH - 8;

    imagePopup.style.left = `${left}px`;
    imagePopup.style.top = `${top}px`;
    imagePopup.style.display = 'block';
  }

  function hideImagePopup() {
    if (imagePopup) imagePopup.style.display = 'none';
  }

  imagePopup?.querySelectorAll('.popup-item').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const slideIdx = parseInt(imagePopup.dataset.slideIdx || '0', 10);
      const imgSrc = imagePopup.dataset.imgSrc;
      hideImagePopup();

      if (action === 'upload') triggerImageUpload(slideIdx, imgSrc);
      if (action === 'replace') triggerImageReplace(slideIdx, imgSrc);
      if (action === 'regenerate') triggerImageRegenerate(slideIdx, imgSrc);
    });
  });

  function triggerImageUpload(slideIdx, currentSrc) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => replaceImageInSlide(slideIdx, currentSrc, ev.target.result);
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function triggerImageReplace(slideIdx, currentSrc) {
    const url = prompt('请输入新图片 URL：', '');
    if (url && url.trim()) {
      replaceImageInSlide(slideIdx, currentSrc, url.trim());
    }
  }

  function triggerImageRegenerate(slideIdx, currentSrc) {
    const placeholder = `https://picsum.photos/800/450?random=${Date.now()}`;
    replaceImageInSlide(slideIdx, currentSrc, placeholder);
  }

  function replaceImageInSlide(slideIdx, oldSrc, newSrc) {
    if (!slides[slideIdx]) return;
    if (slideIdx === currentIdx) persistCurrentSlide();

    slides[slideIdx].html = slides[slideIdx].html.replace(
      new RegExp(escapeRegex(oldSrc), 'g'),
      newSrc
    );
    saveProject();

    if (slideIdx === currentIdx) {
      renderCurrentSlide();
    } else {
      renderSlideList();
    }

    renderImageList();
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function renderImageList() {
    const pageList = document.getElementById('pageImageList');
    const allGrid = document.getElementById('allImageGrid');
    const currentSlide = slides[currentIdx];

    if (pageList) {
      const currentImages = currentSlide?.html
        ? [...currentSlide.html.matchAll(/<img[^>]+src="([^"]+)"/g)]
        : [];

      if (!currentImages.length) {
        pageList.innerHTML = '<p class="empty-hint">本页暂无图片</p>';
      } else {
        pageList.innerHTML = currentImages.map((match, index) => `
          <div class="img-item" data-src="${match[1]}">
            <img src="${match[1]}" alt="图片${index + 1}" loading="lazy">
            <div class="img-actions">
              <button data-action="replace">替换</button>
              <button data-action="upload">上传</button>
              <button data-action="regenerate">重新生成</button>
            </div>
          </div>
        `).join('');

        pageList.querySelectorAll('.img-item').forEach((item) => {
          item.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
              const action = button.dataset.action;
              const src = item.dataset.src;
              if (action === 'upload') triggerImageUpload(currentIdx, src);
              if (action === 'replace') triggerImageReplace(currentIdx, src);
              if (action === 'regenerate') triggerImageRegenerate(currentIdx, src);
            });
          });
        });
      }
    }

    if (allGrid) {
      const allImages = [];
      slides.forEach((slide, slideIdx) => {
        if (!slide.html) return;
        [...slide.html.matchAll(/<img[^>]+src="([^"]+)"/g)].forEach((match) => {
          allImages.push({ src: match[1], slideIdx });
        });
      });

      if (!allImages.length) {
        allGrid.innerHTML = '<p class="empty-hint">暂无图片</p>';
      } else {
        allGrid.innerHTML = allImages.map(({ src, slideIdx }) => `
          <div class="all-img-thumb" data-slide="${slideIdx}" title="第${slideIdx + 1}页">
            <img src="${src}" alt="" loading="lazy">
          </div>
        `).join('');

        allGrid.querySelectorAll('.all-img-thumb').forEach((thumb) => {
          thumb.addEventListener('click', () => switchToSlide(parseInt(thumb.dataset.slide || '0', 10)));
        });
      }
    }
  }

  function switchToSlide(index) {
    if (index < 0 || index >= slides.length || index === currentIdx) return;
    persistCurrentSlide();
    currentIdx = index;
    renderSlideList();
    renderCurrentSlide();
    updateNavigation();
  }

  function updateNavigation() {
    if (currentSlideNum) currentSlideNum.textContent = String(currentIdx + 1);
    if (totalSlideNum) totalSlideNum.textContent = String(slides.length);
    if (prevSlideBtn) prevSlideBtn.disabled = currentIdx === 0;
    if (nextSlideBtn) nextSlideBtn.disabled = currentIdx === slides.length - 1;
    updateCurrentThumbHighlight();
  }

  function updateZoom() {
    if (!slideCanvas || !slideRuntimeShell || !slideFrame) return;

    const canvasWidth = Math.max(1, (slideCanvas.clientWidth || 1) - CANVAS_INSET * 2);
    const canvasHeight = Math.max(1, (slideCanvas.clientHeight || 1) - CANVAS_INSET * 2);
    const baseScale = Math.min(canvasWidth / SLIDE_WIDTH, canvasHeight / SLIDE_HEIGHT);
    currentScale = baseScale * zoom;

    slideRuntimeShell.style.width = `${Math.round(SLIDE_WIDTH * currentScale)}px`;
    slideRuntimeShell.style.height = `${Math.round(SLIDE_HEIGHT * currentScale)}px`;
    slideFrame.style.width = `${SLIDE_WIDTH}px`;
    slideFrame.style.height = `${SLIDE_HEIGHT}px`;
    slideFrame.style.transform = `scale(${currentScale})`;
    slideFrame.style.transformOrigin = 'top left';

    if (zoomLevel) zoomLevel.textContent = `${Math.round(currentScale * 100)}%`;
    if (zoomInBtn) zoomInBtn.disabled = zoom >= MAX_ZOOM;
    if (zoomOutBtn) zoomOutBtn.disabled = zoom <= MIN_ZOOM;
  }

  function switchTab(tabName) {
    panelTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName));
    tabContents.forEach((content) => content.classList.toggle('active', content.id === `${tabName}Tab`));
  }

  function applyAllSliders() {
    applyFontSize(parseInt(fontSizeSlider?.value || DEFAULT_STYLE_SETTINGS.fontSize, 10), false);
    applyLineHeight(parseFloat(lineHeightSlider?.value || DEFAULT_STYLE_SETTINGS.lineHeight), false);
    applyPaddingX(parseInt(paddingXSlider?.value || DEFAULT_STYLE_SETTINGS.paddingX, 10), false);
    applyDensity(parseFloat(densitySlider?.value || DEFAULT_STYLE_SETTINGS.density), false);
    applyStyleSettingsToActiveSlide();
  }

  function applyStyleSettingsToActiveSlide() {
    if (slideFrame?.contentDocument) {
      applyStyleSettingsToDocument(slideFrame.contentDocument, getCurrentStyleSettings());
      requestSlideRefit();
    }
  }

  function applyFontSize(value, shouldPersist = true) {
    document.getElementById('fontSizeVal').textContent = `${value}px`;
    if (shouldPersist) {
      saveStyleSettings();
      applyStyleSettingsToActiveSlide();
    }
  }

  function applyLineHeight(value, shouldPersist = true) {
    document.getElementById('lineHeightVal').textContent = value.toFixed(1);
    if (shouldPersist) {
      saveStyleSettings();
      applyStyleSettingsToActiveSlide();
    }
  }

  function applyPaddingX(value, shouldPersist = true) {
    document.getElementById('paddingXVal').textContent = `${value}px`;
    if (shouldPersist) {
      saveStyleSettings();
      applyStyleSettingsToActiveSlide();
    }
  }

  function applyDensity(value, shouldPersist = true) {
    const labels = {
      '0.7': '宽松',
      '0.8': '宽松',
      '0.9': '略松',
      '1.0': '标准',
      '1.1': '略紧',
      '1.2': '紧凑',
      '1.3': '紧凑'
    };

    document.getElementById('densityVal').textContent = labels[value.toFixed(1)] || '标准';
    if (shouldPersist) {
      saveStyleSettings();
      applyStyleSettingsToActiveSlide();
    }
  }

  function applyFontPreset(heading, body) {
    if (!project) return;
    project.styleSettings = {
      ...getCurrentStyleSettings(),
      heading,
      body
    };

    fontPresets.forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.heading === heading && button.dataset.body === body
      );
    });

    saveProject();
    applyStyleSettingsToActiveSlide();
    renderSlideList();
  }

  function saveStyleSettings() {
    if (!project) return;

    project.styleSettings = {
      ...project.styleSettings,
      fontSize: parseInt(fontSizeSlider?.value || DEFAULT_STYLE_SETTINGS.fontSize, 10),
      lineHeight: parseFloat(lineHeightSlider?.value || DEFAULT_STYLE_SETTINGS.lineHeight),
      paddingX: parseInt(paddingXSlider?.value || DEFAULT_STYLE_SETTINGS.paddingX, 10),
      density: parseFloat(densitySlider?.value || DEFAULT_STYLE_SETTINGS.density),
      heading: project.styleSettings?.heading || DEFAULT_STYLE_SETTINGS.heading,
      body: project.styleSettings?.body || DEFAULT_STYLE_SETTINGS.body
    };

    saveProject();
  }

  function restoreStyleSettings() {
    const settings = { ...DEFAULT_STYLE_SETTINGS, ...(project?.styleSettings || {}) };

    if (fontSizeSlider) fontSizeSlider.value = settings.fontSize;
    if (lineHeightSlider) lineHeightSlider.value = settings.lineHeight;
    if (paddingXSlider) paddingXSlider.value = settings.paddingX;
    if (densitySlider) densitySlider.value = settings.density;

    project.styleSettings = settings;

    applyFontSize(settings.fontSize, false);
    applyLineHeight(settings.lineHeight, false);
    applyPaddingX(settings.paddingX, false);
    applyDensity(settings.density, false);

    fontPresets.forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.heading === settings.heading && button.dataset.body === settings.body
      );
    });
  }

  function observeCanvasResize() {
    if (!slideCanvas) return;

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateZoom();
        updateThumbnailScales();
      });
      resizeObserver.observe(slideCanvas);
    } else {
      window.addEventListener('resize', () => {
        updateZoom();
        updateThumbnailScales();
      });
    }
  }

  function bindEvents() {
    prevSlideBtn?.addEventListener('click', () => switchToSlide(currentIdx - 1));
    nextSlideBtn?.addEventListener('click', () => switchToSlide(currentIdx + 1));

    document.addEventListener('keydown', (event) => {
      const target = event.target;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) return;
      if (event.key === 'ArrowLeft') switchToSlide(currentIdx - 1);
      if (event.key === 'ArrowRight') switchToSlide(currentIdx + 1);
    });

    zoomInBtn?.addEventListener('click', () => {
      zoom = Math.min(MAX_ZOOM, zoom + ZOOM_STEP);
      updateZoom();
    });

    zoomOutBtn?.addEventListener('click', () => {
      zoom = Math.max(MIN_ZOOM, zoom - ZOOM_STEP);
      updateZoom();
    });

    fitBtn?.addEventListener('click', () => {
      zoom = MAX_ZOOM;
      updateZoom();
    });

    slideCanvas?.addEventListener('wheel', (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - event.deltaY * 0.001));
      updateZoom();
    }, { passive: false });

    previewBtn?.addEventListener('click', () => {
      persistCurrentSlide();
      window.location.href = 'preview.html';
    });

    panelTabs.forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    fontSizeSlider?.addEventListener('input', (event) => applyFontSize(parseInt(event.target.value, 10)));
    lineHeightSlider?.addEventListener('input', (event) => applyLineHeight(parseFloat(event.target.value)));
    paddingXSlider?.addEventListener('input', (event) => applyPaddingX(parseInt(event.target.value, 10)));
    densitySlider?.addEventListener('input', (event) => applyDensity(parseFloat(event.target.value)));

    fontPresets.forEach((button) => {
      button.addEventListener('click', () => applyFontPreset(button.dataset.heading, button.dataset.body));
    });

    document.addEventListener('click', (event) => {
      if (!imagePopup?.contains(event.target) && !event.target.closest('img')) {
        hideImagePopup();
      }
    });

    window.addEventListener('beforeunload', persistCurrentSlide);
  }

  init();
  applyAllSliders();
})();
