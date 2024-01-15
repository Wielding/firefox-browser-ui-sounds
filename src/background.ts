import { Configuration } from "./configuration";
import { DefaultAudioUrls, NostromoAudioUrls } from "./sounds";

const audioUrls = [
  DefaultAudioUrls,
  NostromoAudioUrls
];

enum TabEvent {
  Switch,
  Update,
  Create,
  Remove
}

const { tabs } = chrome;

let tabSwitchAudio = new Audio();
let tabUpdatedAudio = new Audio();
let tabCreatedAudio = new Audio();
let tabRemovedAudio = new Audio();
let suppressNextSound = false;

/// Load the sounds from the configuration
function loadSounds() {
  if (Configuration.soundIndex < 2) {
    tabSwitchAudio.src = audioUrls[Configuration.soundIndex][0];
    tabUpdatedAudio.src = audioUrls[Configuration.soundIndex][1];
    tabCreatedAudio.src = audioUrls[Configuration.soundIndex][2];
    tabRemovedAudio.src = audioUrls[Configuration.soundIndex][3];
  } else {
    tabSwitchAudio.src = Configuration.tabSwitchAudioUrl;
    tabUpdatedAudio.src = Configuration.tabUpdatedAudioUrl;
    tabCreatedAudio.src = Configuration.tabCreatedAudioUrl;
    tabRemovedAudio.src = Configuration.tabRemovedAudioUrl;
  }
}

/// Play the sound with the given name
async function playSound(tabEvent: TabEvent) {

  /// If the user has chosen to minimize sounds, don't play the sound if the
  /// previous sound was created or removed
  if (Configuration.minimizeSounds) {
    if (suppressNextSound) {
      suppressNextSound = false;
      return;
    }
  }

  let audio: HTMLAudioElement;

  switch (tabEvent) {
    case TabEvent.Switch:
      audio = tabSwitchAudio;
      break;
    case TabEvent.Update:
      audio = tabUpdatedAudio;
      break;
    case TabEvent.Create:
      audio = tabCreatedAudio;
      suppressNextSound = true;
      break;
    case TabEvent.Remove:
      audio = tabRemovedAudio;
      suppressNextSound = true;
      break;
    default:
      return;
  }

  /// If the user has chosen to speak the tab names, do so
  if (Configuration.speakTabNames && tabEvent == TabEvent.Switch) {
    let tabName = "";

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    await browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        for (const tab of tabs) {
          tabName = tab.title ?? "";
        }
      });

    if (tabName.length > 0 && tabName != "New Tab") {
      let utterance = new SpeechSynthesisUtterance(tabName);
      window.speechSynthesis.speak(utterance);
    }
  }

  console.log("playing sound: " + name);

  audio.load();

  audio.play().catch((error) => {
    console.log("Error playing sound: " + error);
  });

}

/// Load the configuration and register the event listeners
Configuration.load().then(async () => {

  loadSounds();

  console.log("Loading configuration for Background");

  tabs.onActivated.addListener(async (event) => {
    playSound(TabEvent.Switch)
  });

  tabs.onUpdated.addListener(async () => {
    playSound(TabEvent.Update)
  });

  tabs.onCreated.addListener(async () => {
    playSound(TabEvent.Create)
  });

  tabs.onRemoved.addListener(async () => {
    playSound(TabEvent.Remove)
  });

  /// Listen for changes to the configuration and reload the sounds if necessary
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    console.log("Storage changed " + JSON.stringify(Configuration));
    loadSounds();
  });

});
