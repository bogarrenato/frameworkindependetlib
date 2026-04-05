import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';

/**
 * ff-data-table — framework-agnostic data table primitive.
 *
 * ## Architectural role
 * Owns column definitions, row rendering, sort state, and selection semantics.
 * Visual identity (zebra stripes, borders, header chrome, hover highlights, typography)
 * comes entirely from the token contract and brand pack. This file contains no
 * brand values, no Tailwind utility classes, and no inline style values that encode
 * visual decisions.
 *
 * ## SSR / SSG readiness contract
 *  1. This is one of the highest-value SSR components: tables are often the first
 *     visible content on an admin / analytics page, so shipping the full table
 *     HTML on first paint dramatically improves LCP and accessibility.
 *  2. render() is a pure function of props (columns, rows, sortKey, sortDirection).
 *     Zero DOM access. The hydrate module can serialize the table to HTML without
 *     any browser runtime.
 *  3. Sorting is computed from the current props — if `sortable` is true the
 *     component sorts the rows array in render(). The sort happens in Node during
 *     SSR as well, so server and client see the same row order. For large datasets
 *     consumers should pre-sort on the server and pass `sortable=false` to skip
 *     the client-side sort work.
 *  4. Selection state is controlled via the `selectedIds` prop. The component
 *     never stores selection internally except as a local highlight, which is
 *     regenerated from props on hydration.
 *  5. No ResizeObserver, no IntersectionObserver, no measurement in render().
 *     Column widths are driven by CSS grid templates provided through the columns
 *     prop's `width` field.
 *
 * ## Token contract inputs
 *  --ff-data-table-bg, --ff-data-table-header-bg, --ff-data-table-row-border,
 *  --ff-data-table-row-hover-bg, --ff-data-table-row-selected-bg,
 *  --ff-data-table-text, --ff-color-text-primary, --ff-font-family-brand
 */
export type FfDataTableColumn = {
  /** Unique identifier used for sorting and selection. */
  key: string;
  /** Visible column header text. */
  label: string;
  /** Optional CSS grid track size (e.g. "1fr", "120px", "minmax(80px, 1fr)"). */
  width?: string;
  /** When false, the column header will not be clickable for sorting. */
  sortable?: boolean;
  /** Alignment of both header and body cells. */
  align?: 'start' | 'center' | 'end';
};

export type FfDataTableRow = {
  /** Unique row identifier used for selection and trackBy semantics. */
  id: string | number;
  /** Column key → cell value map. Strings and numbers render as plain text. */
  [cellKey: string]: string | number | boolean | null | undefined;
};

type ParsedInput<T> = T[] | string;

@Component({
  tag: 'ff-data-table',
  styleUrl: 'ff-data-table.css',
  shadow: true
})
export class FfDataTable {
  /** Column definitions. Accept both JSON string (attribute) and array (property). */
  @Prop() columns: ParsedInput<FfDataTableColumn> = [];

  /** Row data. Accept both JSON string (attribute) and array (property). */
  @Prop() rows: ParsedInput<FfDataTableRow> = [];

  /** When true, header clicks toggle sort direction for sortable columns. */
  @Prop() sortable = true;

  /** Currently sorted column key (controlled). */
  @Prop({ mutable: true }) sortKey?: string;

  /** Current sort direction (controlled). */
  @Prop({ mutable: true }) sortDirection: 'asc' | 'desc' = 'asc';

  /** Selection mode. 'none' disables selection entirely. */
  @Prop() selectionMode: 'none' | 'single' | 'multiple' = 'none';

  /** Array of selected row ids (controlled). */
  @Prop({ mutable: true }) selectedIds: (string | number)[] | string = [];

  /** Message displayed when the rows array is empty. */
  @Prop() emptyLabel = 'No data to display.';

  /** Accessible caption for screen readers. */
  @Prop() ffCaption?: string;

  @State() internalSelection: Set<string | number> = new Set();

  @Event({ eventName: 'ffSortChange', bubbles: true, composed: true })
  ffSortChange!: EventEmitter<{ sortKey: string; sortDirection: 'asc' | 'desc' }>;

  @Event({ eventName: 'ffSelectionChange', bubbles: true, composed: true })
  ffSelectionChange!: EventEmitter<{ selectedIds: (string | number)[] }>;

  componentWillLoad() {
    // componentWillLoad runs on the server AND the client — safe for pure state sync.
    this.syncSelectionFromProp();
  }

