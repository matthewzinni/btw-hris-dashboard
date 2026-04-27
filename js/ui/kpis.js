function renderKpiEmployeeMetrics() {
    // ... other code ...

    const turnoverRiskEmployees = reviewEligibleActive.filter(e => {
        const tenureMonths = Number(e.tenureMonths) || 0;
        const isFirstThreeMonths = tenureMonths > 0 && tenureMonths <= 3;
        const employeeKey = String(e.dbId || e.id || '');
        const riskMeta = currentAtRiskRosterMap?.[employeeKey] || null;
        const isAtRisk = !!riskMeta && (
            riskMeta.lowReview === true ||
            Number(riskMeta.openIncidentCount || 0) > 0 ||
            String(riskMeta.manualReason || '').trim() !== ''
        );

        return isFirstThreeMonths && isAtRisk;
    });

    // ... other code ...

    // Replace template string occurrences in this function:
    // Example line (replace all occurrences):
    // `${turnoverRiskContributors} employee${turnoverRiskContributors === 1 ? '' : 's'} contributing to risk`
    // becomes:
    // `${turnoverRiskContributors} at-risk employee${turnoverRiskContributors === 1 ? '' : 's'} in first 3 months`

    // Assuming the variable turnoverRiskContributors is defined somewhere in this function,
    // all occurrences of the old template string are replaced with the new one.

    // ... other code ...
}

function buildKpiHoverDetails() {
    // ... other code ...

    const turnoverRiskEmployees = (EMPLOYEES || []).filter(e => {
        const isActive = String(e.status || '').toUpperCase() === 'ACTIVE';
        const isContract = String(e.payType || '').toLowerCase().includes('contract');
        const tenureMonths = Number(e.tenureMonths) || 0;
        const isFirstThreeMonths = tenureMonths > 0 && tenureMonths <= 3;
        const employeeKey = String(e.dbId || e.id || '');
        const riskMeta = currentAtRiskRosterMap?.[employeeKey] || null;
        const isAtRisk = !!riskMeta && (
            riskMeta.lowReview === true ||
            Number(riskMeta.openIncidentCount || 0) > 0 ||
            String(riskMeta.manualReason || '').trim() !== ''
        );

        return isActive && !isContract && isFirstThreeMonths && isAtRisk;
    });

    // ... other code ...

    // Replace Turnover Risk empty/fallback text with:
    // "No at-risk employees in their first 3 months"

    // ... other code ...
}