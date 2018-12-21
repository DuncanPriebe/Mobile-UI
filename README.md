# Description
A JavaScript-based library for creating a mobile UI with apps, swiping, screen locking, a clock, a latency indicator, and more.

# Style & Structure
* "_" at the beginning of a variable indicates that it is available throughout the context of the "MobileUI" object
* "MobileUI" object is wrapped in a self-executing function, so that only the desired functions are exposed
* "App" object also exposes only the desired functions, which are the actions available to the user through the UI
* "MobileUI" object is used to create and destroy the app, and also to enable/disable debugging
* "App" object returned by "MobileUI.createApp" function is used to perform UI functionality through code
* "_settings" contains UI settings, some of which correspond to CSS transition and animation times
* "_apps" contains the shortcuts available in the app folders

# Objects & Functionality
* Folders
  * Can be added or removed (the initial (home) folder can't be removed)
  * Contains shortcuts in a grid layout (with rows and columns, which are dictated by "_settings" or "MobileUI.createApp" parameters)
  * Swipe left and right to show previous or next folder
  * Subfolders can be added, creating a tree structure
* Shortcuts
  * Get added to folders and are based on apps available in "_apps"
  * Have tap, double tap, and hold callbacks (double tap doesn't do anything, but is still detected)
  * Tapping a shortcut opens its corresponding app (running the script or opening the link)
  * Holding a shortcut in a normal folder allows the user to move it to another location in the same folder
  * Holding a shortcut in an app folder allows the user to add it to the current folder
  * Subfolders are represented and accessed by shortcuts
* App Folders
  * Special folders that contain apps available to the user
* Modals
  * Used to display messages and choices to the user
* Frame
  * Shows local pages overtop of the folder area
  * Cannot show pages outside of the current domain that are blocked by security settings (X-Frame options)
* Storage
  * Web storage is used to save the folders and shortcuts created by the user

# Usage
* Use "MobileUI.createApp" to create the app, passing in a parent div if necessary (document.body is used if nothing is passed in), and specifying rows and columns (default in "_settings" will be used if nothing is passed in)
* Use "MobileUI.destroyApp" to destroy the app
* Enable/disable debugging messages using "MobileUI.enableDebugging" and "MobileUI.disableDebugging"
* Use functions exposed through the object returned by "MobileUI.createApp"

# Examples
```javascript
// Create the app and store the object 
var App = MobileUI.createApp();

// Same as above
var App = MobileUI.createApp(document.body);

// Create the app in an existing div element
var App = MobileUI.createApp(div);

// Enable debug messages to the console
MobileUI.enableDebugging();

// Unlock the app
App.unlock();

// Add a folder to the active folder
App.addFolder();

// Select the home folder
App.goHome();

// Select the next folder
App.selectNextFolder();

// Add a shortcut
App.addShortcut("dailyduncan");

// Add a shortcut with custom text in a custom position
App.addShortcut("flashlight", "Light", 2, 2);

// Move a shortcut
App.moveShortcut(2, 2, 5, 3);

// Remove a shortcut
App.removeShortcut(5, 3);

// Remove the active folder
App.removeFolder();

// Reset the folders and shortcuts to default
App.reset();

// Destroy the app
MobileUI.destroyApp();
```