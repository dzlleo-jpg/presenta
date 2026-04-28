/**
 * Presenta - AI Generation Modal
 * Minimal design
 */

const GenerationModal = {
  container: null,
  progressBar: null,
  messageText: null,
  statusText: null,
  abortBtn: null,
  resultSection: null,
  errorSection: null,
  progressSection: null,

  init() {
    this.createDOM();
    this.bindEvents();
  },

  createDOM() {
    const existing = document.getElementById('ai-gen-modal');
    if (existing) existing.remove();

    this.container = document.createElement('div');
    this.container.id = 'ai-gen-modal';
    this.container.className = 'gen-modal';
    this.container.innerHTML = this.getHTML();
    document.body.appendChild(this.container);

    this.progressBar    = document.getElementById('genProgressBar');
    this.messageText    = document.getElementById('genMessage');
    this.statusText     = document.getElementById('genStatus');
    this.abortBtn       = document.getElementById('genAbortBtn');
    this.resultSection  = document.getElementById('genResult');
    this.errorSection   = document.getElementById('genError');
    this.progressSection = document.getElementById('genProgressSection');
  },

  getHTML() {
    return `
      <div class="gen-modal-content">
        <!-- Progress Section -->
        <div class="gen-progress-section" id="genProgressSection">
          <div class="gen-icon-wrap">
            <div class="gen-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <p class="gen-message" id="genMessage">准备中…</p>
          <div class="gen-bar-track">
            <div class="gen-bar-fill" id="genProgressBar" style="width:0%"></div>
          </div>
          <p class="gen-status" id="genStatus">已等待 0 秒</p>
          <button class="gen-abort" id="genAbortBtn">取消</button>
        </div>

        <!-- Result Section -->
        <div class="gen-result-section" id="genResult" style="display:none">
          <div class="gen-done-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p class="gen-done-text" id="genResultCount">生成完成</p>
        </div>

        <!-- Error Section -->
        <div class="gen-error-section" id="genError" style="display:none">
          <p class="gen-error-msg" id="genErrorMsg">生成失败</p>
          <div class="gen-error-actions">
            <button class="gen-btn" id="genRetryBtn">重试</button>
            <button class="gen-btn gen-btn-ghost" id="genSettingsBtn">修改设置</button>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('genAbortBtn')?.addEventListener('click', () => this.abort());
    document.getElementById('genRetryBtn')?.addEventListener('click', () => this.retryCallback?.());
    document.getElementById('genSettingsBtn')?.addEventListener('click', () => {
      this.hide();
      this.settingsCallback?.();
    });
    this.container?.addEventListener('click', (e) => {
      if (e.target === this.container) this.hide();
    });
  },

  show(options = {}) {
    this.retryCallback = options.onRetry;
    this.settingsCallback = options.onSettings;

    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.messageText) this.messageText.textContent = '准备中…';
    if (this.statusText) this.statusText.textContent = '已等待 0 秒';
    if (this.progressSection) this.progressSection.style.display = '';
    if (this.resultSection) this.resultSection.style.display = 'none';
    if (this.errorSection) this.errorSection.style.display = 'none';
    if (this.abortBtn) this.abortBtn.style.display = '';

    this._startTimer();
    this.container?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  },

  hide() {
    this._stopTimer();
    this.container?.classList.remove('visible');
    document.body.style.overflow = '';
  },

  onProgress(data) {
    const pct = data.progress || 0;
    const msg = data.message || '';

    if (this.progressBar) this.progressBar.style.width = pct + '%';
    if (this.messageText) this.messageText.textContent = msg;
  },

  onSuccess(slides) {
    this._stopTimer();
    if (this.progressBar) this.progressBar.style.width = '100%';
    if (this.messageText) this.messageText.textContent = '完成';

    setTimeout(() => {
      if (this.progressSection) this.progressSection.style.display = 'none';
      if (this.resultSection) this.resultSection.style.display = '';
      const countEl = document.getElementById('genResultCount');
      if (countEl) countEl.textContent = '已生成 ' + (slides?.length || 0) + ' 张幻灯片';
    }, 400);
  },

  onError(msg) {
    this._stopTimer();
    if (this.progressSection) this.progressSection.style.display = 'none';
    if (this.errorSection) this.errorSection.style.display = '';
    const errEl = document.getElementById('genErrorMsg');
    if (errEl) errEl.textContent = msg || '生成失败，请重试';
  },

  setProject(project) {
    this._currentProject = project;
  },

  abort() {
    this._stopTimer();
    AIServiceIntegrated?.abort?.();
    this.hide();
  },

  _startTimer() {
    this._stopTimer();
    this._timerStart = Date.now();

    const statusEl = document.getElementById('genStatus');

    this._timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._timerStart) / 1000);
      if (!statusEl) return;

      if (elapsed < 10) {
        statusEl.textContent = '已等待 ' + elapsed + ' 秒';
        statusEl.className = 'gen-status';
      } else if (elapsed < 60) {
        statusEl.textContent = '已等待 ' + elapsed + ' 秒 · AI 正在生成中';
        statusEl.className = 'gen-status';
      } else if (elapsed < 120) {
        statusEl.textContent = '已等待 ' + elapsed + ' 秒 · 耐心等待，即将完成';
        statusEl.className = 'gen-status';
      } else {
        statusEl.textContent = '已等待 ' + elapsed + ' 秒 · 建议取消重试';
        statusEl.className = 'gen-status warn';
      }
    }, 1000);
  },

  _stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  }
};

function injectGenModalCSS() {
  if (document.getElementById('gen-modal-css')) return;

  const style = document.createElement('style');
  style.id = 'gen-modal-css';
  style.textContent = `
    .gen-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(20,16,13,0);
      transition: background 0.3s;
      padding: 20px;
      pointer-events: none;
      visibility: hidden;
    }
    .gen-modal.visible {
      background: rgba(20,16,13,0.42);
      pointer-events: auto;
      visibility: visible;
    }
    .gen-modal-content {
      width: 100%;
      max-width: 400px;
      background: #fbf7f1;
      border: 1px solid rgba(24,19,16,0.16);
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(24,19,16,0.18);
      transform: scale(0.95);
      transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    }
    .gen-modal.visible .gen-modal-content {
      transform: scale(1);
    }

    .gen-progress-section {
      padding: 32px 28px 24px;
      text-align: center;
    }
    .gen-icon-wrap {
      margin-bottom: 20px;
    }
    .gen-icon {
      width: 48px;
      height: 48px;
      background: rgba(164,64,47,0.08);
      border: 1px solid rgba(164,64,47,0.22);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #a4402f;
      animation: gen-pulse 2s ease-in-out infinite;
    }
    @keyframes gen-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(164,64,47,0.16); }
      50% { box-shadow: 0 0 0 10px rgba(164,64,47,0); }
    }
    .gen-message {
      font-size: 15px;
      font-weight: 500;
      color: rgba(24,19,16,0.9);
      margin: 0 0 16px;
      min-height: 22px;
    }
    .gen-bar-track {
      height: 3px;
      background: rgba(24,19,16,0.08);
      overflow: hidden;
      margin-bottom: 12px;
    }
    .gen-bar-fill {
      height: 100%;
      background: #a4402f;
      transition: width 0.4s ease;
    }
    .gen-status {
      font-size: 12px;
      color: rgba(24,19,16,0.46);
      margin: 0 0 16px;
      font-variant-numeric: tabular-nums;
      min-height: 18px;
    }
    .gen-status.warn {
      color: #9d6b1e;
    }
    .gen-abort {
      background: transparent;
      border: 1px solid rgba(24,19,16,0.14);
      color: rgba(24,19,16,0.58);
      font-size: 13px;
      padding: 6px 20px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .gen-abort:hover {
      border-color: rgba(24,19,16,0.28);
      color: rgba(24,19,16,0.84);
      background: rgba(24,19,16,0.03);
    }

    .gen-result-section {
      padding: 36px 28px 28px;
      text-align: center;
    }
    .gen-done-icon {
      width: 56px;
      height: 56px;
      background: rgba(45,106,79,0.08);
      border: 1px solid rgba(45,106,79,0.18);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #2d6a4f;
      margin-bottom: 14px;
      animation: gen-pop 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes gen-pop {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .gen-done-text {
      font-size: 15px;
      color: rgba(24,19,16,0.68);
      margin: 0;
    }

    .gen-error-section {
      padding: 36px 28px 28px;
      text-align: center;
    }
    .gen-error-msg {
      font-size: 14px;
      color: rgba(24,19,16,0.62);
      margin: 0 0 20px;
      line-height: 1.5;
    }
    .gen-error-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .gen-btn {
      padding: 8px 20px;
      background: #181310;
      border: 1px solid #181310;
      font-size: 13px;
      font-weight: 500;
      color: #f4efe8;
      cursor: pointer;
      transition: all 0.2s;
    }
    .gen-btn:hover {
      background: #a4402f;
      border-color: #a4402f;
    }
    .gen-btn-ghost {
      background: transparent;
      border: 1px solid rgba(24,19,16,0.14);
      color: rgba(24,19,16,0.68);
    }
    .gen-btn-ghost:hover {
      background: rgba(24,19,16,0.03);
      border-color: rgba(24,19,16,0.28);
      color: rgba(24,19,16,0.9);
    }
  `;
  document.head.appendChild(style);
}

injectGenModalCSS();
GenerationModal.init();
window.GenerationModal = GenerationModal;
