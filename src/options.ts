import { Configuration } from "./configuration";

const audioChoices = [
    "cb-audio-default",
    "cb-audio-nostromo",
    "cb-audio-custom",
];

function showCustom(flag: boolean) {
    let hidden = document.getElementsByClassName("custom-only") as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < hidden.length; i++) {
        hidden[i].style.display = flag ? "block" : "none";
    }
}

function checkBox(name: string) {
    const cbElement = document.getElementById(name) as HTMLInputElement;
    cbElement.checked = true;
}

async function handleClick(name: string, promise: () => Promise<void>) {
    const element = document.getElementById(name) as HTMLInputElement;
    element!.addEventListener('click', async function () {
        await promise();
        await Configuration.save();
    });
}

async function handleBlur(name: string, promise: () => Promise<void>) {
    const element = document.getElementById(name) as HTMLInputElement;
    element!.addEventListener('blur', async function () {
        await promise();
        await Configuration.save();
    });
}

document.addEventListener("blur", async function () {
    console.log("options event received");
});

document.addEventListener('DOMContentLoaded', async function () {

    const mainfest = browser.runtime.getManifest();
    const version = document.getElementById("version") as HTMLInputElement;
    version.innerText =  mainfest.version;;

    await Configuration.load().then(() => {

        if (!Configuration.debug) {
            console.log = () => { };
        }

        // Set the options html to match the configuration
        const audioChoice = Configuration.soundIndex;
        const cbAudioChoice = document.getElementById(audioChoices[audioChoice]) as HTMLInputElement;
        cbAudioChoice.checked = true;

        showCustom(audioChoice === 2);

        if (Configuration.minimizeSounds) {
            checkBox("minimize-sounds");
        }

        if (Configuration.speakTabNames) {
            checkBox("speak-tab-names");
        }

        if (Configuration.debug) {
            checkBox("debug");
        }

        if (Configuration.storageLocation === "sync") {
            checkBox("sync-settings");
        }

        const customSwitchedUrl = document.getElementById("custom-switched-url") as HTMLInputElement;
        customSwitchedUrl.value = Configuration.tabSwitchAudioUrl;

        const customUpdatedUrl = document.getElementById("custom-updated-url") as HTMLInputElement;
        customUpdatedUrl.value = Configuration.tabUpdatedAudioUrl;

        const customCreatedUrl = document.getElementById("custom-created-url") as HTMLInputElement;
        customCreatedUrl.value = Configuration.tabCreatedAudioUrl;

        const customRemovedUrl = document.getElementById("custom-removed-url") as HTMLInputElement;
        customRemovedUrl.value = Configuration.tabRemovedAudioUrl;

    });

    handleBlur("custom-switched-url", async () => {
        const element = document.getElementById("custom-switched-url") as HTMLInputElement;

        if (element.value === "") {
            return;
        }

        Configuration.tabSwitchAudioUrl = element.value;
    });

    handleBlur("custom-updated-url", async () => {
        const element = document.getElementById("custom-updated-url") as HTMLInputElement;

        if (element.value === "") {
            return;
        }

        Configuration.tabUpdatedAudioUrl = element.value;
    });

    handleBlur("custom-created-url", async () => {
        const element = document.getElementById("custom-created-url") as HTMLInputElement;

        if (element.value === "") {
            return;
        }

        Configuration.tabCreatedAudioUrl = element.value;
    });

    handleBlur("custom-removed-url", async () => {
        const element = document.getElementById("custom-removed-url") as HTMLInputElement;

        if (element.value === "") {
            return;
        }

        Configuration.tabRemovedAudioUrl = element.value;
    });

    handleClick("cb-audio-default", async () => {
        Configuration.soundIndex = 0;
        showCustom(false);
    });

    handleClick("cb-audio-nostromo", async () => {
        Configuration.soundIndex = 1;
        showCustom(false);
    });

    handleClick("cb-audio-custom", async () => {
        Configuration.soundIndex = 2;
        showCustom(true);
    });

    handleClick("minimize-sounds", async () => {
        Configuration.minimizeSounds = !Configuration.minimizeSounds;
    });

    handleClick("speak-tab-names", async () => {
        Configuration.speakTabNames = !Configuration.speakTabNames;
    });

    handleClick("debug", async () => {
        Configuration.debug = !Configuration.debug;
    });

    handleClick("close-button", async () => {
        await Configuration.save();
        browser.runtime.reload();
    });

    handleClick("sync-settings", async () => {
        const saveLocation = Configuration.storageLocation === "sync" ? "local" : "sync";
        await Configuration.saveLocation(saveLocation);
    });

    handleClick("open-button", async () => {
        browser.runtime.openOptionsPage();
    });

    window.addEventListener("blur", async function () {
        console.log("Unloading options page");
        await Configuration.save();
        browser.runtime.reload();
    });

});
