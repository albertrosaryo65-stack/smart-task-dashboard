import { useState, useEffect } from "react";
import { RotateCcw, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { EMAIL_TEMPLATE_META, EMAIL_TEMPLATE_SAMPLE_VALUES } from "../../utils/constants";
import { renderTemplateString } from "../../services/emailTemplateService";

// One collapsible template: closed by default (name/description only),
// expands to an editor with a live preview rendered from sample data.
export default function EmailTemplateEditor({ templateKey, template, isOpen, onToggle, onSave, onReset }) {
  const meta = EMAIL_TEMPLATE_META[templateKey];
  const sampleValues = EMAIL_TEMPLATE_SAMPLE_VALUES[templateKey];
  const [subject, setSubject] = useState(template?.subject || "");
  const [body, setBody] = useState(template?.body || "");
  const [saved, setSaved] = useState(false);

  // Resync local draft whenever the saved template changes underneath us
  // (after a save or reset triggers a context refresh).
  useEffect(() => {
    setSubject(template?.subject || "");
    setBody(template?.body || "");
  }, [template?.subject, template?.body]);

  const isDirty = subject !== template?.subject || body !== template?.body;

  function handleSave() {
    onSave({ subject, body });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleReset() {
    onReset();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="card mb-8" style={{ padding: 0, overflow: "hidden" }}>
      <button
        className="flex-between"
        style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        onClick={onToggle}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{meta.label}</div>
          <div className="text-muted text-sm">{meta.description}</div>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--color-border)" }}>
          <div className="flex-gap mt-16 mb-16" style={{ flexWrap: "wrap" }}>
            {meta.placeholders.map((p) => (
              <span key={p} className="badge badge-gray" style={{ fontFamily: "monospace" }}>{p}</span>
            ))}
          </div>

          <div className="grid-2" style={{ alignItems: "start", gap: 20 }}>
            <div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Body</label>
                <textarea
                  className="form-textarea"
                  rows={7}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  style={{ fontFamily: "monospace", fontSize: 13 }}
                />
              </div>

              <div className="flex-gap">
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!isDirty}>
                  Save Template
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset to default">
                  <RotateCcw size={14} /> Reset
                </button>
                {saved && <span className="text-sm" style={{ color: "var(--color-success)" }}>Saved.</span>}
              </div>
            </div>

            <div>
              <div className="flex-gap text-sm text-muted mb-8" style={{ fontWeight: 600 }}>
                <Eye size={14} /> Live Preview
              </div>
              <div className="email-preview">
                <div className="email-preview-subject">
                  {renderTemplateString(subject, sampleValues)}
                </div>
                <div className="email-preview-body">
                  {renderTemplateString(body, sampleValues)}
                </div>
              </div>
              <div className="text-muted text-sm mt-8">Preview uses sample data — not sent anywhere.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
