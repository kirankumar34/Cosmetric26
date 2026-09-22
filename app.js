/**
 * COSMETRIC'26 — REDESIGNED UI/UX ENGINE
 * Matching Video Prototype: COSMETRIC_website_UI_UX_prototype_20260919112117.mp4
 * Department of Electronics & Communication Engineering, Sriram Engineering College
 *
 * Core Features:
 * 1. Boot sequence (<2.0s or instant on [ESC]/Skip) with INITIALIZING ECE SYSTEM ONLINE ▪)))
 * 2. Chamfered Metallic ENTER SYSTEM button with expanding circular cyan shockwave
 * 3. Left Numbered Sidebar Navigation with smooth target tracking
 * 4. 3D Wireframe Sine Wave canvas rendering for Card 1 (Technical)
 * 5. Holographic Tech Showcase canvas with multi-line harmonic waveforms
 * 6. Interactive macOS/HUD Diagnostic Modal Window with official DOCX event data
 * 7. Access Request form submission with REQUEST TRANSMITTED confirmation modal
 * 8. Non-blocking Web Audio Synthesizer for tactile feedback
 * 9. Page Visibility API to pause rendering when inactive (zero battery/GPU waste)
 */

(function () {
  'use strict';

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const protoBootContainer = document.getElementById('proto-boot-container');
  const protoBootFill = document.getElementById('proto-boot-fill');
  const btnSkipBoot = document.getElementById('btn-skip-boot');

  const btnEnterSystem = document.getElementById('btn-enter-system');
  const shockwaveRipple = document.getElementById('shockwave-ripple');

  const protoSidebar = document.getElementById('proto-sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const protoNavItems = document.querySelectorAll('.proto-nav-item');
  const headerNavLinks = document.querySelectorAll('.header-nav-link');
  const headerNavIndicator = document.getElementById('header-nav-indicator');

  const cardWaveCanvas = document.getElementById('card-wave-canvas');
  const showcaseWaveCanvas = document.getElementById('showcase-wave-canvas');

  // Diagnostic Modal Elements
  const diagModalBackdrop = document.getElementById('diagnostic-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalUrlText = document.getElementById('modal-url-text');
  const modalEventTitle = document.getElementById('modal-event-title');
  const modalRulesList = document.getElementById('modal-rules-list');
  const modalCoordinatorsRow = document.getElementById('modal-coordinators-row');
  const modalDescText = document.getElementById('modal-desc-text');
  const modalTimingText = document.getElementById('modal-timing-text');
  const modalPrizeText = document.getElementById('modal-prize-text');
  const modalSpeakerAvatar = document.getElementById('modal-speaker-avatar');
  const modalSpeakerName = document.getElementById('modal-speaker-name');

  // Access Request Registration Card
  const accessRequestCard = document.getElementById('access-request-card');

  // State Management
  let isBootCompleted = false;
  let activeEventName = 'Paper Presentation';
  let cardWaveAnimId = null;
  let showcaseWaveAnimId = null;
  let audioCtx = null;

  // =========================================================================
  // 1. NON-BLOCKING WEB AUDIO SYNTHESIZER
  // =========================================================================
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playUiTone(frequency, type = 'sine', duration = 0.12, gainLevel = 0.05) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(gainLevel, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {
      // Audio autoplay policies or unsupported
    }
  }

  function playShockwaveSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.35);

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (_) {}
  }

  function playRelaySwitchSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Component 1: High frequency electrical contact spark
      const oscHigh = ctx.createOscillator();
      const gainHigh = ctx.createGain();
      oscHigh.type = 'sine';
      oscHigh.frequency.setValueAtTime(2400, ctx.currentTime);
      gainHigh.gain.setValueAtTime(0.07, ctx.currentTime);
      gainHigh.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
      oscHigh.connect(gainHigh);
      gainHigh.connect(ctx.destination);
      oscHigh.start();
      oscHigh.stop(ctx.currentTime + 0.035);

      // Component 2: Resonant magnetic relay solenoid pulse
      const oscLow = ctx.createOscillator();
      const gainLow = ctx.createGain();
      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(340, ctx.currentTime);
      oscLow.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.08);
      gainLow.gain.setValueAtTime(0.08, ctx.currentTime);
      gainLow.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.085);
      oscLow.connect(gainLow);
      gainLow.connect(ctx.destination);
      oscLow.start();
      oscLow.stop(ctx.currentTime + 0.085);
    } catch (_) {}
  }

  // =========================================================================
  // 2. FAST BOOT SEQUENCE (<2.0s with Skip Option)
  // =========================================================================
  function completeBoot() {
    if (isBootCompleted) return;
    isBootCompleted = true;

    if (protoBootContainer) {
      protoBootContainer.classList.add('hidden');
      playUiTone(880, 'sine', 0.2, 0.06);

      setTimeout(() => {
        if (protoBootContainer.parentNode) {
          protoBootContainer.style.display = 'none';
        }
      }, 650);
    }
  }

  function startBootSequence() {
    if (!protoBootContainer) {
      isBootCompleted = true;
      return;
    }

    let progress = 0;
    const duration = 1400; // 1.4 seconds
    const interval = 30;
    const step = (100 / (duration / interval));

    const bootTimer = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(bootTimer);
        if (protoBootFill) protoBootFill.style.width = '100%';
        setTimeout(completeBoot, 180);
      } else {
        if (protoBootFill) protoBootFill.style.width = progress + '%';
      }
    }, interval);

    // Skip Handlers
    if (btnSkipBoot) {
      btnSkipBoot.addEventListener('click', () => {
        clearInterval(bootTimer);
        completeBoot();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !isBootCompleted) {
        clearInterval(bootTimer);
        completeBoot();
      }
    });
  }

  // =========================================================================
  // 3. ENTER SYSTEM BUTTON & EXPANDING CIRCULAR SHOCKWAVE
  // =========================================================================
  if (btnEnterSystem) {
    btnEnterSystem.addEventListener('click', (e) => {
      e.preventDefault();
      playShockwaveSound();

      if (shockwaveRipple) {
        shockwaveRipple.classList.remove('active');
        // Trigger reflow to restart CSS animation
        void shockwaveRipple.offsetWidth;
        shockwaveRipple.classList.add('active');
      }

      // Smooth scroll to #events section after short shockwave burst
      setTimeout(() => {
        const eventsSec = document.getElementById('events');
        if (eventsSec) {
          eventsSec.scrollIntoView({ behavior: 'smooth' });
        }
      }, 350);

      // Clean up shockwave class after completion
      setTimeout(() => {
        if (shockwaveRipple) shockwaveRipple.classList.remove('active');
      }, 1000);
    });
  }

  // =========================================================================
  // 4. NUMBERED SIDEBAR & TOP HEADER NAVIGATION (ScrollSpy)
  // =========================================================================
  function updateNavActive(targetId) {
    // Update sidebar items
    protoNavItems.forEach((btn) => {
      const match = btn.getAttribute('data-target') === targetId;
      btn.classList.toggle('active', match);
    });

    // Update top header links
    let activeLink = null;
    headerNavLinks.forEach((link) => {
      const match = link.getAttribute('data-target') === targetId;
      link.classList.toggle('active', match);
      if (match) activeLink = link;
    });

    // Update header nav indicator underline position
    if (headerNavIndicator && activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement.getBoundingClientRect();
      headerNavIndicator.style.width = linkRect.width + 'px';
      headerNavIndicator.style.transform = `translateX(${linkRect.left - parentRect.left}px)`;
      headerNavIndicator.style.opacity = '1';
    }
  }

  function openSidebar() {
    if (protoSidebar) protoSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    playUiTone(440, 'triangle', 0.08, 0.04);
  }

  function closeSidebar() {
    if (protoSidebar) protoSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  // Sidebar item click
  protoNavItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        playUiTone(520, 'sine', 0.08, 0.04);
        targetEl.scrollIntoView({ behavior: 'smooth' });
        updateNavActive(targetId);
        // Automatically close mobile off-canvas drawer
        if (window.innerWidth <= 860) {
          closeSidebar();
        }
      }
    });
  });

  // Header link click
  headerNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        playUiTone(520, 'sine', 0.08, 0.04);
        targetEl.scrollIntoView({ behavior: 'smooth' });
        updateNavActive(targetId);
      }
    });
  });

  // Mobile sidebar toggle & backdrop click
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      if (protoSidebar && protoSidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // ScrollSpy via IntersectionObserver
  const observedSections = ['hero', 'events', 'nontech-section', 'showcase', 'timeline-section', 'register'];
  const sectionElements = observedSections.map(id => document.getElementById(id)).filter(Boolean);

  if ('IntersectionObserver' in window && sectionElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateNavActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    });

    sectionElements.forEach(sec => observer.observe(sec));
  }

  // Initialize indicator on load
  window.addEventListener('load', () => {
    updateNavActive('hero');
  });

  // =========================================================================
  // 5. 3D WIREFRAME SINE WAVE CANVAS (Card 1: Technical)
  // =========================================================================
  function initCardWaveCanvas() {
    if (!cardWaveCanvas) return;
    const ctx = cardWaveCanvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;

    function resize() {
      const rect = cardWaveCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      cardWaveCanvas.width = width * dpr;
      cardWaveCanvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    function render() {
      time += 0.035;
      ctx.clearRect(0, 0, width, height);

      // Background mesh grid lines
      ctx.strokeStyle = 'rgba(79, 216, 255, 0.08)';
      ctx.lineWidth = 1;
      const cols = 8;
      for (let c = 0; c <= cols; c++) {
        const x = (width / cols) * c;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 3D Perspective Wireframe Waves (5 depth layers)
      const layers = 5;
      for (let l = 0; l < layers; l++) {
        const depth = l / (layers - 1); // 0 (back) to 1 (front)
        const alpha = 0.2 + depth * 0.7;
        const baseY = height * 0.5 + (depth - 0.5) * 35;
        const amplitude = 18 + depth * 14;
        const freq = 0.024 - depth * 0.004;
        const phase = time + l * 0.65;

        ctx.beginPath();
        ctx.strokeStyle = depth === 1 ? '#4fd8ff' : `rgba(79, 216, 255, ${alpha.toFixed(2)})`;
        ctx.lineWidth = depth === 1 ? 2 : 1.2;

        for (let x = 0; x <= width; x += 3) {
          const y = baseY + Math.sin(x * freq + phase) * amplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Glowing nodes on front-most wave
        if (depth === 1) {
          for (let nx = 30; nx < width - 20; nx += 60) {
            const ny = baseY + Math.sin(nx * freq + phase) * amplitude * Math.sin((nx / width) * Math.PI);
            ctx.fillStyle = '#7ff3ff';
            ctx.beginPath();
            ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      cardWaveAnimId = requestAnimationFrame(render);
    }

    render();
  }

  // =========================================================================
  // 6. HOLOGRAPHIC SHOWCASE CANVAS (Multi-Line Harmonic Waves)
  // =========================================================================
  function initShowcaseWaveCanvas() {
    if (!showcaseWaveCanvas) return;
    const ctx = showcaseWaveCanvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;

    function resize() {
      const rect = showcaseWaveCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      showcaseWaveCanvas.width = width * dpr;
      showcaseWaveCanvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    function render() {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Center Reference Carrier Line
      ctx.strokeStyle = 'rgba(79, 216, 255, 0.15)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.5);
      ctx.lineTo(width, height * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Harmonic Waveform 1: 28.4 GHz Primary Carrier
      ctx.beginPath();
      ctx.strokeStyle = '#4fd8ff';
      ctx.lineWidth = 2.2;
      for (let x = 0; x <= width; x += 2) {
        const envelope = Math.sin((x / width) * Math.PI);
        const y = height * 0.5 + Math.sin(x * 0.032 + time * 1.5) * 44 * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Harmonic Waveform 2: Sub-carrier Phase Shifted
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(127, 243, 255, 0.5)';
      ctx.lineWidth = 1.4;
      for (let x = 0; x <= width; x += 3) {
        const envelope = Math.sin((x / width) * Math.PI);
        const y = height * 0.5 + Math.sin(x * 0.02 + time * 1.1 + 1.2) * 32 * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Harmonic Waveform 3: High-frequency Modulation
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 182, 72, 0.45)';
      ctx.lineWidth = 1.2;
      for (let x = 0; x <= width; x += 4) {
        const envelope = Math.sin((x / width) * Math.PI);
        const y = height * 0.5 + Math.cos(x * 0.05 + time * 2) * 16 * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      showcaseWaveAnimId = requestAnimationFrame(render);
    }

    render();
  }

  // =========================================================================
  // 7. INTERACTIVE DIAGNOSTIC MODAL WINDOW (Official DOCX Event Data)
  // =========================================================================
  const eventDetailsData = {
    'Paper Presentation': {
      title: 'PAPER PRESENTATION',
      slug: 'paper-presentation',
      rules: [
        'Maximum 3 members per team.',
        'Presentation Time: 5 mins presentation + 2 mins Q&A viva with judges.',
        'Abstract must be submitted prior to the symposium registration deadline.',
        'Presentations must follow standard IEEE/symposium format.',
        'Bring soft copy on pen drive + 2 hard copies at time of reporting.',
        '10 Research Topics: 1) GAA (Gate-All-Around) FET Technology, 2) Chiplet-Based System-on-Chip (SoC), 3) 6G Wireless Communication, 4) AI-Based Electronic Fault Detection, 5) Wireless Sensor Networks, 6) Edge Computing in IoT, 7) Energy Harvesting IoT Sensors, 8) Secure IoT Hardware, 9) Metamaterial-Based Antennas, 10) Massive MIMO and Advanced Beamforming.'
      ],
      coordinators: [
        { name: 'Ezhilarasi.M', role: 'IV Yr' },
        { name: 'Yogeshwaran.S', role: 'III Yr' },
        { name: 'Priya Dharshini.K', role: 'III Yr' },
        { name: 'Sanjay kumar.G', role: 'IV Yr' },
        { name: 'Vishal', role: 'II Yr' },
        { name: 'Hari Krishna', role: 'II Yr' }
      ],
      description: 'Flagship technical paper presentation event evaluating research rigor, technical novelty, hardware/simulation depth, and analytical presentation across 10 cutting-edge ECE research topics.',
      timing: '10:00 AM – 01:00 PM',
      prize: '1st: ₹1,000 | 2nd: ₹700 (Cash Pool: ₹1,700)',
      staffAvatar: 'LS',
      staffName: 'Dr. L. SIVAGAMI & Mrs. G. AALIN JOYS',
      staffDept: 'Head / ECE & Assistant Professor / ECE'
    },
    'Circuit Debugging': {
      title: 'CIRCUIT DEBUGGING',
      slug: 'circuit-debugging',
      rules: [
        'Round 1: 20 Minutes (Timing: 10:00 AM – 1:00 PM).',
        'Round 2: 30 Minutes (Timing: 1:30 PM – 2:00 PM).',
        'No gadgets, smart watches, or mobile phones are allowed during the event.',
        'Participants must strictly follow the allotted time limit.',
        'Any form of malpractice will result in immediate disqualification.',
        'Participants must follow all instructions given by event coordinators.',
        'The decision of the judges/coordinators will be final and binding.'
      ],
      coordinators: [
        { name: 'Vallarasu.V', role: 'IV Yr' },
        { name: 'Ranjini.A', role: 'IV Yr' },
        { name: 'Saraswathi.R', role: 'III Yr' },
        { name: 'Thulasi Raman', role: 'II Yr' },
        { name: 'Nandhini.T', role: 'II Yr' },
        { name: 'Saini.G', role: 'II Yr' }
      ],
      description: 'High-pressure hardware arena testing real-time fault identification, schematic analysis, breadboard assembly, and electronic debugging under strict 20-min and 30-min clocks.',
      timing: 'Round 1: 10:00 AM – 1:00 PM // Round 2: 1:30 PM – 2:00 PM',
      prize: '1st: ₹1,000 | 2nd: ₹700 (Cash Pool: ₹1,700)',
      staffAvatar: 'YV',
      staffName: 'Mrs. YAMINI.V',
      staffDept: 'Assistant Professor, Department of ECE'
    },
    'Project Display': {
      title: 'PROJECT DISPLAY',
      slug: 'project-display',
      rules: [
        'Team size: 2 to 3 members per project.',
        'ECE Related Projects: Both Hardware working models and Software simulations/systems are eligible.',
        'Standard AC power supply (230V) and workbench provided in the ECE laboratory.',
        'Evaluation based on Innovation, Working Model Demonstration, Technical Complexity, and Viva.',
        'Participants must report with required components and project abstract at allotted time.'
      ],
      coordinators: [
        { name: 'Tameeshwaran G.A', role: 'IV Yr' },
        { name: 'Papishna S.G', role: 'III Yr' },
        { name: 'Vijay Hari', role: 'II Yr' },
        { name: 'Vishva', role: 'II Yr' },
        { name: 'Naresh', role: 'II Yr' },
        { name: 'Jai Akash.G', role: 'III Yr' }
      ],
      description: 'Showcase functional hardware prototypes, IoT systems, embedded innovations, robotics, or advanced software simulations before an expert jury of professors and industry evaluators.',
      timing: '10:30 AM – 01:00 PM',
      prize: '1st: ₹900 | 2nd: ₹600 (Cash Pool: ₹1,500)',
      staffAvatar: 'GK',
      staffName: 'Mr. G. KODEESHWARAN',
      staffDept: 'Assistant Professor, Department of ECE'
    },
    'Pesama Nadida': {
      title: 'PESAMA NADIDA',
      slug: 'pesama-nadida',
      rules: [
        'Total team members: 3 (Only 2 members from each team will participate on stage).',
        'LEVEL 1 (Action La Answer): Host provides two movie titles. One acts out, the other guesses. All teams participate simultaneously. 10 pts for finding within 10s, 5 pts within 20s.',
        'LEVEL 2 (Tune-Uh Paathu Sollu): Host provides random word and song. One hums tune using word, other identifies song. 10 pts within 5s, 5 pts within 10s. Top 2 teams qualify for Level 3.',
        'LEVEL 3 (Final Round): Host plays song and stops midway. Participants identify and sing missing lyrics. Participant who picks up microphone first gets the chance to answer! If incorrect, opposing team gets the chance.',
        'Strictly no verbal whispering or lip-syncing. Coordinators decision is final.'
      ],
      coordinators: [
        { name: 'Monisha.P', role: 'IV Yr' },
        { name: 'Priya Dharshini.K', role: 'III Yr' },
        { name: 'Sadhana', role: 'II Yr' },
        { name: 'Kavi Priyan', role: 'II Yr' },
        { name: 'Pottriselvan', role: 'II Yr' },
        { name: 'Sai Varshini', role: 'II Yr' }
      ],
      description: 'The ultimate cinema & music showdown: Dumb charades (Action La Answer), music tune hum matching (Tune-Uh Paathu Sollu), and rapid-fire live lyric sing-off!',
      timing: '01:30 PM – 03:00 PM',
      prize: '1st: ₹700 | 2nd: ₹300 (Cash Pool: ₹1,000)',
      staffAvatar: 'BG',
      staffName: 'Mrs. C. BELLA STARY GOLD',
      staffDept: 'Assistant Professor, Department of ECE'
    },
    'Vandhu Vilayadu': {
      title: 'VANDHU VILAYADU',
      slug: 'vandhu-vilayadu',
      rules: [
        'Solo / Duo participation permitted across 5 rapid-fire reflex games.',
        '1. FLIP TAC TOE: Flip cup to land upside down. Successful flip places cup on Tic-Tac-Toe board. First to get 3 in a row wins.',
        '2. WALKER BOTTLE: Ladder grid with middle "X" marker. Repeatedly flip 2/3 water bottle upright. Each successful flip advances marker towards opponent side. First across wins.',
        '3. BALLOON CUP: No direct hand contact! Insert balloon into cup, inflate to grip, transport and stack onto target cup. Deflate gently to release.',
        '4. BALLOON PYRAMID: Transport cups using only balloon inflation grip. Construct cup pyramid layer by layer against clock.',
        '5. BOTTLE BOMB: Complete rapid bottle flipping or matching challenge within allotted time. Pass turn to next participant. Timer expiry loses round.'
      ],
      coordinators: [
        { name: 'Kirubakaran.G', role: 'IV Yr' },
        { name: 'Naveen Kumar.I', role: 'III Yr' },
        { name: 'Diwakar', role: 'II Yr' },
        { name: 'Jaya Ganapathy', role: 'II Yr' },
        { name: 'Abel Jenish', role: 'II Yr' },
        { name: 'Sundaresan', role: 'II Yr' }
      ],
      description: 'High-octane fun, hand-eye coordination, and agility games: Flip Tac Toe, Walker Bottle, Balloon Cup, Balloon Pyramid, and Bottle Bomb sudden death!',
      timing: '01:45 PM – 03:30 PM',
      prize: '1st: ₹700 | 2nd: ₹300 (Cash Pool: ₹1,000)',
      staffAvatar: 'BG',
      staffName: 'Mrs. C. BELLA STARY GOLD',
      staffDept: 'Assistant Professor, Department of ECE'
    },
    'Vanthu Velayadu': {
      title: 'VANDHU VILAYADU',
      slug: 'vandhu-vilayadu',
      rules: [
        'Solo / Duo participation permitted across 5 rapid-fire reflex games.',
        '1. FLIP TAC TOE: Flip cup to land upside down. Successful flip places cup on Tic-Tac-Toe board. First to get 3 in a row wins.',
        '2. WALKER BOTTLE: Ladder grid with middle "X" marker. Repeatedly flip 2/3 water bottle upright. Each successful flip advances marker towards opponent side. First across wins.',
        '3. BALLOON CUP: No direct hand contact! Insert balloon into cup, inflate to grip, transport and stack onto target cup. Deflate gently to release.',
        '4. BALLOON PYRAMID: Transport cups using only balloon inflation grip. Construct cup pyramid layer by layer against clock.',
        '5. BOTTLE BOMB: Complete rapid bottle flipping or matching challenge within allotted time. Pass turn to next participant. Timer expiry loses round.'
      ],
      coordinators: [
        { name: 'Kirubakaran.G', role: 'IV Yr' },
        { name: 'Naveen Kumar.I', role: 'III Yr' },
        { name: 'Diwakar', role: 'II Yr' },
        { name: 'Jaya Ganapathy', role: 'II Yr' },
        { name: 'Abel Jenish', role: 'II Yr' },
        { name: 'Sundaresan', role: 'II Yr' }
      ],
      description: 'High-octane fun, hand-eye coordination, and agility games: Flip Tac Toe, Walker Bottle, Balloon Cup, Balloon Pyramid, and Bottle Bomb sudden death!',
      timing: '01:45 PM – 03:30 PM',
      prize: '1st: ₹700 | 2nd: ₹300 (Cash Pool: ₹1,000)',
      staffAvatar: 'BG',
      staffName: 'Mrs. C. BELLA STARY GOLD',
      staffDept: 'Assistant Professor, Department of ECE'
    },
    'Surprise Event': {
      title: 'SURPRISE EVENT',
      slug: 'surprise-event',
      rules: [
        'Open to all registered delegates of COSMETRIC\'26.',
        'Mystery challenge format unveiled live in the auditorium on symposium day.',
        'Tests spontaneous analytical reasoning, non-linear thinking, and agile problem solving.',
        'Round instructions and evaluation criteria explained on the spot.',
        'Coordinators decision is final and binding in all determinations.'
      ],
      coordinators: [
        { name: 'Sachin.M', role: 'IV Yr' },
        { name: 'Manoj Kumar.B', role: 'III Yr' },
        { name: 'Pushpa', role: 'II Yr' },
        { name: 'Jai Akash.G', role: 'III Yr' },
        { name: 'Santhosh.K', role: 'IV Yr' }
      ],
      description: 'Exclusive on-the-spot symposium day mystery competition. Spontaneous wits, rapid challenges, and special accolades awarded on stage!',
      timing: '02:30 PM – 03:30 PM',
      prize: 'Special Honors, Trophies & Merit Certificates',
      staffAvatar: 'YV',
      staffName: 'Mrs. YAMINI.V',
      staffDept: 'Assistant Professor, Department of ECE'
    }
  };

  window.openDiagnosticModal = function (eventName) {
    activeEventName = eventName || 'Paper Presentation';
    const data = eventDetailsData[activeEventName] || eventDetailsData['Paper Presentation'];

    if (modalUrlText) modalUrlText.textContent = `cosmetric.com/diagnostic/${data.slug}`;
    if (modalEventTitle) modalEventTitle.textContent = data.title;
    if (modalDescText) modalDescText.textContent = data.description;
    if (modalTimingText) modalTimingText.textContent = data.timing;
    if (modalPrizeText) modalPrizeText.textContent = data.prize;
    if (modalSpeakerAvatar) modalSpeakerAvatar.textContent = data.staffAvatar;
    if (modalSpeakerName) modalSpeakerName.textContent = data.staffName;

    // Rules list
    if (modalRulesList) {
      modalRulesList.innerHTML = '';
      data.rules.forEach((rule) => {
        const li = document.createElement('li');
        li.textContent = rule;
        modalRulesList.appendChild(li);
      });
    }

    // Coordinators bubbles
    if (modalCoordinatorsRow) {
      modalCoordinatorsRow.innerHTML = '';
      data.coordinators.forEach((coord) => {
        const bubble = document.createElement('div');
        bubble.className = 'coord-bubble';
        bubble.innerHTML = `
          <div class="cb-avatar">${coord.name.slice(0, 2).toUpperCase()}</div>
          <div class="cb-name">${coord.name} (${coord.role})</div>
        `;
        modalCoordinatorsRow.appendChild(bubble);
      });
    }

    if (diagModalBackdrop) {
      diagModalBackdrop.classList.remove('hidden');
      diagModalBackdrop.setAttribute('aria-hidden', 'false');
      playUiTone(680, 'sine', 0.12, 0.05);
    }
  };

  window.closeDiagnosticModal = function () {
    if (diagModalBackdrop) {
      diagModalBackdrop.classList.add('hidden');
      diagModalBackdrop.setAttribute('aria-hidden', 'true');
      playUiTone(440, 'sine', 0.08, 0.04);
    }
  };

  window.selectEventAndScroll = function () {
    closeDiagnosticModal();

    setTimeout(() => {
      const regSec = document.getElementById('register');
      if (regSec) {
        regSec.scrollIntoView({ behavior: 'smooth' });
        // Subtle focus glow on the Google Form registration card
        const formCard = document.getElementById('access-request-card');
        if (formCard) {
          formCard.classList.add('highlight-glow');
          playUiTone(620, 'sine', 0.14, 0.05);
          setTimeout(() => {
            formCard.classList.remove('highlight-glow');
          }, 2000);
        }
      }
    }, 250);
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDiagnosticModal);
  }

  if (diagModalBackdrop) {
    diagModalBackdrop.addEventListener('click', (e) => {
      if (e.target === diagModalBackdrop) {
        closeDiagnosticModal();
      }
    });
  }

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (diagModalBackdrop && !diagModalBackdrop.classList.contains('hidden')) {
        closeDiagnosticModal();
      }
      if (transmittedModalBackdrop && !transmittedModalBackdrop.classList.contains('hidden')) {
        transmittedModalBackdrop.classList.add('hidden');
      }
    }
  });

  // =========================================================================
  // 9. PAGE VISIBILITY OPTIMIZATION (Zero Background GPU Drain)
  // =========================================================================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (cardWaveAnimId) cancelAnimationFrame(cardWaveAnimId);
      if (showcaseWaveAnimId) cancelAnimationFrame(showcaseWaveAnimId);
    } else {
      initCardWaveCanvas();
      initShowcaseWaveCanvas();
    }
  });

  // =========================================================================
  // 10. CATEGORY FILTER BUTTONS (ALL / TECHNICAL / NON-TECH)
  // =========================================================================
  function initEventFilters() {
    const filterBtns = document.querySelectorAll('.event-filter-btn');
    const cards = document.querySelectorAll('.proto-event-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        playUiTone(520, 'sine', 0.08, 0.04);

        cards.forEach((card) => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // =========================================================================
  // 11. ELECTRONICS TRANSITIONS FOR EVENT CARDS (Interactive Hover & Click)
  // =========================================================================
  function initCardElectronics() {
    const cards = document.querySelectorAll('.proto-event-card, .mini-detail-card');

    cards.forEach((card) => {
      // 1. Interactive Cursor Circuit Illumination (track coordinates)
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      // 2. High-Voltage Capacitive Surge & Piezoelectric Relay Click Sound
      card.addEventListener('click', (e) => {
        playRelaySwitchSound();

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create electronic expanding surge ripple
        const ripple = document.createElement('span');
        ripple.className = 'electronic-click-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        card.appendChild(ripple);

        // Voltage surge border spark flash
        card.classList.add('circuit-surge');
        setTimeout(() => {
          card.classList.remove('circuit-surge');
        }, 220);

        setTimeout(() => {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 700);
      });
    });
  }

  // =========================================================================
  // 12. INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    startBootSequence();
    initCardWaveCanvas();
    initShowcaseWaveCanvas();
    initEventFilters();
    initCardElectronics();
  });

})();
