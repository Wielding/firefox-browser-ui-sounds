import { Configuration } from "./configuration";
import { DefaultAudioUrls, NostromoAudioUrls } from "./sounds";

const audioUrls = [
  DefaultAudioUrls,
  NostromoAudioUrls
];

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
async function playSound(name: string) {

  /// If the user has chosen to minimize sounds, don't play the sound if the
  /// previous sound was created or removed
  if (Configuration.minimizeSounds) {
    if (suppressNextSound) {
      suppressNextSound = false;
      return;
    }
  }

  let audio: HTMLAudioElement;

  switch (name) {
    case "tabSwitch":
      audio = tabSwitchAudio;
      break;
    case "tabUpdated":
      audio = tabUpdatedAudio;
      break;
    case "tabCreated":
      audio = tabCreatedAudio;
      suppressNextSound = true;
      break;
    case "tabRemoved":
      audio = tabRemovedAudio;
      suppressNextSound = true;
      break;
    default:
      return;
  }

  /// If the user has chosen to speak the tab names, do so
  if (Configuration.speakTabNames && name == "tabSwitch") {
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

      // utterance.lang = "en-US";
      // utterance.volume = 1;
      // utterance.rate = 1;
      // utterance.pitch = 1;
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
    playSound("tabSwitch")
  });

  tabs.onUpdated.addListener(async () => {
    playSound("tabUpdated")
  });

  tabs.onCreated.addListener(async () => {
    playSound("tabCreated")
  });

  tabs.onRemoved.addListener(async () => {
    playSound("tabRemoved")
  });

  /// Listen for changes to the configuration and reload the sounds if necessary
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    console.log("Storage changed " + JSON.stringify(Configuration));
    loadSounds();
  });

});





