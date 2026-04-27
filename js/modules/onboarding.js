

// =========================
// ONBOARDING MODULE
// =========================

let currentOnboardingId = null;

function getResolvedOnboardingEmployeeId(employeeId = null) {
    return currentEmployee?.dbId || currentEmployee?.id || employeeId;
}

// =========================
// LOAD
// =========================
async function loadEmployeeOnboarding(employeeId) {
    const actualEmployeeId = getResolvedOnboardingEmployeeId(employeeId);
    if (!actualEmployeeId) return;

    const target = safeGet('onboardingHistory');
    if (!target) return;

    const { data, error } = await supabaseClient
        .from('employee_onboarding')
        .select('*')
        .eq('employee_id', actualEmployeeId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        target.innerHTML = '<div class="empty">Error loading onboarding records.</div>';
        return;
    }

    if (!data || data.length === 0) {
        target.innerHTML = '<div class="empty">No onboarding records.</div>';
        return;
    }

    target.innerHTML = data.map(record => `
        <div class="card" style="margin-bottom:10px;">
            <strong>${record.step_name || 'Onboarding Step'}</strong><br>
            Status: ${record.status || 'Pending'}<br>
            Notes: ${record.notes || '—'}
            <div style="margin-top:6px;">
                <button onclick="startOnboardingEdit(${JSON.stringify(record).replace(/"/g, '&quot;')})">Edit</button>
                <button onclick="deleteOnboardingRecord('${record.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// =========================
// EDIT
// =========================
function startOnboardingEdit(record) {
    currentOnboardingId = record.id;

    if (safeGet('onboardingStep')) safeGet('onboardingStep').value = record.step_name || '';
    if (safeGet('onboardingStatus')) safeGet('onboardingStatus').value = record.status || 'Pending';
    if (safeGet('onboardingNotes')) safeGet('onboardingNotes').value = record.notes || '';

    if (safeGet('saveOnboardingBtn')) safeGet('saveOnboardingBtn').textContent = 'Update Onboarding';
}

function cancelOnboardingEdit() {
    currentOnboardingId = null;

    if (safeGet('onboardingStep')) safeGet('onboardingStep').value = '';
    if (safeGet('onboardingStatus')) safeGet('onboardingStatus').value = 'Pending';
    if (safeGet('onboardingNotes')) safeGet('onboardingNotes').value = '';

    if (safeGet('saveOnboardingBtn')) safeGet('saveOnboardingBtn').textContent = 'Save Onboarding';
}

// =========================
// SAVE
// =========================
async function saveOnboardingRecord() {
    const employeeId = getResolvedOnboardingEmployeeId();
    if (!employeeId) {
        showToast('No employee selected.', 'error');
        return;
    }

    const payload = {
        employee_id: employeeId,
        step_name: safeGet('onboardingStep')?.value || '',
        status: safeGet('onboardingStatus')?.value || 'Pending',
        notes: safeGet('onboardingNotes')?.value || ''
    };

    let error;

    if (currentOnboardingId) {
        const result = await supabaseClient
            .from('employee_onboarding')
            .update(payload)
            .eq('id', currentOnboardingId);
        error = result.error;
    } else {
        const result = await supabaseClient
            .from('employee_onboarding')
            .insert([payload]);
        error = result.error;
    }

    if (error) {
        console.error(error);
        showToast('Error saving onboarding.', 'error');
        return;
    }

    showToast(currentOnboardingId ? 'Onboarding updated.' : 'Onboarding saved.');

    cancelOnboardingEdit();
    await loadEmployeeOnboarding(employeeId);
    switchTab('onboarding');
}

// =========================
// DELETE
// =========================
async function deleteOnboardingRecord(id) {
    const employeeId = getResolvedOnboardingEmployeeId();
    if (!employeeId) {
        showToast('No employee selected.', 'error');
        return;
    }

    if (!confirm('Delete this onboarding record?')) return;

    const { error } = await supabaseClient
        .from('employee_onboarding')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
        showToast('Error deleting onboarding.', 'error');
        return;
    }

    showToast('Onboarding record deleted.');
    await loadEmployeeOnboarding(employeeId);
}

// =========================
// EXPORTS
// =========================
window.loadEmployeeOnboarding = loadEmployeeOnboarding;
window.startOnboardingEdit = startOnboardingEdit;
window.cancelOnboardingEdit = cancelOnboardingEdit;
window.saveOnboardingRecord = saveOnboardingRecord;
window.deleteOnboardingRecord = deleteOnboardingRecord;