export const DIALOG_KEY = {
  METADATA_EDIT_MENU: 'METADATA_EDIT_MENU',
  METADATA_DELETE: 'METADATA_DELETE',
} as const;

export type DialogKey = keyof typeof DIALOG_KEY;
