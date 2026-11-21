import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle, Loader2 } from 'lucide-react';
import { LEAD_SOURCES, LEAD_STATUSES, validateLeadForm } from '../../utils/validators.js';

export const LeadModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const isEditMode = Boolean(initialData && (initialData.id || initialData._id));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
    status: 'New'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        source: initialData.source || 'Website',
        status: initialData.status || 'New'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website',
        status: 'New'
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validation = validateLeadForm(formData);
    if (validation.errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validation.errors[name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        company: true,
        source: true,
        status: true
      });
      return;
    }

    onSubmit(formData, setErrors);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon">
              {isEditMode ? <Save size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 id="modal-title" className="modal-title">
                {isEditMode ? 'Edit Lead Details' : 'Create New Lead'}
              </h2>
              <p className="modal-subtitle">
                {isEditMode
                  ? 'Update contact info, company details, or deal status.'
                  : 'Add a new prospect to your sales pipeline.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="modal-body">
            {errors.general && (
              <div className="form-general-error">
                <AlertCircle size={16} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Name */}
            <div className="form-group">
              <label htmlFor="lead-name" className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                id="lead-name"
                name="name"
                type="text"
                className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`}
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.name && touched.name && (
                <span className="field-error-message">{errors.name}</span>
              )}
            </div>

            {/* Email & Phone in 2 cols */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="lead-email" className="form-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email && touched.email ? 'input-error' : ''}`}
                  placeholder="e.g. sarah@acme.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="field-error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lead-phone" className="form-label">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  className={`form-input ${errors.phone && touched.phone ? 'input-error' : ''}`}
                  placeholder="e.g. +1 (555) 234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                {errors.phone && touched.phone && (
                  <span className="field-error-message">{errors.phone}</span>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="form-group">
              <label htmlFor="lead-company" className="form-label">
                Company Name <span className="required-star">*</span>
              </label>
              <input
                id="lead-company"
                name="company"
                type="text"
                className={`form-input ${errors.company && touched.company ? 'input-error' : ''}`}
                placeholder="e.g. Acme Corporation"
                value={formData.company}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.company && touched.company && (
                <span className="field-error-message">{errors.company}</span>
              )}
            </div>

            {/* Source & Status in 2 cols */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="lead-source" className="form-label">
                  Lead Source <span className="required-star">*</span>
                </label>
                <select
                  id="lead-source"
                  name="source"
                  className="form-select"
                  value={formData.source}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {LEAD_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                {errors.source && touched.source && (
                  <span className="field-error-message">{errors.source}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lead-status" className="form-label">
                  Initial Status <span className="required-star">*</span>
                </label>
                <select
                  id="lead-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && touched.status && (
                  <span className="field-error-message">{errors.status}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  {isEditMode ? 'Saving Changes...' : 'Creating Lead...'}
                </>
              ) : (
                <>
                  {isEditMode ? <Save size={16} /> : <UserPlus size={16} />}
                  {isEditMode ? 'Save Changes' : 'Create Lead'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

