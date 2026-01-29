import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

let mainWindow: BrowserWindow | null = null;
const windowStatePath = path.join(app.getPath('userData'), 'window-state.json');

const readWindowState = () => {
  try {
    if (!existsSync(windowStatePath)) return null;
    const raw = readFileSync(windowStatePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.width === 'number' &&
      typeof parsed?.height === 'number' &&
      typeof parsed?.x === 'number' &&
      typeof parsed?.y === 'number'
    ) {
      return parsed as { x: number; y: number; width: number; height: number };
    }
  } catch (error) {
    return null;
  }
  return null;
};

const saveWindowState = (window: BrowserWindow) => {
  const bounds = window.isMaximized() || window.isFullScreen()
    ? window.getNormalBounds()
    : window.getBounds();
  const payload = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  };
  try {
    writeFileSync(windowStatePath, JSON.stringify(payload));
  } catch (error) {
    return;
  }
};

function createWindow() {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  const savedBounds = readWindowState();
  mainWindow = new BrowserWindow({
    width: savedBounds?.width ?? 1200,
    height: savedBounds?.height ?? 800,
    x: savedBounds?.x,
    y: savedBounds?.y,
    frame: false, // Make window borderless
    titleBarStyle: 'hidden', // On macOS, this hides the title bar but keeps traffic lights
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Allow loading local files for development
    },
    backgroundColor: '#121212',
  });

  // IPC handlers for custom window controls
  ipcMain.on('window-minimize', () => mainWindow?.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow?.close());

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  mainWindow.on('close', () => {
    if (mainWindow) saveWindowState(mainWindow);
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('open-file-dialog', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac', 'ogg', 'm4a'] }
    ]
  });
  return result.filePaths;
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
