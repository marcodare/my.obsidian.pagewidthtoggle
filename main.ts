import { ItemView, Plugin, setIcon } from "obsidian";
import { applyFullWidth, DEFAULT_STATE, parseState, type PluginState } from "./src/width-toggle";

const ICON_EXPAND = "maximize-2";
const ICON_COLLAPSE = "minimize-2";
const TITLE_EXPAND = "Expand page to full width";
const TITLE_COLLAPSE = "Restore default page width";

export default class MyObsidianPageWidthPlugin extends Plugin {
  private state: PluginState = DEFAULT_STATE;
  private ribbonEl: HTMLElement | null = null;
  private readonly actionEls = new Map<ItemView, HTMLElement>();

  override async onload(): Promise<void> {
    this.state = parseState(await this.loadData());

    this.ribbonEl = this.addRibbonIcon(ICON_EXPAND, TITLE_EXPAND, () => void this.toggle());
    this.addCommand({
      id: "toggle-full-width",
      name: "Toggle full page width",
      callback: () => void this.toggle(),
    });

    this.registerEvent(this.app.workspace.on("layout-change", () => this.syncActions()));
    this.registerEvent(
      this.app.workspace.on("window-open", (_win, window) =>
        applyFullWidth(window.document.body, this.state.fullWidth),
      ),
    );
    this.app.workspace.onLayoutReady(() => this.render());
  }

  override onunload(): void {
    applyFullWidth(document.body, false);
    this.app.workspace.iterateAllLeaves((leaf) =>
      applyFullWidth(leaf.view.containerEl.ownerDocument.body, false),
    );
    for (const el of this.actionEls.values()) el.remove();
    this.actionEls.clear();
  }

  private async toggle(): Promise<void> {
    this.state = { fullWidth: !this.state.fullWidth };
    this.render();
    await this.saveData(this.state);
  }

  private render(): void {
    const { fullWidth } = this.state;
    applyFullWidth(document.body, fullWidth);
    this.app.workspace.iterateAllLeaves((leaf) =>
      applyFullWidth(leaf.view.containerEl.ownerDocument.body, fullWidth),
    );
    if (this.ribbonEl) this.updateButton(this.ribbonEl);
    this.syncActions();
  }

  /** Adds the header button to every main-area view that lacks one and refreshes existing ones. */
  private syncActions(): void {
    const { workspace } = this.app;

    for (const [view, el] of this.actionEls) {
      if (!el.isConnected) this.actionEls.delete(view);
    }

    workspace.iterateAllLeaves((leaf) => {
      const root = leaf.getRoot();
      if (root === workspace.leftSplit || root === workspace.rightSplit) return;
      const view = leaf.view;
      if (!(view instanceof ItemView) || this.actionEls.has(view)) return;
      this.actionEls.set(
        view,
        view.addAction(ICON_EXPAND, TITLE_EXPAND, () => void this.toggle()),
      );
    });

    for (const el of this.actionEls.values()) this.updateButton(el);
  }

  private updateButton(el: HTMLElement): void {
    const { fullWidth } = this.state;
    const title = fullWidth ? TITLE_COLLAPSE : TITLE_EXPAND;
    setIcon(el, fullWidth ? ICON_COLLAPSE : ICON_EXPAND);
    el.setAttribute("aria-label", title);
  }
}
