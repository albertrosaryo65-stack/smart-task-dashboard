import { useState } from "react";
import { getSettings, updateSettings } from "../services/settingsService";
import { useApp } from "../context/AppContext";
import { canManageEmailTemplates } from "../utils/permissions";
import { EMAIL_TEMPLATE_KEYS } from "../utils/constants";
import EmailTemplateEditor from "../components/settings/EmailTemplateEditor";
import EmailLogPanel from "../components/settings/EmailLogPanel";

export default function Settings() {
  const { currentUser, emailTemplates, emailLog, updateEmailTemplate, resetEmailTemplate } = useApp();
  const canEditTemplates = canManageEmailTemplates(currentUser);
  const [settings, setSettings] = useState(getSettings());
  const [saved, setSaved] = useState(false);

  const TABS = canEditTemplates
    ? ["Preferences", "Email Templates", "Email Log"]
    : ["Preferences", "Email Log"];
  const [activeTab, setActiveTab] = useState("Preferences");
  const [openTemplateKey, setOpenTemplateKey] = useState(Object.values(EMAIL_TEMPLATE_KEYS)[0]);

  function toggle(field) {
    const updated = updateSettings({ [field]: !settings[field] });
    setSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your application preferences.</p>
        </div>
      </div>

      <div className="tabs mb-16">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Preferences" && (
        <div className="card card-padded" style={{ maxWidth: 520 }}>
          <h3 className="section-title">Notifications</h3>

          <div className="flex-between mb-16">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>In-app Notifications</div>
              <div className="text-muted text-sm">Receive notifications for task assignments and updates.</div>
            </div>
            <label className="checkbox-pill" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={() => toggle("notificationsEnabled")}
                style={{ display: "none" }}
              />
              <span className={settings.notificationsEnabled ? "" : "text-muted"}>
                {settings.notificationsEnabled ? "On" : "Off"}
              </span>
            </label>
          </div>

          <div className="flex-between">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Email Alerts</div>
              <div className="text-muted text-sm">Receive email alerts for deadline reminders (demo only).</div>
            </div>
            <label className="checkbox-pill" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={() => toggle("emailAlerts")}
                style={{ display: "none" }}
              />
              <span className={settings.emailAlerts ? "" : "text-muted"}>
                {settings.emailAlerts ? "On" : "Off"}
              </span>
            </label>
          </div>

          {saved && <p className="text-sm mt-16" style={{ color: "var(--color-success)" }}>Preferences saved.</p>}
        </div>
      )}

      {activeTab === "Email Templates" && canEditTemplates && (
        <div style={{ maxWidth: 920 }}>
          <p className="text-muted text-sm mb-16">
            Edit the subject and body sent when a task or project's status changes. No real email is sent —
            this demo app has no backend/SMTP integration, so a "send" is simulated and recorded in the Email
            Log tab.
          </p>
          {Object.keys(EMAIL_TEMPLATE_KEYS).map((k) => {
            const key = EMAIL_TEMPLATE_KEYS[k];
            return (
              <EmailTemplateEditor
                key={key}
                templateKey={key}
                template={emailTemplates[key]}
                isOpen={openTemplateKey === key}
                onToggle={() => setOpenTemplateKey(openTemplateKey === key ? null : key)}
                onSave={(updates) => updateEmailTemplate(key, updates)}
                onReset={() => resetEmailTemplate(key)}
              />
            );
          })}
        </div>
      )}

      {activeTab === "Email Log" && (
        <div>
          <p className="text-muted text-sm mb-16">Simulated emails sent when a task or project status changes.</p>
          <EmailLogPanel emails={emailLog} />
        </div>
      )}
    </div>
  );
}
