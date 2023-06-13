const path = require("path");
const { app, BrowserWindow, ipcMain, Menu , globalShortcut } = require("electron");
const screen = require("electron").screen;

let janela;
let isMinimized = false;

const tamanhojanela = {
    width: 500,
    height: 500,
};

const abrirOuFecharJanela = (status) => {
    if (status === "show") {
        janela.restore();
        isMinimized = false;
    } else {
        janela.minimize();
        isMinimized = true;
    }
};

const criarJanela = () => {
    janela = new BrowserWindow({
        width: tamanhojanela.width,
        height: screen.getPrimaryDisplay().workAreaSize.height,
        x: screen.getPrimaryDisplay().workAreaSize.width - tamanhojanela.width,
        y: 30,
        alwaysOnTop: true,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.resolve("./preload.js"),
            nativeWindowOpen: true,
        },
    });

    const menuTemplate = [
        {
            label: "File",
            submenu: [
                {
                    label: "Minimize",
                    accelerator: "CmdOrCtrl+M",
                    click: () => {
                        abrirOuFecharJanela(isMinimized ? "show" : "hide");
                    },
                },
                { type: "separator" },
                { role: "quit" },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
};

const aplicarNovosEstilos = () => {
    janela.webContents.insertCSS(`
        main {
            padding: 5px;
        }
        .bg-gray-50 {
            --tw-gb-opacity: 1;
            background-color: #000;
            border-radius: 30px;
            margin: 5px;
        }
        .bg-gray-50 + div {
            --tw-bg-opacity: 1;
            background-color: #000;
            border-radius: 30px;
            margin: 5px;
        }
        img {
            height: 109px;
            width: 147px;
            z-index: 999;
            position: fixed;
            border-radius: 50%;
            right: 0px;
            filter: initial;
            clip-path: CSSNumericValue(21%);
            cursor: pointer;
        }
    `);
};

const carregarOpenIA = () => {
    janela.loadURL("https://chat.openai.com/chat");
};

app.whenReady().then(() => {
    criarJanela();
    carregarOpenIA();

    janela.webContents.on("did-finish-load", () => {
        aplicarNovosEstilos();
    });

    // Abrir e fechar com Control + M
    globalShortcut.register('Control+M', () => {
        abrirOuFecharJanela(isMinimized ? "show" : "hide");
    })
});

ipcMain.on("AbrirOuFecharJanela", (event, status) => {
    abrirOuFecharJanela(status);
});
