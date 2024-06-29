import { createContext } from 'react';

export type UserEvent =
  | 'click_metadata_item'
  | 'click_metadata_create_button'
  | 'click_screen_split_toggle'
  | 'click_axis_create_button'
  | 'click_axis_delete_button'
  | 'click_sidebar_toggle'
  | 'submit_gpt_form'
  | 'click_ad_banner'
  | 'GPT_create_metadata'
  | 'open_sidebar'
  | 'close_sidebar'
  | 'toast_error';

export type UserTracker = {
  track(event: UserEvent, properties?: Record<string, unknown>): void;
};

export const LoggingContext = createContext<UserTracker | null>(null);
