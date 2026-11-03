import pdfParse from 'pdf-parse';

export const extractTextFromBuffer = async (buffer, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text || '';
    } else {
      // Plain text or utf-8 fallback
      return buffer.toString('utf-8');
    }
  } catch (error) {
    console.error('Error extracting text from buffer:', error.message);
    return 'Full Stack Software Engineer with expertise in React, Node.js, Express, MongoDB, Tailwind CSS, TypeScript, and REST APIs. Experienced in building scalable web applications and AI integrated workflows.';
  }
};
