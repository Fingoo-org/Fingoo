'use client';

import * as ResizablePrimitive from 'react-resizable-panels';
import { ResizablePanelGroupHandle } from './resizable-panel-group-handle';
import { ResizablePanelGroupRoot } from './resizable-panel-group-root';

const ResizablePanel = ResizablePrimitive.Panel;

const ResizablePanelGroup = Object.assign(ResizablePanelGroupRoot, {
  Handle: ResizablePanelGroupHandle,
  Panel: ResizablePanel,
});

export default ResizablePanelGroup;
