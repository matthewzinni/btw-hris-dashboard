// =========================
// SUPABASE CLIENT + SERVICE LAYER
// =========================

const supabaseUrl = 'https://fxljbnyarfwnqgheywgw.supabase.co';
const supabaseKey = 'sb_publishable_IGkemOMHLAk6X1UzqSxH-w_PUq3nSwi';

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
window.supabaseClient = supabaseClient;

// =========================
// SERVICE UTILITIES
// =========================

function requireId(id, label = 'ID') {
    if (!id) {
        throw new Error(`Missing ${label}`);
    }
}

function normalizeResult(result) {
    if (!result) return { data: null, error: new Error('No result returned from Supabase.') };
    return result;
}

async function safeQuery(label, queryFn) {
    try {
        const result = await queryFn();
        return normalizeResult(result);
    } catch (error) {
        console.error(`[Service Error] ${label}:`, error);
        return { data: null, error };
    }
}

async function fetchRows(table, options = {}) {
    return safeQuery(`Fetch ${table}`, async () => {
        let query = supabaseClient.from(table).select(options.select || '*');

        if (options.eq) {
            Object.entries(options.eq).forEach(([column, value]) => {
                query = query.eq(column, value);
            });
        }

        if (options.neq) {
            Object.entries(options.neq).forEach(([column, value]) => {
                query = query.neq(column, value);
            });
        }

        if (options.orderBy) {
            const orderRules = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy];
            orderRules.forEach(rule => {
                query = query.order(rule.column, { ascending: rule.ascending ?? true });
            });
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        return await query;
    });
}

async function createRow(table, payload, label = 'record') {
    return safeQuery(`Create ${label}`, async () => {
        return await supabaseClient
            .from(table)
            .insert([payload])
            .select('*');
    });
}

async function updateRow(table, id, payload, label = 'record') {
    requireId(id, `${label} ID`);

    return safeQuery(`Update ${label}`, async () => {
        return await supabaseClient
            .from(table)
            .update(payload)
            .eq('id', id)
            .select('*');
    });
}

async function deleteRow(table, id, label = 'record') {
    requireId(id, `${label} ID`);

    return safeQuery(`Delete ${label}`, async () => {
        return await supabaseClient
            .from(table)
            .delete()
            .eq('id', id)
            .select('id');
    });
}

async function updateRowForEmployee(table, id, employeeId, payload, label = 'record') {
    requireId(id, `${label} ID`);
    requireId(employeeId, 'employee ID');

    return safeQuery(`Update ${label}`, async () => {
        return await supabaseClient
            .from(table)
            .update(payload)
            .eq('id', id)
            .eq('employee_id', employeeId)
            .select('*');
    });
}

// =========================
// TABLE NAMES
// =========================

const ORBIS_TABLES = {
    employees: 'employees',
    reviews: 'employee_reviews',
    discipline: 'discipline_reports',
    meetings: 'employee_meetings',
    notes: 'employee_notes',
    incidents: 'incident_reports',
    emergencyContacts: 'emergency_contacts',
    onboarding: 'employee_onboarding',
    candidates: 'candidates'
};

// =========================
// EMPLOYEES SERVICE
// =========================

const EmployeeService = {
    getAll() {
        return fetchRows(ORBIS_TABLES.employees, {
            orderBy: { column: 'last_name', ascending: true }
        });
    },

    create(payload) {
        return createRow(ORBIS_TABLES.employees, payload, 'employee');
    },

    update(id, payload) {
        return updateRow(ORBIS_TABLES.employees, id, payload, 'employee');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.employees, id, 'employee');
    }
};

// =========================
// REVIEWS SERVICE
// =========================

const ReviewService = {
    getByEmployee(employeeId) {
        requireId(employeeId, 'employee ID');

        return fetchRows(ORBIS_TABLES.reviews, {
            eq: { employee_id: employeeId },
            orderBy: { column: 'review_date', ascending: false }
        });
    },

    create(payload) {
        requireId(payload?.employee_id, 'employee ID');
        return createRow(ORBIS_TABLES.reviews, payload, 'review');
    },

    update(id, employeeId, payload) {
        return updateRowForEmployee(ORBIS_TABLES.reviews, id, employeeId, payload, 'review');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.reviews, id, 'review');
    }
};

// =========================
// DISCIPLINE SERVICE
// =========================

