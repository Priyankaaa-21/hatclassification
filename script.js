/**
 * Six Thinking Hats: Scenario 2 - Vanilla JavaScript
 * Handles Theme Toggle, Scroll Progress, Scroll Spy, Mobile Navigation,
 * IntersectionObserver Animations, and Back-to-Top Floating Button.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode with System Preference Fallback)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storageKey = 'six-hats-theme-preference';

  // Determine initial theme
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default to system setting
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  // Initial application
  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Toggle button click listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, currentTheme);
      applyTheme(currentTheme);
    });
  }

  // Listen for system theme changes if user hasn't set explicit override
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(storageKey)) {
        currentTheme = e.matches ? 'dark' : 'light';
        applyTheme(currentTheme);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Back to Top Button Visibility
  // -------------------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar width
    if (progressBar && totalDocHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollY / totalDocHeight) * 100));
      progressBar.style.width = `${progressPercent}%`;
    }

    // Back to top button visibility threshold (300px)
    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial run
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileNav() {
    if (navToggle && primaryNav) {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.classList.add('open');
      primaryNav.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    }
  }

  function closeMobileNav() {
    if (navToggle && primaryNav) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('open');
      primaryNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Scroll Spy Navigation Highlight
  // -------------------------------------------------------------------------
  const sections = [
    { id: 'why-this-matters', navLink: document.querySelector('.nav-link[data-hat="impact"]') },
    { id: 'white-hat', navLink: document.querySelector('.nav-link[data-hat="white"]') },
    { id: 'blue-hat', navLink: document.querySelector('.nav-link[data-hat="blue"]') },
    { id: 'red-hat', navLink: document.querySelector('.nav-link[data-hat="red"]') },
    { id: 'black-hat', navLink: document.querySelector('.nav-link[data-hat="black"]') },
    { id: 'yellow-hat', navLink: document.querySelector('.nav-link[data-hat="yellow"]') },
    { id: 'green-hat', navLink: document.querySelector('.nav-link[data-hat="green"]') },
    { id: 'closing-hat', navLink: document.querySelector('.nav-link[data-hat="conclusion"]') }
  ];

  function updateScrollSpy() {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const navOffset = 110; // offset below sticky header
    const windowBottom = scrollPos + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if user has reached bottom of page (highlight conclusion)
    if (windowBottom >= documentHeight - 60) {
      navLinks.forEach((link) => link.classList.remove('active'));
      const conclusionLink = document.querySelector('.nav-link[data-hat="conclusion"]');
      if (conclusionLink) conclusionLink.classList.add('active');
      return;
    }

    let activeSection = null;

    for (let i = 0; i < sections.length; i++) {
      const sectionEl = document.getElementById(sections[i].id);
      if (!sectionEl) continue;

      const top = sectionEl.offsetTop - navOffset;
      const height = sectionEl.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        activeSection = sections[i];
      }
    }

    navLinks.forEach((link) => link.classList.remove('active'));

    if (activeSection && activeSection.navLink) {
      activeSection.navLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  // Initial run
  updateScrollSpy();

  // -------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (IntersectionObserver with Reduced Motion Support)
  // -------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // If user prefers reduced motion or browser lacks support, reveal all immediately
    revealElements.forEach((el) => el.classList.add('revealed'));
  } else {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once for performance
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // -------------------------------------------------------------------------
  // 6. Interactive Working Application Features Simulation (Scenario 2 Core)
  // -------------------------------------------------------------------------

  // Tab Switcher
  const simTabBtns = document.querySelectorAll('.sim-tab-btn');
  const simPanels = document.querySelectorAll('.sim-panel');

  if (simTabBtns.length > 0 && simPanels.length > 0) {
    simTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab');

        simTabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        simPanels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const activePanel = document.getElementById(targetTabId);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  // --- Feature 1: Dynamic Adaptive Quiz ---
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizSubjectText = document.getElementById('quiz-subject-text');
  const quizDiffText = document.getElementById('quiz-diff-text');
  const quizScoreText = document.getElementById('quiz-score-text');
  const quizQuestionTitle = document.getElementById('quiz-question-title');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const feedbackBadge = document.getElementById('feedback-badge');
  const feedbackExplanation = document.getElementById('feedback-explanation');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizRestartBtn = document.getElementById('quiz-restart-btn');
  const quizAdaptiveNotice = document.getElementById('quiz-adaptive-notice');

  if (quizOptionsContainer && quizQuestionTitle) {
    const quizDatabase = [
      {
        subject: "Operating Systems",
        levels: {
          1: {
            question: "Which component of an Operating System is responsible for CPU scheduling and context switching?",
            options: ["File Management System", "Short-Term / CPU Scheduler", "Device Controller Driver", "Command Line Interpreter"],
            answer: 1,
            points: 10,
            explanation: "The short-term scheduler (CPU scheduler) decides which in-memory ready process is allocated the CPU, triggering context switches."
          },
          2: {
            question: "Which of the following is NOT one of the 4 Coffman conditions required for a Deadlock to occur?",
            options: ["Mutual Exclusion", "Arbitrary Resource Preemption by OS", "Hold and Wait", "Circular Wait"],
            answer: 1,
            points: 20,
            explanation: "Coffman's condition is 'No Preemption' (resources cannot be stolen). Enabling OS preemption actively breaks deadlock conditions."
          },
          3: {
            question: "In a 32-bit virtual memory architecture with 4KB pages and 4-byte Page Table Entries (PTE), how many entries exist per page table?",
            options: ["512 entries", "1024 entries", "2048 entries", "4096 entries"],
            answer: 1,
            points: 30,
            explanation: "4KB = 4096 bytes. With 4 bytes per PTE: 4096 / 4 = 1024 entries (requiring a 10-bit page table index in two-level paging)."
          }
        }
      },
      {
        subject: "Computer Networks",
        levels: {
          1: {
            question: "Which transport protocol guarantees reliable, in-order packet delivery using acknowledgments and sequence numbers?",
            options: ["User Datagram Protocol (UDP)", "Transmission Control Protocol (TCP)", "Internet Protocol (IP)", "Address Resolution Protocol (ARP)"],
            answer: 1,
            points: 10,
            explanation: "TCP establishes connection state, checks checksums, tracks packet order, and handles retransmission for lost segments."
          },
          2: {
            question: "What is the total number of usable host IP addresses in an IPv4 subnet with prefix /28?",
            options: ["14 usable hosts", "16 usable hosts", "30 usable hosts", "32 usable hosts"],
            answer: 0,
            points: 20,
            explanation: "32 - 28 = 4 host bits. 2^4 = 16 total addresses. Excluding the Network Address and Broadcast Address leaves 16 - 2 = 14 usable hosts."
          },
          3: {
            question: "In TCP Reno congestion control, what event immediately triggers Fast Retransmit without waiting for the Retransmission Timeout (RTO)?",
            options: ["1 Duplicate ACK", "3 Duplicate ACKs (Triple Duplicate ACK)", "SYN-ACK dropped", "Window scale reset to zero"],
            answer: 1,
            points: 30,
            explanation: "Receiving 3 duplicate ACKs strongly signals a missing single segment while subsequent packets arrived, invoking Fast Retransmit."
          }
        }
      },
      {
        subject: "Database Management Systems",
        levels: {
          1: {
            question: "Which ACID property guarantees that all transactions complete fully or have zero effect on database state if aborted?",
            options: ["Consistency", "Atomicity", "Isolation", "Durability"],
            answer: 1,
            points: 10,
            explanation: "Atomicity ('all-or-nothing') ensures that if any part of a transaction fails, all preceding database mutations are completely rolled back."
          },
          2: {
            question: "A relational database schema is in Third Normal Form (3NF) if it is in 2NF and contains no:",
            options: ["Candidate keys", "Transitive dependencies between non-prime attributes", "Foreign keys", "Atomic attributes"],
            answer: 1,
            points: 20,
            explanation: "3NF eliminates transitive dependencies (e.g., A -> B and B -> C where neither is a superkey, meaning C transitively depends on A)."
          },
          3: {
            question: "What major advantage does Strict Two-Phase Locking (Strict 2PL) provide over standard Basic 2PL?",
            options: ["Guarantees deadlock-free execution", "Guarantees cascadeless aborts and strict serializability", "Eliminates need for shared read locks", "Allows concurrent write locks on same tuple"],
            answer: 1,
            points: 30,
            explanation: "Strict 2PL holds exclusive locks until end-of-transaction (commit/abort), which prevents reading uncommitted data and cascading aborts."
          }
        }
      },
      {
        subject: "Data Structures & Algorithms",
        levels: {
          1: {
            question: "What is the worst-case search time complexity in a self-balancing Binary Search Tree (AVL or Red-Black Tree)?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            answer: 1,
            points: 10,
            explanation: "Because self-balancing mechanisms guarantee tree height remains bounded by O(log n), search, insert, and delete take O(log n) time."
          },
          2: {
            question: "Which algorithm can detect negative cycles and find single-source shortest paths on graphs with negative edge weights?",
            options: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Prim's Algorithm", "Kruskal's Algorithm"],
            answer: 1,
            points: 20,
            explanation: "Bellman-Ford relaxes all edges |V|-1 times, running in O(V * E). A subsequent relaxation pass detects if negative weight cycles exist."
          },
          3: {
            question: "What is the amortized time complexity per operation in Disjoint Set Union (DSU) using Path Compression and Union by Rank?",
            options: ["O(log n)", "O(α(n)) Inverse Ackermann", "O(1) strict worst-case", "O(sqrt(n))"],
            answer: 1,
            points: 30,
            explanation: "Combining path compression with rank heuristic achieves O(α(n)) amortized time, where α(n) <= 4 for any practical input size."
          }
        }
      },
      {
        subject: "Distributed Systems & System Design",
        levels: {
          1: {
            question: "Which HTTP status code is returned by a REST API when a new resource is successfully created?",
            options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
            answer: 1,
            points: 10,
            explanation: "HTTP 201 Created indicates the request succeeded and produced a new resource on the server, often returning a Location header."
          },
          2: {
            question: "Under the CAP theorem, when a network partition (P) occurs, what trade-off must a distributed system make?",
            options: ["Choose between Consistency (C) and Availability (A)", "Choose between Latency and Security", "Choose between SQL and NoSQL storage", "Choose between Throughput and Encryption"],
            answer: 0,
            points: 20,
            explanation: "During network partitioning, the system can either remain Available (returning stale data) or Consistent (blocking/failing writes)."
          },
          3: {
            question: "In Consistent Hashing rings, why are multiple Virtual Nodes (vnodes) assigned to each physical server?",
            options: ["To prevent cryptographic SHA collisions", "To ensure even key distribution and eliminate load hotspots during node scaling", "To double the network bandwidth throughput", "To remove the need for primary-replica replication"],
            answer: 1,
            points: 30,
            explanation: "Virtual nodes break a physical server's range across many points on the hash ring, smoothing hash distribution and preventing skew."
          }
        }
      }
    ];

    let currentQuestionIdx = 0;
    let currentDifficulty = 2; // Start at Level 2 (Medium)
    let score = 0;
    let isAnswered = false;

    function renderQuestion() {
      isAnswered = false;
      const questionData = quizDatabase[currentQuestionIdx];
      const levelData = questionData.levels[currentDifficulty];

      quizProgressText.textContent = `${currentQuestionIdx + 1} / ${quizDatabase.length}`;
      quizSubjectText.textContent = questionData.subject;
      quizScoreText.textContent = `${score} pts`;

      const diffLabels = { 1: 'Level 1 (Easy)', 2: 'Level 2 (Medium)', 3: 'Level 3 (Hard)' };
      const diffClasses = { 1: 'diff-easy', 2: 'diff-medium', 3: 'diff-hard' };

      quizDiffText.textContent = diffLabels[currentDifficulty];
      quizDiffText.className = `diff-tag ${diffClasses[currentDifficulty]}`;

      quizQuestionTitle.textContent = levelData.question;
      quizOptionsContainer.innerHTML = '';
      quizFeedbackBox.style.display = 'none';
      quizNextBtn.style.display = 'none';
      quizRestartBtn.style.display = 'none';

      levelData.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = `${String.fromCharCode(65 + idx)}) ${optText}`;
        btn.addEventListener('click', () => handleOptionSelection(idx, levelData));
        quizOptionsContainer.appendChild(btn);
      });
    }

    function handleOptionSelection(selectedIdx, levelData) {
      if (isAnswered) return;
      isAnswered = true;

      const buttons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
      buttons.forEach((b) => b.setAttribute('disabled', 'true'));

      const isCorrect = selectedIdx === levelData.answer;
      buttons[levelData.answer].classList.add('correct');

      if (isCorrect) {
        buttons[selectedIdx].classList.add('correct');
        score += levelData.points;
        quizScoreText.textContent = `${score} pts`;

        feedbackBadge.textContent = '✓ Correct Answer!';
        feedbackBadge.style.color = '#15803D';
        feedbackExplanation.textContent = levelData.explanation;
        quizFeedbackBox.style.borderLeftColor = '#16A34A';
        quizFeedbackBox.style.display = 'block';

        if (currentDifficulty < 3) {
          currentDifficulty += 1;
          quizAdaptiveNotice.textContent = `🎯 Mastery detected! Adaptive algorithm increased difficulty to Level ${currentDifficulty} for the next topic.`;
        } else {
          quizAdaptiveNotice.textContent = '🌟 Maximum difficulty reached! Maintaining Level 3 Hard challenges.';
        }
      } else {
        buttons[selectedIdx].classList.add('wrong');
        feedbackBadge.textContent = '✕ Incorrect';
        feedbackBadge.style.color = '#B91C1C';
        feedbackExplanation.textContent = `${levelData.explanation} (Correct: ${String.fromCharCode(65 + levelData.answer)})`;
        quizFeedbackBox.style.borderLeftColor = '#DC2626';
        quizFeedbackBox.style.display = 'block';

        if (currentDifficulty > 1) {
          currentDifficulty -= 1;
          quizAdaptiveNotice.textContent = `⚠️ Review needed. Adaptive algorithm stepped difficulty down to Level ${currentDifficulty} to solidify fundamentals.`;
        } else {
          quizAdaptiveNotice.textContent = '📌 Reinforcing core fundamentals at Level 1.';
        }
      }

      if (currentQuestionIdx < quizDatabase.length - 1) {
        quizNextBtn.style.display = 'inline-flex';
        quizNextBtn.textContent = 'Next Adaptive Question →';
      } else {
        quizNextBtn.style.display = 'inline-flex';
        quizNextBtn.textContent = 'View Final Performance Analysis →';
      }
    }

    quizNextBtn.addEventListener('click', () => {
      if (currentQuestionIdx < quizDatabase.length - 1) {
        currentQuestionIdx += 1;
        renderQuestion();
      } else {
        showFinalQuizSummary();
      }
    });

    function showFinalQuizSummary() {
      quizQuestionTitle.textContent = '🎉 Diagnostic Assessment Completed!';
      quizOptionsContainer.innerHTML = '';
      quizFeedbackBox.style.display = 'none';
      quizNextBtn.style.display = 'none';

      let masteryLevel = 'High Honors / Distinction';
      let badgeColor = '#10B981';
      if (score < 40) {
        masteryLevel = 'Foundational / Requires Structured Revision';
        badgeColor = '#EF4444';
      } else if (score < 80) {
        masteryLevel = 'Proficient / Targeted Practice Recommended';
        badgeColor = '#F59E0B';
      }

      const summaryCard = document.createElement('div');
      summaryCard.style.padding = '18px';
      summaryCard.style.backgroundColor = 'var(--bg-surface)';
      summaryCard.style.borderRadius = 'var(--radius-md)';
      summaryCard.style.border = '1px solid var(--border-light)';
      summaryCard.innerHTML = `
        <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 8px; color: ${badgeColor};">
          Overall Score: ${score} Points (Proficiency: ${masteryLevel})
        </div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
          The adaptive engine dynamically probed 5 university core modules. Your answers were routed through real-time difficulty shifts to construct your unique mastery profile.
        </p>
        <div style="font-size: 0.84rem; color: var(--text-muted);">
          Student PRN: <strong>26070126190</strong> &bull; Scholar: <strong>Sakshi Chourasia</strong>
        </div>
      `;

      quizOptionsContainer.appendChild(summaryCard);
      quizRestartBtn.style.display = 'inline-flex';
      quizAdaptiveNotice.textContent = 'Ready for another diagnostic session.';
    }

    quizRestartBtn.addEventListener('click', () => {
      currentQuestionIdx = 0;
      currentDifficulty = 2;
      score = 0;
      renderQuestion();
      quizAdaptiveNotice.textContent = 'Difficulty adapts dynamically after each answer.';
    });

    // Initialize Quiz
    renderQuestion();
  }

  // --- Feature 2: AI Doubt Chatbot ---
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-text-input');
  const chatContainer = document.getElementById('chat-messages-container');
  const socraticToggle = document.getElementById('socratic-hint-toggle');
  const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

  if (chatForm && chatInput && chatContainer) {
    const aiKnowledgeBase = [
      {
        keywords: ['deadlock', 'coffman', 'circular wait', 'banker'],
        title: "Deadlock in Operating Systems",
        socratic: "Think about this: If 4 cars reach a 4-way intersection simultaneously and each turns right, can anyone move? What single rule could a traffic cop introduce to unlock them?",
        full: "A **Deadlock** occurs when a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process in the same set.\n\n**The 4 Necessary Coffman Conditions:**\n1. **Mutual Exclusion:** At least one non-shareable resource.\n2. **Hold and Wait:** A process holds at least 1 resource while waiting for another.\n3. **No Preemption:** Resources cannot be confiscated forcibly.\n4. **Circular Wait:** P0 waits for P1, P1 waits for P2 ... Pn waits for P0.\n\n**Resolution:** Deadlock prevention (breaking Coffman conditions), Banker's algorithm (avoidance), or detection & recovery."
      },
      {
        keywords: ['tcp', 'udp', 'transport layer', 'difference between tcp and udp'],
        title: "TCP vs UDP Comparison",
        socratic: "Consider phone calls vs sending postcards: In one, you verify the person picked up and heard you; in the other, you send quickly without knowing the exact moment of delivery. Which protocol matches which?",
        full: "**TCP (Transmission Control Protocol) vs UDP (User Datagram Protocol):**\n\n- **TCP:** Connection-oriented (3-way handshake SYN, SYN-ACK, ACK), reliable, in-order packet delivery, error-checking with retransmissions, flow control (sliding window), and congestion control. *Use cases: Web (HTTP/HTTPS), File Transfer (FTP), Email (SMTP).*\n\n- **UDP:** Connectionless, lightweight, low-latency, no packet delivery guarantee or reordering. *Use cases: Live video streaming, DNS queries, VoIP, Online multiplayer gaming.*"
      },
      {
        keywords: ['normalization', 'normal form', '1nf', '2nf', '3nf', 'bcnf', 'database'],
        title: "Database Normalization (1NF, 2NF, 3NF)",
        socratic: "Suppose a single spreadsheet row has 5 phone numbers written inside one cell. What happens if you need to search for one specific area code? How would you split it?",
        full: "**Database Normalization** organizes schema tables to minimize data redundancy and eliminate insertion, update, and deletion anomalies:\n\n- **1NF (First Normal Form):** All attribute values are atomic (no repeating groups or arrays).\n- **2NF:** Must be in 1NF + NO partial dependencies (every non-prime attribute depends on the ENTIRE candidate key, not a subset).\n- **3NF:** Must be in 2NF + NO transitive dependencies (non-prime attributes must not depend on other non-prime attributes: 'X -> Y where Y is non-prime').\n- **BCNF:** A stricter version of 3NF where every determinant (left side of functional dependency) MUST be a superkey."
      },
      {
        keywords: ['binary search', 'time complexity', 'search', 'o(log n)'],
        title: "Binary Search Algorithm",
        socratic: "If you are searching for a word in a 1,000-page dictionary, do you start at page 1 and flip one by one, or do you open directly to the middle? Why?",
        full: "**Binary Search** is a divide-and-conquer algorithm that finds the position of a target value within a **strictly sorted array**.\n\n**Mechanics:**\n1. Compare target with the middle element `mid = low + (high - low) / 2`.\n2. If `target == arr[mid]`, return `mid` index.\n3. If `target < arr[mid]`, narrow search space to left half (`high = mid - 1`).\n4. If `target > arr[mid]`, narrow search space to right half (`low = mid + 1`).\n\n**Time Complexity:** Best: O(1), Average/Worst: O(log n). Space: O(1) iterative."
      },
      {
        keywords: ['virtual memory', 'paging', 'page fault', 'mmu'],
        title: "Virtual Memory & Paging",
        socratic: "If your computer only has 8GB of physical RAM, how is it possible to run a 25GB video rendering process simultaneously with 50 browser tabs?",
        full: "**Virtual Memory** gives processes the illusion of contiguous, dedicated memory larger than physical RAM by mapping virtual addresses to physical memory or secondary disk storage.\n\n**Core Concepts:**\n- **Pages & Frames:** Virtual address space is divided into fixed-size **Pages** (e.g. 4KB); physical memory is divided into **Frames**.\n- **MMU (Memory Management Unit):** Translates virtual address to physical address via the Page Table.\n- **Page Fault:** Triggered when the CPU requests a page not currently resident in RAM, causing the OS kernel to fetch it from disk into a free frame."
      }
    ];

    function appendMessage(sender, text, isHtml = false) {
      const msgWrapper = document.createElement('div');
      msgWrapper.className = `chat-msg msg-${sender}`;

      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      if (isHtml) {
        bubble.innerHTML = text;
      } else {
        bubble.textContent = text;
      }

      msgWrapper.appendChild(bubble);
      chatContainer.appendChild(msgWrapper);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return bubble;
    }

    function processAiReply(userQuery) {
      const lowerQuery = userQuery.toLowerCase();
      const isSocratic = socraticToggle ? socraticToggle.checked : false;

      // Match in KB
      let matched = aiKnowledgeBase.find((kb) =>
        kb.keywords.some((kw) => lowerQuery.includes(kw))
      );

      // Typing indicator
      const typingBubble = appendMessage('ai', 'UniPrep AI is generating answer...');
      typingBubble.style.fontStyle = 'italic';
      typingBubble.style.opacity = '0.7';

      setTimeout(() => {
        typingBubble.style.fontStyle = 'normal';
        typingBubble.style.opacity = '1';

        if (matched) {
          if (isSocratic) {
            typingBubble.innerHTML = `
              <div style="font-weight: 700; margin-bottom: 6px; color: var(--hat-blue);">💡 Socratic Guided Prompt (${matched.title}):</div>
              <div style="margin-bottom: 10px;">${matched.socratic}</div>
              <button class="sim-btn sim-btn-sm sim-btn-outline reveal-full-answer-btn" style="margin-top: 4px;">
                Show Full Textbook Answer
              </button>
              <div class="full-answer-content" style="display: none; margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border-medium);">
                ${formatMarkdown(matched.full)}
              </div>
            `;
            const revealBtn = typingBubble.querySelector('.reveal-full-answer-btn');
            const fullContent = typingBubble.querySelector('.full-answer-content');
            revealBtn.addEventListener('click', () => {
              fullContent.style.display = 'block';
              revealBtn.style.display = 'none';
              chatContainer.scrollTop = chatContainer.scrollHeight;
            });
          } else {
            typingBubble.innerHTML = `
              <div style="font-weight: 700; margin-bottom: 6px; color: var(--hat-blue);">${matched.title}</div>
              <div>${formatMarkdown(matched.full)}</div>
            `;
          }
        } else {
          // Dynamic syllabus answer
          typingBubble.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 6px; color: var(--hat-blue);">Exam Topic: "${escapeHtml(userQuery)}"</div>
            <p style="margin-bottom: 8px;">Here is the targeted syllabus explanation for your university exam preparation:</p>
            <ul style="padding-left: 20px; line-height: 1.6; margin-bottom: 8px;">
              <li><strong>Core Definition:</strong> In university engineering examinations, examiners evaluate exact terminology, architectural constraints, and algorithmic complexity.</li>
              <li><strong>Exam Strategy:</strong> Write clear mathematical expressions, illustrate with a neat architecture block diagram, and outline best-case vs worst-case trade-offs.</li>
              <li><strong>Verified Source:</strong> Consistent with standard academic syllabi (Silberschatz, Tanenbaum, Cormen CLRS).</li>
            </ul>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Tip: Check the 'Concept Simplifier' tab for an ELI5 everyday analogy of this topic!</div>
          `;
        }
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 450);
    }

    function formatMarkdown(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n- /g, '<br>&bull; ')
        .replace(/\n1\. /g, '<br>1. ')
        .replace(/\n2\. /g, '<br>2. ')
        .replace(/\n3\. /g, '<br>3. ')
        .replace(/\n4\. /g, '<br>4. ');
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      appendMessage('user', query);
      chatInput.value = '';
      processAiReply(query);
    });

    quickPromptBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        chatInput.value = query;
        chatForm.dispatchEvent(new Event('submit'));
      });
    });
  }

  // --- Feature 3: Concept Simplifier ---
  const conceptSelect = document.getElementById('concept-select');
  const customConceptInput = document.getElementById('custom-concept-input');
  const simplifyBtn = document.getElementById('simplify-btn');
  const simpAnalogyText = document.getElementById('simp-analogy-text');
  const simpMechanismText = document.getElementById('simp-mechanism-text');
  const simpExamText = document.getElementById('simp-exam-text');

  if (simplifyBtn && simpAnalogyText && simpMechanismText && simpExamText) {
    const conceptLibrary = {
      'virtual-memory': {
        analogy: "Think of your computer as a chef in a small kitchen. The small kitchen counter is RAM (fast, but holds only 2 pans). The huge pantry in the basement is your Hard Drive. Virtual Memory lets the chef prepare a 10-course banquet by swapping only the active ingredients up to the counter when needed.",
        steps: [
          "<strong>1. Virtual Address Generation:</strong> CPU issues a virtual address split into Page Number and Offset.",
          "<strong>2. MMU & Page Table Lookup:</strong> Memory Management Unit queries the hardware Page Table (cached in TLB) to translate the Page to a physical Frame in RAM.",
          "<strong>3. Page Fault Interrupt:</strong> If the Page is not currently in RAM (Valid bit = 0), a Page Fault trap halts execution while OS fetches it from secondary disk storage."
        ],
        exam: "Common Exam Trap: Students often write that Page Fault is an OS crash or error. It is a completely standard, routine hardware interrupt handled transparently by the operating system kernel!"
      },
      'cap-theorem': {
        analogy: "Imagine a group project where students coordinate via text message. If cell service completely drops (Network Partition), you have two choices: either answer questions with yesterday's potentially stale notes (Available) or refuse to answer until signal returns (Consistent). You cannot have both!",
        steps: [
          "<strong>1. Consistency (C):</strong> Every read request receives the most recent write or immediately throws an error.",
          "<strong>2. Availability (A):</strong> Every non-failing node returns a response for every request without guarantee of latest data.",
          "<strong>3. Partition Tolerance (P):</strong> The system continues operating despite lost or delayed packets between servers across network cables."
        ],
        exam: "Key Distinction: Network partitions (P) are an inevitable physical reality of distributed networks. Therefore, architects never 'choose CA'—they choose CP or AP when network partitions occur."
      },
      'backprop': {
        analogy: "Like learning archery blindfolded. Every time you shoot an arrow, a coach yells how many inches too high or too far right you missed. You use that error feedback to adjust your shoulder and elbow angles slightly before the next shot.",
        steps: [
          "<strong>1. Forward Propagation:</strong> Input features pass through layered weights and activation functions to produce an output prediction.",
          "<strong>2. Loss & Error Calculation:</strong> A Loss function (e.g. Mean Squared Error, Cross-Entropy) quantifies how far the prediction is from the ground truth.",
          "<strong>3. Backward Gradient Flow:</strong> Calculus Chain Rule computes partial derivatives (∂Loss/∂Weight) backwards through layers to update weights via gradient descent."
        ],
        exam: "Exam Tip: Be prepared to define the 'Vanishing Gradient Problem'. In deep networks using Sigmoid activations, gradients shrink exponentially during backprop, preventing early layers from training."
      },
      'rsa': {
        analogy: "A heavy mailbox with an open padlock on the outside. Anyone in the city can drop a confidential letter inside and snap the lock shut (Public Key). But only you possess the unique physical key to unlock it and read what is inside (Private Key).",
        steps: [
          "<strong>1. Prime Selection & Modulus:</strong> Pick two large distinct primes p and q; compute modulus n = p * q and Euler's totient φ(n) = (p-1)*(q-1).",
          "<strong>2. Key Pair Formulation:</strong> Choose public exponent e coprime to φ(n), and calculate modular multiplicative inverse d = e⁻¹ mod φ(n).",
          "<strong>3. Encryption / Decryption:</strong> Ciphertext C = Mᵉ mod n. Decryption M = Cᵈ mod n. Factoring n into p and q is computationally infeasible for large numbers."
        ],
        exam: "University Exam Rule: In encryption, the sender encrypts with the receiver's Public Key. In digital signatures, the signer signs with their own Private Key to prove authenticity!"
      },
      'semaphores': {
        analogy: "A parking lot with an electronic sign showing '5 spaces available'. When a car enters, the counter decrements. If the sign hits 0, arriving cars must wait in a queue outside until an exiting car frees up a slot and increments the counter.",
        steps: [
          "<strong>1. Semaphore Initialization:</strong> An integer variable S is initialized to the number of available shared resource instances.",
          "<strong>2. wait() / P() Operation:</strong> Decrements S. If S < 0, the calling process/thread is suspended and put into the semaphore's waiting queue.",
          "<strong>3. signal() / V() Operation:</strong> Increments S. If S <= 0, wakes up and unblocks one waiting process from the queue to proceed into the critical section."
        ],
        exam: "Critical Difference: A Mutex has strict ownership (only the thread that locked it can unlock it). A Counting Semaphore can be signaled and incremented by any thread."
      }
    };

    function explainConcept(conceptKey, customText) {
      if (customText && customText.trim() !== '') {
        const topic = customText.trim();
        simpAnalogyText.textContent = `Analogy for "${topic}": Think of it like a library lending desk with a master catalog. Instead of searching every shelf directly, you consult an organized directory that directs you to the exact aisle and shelf, drastically cutting search time.`;
        simpMechanismText.innerHTML = `
          <p style="margin-bottom: 6px;"><strong>1. Initialization & Input:</strong> The system takes input parameters for ${escapeHtml(topic)} and verifies baseline constraints.</p>
          <p style="margin-bottom: 6px;"><strong>2. Core Execution:</strong> The algorithm or architectural module processes state transitions in orderly sequence.</p>
          <p><strong>3. Output & State Invariant:</strong> The target state is reached while preserving system consistency and invariants.</p>
        `;
        simpExamText.textContent = `University Exam Strategy for "${topic}": Always define the formal mathematical invariant first, sketch a 3-block diagram, and write down the space and time complexity tradeoffs to earn full marks.`;
        return;
      }

      const data = conceptLibrary[conceptKey] || conceptLibrary['virtual-memory'];
      simpAnalogyText.textContent = data.analogy;
      simpMechanismText.innerHTML = data.steps.map((s) => `<p style="margin-bottom: 6px;">${s}</p>`).join('');
      simpExamText.textContent = data.exam;
    }

    simplifyBtn.addEventListener('click', () => {
      const selectedKey = conceptSelect.value;
      const customTopic = customConceptInput.value;
      explainConcept(selectedKey, customTopic);
    });

    // Run initial explanation on load
    explainConcept('virtual-memory', '');
  }

  // --- Feature 4: Weak Area Tracker & Diagnostics Dashboard ---
  const analyticsBarsContainer = document.getElementById('analytics-bars-container');
  const analyticsRecText = document.getElementById('analytics-rec-text');
  const simulateRevBtn = document.getElementById('simulate-revision-btn');
  const resetAnalyticsBtn = document.getElementById('reset-analytics-btn');

  if (analyticsBarsContainer && analyticsRecText) {
    const initialDiagnosticData = [
      { name: "Operating Systems: Process Synchronization & Mutexes", score: 38, status: "Critical Weak Area", tag: "bar-weak" },
      { name: "Computer Networks: CIDR Subnetting & IP Routing", score: 45, status: "Needs Targeted Revision", tag: "bar-weak" },
      { name: "Database Systems: 3NF & BCNF Normalization", score: 72, status: "Good Understanding", tag: "bar-good" },
      { name: "Data Structures: AVL & Red-Black Tree Rotations", score: 85, status: "Mastered", tag: "bar-master" },
      { name: "Computer Architecture: Pipelining & Hazard Control", score: 54, status: "Moderate", tag: "bar-good" }
    ];

    let currentAnalyticsData = JSON.parse(JSON.stringify(initialDiagnosticData));

    function renderAnalytics() {
      analyticsBarsContainer.innerHTML = '';

      currentAnalyticsData.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'analytics-bar-item';

        let barClass = 'bar-weak';
        if (item.score >= 80) barClass = 'bar-master';
        else if (item.score >= 50) barClass = 'bar-good';

        itemEl.innerHTML = `
          <div class="bar-meta">
            <span>${item.name}</span>
            <span>${item.score}% &bull; <small style="font-weight: 700;">${item.status}</small></span>
          </div>
          <div class="bar-track">
            <div class="bar-fill ${barClass}" style="width: ${item.score}%;"></div>
          </div>
        `;
        analyticsBarsContainer.appendChild(itemEl);
      });

      // Find lowest scored module
      const lowest = [...currentAnalyticsData].sort((a, b) => a.score - b.score)[0];
      analyticsRecText.innerHTML = `
        <strong>High Priority Action for Sakshi Chourasia (PRN 26070126190):</strong> 
        The AI diagnostics indicate your lowest mastery topic is <strong>${lowest.name} (${lowest.score}%)</strong>.
        Prioritize 25 minutes of active recall quizzes in the 'Dynamic Adaptive Quiz' tab and review the Socratic explanations before attempting full mock exams.
      `;
    }

    if (simulateRevBtn) {
      simulateRevBtn.addEventListener('click', () => {
        currentAnalyticsData = currentAnalyticsData.map((item) => {
          let boost = item.score < 50 ? 22 : 12;
          let newScore = Math.min(100, item.score + boost);
          let newStatus = newScore >= 80 ? 'Mastered' : (newScore >= 60 ? 'Proficient' : 'Needs Minor Review');
          return { ...item, score: newScore, status: newStatus };
        });
        renderAnalytics();
        simulateRevBtn.textContent = '✓ Revision Boost Applied (+18% Avg)';
        setTimeout(() => {
          simulateRevBtn.textContent = 'Simulate Revision Session';
        }, 2500);
      });
    }

    if (resetAnalyticsBtn) {
      resetAnalyticsBtn.addEventListener('click', () => {
        currentAnalyticsData = JSON.parse(JSON.stringify(initialDiagnosticData));
        renderAnalytics();
      });
    }

    // Initial render
    renderAnalytics();
  }

  // -------------------------------------------------------------------------
  // 12. Real-World Impact Modal Handling
  // -------------------------------------------------------------------------
  const impactBtn = document.getElementById('impact-btn');
  const impactModal = document.getElementById('impact-modal');
  const impactModalClose = document.getElementById('impact-modal-close');
  const impactModalBackdrop = document.getElementById('impact-modal-backdrop');
  const modalSecondaryClose = document.getElementById('modal-secondary-close');
  const modalJumpSection = document.getElementById('modal-jump-section');

  function openImpactModal() {
    if (impactModal) {
      impactModal.classList.add('open');
      impactModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (impactModalClose) impactModalClose.focus();
    }
  }

  function closeImpactModal() {
    if (impactModal) {
      impactModal.classList.remove('open');
      impactModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (impactBtn) impactBtn.focus();
    }
  }

  if (impactBtn) {
    impactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openImpactModal();
    });
  }

  if (impactModalClose) impactModalClose.addEventListener('click', closeImpactModal);
  if (modalSecondaryClose) modalSecondaryClose.addEventListener('click', closeImpactModal);
  if (impactModalBackdrop) impactModalBackdrop.addEventListener('click', closeImpactModal);

  if (modalJumpSection) {
    modalJumpSection.addEventListener('click', () => {
      closeImpactModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && impactModal && impactModal.classList.contains('open')) {
      closeImpactModal();
    }
  });
});

