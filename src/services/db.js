const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzhsw-CegH2_LU7l56-_i0kWqSJ18cExpDdIdAl1aXyoN8mqoN2NbPGdmMYNz1csOs-KA/exec';
const SECURITY_TOKEN = 'PG_CODE_2026_SECURE_TOKEN';

/**
 * Saves user data to Google Sheets with security verification.
 * @param {Object} userData - { name, phone, location }
 */
export const saveUserToSheet = async (userData) => {
  try {
    const payload = {
      ...userData,
      securityToken: SECURITY_TOKEN,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script handles text/plain best for cross-origin POSTs
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return { 
      success: result.status === 'success', 
      isDuplicate: result.isDuplicate || false,
      message: result.message || 'Data saved successfully' 
    };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return { success: false, message: 'Security verification or connection failed' };
  }
};