const DisciplineService = {
    getByEmployee(employeeId) {
        requireId(employeeId, 'employee ID');

        return fetchRows(ORBIS_TABLES.discipline, {
            eq: { employee_id: employeeId },
            orderBy: { column: 'incident_date', ascending: false }
        });
    },

    create(payload) {
        requireId(payload?.employee_id, 'employee ID');
        return createRow(ORBIS_TABLES.discipline, payload, 'discipline report');
    },

    update(id, employeeId, payload) {
        return updateRowForEmployee(ORBIS_TABLES.discipline, id, employeeId, payload, 'discipline report');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.discipline, id, 'discipline report');
    }
};

// =========================
// MEETINGS SERVICE
// =========================

const MeetingService = {
    getByEmployee(employeeId) {
        requireId(employeeId, 'employee ID');

        return fetchRows(ORBIS_TABLES.meetings, {
            eq: { employee_id: employeeId },
            orderBy: { column: 'meeting_date', ascending: false }
        });
    },

    create(payload) {
        requireId(payload?.employee_id, 'employee ID');
        return createRow(ORBIS_TABLES.meetings, payload, 'meeting');
    },

    update(id, employeeId, payload) {
        return updateRowForEmployee(ORBIS_TABLES.meetings, id, employeeId, payload, 'meeting');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.meetings, id, 'meeting');
    }
};

// =========================
// NOTES SERVICE
// =========================

const NoteService = {
    getByEmployee(employeeId) {
        requireId(employeeId, 'employee ID');

        return fetchRows(ORBIS_TABLES.notes, {
            eq: { employee_id: employeeId },
            orderBy: { column: 'note_date', ascending: false }
        });
    },

    create(payload) {
        requireId(payload?.employee_id, 'employee ID');
        return createRow(ORBIS_TABLES.notes, payload, 'note');
    },

    update(id, employeeId, payload) {
        return updateRowForEmployee(ORBIS_TABLES.notes, id, employeeId, payload, 'note');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.notes, id, 'note');
    }
};

// =========================
// INCIDENTS SERVICE
// =========================

const IncidentService = {
    getByEmployee(employeeId) {
        requireId(employeeId, 'employee ID');

        return fetchRows(ORBIS_TABLES.incidents, {
            eq: { employee_id: employeeId },
            orderBy: [
                { column: 'incident_date', ascending: false },
                { column: 'created_at', ascending: false }
            ]
        });
    },

    create(payload) {
        requireId(payload?.employee_id, 'employee ID');
        return createRow(ORBIS_TABLES.incidents, payload, 'incident');
    },

    update(id, employeeId, payload) {
        return updateRowForEmployee(ORBIS_TABLES.incidents, id, employeeId, payload, 'incident');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.incidents, id, 'incident');
    }
};

// =========================
// EMERGENCY CONTACTS SERVICE
// =========================

const EmergencyContactService = {
    getByEmployee(employeeId) {
        requireId(employeeId, 'employee ID');

        return fetchRows(ORBIS_TABLES.emergencyContacts, {
            eq: { employee_id: employeeId },
            orderBy: { column: 'created_at', ascending: false }
        });
    },

    create(payload) {
        requireId(payload?.employee_id, 'employee ID');
        return createRow(ORBIS_TABLES.emergencyContacts, payload, 'emergency contact');
    },

    update(id, employeeId, payload) {
        return updateRowForEmployee(ORBIS_TABLES.emergencyContacts, id, employeeId, payload, 'emergency contact');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.emergencyContacts, id, 'emergency contact');
    }
};

// =========================
// ONBOARDING SERVICE
// =========================

const OnboardingService = {
    getByEmployee(employeeId) {
        requireId(employeeId, 'employee ID');

        return fetchRows(ORBIS_TABLES.onboarding, {
            eq: { employee_id: employeeId },
            orderBy: { column: 'created_at', ascending: false }
        });
    },

    create(payload) {
        requireId(payload?.employee_id, 'employee ID');
        return createRow(ORBIS_TABLES.onboarding, payload, 'onboarding record');
    },

    update(id, employeeId, payload) {
        return updateRowForEmployee(ORBIS_TABLES.onboarding, id, employeeId, payload, 'onboarding record');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.onboarding, id, 'onboarding record');
    }
};

// =========================
// CANDIDATES SERVICE
// =========================

