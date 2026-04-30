function getResolvedDrawerEmployeeId(employee = null) {
    return employee?.dbId || employee?.id || currentEmployee?.dbId || currentEmployee?.id || null;
}

function openDrawer(employee) {
    if (!employee) return;

    if (typeof resetDrawerForms === 'function') {
        resetDrawerForms();
    }

    currentEmployee = employee;
    isCreatingEmployee = false;

    const employeeId = getResolvedDrawerEmployeeId(employee);
    if (!employeeId) return;

    if (typeof switchTab === 'function') {
        switchTab('profile');
    }

    if (typeof setText === 'function') {
        setText('drawerTitle', `${esc(employee.first)} ${esc(employee.last)}`);
        setText('drawerSub', `${esc(employee.position || 'Employee')} • ${esc(employee.dept || 'No department')}`);
    }

    if (typeof populateEmployeeForm === 'function') {
        populateEmployeeForm(employee);
    }

    if (typeof ensureDeleteEmployeeButton === 'function') {
        ensureDeleteEmployeeButton();
    }

    // Safety: make sure the Terminate Employee button exists in the employee action row.
    // Some older drawer paths create Archive but return before Terminate is appended.
    if (typeof safeGet === 'function' && typeof runTerminateEmployee === 'function') {
        const saveBtn = safeGet('saveEmployeeBtn');
        const newBtn = safeGet('newEmployeeBtn');
        const actionsRow = (newBtn && newBtn.parentElement) || (saveBtn && saveBtn.parentElement);
        let terminateBtn = safeGet('terminateEmployeeBtn');

        if (actionsRow && !terminateBtn) {
            terminateBtn = document.createElement('button');
            terminateBtn.type = 'button';
            terminateBtn.id = 'terminateEmployeeBtn';
            terminateBtn.className = 'button danger';
            terminateBtn.textContent = 'Terminate Employee';
            terminateBtn.onclick = () => runTerminateEmployee();
            actionsRow.appendChild(terminateBtn);
        }
    }

    if (typeof applyRolePermissions === 'function') {
        applyRolePermissions();
    }

    const detailRows = [
        ['Employee ID', employee.id || employee.employee_id || employeeId],
        ['Status', employee.status],
        ['Department', employee.dept],
        ['Position', employee.position],
        ['Supervisor', employee.supervisor],
        ['Pay Type', employee.payType],
        ['Standard Hours', employee.stdHours],
        ['Hire Date', typeof fmtDate === 'function' ? fmtDate(employee.hireDate) : (employee.hireDate || '')],
        ['Next Review', typeof fmtDate === 'function' ? fmtDate(employee.nextReview) : (employee.nextReview || '')],
        ['Anniversary', typeof fmtDate === 'function' ? fmtDate(employee.anniversaryDate) : (employee.anniversaryDate || '')],
        ['Tenure Months', employee.tenureMonths],
        ['Tenure Years', employee.tenureYears],
        ['Benefits Status', employee.benefitsStatus],
        ['Tenure Bracket', employee.tenureBracket]
    ];

    const details = typeof safeGet === 'function' ? safeGet('drawerDetails') : document.getElementById('drawerDetails');
    if (details) {
        details.innerHTML = detailRows.map(([label, value]) => `
      <div class="detail-card">
        <div class="detail-label">${esc(label)}</div>
        <div class="detail-value">${esc(value)}</div>
      </div>
    `).join('');
    }

    const setLoading = (id, text) => {
        const el = typeof safeGet === 'function' ? safeGet(id) : document.getElementById(id);
        if (el) el.innerHTML = `<div class="empty">${text}</div>`;
    };

    setLoading('notesHistory', 'Loading notes...');
    setLoading('disciplineHistory', 'Loading discipline history...');
    setLoading('meetingsHistory', 'Loading meetings...');
    setLoading('incidentsHistory', 'Loading incidents...');
    setLoading('ecHistory', 'Loading emergency contact...');
    setLoading('docHistory', 'Loading documents...');
    setLoading('reviewsHistory', 'Loading reviews...');
    setLoading('stayInterviewsHistory', 'Loading stay interviews...');
    setLoading('onboardingHistory', 'Loading onboarding...');

    const backdrop = typeof safeGet === 'function' ? safeGet('drawerBackdrop') : document.getElementById('drawerBackdrop');
    const drawer = typeof safeGet === 'function' ? safeGet('employeeDrawer') : document.getElementById('employeeDrawer');
    backdrop?.classList.add('open');
    drawer?.classList.add('open');

    if (typeof loadEmployeeNotes === 'function') loadEmployeeNotes(employeeId);
    if (typeof loadEmployeeDiscipline === 'function') loadEmployeeDiscipline(employeeId);
    if (typeof loadEmployeeMeetings === 'function') loadEmployeeMeetings(employeeId);
    if (typeof loadEmergencyContacts === 'function') loadEmergencyContacts(employeeId);
    if (typeof loadEmployeeDocuments === 'function') loadEmployeeDocuments(employeeId);
    if (typeof loadEmployeeReviews === 'function') loadEmployeeReviews(employeeId);
    if (typeof loadEmployeeIncidents === 'function') loadEmployeeIncidents(employeeId);
    if (typeof loadStayInterviews === 'function') loadStayInterviews(employeeId);
    if (typeof loadEmployeeOnboarding === 'function') loadEmployeeOnboarding(employeeId);
    if (typeof loadEmployeeManualAtRisk === 'function') loadEmployeeManualAtRisk(employeeId);
    if (typeof loadEmployeeManualImpactPlayer === 'function') loadEmployeeManualImpactPlayer(employeeId);
    if (typeof loadEmployeeHistory === 'function') loadEmployeeHistory(employeeId);

    const markAtRiskBtn = typeof safeGet === 'function' ? safeGet('markAtRiskBtn') : document.getElementById('markAtRiskBtn');
    const clearAtRiskBtn = typeof safeGet === 'function' ? safeGet('clearAtRiskBtn') : document.getElementById('clearAtRiskBtn');
    const markImpactPlayerBtn = typeof safeGet === 'function' ? safeGet('markImpactPlayerBtn') : document.getElementById('markImpactPlayerBtn');
    const clearImpactPlayerBtn = typeof safeGet === 'function' ? safeGet('clearImpactPlayerBtn') : document.getElementById('clearImpactPlayerBtn');

    if (markAtRiskBtn && typeof markEmployeeAtRisk === 'function') markAtRiskBtn.onclick = markEmployeeAtRisk;
    if (clearAtRiskBtn && typeof clearAtRiskStatus === 'function') clearAtRiskBtn.onclick = clearAtRiskStatus;
    if (markImpactPlayerBtn && typeof markImpactPlayer === 'function') markImpactPlayerBtn.onclick = markImpactPlayer;
    if (clearImpactPlayerBtn && typeof clearImpactPlayerStatus === 'function') clearImpactPlayerBtn.onclick = clearImpactPlayerStatus;

}

function closeDrawer() {
    const backdrop = typeof safeGet === 'function' ? safeGet('drawerBackdrop') : document.getElementById('drawerBackdrop');
    const drawer = typeof safeGet === 'function' ? safeGet('employeeDrawer') : document.getElementById('employeeDrawer');

    backdrop?.classList.remove('open');
    drawer?.classList.remove('open');

    currentEmployee = null;

    if (typeof resetDrawerForms === 'function') {
        resetDrawerForms();
    }
}

function switchDrawerTab(tabName) {
    if (typeof switchTab === 'function') {
        switchTab(tabName);
        return;
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });
}

function bindDrawerEvents() {
    const closeBtn = document.getElementById('drawerClose');
    if (closeBtn) {
        closeBtn.onclick = closeDrawer;
    }

    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.onclick = () => {
            const tabName = tab.dataset.tab;
            if (tabName) switchDrawerTab(tabName);
        };
    });
}

window.getResolvedDrawerEmployeeId = getResolvedDrawerEmployeeId;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.switchDrawerTab = switchDrawerTab;
window.bindDrawerEvents = bindDrawerEvents;