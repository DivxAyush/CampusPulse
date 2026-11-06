import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts plain text from uploaded resume buffer (PDF, DOCX, TXT)
 * Never returns dummy fallback text. If text cannot be extracted, returns empty string.
 */
export const extractTextFromBuffer = async (buffer, mimeType, fileName = '') => {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  const isPdf = mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const isDocx =
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    fileName.toLowerCase().endsWith('.docx') ||
    fileName.toLowerCase().endsWith('.doc');

  try {
    if (isPdf) {
      const data = await pdfParse(buffer);
      return (data.text || '').trim();
    }

    if (isDocx) {
      const result = await mammoth.extractRawText({ buffer });
      return (result.value || '').trim();
    }

    // Default plain text / utf-8
    const text = buffer.toString('utf-8');
    // Ensure it's not a binary file mistakenly read as utf-8
    if (/[\x00-\x08\x0E-\x1F]/.test(text.slice(0, 500))) {
      // Looks binary, attempt pdf-parse as a fallback
      try {
        const data = await pdfParse(buffer);
        if (data.text && data.text.length > 20) return data.text.trim();
      } catch (e) {
        // Not a valid PDF
      }
      return '';
    }
    return text.trim();
  } catch (error) {
    console.error('Error extracting text from buffer:', error.message);
    return '';
  }
};
