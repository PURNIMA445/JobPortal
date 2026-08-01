export function packCompanyMetadata(company) {
    const coreFields = ['name', 'industry', 'location', 'websiteUrl', 'logoUrl'];
    
    // Extract native fields
    const payload = {};
    coreFields.forEach(field => {
        if (company[field] !== undefined) {
            payload[field] = company[field];
        }
    });

    // Extract extended metadata fields
    const extendedFields = {
        realDescription: company.description || '',
        type: company.type || '',
        size: company.size || '',
        yearEstablished: company.yearEstablished || '',
        corporateEmail: company.corporateEmail || '',
        phone: company.phone || '',
        linkedinUrl: company.linkedinUrl || '',
        twitterUrl: company.twitterUrl || '',
        perks: company.perks || [],
        taxId: company.taxId || '',
        documents: company.documents || []
    };

    // Pack into the native description field
    payload.description = JSON.stringify(extendedFields);
    return payload;
}

export function unpackCompanyMetadata(backendCompany) {
    if (!backendCompany) return null;
    
    const unpacked = { ...backendCompany };
    
    try {
        if (backendCompany.description && backendCompany.description.startsWith('{')) {
            const extended = JSON.parse(backendCompany.description);
            // Merge extended fields onto the main object
            Object.assign(unpacked, extended);
            // Set the canonical description back
            unpacked.description = extended.realDescription || '';
        }
    } catch (e) {
        // If it's not valid JSON, it's just a normal description
        unpacked.description = backendCompany.description || '';
    }
    
    return unpacked;
}
