// ============================================
// PARENT DASHBOARD
// LD Screening + AI Insights + Progress View
// ============================================
import { AppState, navigate } from '../app.js';
import { buildShell } from '../utils/shell.js';
import { showToast } from '../utils/toast.js';
import { getRiskMeta, getStudentById, getTasksForStudent } from '../mockData.js';

const NAV = [
    { section: 'HOME' },
    { id: 'parent', icon: '🏠', label: 'Overview' },
    { id: 'screening', icon: '🧠', label: 'LD Screening' },
    { id: 'progress', icon: '📈', label: 'Progress' },
    { section: 'COMMUNICATION' },
    { id: 'shared', icon: '🤝', label: 'Shared Insights' },
    { id: 'messages', icon: '💬', label: 'Messages' },
];

export function renderParentDashboard(container, activeTab = 'parent') {
    const user = AppState.currentUser;
    const child = getStudentById(user.childId) ?? AppState.students[0];
    const risk = getRiskMeta(child.riskLevel);
    const screening = AppState.ldScreening;
    const insights = AppState.aiInsights;
    const timeline = AppState.progressTimeline;
    const myTasks = getTasksForStudent(child.id);
    const completedTasks = myTasks.filter(t => t.status[child.id] === 'completed').length;

    let pageTitle = 'Parent Dashboard';
    let pageSubtitle = `Monitoring ${child.name}'s learning journey`;
    let bodyHTML = '';

    // ──────────────────────────────────────────
    // TAB: OVERVIEW
    // ──────────────────────────────────────────
    if (activeTab === 'parent') {
        bodyHTML = `
      <!-- WELCOME BANNER -->
      <div class="welcome-banner anim-slide-up" style="margin-bottom:var(--space-8);">
        <div class="welcome-text">
          <h2>Hello, ${user.name.split(' ')[0]}! 👨‍👦</h2>
          <p>${child.name} is on a <strong>${child.streak}-day streak</strong> and making steady progress. Review today's AI insights below.</p>
          <div style="margin-top:var(--space-5);display:flex;gap:var(--space-3);">
            <button class="btn btn-primary" id="viewScreeningBtn">🧠 LD Report</button>
            <button class="btn btn-ghost" style="border-color:rgba(255,255,255,0.3);color:#fff;" id="viewProgressBtn">📈 View Progress</button>
          </div>
        </div>
        <div class="welcome-emoji">👨‍👦</div>
      </div>

      <!-- STATS ROW -->
      <div class="grid grid-4" style="margin-bottom:var(--space-8);">
        <div class="stat-card anim-slide-up" style="animation-delay:0.1s;">
          <div class="stat-icon" style="background:#D1FAE5;">📈</div>
          <div class="stat-value">${child.progress}%</div>
          <div class="stat-label">Overall Progress</div>
          <div class="stat-trend trend-up">↑ ${insights.weeklyChange} this week</div>
        </div>
        <div class="stat-card anim-slide-up" style="animation-delay:0.15s;">
          <div class="stat-icon" style="background:#FFF0E6;">🔥</div>
          <div class="stat-value">${child.streak}</div>
          <div class="stat-label">Day Streak</div>
          <div class="stat-trend trend-up">↑ Keep it up!</div>
        </div>
        <div class="stat-card anim-slide-up" style="animation-delay:0.2s;">
          <div class="stat-icon" style="background:#DBEAFE;">✅</div>
          <div class="stat-value">${completedTasks}/${myTasks.length}</div>
          <div class="stat-label">Tasks Done</div>
          <div class="stat-trend">This term</div>
        </div>
        <div class="stat-card anim-slide-up" style="animation-delay:0.25s;">
          <div class="stat-icon" style="background:#EDE9FE;">🧠</div>
          <div class="stat-value">${screening.confidence}%</div>
          <div class="stat-label">AI Confidence</div>
          <div class="stat-trend">Screening score</div>
        </div>
      </div>

      <!-- AI INSIGHTS + CHILD PROFILE -->
      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:var(--space-6);margin-bottom:var(--space-8);">
        <!-- AI Insights Card -->
        <div class="card anim-slide-up" style="animation-delay:0.3s;">
          <div class="card-header">
            <span style="font-weight:700;color:var(--navy-900);">🤖 AI Learning Insights</span>
            <span class="badge badge-success">Updated today</span>
          </div>
          <div style="padding:var(--space-5);">
            <p style="font-size:var(--text-sm);color:var(--slate-600);line-height:1.6;margin-bottom:var(--space-4);">${insights.headline}</p>
            <div style="display:flex;flex-direction:column;gap:var(--space-3);">
              ${insights.highlights.map(h => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);background:var(--slate-50);border-radius:var(--radius-md);">
                  <span style="font-size:var(--text-xs);color:var(--slate-500);">${h.label}</span>
                  <span class="badge ${h.badge}">${h.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Child Profile Card -->
        <div class="card anim-slide-up" style="animation-delay:0.35s;">
          <div class="card-header">
            <span style="font-weight:700;color:var(--navy-900);">👤 ${child.name}</span>
            <span class="badge ${risk.badge}">${child.riskLevel} risk</span>
          </div>
          <div style="padding:var(--space-5);">
            <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-5);">
              <div style="width:64px;height:64px;border-radius:50%;background:var(--navy-100);display:flex;align-items:center;justify-content:center;font-size:32px;">${child.avatar}</div>
              <div>
                <div style="font-weight:700;color:var(--navy-900);">${child.name}</div>
                <div style="font-size:var(--text-xs);color:var(--slate-500);">${child.grade} · Age ${child.age}</div>
              </div>
            </div>
            <div style="margin-bottom:var(--space-4);">
              <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);">
                <span style="font-size:var(--text-xs);color:var(--slate-500);">Overall Progress</span>
                <span style="font-size:var(--text-xs);font-weight:700;color:var(--navy-900);">${child.progress}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width:${child.progress}%;background:${risk.color};"></div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" style="width:100%;" id="viewScreeningBtn2">📋 View Full Report</button>
          </div>
        </div>
      </div>

      <!-- RECENT TASKS -->
      <div class="card anim-slide-up" style="animation-delay:0.45s;">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">📋 Recent Assignments</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-3);">
          ${myTasks.slice(0, 3).map(t => {
            const done = t.status[child.id] === 'completed';
            return `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);background:var(--slate-50);border-radius:var(--radius-md);border-left:4px solid ${done ? 'var(--success)' : 'var(--warning)'};">
                <div>
                  <div style="font-size:var(--text-sm);font-weight:700;color:var(--navy-900);">${t.title}</div>
                  <div style="font-size:var(--text-xs);color:var(--slate-500);">Due ${t.dueDate}</div>
                </div>
                <div style="display:flex;gap:var(--space-2);align-items:center;">
                  <span class="badge badge-info">${t.type}</span>
                  <span class="badge ${done ? 'badge-success' : 'badge-warning'}">${done ? 'done' : 'pending'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // ──────────────────────────────────────────
    // TAB: LD SCREENING
    // ──────────────────────────────────────────
    } else if (activeTab === 'screening') {
        pageTitle = 'LD Screening Report';
        pageSubtitle = `AI-assisted assessment for ${child.name}`;

        const statusColor = screening.overallStatus === 'review' ? 'var(--warning)' : 'var(--success)';
        const statusBadge = screening.overallStatus === 'review' ? 'badge-warning' : 'badge-success';

        bodyHTML = `
      <!-- SCREENING HEADER CARD -->
      <div class="card anim-slide-up" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">🧠 AI Screening Summary</span>
          <span class="badge ${statusBadge}">${screening.overallStatus.toUpperCase()}</span>
        </div>
        <div style="padding:var(--space-5);">
          <div style="display:flex;align-items:center;gap:var(--space-5);margin-bottom:var(--space-5);">
            <div style="text-align:center;padding:var(--space-4) var(--space-6);background:var(--slate-50);border-radius:var(--radius-lg);border:2px solid ${statusColor};">
              <div style="font-size:var(--text-3xl);font-weight:800;color:${statusColor};">${screening.confidence}%</div>
              <div style="font-size:var(--text-xs);color:var(--slate-500);margin-top:4px;">AI Confidence</div>
            </div>
            <div style="flex:1;">
              <p style="font-size:var(--text-sm);color:var(--slate-600);line-height:1.6;margin-bottom:var(--space-3);">${screening.summary}</p>
              <div style="font-size:var(--text-xs);color:var(--slate-400);">Last assessed: ${screening.lastAssessed}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- DOMAIN SCORES -->
      <div class="card anim-slide-up" style="animation-delay:0.1s;margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">📊 Domain-by-Domain Breakdown</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-5);">
          ${screening.domains.map(d => {
            const domainBadge = d.flag === 'high' ? 'badge-danger' : d.flag === 'medium' ? 'badge-warning' : 'badge-success';
            const domainColor = d.flag === 'high' ? 'var(--danger)' : d.flag === 'medium' ? 'var(--warning)' : 'var(--success)';
            return `
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2);">
                  <div style="display:flex;align-items:center;gap:var(--space-3);">
                    <span style="font-size:20px;">${d.icon}</span>
                    <span style="font-size:var(--text-sm);font-weight:700;color:var(--navy-900);">${d.name}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:var(--space-3);">
                    <span style="font-size:var(--text-sm);font-weight:800;color:${domainColor};">${d.score}</span>
                    <span class="badge ${domainBadge}">${d.flag}</span>
                  </div>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${d.score}%;background:${domainColor};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="padding:0 var(--space-5) var(--space-5);">
          <div class="chart-canvas-wrap" style="height:220px;">
            <canvas id="domainRadarChart"></canvas>
          </div>
        </div>
      </div>

      <!-- RECOMMENDATIONS -->
      <div class="card anim-slide-up" style="animation-delay:0.2s;">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">✅ Recommendations</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-3);">
          ${screening.recommendations.map((rec, i) => `
            <div style="display:flex;align-items:flex-start;gap:var(--space-4);padding:var(--space-4);background:var(--slate-50);border-radius:var(--radius-md);">
              <div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);font-weight:800;color:#fff;flex-shrink:0;">${i + 1}</div>
              <p style="font-size:var(--text-sm);color:var(--slate-700);line-height:1.5;margin:0;">${rec}</p>
            </div>
          `).join('')}
          <button class="btn btn-primary btn-sm" style="margin-top:var(--space-2);align-self:flex-start;" id="shareReportBtn">🤝 Share with Teacher</button>
        </div>
      </div>
    `;

    // ──────────────────────────────────────────
    // TAB: PROGRESS
    // ──────────────────────────────────────────
    } else if (activeTab === 'progress') {
        pageTitle = 'Progress Timeline';
        pageSubtitle = `${child.name}'s learning trajectory over time`;
        bodyHTML = `
      <!-- TREND CHART -->
      <div class="card anim-slide-up" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">📈 Progress Over Time</span>
          <span class="badge badge-success">↑ ${insights.weeklyChange} this week</span>
        </div>
        <div class="chart-canvas-wrap" style="padding:var(--space-4);">
          <canvas id="progressLineChart"></canvas>
        </div>
      </div>

      <!-- TASK PROGRESS -->
      <div class="card anim-slide-up" style="animation-delay:0.1s;margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">📋 Assignment Progress</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-4);">
          ${myTasks.map(t => {
            const done = t.status[child.id] === 'completed';
            return `
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2);">
                  <span style="font-size:var(--text-sm);font-weight:700;color:var(--navy-900);">${t.title}</span>
                  <div style="display:flex;gap:var(--space-2);">
                    <span class="badge badge-info">${t.type}</span>
                    <span class="badge ${done ? 'badge-success' : 'badge-warning'}">${done ? 'done' : 'pending'}</span>
                  </div>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${done ? 100 : 0}%;background:${done ? 'var(--success)' : 'var(--slate-200)'};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- MONTHLY SUMMARY STATS -->
      <div class="grid grid-3 anim-slide-up" style="animation-delay:0.2s;">
        <div class="stat-card">
          <div class="stat-icon" style="background:#D1FAE5;">🎯</div>
          <div class="stat-value">${timeline.overall[timeline.overall.length - 1]}%</div>
          <div class="stat-label">Current Overall</div>
          <div class="stat-trend trend-up">↑ from ${timeline.overall[0]}% in Jan</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#DBEAFE;">📖</div>
          <div class="stat-value">${timeline.reading[timeline.reading.length - 1]}%</div>
          <div class="stat-label">Reading Score</div>
          <div class="stat-trend trend-up">↑ Improving</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#EDE9FE;">🔢</div>
          <div class="stat-value">${timeline.math[timeline.math.length - 1]}%</div>
          <div class="stat-label">Math Score</div>
          <div class="stat-trend trend-up">↑ Strong</div>
        </div>
      </div>
    `;

    // ──────────────────────────────────────────
    // TAB: SHARED INSIGHTS
    // ──────────────────────────────────────────
    } else if (activeTab === 'shared') {
        pageTitle = 'Shared Insights';
        pageSubtitle = 'Notes and observations shared by the teacher';
        bodyHTML = `
      <div class="card anim-slide-up" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">🤝 Teacher Notes</span>
          <span class="badge badge-info">2 new</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-4);">
          ${[
            { from: 'Ms. Sarah Chen', emoji: '👩‍🏫', date: '2026-06-18', note: `${child.name} is showing improvement in math reasoning. Keep encouraging the daily practice.`, type: 'badge-success', label: 'Positive' },
            { from: 'Ms. Sarah Chen', emoji: '👩‍🏫', date: '2026-06-14', note: 'Please review the phonics worksheet sent home last Thursday. Consistent daily reading aloud helps significantly.', type: 'badge-warning', label: 'Action Needed' },
          ].map(item => `
            <div style="padding:var(--space-4);background:var(--slate-50);border-radius:var(--radius-lg);border-left:4px solid var(--accent);">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);">
                <div style="display:flex;align-items:center;gap:var(--space-2);">
                  <span style="font-size:20px;">${item.emoji}</span>
                  <span style="font-size:var(--text-xs);font-weight:700;color:var(--navy-900);">${item.from}</span>
                </div>
                <div style="display:flex;gap:var(--space-2);align-items:center;">
                  <span class="badge ${item.type}">${item.label}</span>
                  <span style="font-size:var(--text-xs);color:var(--slate-400);">${item.date}</span>
                </div>
              </div>
              <p style="font-size:var(--text-sm);color:var(--slate-600);line-height:1.5;margin:0;">${item.note}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // ──────────────────────────────────────────
    // TAB: MESSAGES
    // ──────────────────────────────────────────
    } else if (activeTab === 'messages') {
        pageTitle = 'Messages';
        pageSubtitle = 'Direct communication with the teacher';
        bodyHTML = `
      <div class="card anim-slide-up" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">💬 Conversation with Ms. Sarah Chen</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-4);max-height:360px;overflow-y:auto;" id="messageThread">
          <div style="align-self:flex-start;max-width:75%;">
            <div style="background:var(--slate-100);padding:var(--space-3) var(--space-4);border-radius:0 var(--radius-lg) var(--radius-lg) var(--radius-lg);font-size:var(--text-sm);color:var(--navy-900);line-height:1.5;">
              Hi David! Just wanted to update you — ${child.name} did great in today's phonics session. Keep up the bedtime reading!
            </div>
            <div style="font-size:10px;color:var(--slate-400);margin-top:4px;padding-left:4px;">Ms. Chen · Jun 17</div>
          </div>
          <div style="align-self:flex-end;max-width:75%;">
            <div style="background:var(--accent);padding:var(--space-3) var(--space-4);border-radius:var(--radius-lg) 0 var(--radius-lg) var(--radius-lg);font-size:var(--text-sm);color:#fff;line-height:1.5;">
              Thank you! We have been reading every night. Is there anything specific we should focus on this week?
            </div>
            <div style="font-size:10px;color:var(--slate-400);margin-top:4px;text-align:right;padding-right:4px;">You · Jun 17</div>
          </div>
          <div style="align-self:flex-start;max-width:75%;">
            <div style="background:var(--slate-100);padding:var(--space-3) var(--space-4);border-radius:0 var(--radius-lg) var(--radius-lg) var(--radius-lg);font-size:var(--text-sm);color:var(--navy-900);line-height:1.5;">
              Focus on blending consonant pairs — ch, sh, th. I have uploaded a worksheet to the app under Tasks!
            </div>
            <div style="font-size:10px;color:var(--slate-400);margin-top:4px;padding-left:4px;">Ms. Chen · Jun 18</div>
          </div>
        </div>
        <div style="padding:var(--space-4) var(--space-5);border-top:1px solid var(--slate-100);display:flex;gap:var(--space-3);">
          <input class="form-input" id="msgInput" placeholder="Write a message…" style="flex:1;" />
          <button class="btn btn-primary btn-sm" id="sendMsgBtn">Send ✉️</button>
        </div>
      </div>
    `;
    }

    buildShell(container, {
        role: 'parent',
        user,
        navItems: NAV,
        activeItem: activeTab,
        pageTitle,
        pageSubtitle,
        bodyHTML,
    });

    // Init charts and events after DOM is ready
    if (activeTab === 'screening') initDomainChart(screening);
    if (activeTab === 'progress') initProgressChart(timeline);
    setupParentEvents();
}

// ──────────────────────────────────────────
// CHART: Domain Radar (Screening tab)
// ──────────────────────────────────────────
function initDomainChart(screening) {
    const ctx = document.getElementById('domainRadarChart');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: screening.domains.map(d => d.name),
            datasets: [{
                label: 'Score',
                data: screening.domains.map(d => d.score),
                backgroundColor: 'rgba(59,130,246,0.15)',
                borderColor: 'rgba(59,130,246,0.8)',
                borderWidth: 2,
                pointBackgroundColor: screening.domains.map(d =>
                    d.flag === 'high' ? 'rgba(239,68,68,0.9)' :
                    d.flag === 'medium' ? 'rgba(245,158,11,0.9)' :
                    'rgba(16,185,129,0.9)'
                ),
                pointRadius: 5,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0, max: 100,
                    ticks: { stepSize: 25, font: { size: 10, family: 'Plus Jakarta Sans' }, color: '#94A3B8' },
                    grid: { color: 'rgba(0,0,0,0.06)' },
                    pointLabels: { font: { size: 11, family: 'Plus Jakarta Sans', weight: '600' }, color: '#374359' },
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0A1628',
                    callbacks: { label: ctx => ` Score: ${ctx.raw}` },
                },
            },
        },
    });
}

// ──────────────────────────────────────────
// CHART: Progress Line (Progress tab)
// ──────────────────────────────────────────
function initProgressChart(timeline) {
    const ctx = document.getElementById('progressLineChart');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeline.labels,
            datasets: [
                {
                    label: 'Overall',
                    data: timeline.overall,
                    borderColor: 'rgba(59,130,246,0.9)',
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    borderWidth: 2.5,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(59,130,246,0.9)',
                },
                {
                    label: 'Reading',
                    data: timeline.reading,
                    borderColor: 'rgba(16,185,129,0.8)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(16,185,129,0.8)',
                },
                {
                    label: 'Math',
                    data: timeline.math,
                    borderColor: 'rgba(245,158,11,0.8)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(245,158,11,0.8)',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#374359', boxWidth: 12 },
                },
                tooltip: {
                    backgroundColor: '#0A1628',
                    callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` },
                },
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 11 } },
                },
                y: {
                    min: 0, max: 100,
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { callback: v => v + '%', color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 11 } },
                },
            },
        },
    });
}

