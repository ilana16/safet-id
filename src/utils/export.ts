
/**
 * Utility for exporting data to CSV
 */
export const exportToCSV = (data: any[], filename: string) => {
  // Get headers from the first item in the array
  const headers = Object.keys(data[0] || {}).filter(key => 
    !['id', 'dateAdded'].includes(key)
  );
  
  // Add formatted date header
  headers.push('dateAdded');
  
  // Convert data to CSV format
  const csvRows = [
    // Add headers row
    headers.join(','),
    
    // Add data rows
    ...data.map(row => {
      const values = headers.map(header => {
        // Format date for the dateAdded field
        if (header === 'dateAdded') {
          const date = new Date(row.dateAdded);
          return `"${date.toLocaleDateString()}"`;
        }
        
        const cellValue = row[header] === null || row[header] === undefined ? '' : row[header];
        // Escape quotes and wrap in quotes if it contains commas or quotes
        const escaped = typeof cellValue === 'string' && (cellValue.includes(',') || cellValue.includes('"')) 
          ? `"${cellValue.replace(/"/g, '""')}"` 
          : cellValue;
        return escaped;
      });
      return values.join(',');
    })
  ].join('\n');
  
  // Create a blob and download
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
