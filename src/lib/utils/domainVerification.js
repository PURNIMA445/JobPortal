/**
 * Normalizes a URL or email address to its base domain.
 * @param {string} input - The URL or email address
 * @returns {string} The normalized domain
 */
export function getDomain(input) {
  if (!input) return "";
  
  // Handle emails
  if (input.includes('@')) {
    return input.split('@')[1].toLowerCase().trim();
  }
  
  // Handle URLs
  try {
    let urlString = input.toLowerCase().trim();
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }
    const url = new URL(urlString);
    let hostname = url.hostname;
    
    // Remove 'www.' prefix
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    
    return hostname;
  } catch (e) {
    return "";
  }
}

/**
 * Checks if a recruiter's email domain matches the company's website domain.
 * Also checks against common free email providers which should never be auto-verified.
 * @param {string} email - The recruiter's email address
 * @param {string} companyWebsite - The company's official website URL
 * @returns {boolean} True if domains match and it's not a free provider
 */
export function isDomainVerified(email, companyWebsite) {
  if (!email || !companyWebsite) return false;
  
  const emailDomain = getDomain(email);
  const websiteDomain = getDomain(companyWebsite);
  
  if (!emailDomain || !websiteDomain) return false;
  
  const freeProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'
  ];
  
  if (freeProviders.includes(emailDomain)) {
    return false;
  }
  
  // Direct match
  if (emailDomain === websiteDomain) return true;
  
  // Handle subdomains (e.g. mail.acme.com matching acme.com)
  if (emailDomain.endsWith(`.${websiteDomain}`) || websiteDomain.endsWith(`.${emailDomain}`)) {
    return true;
  }
  
  return false;
}