// ──────────────────────────────────────────
// EVENT HANDLERS
// ──────────────────────────────────────────
function setupParentEvents() {
    document.getElementById('viewScreeningBtn')?.addEventListener('click', () => navigate('screening'));
    document.getElementById('viewScreeningBtn2')?.addEventListener('click', () => navigate('screening'));
    document.getElementById('viewProgressBtn')?.addEventListener('click', () => navigate('progress'));

    document.getElementById('shareReportBtn')?.addEventListener('click', () => {
        showToast('Report Shared 🤝', 'LD screening summary sent to Ms. Sarah Chen.', 'success');
    });

    const sendBtn = document.getElementById('sendMsgBtn');
    const msgInput = document.getElementById('msgInput');
    sendBtn?.addEventListener('click', () => {
        const text = msgInput?.value.trim();
        if (!text) return;

        const thread = document.getElementById('messageThread');
        if (thread) {
            const bubble = document.createElement('div');
            bubble.style.cssText = 'align-self:flex-end;max-width:75%;';
            bubble.innerHTML = `
              <div style="background:var(--accent);padding:var(--space-3) var(--space-4);border-radius:var(--radius-lg) 0 var(--radius-lg) var(--radius-lg);font-size:var(--text-sm);color:#fff;line-height:1.5;">${text}</div>
              <div style="font-size:10px;color:var(--slate-400);margin-top:4px;text-align:right;padding-right:4px;">You · Just now</div>
            `;
            thread.appendChild(bubble);
            thread.scrollTop = thread.scrollHeight;
        }
        if (msgInput) msgInput.value = '';
        showToast('Message Sent ✉️', 'Ms. Sarah Chen will be notified.', 'success');
    });

    msgInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('sendMsgBtn')?.click();
    });
}