  @Watch('selectedIds')
  watchSelectedIds() {
    this.syncSelectionFromProp();
  }

  private syncSelectionFromProp() {
    const parsed = this.parseList<string | number>(this.selectedIds);
    this.internalSelection = new Set(parsed);
  }

  private parseList<T>(input: ParsedInput<T>): T[] {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string' && input.trim().length > 0) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private get parsedColumns(): FfDataTableColumn[] {
    return this.parseList<FfDataTableColumn>(this.columns);
  }

  private get parsedRows(): FfDataTableRow[] {
    return this.parseList<FfDataTableRow>(this.rows);
  }

  private get displayRows(): FfDataTableRow[] {
    const rows = [...this.parsedRows];
    if (!this.sortable || !this.sortKey) return rows;
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    const key = this.sortKey;
    rows.sort((rowA, rowB) => {
      const valueA = rowA[key];
      const valueB = rowB[key];
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return -1 * direction;
      if (valueB == null) return 1 * direction;
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * direction;
      }
      return String(valueA).localeCompare(String(valueB)) * direction;
    });
    return rows;
  }

  private handleSort = (column: FfDataTableColumn) => () => {
    if (!this.sortable || column.sortable === false) return;
    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }
    this.ffSortChange.emit({ sortKey: this.sortKey, sortDirection: this.sortDirection });
  };

  private handleRowSelect = (row: FfDataTableRow) => (event: MouseEvent) => {
    if (this.selectionMode === 'none') return;
    event.stopPropagation();
    const next = new Set(this.internalSelection);
    if (this.selectionMode === 'single') {
      next.clear();
      next.add(row.id);
    } else {
      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.add(row.id);
      }
    }
    this.internalSelection = next;
    this.selectedIds = Array.from(next);
    this.ffSelectionChange.emit({ selectedIds: Array.from(next) });
  };

  render() {
    const columns = this.parsedColumns;
    const rows = this.displayRows;
    const gridTemplate = columns.map((column) => column.width ?? '1fr').join(' ');

    return (
      <Host class="ff-data-table-host" role="table" aria-label={this.ffCaption}>
        <div class="ff-data-table" part="table" style={{ '--ff-dt-grid-template': gridTemplate } as any}>
          <div class="ff-data-table__header" role="rowgroup" part="header">
            <div class="ff-data-table__row ff-data-table__row--header" role="row">
              {columns.map((column) => {
                const active = this.sortKey === column.key;
                return (
                  <div
                    class={{
                      'ff-data-table__cell': true,
                      'ff-data-table__cell--header': true,
                      [`ff-data-table__cell--align-${column.align ?? 'start'}`]: true,
                      'ff-data-table__cell--sortable':
                        this.sortable && column.sortable !== false,
                      'ff-data-table__cell--active-sort': active
                    }}
                    role="columnheader"
                    aria-sort={
                      active
                        ? this.sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    onClick={this.handleSort(column)}
                  >
                    <span>{column.label}</span>
                    {active ? (
                      <span class="ff-data-table__sort-indicator" aria-hidden="true">
                        {this.sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div class="ff-data-table__body" role="rowgroup" part="body">
            {rows.length === 0 ? (
              <div class="ff-data-table__empty" role="row">
                <div class="ff-data-table__cell ff-data-table__cell--empty" role="cell">
                  {this.emptyLabel}
                </div>
              </div>
            ) : (
              rows.map((row) => {
                const selected = this.internalSelection.has(row.id);
                return (
                  <div
                    class={{
                      'ff-data-table__row': true,
                      'ff-data-table__row--selected': selected,
                      'ff-data-table__row--selectable': this.selectionMode !== 'none'
                    }}
                    role="row"
                    aria-selected={selected ? 'true' : undefined}
                    onClick={this.handleRowSelect(row)}
                  >
                    {columns.map((column) => (
                      <div
                        class={{
                          'ff-data-table__cell': true,
                          [`ff-data-table__cell--align-${column.align ?? 'start'}`]: true
                        }}
                        role="cell"
                      >
                        {this.renderCellValue(row[column.key])}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Host>
    );
  }

  private renderCellValue(value: string | number | boolean | null | undefined): string {
    if (value == null) return '';
    if (typeof value === 'boolean') return value ? '✓' : '—';
    return String(value);
  }
}
