import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function CustomTable({
  title,
  breadcrumb,
  columns = [],
  data = [],
  actions = [],
  topActions = [],
  totalCount,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
}) {
  // row-level action menu
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRefs = useRef({});

  const handleMenuOpen = (rowId, event) => {
    event.stopPropagation();
    if (openMenuId === rowId) {
      setOpenMenuId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 140,
      });
      setOpenMenuId(rowId);
    }
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  const handleAction = (action, row) => {
    action.onClick(row);
    handleMenuClose();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is on the menu button or dropdown
      const isMenuButton = Object.values(menuRefs.current).some(ref => ref?.contains(e.target));
      const isDropdownItem = e.target.closest('.ct-action-dropdown');
      
      if (openMenuId && !isMenuButton && !isDropdownItem) {
        handleMenuClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const isServerPagination = typeof onPageChange === "function";
  const count = totalCount ?? data.length;
  const rows = isServerPagination
    ? Array.isArray(data)
      ? data
      : []
    : (Array.isArray(data) ? data : []).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

  return (
    <div className="ct-container">
      {/* ── Page header ── */}
      <div className="ct-page-header">
        <div>
          {breadcrumb && (
            <p className="ct-breadcrumb text-muted mb-2">{breadcrumb}</p>
          )}
          {title && <h1 className="ct-page-title">{title}</h1>}
        </div>
        {topActions.length > 0 && (
          <div className="ct-top-actions">
            {topActions.map((ta) => (
              <button
                key={ta.label}
                className="btn btn-primary ct-action-btn-top"
                disabled={ta.disabled}
                onClick={ta.onClick}
              >
                {ta.icon && <span className="ct-top-menu-icon me-2">{ta.icon}</span>}
                {ta.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Table card ── */}
      <div className="card ct-paper">
        <div className="table-responsive ct-container">
          <table className="table table-hover ct-table mb-0">
            <thead className="table-light">
              <tr className="ct-head-row">
                {/* S.No column */}
                <th className="ct-head-cell ct-sno-cell">S.No</th>
                {columns.map((col) => (
                  <th key={col.key} className="ct-head-cell">
                    {col.label}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="ct-head-cell ct-head-cell--center" style={{ width: 48 }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                    className="ct-empty-cell text-center py-4"
                  >
                    <div className="ct-loading-wrap">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="ct-loading-text mt-2">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                    className="ct-empty-cell text-center py-4"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row.id ?? idx} className="ct-body-row">
                    {/* S.No */}
                    <td className="ct-body-cell ct-sno-cell">
                      {page * rowsPerPage + idx + 1}
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="ct-body-cell">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="ct-body-cell ct-body-cell--center" style={{ width: 60 }}>
                        <div className="ct-action-menu-wrapper">
                          <button
                            className="ct-action-menu-btn"
                            onClick={(e) => handleMenuOpen(row.id, e)}
                            ref={(el) => (menuRefs.current[row.id] = el)}
                            title="More actions"
                          >
                            <span className="ct-dots-icon">⋮</span>
                          </button>
                          {openMenuId === row.id &&
                            createPortal(
                              <div
                                className="ct-action-dropdown"
                                style={{
                                  position: "absolute",
                                  top: `${menuPosition.top}px`,
                                  left: `${menuPosition.left}px`,
                                  zIndex: 1000,
                                }}
                              >
                                {actions.map((action, actionIdx) => (
                                  <button
                                    key={`${action.label}-${actionIdx}`}
                                    className={`ct-action-item ${action.color === "error" ? "ct-action-item--danger" : ""}`}
                                    onClick={() => handleAction(action, row)}
                                  >
                                    <span className="ct-action-icon">
                                      {action.label === "View" && "👁"}
                                      {action.label === "Edit" && "✏️"}
                                      {action.label === "Delete" && "🗑"}
                                    </span>
                                    <span className="ct-action-label">{action.label}</span>
                                  </button>
                                ))}
                              </div>,
                              document.body
                            )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <CustomPagination
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) =>
            isServerPagination ? onPageChange(newPage) : onPageChange?.(newPage)
          }
          onRowsPerPageChange={(val) => onRowsPerPageChange?.(val)}
        />
      </div>
    </div>
  );
}

/**
 * CustomPagination — matches table design
 * Left: "Showing X to Y of Z entries" + rows-per-page select
 * Right: prev | numbered pages | next
 */
function CustomPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage + rowsPerPage, count);
  const [rppOpen, setRppOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const rppRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        rppRef.current &&
        !rppRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setRppOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (rppRef.current) {
      const rect = rppRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setRppOpen((o) => !o);
  };

  // build page number buttons — show up to 5 around current page
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(0, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="ct-pagination-wrap d-flex justify-content-between align-items-center p-3 border-top">
      {/* Left side */}
      <div className="ct-pagination-left d-flex align-items-center gap-3">
        <span className="ct-pagination-info text-muted">
          Showing {from} to {to} of {count} entries
        </span>
        <div className="ct-pagination-rpp d-flex align-items-center gap-2">
          <span className="text-muted">Rows per page:</span>
          <div className="ct-pagination-select-wrap" ref={rppRef}>
            <div
              className={`ct-pagination-select btn btn-sm btn-outline-secondary${rppOpen ? " active" : ""}`}
              onClick={handleOpen}
              style={{ cursor: "pointer" }}
            >
              <span>{rowsPerPage}</span>
              <span className="ms-2">▼</span>
            </div>
            {rppOpen &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className="ct-pagination-dropdown dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    minWidth: dropdownPos.width,
                    display: "block",
                  }}
                >
                  {[10, 25, 50].map((n) => (
                    <button
                      key={n}
                      className={`dropdown-item ct-pagination-option${n === rowsPerPage ? " active" : ""}`}
                      onClick={() => {
                        onRowsPerPageChange(n);
                        onPageChange(0);
                        setRppOpen(false);
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="ct-pagination-right d-flex align-items-center gap-1">
        <button
          className="btn btn-sm btn-outline-secondary ct-pagination-nav"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          ← Prev
        </button>
        {getPageNumbers().map((p) => (
          <button
            key={p}
            className={`btn btn-sm ct-pagination-page${p === page ? " btn-primary" : " btn-outline-secondary"}`}
            onClick={() => onPageChange(p)}
          >
            {p + 1}
          </button>
        ))}
        <button
          className="btn btn-sm btn-outline-secondary ct-pagination-nav"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/**
 * StatusBadge — renders a coloured pill chip
 * status: "active" | "inactive" | "pending" | "approve" | "reject" | "yes" | "no"
 */
export function StatusBadge({ status }) {
  const map = {
    active: "bg-success",
    inactive: "bg-secondary",
    pending: "bg-warning",
    approve: "bg-success",
    reject: "bg-danger",
    yes: "bg-success",
    no: "bg-danger",
    info: "bg-info",
  };
  const cls = map[(status ?? "").toLowerCase()] ?? "bg-secondary";
  return (
    <span className={`badge ${cls} ct-badge`}>
      {status}
    </span>
  );
}

/**
 * UserCell — renders initials avatar + name
 */
export function UserCell({ name, avatarUrl }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";
  return (
    <div className="ct-user-cell d-flex align-items-center gap-2">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="ct-avatar ct-avatar--img rounded-circle"
          style={{ width: 32, height: 32 }}
        />
      ) : (
        <div
          className="ct-avatar ct-avatar--initials rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, fontSize: 12, fontWeight: "bold" }}
        >
          {initials}
        </div>
      )}
      <span className="ct-user-name">{name}</span>
    </div>
  );
}
