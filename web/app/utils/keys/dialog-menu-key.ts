export const DIALOG_MENU_KEY = {
  metadataEditMenu: 'metadataEditMenu',
} as const;

export type DialogMenuKey = keyof typeof DIALOG_MENU_KEY;