const CandidateService = {
    getActive() {
        return fetchRows(ORBIS_TABLES.candidates, {
            neq: { stage: 'Hired' },
            orderBy: { column: 'created_at', ascending: false }
        });
    },

    getById(id) {
        requireId(id, 'candidate ID');

        return safeQuery('Get candidate by ID', async () => {
            return await supabaseClient
                .from(ORBIS_TABLES.candidates)
                .select('*')
                .eq('id', id)
                .single();
        });
    },

    create(payload) {
        return createRow(ORBIS_TABLES.candidates, payload, 'candidate');
    },

    update(id, payload) {
        return updateRow(ORBIS_TABLES.candidates, id, payload, 'candidate');
    },

    delete(id) {
        return deleteRow(ORBIS_TABLES.candidates, id, 'candidate');
    }
};

// =========================
// ORBIS SERVICE REGISTRY
// =========================

window.OrbisServices = {
    tables: ORBIS_TABLES,
    safeQuery,
    fetchRows,
    createRow,
    updateRow,
    deleteRow,
    updateRowForEmployee,
    employees: EmployeeService,
    reviews: ReviewService,
    discipline: DisciplineService,
    meetings: MeetingService,
    notes: NoteService,
    incidents: IncidentService,
    emergencyContacts: EmergencyContactService,
    onboarding: OnboardingService,
    candidates: CandidateService
};

// =========================
// BACKWARD-COMPATIBLE GLOBAL EXPORTS
// These keep your current modules working while allowing cleaner service usage later.
// =========================

window.requireId = requireId;
window.safeQuery = safeQuery;

window.getEmployees = () => EmployeeService.getAll();
window.createEmployee = payload => EmployeeService.create(payload);
window.updateEmployeeById = (id, payload) => EmployeeService.update(id, payload);
window.deleteEmployeeById = id => EmployeeService.delete(id);

window.getEmployeeReviews = employeeId => ReviewService.getByEmployee(employeeId);
window.createEmployeeReview = payload => ReviewService.create(payload);
window.updateEmployeeReviewById = (id, employeeId, payload) => ReviewService.update(id, employeeId, payload);
window.deleteEmployeeReviewById = id => ReviewService.delete(id);

window.getEmployeeDisciplines = employeeId => DisciplineService.getByEmployee(employeeId);
window.createEmployeeDiscipline = payload => DisciplineService.create(payload);
window.updateEmployeeDisciplineById = (id, employeeId, payload) => DisciplineService.update(id, employeeId, payload);
window.deleteEmployeeDisciplineById = id => DisciplineService.delete(id);

window.getEmployeeMeetings = employeeId => MeetingService.getByEmployee(employeeId);
window.createEmployeeMeeting = payload => MeetingService.create(payload);
window.updateEmployeeMeetingById = (id, employeeId, payload) => MeetingService.update(id, employeeId, payload);
window.deleteEmployeeMeetingById = id => MeetingService.delete(id);

window.getEmployeeNotes = employeeId => NoteService.getByEmployee(employeeId);
window.createEmployeeNote = payload => NoteService.create(payload);
window.updateEmployeeNoteById = (id, employeeId, payload) => NoteService.update(id, employeeId, payload);
window.deleteEmployeeNoteById = id => NoteService.delete(id);

window.getEmployeeIncidents = employeeId => IncidentService.getByEmployee(employeeId);
window.createEmployeeIncident = payload => IncidentService.create(payload);
window.updateEmployeeIncidentById = (id, employeeId, payload) => IncidentService.update(id, employeeId, payload);
window.deleteEmployeeIncidentById = id => IncidentService.delete(id);

window.getEmergencyContact = employeeId => EmergencyContactService.getByEmployee(employeeId);
window.createEmergencyContact = payload => EmergencyContactService.create(payload);
window.updateEmergencyContactById = (id, employeeId, payload) => EmergencyContactService.update(id, employeeId, payload);
window.deleteEmergencyContactById = id => EmergencyContactService.delete(id);

window.getEmployeeOnboarding = employeeId => OnboardingService.getByEmployee(employeeId);
window.createEmployeeOnboarding = payload => OnboardingService.create(payload);
window.updateEmployeeOnboardingById = (id, employeeId, payload) => OnboardingService.update(id, employeeId, payload);
window.deleteEmployeeOnboardingById = id => OnboardingService.delete(id);

window.getActiveCandidates = () => CandidateService.getActive();
window.getCandidateById = id => CandidateService.getById(id);
window.createCandidate = payload => CandidateService.create(payload);
window.updateCandidateById = (id, payload) => CandidateService.update(id, payload);
window.deleteCandidateById = id => CandidateService.delete(id);