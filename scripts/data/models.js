/**
 * =============================================
 * Presenta - Data Models
 * =============================================
 * These models match the PRD data object models.
 * When connecting to a real backend, these structures remain the same,
 * only the data source changes (mock → API).
 */

// ============================================
// Core Data Models
// ============================================

/**
 * Project - Main container for a presentation project
 */
const ProjectModel = {
  id: null,                    // string: Unique identifier
  title: '',                   // string: Project title
  source_materials: [],        // array: SourceMaterial[]
  wizard_answers: {},          // object: Wizard answers
  outline_tree: null,          // OutlineNode: Root of the outline tree
  slides: [],                 // array: Slide[]
  theme_settings: null,       // ThemeSettings: Global theme
  share_settings: null,       // ShareSettings: Sharing configuration
  generation_status: 'idle',  // enum: 'idle' | 'generating' | 'completed' | 'failed'
  created_at: null,           // Date: Creation timestamp
  updated_at: null,           // Date: Last update timestamp
};

/**
 * SourceMaterial - Input material for the presentation
 */
const SourceMaterialModel = {
  id: null,              // string: Unique identifier
  type: 'pdf',          // enum: 'pdf' | 'markdown' | 'link' | 'other'
  raw_input: '',        // string: Raw file content or URL
  parsed_text: '',      // string: Extracted text content
  parse_confidence: 1.0, // number: 0-1, confidence score
  page_count: 0,         // number: For PDFs
  word_count: 0,        // number: Word count after parsing
  status: 'pending',    // enum: 'pending' | 'parsing' | 'done' | 'failed'
  error_message: null,  // string: Error message if failed
};

/**
 * OutlineNode - Node in the mind map outline tree
 */
const OutlineNodeModel = {
  id: null,              // string: Unique identifier
  level: 1,             // number: 1=chapter, 2=sub-chapter, 3=point
  title: '',            // string: Node title
  description: '',      // string: Optional description
  parent_id: null,      // string: Parent node ID (null for root)
  children: [],         // array: OutlineNode[] - child nodes
  linked_slide_ids: [], // array: string[] - linked slide IDs
  status: 'pending',    // enum: 'pending' | 'generated' | 'modified'
};

/**
 * Slide - Individual slide in the presentation
 */
const SlideModel = {
  id: null,                 // string: Unique identifier
  order: 0,                // number: Order in the presentation
  outline_node_id: null,   // string: Source outline node ID
  title: '',               // string: Slide title
  text_content: '',       // string: Main text content
  html_content: '',        // string: Generated HTML content
  image_assets: [],        // array: ImageAsset[]
  style_settings: null,    // SlideStyleSettings: Per-slide style overrides
  generation_status: 'pending', // enum: 'pending' | 'generating' | 'completed' | 'failed'
  last_generated_at: null, // Date: Last generation timestamp
};

/**
 * ImageAsset - Image within a slide
 */
const ImageAssetModel = {
  id: null,           // string: Unique identifier
  type: 'upload',   // enum: 'upload' | 'generated' | 'url'
  url: '',           // string: Image URL
  prompt: '',        // string: Generation prompt (for AI-generated images)
  crop_data: null,   // object: Crop configuration
  alt_text: '',      // string: Alt text for accessibility
};

/**
 * ThemeSettings - Global theme configuration
 */
const ThemeSettingsModel = {
  color_theme: 'default',  // enum: 'default' | 'blue' | 'purple' | 'green' | 'orange' | 'gray'
  font_style: 'sans',      // enum: 'sans' | 'serif' | 'mono' | 'handwritten'
  text_size: 'medium',    // enum: 'small' | 'medium' | 'large'
  background_style: 'solid', // enum: 'solid' | 'gradient' | 'image'
  animation_style: 'fade',   // enum: 'none' | 'fade' | 'push' | 'zoom'
  custom_colors: null,    // object: Custom color overrides { primary, secondary, background }
};

/**
 * ShareSettings - Sharing configuration
 */
