import { memo, useCallback, useState } from "react";

export default function CustomForm({
  title,
  breadcrumb,
  fields = [],
  values = {},
  onChange,
  onSubmit,
  onClose,
  onBack,
  backLabel = "Back",
  submitLabel = "Create",
  readOnly = false,
  viewMode = false,
  loading = false,
  extraActions = [],
  hideActions = false,
}) {
  const isView = viewMode || readOnly;
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    fields.forEach((field) => {
      const value = values[field.name];
      
      // Required field validation
      if (
        field.required &&
        field.type !== "switch" &&
        (value === undefined ||
          value === null ||
          value.toString().trim() === "")
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === "email" && value && !emailRegex.test(value)) {
        newErrors[field.name] = `${field.label} must be a valid email address`;
      }
      
      // Phone validation
      if (field.type === "tel" && value && !phoneRegex.test(value)) {
        newErrors[field.name] = `${field.label} must be exactly 10 digits`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback(
    (name, value) => {
      if (isView) return;
      onChange?.(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    },
    [isView, onChange]
  );

  return (
    <div className="cf-container">
      {/* ── Page header ── */}
      <div className="cf-page-header">
        <div className="cf-header-content">
          {breadcrumb && (
            <nav className="cf-breadcrumb-nav">
              {breadcrumb.split("/").map((crumb, i, arr) => (
                <span key={i} className="cf-breadcrumb-item">
                  <span
                    className={i === arr.length - 1 ? "cf-breadcrumb-active" : ""}
                  >
                    {crumb.trim()}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="cf-breadcrumb-sep">›</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="cf-page-title">{title}</h1>
        </div>
        {onBack && (
          <button
            className="cf-back-btn"
            onClick={onBack}
            disabled={loading}
            title={backLabel}
          >
            <span className="cf-back-icon">←</span>
            {backLabel}
          </button>
        )}
      </div>

      {/* ── Form card ── */}
      <div className="cf-card">
        <div className="cf-form-body">
          <div className="row g-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                error={errors[field.name]}
                readOnly={isView}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* ── Bottom action buttons ── */}
          {!isView && !hideActions && (
            <div className="cf-actions">
              {extraActions.map((ea) => (
                <button
                  key={ea.label}
                  className="cf-btn cf-btn-extra"
                  onClick={ea.onClick}
                  disabled={ea.disabled || loading}
                >
                  {ea.label}
                </button>
              ))}
              <button
                className="cf-btn cf-btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="cf-btn cf-btn-submit"
                onClick={() => {
                  if (validateForm()) {
                    onSubmit?.();
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="cf-spinner"></span>
                    {submitLabel === "Create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            </div>
          )}
          {isView && onClose && (
            <div className="cf-actions">
              <button
                className="cf-btn cf-btn-cancel"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGridSize(field) {
  if (field.grid) return field.grid;
  if (field.type === "textarea" || field.type === "switch") return "col-12";
  return "col-12 col-md-4";
}

const FormField = memo(function FormField({
  field,
  value,
  readOnly,
  onChange,
  error,
}) {
  const isDisabled = !readOnly && field.disabled;
  const isReadOnly = readOnly || field.disabled;
  const size = getGridSize(field);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  /* ── Switch ── */
  if (field.type === "switch") {
    const isOn = Boolean(value);
    return (
      <div className={`${size}`}>
        <div className="cf-switch-wrapper">
          <label className="cf-field-label">
            {field.label}
            {field.required && <span className="cf-required"> *</span>}
          </label>
          <div className="cf-switch-row">
            <div
              className={`cf-toggle-pill${isOn ? " cf-toggle-pill--on" : " cf-toggle-pill--off"}${isReadOnly ? " cf-toggle-pill--disabled" : ""}`}
              onClick={() => !isReadOnly && onChange(field.name, !isOn)}
              role="switch"
              aria-checked={isOn}
              tabIndex={isReadOnly ? -1 : 0}
              onKeyDown={(e) => {
                if (!isReadOnly && (e.key === " " || e.key === "Enter")) {
                  e.preventDefault();
                  onChange(field.name, !isOn);
                }
              }}
            >
              <div className="cf-toggle-thumb" />
            </div>
            <div
              className={`cf-toggle-badge${isOn ? " cf-toggle-badge--on" : " cf-toggle-badge--off"}`}
            >
              {isOn ? "● Active" : "○ Inactive"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Select ── */
  if (field.type === "select") {
    return (
      <div className={`${size}`}>
        <label className="cf-field-label">
          {field.label}
          {field.required && <span className="cf-required"> *</span>}
        </label>
        <select
          className={`form-select cf-input${error ? " is-invalid" : ""}${readOnly ? " cf-input--view" : ""}`}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          disabled={isDisabled || isReadOnly}
        >
          <option value="">{field.placeholder || `Select ${field.label}`}</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <div className="invalid-feedback d-block">{error}</div>}
        {field.helperText && !error && (
          <small className="form-text text-muted">{field.helperText}</small>
        )}
      </div>
    );
  }

  /* ── Textarea ── */
  if (field.type === "textarea") {
    return (
      <div className={`${size}`}>
        <div className="cf-textarea-header d-flex justify-content-between align-items-center mb-2">
          <label className="cf-field-label">
            {field.label}
            {field.required && <span className="cf-required"> *</span>}
          </label>
          {field.headerAction && !readOnly && (
            <button
              className="btn btn-sm btn-primary cf-textarea-action-btn"
              onClick={field.headerAction.onClick}
            >
              {field.headerAction.label}
            </button>
          )}
        </div>
        <textarea
          className={`form-control cf-input${error ? " is-invalid" : ""}${readOnly ? " cf-input--view" : ""}`}
          rows={field.rows ?? 4}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          disabled={isDisabled}
          placeholder={field.placeholder}
          readOnly={isReadOnly}
          ref={field.inputRef}
        />
        {error && <div className="invalid-feedback d-block">{error}</div>}
        {field.helperText && !error && (
          <small className="form-text text-muted">{field.helperText}</small>
        )}
      </div>
    );
  }

  /* ── File Upload ── */
  if (field.type === "file-upload") {
    const fileUrl =
      typeof value === "string"
        ? value
        : value instanceof File
          ? URL.createObjectURL(value)
          : null;

    return (
      <>
        <div className={`${size}`}>
          <label className="cf-field-label">
            {field.label}
            {field.required && <span className="cf-required"> *</span>}
          </label>
          <input
            type="text"
            className="form-control cf-input cf-input--view"
            value={typeof value === "string" ? value.split("/").pop() : value?.name || ""}
            readOnly
          />
          {fileUrl && (
            <button
              className="btn btn-sm btn-outline-primary mt-2"
              onClick={() => setOpen(true)}
            >
              👁 View
            </button>
          )}
        </div>
        {open && (
          <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Preview</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <div className="modal-body text-center">
                  <img
                    src={fileUrl}
                    alt="preview"
                    style={{ maxWidth: "100%", maxHeight: "500px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /* ── Password with visibility toggle ── */
  if (field.type === "password-toggle") {
    return (
      <div className={`${size}`}>
        <label className="cf-field-label">
          {field.label}
          {field.required && <span className="cf-required"> *</span>}
        </label>
        <div className="input-group">
          <input
            type={show ? "text" : "password"}
            className={`form-control cf-input${error ? " is-invalid" : ""}${readOnly ? " cf-input--view" : ""}`}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            disabled={isDisabled}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            maxLength={field.maxLength}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setShow((prev) => !prev)}
            tabIndex={-1}
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>
        {error && <div className="invalid-feedback d-block">{error}</div>}
        {field.helperText && !error && (
          <small className="form-text text-muted">{field.helperText}</small>
        )}
      </div>
    );
  }

  /* ── Default (text / email / number / date) ── */
  return (
    <div className={`${size}`}>
      <label className="cf-field-label">
        {field.label}
        {field.required && <span className="cf-required"> *</span>}
      </label>
      <div className="input-group">
        {field.startIcon && (
          <span className="input-group-text">{field.startIcon}</span>
        )}
        <input
          type={field.type ?? "text"}
          className={`form-control cf-input${error ? " is-invalid" : ""}${readOnly ? " cf-input--view" : ""}`}
          value={value}
          onChange={(e) => {
            let inputValue = e.target.value;
            
            // Phone validation: only numbers, max 10 digits
            if (field.type === "tel") {
              inputValue = inputValue.replace(/\D/g, "").slice(0, 10);
            }
            
            onChange(field.name, inputValue);
          }}
          onBlur={(e) => {
            // Email validation on blur
            if (field.type === "email" && e.target.value) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(e.target.value)) {
                // Error will be shown by parent validation
              }
            }
          }}
          disabled={isDisabled}
          placeholder={field.placeholder}
          readOnly={isReadOnly}
          maxLength={field.type === "tel" ? 10 : field.maxLength}
          inputMode={field.type === "tel" ? "numeric" : "text"}
        />
        {field.endIcon && (
          <span className="input-group-text">{field.endIcon}</span>
        )}
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      {field.helperText && !error && (
        <small className="form-text text-muted">{field.helperText}</small>
      )}
    </div>
  );
});
