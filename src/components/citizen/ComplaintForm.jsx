import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateComplaint } from '../../services/openai';
import { submitGrievance } from '../../services/api';
import { Send, Sparkles, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import styles from './ComplaintForm.module.css';

const ComplaintForm = ({ constituency, onGrievanceSubmitted }) => {
    const { currentUser } = useAuth();
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState(null);
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleValidation = async () => {
        if (description.length < 10) return;
        setValidating(true);
        setValidationResult(null);
        try {
            const result = await validateComplaint(description);
            setValidationResult(result);
            if (result.isValid && result.category) {
                setCategory(result.category);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setValidating(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Helper to convert file to Base64 (for MVP simplicity vs Storage rules)
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e) => {
        // ... validation

        setSubmitting(true);
        try {
            let fileData = null;
            if (file) {
                try {
                    fileData = await toBase64(file);
                } catch (e) {
                    console.error("File upload error", e);
                    alert("Error processing file. Please try a smaller image.");
                    setSubmitting(false);
                    return;
                }
            }

            const grievanceData = {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                description,
                category,
                constituency: constituency,
                status: 'Open',
                attachment: fileData,
                fileName: file ? file.name : null
            };

            console.log("Submitting grievance to backend...", grievanceData);
            const response = await submitGrievance(grievanceData);
            console.log("Backend response:", response);

            // ... success handling
            setSuccess(true);
            alert("Grievance Submitted Successfully!");

            // Refresh parent stats
            if (onGrievanceSubmitted) {
                onGrievanceSubmitted();
            }

            setDescription('');
            setCategory('');
            setFile(null);
            setValidationResult(null);
        } catch (error) {
            console.error("Error submitting grievance:", error);
            alert(`Failed to submit: ${error.message}. Check console for details.`);
        } finally {
            setSubmitting(false);
        }
    };

    if (!constituency) return null;

    if (success) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <CheckCircle2 size={48} className="text-success" style={{ margin: '0 auto 1rem' }} />
                <h3>Grievance Submitted</h3>
                <p className="text-muted">Your representative has been notified.</p>
                <button className="btn btn-outline" onClick={() => setSuccess(false)} style={{ marginTop: '1.5rem' }}>
                    File Another
                </button>
            </div>
        )
    }

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>File a Grievance</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                        rows={5}
                        placeholder="Describe your issue in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={handleValidation}
                        className={styles.textarea}
                        required
                    />
                    {validating && <span className={styles.helper}><Sparkles size={12} /> AI is analyzing...</span>}

                    {validationResult && !validationResult.isValid && (
                        <div className={`${styles.feedback} ${styles.error}`}>
                            <AlertCircle size={16} /> {validationResult.feedback}
                        </div>
                    )}
                    {validationResult && validationResult.isValid && (
                        <div className={`${styles.feedback} ${styles.success}`}>
                            <CheckCircle2 size={16} /> Looks clear! Suggested Category: <strong>{validationResult.category}</strong>
                        </div>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.select}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Water">Water Supply</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Attachment (Optional)</label>
                    <div className={styles.fileWrapper}>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,application/pdf"
                            className={styles.fileInput}
                        />
                        <div className={styles.filePseudo}>
                            <Upload size={16} /> {file ? file.name : "Choose a file..."}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || (validationResult && !validationResult.isValid)}
                    style={{ marginTop: '1rem', width: '100%' }}
                >
                    {submitting ? 'Submitting...' : <>Submit Grievance <Send size={16} /></>}
                </button>
            </form>
        </div>
    );
};

export default ComplaintForm;
