// ============================================
// TEACHER DASHBOARD
// Task Assignment + Progress Tracking
// ============================================
import { AppState, navigate } from '../app.js';
import { buildShell } from '../utils/shell.js';
import { showToast } from '../utils/toast.js';

export function renderTeacherDashboard(container, activeTab = 'teacher') {
  // นำ NAV มาสร้างไว้ข้างในนี้แทน
  const NAV = [
      { section: 'CLASSROOM' },
      { id: 'teacher', icon: '🏠', label: 'Overview' },
      { id: 'tasks', icon: '📋', label: 'Task Manager', badge: AppState.tasks.length },
      { id: 'shared', icon: '🤝', label: 'Shared Insights' },
      { section: 'STUDENTS' },
      { id: 'my-class', icon: '👥', label: 'My Class' },
      { id: 'reports', icon: '📊', label: 'Reports' },
      { section: 'TOOLS' },
      { id: 'library', icon: '📚', label: 'Resource Library' },
  ];

    const user = AppState.currentUser;
    const tasks = AppState.tasks;
    const students = AppState.students;

    const completedTasks = tasks.filter(t =>
        Object.values(t.status).every(s => s === 'completed')
    ).length;
    const pendingTotal = tasks.reduce((acc, t) =>
        acc + Object.values(t.status).filter(s => s === 'pending').length, 0
    );

    let pageTitle = 'Teacher Dashboard';
    let pageSubtitle = 'Manage tasks and monitor your students';
    let bodyHTML = '';

    if (activeTab === 'teacher') {
        bodyHTML = `
      <!-- WELCOME BANNER -->
      <div class="welcome-banner anim-slide-up">
        <div class="welcome-text">
          <h2>Good Morning, ${user.name.split(' ').pop()}! 👩‍🏫</h2>
          <p>You have <strong>${pendingTotal} pending completions</strong> across your class. Assign new materials or review student progress below.</p>
          <div style="margin-top:var(--space-5);display:flex;gap:var(--space-3);">
            <button class="btn btn-primary" id="newTaskBtn">➕ Assign Task</button>
            <button class="btn btn-ghost" style="border-color:rgba(255,255,255,0.3);color:#fff;" id="viewSharedBtn">🤝 Shared Insights</button>
          </div>
        </div>
        <div class="welcome-emoji">📋</div>
      </div>

      <!-- STATS -->
      <div class="grid grid-4" style="margin-bottom:var(--space-8);">
        <div class="stat-card anim-slide-up" style="animation-delay:0.1s">
          <div class="stat-icon" style="background:#D1FAE5;">👥</div>
          <div class="stat-value">${students.length}</div>
          <div class="stat-label">Total Students</div>
          <div class="stat-trend trend-up">↑ 2 new this term</div>
        </div>
        <div class="stat-card anim-slide-up" style="animation-delay:0.15s">
          <div class="stat-icon" style="background:#FFF0E6;">📋</div>
          <div class="stat-value">${tasks.length}</div>
          <div class="stat-label">Active Tasks</div>
          <div class="stat-trend">This week</div>
        </div>
        <div class="stat-card anim-slide-up" style="animation-delay:0.2s">
          <div class="stat-icon" style="background:#DBEAFE;">✅</div>
          <div class="stat-value">${completedTasks}</div>
          <div class="stat-label">Fully Completed</div>
          <div class="stat-trend trend-up">↑ Good progress!</div>
        </div>
        <div class="stat-card anim-slide-up" style="animation-delay:0.25s">
          <div class="stat-icon" style="background:#FEE2E2;">⚠️</div>
          <div class="stat-value">${students.filter(s => s.riskLevel === 'high').length}</div>
          <div class="stat-label">At-Risk Students</div>
          <div class="stat-trend trend-down">Needs attention</div>
        </div>
      </div>

      <!-- CLASS PERFORMANCE CHART -->
      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:var(--space-6);margin-bottom:var(--space-8);">
        <div class="card anim-slide-up" style="animation-delay:0.35s">
          <div class="card-header">
            <span style="font-weight:700;color:var(--navy-900);">📊 Class Performance Overview</span>
          </div>
          <div class="chart-canvas-wrap">
            <canvas id="classPerformanceChart"></canvas>
          </div>
        </div>

        <div class="card anim-slide-up" style="animation-delay:0.4s">
          <div class="card-header">
            <span style="font-weight:700;color:var(--navy-900);">👥 Student Overview</span>
          </div>
          <div style="padding:var(--space-4) var(--space-5);display:flex;flex-direction:column;gap:var(--space-3);">
            ${students.map(s => `
              <div style="display:flex;align-items:center;gap:var(--space-3);">
                <div class="avatar avatar-sm" style="background:var(--navy-100);font-size:16px;">${s.avatar}</div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:var(--text-xs);font-weight:700;color:var(--navy-900);">${s.name}</div>
                  <div class="progress-track" style="height:6px;margin-top:4px;">
                    <div class="progress-fill" style="width:${s.progress}%;background:${s.riskLevel === 'high' ? 'var(--danger)' : s.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)'};"></div>
                  </div>
                </div>
                <div style="font-size:var(--text-xs);font-weight:700;color:var(--navy-800);white-space:nowrap;">${s.progress}%</div>
                <span class="badge ${s.riskLevel === 'high' ? 'badge-danger' : s.riskLevel === 'medium' ? 'badge-warning' : 'badge-success'}">${s.riskLevel}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    } else if (activeTab === 'tasks') {
        pageTitle = 'Task Manager';
        pageSubtitle = 'Create, assign and track learning activities';
        bodyHTML = `
      <!-- TASK TABLE -->
      <div class="card anim-slide-up" style="animation-delay:0.1s;margin-bottom:var(--space-8);">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:var(--space-3);">
            <span class="section-title-dot"></span>
            <span style="font-size:var(--text-base);font-weight:700;color:var(--navy-900);">📚 Task Assignment Board</span>
          </div>
          <button class="btn btn-primary btn-sm" id="newTaskBtn2">➕ New Task</button>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table" id="taskTable">
            <thead>
              <tr>
                <th style="width:40%">Task / Material</th>
                <th>Type</th>
                <th>Level</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Completion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="taskTableBody">
              ${tasks.map(t => renderTaskRow(t, students)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    } else if (activeTab === 'my-class') {
        pageTitle = 'My Class';
        pageSubtitle = 'Full student roster and clinical/academic risk levels';
        bodyHTML = `
      <div class="card anim-slide-up" style="animation-delay:0.1s; margin-bottom:var(--space-8);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">👥 Student Overview & Risk Profile</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-4);">
          ${students.map(s => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-4);background:var(--slate-50);border-radius:var(--radius-lg);border-left:4px solid ${s.riskLevel === 'high' ? 'var(--danger)' : s.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)'};">
              <div style="display:flex;align-items:center;gap:var(--space-4);">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--navy-100);display:flex;align-items:center;justify-content:center;font-size:24px;">${s.avatar}</div>
                <div>
                  <div style="font-weight:700;color:var(--navy-900);font-size:var(--text-sm);">${s.name}</div>
                  <div style="font-size:var(--text-xs);color:var(--slate-500);">${s.grade} · Age ${s.age}</div>
                </div>
              </div>
              <div style="display:flex;gap:var(--space-6);align-items:center;">
                <div style="text-align:right;">
                  <div style="font-size:var(--text-xs);color:var(--slate-500);">Overall Progress</div>
                  <div style="font-weight:700;color:var(--navy-900);">${s.progress}%</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:var(--text-xs);color:var(--slate-500);">Streak</div>
                  <div style="font-weight:700;color:var(--navy-900);">${s.streak} days</div>
                </div>
                <span class="badge ${s.riskLevel === 'high' ? 'badge-danger' : s.riskLevel === 'medium' ? 'badge-warning' : 'badge-success'}">${s.riskLevel} Risk</span>
                <button class="btn btn-ghost btn-sm view-insights-btn">🤝 View Shared Insights</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    } else if (activeTab === 'reports') {
        pageTitle = 'Class Performance Reports';
        pageSubtitle = 'Academic progress and development metrics analysis';
        bodyHTML = `
      <div class="card anim-slide-up" style="animation-delay:0.1s; margin-bottom:var(--space-8);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">📊 Class Performance & Insights</span>
        </div>
        <div class="chart-canvas-wrap" style="height:350px;">
          <canvas id="classPerformanceChart"></canvas>
        </div>
      </div>
    `;
    } else if (activeTab === 'library') {
        pageTitle = 'Resource Library';
        pageSubtitle = 'Access teaching materials, worksheets, and therapy guides';
        bodyHTML = `
      <div class="grid grid-3 anim-slide-up" style="animation-delay:0.1s;">
        <div class="card" style="padding:var(--space-5);">
          <div style="font-size:32px;margin-bottom:var(--space-3);">📖</div>
          <div style="font-weight:700;color:var(--navy-900);">Phonics Blends Workbook</div>
          <div style="font-size:var(--text-xs);color:var(--slate-500);margin-top:2px;">Reading module targeting phonological awareness.</div>
          <button class="btn btn-primary btn-sm btn-full lib-preview-btn" style="margin-top:var(--space-4);" data-name="Phonics Blends Workbook">Preview Workbook</button>
        </div>
        <div class="card" style="padding:var(--space-5);">
          <div style="font-size:32px;margin-bottom:var(--space-3);">🔢</div>
          <div style="font-weight:700;color:var(--navy-900);">Number Sense Problems</div>
          <div style="font-size:var(--text-xs);color:var(--slate-500);margin-top:2px;">Math assignments with gamified reward loop.</div>
          <button class="btn btn-primary btn-sm btn-full lib-preview-btn" style="margin-top:var(--space-4);" data-name="Number Sense Problems">Preview Math Problems</button>
        </div>
        <div class="card" style="padding:var(--space-5);">
          <div style="font-size:32px;margin-bottom:var(--space-3);">🧠</div>
          <div style="font-weight:700;color:var(--navy-900);">Attention Training Guides</div>
          <div style="font-size:var(--text-xs);color:var(--slate-500);margin-top:2px;">Focus and sensory training activities.</div>
          <button class="btn btn-primary btn-sm btn-full lib-preview-btn" style="margin-top:var(--space-4);" data-name="Attention Training Guides">Preview Exercises</button>
        </div>
      </div>
    `;
    }

    // Include the assign modal container in bodyHTML so modal functions continue to work
    bodyHTML += `
    <!-- ASSIGN MODAL -->
    <div class="modal-overlay hidden" id="assignModal">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <div class="modal-title">➕ Assign New Task</div>
            <div class="modal-sub">Select students and reading material</div>
          </div>
          <button class="modal-close" id="assignClose">✕</button>
        </div>
        <div class="modal-body">
          <div class="assign-form">
            <div class="form-group">
              <label class="form-label">Task Title</label>
              <input class="form-input" id="newTaskTitle" type="text" placeholder="e.g. Phonics Chapter 4 – Blends" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
              <div class="form-group">
                <label class="form-label">Subject Type</label>
                <select class="form-input" id="newTaskType">
                  <option>📖 Reading</option>
                  <option>🔢 Math</option>
                  <option>🧠 Therapy</option>
                  <option>✏️ Writing</option>
                  <option>🎨 Creative</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Due Date</label>
                <input class="form-input" id="newTaskDue" type="date" min="${new Date().toISOString().split('T')[0]}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Assign to Students</label>
              <div class="student-checkbox-group">
                ${students.map(s => `
                  <label class="student-checkbox">
                    <input type="checkbox" value="${s.id}" />
                    <span class="student-checkbox-name">${s.avatar} ${s.name} – ${s.grade}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost btn-sm" id="assignCancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="assignConfirm">✅ Assign Task</button>
        </div>
      </div>
    </div>
  `;

    buildShell(container, {
        role: 'teacher',
        user,
        navItems: NAV,
        activeItem: activeTab,
        pageTitle,
        pageSubtitle,
        bodyHTML,
    });

    initClassChart();
    setupTeacherEvents();

    // Additional dynamic event listeners
    container.querySelectorAll('.view-insights-btn').forEach(btn => {
        btn.addEventListener('click', () => navigate('shared'));
    });

    container.querySelectorAll('.lib-preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Assigned Material', `Active resource "${btn.dataset.name}" loaded successfully.`, 'info');
        });
    });
}

function renderTaskRow(t, students) {
    const assignedStudents = t.assigned.map(id => students.find(s => s.id === id)).filter(Boolean);
    const doneCount = Object.values(t.status).filter(s => s === 'completed').length;
    const totalCount = t.assigned.length;
    const pct = Math.round((doneCount / totalCount) * 100);

    return `
    <tr>
      <td>
        <div style="font-weight:600;color:var(--navy-900);">${t.title}</div>
      </td>
      <td><span class="badge badge-info">${t.type}</span></td>
      <td><span style="font-size:var(--text-xs);color:var(--slate-600);">${t.level}</span></td>
      <td>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${assignedStudents.map(s => `<span class="student-pill">${s.avatar} ${s.name.split(' ')[0]}</span>`).join('')}
        </div>
      </td>
      <td style="font-size:var(--text-xs);color:var(--slate-600);">${t.dueDate}</td>
      <td>
        <div style="min-width:120px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:10px;color:var(--slate-500);">${doneCount}/${totalCount} done</span>
            <span style="font-size:10px;font-weight:700;color:${pct === 100 ? 'var(--success)' : pct > 50 ? 'var(--warning)' : 'var(--danger)'};">${pct}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${pct}%;background:${pct === 100 ? 'var(--success)' : pct > 50 ? 'var(--warning)' : 'var(--danger)'}"></div>
          </div>
        </div>
      </td>
      <td>
        <div style="display:flex;gap:var(--space-2);">
          <button class="assign-btn view-task-btn" data-id="${t.id}" style="background:var(--slate-100);color:var(--slate-700);">👁 View</button>
          <button class="assign-btn edit-task-btn" data-id="${t.id}">✏️ Edit</button>
        </div>
      </td>
    </tr>
  `;
}

function initClassChart() {
    const ctx = document.getElementById('classPerformanceChart');
    if (!ctx) return;

    const students = AppState.students;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: students.map(s => s.name.split(' ')[0]),
            datasets: [
                {
                    label: 'Progress %',
                    data: students.map(s => s.progress),
                    backgroundColor: students.map(s =>
                        s.riskLevel === 'high' ? 'rgba(239,68,68,0.8)' :
                            s.riskLevel === 'medium' ? 'rgba(245,158,11,0.8)' :
                                'rgba(16,185,129,0.8)'
                    ),
                    borderRadius: 8, borderSkipped: false,
                },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0A1628',
                    callbacks: { label: ctx => ` Progress: ${ctx.raw}%` },
                },
            },
            scales: {
                x: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%', color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 11 } } },
                y: { grid: { display: false }, ticks: { color: '#374359', font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } } },
            },
        },
    });
}

function setupTeacherEvents() {
    const openModal = () => document.getElementById('assignModal').classList.remove('hidden');
    const closeModal = () => document.getElementById('assignModal').classList.add('hidden');

    document.getElementById('newTaskBtn')?.addEventListener('click', openModal);
    document.getElementById('newTaskBtn2')?.addEventListener('click', openModal);
    document.getElementById('assignClose')?.addEventListener('click', closeModal);
    document.getElementById('assignCancel')?.addEventListener('click', closeModal);

    document.getElementById('assignConfirm')?.addEventListener('click', () => {
        const title = document.getElementById('newTaskTitle').value.trim();
        const type = document.getElementById('newTaskType').value;
        const due = document.getElementById('newTaskDue').value;
        const selectedStudents = [...document.querySelectorAll('.student-checkbox input:checked')].map(cb => cb.value);

        if (!title || !due || selectedStudents.length === 0) {
            showToast('Missing Fields', 'Please fill in all fields and select at least one student.', 'danger');
            return;
        }

        const newTask = {
            id: `T${Date.now()}`, title, type, level: 'Custom', dueDate: due,
            assigned: selectedStudents,
            status: Object.fromEntries(selectedStudents.map(id => [id, 'pending'])),
        };
        AppState.tasks.unshift(newTask);
        const tbody = document.getElementById('taskTableBody');
        if (tbody) tbody.insertAdjacentHTML('afterbegin', renderTaskRow(newTask, AppState.students));
        closeModal();
        showToast('Task Assigned! ✅', `"${title}" assigned to ${selectedStudents.length} student(s).`, 'success');
    });

    document.getElementById('viewSharedBtn')?.addEventListener('click', () => navigate('shared'));
}
