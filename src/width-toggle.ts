export const FULL_WIDTH_CLASS = "my-obsidian-page-width-full";

export interface PluginState {
  readonly fullWidth: boolean;
}

export const DEFAULT_STATE: PluginState = { fullWidth: false };

/** Validates persisted data at the boundary; anything malformed falls back to defaults. */
export function parseState(raw: unknown): PluginState {
  if (typeof raw === "object" && raw !== null && "fullWidth" in raw) {
    const { fullWidth } = raw as { fullWidth: unknown };
    if (typeof fullWidth === "boolean") return { fullWidth };
  }
  return DEFAULT_STATE;
}

export function applyFullWidth(body: HTMLElement, enabled: boolean): void {
  body.classList.toggle(FULL_WIDTH_CLASS, enabled);
}
