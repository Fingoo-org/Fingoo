export const DIALOG_KEY = {
  METADATA_EDIT_MENU: 'METADATA_EDIT_MENU',
} as const;

export type DialogMenuKey = keyof typeof DIALOG_KEY;
