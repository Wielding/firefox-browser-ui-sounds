import { StorageManager } from "./storageManager";

const CONFIG_SOUND_INDEX = "soundIndex";
const CONFIG_MINIMIZE_SOUNDS = "minimizeSounds";
const CONFIG_SPEAK_TAB_NAMES = "speakTabNames";
const CONFIG_DEBUG = "debug";
const CONFIG_TAB_SWITCH_AUDIO_URL = "tabSwitchAudioUrl";
const CONFIG_TAB_UPDATED_AUDIO_URL = "tabUpdatedAudioUrl";
const CONFIG_TAB_CREATED_AUDIO_URL = "tabCreatedAudioUrl";
const CONFIG_TAB_REMOVED_AUDIO_URL = "tabRemovedAudioUrl";

class ConfigurationManager {

    soundIndex: number;
    minimizeSounds: boolean;
    speakTabNames: boolean;
    storageManager: StorageManager;
    storageLocation: string;
    tabSwitchAudioUrl: string;
    tabUpdatedAudioUrl: string;
    tabCreatedAudioUrl: string;
    tabRemovedAudioUrl: string;
    debug: boolean;
    originalConsoleLog: (...data: any[]) => void;

    constructor() {
        this.soundIndex = 0;
        this.minimizeSounds = true;
        this.speakTabNames = false;
        this.debug = false;
        this.tabCreatedAudioUrl = "";
        this.tabRemovedAudioUrl = "";
        this.tabSwitchAudioUrl = "";
        this.tabUpdatedAudioUrl = "";
        this.originalConsoleLog = console.log;
        console.log = () => { };
    }

    async load() {

        await browser.storage.local.get("storageLocation").then((value: any) => {
            this.storageLocation = value["storageLocation"] ?? "local";
        });

        this.storageManager = new StorageManager(this.storageLocation);

        await this.storageManager.get(CONFIG_DEBUG, true).then((value: boolean) => {
            this.debug = value;
            if (this.debug) {
                console.log = this.originalConsoleLog;
            } else {
                console.log = () => { };
            }
        });

        await this.storageManager.get(CONFIG_SOUND_INDEX, 0).then((value: number) => {
            this.soundIndex = value;
        });

        await this.storageManager.get(CONFIG_MINIMIZE_SOUNDS, true).then((value: boolean) => {
            this.minimizeSounds = value;
        });

        await this.storageManager.get(CONFIG_SPEAK_TAB_NAMES, false).then((value: boolean) => {
            this.speakTabNames = value;
        });

        await this.storageManager.get(CONFIG_TAB_SWITCH_AUDIO_URL, "").then((value: string) => {
            this.tabSwitchAudioUrl = value;
        });

        await this.storageManager.get(CONFIG_TAB_UPDATED_AUDIO_URL, "").then((value: string) => {
            this.tabUpdatedAudioUrl = value;
        });

        await this.storageManager.get(CONFIG_TAB_CREATED_AUDIO_URL, "").then((value: string) => {
            this.tabCreatedAudioUrl = value;
        });

        await this.storageManager.get(CONFIG_TAB_REMOVED_AUDIO_URL, "").then((value: string) => {
            this.tabRemovedAudioUrl = value;
        });

        console.log("Configuration loaded " + JSON.stringify(Configuration));
    }

    async save() {
        await browser.storage.local.set({ "storageLocation": this.storageLocation });
        await this.storageManager.set(CONFIG_SOUND_INDEX, this.soundIndex);
        await this.storageManager.set(CONFIG_MINIMIZE_SOUNDS, this.minimizeSounds);
        await this.storageManager.set(CONFIG_SPEAK_TAB_NAMES, this.speakTabNames);
        await this.storageManager.set(CONFIG_DEBUG, this.debug);
        await this.storageManager.set(CONFIG_TAB_SWITCH_AUDIO_URL, this.tabSwitchAudioUrl);
        await this.storageManager.set(CONFIG_TAB_UPDATED_AUDIO_URL, this.tabUpdatedAudioUrl);
        await this.storageManager.set(CONFIG_TAB_CREATED_AUDIO_URL, this.tabCreatedAudioUrl);
        await this.storageManager.set(CONFIG_TAB_REMOVED_AUDIO_URL, this.tabRemovedAudioUrl);

        console.log("Configuration saved");
    }

    async saveLocation(location: string) {
        this.storageLocation = location;
        await browser.storage.local.set({ "storageLocation": location });
        this.storageManager.setStorageType(location);
        await this.save();
    };
}

export let Configuration = new ConfigurationManager();
