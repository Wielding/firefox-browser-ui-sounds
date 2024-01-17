
# Browser UI Sounds

A Firefox extension to play sounds related to UI actions. This is currently a work in progress as I ponder the UI and other options. It will not be published on the Mozilla add-ons site until I feel I have a complete and fully tested extension. The releases published here are officially signed by the Mozilla add-ons site.

Currently, it only supports sounds associated with the following UI actions:

* New Tab
* Updated Tab
* Switch to Tab
* Close Tab

In addition to the two provided sound themes, you can specify URLs (http or https) for sounds of your own by selecting "Custom Sounds" in the extension popup or settings page. I am not sure what formats are acceptable for the Audio API, but I know that .wav files do work.  

You can also have the extension speak (using your systems voice synthesis) the names of the tabs when they are focused (New Tab is omitted) by selecting the "Speak tab name on focus" option.

The "Minimize Sounds" option is to prevent multiple sounds from occurring for certain tab events. It blocks the next sound after a "Tab Created" or "Tab Removed" event.

There is an option called "Sync settings" which will allow your settings to travel between browser installations. (I have not fully tested this yet.).

## Future improvements (no promises)
* Add volume controls for each sound
* Add preview buttons on option screens for sounds, including custom-defined sources.
* Selectable voices for speaking tab names
* User-defined tab alerts for domains (and/or specific sites)

## Building

Building requires Node.js to be installed along with yarn. It uses Parcel to build the extension.

From the command line run

$ ```yarn install```  
$ ```yarn build```

# Credits

All sounds were graciously provided by Andre Louis who retains all rights.

You can check out his music and other work at https://youtube.com/TheOnjLouis.

