import React, { useState } from 'react';

function UploadDocuments() {
  const [employeeId, setEmployeeId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e, docType) => {
    setSelectedFiles({ ...selectedFiles, [docType]: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!employeeId) {
      setError("Please enter Employee/Trucker ID.");
      return;
    }

    const uploadPromises = Object.keys(selectedFiles).map(async (docType) => {
      const file = selectedFiles[docType];
      if (file) {
        const formData = new FormData();
        formData.append('employee_id', employeeId);
        formData.append('document_type', docType);
        formData.append('file', file);

        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/documents/`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to upload ${docType}: ${errorData.detail || response.statusText}`);
          }
          return `${docType} uploaded successfully.`;
        } catch (err) {
          throw new Error(`Error uploading ${docType}: ${err.message}`);
        }
      }
      return null;
    });

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results.filter(res => res.status === 'fulfilled' && res.value !== null);
      const failedUploads = results.filter(res => res.status === 'rejected');

      if (successfulUploads.length > 0) {
        setMessage('Documents uploaded successfully: ' + successfulUploads.map(res => res.value).join(', '));
        setSelectedFiles({});
        setEmployeeId('');
      }
      if (failedUploads.length > 0) {
        setError('Some documents failed to upload: ' + failedUploads.map(res => res.reason.message).join('; '));
      }
      if (successfulUploads.length === 0 && failedUploads.length === 0) {
          setError("No files selected for upload.");
      }
    } catch (err) {
      setError('An unexpected error occurred during upload.');
    }
  };

  return (
    <div className="form-card">
      <h2>Upload Trucker Documents</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Trucker/Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        {[
          'Driving License Scan',
          'Truck ID Scan',
          'Vehicle Logbook',
          'Fitness Certificate',
          'Road Permit',
          'Medical Records'
        ].map((docType) => (
          <div key={docType} className="file-input-group">
            <label htmlFor={docType.toLowerCase().replace(/\s/g, '_')}>{docType}</label>
            <input
              type="file"
              id={docType.toLowerCase().replace(/\s/g, '_')}
              onChange={(e) => handleFileChange(e, docType.toLowerCase().replace(/\s/g, '_'))}
            />
            <span>{selectedFiles[docType.toLowerCase().replace(/\s/g, '_')]?.name || 'No file chosen'}</span>
          </div>
        ))}
        <button type="submit">Upload</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <p className="info-note">
        <i className="icon">🚚</i> <strong>Truckers:</strong> Please ensure your <strong>vehicle registration papers</strong> and <strong>commercial driving license</strong> are included in the document scans.
      </p>
      <p className="info-note">
        <i className="icon">🛠️</i> Regularly updated <strong>fitness certificates</strong> and <strong>logbooks</strong> help speed up verification.
      </p>
      <p className="fun-fact">
        <i className="icon">💡</i> Fun Fact: Long-haul truckers in India average over <strong>4000 km of highway every week</strong>. Document compliance helps keep them moving smoothly!
      </p>
    </div>
  );
}

export default UploadDocuments;
