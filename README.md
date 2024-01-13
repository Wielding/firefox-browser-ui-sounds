# Browser UI Sounds

A Firefox extension to play sounds related to UI actions.  This is currently a work in progress as I ponder the UI and other options.  It will not be published to the Mozilla add-ons site until I feel I have a complete and fully tested extension. The releases published here are oficially signed from the Mozilla add-ons site.

Currently it only supports sounds associated with the following UI actions.

* New Tab
* Updated Tab
* Switch to Tab
* Close Tab

In addition to the two provided sounds you can specify a URL (http or https) to sounds of your own by selecting "Custom Sounds" in the extension popup or settings page.  I am not sure all of the formats that are acceptable but I know that .wav files do work.  

You can also have the extension read the names of the tabs when they are focused (New Tab is omitted) by selecting the "Say tab name on focus" option.

The "Minimize sounds" option is to prevent mutilple sounds ocurring for certain tab events. It blocks the next sound after a "Tab Created" or "Tab Removed" event.

There is an option "Sync settings" which will allow your settings to travel between browser installations. (I have not fully tested this yet).

## Future improvements (no promises)
* Add volume controls for each sound
* Add preview buttons on option screens for sounds including custom defined sources
* Selectable voices for speaking tab names

## Building

Building requires NodeJS to be installed.  It uses Parcel to build the extension.

From the command line run

$ ```yarn install```  
$ ```yarn build```

or

$ ```npm install```  
$ ```npm run build```


# Credits

All sounds were provided by Andre Louis who retains all rights and has graciously provided them for use in this extension.

You can check out his music and other work at https://youtube.com/TheOnjLouis.
