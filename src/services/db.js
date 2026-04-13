const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzhsw-CegH2_LU7l56-_i0kWqSJ18cExpDdIdAl1aXyoN8mqoN2NbPGdmMYNz1csOs-KA/exec';

/**
 * Saves user data to Google Sheets.
 * @param {Object} userData - { name, phone, location }
 * @returns {Promise<Object>} - { success: boolean, message: string }
 */
export const saveUserToSheet = async (userData) => {
  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors for simple cross-origin POSTs without preflight
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // With mode 'no-cors', the response is opaque (status 0).
    // We assume it's sent successfully if no error is thrown.
    return { success: true, message: 'Data sent successfully' };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return { success: false, message: 'Failed to connect to the database' };
  }
};
