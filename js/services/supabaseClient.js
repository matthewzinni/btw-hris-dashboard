// =========================
// SUPABASE CLIENT
// =========================
const supabaseUrl = 'https://fxljbnyarfwnqgheywgw.supabase.co';
const supabaseKey = 'sb_publishable_IGkemOMHLAk6X1UzqSxH-w_PUq3nSwi';

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
window.supabaseClient = supabaseClient;
// =========================

// EMPLOYEES SERVICE

// =========================

async function getEmployees() {

    return await supabaseClient

        .from('employees')

        .select('*')

        .order('last_name', { ascending: true });

}

async function createEmployee(payload) {

    return await supabaseClient

        .from('employees')

        .insert([payload]);

}

async function updateEmployeeById(id, payload) {

    return await supabaseClient

        .from('employees')

        .update(payload)

        .eq('id', id);

}

async function deleteEmployeeById(id) {

    return await supabaseClient

        .from('employees')

        .delete()

        .eq('id', id)

        .select('id');

}

window.getEmployees = getEmployees;

window.createEmployee = createEmployee;

window.updateEmployeeById = updateEmployeeById;

window.deleteEmployeeById = deleteEmployeeById;
// =========================
// REVIEWS SERVICE
// =========================
async function getEmployeeReviews(employeeId) {
    return await supabaseClient
        .from('employee_reviews')
        .select('*')
        .eq('employee_id', employeeId)
        .order('review_date', { ascending: false });
}

async function createEmployeeReview(payload) {
    return await supabaseClient
        .from('employee_reviews')
        .insert([payload]);
}

async function updateEmployeeReviewById(id, employeeId, payload) {
    return await supabaseClient
        .from('employee_reviews')
        .update(payload)
        .eq('id', id)
        .eq('employee_id', employeeId);
}

async function deleteEmployeeReviewById(id) {
    return await supabaseClient
        .from('employee_reviews')
        .delete()
        .eq('id', id);
}

window.getEmployeeReviews = getEmployeeReviews;
window.createEmployeeReview = createEmployeeReview;
window.updateEmployeeReviewById = updateEmployeeReviewById;
window.deleteEmployeeReviewById = deleteEmployeeReviewById;


// =========================
// DISCIPLINE SERVICE
// =========================
async function getEmployeeDisciplines(employeeId) {
    return await supabaseClient
        .from('employee_discipline')
        .select('*')
        .eq('employee_id', employeeId)
        .order('incident_date', { ascending: false });
}

window.getEmployeeDisciplines = getEmployeeDisciplines;


// =========================
// MEETINGS SERVICE
// =========================
async function getEmployeeMeetings(employeeId) {
    return await supabaseClient
        .from('employee_meetings')
        .select('*')
        .eq('employee_id', employeeId)
        .order('meeting_date', { ascending: false });
}

window.getEmployeeMeetings = getEmployeeMeetings;