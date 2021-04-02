const path = require("path");

const { app, BrowserWindow } = require("electron");
const { PythonShell } = require("python-shell");
const isDev = require("electron-is-dev");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}


const callPython = async () => {
  let options = {
    scriptPath : path.join(__dirname, '/python'),
    args : [],
    //mode: "json"
  };

  // call hellp.py
  // wrap it in a promise, and `await` the result
  const pyResult = await new Promise((resolve, reject) => {
    PythonShell.run('hello.py', options, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });

  return pyResult;
};

function createWindow() {

  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });


  callPython().then(result => {
    // append python data to query param
    // after some quick searching this was the simplest way I could find to pass data to the BrowserWindow
    // However it's obviously limited with how much and what you can pass. I'm not clear on what we'd want to pass from the grabbags. If it's a simple pass/fail variable then fine? But if it's a list of filenames this won't be sufficient.
    // Also decoding the string on the React side would be easier with React Router, but I don't know if it's worth hooking that up.
    // TODO: could look further into Electron stuff for passing data like IPC ?? Not familiar.
    let queryString = `?pyResult=${result}`;

    let url = isDev
        ? `http://localhost:3000${queryString}`
        : `file://${path.join(__dirname, "../build/index.html" + queryString)}`;

    // and load the index.html of the app.
    win.loadURL(url);
    win.webContents.send('data', result);

    // Open the DevTools.
    if (isDev) {
      win.webContents.openDevTools({ mode: "detach" });
    }

  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(error => console.log(`An error occurred: , ${error}`));
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
