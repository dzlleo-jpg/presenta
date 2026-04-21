/**
 * =============================================
 * Presenta - Preview Player Component
 * Fullscreen presentation mode
 * =============================================
 */

(function() {
  'use strict';

  // ============================================
  // DOM Elements
  // ============================================
  const presentationContainer = document.getElementById('presentationContainer');
  const slideStage = document.getElementById('slideStage');
  const controlBar = document.getElementById('controlBar');
  const progressFill = document.getElementById('progressFill');
  const currentNum = document.getElementById('currentNum');
  const totalNum = document.getElementById('totalNum');
  
  // Control buttons
  const firstSlideBtn = document.getElementById('firstSlideBtn');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const lastSlideBtn = document.getElementById('lastSlideBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const exitBtn = document.getElementById('exitBtn');
  const speakerNotesBtn = document.getElementById('speakerNotesBtn');
  const timerBtn = document.getElementById('timerBtn');
  const thumbnailStripBtn = document.getElementById('thumbnailStripBtn');
  const laserBtn = document.getElementById('laserBtn');
  
  // Panels
  const speakerPanel = document.getElementById('speakerPanel');
  const speakerNotes = document.getElementById('speakerNotes');
  const closeSpeakerPanel = document.getElementById('closeSpeakerPanel');
  const thumbnailOverlay = document.getElementById('thumbnailOverlay');
  const thumbnailGrid = document.getElementById('thumbnailGrid');
  
  // Timer
  const timerDisplay = document.getElementById('timerDisplay');
  const timerStartBtn = document.getElementById('timerStartBtn');
  const timerResetBtn = document.getElementById('timerResetBtn');
  
  // Laser pointer
  const laserPointer = document.querySelector('.laser-pointer') || createLaserPointer();
  
  // Start overlay
  const startOverlay = document.getElementById('startOverlay');
  const startPresentBtn = document.getElementById('startPresentBtn');

  // ============================================
  // State
  // ============================================
  let slides = [];
  let currentSlideIndex = 0;
  let isPresenting = false;
  let showControls = true;
  let controlsTimeout = null;
  let timerInterval = null;
  let timerSeconds = 0;
  let timerRunning = false;
  let isLaserActive = false;
  let project = null;

  // ============================================
  // Initialization
  // ============================================
  function init() {
    loadProject();
    if (slides.length === 0) {
      generateMockSlides();
    }
    
    renderThumbnails();
    renderCurrentSlide();
    updateNavigation();
    
    initEventListeners();
    startControlsAutoHide();
  }

  function createLaserPointer() {
    const el = document.createElement('div');
    el.className = 'laser-pointer';
    document.body.appendChild(el);
    return el;
  }

  function loadProject() {
    // 优先从 localStorage 读取 V2 项目（editor 保存的）
    const savedProject = localStorage.getItem('presenta-current-project');
    if (savedProject) {
      try {
        project = JSON.parse(savedProject);
        if (project.slides && project.slides.length > 0) {
          slides = project.slides;
          return;
        }
      } catch (e) {
        console.error('Failed to load project:', e);
      }
    }
    // 降级：sessionStorage V1 格式
    const sessionProject = sessionStorage.getItem('presenta-current-project');
    if (sessionProject) {
      try {
        project = JSON.parse(sessionProject);
        if (project.slides && project.slides.length > 0) {
          slides = project.slides;
          return;
        }
      } catch (e) {}
    }
    // 降级：Mock 数据
    generateMockSlides();
  }

  function generateMockSlides() {
    slides = [
      {
        id: 'slide-1',
        layout: 'title',
        theme: 'dark',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
        elements: [
          {
            id: 'el-1-1',
            type: 'text',
            content: '融资路演演示文稿',
            x: 48, y: 180, width: 864, height: 80,
            style: { fontSize: 48, fontFamily: 'system-ui', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }
          },
          {
            id: 'el-1-2',
            type: 'text',
            content: 'Powered by AI',
            x: 48, y: 280, width: 864, height: 40,
            style: { fontSize: 20, fontFamily: 'system-ui', color: '#888888', textAlign: 'center' }
          }
        ],
        animation: 'fade',
        notes: '欢迎各位投资人，今天我将为大家介绍我们的项目。'
      },
      {
        id: 'slide-2',
        layout: 'content',
        theme: 'dark',
        background: { type: 'solid', value: '#1a1a2e' },
        elements: [
          {
            id: 'el-2-1',
            type: 'text',
            content: '项目概述',
            x: 48, y: 40, width: 864, height: 60,
            style: { fontSize: 36, fontFamily: 'system-ui', fontWeight: 'bold', color: '#ffffff', textAlign: 'left' }
          },
          {
            id: 'el-2-2',
            type: 'text',
            content: '• 核心痛点：市场需求未被满足\n• 解决方案：创新产品技术\n• 市场规模：年复合增长率 25%',
            x: 48, y: 120, width: 864, height: 360,
            style: { fontSize: 24, fontFamily: 'system-ui', color: '#cccccc', textAlign: 'left', lineHeight: 2 }
          }
        ],
        animation: 'slide-left',
        notes: '首先介绍项目的核心痛点和我们的解决方案。'
      },
      {
        id: 'slide-3',
        layout: 'content',
        theme: 'dark',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        elements: [
          {
            id: 'el-3-1',
            type: 'text',
            content: '市场分析',
            x: 48, y: 40, width: 864, height: 60,
            style: { fontSize: 36, fontFamily: 'system-ui', fontWeight: 'bold', color: '#ffffff', textAlign: 'left' }
          },
          {
            id: 'el-3-2',
            type: 'text',
            content: '• 行业趋势：快速增长\n• 竞争格局：蓝海市场\n• 目标用户：企业级客户',
            x: 48, y: 120, width: 864, height: 360,
            style: { fontSize: 24, fontFamily: 'system-ui', color: 'rgba(255,255,255,0.9)', textAlign: 'left', lineHeight: 2 }
          }
        ],
        animation: 'zoom',
        notes: '接下来分析市场机会和竞争环境。'
      },
      {
        id: 'slide-4',
        layout: 'title',
        theme: 'gradient',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        elements: [
          {
            id: 'el-4-1',
            type: 'text',
            content: '感谢观看',
            x: 48, y: 200, width: 864, height: 80,
            style: { fontSize: 56, fontFamily: 'system-ui', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }
          },
          {
            id: 'el-4-2',
            type: 'text',
            content: 'Q & A',
            x: 48, y: 300, width: 864, height: 60,
            style: { fontSize: 28, fontFamily: 'system-ui', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }
          }
        ],
        animation: 'fade',
        notes: '感谢各位的时间，现在欢迎提问。'
      }
    ];
  }

  // ============================================
  // Slide Rendering
  // ============================================
  function renderThumbnails() {
    thumbnailGrid.innerHTML = '';
    slides.forEach((slide, index) => {
      const item = document.createElement('div');
      item.className = `thumbnail-item ${index === currentSlideIndex ? 'active' : ''}`;
      item.dataset.index = index;
      
      item.innerHTML = `
        <span class="thumbnail-number">${index + 1}</span>
        <div class="thumbnail-preview">${getSlidePreviewText(slide)}</div>
      `;
      
      item.addEventListener('click', () => goToSlide(index));
      thumbnailGrid.appendChild(item);
    });
  }

  function getSlidePreviewText(slide) {
    const textElements = slide.elements.filter(e => e.type === 'text');
    if (textElements.length > 0) {
      const firstText = textElements[0];
      return firstText.content.substring(0, 30) + (firstText.content.length > 30 ? '...' : '');
    }
    return slide.layout;
  }

  function renderCurrentSlide() {
    const slide = slides[currentSlideIndex];
    if (!slide) return;

    // Remove previous slides
    const existingSlides = slideStage.querySelectorAll('.slide');
    existingSlides.forEach((existingSlide, i) => {
      if (i < currentSlideIndex) {
        existingSlide.classList.add('prev');
      }
      existingSlide.classList.remove('active');
    });

    // V2 新格式：slide.html 已是完整 HTML，直接用 iframe 渲染
    if (slide.html) {
      const iframe = document.createElement('iframe');
      iframe.className = 'slide-iframe';
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:1280px;height:720px;border:none;background:transparent;';
      iframe.sandbox = 'allow-same-origin allow-scripts';
      iframe.srcdoc = slide.html;

      const slideEl = document.createElement('div');
      slideEl.className = 'slide slide-html-mode active';
      slideEl.style.cssText = 'position:absolute;top:0;left:0;width:1280px;height:720px;overflow:hidden;';
      slideEl.appendChild(iframe);
      slideStage.appendChild(slideEl);

      // 缩放适配
      const stage = slideStage;
      const resizeObserver = new ResizeObserver(() => {
        const r = stage.getBoundingClientRect();
        const scaleX = r.width / 1280;
        const scaleY = r.height / 720;
        const scale = Math.min(scaleX, scaleY);
        slideEl.style.transform = `scale(${scale})`;
        slideEl.style.transformOrigin = 'top left';
      });
      resizeObserver.observe(stage);

      updateSpeakerNotes(slide.speakerNote || slide.notes || '');
    }
    // V1 旧格式：从 elements 构建 DOM（保留兼容）
    else if (slide.elements) {
      const slideEl = document.createElement('div');
      slideEl.className = `slide ${slide.theme ? 'bg-' + slide.theme : 'bg-dark'} animate-${slide.animation || 'fade'}`;

      if (slide.background?.type === 'gradient') {
        slideEl.style.background = slide.background.value;
      } else if (slide.background?.value) {
        slideEl.style.background = slide.background.value;
      }

      const elementsContainer = document.createElement('div');
      elementsContainer.className = 'slide-elements';

      slide.elements.forEach(element => {
        const el = createSlideElement(element);
        elementsContainer.appendChild(el);
      });

      slideEl.appendChild(elementsContainer);
      slideStage.appendChild(slideEl);

      // Trigger animation
      requestAnimationFrame(() => {
        slideEl.classList.add('active');
      });

      // Update notes
      updateSpeakerNotes(slide.notes);
    }
    
    // Update progress
    const progress = ((currentSlideIndex + 1) / slides.length) * 100;
    progressFill.style.width = progress + '%';
    
    // Update thumbnails
    updateThumbnailSelection();
  }

  function createSlideElement(element) {
    const el = document.createElement('div');
    el.className = `slide-element type-${element.type}`;
    
    // Position
    el.style.left = element.x + 'px';
    el.style.top = element.y + 'px';
    el.style.width = element.width + 'px';
    el.style.height = element.height + 'px';
    
    if (element.type === 'text') {
      el.innerHTML = element.content;
      el.style.fontSize = element.style.fontSize + 'px';
      el.style.fontFamily = element.style.fontFamily || 'system-ui';
      el.style.fontWeight = element.style.fontWeight || 'normal';
      el.style.fontStyle = element.style.fontStyle || 'normal';
      el.style.textDecoration = element.style.textDecoration || 'none';
      el.style.color = element.style.color || '#ffffff';
      el.style.textAlign = element.style.textAlign || 'left';
      el.style.lineHeight = element.style.lineHeight || '1.5';
    } else if (element.type === 'image') {
      el.innerHTML = `<img src="${element.src}" alt="">`;
    } else if (element.type === 'shape') {
      el.style.background = element.style?.fillColor || 'rgba(255,255,255,0.1)';
      el.style.borderRadius = element.style?.borderRadius || '8px';
    }
    
    return el;
  }

  function updateSpeakerNotes(notes) {
    if (notes) {
      speakerNotes.innerHTML = `<p>${notes}</p>`;
    } else {
      speakerNotes.innerHTML = '<p class="notes-placeholder">暂无备注</p>';
    }
  }

  function updateThumbnailSelection() {
    const items = thumbnailGrid.querySelectorAll('.thumbnail-item');
    items.forEach((item, index) => {
      item.classList.toggle('active', index === currentSlideIndex);
    });
  }

  // ============================================
  // Navigation
  // ============================================
  function goToSlide(index) {
    if (index < 0 || index >= slides.length || index === currentSlideIndex) return;
    
    // Remove no-transition from old slides
    slideStage.querySelectorAll('.slide').forEach(slide => {
      slide.classList.remove('no-transition');
    });
    
    currentSlideIndex = index;
    renderCurrentSlide();
    updateNavigation();
  }

  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  function updateNavigation() {
    currentNum.textContent = currentSlideIndex + 1;
    totalNum.textContent = slides.length;
    
    firstSlideBtn.disabled = currentSlideIndex === 0;
    prevSlideBtn.disabled = currentSlideIndex === 0;
    nextSlideBtn.disabled = currentSlideIndex === slides.length - 1;
    lastSlideBtn.disabled = currentSlideIndex === slides.length - 1;
  }

  // ============================================
  // Controls Visibility
  // ============================================
  function startControlsAutoHide() {
    controlBar.addEventListener('mousemove', resetControlsTimeout);
    controlBar.addEventListener('mouseenter', () => {
      clearTimeout(controlsTimeout);
      controlBar.classList.add('visible');
    });
    document.addEventListener('mousemove', handleMouseMove);
  }

  function resetControlsTimeout() {
    controlBar.classList.add('visible');
    clearTimeout(controlsTimeout);
    if (isPresenting) {
      controlsTimeout = setTimeout(() => {
        if (!speakerPanel.classList.contains('visible') && 
            !thumbnailOverlay.classList.contains('visible')) {
          controlBar.classList.remove('visible');
        }
      }, 3000);
    }
  }

  function handleMouseMove(e) {
    if (!isPresenting) return;
    
    // Show controls when mouse is near bottom
    if (e.clientY > window.innerHeight - 100) {
      controlBar.classList.add('visible');
      resetControlsTimeout();
    } else if (e.clientY < window.innerHeight - 150) {
      controlBar.classList.remove('visible');
    }
    
    // Update laser pointer
    if (isLaserActive) {
      laserPointer.style.left = e.clientX + 'px';
      laserPointer.style.top = e.clientY + 'px';
    }
  }

  // ============================================
  // Fullscreen
  // ============================================
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  function updateFullscreenIcon() {
    const icon = document.getElementById('fullscreenIcon');
    if (document.fullscreenElement) {
      icon.innerHTML = `
        <polyline points="4 14 10 14 10 20"/>
        <polyline points="20 10 14 10 14 4"/>
        <line x1="14" y1="10" x2="21" y2="3"/>
        <line x1="3" y1="21" x2="10" y2="14"/>
      `;
    } else {
      icon.innerHTML = `
        <polyline points="15 3 21 3 21 9"/>
        <polyline points="9 21 3 21 3 15"/>
        <line x1="21" y1="3" x2="14" y2="10"/>
        <line x1="3" y1="21" x2="10" y2="14"/>
      `;
    }
  }

  // ============================================
  // Speaker Notes Panel
  // ============================================
  function toggleSpeakerPanel() {
    speakerPanel.classList.toggle('visible');
    speakerNotesBtn.classList.toggle('active');
    resetControlsTimeout();
  }

  // ============================================
  // Timer
  // ============================================
  function toggleTimer() {
    if (timerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
    timerBtn.classList.toggle('active');
    resetControlsTimeout();
  }

  function startTimer() {
    timerRunning = true;
    timerStartBtn.textContent = '暂停';
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function pauseTimer() {
    timerRunning = false;
    timerStartBtn.textContent = '继续';
    clearInterval(timerInterval);
  }

  function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    timerStartBtn.textContent = '开始';
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    if (hours > 0) {
      timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // ============================================
  // Thumbnail Overlay
  // ============================================
  function toggleThumbnailOverlay() {
    thumbnailOverlay.classList.toggle('visible');
    thumbnailStripBtn.classList.toggle('active');
    resetControlsTimeout();
  }

  // ============================================
  // Laser Pointer
  // ============================================
  function toggleLaser() {
    isLaserActive = !isLaserActive;
    laserPointer.classList.toggle('active', isLaserActive);
    laserBtn.classList.toggle('active');
    document.body.style.cursor = isLaserActive ? 'none' : '';
    resetControlsTimeout();
  }

  // ============================================
  // Presentation Start/End
  // ============================================
  function startPresentation() {
    isPresenting = true;
    startOverlay.classList.add('hidden');
    controlBar.classList.add('visible');
    resetControlsTimeout();
    
    // Auto-hide controls after a few seconds
    setTimeout(() => {
      if (isPresenting) {
        controlBar.classList.remove('visible');
      }
    }, 3000);
  }

  function endPresentation() {
    isPresenting = false;
    controlBar.classList.remove('visible');
    speakerPanel.classList.remove('visible');
    thumbnailOverlay.classList.remove('visible');
    speakerNotesBtn.classList.remove('active');
    thumbnailStripBtn.classList.remove('active');
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    // Return to editor
    window.location.href = 'editor.html';
  }

  // ============================================
  // Event Listeners
  // ============================================
  function initEventListeners() {
    // Start presentation
    startPresentBtn.addEventListener('click', startPresentation);
    startOverlay.addEventListener('click', (e) => {
      if (e.target === startOverlay) startPresentation();
    });
    
    // Navigation
    firstSlideBtn.addEventListener('click', () => goToSlide(0));
    prevSlideBtn.addEventListener('click', prevSlide);
    nextSlideBtn.addEventListener('click', nextSlide);
    lastSlideBtn.addEventListener('click', () => goToSlide(slides.length - 1));
    
    // Fullscreen
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    
    // Exit
    exitBtn.addEventListener('click', endPresentation);
    
    // Speaker notes
    speakerNotesBtn.addEventListener('click', toggleSpeakerPanel);
    closeSpeakerPanel.addEventListener('click', toggleSpeakerPanel);
    
    // Timer
    timerBtn.addEventListener('click', toggleTimer);
    timerStartBtn.addEventListener('click', toggleTimer);
    timerResetBtn.addEventListener('click', resetTimer);
    
    // Thumbnail overlay
    thumbnailStripBtn.addEventListener('click', toggleThumbnailOverlay);
    thumbnailOverlay.addEventListener('click', (e) => {
      if (e.target === thumbnailOverlay) toggleThumbnailOverlay();
    });
    
    // Laser pointer
    laserBtn.addEventListener('click', toggleLaser);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeydown);
    
    // Touch/swipe support
    initTouchSupport();
  }

  function handleKeydown(e) {
    // Don't handle if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (!isPresenting) {
          startPresentation();
        } else {
          nextSlide();
        }
        break;
        
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
        
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
        
      case 'End':
        e.preventDefault();
        goToSlide(slides.length - 1);
        break;
        
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
        
      case 's':
      case 'S':
        e.preventDefault();
        toggleSpeakerPanel();
        break;
        
      case 't':
      case 'T':
        e.preventDefault();
        toggleTimer();
        break;
        
      case 'g':
      case 'G':
        e.preventDefault();
        toggleThumbnailOverlay();
        break;
        
      case 'l':
      case 'L':
        e.preventDefault();
        toggleLaser();
        break;
        
      case 'Escape':
        e.preventDefault();
        if (thumbnailOverlay.classList.contains('visible')) {
          toggleThumbnailOverlay();
        } else if (speakerPanel.classList.contains('visible')) {
          toggleSpeakerPanel();
        } else if (isLaserActive) {
          toggleLaser();
        } else if (isPresenting) {
          endPresentation();
        }
        break;
        
      case 'b':
      case 'B':
        // Black screen
        e.preventDefault();
        if (presentationContainer.style.background === 'black') {
          presentationContainer.style.background = '';
        } else {
          presentationContainer.style.background = 'black';
        }
        break;
        
      case 'w':
      case 'W':
        // White screen
        e.preventDefault();
        if (presentationContainer.style.background === 'white') {
          presentationContainer.style.background = '';
        } else {
          presentationContainer.style.background = 'white';
        }
        break;
    }
  }

  function initTouchSupport() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    slideStage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    slideStage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      // Only handle horizontal swipes
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
    }, { passive: true });
    
    // Double tap to toggle controls
    let lastTap = 0;
    slideStage.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 300 && tapLength > 0) {
        toggleControls();
        e.preventDefault();
      }
      lastTap = currentTime;
    }, { passive: true });
  }

  function toggleControls() {
    controlBar.classList.toggle('visible');
    resetControlsTimeout();
  }

  // ============================================
  // Initialize
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