const ShareSettingsModel = {
  enabled: false,          // boolean: Is sharing enabled
  link_url: '',           // string: Generated share URL
  password_protected: false, // boolean: Is password protected
  password: '',          // string: Password (hashed)
  expires_at: null,       // Date: Expiration timestamp
  view_count: 0,         // number: Total views
  watermark_enabled: true, // boolean: Show watermark
};

/**
 * WizardAnswer - Answer to a wizard question
 */
const WizardAnswerModel = {
  question_id: null,      // string: Question identifier
  value: null,            // any: Selected/entered value
  is_required: true,      // boolean: Is this answer required
};

/**
 * WizardQuestion - Definition of a wizard question
 */
const WizardQuestionModel = {
  id: 'q1',              // string: Unique identifier
  title: '',             // string: Question title
  description: '',        // string: Optional description
  type: 'cards',         // enum: 'cards' | 'slider' | 'text' | 'combobox'
  options: [],           // array: Option[] - For cards/combobox types
  min_value: null,       // number: For slider type
  max_value: null,       // number: For slider type
  default_value: null,   // any: Default value
  is_required: true,     // boolean: Is this question required
  allow_custom: false,   // boolean: Allow custom input in addition to options
};

/**
 * Wizard - The 5 questions from our PRD
 */
const WizardQuestions = [
  {
    id: 'q1',
    title: '这次演示的对象是谁？',
    description: '了解你的受众能帮助我们调整内容的深度和语气',
    type: 'cards',
    is_required: true,
    allow_custom: true,
    options: [
      { id: 'executive', label: '企业高管', icon: '👔', description: '董事会、C-level管理者' },
      { id: 'investor', label: '投资人', icon: '💼', description: 'VC、PE、天使投资人' },
      { id: 'client', label: '客户', icon: '🤝', description: '潜在客户、合作伙伴' },
      { id: 'team', label: '团队内部', icon: '👥', description: '同事、下属、部门' },
      { id: 'student', label: '学生/培训', icon: '📚', description: '学员、培训对象' },
    ],
  },
  {
    id: 'q2',
    title: '演示的使用场景是什么？',
    description: '不同场景需要不同的叙事结构和说服策略',
    type: 'cards',
    is_required: true,
    allow_custom: false,
    options: [
      { id: 'pitch', label: '融资路演', icon: '🚀', description: '向投资人展示商业模式' },
      { id: 'proposal', label: '项目提案', icon: '📋', description: '争取项目或预算' },
      { id: 'report', label: '季度汇报', icon: '📊', description: '定期工作汇报' },
      { id: 'solution', label: '方案介绍', icon: '💡', description: '解决方案展示' },
      { id: 'training', label: '培训教学', icon: '🎓', description: '知识传授、技能培训' },
      { id: 'launch', label: '产品发布', icon: '🎉', description: '新产品或功能发布' },
    ],
  },
  {
    id: 'q3',
    title: '你希望最终有多少页？',
    description: '页数影响信息密度和演示时长',
    type: 'slider',
    is_required: true,
    min_value: 5,
    max_value: 30,
    default_value: 12,
    unit: '页',
  },
  {
    id: 'q4',
    title: '你希望的风格是？',
    description: '视觉风格影响受众的第一印象',
    type: 'cards',
    is_required: false,
    allow_custom: false,
    options: [
      { id: 'minimal', label: '极简商务', icon: '◼️', description: '干净利落，突出内容' },
      { id: 'tech', label: '科技感', icon: '⚡', description: '现代感强，适合科技行业' },
      { id: 'narrative', label: '文艺叙事', icon: '✨', description: '故事性强，情感丰富' },
      { id: 'academic', label: '学术严谨', icon: '📖', description: '数据详实，逻辑严密' },
      { id: 'brand', label: '品牌定制', icon: '🎨', description: '使用你自己的品牌元素' },
    ],
  },
  {
    id: 'q5',
    title: '演示的语气倾向？',
    description: '语气影响说服力和亲和力',
    type: 'cards',
    is_required: false,
    allow_custom: false,
    options: [
      { id: 'persuasive', label: '说服型', icon: '🎯', description: '强调优势，推动决策' },
      { id: 'informative', label: '信息型', icon: '📝', description: '客观陈述，事实为主' },
      { id: 'narrative', label: '叙事型', icon: '📖', description: '讲故事，引发共鸣' },
      { id: 'educational', label: '教学型', icon: '🧑‍🏫', description: '循序渐进，易于理解' },
    ],
  },
];

