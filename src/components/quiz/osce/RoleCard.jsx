// src/components/quiz/osce/RoleCard.jsx
import MarkdownLite from './MarkdownLite';

export default function RoleCard({ title, body, locked = false }) {
  return (
    <div className="nm-inset osce-role-card">
      <div className="osce-role-card-head">
        <i className="fa-solid fa-id-card" aria-hidden="true" />
        <b>{title}</b>
      </div>
      {locked ? (
        <p className="osce-role-locked">
          <i className="fa-solid fa-lock" aria-hidden="true" /> Terkunci sampai hasil
        </p>
      ) : (
        <MarkdownLite text={body} />
      )}
    </div>
  );
}
