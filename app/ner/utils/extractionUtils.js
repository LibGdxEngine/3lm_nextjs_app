export function simulateExtraction(text, extractionFields) {
  return extractionFields.map(field => {
    if (field.name.toLowerCase() === 'name') {
      const nameMatch = text.match(/name[:\s]+([^\n\r]+)/i) || text.match(/اسم[:\s]+([^\n\r]+)/);
      return { ...field, value: nameMatch ? nameMatch[1].trim() : 'Not found' };
    } else if (field.name.toLowerCase() === 'age') {
      const ageMatch = text.match(/age[:\s]+(\d+)/i) || text.match(/عمر[:\s]+(\d+)/);
      return { ...field, value: ageMatch ? ageMatch[1] : 'Not found' };
    }
    return { ...field, value: 'Processing...' };
  });
} 