/**
 * Color Themes - Predefined color themes
 */
const ColorThemes = {
  default: {
    name: '编辑纸本',
    primary: '#A4402F',
    secondary: '#7E2E23',
    background: '#F7F2EA',
    text: '#181310',
    accent: '#C76F58',
  },
  blue: {
    name: '理性蓝灰',
    primary: '#35577C',
    secondary: '#223C57',
    background: '#EEF2F4',
    text: '#16212B',
    accent: '#6F95B7',
  },
  purple: {
    name: '酒红叙事',
    primary: '#6F344B',
    secondary: '#4E2335',
    background: '#F2E8EC',
    text: '#22161C',
    accent: '#B67A8E',
  },
  green: {
    name: '自然绿',
    primary: '#4D7A5C',
    secondary: '#2F5640',
    background: '#EEF4EF',
    text: '#172219',
    accent: '#7EAB8C',
  },
  orange: {
    name: '陶土暖调',
    primary: '#B35B35',
    secondary: '#894126',
    background: '#F6EEE6',
    text: '#23160F',
    accent: '#D18B66',
  },
  gray: {
    name: '极简灰',
    primary: '#5B5B58',
    secondary: '#353532',
    background: '#F3F1EC',
    text: '#181715',
    accent: '#97948C',
  },
};

// ============================================
// Application State
// ============================================

/**
 * Application state store
 * This simulates what a state management library like Redux would do
 */
class AppState {
  constructor() {
    this.listeners = [];
    this.state = {
      currentPage: 'landing',      // Current page in the app
      project: null,                // Current project data
      wizardStep: 0,                // Current wizard step (0-4)
      wizardAnswers: {},            // Wizard answers
      isLoading: false,            // Global loading state
      error: null,                  // Global error state
      theme: 'dark',               // 'dark' or 'light'
    };
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update state
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Initialize a new project
   */
  initProject(sourceMaterial) {
    const project = {
      id: generateId(),
      title: '未命名演示',
      source_materials: [sourceMaterial],
      wizard_answers: {},
      outline_tree: null,
      slides: [],
      theme_settings: { ...ThemeSettingsModel },
      share_settings: null,
      generation_status: 'idle',
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.setState({ project, wizardStep: 0 });
    return project;
  }

  /**
   * Save wizard answer
   */
  saveWizardAnswer(questionId, value) {
    const { project } = this.state;
    if (project) {
      project.wizard_answers[questionId] = value;
      project.updated_at = new Date();
      this.setState({ project });
    }
  }

  /**
   * Navigate to next wizard step
   */
  nextWizardStep() {
    const { wizardStep } = this.state;
    if (wizardStep < WizardQuestions.length - 1) {
      this.setState({ wizardStep: wizardStep + 1 });
    }
  }

  /**
   * Navigate to previous wizard step
   */
  prevWizardStep() {
    const { wizardStep } = this.state;
    if (wizardStep > 0) {
      this.setState({ wizardStep: wizardStep - 1 });
    }
  }

  /**
   * Go to a specific page
   */
  navigateTo(page) {
    this.setState({ currentPage: page });
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a unique ID
 */
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format date to locale string
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Export for use in other modules
window.Models = {
  ProjectModel,
  SourceMaterialModel,
  OutlineNodeModel,
  SlideModel,
  ImageAssetModel,
  ThemeSettingsModel,
  ShareSettingsModel,
  WizardAnswerModel,
  WizardQuestionModel,
  WizardQuestions,
  ColorThemes,
  AppState,
  generateId,
  deepClone,
  formatDate,
  formatFileSize,
};
