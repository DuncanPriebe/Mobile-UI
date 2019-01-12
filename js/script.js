'use strict';

var MobileUI = (function() {

	/***********************************
	************ Settings **************
	************************************/
	
	var _settings = {
		storageKey: "DuncanPriebeMobileUI", // The web storage key
		desktopAspectRatio: 0.625, // The default aspect ratio (for desktop or other devices that are not smartphone-shaped)
		defaultRowCount: 6, // Default number of rows
		defaultColumnCount: 4, // Default number of columns
		defaultFolderName: "Folder", // Default name for a folder
		lockoutDelay: 30000, // The time before locking the screen
		lockoutCheckInterval: 1000, // How to wait between checking for locking the screen
		lockoutTransitionTime: 500, // How long it takes to show or hide the lockout screen
		holdDelay: 500, // How long to wait before checking if an shortcut is held
		dragDelay: 0, // How long to wait before checking if a folder is being dragged
		dragCheckInterval: 10, // How often to check if a folder is being dragged
		dragDistance: 15, // How far a folder has to be moved to start dragging
		doubleTapDelay: 200, // The window in which two taps count as a double tap
		moveDuration: 150, // How long it takes to move a folder or shortcut
		moveInterval: 10, // How often to increment a folder or shortcut move
		backgroundMoveRatio: 0.25, // How much to move the background compared to the folder (for parallax effect)
		backgroundMoveDuration: 350, // How long it takes to move the background (for parallax effect)
		folderSlideRatio: 0.25, // How far a folder has to be dragged to move to the next one
		buttonFlashTime: 100, // How long a button flashes after being tapped
		editAreaTransitionTime: 100, // How long it takes to show or hide the shortcut edit area
		modalHideTime: 150, // How long it takes to hide a modal (for settings z-index of hidden modals)
		modalTextLimit: 15, // The character limit for a modal text input element
		frameTransitionTime: 150, // How long it takes to show and hide the frame
		dateUpdateDelay: 10000, // The delay between date updates
		timeUpdateDelay: 1000, // The delay between clock updates
		latencyUpdateDelay: 5000, // The delay between latency updates
		latencyRatings: [ // The min latency required to reach each rating (bars on signal icon)
			{
				value: 500,
				image: "./img/latency-0.png"
			},
			{
				value: 250,
				image: "./img/latency-1.png"
			},
			{
				value: 100,
				image: "./img/latency-2.png"
			},
			{
				value: 50,
				image: "./img/latency-3.png"
			},
			{
				value: 25,
				image: "./img/latency-4.png"
			}
		],
		maxSiblingFolders: 5, // The maximum number of sibling folders (width)
		maxSubfolders: 1, // The maximum number of subfolders (depth)
		//backgroundHorizontalScroll: 0.25, // The amount to move the background when moving a folder left or right (as a percentage of app size)
		//backgroundVerticalScroll: 0.25, // The amount to move the background when moving a folder up or down (as a percentage of app size)
		debugEnabled: false // Whether or not debug text should be printed
	};
	
	/***********************************
	************** Apps ****************
	************************************/
	
	var _apps = {
		help: {
			text: "Help",
			icon: "./img/icons/help.png",
			type: "script",
			params: {
				script: function(scriptParams) {
					_textModal.show("Help", "<p><span class='glyphicon glyphicon-home'></span>Select home folder</p><p><span class='glyphicon glyphicon-chevron-left'></span>Select previous folder</p><p><span class='glyphicon glyphicon-th'></span>Show available apps</p><p><span class='glyphicon glyphicon-menu-hamburger'></span>Show menu</p><hr><p>Swipe left or right to select folders</p><p>Hold apps to add or move them</p>");
					//<p>Hold apps to copy them</p><hr><p>Swipe left and right to change folders.</p><hr><p>Hold apps in the App Folders to add them to the current folder.</p><hr><p>Hold apps to move them</p>");
				},
				scriptParams: ""
			}
		},
		lock: {
			text: "Lock Screen",
			icon: "./img/icons/lock.png",
			type: "script",
			params: {
				script: function(scriptParams) {
					_lockScreen();
				},
				scriptParams: ""
			}
		},
		flashlight: {
			text: "Flashlight",
			icon: "./img/icons/flashlight.png",
			type: "url",
			params: {
				url: "./apps/flashlight/index.html",
				external: false
			}
		},
		alarm: {
			text: "Alarm",
			icon: "./img/icons/clock.png",
			type: "url",
			params: {
				url: "http://www.duncanpriebe.com/pages/alarm",
				external: false
			}
		},
		cipher: {
			text: "Cipher",
			icon: "./img/icons/cipher.png",
			type: "url",
			params: {
				url: "http://www.duncanpriebe.com/pages/cipher",
				external: false
			}
		},
		zyrian: {
			text: "Zyrian",
			icon: "./img/icons/zyrian.png",
			type: "url",
			params: {
				url: "http://www.duncanpriebe.com/pages/zyrian",
				external: true
			}
		},
		dailyduncan: {
			text: "Daily Duncan",
			icon: "./img/icons/dailyduncan.png",
			type: "url",
			params: {
				url: "http://www.duncanpriebe.com/blog",
				external: false
			}
		},
		youtube: {
			text: "YouTube",
			icon: "./img/icons/youtube.png",
			type: "url",
			params: {
				url: "https://www.youtube.com",
				external: true
			}
		},
		gmail: {
			text: "Gmail",
			icon: "./img/icons/gmail.png",
			type: "url",
			params: {
				url: "http://www.gmail.com",
				external: true
			}
		},
		google: {
			text: "Google",
			icon: "./img/icons/chrome.png",
			type: "url",
			params: {
				url: "http://www.google.com",
				external: true
			}
		},
		googleDrive: {
			text: "Google Drive",
			icon: "./img/icons/googledrive.png",
			type: "url",
			params: {
				url: "http://drive.google.com",
				external: true
			}
		},
		googlePlay: {
			text: "Google Play",
			icon: "./img/icons/googleplay.png",
			type: "url",
			params: {
				url: "https://play.google.com",
				external: true
			}
		},
		weather: {
			text: "Weather",
			icon: "./img/icons/weather.png",
			type: "url",
			params: {
				url: "http://www.weather.com",
				external: false
			}
		},
		linkedin: {
			text: "LinkedIn",
			icon: "./img/icons/linkedin.png",
			type: "url",
			params: {
				url: "http://www.linkedin.com",
				external: true
			}
		},
		facebook: {
			text: "Facebook",
			icon: "./img/icons/facebook.png",
			type: "url",
			params: {
				url: "http://www.facebook.com",
				external: true
			}
		},
		paypal: {
			text: "PayPal",
			icon: "./img/icons/paypal.png",
			type: "url",
			params: {
				url: "http://www.paypal.com",
				external: true
			}
		},
		twitter: {
			text: "Twitter",
			icon: "./img/icons/twitter.png",
			type: "url",
			params: {
				url: "http://www.twitter.com",
				external: true
			}
		},
		amazon: {
			text: "Amazon",
			icon: "./img/icons/amazon.png",
			type: "url",
			params: {
				url: "http://www.amazon.com",
				external: true
			}
		},
		reddit: {
			text: "reddit",
			icon: "./img/icons/reddit.png",
			type: "url",
			params: {
				url: "http://www.reddit.com",
				external: true
			}
		},
		yahoo: {
			text: "Yahoo",
			icon: "./img/icons/yahoo.png",
			type: "url",
			params: {
				url: "http://www.yahoo.com",
				external: true
			}
		},
		wikipedia: {
			text: "Wikipedia",
			icon: "./img/icons/wikipedia.png",
			type: "url",
			params: {
				url: "http://www.wikipedia.com",
				external: true
			}
		},
		soundcloud: {
			text: "SoundCloud",
			icon: "./img/icons/soundcloud.png",
			type: "url",
			params: {
				url: "https://soundcloud.com/",
				external: true
			}
		},
		itunes: {
			text: "iTunes",
			icon: "./img/icons/itunes.png",
			type: "url",
			params: {
				url: "http://www.itunes.com",
				external: true
			}
		},
		ebay: {
			text: "eBay",
			icon: "./img/icons/ebay.png",
			type: "url",
			params: {
				url: "http://www.ebay.com",
				external: true
			}
		},
		instagram: {
			text: "Instagram",
			icon: "./img/icons/instagram.png",
			type: "url",
			params: {
				url: "http://www.instagram.com",
				external: true
			}
		},
		netflix: {
			text: "Netflix",
			icon: "./img/icons/netflix.png",
			type: "url",
			params: {
				url: "http://www.netflix.com",
				external: true
			}
		},
		hulu: {
			text: "Hulu",
			icon: "./img/icons/hulu.png",
			type: "url",
			params: {
				url: "https://www.hulu.com",
				external: true
			}
		},
		amazonPrime: {
			text: "Amazon Prime",
			icon: "./img/icons/amazonprimevideo.png",
			type: "url",
			params: {
				url: "https://www.primevideo.com/",
				external: true
			}
		},
		twitch: {
			text: "Twitch",
			icon: "./img/icons/twitch.png",
			type: "url",
			params: {
				url: "http://www.twitch.tv",
				external: true
			}
		},
		bing: {
			text: "Bing",
			icon: "./img/icons/bing.png",
			type: "url",
			params: {
				url: "http://www.bing.com",
				external: false
			}
		},
		pinterest: {
			text: "Pinterest",
			icon: "./img/icons/pinterest.png",
			type: "url",
			params: {
				url: "https://www.pinterest.com",
				external: false
			}
		},
		fightpass: {
			text: "FIGHTPASS",
			icon: "./img/icons/fightpass.png",
			type: "url",
			params: {
				url: "http://www.fightpass.com",
				external: true
			}
		},
		espn: {
			text: "ESPN",
			icon: "./img/icons/espn.png",
			type: "url",
			params: {
				url: "http://www.espn.com",
				external: true
			}
		}
	};
	
	/***************************************
	********** Private Variables ***********
	***************************************/

	var _parent, // The parent div of the app
		_app, // Base app object
		_storageData = {}, // The loaded web storage data
		_screenLocked, // Indicates if the screen is locked
		_unlockSliderDragging, // Indicates if the unlock slider is being dragged
		_lastInputTime, // The last time the user gave input
		_lastActiveFolder, // The last active folder
		_activeFolder, // The active folder
		_currentFolder, // The active folder behind the app folder
		_activeAppFolder, // The active app folder
		_appFolderShowing, // Indicates if an app folder is being shown
		_tappedShortcut, // The last tapped shortcut
		_heldShortcut, // The held shortcut
		_shortcutHoldTimeout, // The function that checks if the shortcut is being held (used for clearing when clicked)
		_modalBackground, // The modal background
		_activeModal, // The active modal
		_modalShowing, // Indicates if a modal is being shown (for handling keypresses and other input);
		_textModal, // The modal for displaying a message
		_confirmModal, // The modal for confirming an action
		//_createShortcutModal, // The modal for creating a shortcut
		_createSubfolderModal, // The modal for creating a subfolder (and shortcut to it)
		_editShortcutModal, // The modal for editin a shortcut
		_loadingScreen, // The screen that displays during loading
		_lockoutScreen, // The screen that displays when the user is locked out (timed out) of the device
		_frameWrapper, // The iframe for opening links
		_frameShowing, // Indicates if the frame is being shown
		_lastOpenedAppURL, // Indicates app that was last opened
		_movingElementCount = 0, // The number of elements being moved (used to enable and disable input)
		//_inputEnabled = true, // Indicates if app input is enabled
		//_lastFolderMoveTime, // Indicates the last time a folder move input was accepted (for putting time between moving a folder)
		_inputX, // The last x input coordinate
		_inputY, // The last y input coordinate
		_lastTapX, // The last x tap coordinate
		_lastTapY, // The last y tap coordinate
		_lastFrameCheckX, // The last x input when checking for iframe input
		_lastFrameCheckY, // The last y input when checking for iframe input
		_mobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
		
	/***************************************
	********** Private Functions ***********
	***************************************/

	// Load web storage
	var _loadStorage = function() {
        if (typeof Storage !== "undefined") {
            // Load data from web storage
            var data = localStorage.getItem(_settings.storageKey);

            // Parse data into an object
            data = JSON.parse(data);

            if (data != null) { // Need to test for valid data (and same version of app)
                _printDebugText("Loading data from web storage.");
                _storageData = data;
                return true;
            } else {
            	_printDebugText("Nonexistant or corrupt data in web storage. Resetting data.");
                _app.reset();
                return false;
            }
        } else {
            _printDebugText("Web storage not supported. Unable to load data.");
            return false;
        }
    };

    // Save we storage
    var _saveStorage = function(newData) {
        _printDebugText("Saving data to web storage.");

        var loadFolders = function(dataObject, firstFolder) {
        	var folder = firstFolder;
	        while (folder) {
	        	var folderObject = loadShortcuts(folder);

	        	dataObject.folders.push(
	        		folderObject
	        	);

	        	folder = folder.nextFolder;
	        }
        };

        var loadShortcuts = function(folder) {
        	var folderObject = {
        		shortcuts: []
        	};

        	for (var i in folder.shortcuts) {
        		for (var j in folder.shortcuts[i]) {
        			// If the shortcut has a subfolder, iterate through it and its siblings (gotta do it recursively I guess)
        			if (folder.shortcuts[i][j] != null && folder.shortcuts[i][j] != undefined) {
        				var shortcutObject = {
        					key: folder.shortcuts[i][j].key,
	        				text: folder.shortcuts[i][j].text,
	        				row: folder.shortcuts[i][j].row,
	        				column: folder.shortcuts[i][j].column
	        			};

	        			folderObject.shortcuts.push(shortcutObject);
        				
        				// If there's a subfolder, then add the folder and its shortcuts
	        			if (folder.shortcuts[i][j].key == null || folder.shortcuts[i][j].key == undefined) {
	        				shortcutObject.folders = [];
	        				
	        				loadFolders(shortcutObject, folder.shortcuts[i][j].subfolder);
	        			}

        			}
        		}
        	}

        	return folderObject;
        };

        var data;

        // Check if new data was passed in to override existing folders and shortcuts
        if (newData != null && newData != undefined) {
        	data = newData;
        } else {
        	 data = {
        	 	folders: []
        	 };

	        loadFolders(data, _app.homeFolder);
        }

        if (typeof Storage !== "undefined") { // Verify web storage support
            // Put data into web storage
            localStorage.setItem(_settings.storageKey, JSON.stringify(data));
            return true;
        } else {
            _printDebugText("Web storage not supported. Unable to load data.");
            return false;
        }
    };
	
	// Print message if debugging is enabled
	var _printDebugText = function(text) {
		if (_settings.debugEnabled) {
			console.log(text);
		}
	};
	
	var _getInputEnabled = function() {
		if (_movingElementCount > 0) {
			return false;
		} else {
			return true;
		}
	};

	var _updateAspectRatio = function() {
		var rect = _app.div.getBoundingClientRect();
		_app.div.style.width = rect.height * _settings.desktopAspectRatio + "px";
	}

	// Update the size of various divs used during dragging and other highly-used functions (to avoid calling getBoundingClientRect as the user holds and drags elements)
	var _updateAppSize = function() {
		var appRect = _app.div.getBoundingClientRect();
		_app.top = appRect.top;
		_app.bottom = appRect.bottom;
		_app.left = appRect.left;
		_app.right = appRect.right;
		_app.width = appRect.width;
		_app.height = appRect.height;

		var statusbarRect = _app.statusbar.div.getBoundingClientRect();
		_app.statusbar.width = statusbarRect.width;
		_app.statusbar.height = statusbarRect.height;

		var navbarRect = _app.navbar.div.getBoundingClientRect();
		_app.navbar.width = navbarRect.width;
		_app.navbar.height = navbarRect.height;

		_app.usableWidth = _app.width;
		_app.usableHeight = _app.height - _app.statusbar.height - _app.navbar.height;

		var trashRect = _app.shortcutEditArea.trashButton.div.getBoundingClientRect();
		_app.shortcutEditArea.trashButton.top = trashRect.top;
		_app.shortcutEditArea.trashButton.bottom = trashRect.bottom;
		_app.shortcutEditArea.trashButton.left = trashRect.left;
		_app.shortcutEditArea.trashButton.right = trashRect.right;

		var editRect = _app.shortcutEditArea.editButton.div.getBoundingClientRect();
		_app.shortcutEditArea.editButton.top = editRect.top;
		_app.shortcutEditArea.editButton.bottom = editRect.bottom;
		_app.shortcutEditArea.editButton.left = editRect.left;
		_app.shortcutEditArea.editButton.right = editRect.right;

		if (_activeFolder != null && _activeFolder != undefined) {
			var folderRect = _activeFolder.div.getBoundingClientRect();
			_activeFolder.width = folderRect.width;
			_activeFolder.height = folderRect.height;	
		}
	};

	var _unlockSliderDragStart = function() {
		_unlockSliderDragging = true;
	};

	var _unlockSliderDragEnd = function() {
		_unlockSliderDragging = false;
	};

	var _unlockSliderDrag = function(e) {
		if (_unlockSliderDragging) {
			// Get horizontal position as percentage of lockout screen or app width
			var x;
			var y;
			if (e.clientX != null && e.clientX != undefined) {
				x = e.clientX;
			} else {
				x = e.touches[0].clientX;
			}
			if (e.clientY != null && e.clientY != undefined) {
				y = e.clientY;
			} else {
				y = e.touches[0].clientY;
			}

			//var rect = _app.div.getBoundingClientRect();
			//var xPercent = (x - rect.left) / rect.width;

			var sliderRect = _lockoutScreen.sliderArea.slider.div.getBoundingClientRect();
			var xPercent = (x - sliderRect.left) / sliderRect.width * 100;

			if (xPercent < 0) {
				xPercent = 0;
			} else if (xPercent > 100) {
				xPercent = 100;
			}

			// Don't let button go past end of slider
			var buttonRect = _lockoutScreen.sliderArea.slider.button.div.getBoundingClientRect();
			var buttonWidthPercent = Math.round(buttonRect.width / sliderRect.width * 100);
			var xFixedPercent = xPercent;
			if (xFixedPercent < buttonWidthPercent / 2) {
				xFixedPercent = buttonWidthPercent / 2;
				_lockoutScreen.sliderArea.slider.button.div.style.left = xFixedPercent + "%";
			} else if (xFixedPercent > 100 - buttonWidthPercent + buttonWidthPercent / 2) {
				xFixedPercent = 100 - buttonWidthPercent + buttonWidthPercent / 2;
				_lockoutScreen.sliderArea.slider.button.div.style.left = xFixedPercent + "%";
				_unlockScreen();
			} else {
				_lockoutScreen.sliderArea.slider.button.div.style.left = xFixedPercent + "%";
			}
		}
	};

	var _resetLastInputTime = function() {
		_lastInputTime = new Date().getTime();
	};

	var _checkScreenLockoutTime = function() {
		if (new Date().getTime() > _lastInputTime + _settings.lockoutDelay) {
			// Check if the screen is already locked
			if (!_screenLocked) {
				// Make sure we're not holding a shortcut
				if (_heldShortcut) {
					if (!_heldShortcut.held) {
						_lockScreen();
					}
				} else {
					_lockScreen();
				}
			}
		}
	};

	// Reset all app input data
	var _resetAppInput = function() {
		_printDebugText("Resetting app input...");

		// If the screen is locked, reset the slider
		if (_screenLocked) {
			_lockoutScreen.sliderArea.slider.button.div.style.left = _lockoutScreen.sliderArea.slider.button.homeX + "%";
			_unlockSliderDragging = false;
		}

		// Untap and unhold the held shortcut
		if (_heldShortcut) {
			_heldShortcut.div.classList.remove("ShortcutHold");
			_heldShortcut.lastTimeTapped = null;
			//_heldShortcut.taps = 0; // Causes error where after holding doubletapping doesn't work
			
			// Check if the shortcut was held
			if (_heldShortcut.held) {
				// Check if input is enabled
				if (_heldShortcut.inputEnabled) {
					// Check for valid callback
					if (_heldShortcut.unholdCallback instanceof Function) {
						_heldShortcut.unholdCallback();
					}
					
					// Move the shortcut home
					_heldShortcut.moveHome();
				}
			}

			// Unhold the shortcut
			_heldShortcut.held = false;
		}
		
		// Untap tapped shortcut
		if (_tappedShortcut) {
			_tappedShortcut.tapped = false;
			_tappedShortcut.lastTimeTapped = null;
			_tappedShortcut.div.classList.remove("ShortcutTapped");
		}

		// Untap the active folder
		//_activeFolder.tapped = false;

		// Untap the navbar
		_app.navbar.tapped = false;
		
		// Hide the shortcut edit area
		if (_app.shortcutEditArea.showing) {
			_app.shortcutEditArea.hide();

			// Show the navbar
			_app.navbar.show();
		}

		// Rest active app location
		if (_activeFolder) {
			_activeFolder.tapped = false;

			// Move the folder back to its default position
			if (_activeFolder.draggingHorizontal) {
				// Move folders to home position
				_activeFolder.moveListHome();

				// Move the background to home position
				_moveElement(_app.background, _app.background.homeX, _app.background.homeY);
			}  else if (_activeFolder.draggingVertical) {
				// Scroll to the nearest full shortcut being shown
				var rect = _activeFolder.div.getBoundingClientRect();
				var appRect = _app.div.getBoundingClientRect();
				
				var difference = (rect.top - appRect.top - _app.statusbar.height) % _activeFolder.rowHeight;

				// Check if we need to go up, down, or not move at all
				//if (difference == 0) {
				if (Math.abs(difference) < 2) { // Check for a bit of variance (fixes problem where barely moving the folder just causes it to kind of vibrate)
					//return;
				}
				
				// If we've moved less than one pixel, don't do anything
				var topValue = Math.abs(Number(_activeFolder.div.style.top.substring(0, _activeFolder.div.style.top.length - 2)));
				var newTopValue = Math.abs(rect.top  - appRect.top - (_activeFolder.rowHeight + difference));
				if (newTopValue - topValue < 1) {
					return;
				}
				
				// TODO: Move based on percent, not pixels
				if (difference < -_activeFolder.rowHeight / 2) {
					//_moveElement(_activeFolder, null, rect.top  - appRect.top - (_activeFolder.rowHeight + difference));
				} else {
					//_moveElement(_activeFolder, null, rect.top - appRect.top - difference);
				}
			}

			_activeFolder.draggingHorizontal = false;
			_activeFolder.draggingVertical = false;
		}
	};

	// A key has been pressed
	var _handleKeypress = function(e) {
		// Update the last input time
		_resetLastInputTime();

		// Enter key was pressed
		if (e.keyCode === 27) {
			// If we're showing a modal, hide it
			if (_modalShowing) {
				_hideModal();
			} else {
				// Otherwise press the up/back button
				_goUp();
				_startButtonPressAnimation(_app.navbar.backButton);
			}
		} else if (e.keyCode === 13) {
			// If we're showing a modal, hide it
			if (_modalShowing) {
				_hideModal();
			}
		}
	};
	
	// The input has been moved
	var _inputMove = function(e) {
		// Prevent scrolling
		e.preventDefault();

		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			e.stopPropagation();
			return;
		}

		// Update the last position of the input
		if (e.clientX != null && e.clientX != undefined) {
			_inputX = e.clientX;
		} else {
			_inputX = e.touches[0].clientX;
		}
		if (e.clientY != null && e.clientY != undefined) {
			_inputY = e.clientY;
		} else {
			_inputY = e.touches[0].clientY;
		}

		// Check if the input has left the app
		//var rect = _app.div.getBoundingClientRect();
		//if (_inputX < rect.left || _inputX > rect.right || _inputY < rect.top || _inputY > rect.bottom) {

		// If we're holding a shortcut, then reset when the player goes over the statusbar or outside the app
		if (_heldShortcut != null && _heldShortcut != undefined) {
			if (_inputX < _app.left || _inputX > _app.right || _inputY < _app.top + _app.statusbar.height || _inputY > _app.bottom) {
				_resetAppInput();
			}
		} else {
			// Otherwise just reset when the player goes outside the app
			if (_inputX < _app.left || _inputX > _app.right || _inputY < _app.top || _inputY > _app.bottom) {
				_resetAppInput();
			}
		}
		
		// Move the held shortcut
		if (_heldShortcut != null && _heldShortcut != undefined) {
			if (_heldShortcut.held) {
				// Check if the shortcut is being held over the remove or edit buttons
				//var trashRect = _app.shortcutEditArea.trashButton.div.getBoundingClientRect();
				//var editRect = _app.shortcutEditArea.editButton.div.getBoundingClientRect();
				
				//if (_inputX > trashRect.left && _inputX < trashRect.right && _inputY > trashRect.top && _inputY < trashRect.bottom) {
				if (_inputX > _app.shortcutEditArea.trashButton.left && _inputX < _app.shortcutEditArea.trashButton.right && _inputY > _app.shortcutEditArea.trashButton.top && _inputY < _app.shortcutEditArea.trashButton.bottom) {
					_app.shortcutEditArea.trashButton.div.classList.add("EditButtonHover");
					_app.shortcutEditArea.editButton.div.classList.remove("EditButtonHover");
				//} else if (_inputX > editRect.left && _inputX < editRect.right && _inputY > editRect.top && _inputY < editRect.bottom) {
				} else if (_inputX > _app.shortcutEditArea.editButton.left && _inputX < _app.shortcutEditArea.editButton.right && _inputY > _app.shortcutEditArea.editButton.top && _inputY < _app.shortcutEditArea.editButton.bottom) {
					_app.shortcutEditArea.editButton.div.classList.add("EditButtonHover");
					_app.shortcutEditArea.trashButton.div.classList.remove("EditButtonHover");
				} else {
					_app.shortcutEditArea.trashButton.div.classList.remove("EditButtonHover");
					_app.shortcutEditArea.editButton.div.classList.remove("EditButtonHover");
				}
				
				// Update the shortcut position
				//var folderRect = _activeFolder.div.getBoundingClientRect();
				//_heldShortcut.setPosition(_inputX - _heldShortcut.dragInputX, _inputY - _heldShortcut.dragInputY);
				//_heldShortcut.setPosition((_inputX - _heldShortcut.dragInputX), _(inputY - _heldShortcut.dragInputY));
				//_heldShortcut.setPosition((_inputX - _heldShortcut.dragInputX) / folderRect.width * 100, (_inputY - _heldShortcut.dragInputY) / folderRect.height * 100);

				//_heldShortcut.setPosition((_inputX - _heldShortcut.dragInputX) / folderRect.width * 100, (_inputY - _heldShortcut.dragInputY) / folderRect.height * 100);
				_heldShortcut.setPosition((_inputX - _heldShortcut.dragInputX) / _activeFolder.width * 100, (_inputY - _heldShortcut.dragInputY) / _activeFolder.height * 100);
			} else {
				_app.shortcutEditArea.trashButton.div.classList.remove("EditButtonHover");
				_app.shortcutEditArea.editButton.div.classList.remove("EditButtonHover");
			}
		}
	};
	
	var _inputDown = function(e) {
		// Update the last input time
		_resetLastInputTime();

		// If the device is mobile
		if (_mobile) {
			// Update the last position of the input (because moving the input doesn't update this unless the input is down)
			if (e.clientX != null && e.clientX != undefined) {
				_inputX = e.clientX;
			} else {
				_inputX = e.touches[0].clientX;
			}
			if (e.clientY != null && e.clientY != undefined) {
				_inputY = e.clientY;
			} else {
				_inputY = e.touches[0].clientY;
			}
		}
		
		// Check if the input has left the app
		var rect = _app.div.getBoundingClientRect();
		if (_inputX < rect.left || _inputX > rect.right || _inputY < rect.top || _inputY > rect.bottom) {
			// Hide the navbar menu
			_app.navbarMenu.hide();
		}

		_printDebugText("Input pressed.");

		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			e.stopPropagation();
			return;
		}

		// Update tap location
		if (e.clientX != null && e.clientX != undefined) {
			_lastTapX = e.clientX;
		} else {
			_lastTapX = e.touches[0].clientX;
		}
		if (e.clientY != null && e.clientY != undefined) {
			_lastTapY = e.clientY;
		} else {
			_lastTapY = e.touches[0].clientY;
		}
	};
	
	var _inputUp = function() {
		// Update the last input time
		_resetLastInputTime();

		_printDebugText("Input released.");

		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			//return;
		}

		_resetAppInput();
	};
	
	var _inputOut = function(e) {
		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			e.stopPropagation();
			return;
		}

		// Check if the input has left the app (but still in the browser)
		var rect = _app.div.getBoundingClientRect();
		//if (_inputX < rect.left || _inputX > rect.right || _inputY < rect.top || _inputY > rect.bottom) {
		if (_inputX < rect.left || _inputX > rect.right || _inputY < rect.top + _app.statusbar.height || _inputY > rect.bottom) {
			_resetAppInput();
		}

		// Check if the input has left the browser
		//e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
            _resetAppInput();
        }
	};
	
	// An shortcut has been tapped
	var _onShortcutTap = function(shortcut) {
		// Stop input from doing other stuff (can't work, cuz how else would the user drag a full folder?)
		//e.stopPropagation();

		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			return;
		}

		// Check if active folder input is disabled
		if (!_activeFolder.inputEnabled) {
			return;
		}

		// Check if shortcut input is disabled
		if (!shortcut.inputEnabled) {
			return;
		}
		
		// Set the last tapped shortcut
		_tappedShortcut = shortcut;
		
		// Indicate that the shortcut has been tapped
		shortcut.tapped = true;
		
		// Add tapped class
		shortcut.div.classList.add("ShortcutTapped");

		// Indicate that the shortcut was tapped recently
		shortcut.lastTimeTapped = new Date().getTime();

		// After a delay, check if the shortcut is being held
		_shortcutHoldTimeout = setTimeout(function() {
			_checkShortcutHold(shortcut);
		}, _settings.holdDelay);
	}
	
	// Check if an shortcut is being held
	var _checkShortcutHold = function(shortcut) {
		_printDebugText("Checking if shortcut is being held...");
		
		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			return;
		}

		// If the shortcut is tapped and the folder isn't being dragged
		if (shortcut.tapped && !_activeFolder.draggingHorizontal && !_activeFolder.draggingVertical) {
			// And if the shortcut has been recently tapped
			if (shortcut.lastTimeTapped <= (new Date().getTime()) - _settings.holdDelay) {
				// Check if the input is still over the shortcut
				var xDifference = Math.abs(_inputX - _lastTapX);
				var yDifference = Math.abs(_inputY - _lastTapY);
				//_activeFolder.div.innerHTML = _inputX + " " + _lastTapX;
				//_activeFolder.div.innerHTML = xDifference + " " + yDifference + " " + _settings.dragDistance;
				if (xDifference < _settings.dragDistance && yDifference < _settings.dragDistance) {
					// Set this shortcut as the one being held
					_heldShortcut = shortcut;
					
					// Set starting drag position
					_heldShortcut.dragInputX = _inputX;
					_heldShortcut.dragInputY = _inputY;
					// Indicate that the shortcut is being held
					shortcut.held = true;
					
					// Add held class
					shortcut.div.classList.remove("ShortcutTapped");
					shortcut.div.classList.add("ShortcutHold");

					// Show shortcut edit area
					if (_activeFolder != _app.appFolder) {
						_app.shortcutEditArea.show(shortcut.type == "folder");

						// Hide the navbar
						_app.navbar.hide();
					}
					
					// Check if input is enabled
					if (shortcut.inputEnabled) {
						// Check for valid callback
						if (shortcut.holdCallback instanceof Function) {
							shortcut.holdCallback();
						};
					}
				}
			}
		}
	};
	
	// An shortcut has been untapped
	var _onShortcutUntap = function(e) {
		_printDebugText("Shortcut has been tapped.");
		
		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			return;
		}

		if (!_tappedShortcut) {
			return;
		}

		// Check if we untapped a shortcut on another shortcut (or other div)
		var div;

        // If we untapped the screen on mobile
        if (e.changedTouches) {
        	// Get the element at the untap position
        	var changedTouch = e.changedTouches[0];
    		div = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
         } else {
         	// Otherwise we're on desktop, so get the div by the cursor position
        	div = document.elementFromPoint(e.clientX, e.clientY);
        }

        // Check if we untapped the shortcut an element other than the tapped shortcut (or its text)
		if (div != _tappedShortcut.div && div != _tappedShortcut.textDiv) {
			// If we did, don't do anything
			if (_heldShortcut) {
				if (_heldShortcut.held) {
					_tappedShortcut.held = false
		
					// Remove held class
					_tappedShortcut.div.classList.remove("ShortcutHold");

					// Check if the shortcut is being held over the folder map or remove or edit buttons
					var folderMapArea = _app.folderMapArea.div.getBoundingClientRect();
					var trashRect = _app.shortcutEditArea.trashButton.div.getBoundingClientRect();
					var editRect = _app.shortcutEditArea.editButton.div.getBoundingClientRect();
					if (_inputX > folderMapArea.left && _inputX < folderMapArea.right && _inputY > folderMapArea.top && _inputY < folderMapArea.bottom) {
						_heldShortcut.moveHome();
					} else if (_inputX > trashRect.left && _inputX < trashRect.right && _inputY > trashRect.top && _inputY < trashRect.bottom) {
						_removeShortcut(_heldShortcut);
					} else if (_inputX > editRect.left && _inputX < editRect.right && _inputY > editRect.top && _inputY < editRect.bottom) {
						_editShortcut(_heldShortcut);
					} else {
						// Otherwise move the shortcut
						_moveShortcut();
					}
				}
			}

			_tappedShortcut.taps = 0;
			_tappedShortcut.tapped = false
			_tappedShortcut.lastTimeTapped = null;
			_tappedShortcut.div.classList.remove("ShortcutTapped");
			return;
		}

		// Check if the shortcut isn't tapped (if we've held the input down and then moved it over the shortcut or if we held input and move it to another shortcut)
		if (!_tappedShortcut.tapped) {
			// If the held shortcut is set, reset it
			if (_heldShortcut) {
				_heldShortcut.held = false
				_heldShortcut.div.classList.remove("ShortcutHold");
				
				// Check if we need to move a shortcut
				_moveShortcut();
			}
			
			// If the held shortcut is set, reset it
			if (_tappedShortcut) {
				_tappedShortcut.taps = 0;
				_tappedShortcut.tapped = false
				_tappedShortcut.lastTimeTapped = null;
				_tappedShortcut.div.classList.remove("ShortcutTapped");
				//_tappedShortcut = null;
			}
			return;
		}
		
		if (_heldShortcut) {
			if (_heldShortcut.held) {
				// Check if the shortcut is being held over the folder map or remove or edit buttons
				var folderMapArea = _app.folderMapArea.div.getBoundingClientRect();
				var trashRect = _app.shortcutEditArea.trashButton.div.getBoundingClientRect();
				var editRect = _app.shortcutEditArea.editButton.div.getBoundingClientRect();
				if (_inputX > folderMapArea.left && _inputX < folderMapArea.right && _inputY > folderMapArea.top && _inputY < folderMapArea.bottom) {
					_heldShortcut.moveHome();
				} else if (_inputX > trashRect.left && _inputX < trashRect.right && _inputY > trashRect.top && _inputY < trashRect.bottom) {
					_removeShortcut(_heldShortcut);
				} else if (_inputX > editRect.left && _inputX < editRect.right && _inputY > editRect.top && _inputY < editRect.bottom) {
					_editShortcut(_heldShortcut);
				} else {
					// Otherwise move the shortcut
					_moveShortcut();
				}
			}
		}

		// Indicate the shortcut is not being tapped
		_tappedShortcut.tapped = false;
		
		// Add held class
		_tappedShortcut.div.classList.remove("ShortcutTapped");

		// Indicate that the shortcut was not tapped recently
		_tappedShortcut.lastTimeTapped = null;

		// If the shortcut was being held
		if (_tappedShortcut.held) {
			_tappedShortcut.held = false
			
			// Remove held class
			_tappedShortcut.div.classList.remove("ShortcutHold");

			// Hide the shortcut edit area
			_app.shortcutEditArea.hide();

			// Show the navbar
			_app.navbar.show();
			
			// Check if input is enabled
			if (_tappedShortcut.inputEnabled) {
				// Check for valid callback
				if (_tappedShortcut.unholdCallback instanceof Function) {
					_tappedShortcut.unholdCallback();
				}
			}
		} else {
			_tappedShortcut.taps++;
			if (!_activeFolder.draggingHorizontal && !_activeFolder.draggingVertical) {
				if (_tappedShortcut.taps == 1) {
					setTimeout(function() {
						if (_tappedShortcut.taps == 1) {
							// Check if input is enabled
							if (_tappedShortcut.inputEnabled) {
								// Check for valid callback
								if (_tappedShortcut.tapCallback instanceof Function) {
									// Unhold the icon and don't check if we held it
									_tappedShortcut.div.classList.remove("ShortcutTapped");
									clearTimeout(_shortcutHoldTimeout);

									// Execute the callback
									_tappedShortcut.tapCallback(_tappedShortcut.params);
								}
							}
						} else if (_tappedShortcut.taps == 2) {
							if (_tappedShortcut.inputEnabled) {
								if (_tappedShortcut.doubleTapCallback instanceof Function) {
									// Unhold the icon and don't check if we held it
									_tappedShortcut.div.classList.remove("ShortcutTapped");
									clearTimeout(_shortcutHoldTimeout);

									// Execute the callback
									_tappedShortcut.doubleTapCallback();
								}
							}
						}
						_tappedShortcut.taps = 0;
					}, _settings.doubleTapDelay);
				}	
			}
		}
	};
	
	var _moveShortcut = function() {
		var position = _activeFolder.getInputPosition();
		if (position) {
			if (_activeFolder.shortcuts[position.row][position.column]) {
				_heldShortcut.moveHome();
			} else {
				_heldShortcut.moveByRowAndColumn(position.row, position.column);
			}
		}

		_saveStorage();
	};

	var _onFolderTap = function(e) {
		_printDebugText("Folder has been tapped.");
		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			e.stopPropagation();
			return;
		}

		// Prevent function from running twice
		if (_activeFolder.tapped) {
			return;
		}

		// Check if we are also clicking the navbar
		if (_app.navbar.tapped) {
			// If so, don't drag
			//return;
		} else {
			// Hide the navbar menu
			_app.navbarMenu.hide();
		}

		// Set app size
		_updateAppSize();

		// Remember starting drag point
		var rect = _activeFolder.div.getBoundingClientRect();
		_activeFolder.dragStartX = rect.left;
		_activeFolder.dragStartY = rect.top;

		// Indicate that the folder was tapped recently
		_activeFolder.lastTimeTapped = new Date().getTime();

		// Tap folder
		_activeFolder.tapped = true;

		// After a delay, check if the folder is being dragged
		setTimeout(function() {
			_checkFolderDrag();
		}, _settings.dragDelay);
	};
	
	// Check if the folder is being dragged
	var _checkFolderDrag = function() {
		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			return;
		}

		// Check if we are also clicking the navbar
		if (_app.navbar.tapped) {
			// If so, don't drag
			return;
		}

		// Remember drag input point
		_activeFolder.dragInputX = _inputX;
		_activeFolder.dragInputY = _inputY;
		
		// Keep checking if the folder has started dragging
		var update = function() {
			// Check if the folder is being tapped
			if (_activeFolder.tapped) {
				// Get the horizontal distance from the tap point
				var xDifference = Math.abs(_inputX - _lastTapX);
				
				// Get the vertical distance from the tap point
				var yDifference = Math.abs(_inputY - _lastTapY);
				
				// Check if the input has been moved past the minimum required for dragging
				if (xDifference > _settings.dragDistance || yDifference > _settings.dragDistance) {
					// Check if the folder is being dragged move vertically or horizontally
					if (xDifference > yDifference) {
						// Check if we're dragging left or right
						if (_inputX < _lastTapX) {
							// Check for next folder
							if (_activeFolder.nextFolder != null && _activeFolder.nextFolder != undefined) {
								_printDebugText("Folders are now being dragged horizontally.");
								_activeFolder.draggingHorizontal = true;
							}
						} else if (_inputX > _lastTapX) {
							// Check for previous folder
							if (_activeFolder.previousFolder != null && _activeFolder.previousFolder != undefined) {
								_printDebugText("Folders are now being dragged horizontally.");
								_activeFolder.draggingHorizontal = true;
							}
						}
					}
				}
			} else {
				// If the input isn't tapped, stop checking
				return;
			}
			
			// If we're not dragging and we're not hold the shortcut, check again for dragging
			if (!_activeFolder.draggingHorizontal && !_activeFolder.draggingVertical) {
				if (_heldShortcut) {
					if (!_heldShortcut.held) {
						setTimeout(update, _settings.dragCheckInterval);
					}
				} else {
					setTimeout(update, _settings.dragCheckInterval);
				}
			}
		};
		
		// Do the first check
		update();
	};

	// Drag the folder
	var _onFolderMove = function(e) {
		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			e.stopPropagation();
			return;
		}

		/*
		// If we haven't waited long enough between inputs, wait
		if (window.performance.now() < _lastFolderMoveTime + 100) {
			return;
		}

		_lastFolderMoveTime = window.performance.now();
		*/

		// Check if the folder is tapped and dragging
		if (_activeFolder.tapped) {
			if (_activeFolder.draggingHorizontal) {

				// If we have a previous folder and are moving right, move the folders
				if (_activeFolder.previousFolder != null && _activeFolder.previousFolder != undefined) {
					var x;
					if (e.clientX != null && e.clientX != undefined) {
						x = e.clientX;
					} else {
						x = e.touches[0].clientX;
					}
					if (x > _activeFolder.dragInputX) {
						_activeFolder.setListPosition((x - _activeFolder.dragInputX) / _activeFolder.width * 100);

						// Move the background
						_setBackgroundPosition((x - _activeFolder.dragInputX) * _settings.backgroundMoveRatio);
					}
				}

				if (_activeFolder.nextFolder != null && _activeFolder.nextFolder != undefined) {
					var x;
					if (e.clientX != null && e.clientX != undefined) {
						x = e.clientX;
					} else {
						x = e.touches[0].clientX;
					}
					if (x < _activeFolder.dragInputX) {
						_activeFolder.setListPosition((x - _activeFolder.dragInputX) / _activeFolder.width * 100);

						// Move the background
						_setBackgroundPosition((x - _activeFolder.dragInputX) * _settings.backgroundMoveRatio);
					}
				}
			} else if (_activeFolder.draggingVertical) {
				/*
				var appRect = _app.div.getBoundingClientRect();

				var y;
				if (e.clientY != null && e.clientY != undefined) {
					y = e.clientY;
				} else {
					y = e.touches[0].clientY;
				}

				// Move the folder
				var top = (_activeFolder.dragStartY + y - _activeFolder.dragInputY - appRect.top) / appRect.height * 100;

				// Check if we're moving down too far
				if (top > _activeFolder.homeY) {
					top = _activeFolder.homeY;
				}

				// Check if we're moving up too far
				var rect = _activeFolder.div.getBoundingClientRect();
				var navbarRect = _app.navbar.div.getBoundingClientRect();

				//console.log(rect.height, _getUsableHeight());
				var ratio = rect.height / _getUsableHeight();
				//console.log(top, ratio * 100);
				if (top < -100) {
					top = -100;
				}

				_activeFolder.div.style.top = top + "%";
				*/
			}
		}
	};

	var _onFolderUntap = function(e) {
		_printDebugText("Folder has been untapped.");

		// Check if app input is disabled
		//if (!_inputEnabled) {
		if (!_getInputEnabled()) {
			//e.stopPropagation(); // Causes tap release callback not to fire after unclicking a menu button on the menu
			return;
		}

		// Reset last tap time
		_activeFolder.lastTimeTapped = null;

		// Prevent function from running twice
		if (_activeFolder.tapped == false) {
			return;
		}

		// Untap folder
		_activeFolder.tapped = false;

		// If we didn't drag the folder, don't move it
		if (!_activeFolder.draggingHorizontal && !_activeFolder.draggingVertical) {
			return;
		}
		
		// Check if we're dragging horizontal or vertical
		if (_activeFolder.draggingHorizontal) {
			// Undrag the folder
			_activeFolder.draggingHorizontal = false;
			_activeFolder.draggingVertical = false;

			// Scroll to the nearest full shortcut being shown
			var rect = _activeFolder.div.getBoundingClientRect();
			var appRect = _app.div.getBoundingClientRect();
			
			var left = window.getComputedStyle(_activeFolder.div, null).getPropertyValue("left");
			left = Number(left.substring(0, left.length - 2));
			var difference = left % appRect.width;

			// Check if the folder has been dragged far enough to move to the next folder
			if (difference > 0) {
				if (difference > appRect.width * _settings.folderSlideRatio) {
					// Select last folder
					_activeFolder.selectPreviousFolder();
				} else {
					// Move folders to home position
					_activeFolder.moveListHome();
					
					// Move the background home
					_moveElement(_app.background, _app.background.homeX);
				}
			} else if (difference < 0) {
				if (difference < -appRect.width * _settings.folderSlideRatio) {
					// Select next folder
					_activeFolder.selectNextFolder();
				} else {
					// Move folders to home position
					_activeFolder.moveListHome();
					
					// Move the background home
					_moveElement(_app.background, _app.background.homeX);
				}
			}
		} else if (_activeFolder.draggingVertical) {
			// TODO: Move folder based on percent, not pixels
			/*
			// Undrag the folder
			_activeFolder.draggingHorizontal = false;
			_activeFolder.draggingVertical = false;
			
			// Scroll to the nearest full shortcut being shown
			var rect = _activeFolder.div.getBoundingClientRect();
			var appRect = _app.div.getBoundingClientRect();
			
			var difference = (rect.top - appRect.top - _app.statusbar.height) % _activeFolder.rowHeight;

			// Check if we need to go up, down, or not move at all
			//if (difference == 0) {
			if (Math.abs(difference) < 2) { // Check for a bit of variance (fixes problem where barely moving the folder just causes it to kind of vibrate)
				//return;
			}
			
			// If we've moved less than one pixel, don't do anything
			var topValue = Math.abs(Number(_activeFolder.div.style.top.substring(0, _activeFolder.div.style.top.length - 2)));
			var newTopValue = Math.abs(rect.top  - appRect.top - (_activeFolder.rowHeight + difference));
			if (newTopValue - topValue < 1) {
				return;
			}
			
			if (difference < -_activeFolder.rowHeight / 2) {
				_moveElement(_activeFolder, null, rect.top  - appRect.top - (_activeFolder.rowHeight + difference));
			} else {
				_moveElement(_activeFolder, null, rect.top - appRect.top - difference);
			}
			*/
		}
	};

	// Move an element by % (compatible with CSS transitions)
	var _moveElementCSS = function(element, left, top, instantFlag, tempFlag) {
		// If we're moving the element instantly
		if (instantFlag) {
			// Disable transitions
			element.div.classList.add("NoTransition");

			// Move the element and update home position
			if (left != null && left != undefined) {
				element.div.style.left = left;

				// If the move is temporary, don't update the home position
				if (!tempFlag) {
					element.homeX = Number(left.substring(0, left.length - 1));	
				}
			}
			if (top != null && top != undefined) {
				element.div.style.top = top;

				// If the move is temporary, don't update the home position
				if (!tempFlag) {
					element.homeY = Number(top.substring(0, top.length - 1));
				}
			}

			// Flush CSS changes
			element.div.offsetHeight;

			// Enable transitions
			element.div.classList.remove("NoTransition");
		} else {
			// Otherwise get the transition time
			var transitionTime = parseFloat(getComputedStyle(element.div)['transitionDuration']);

			// Move the element
			if (left != null && left != undefined) {
				element.div.style.left = left;

				// If the move is temporary, don't update the home position
				if (!tempFlag) {
					element.homeX = Number(left.substring(0, left.length - 1));
				}
			}
			if (top != null && top != undefined) {
				element.div.style.top = top;

				// If the move is temporary, don't update the home position
				if (!tempFlag) {
					element.homeY = Number(top.substring(0, top.length - 1));
				}
			}

			// Increase the number of moving elements (to disable input)
			_movingElementCount++;

			// Decrease the number of moving elements (to enable input)
			setTimeout(function() {
				_movingElementCount--;
			}, transitionTime);
		}
	};

	// Smoothly move a folder or shortcut to a new position (for elements without CSS transitions)
	var _moveElement = function(element, endingLeft, endingTop, transitionTime) {
		// Increase the number of moving elements
		_movingElementCount++;
		
		// Disable app input while the element moves
		//_inputEnabled = false;
		
		// Clear existing movement functions if we're starting a new one in the same dimension
		if (endingLeft != null && endingLeft != undefined) {
			clearTimeout(element.timeoutX);
		}
		if (endingTop != null && endingTop != undefined) {
			clearTimeout(element.timeoutY);
		}
		if (endingLeft != null && endingLeft != undefined || endingTop != null && endingTop != undefined) {
			//_movingElementCount--;
		}

		// Get starting top
		var rect = element.div.getBoundingClientRect();
		var appRect = _app.div.getBoundingClientRect();
		var startingLeft = Number(element.div.style.left.substring(0, element.div.style.left.length - 2));
		var startingTop = Number(element.div.style.top.substring(0, element.div.style.top.length - 2));

		// Set last time updated
	    var lastTime = new Date().getTime();

	    // Set time remaining
		if (transitionTime != null && transitionTime != undefined) {
			transitionTime = transitionTime;
		} else {
			transitionTime = _settings.moveDuration;
		}
		var timeLeft = transitionTime;

	    // Move the element a bit
	    var update = function() {
	    	// Update time
	        var currentTime = new Date().getTime();
	        var elapsed = currentTime - lastTime;
	        timeLeft -= elapsed;
	        lastTime = currentTime;

	        // Get percentage complete
	        var percentDone = 1 - timeLeft / transitionTime;

	        // Move the element
			if (endingLeft != null && endingLeft != undefined) {
				//element.div.style.left = _linearEase(startingLeft, endingLeft, percentDone) + "px";
				element.div.style.left = _ease(startingLeft, endingLeft, percentDone, _easeOutQuad) + "px";
			}
			if (endingTop != null && endingTop != undefined) {
				//element.div.style.top = _linearEase(startingTop, endingTop, percentDone) + "px";
				element.div.style.top = _ease(startingTop, endingTop, percentDone, _easeOutQuad) + "px";
			}

	        // Check if we need to move again or if we're done
	        if (timeLeft > 0) {
	            var timeout = setTimeout(update, _settings.moveInterval);
				if (endingLeft != null && endingLeft != undefined) {
					element.timeoutX = timeout;
				}
				if (endingTop != null && endingTop != undefined) {
					element.timeoutY = timeout;
				}
	        } else {
	        	// Make sure the element arrives at the exact end position
				if (endingLeft != null && endingLeft != undefined) {
					element.div.style.left = endingLeft + "px";
				}
				if (endingTop != null && endingTop != undefined) {
					element.div.style.top = endingTop + "px";
				}
				
	        	// Enable input
	        	//_inputEnabled = true;
				_movingElementCount--;
				
				// Update home position
				if (endingLeft != null && endingLeft != undefined) {
					element.homeX = endingLeft;
				}
				if (endingTop != null && endingTop != undefined) {
					element.homeY = endingTop;
				}

				return;
	        }
	    }

	    // Run the first update
		update();
	};

	// Get statusbar height
	var _getStatusbarHeight = function() {
		return _app.statusbar.div.getBoundingClientRect().height;
	};

	// Get navbar height
	var _getNavbarHeight = function() {
		return _app.navbar.div.getBoundingClientRect().height;
	};

	// Get usable height of app
	var _getUsableHeight = function() {
		var appRect = _app.div.getBoundingClientRect();
		var statusbarRect = _app.statusbar.div.getBoundingClientRect();
		var navbarRect = _app.navbar.div.getBoundingClientRect();
		return appRect.height - statusbarRect.height - navbarRect.height;
	};

	/*
	t: current time/currnet step
	b: starting position
	c: amount of change (end - start)
	d: total animation time/steps
	*/
	// Ease a value using a given function
	var _ease = function(start, end, percent, func) {
		return func(percent, start, end - start, 1);
	};

	// Get the linear value between a start value and an end value based on current percentage
	var _linearEase = function(t, b, c, d) {
	    return b + c * t;
	    //return start + ((end - start) * percent);
	};

	var _easeInQuad = function(t, b, c, d) {
		return c*(t/=d)*t + b;
	};

	var _easeOutQuad = function(t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	};

	var _easeInOutQuad = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	};

	var _easeInCubic = function(t, b, c, d) {
		return c*(t/=d)*t*t + b;
	};

	var _easeOutCubic = function(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	};
	
	var _easeInOut = function(start, end, percent) {
		return start + ((end - start * end - start)) * percent;
	};

	// Add a div to the app
	var _addDiv = function(parent, className, onInputDown, onInputUp, onInputOver, onInputOut) {
		// Add back button
		var div = {};

		// Store the div
		div.div = document.createElement("div");
		
		// Add the child div
		parent.div.appendChild(div.div);

		// Add default class
		div.div.className = className;

		// Check if input has been pressed
		if (onInputDown) {
			if (_mobile) {
				div.div.addEventListener("touchstart", function() { if (_getInputEnabled()) { onInputDown(div) } });
			} else {
				div.div.addEventListener("mousedown", function() { if (_getInputEnabled()) { onInputDown(div) } });	
			}
		}
		if (onInputUp) {
			if (_mobile) {
				div.div.addEventListener("touchend", function() { if (_getInputEnabled()) { onInputUp(div) } });
			} else {
				div.div.addEventListener("mouseup", function() { if (_getInputEnabled()) { onInputUp(div) } });
			}
			
		}
		if (onInputOver) {
			div.div.addEventListener("mouseover", function() { if (_getInputEnabled()) { onInputOver(div) } });
		}
		if (onInputOut) {
			div.div.addEventListener("mouseout", function() { onInputOut(div) } );
		}

		return div;
	};

	// Go to the last active folder
	var _goBack = function() {
		_app.navbarMenu.hide();

		// If we're showing a frame, exit the frame
		if (_frameShowing) {
			_hideLoadingScreen();
			_hideFrame();
		} else {
			// Check if we have a last active folder
			if (_lastActiveFolder != null && _lastActiveFolder != undefined) {
				// Check if it's the previous folder
				if (_lastActiveFolder == _activeFolder.previousFolder) {
					_activeFolder.selectPreviousFolder();
				} else if (_lastActiveFolder == _activeFolder.nextFolder) {
					// Otherwise check if it's the next folder
					_activeFolder.selectNextFolder();
				} else if (_activeFolder.parentShortcut) {
					// Otherwise check if it's the parent folder
					if (_lastActiveFolder == _activeFolder.parentShortcut.parentFolder) {
						_activeFolder.selectParentFolder();
					}
				} else {
					// Otherwise check if it's a subfolder
					for (var r = 0; r < _activeFolder.rowCount; r++) {
						for (var c = 0; c < _activeFolder.columnCount; c++) {
							if (_activeFolder.shortcuts[r][c] != null && _activeFolder.shortcuts[r][c] != undefined) {
								// Check if the 
								if (_lastActiveFolder == _activeFolder.shortcuts[r][c].lastActiveSubfolder) {
									_activeFolder.shortcuts[r][c].selectSubfolder();
									return;
								}
							}
						}
					}
				}
			}
		}
	};

	// Go to the parent folder of the active folder
	var _goUp = function() {
		// Hide the navbar menu
		_app.navbarMenu.hide();

		// If we're showing a frame, exit the frame
		if (_frameShowing) {
			_hideLoadingScreen();
			_hideFrame();
		} else if (_appFolderShowing) {
			// Hide the app folder
			_app.appFolder.hide();

			// Show the folder map
			_app.folderMapArea.show();
		} else {
			_activeFolder.selectParentFolder();
		}
	};

	// Go to the home folder
	var _goHome = function(instantFlag) {
		// Hide the navbar menu
		_app.navbarMenu.hide();
		
		// If we're showing a frame, exit the frame
		if (_frameShowing) {
			_hideLoadingScreen();
			_hideFrame();
		} else if (_appFolderShowing) {
			// Hide the app folder
			_app.appFolder.hide();

			// Show the folder map
			_app.folderMapArea.show();

			// Show the home folder
			_activeFolder.selectHomeFolder(instantFlag);
		} else {
			// Show the home folder
			_activeFolder.selectHomeFolder(instantFlag);
		}
	};

	// Show the available apps
	var _showAppFolder = function() {
		// Hide the active folder (so background is visible)
		_activeFolder.div.style.opacity = "0";

		// Hide the navbar menu
		_app.navbarMenu.hide();
		
		// Hide the loading screen
		_hideLoadingScreen();

		// Hide the frame
		_hideFrame();

		if (_appFolderShowing) {
			_app.appFolder.hide();
		} else {
			_app.appFolder.show();
		}
	};
	
	var _addFolder = function(instantFlag, currentFolder, autoAddSiblingFolderEnabled, folderMapDisabled) {
		if (currentFolder == null || currentFolder == undefined) {
			currentFolder = _activeFolder;
		}
		var folder = currentFolder.addFolder(instantFlag, autoAddSiblingFolderEnabled, folderMapDisabled);

		_saveStorage();

		return folder;
	};

	var _addSubfolder = function() {
		// Check if we have reached the maximum folder depth
		if (_activeFolder.getDepth() >= _settings.maxSubfolders) {
			_textModal.show("Whoops!", "You can't go any deeper.");
			return false;
		}

		// Check if the folder is full
		var nextAvailablePosition = _activeFolder.getNextAvailableShortcutPosition();
		if (nextAvailablePosition) {
			//row = nextAvailablePosition.row;
			//column = nextAvailablePosition.column;

			// Get info from the user
			_createSubfolderModal.show();
		} else {
			_textModal.show("ERROR!", "Can't create subfolder because the folder is full.");
		}
	};

	// Create the subfolder based on user input
	var _createSubfolder = function(data) {
		// Check if we have data
		if (data != null && data != undefined) {
			// Check if we have a folder name
			if (data.folderName != null && data.folderName != undefined) {
				// If we do, use it
				_activeFolder.addShortcut(null, data.folderName);
				_saveStorage();
			} else {
				// If not, use the default folder name
				_activeFolder.addShortcut(null, _settings.defaultFolderName);
				_saveStorage();
			}
		}
	};

	/*
	var _addShortcut = function() {
		_createShortcutModal.show();
	};
	
	var _createShortcut = function(data) {
		var imageText = "";
		var icon = "img/icons/";
		if (data.shortcutType == "link") {
			imageText = "Link";
			icon += "external-link.png";
			data.url = "http://www.facebook.com";
		} else if (data.shortcutType == "folder") {
			imageText = "Subfolder";
			icon += "open-folder.png";
		}

		_activeFolder.addShortcut(imageText, icon, data.url, null, null);
	};
	*/

	var _removeShortcut = function(shortcut) {
		// Unhighlight the button (for mobile, which doesn't automatically do this)

		shortcut.remove();

		// Remove the highlight (for mobile)
		_app.shortcutEditArea.trashButton.div.classList.remove("EditButtonHover");

		_saveStorage();
	};
	
	var _editShortcut = function(shortcut) {
		shortcut.moveHome();

		_editShortcutModal.show(null, null, {shortcut: shortcut});
	};
	
	// Move a shortcut to its new position after being dragged
	var _moveShortcutForward = function(shortcut, position) {
		
	};
	
	// Adjust shortcut positions ahead inserting a shortcut
	var _moveShortcutsForward = function(shortcut) {
		//for (var i = _activeFolder.shortcuts.length - 1; i > 0; i--) {
		for (var i = _activeFolder.shortcuts.length - 1; i >= 0; i--) {
			var left = Number(shor.shortcuts[i].div.style.left.substring(0, _activeFolder.shortcuts[i].div.style.left.length - 2));
			var top = Number(_activeFolder.shortcuts[i].div.style.top.substring(0, _activeFolder.shortcuts[i].div.style.top.length - 2));

			var x = left + _activeFolder.columnWidth;
			var y = top;

			if (x / _activeFolder.columnWidth >= _activeFolder.columnCount) {
				y += _activeFolder.rowHeight;
				x = 0;
			}
			
			_activeFolder.shortcuts[i].div.style.left = x + "px";
			_activeFolder.shortcuts[i].div.style.top = y + "px";
		}
	};

	// Scroll all the way to the bottom of a surface
	var _scrollToBottom = function() {
		var rect = _activeFolder.div.getBoundingClientRect();
		var appRect = _app.div.getBoundingClientRect();
		var top = Number(_activeFolder.div.style.top.substring(0, _activeFolder.div.style.top.length - 2));
		
		// Check if we actually need to move
		if (top - (appRect.height - rect.height) > 1) {
			_moveElement(_activeFolder, null, appRect.height - rect.height);
		}
	};
	
	var _removeFolder = function(folder, instantFlag, hiddenFlag, skipPrompt) {
		// If a folder wasn't passed in, remove the active folder
		if (folder == null && folder == undefined) {
			folder = _activeFolder;
		}

		// If we're trying to remove the active folder without any animations, don't remove it
		if (hiddenFlag && _activeFolder == folder) {
			_textModal.show("Whoops!", "Can't remove active folder without animations.");
			return false;
		}

		// If this is the home folder, don't remove it
		if (folder == _app.homeFolder) {
			_textModal.show("Whoops!", "You can't delete the home folder.");
			return false;
		}

		// If there are shortcuts, warn the user
		var hasShortcuts = false;
		for (var r = 0; r < folder.rowCount; r++) {
			for (var c = 0; c < folder.columnCount; c++) {
				if (folder.shortcuts[r][c] != null && folder.shortcuts[r][c] != undefined) {
					hasShortcuts = true;
				}
			}
		}

		if (hasShortcuts && !instantFlag && !hiddenFlag) {
			if (!skipPrompt) {
				_confirmModal.setAcceptCallback(function() {
					folder.remove();

					_saveStorage();
				});
				_confirmModal.show("WARNING!", "Deleting folder will delete its shortcuts.");
			} else {
				folder.remove();

				_saveStorage();
			}
		} else {
			folder.remove(instantFlag, hiddenFlag);

			_saveStorage();
		}
	};

	var _reset = function(promptFlag) {
		_printDebugText("Resetting folders and shortcuts...");

		// Check if we're prompting the user to reset the app
		if (promptFlag) {
			_confirmModal.setAcceptCallback(function() {
				_app.reset();
			});
			_confirmModal.show("WARNING!", "Resetting app will delete shortcuts and folders.");
		} else {
			_app.reset();
		}
	};

	var _showSettings = function() {
		console.log("Showing settings...");
	};

	var _showInfo = function() {
		_textModal.show("About", "<p>\"No libraries were used in the making of this page.\"</p><p>\—Duncan Priebe</p>");
	};

	var _goFullscreen = function(div) {
		if (div.requestFullscreen) {
			div.requestFullscreen();
		} else if (div.mozRequestFullScreen) {
			//Firefox
			div.mozRequestFullScreen();
		} else if (div.webkitRequestFullscreen) { 
			// Chrome, Safari and Opera
			div.webkitRequestFullscreen();
		} else if (div.msRequestFullscreen) { 
			// Internet Explorer and Edge
	    	div.msRequestFullscreen();
		}
	};

	var _navbarMenuButtonTapped = function() {
		if (!_getInputEnabled()) {
			return;
		}

		if (_appFolderShowing) {
			// Show the folder map
			_app.folderMapArea.show();

			// Hide the app folder
			_app.appFolder.hide();
		}
		
		// If we're showing a frame, exit the frame
		if (_frameShowing) {
			_hideLoadingScreen();
			_hideFrame(setTimeout(function() {
				if (_app.navbarMenu.showing == false) {
					_app.navbarMenu.show();
				} else {
					_app.navbarMenu.hide();
				}
			}), _settings.frameTransitionTime);
		} else {
			if (_app.navbarMenu.showing == false) {
				_app.navbarMenu.show();
			} else {
				_app.navbarMenu.hide();
			}
		}
	};

	// Flash a button to indicate it was pressed
	var _startButtonPressAnimation = function(button) {
		button.div.classList.add("NavbarButtonPressed");
		setTimeout(function() {
			button.div.classList.remove("NavbarButtonPressed");
		}, _settings.buttonFlashTime);
	};

	// The input was pressed over the navbar
	var _onNavbarTap = function(){
		_app.navbar.tapped = true;
	};

	// The input was released over the navbar
	var _onNavbarUntap = function() {
		_app.navbar.tapped = false;

		// If the held shortcut is set, reset it
		if (_tappedShortcut) {
			_tappedShortcut.taps = 0;
			_tappedShortcut.tapped = false
			_tappedShortcut.div.classList.remove("ShortcutTapped");
		}
	};

	// A navbar button is hovered over
	var _onButtonHover = function(button) {
		if (_tappedShortcut) {
			if (!_tappedShortcut.tapped) {
				button.div.classList.add("NavbarButtonHover");
			}
		} else {
			button.div.classList.add("NavbarButtonHover");
		}
	};

	// A navbar button is no longer hovered over
	var _onButtonUnhover = function(button) {
		button.div.classList.remove("NavbarButtonHover");
	};

	var _createModals = function() {
		/***********************************
		*********** Text Modal *************
		************************************/
		_textModal = new Modal();

		/***********************************
		********** Confirm Modal ***********
		************************************/
		// Create the confirm modal
		_confirmModal = new Modal();
		
		_confirmModal.setAcceptCallback = function(callback) {
			_confirmModal.acceptCallback = callback;
		}

		_confirmModal.setDenyCallback = function(callback) {
			_confirmModal.denyCallback = callback;
		}

		_confirmModal.acceptButton = _confirmModal.addButton("glyphicon-ok", function() {
			if (_confirmModal.acceptCallback instanceof Function) {
				_confirmModal.acceptCallback();
			}
			_hideModal(_confirmModal);
		});

		_confirmModal.denyButton = _confirmModal.addButton("glyphicon-remove", function() {
			if (_confirmModal.denyCallback instanceof Function) {
				_confirmModal.denyCallback();
			}
			_hideModal(_confirmModal);
		});

		_confirmModal.setEnterCallback(function() {
			if (_confirmModal.acceptCallback instanceof Function) {
				_confirmModal.acceptCallback();
			}
			_hideModal(_confirmModal);
		});

		_confirmModal.reset = function() {
			setTimeout(function () {
		    	_confirmModal.acceptButton.div.focus();
		    }, _settings.modalHideTime);
		};

		/***********************************
		****** Create Shortcut Modal *******
		************************************/
		/*
		_createShortcutModal = new Modal("Create Shortcut");
		
		// Add the buttons
		_createShortcutModal.linkButton = _createShortcutModal.addButton("glyphicon-new-window", function() {
			_createShortcutModal.data.shortcutType = "link";
			_createShortcutModal.linkButton.div.classList.add("ModalButtonSelected");
			_createShortcutModal.folderButton.div.classList.remove("ModalButtonSelected");
		});

		_createShortcutModal.folderButton = _createShortcutModal.addButton("glyphicon-folder-open", function() {
			_createShortcutModal.data.shortcutType = "folder";
			_createShortcutModal.linkButton.div.classList.remove("ModalButtonSelected");
			_createShortcutModal.folderButton.div.classList.add("ModalButtonSelected");
		});

		_createShortcutModal.acceptButton = _createShortcutModal.addButton("glyphicon-ok", function() {
			_createShortcut(_createShortcutModal.data);
			_hideModal(_createShortcutModal);
		}, true);

		// Set reset function
		_createShortcutModal.reset = function() {
			// Set default values
			_createShortcutModal.data = {};
			_createShortcutModal.data.shortcutType = "link";
			_createShortcutModal.linkButton.div.classList.add("ModalButtonSelected");
			_createShortcutModal.folderButton.div.classList.remove("ModalButtonSelected");
		};

		_createShortcutModal.reset();
		*/

		/***********************************
		****** Edit Shortcut Modal *******
		************************************/
		_editShortcutModal = new Modal("Edit Folder");

		// Add the buttons
		_editShortcutModal.nameInput = _editShortcutModal.addTextInput("glyphicon-new-window", "Folder");

		_editShortcutModal.acceptButton = _editShortcutModal.addButton("glyphicon-ok", function() {
			_editShortcutModal.data.shortcut.textDiv.innerHTML = _editShortcutModal.nameInput.div.value;
			_editShortcutModal.data.shortcut.text = _editShortcutModal.nameInput.div.value;

			// Remove the highlight (for mobile)
			_app.shortcutEditArea.editButton.div.classList.remove("EditButtonHover");

			_saveStorage();
			_hideModal(_editShortcutModal);
		}, true);
		

		_editShortcutModal.setEnterCallback(function() {
			_editShortcutModal.data.shortcut.textDiv.innerHTML = _editShortcutModal.nameInput.div.value;
			_editShortcutModal.data.shortcut.text = _editShortcutModal.nameInput.div.value;

			// Remove the highlight (for mobile)
			_app.shortcutEditArea.editButton.div.classList.remove("EditButtonHover");

			_saveStorage();
			_hideModal(_editShortcutModal);
		});

		_editShortcutModal.reset = function(data) {
			// Set input value to current shortcut text
			_editShortcutModal.nameInput.div.value = data.shortcut.textDiv.innerHTML;

			// Set default values
			_editShortcutModal.data = data;
			
			// Add a delay for mobile compliance (so it doesn't pull up the keyboard during the transition or fail to select)
			setTimeout(function () {
		    	//_editShortcutModal.nameInput.div.focus();
		    	_editShortcutModal.nameInput.div.select();
		    }, _settings.modalHideTime);
		}

		/***********************************
		****** Create Subfolder Modal ******
		************************************/
		_createSubfolderModal = new Modal("Add Subfolder");

		// Add the buttons
		_createSubfolderModal.nameInput = _createSubfolderModal.addTextInput("glyphicon-new-window", "Folder");

		_createSubfolderModal.acceptButton = _createSubfolderModal.addButton("glyphicon-ok", function() {
			_createSubfolderModal.data.folderName = _createSubfolderModal.nameInput.div.value;
			_createSubfolder(_createSubfolderModal.data);
			_hideModal(_createSubfolderModal);
		}, true);
		
		_createSubfolderModal.setEnterCallback(function() {
			_createSubfolderModal.data.folderName = _createSubfolderModal.nameInput.div.value;
			_createSubfolder(_createSubfolderModal.data);
			_hideModal(_createSubfolderModal);
		});

		_createSubfolderModal.reset = function() {
			// Set default values
			_createSubfolderModal.data = {};

			_createSubfolderModal.nameInput.div.value = "Folder";

			// Add a delay for mobile compliance (so it doesn't pull up the keyboard during the transition or fail to select)
			setTimeout(function () {
		    	//_createSubfolderModal.nameInput.div.focus();
		    	_createSubfolderModal.nameInput.div.select();
		    }, _settings.modalHideTime);
		}
	};

	var _hideModal = function() {
		// Indicate that no modal is showing (for key handling)
		_modalShowing = false;

		// Indicate that the active modal is no longer being shown (for key handling)
		_activeModal.showing = false;

		_modalBackground.div.style.opacity = 0;

		setTimeout(function() {
			_modalBackground.div.style.zIndex = -1;
		}, _settings.modalHideTime);

		_activeModal.div.style.opacity = 0;

		setTimeout(function() {
			_activeModal.div.style.zIndex = -1;
		}, _settings.modalHideTime)
	};

	var _showModal = function(modal) {
		// Indicate that the modal is showing (for key handling)
		_modalShowing = true;

		_modalBackground.div.style.opacity = 1;
		_modalBackground.div.style.zIndex = 7;

		modal.div.style.opacity = 1;
		modal.div.style.zIndex = 8;

		_activeModal = modal;
	};
	
	var _createLoadingScreen = function() {
		_loadingScreen = _addDiv(_app, "LoadingScreen");
		_loadingScreen.spinner = _addDiv(_loadingScreen, "LoadingScreenSpinner");
	};
	
	var _showLoadingScreen = function() {
		_loadingScreen.div.style.opacity = 1;
		_loadingScreen.div.style.zIndex = 2;
	};
	
	var _hideLoadingScreen = function() {
		_loadingScreen.div.style.opacity = 0;
		_loadingScreen.div.style.zIndex = -1;
	};

	var _createLockoutScreen = function() {
		_lockoutScreen = _addDiv(_app, "LockoutScreen");
		//_lockoutScreen.slider = _addDiv(_lockoutScreen, "LockoutScreenSlider");

		// Create time div
		_lockoutScreen.time = _addDiv(_lockoutScreen, "LockoutScreenTime");
		
		// Add time text
		_lockoutScreen.time.text = document.createElement("div");

		// Add default class
		_lockoutScreen.time.text.classList.add("LockoutScreenTimeText");

		// Add the text div
		_lockoutScreen.time.div.appendChild(_lockoutScreen.time.text);

		// Set class
		_lockoutScreen.time.text.classList.add("StatusbarElementText");
		
		// Update time
		_lockoutScreen.updateTime = function() {
			var date = new Date();
			var hours = date.getHours();
			var minutes = date.getMinutes();

			var suffix = "AM";
			if (hours > 12) {
				hours -= 12;
				suffix = "PM";
			}

			if (hours == 0) {
				hours = 12;
			}

			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			
			var time = hours + ":" + minutes + " " + suffix;
			
			_printDebugText("Updating lockout time... " + time);

			_lockoutScreen.time.text.innerHTML = time;
		};

		_lockoutScreen.updateTime();

		setInterval(_lockoutScreen.updateTime, _settings.timeUpdateDelay);

		// Add lock icon
		_lockoutScreen.lockIcon = _addDiv(_lockoutScreen, "LockoutScreenLockIcon glyphicon glyphicon-lock");

		// Add the slider area
		_lockoutScreen.sliderArea = _addDiv(_lockoutScreen, "LockoutScreenSliderArea");

		// Add the slider
		_lockoutScreen.sliderArea.slider = _addDiv(_lockoutScreen.sliderArea, "LockoutScreenSlider");

		// Add the slider text
		_lockoutScreen.sliderArea.slider.text = _addDiv(_lockoutScreen.sliderArea.slider, "LockoutScreenSliderText");
		_lockoutScreen.sliderArea.slider.text.div.innerHTML = "slide to unlock";

		// Add the slider button
		_lockoutScreen.sliderArea.slider.button = _addDiv(_lockoutScreen.sliderArea.slider, "LockoutScreenSliderButton");

		// Add the slider button icon
		_lockoutScreen.sliderArea.slider.button.icon = _addDiv(_lockoutScreen.sliderArea.slider.button, "LockoutScreenSliderButtonIcon glyphicon glyphicon-chevron-right");

		// Set the slider home location and value
		var sliderRect = _lockoutScreen.sliderArea.slider.div.getBoundingClientRect();
		var buttonRect = _lockoutScreen.sliderArea.slider.button.div.getBoundingClientRect();
		var buttonWidthPercent = Math.round(buttonRect.width / sliderRect.width * 100);
		_lockoutScreen.sliderArea.slider.button.homeX = buttonWidthPercent / 2;

		// Add slider movement
		if (_mobile) {
			_lockoutScreen.sliderArea.slider.button.div.addEventListener("touchstart", _unlockSliderDragStart);

			_lockoutScreen.div.addEventListener("touchend", _unlockSliderDragEnd);

			_lockoutScreen.div.addEventListener("touchmove", _unlockSliderDrag);

			var touchMove = function(e) {
				// Prevent scrolling
				e.preventDefault();
			}

			_lockoutScreen.div.addEventListener("touchend", function() {
				_goFullscreen(_app.div);
			});

			_lockoutScreen.div.addEventListener("touchmove", touchMove);
		} else {
			_lockoutScreen.sliderArea.slider.button.div.addEventListener("mousedown", _unlockSliderDragStart);

			//_lockoutScreen.slider2.button.div.addEventListener("mouseup", _unlockSliderDragEnd);
			_lockoutScreen.div.addEventListener("mouseup", _unlockSliderDragEnd);

			//_lockoutScreen.slider2.button.div.addEventListener("mousemove", _unlockSliderDrag);
			_lockoutScreen.div.addEventListener("mousemove", _unlockSliderDrag);
		}

		// Add the slider function
		if (_mobile) {
			_lockoutScreen.sliderArea.slider.div.addEventListener("touchend", _checkLockoutSlider);
		} else {
			_lockoutScreen.sliderArea.slider.div.addEventListener("mouseup", _checkLockoutSlider);
		}
	};

	var _checkLockoutSlider = function() {
		if (_lockoutScreen.sliderArea.slider.div.value == 100) {
			_unlock();
		} else if (_lockoutScreen.sliderArea.slider.div.value > 0) {
			_lockoutScreen.sliderArea.slider.div.disabled = true;
			var reset = setInterval(function() {
				if (_lockoutScreen.sliderArea.slider.div.value == 1) {
					_lockoutScreen.sliderArea.slider.div.value = 0;
					clearInterval(reset);
					_lockoutScreen.sliderArea.slider.div.disabled = false;
				} else {
					_lockoutScreen.sliderArea.slider.div.value /= 2;
				}
			}, 25);
		}
	};

	var _lockScreen = function() {
		_resetAppInput();

		if (_app.navbarMenu) {
			if (_app.navbarMenu.showing) {
				_app.navbarMenu.hide();
			}
		}

		if (_app.appFolder) {
			if (_appFolderShowing) {
				_app.appFolder.hide();

				// Show the folder map
				_app.folderMapArea.show();
			}
		}

		if (_frameShowing) {
			_hideLoadingScreen();
			_hideFrame();
		}

		if (_modalShowing) {
			_hideModal();
		}

		// Hide active folder
		if (_activeFolder) {
			_activeFolder.div.style.opacity = 0;
		}

		_screenLocked = true;
		_lockoutScreen.sliderArea.slider.button.div.style.left = _lockoutScreen.sliderArea.slider.button.homeX + "%";
		_showLockoutScreen();

		_resetLastInputTime();
	}

	var _unlockScreen = function() {
		// Show active folder
		if (_activeFolder) {
			_activeFolder.div.style.zIndex = "1";
			_activeFolder.div.style.opacity = 1;
		}

		_screenLocked = false;
		_unlockSliderDragging = false;
		_hideLockoutScreen();
	};

	var _showLockoutScreen = function(instantFlag) {
		_lockoutScreen.div.style.opacity = 1;
		_lockoutScreen.div.style.zIndex = 10;
	};

	var _hideLockoutScreen = function(instantFlag) {
		_lockoutScreen.div.style.opacity = 0;
		if (instantFlag) {
			_lockoutScreen.div.style.zIndex = -1;
		} else {
			setTimeout(function() {
				_lockoutScreen.div.style.zIndex = -1;
			}, _settings.lockoutTransitionTime);
		}
	};

	var _loadShortcutUrl = function(params) {
		// Show the loading screen
		_showLoadingScreen();

		// Check if the link it set to open in a new tab
		if (params.external) {
			// Hide the app folder
			_app.appFolder.hide();

			window.location.href = params.url;
		} else {
			// Check if we're running the last app that was open
			if (_lastOpenedAppURL == params.url) {
				// If so, just show the frame
				_showFrame(null);
			} else {
				// Otherwise show the frame and load the new URL
				_showFrame(params.url);
			}
		}
	};

	var _showFrame = function(url, externalFlag) {
		// Hide the app folder
		_app.appFolder.hide();

		// Show the folder map
		_app.folderMapArea.show();

		// Resize the frame (in case we changed the window size, to hide toolbars)
		var rect = _frameWrapper.div.getBoundingClientRect();
		_frameWrapper.frame.div.style.width = rect.width + 17 + "px";
		_frameWrapper.frame.div.style.height = rect.height + 17 + "px";

		// Set the frame as showing
		_frameShowing = true;

		// If we have a new URL, load it
		if (url != null && url != undefined) {
			_frameWrapper.frame.div.src = url;

			// Set last opened app URL
			_lastOpenedAppURL = url;	

			// Show the frame with an extra delay (so we don't see the transition between URLs)
			setTimeout(function() {
				_frameWrapper.div.style.opacity = 1;
				setTimeout(function() {
					_frameWrapper.div.style.zIndex = 3;
				}, _settings.frameTransitionTime);
			}, 1000);
		} else {
			// Otherwise just show the frame
			_frameWrapper.div.style.opacity = 1;
			setTimeout(function() {
				_frameWrapper.div.style.zIndex = 3;
			}, _settings.frameTransitionTime);
		}
	};

	var _hideFrame = function(callback) {
		_frameShowing = false;
		_frameWrapper.div.style.opacity = 0;

		setTimeout(function() {
			_frameWrapper.div.style.zIndex = 0;
		}, _settings.frameTransitionTime);
	};

	var _getBackgroundPosition = function() {
		return {
			x: Number(_app.background.div.style.left.substring(0, _app.background.div.style.left.length - 2)),
			y: Number(_app.background.div.style.top.substring(0, _app.background.div.style.top.length - 2)),
		}
	};
	
	var _setBackgroundPosition = function(left, top) {
		if (left != null && left != undefined) {
			_app.background.div.style.left = _app.background.homeX + left + "px";
		}
		if (top != null && top != undefined) {
			_app.background.div.style.top = _app.background.homeY + top + "px";
		}
	};

	/*
		Normalize values into bounds
	    value: the actual value we're looking to adjust
	    lowerBound: the minimum possible result
	    upperBound: the maximum possible result
	    minValue: the minimum possible value we will pass in
	    maxValue: the maximum possible value we will pass in
    */
    var _normalize = function(value, lowerBound, upperBound, minValue, maxValue) {
        // If we aren't given values, normalize between 0 and 100
        minValue = (minValue) ? minValue : 0;
        maxValue = (maxValue) ? maxValue : 100;

        return lowerBound + ((value - minValue) * (upperBound - lowerBound) / (maxValue - minValue));
    };

    // Spread elements in an array over a given range of values
    var _spreadArray = function(originalArray, minValue, maxValue) {
        var newArray = [];
        if (originalArray.length == 1) {
            newArray.push(((maxValue + minValue) / 2));
            return newArray;
        }

        var increment = (maxValue - minValue) / (originalArray.length - 1);
        var value = minValue;
        for (var i in originalArray) {
            newArray.push(value);
            value += increment;
        }
        return newArray;
    };

    // Make an ajax call (only works on same domain)
    var _ajax = function(a, b, c) {
		c = new XMLHttpRequest;
		c.open('GET', a);
		c.onload = b;
		c.send();
	};

	/***************************************
	************* App Objects **************
	***************************************/
	
	// The base app object
	var App = function(parent, rowCount, columnCount, width, height) {
		// Store reference to this object
		var self = this;

		// Store the app
		_app = self;

		// Set parent element
		self.parent = parent;

		// Store the div
		self.div = document.createElement("div");

		// Add the div to the parent (body or parent div)
		if (parent.div) {
			parent.div.appendChild(self.div);
		} else {
			parent.appendChild(self.div);
		}
		
		// Add default class
		self.div.classList.add("App");
		
		// Add app background
		self.background = _addDiv(self, "AppBackground");
		
		// Set starting background position
		var position = _getBackgroundPosition();
		self.background.homeX = position.x;
		self.background.homeY = position.y;
		
		// Add stars to background
		self.background.stars = _addDiv(self.background, "Stars");

		// Only rotate stars on desktop (causes lag when dragging folders on mobile)
		if (!_mobile) {
			self.background.stars.div.classList.add("Stars-Rotating");
		}
		
		// Add twinkle effect
		self.twinkling = _addDiv(self, "Twinkling");

		// Apply row and column count
		if (rowCount != null && rowCount != undefined) {
			self.rowCount = rowCount;
		} else {
			self.rowCount = _settings.defaultRowCount;
		}
		if (columnCount != null && columnCount != undefined) {
			self.columnCount = columnCount;
		} else {
			self.columnCount = _settings.defaultColumnCount;
		}
		
		/***************************************
		************* Status Bar ***************
		***************************************/
		
		// Add the app statusbar
		var statusbar = {};
		
		// Store the div
		statusbar.div = document.createElement("div");
			
		// Add the child div
		self.div.appendChild(statusbar.div);
			
		// Add default class
		statusbar.div.classList.add("Statusbar");
		
		// Set size attributes
		var size = statusbar.div.getBoundingClientRect();
		statusbar.width = size.width;
		statusbar.height = size.height;
		
		// Store the statusbar
		self.statusbar = statusbar;
		
		// Add the date
		self.statusbar.date = _addDiv(self.statusbar, "StatusbarElement StatusbarDate");
		
		// Add text
		self.statusbar.date.text = document.createElement("div");

		// Add the text div
		self.statusbar.date.div.appendChild(self.statusbar.date.text);

		// Set class
		self.statusbar.date.text.classList.add("StatusbarElementText");
		
		// Set text
		self.statusbar.date.text.innerHTML = "date";

		// Update date
		self.updateDate = function() {

			var date = new Date();

			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

			var days = date.getDate();
			var month = months[date.getMonth()];
			var year = date.getFullYear();
			
			var dateText = month + " " + days + ", " + year;
			
			_printDebugText("Updating date... " + dateText);

			self.statusbar.date.text.innerHTML = month + " " + days + ", " + year;
		};

		self.updateDate();

		setInterval(self.updateDate, _settings.dateUpdateDelay);
		
		// Add the time
		self.statusbar.time = _addDiv(self.statusbar, "StatusbarElement StatusbarTime");
		
		// Add time text
		self.statusbar.time.text = document.createElement("div");

		// Add the text div
		self.statusbar.time.div.appendChild(self.statusbar.time.text);

		// Set class
		self.statusbar.time.text.classList.add("StatusbarElementText");
		
		// Update time
		self.updateTime = function() {
			var date = new Date();
			var hours = date.getHours();
			var minutes = date.getMinutes();

			var suffix = "AM";
			if (hours > 12) {
				hours -= 12;
				suffix = "PM";
			} else if (hours == 0) {
				hours = 12;
			}

			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			
			var time = hours + ":" + minutes + " " + suffix;
			
			_printDebugText("Updating time... " + time);

			self.statusbar.time.text.innerHTML = time;
		};

		self.updateTime();

		setInterval(self.updateTime, _settings.timeUpdateDelay);

		// Add the latency
		self.statusbar.latency = _addDiv(self.statusbar, "StatusbarElement StatusbarLatency");

		//self.statusbar.latency.icon = _addDiv(self.statusbar.latency, "StatusbarLatencyIcon glyphicon glyphicon-signal");

		self.statusbar.latency.image = {};

		// Store the div
		self.statusbar.latency.image.div = document.createElement("IMG");
			
		// Add the child div
		self.statusbar.latency.div.appendChild(statusbar.latency.image.div);

		// Set the default image
		self.statusbar.latency.image.div.setAttribute("src", _settings.latencyRatings[_settings.latencyRatings.length - 1].image);
			
		// Add default class
		self.statusbar.latency.image.div.classList.add("StatusbarLatencyImage");

		// Get host name
		var protocol = window.location.protocol;
		var domain = window.location.hostname;
		
		// Update latency
		self.updateLatency = function() {
			// Get start time
			var start = window.performance.now();

			// Ping the domain
			_ajax(protocol + "//" + domain, function(){
				var latency = window.performance.now() - start;
				
				_printDebugText("Updating latency... " + latency);

				// Check how the delay rats
				var rating = _settings.latencyRatings[_settings.latencyRatings.length - 1];
				for (var i in _settings.latencyRatings) {
					if (latency < _settings.latencyRatings[i].value) {
						rating = _settings.latencyRatings[i];
					}
				}
				self.statusbar.latency.image.div.setAttribute("src", rating.image);
			});
		};

		// Check if we have a valid domain (not running on a local machine)
		if (protocol != null && protocol != undefined && protocol != "" && domain != null && domain != undefined && domain != "") {
			self.updateLatency();

			setInterval(self.updateLatency, _settings.latencyUpdateDelay);
		}
		
		/***************************************
		*************** Navbar *****************
		***************************************/
		
		// Add the app navbar
		var navbar = {};

		// Store the div
		navbar.div = document.createElement("div");
			
		// Add the child div
		self.div.appendChild(navbar.div);
			
		// Add default class
		navbar.div.classList.add("Navbar");

		// Control navbar showing and hiding
		navbar.showing = true;

		navbar.show = function() {
			navbar.div.style.opacity = 1;
			navbar.showing = true;
		};

		navbar.hide = function() {
			navbar.div.style.opacity = 0;
			navbar.showing = false;
		};

		// Set flag for input down
		navbar.tapped = false;
		
		// Set size attributes
		var size = navbar.div.getBoundingClientRect();
		navbar.width = size.width;
		navbar.height = size.height;

		if (_mobile) {
			// Check if the input was tapped over navbar
			navbar.div.addEventListener("touchstart", _onNavbarTap);

			// Check if input is released over navbar
			navbar.div.addEventListener("touchend", _onNavbarUntap);
		} else {
			// Check if the input was tapped over navbar
			navbar.div.addEventListener("mousedown", _onNavbarTap);

			// Check if input is released over navbar
			navbar.div.addEventListener("mouseup", _onNavbarUntap);
		}

		// Store the navbar
		self.navbar = navbar;

		// Add the back button
		self.navbar.backButton = _addDiv(self.navbar, "NavbarButton",
			function(div) {
				//_goBack();
				_goUp();
				_startButtonPressAnimation(div);
			},
			null,
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbar.backButton.icon = _addDiv(self.navbar.backButton, "NavbarButtonIcon glyphicon glyphicon-chevron-left");

		// Add the home button
		self.navbar.homeButton = _addDiv(self.navbar, "NavbarButton",
			function(div) {
				_goHome();
				_startButtonPressAnimation(div);
			},
			null,
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbar.homeButton.icon = _addDiv(self.navbar.homeButton, "NavbarButtonIcon glyphicon glyphicon-home");

		// Add the app button
		self.navbar.appButton = _addDiv(self.navbar, "NavbarButton",
			function(div) {
				_showAppFolder();
				_startButtonPressAnimation(div);
			},
			null,
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbar.appButton.icon = _addDiv(self.navbar.appButton, "NavbarButtonIcon glyphicon glyphicon-th");
		
		// Add navbar menu
		var navbarMenu = {};

		// Store the div
		navbarMenu.div = document.createElement("div");
		
		// Add the child div
		self.div.appendChild(navbarMenu.div);

		// Add default class
		navbarMenu.div.className = "NavbarMenu";

		// Set the menu as not showing
		navbarMenu.showing = false;
		
		navbarMenu.show = function() {
			_app.navbarMenu.div.style.left = "50%";
			_app.navbarMenu.showing = true;
			_activeFolder.inputEnabled = false; // Disable folder input (make tapping the folder only close the navbar)
		};

		navbarMenu.hide = function() {
			_app.navbarMenu.div.style.left = "100%";
			_app.navbarMenu.showing = false;
			_activeFolder.inputEnabled = true; // Enable folder input (user can once again send folder input)
		};

		// Store the submenu
		self.navbarMenu = navbarMenu;

		// Add the add subfolder button
		self.navbarMenu.addSubfolderButton = _addDiv(self.navbarMenu, "NavbarMenuButton",
			function(div) {
				_onNavbarTap();
			},
			function(div) {
				_onNavbarUntap(div);
				_app.navbarMenu.hide();
				//_addShortcut();
				_addSubfolder();
				_startButtonPressAnimation(div);
			},
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbarMenu.addSubfolderButton.icon = _addDiv(self.navbarMenu.addSubfolderButton, "NavbarMenuButtonIcon glyphicon glyphicon-folder-open");

		// Add the button text
		self.navbarMenu.addSubfolderButton.text = _addDiv(self.navbarMenu.addSubfolderButton, "NavbarMenuButtonText");
		self.navbarMenu.addSubfolderButton.text.div.innerHTML = "Add subfolder";

		// Add the add folder button
		self.navbarMenu.addFolderButton = _addDiv(self.navbarMenu, "NavbarMenuButton",
			function(div) {
				_onNavbarTap();
			},
			function(div) {
				_onNavbarUntap(div);
				_app.navbarMenu.hide();
				_addFolder();
				_startButtonPressAnimation(div);
			},
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbarMenu.addFolderButton.icon = _addDiv(self.navbarMenu.addFolderButton, "NavbarMenuButtonIcon glyphicon glyphicon-log-in");

		// Add the button text
		self.navbarMenu.addFolderButton.text = _addDiv(self.navbarMenu.addFolderButton, "NavbarMenuButtonText");
		self.navbarMenu.addFolderButton.text.div.innerHTML = "Add folder";
		
		// Add the remove folder button
		self.navbarMenu.removeFolderButton = _addDiv(self.navbarMenu, "NavbarMenuButton",
			function(div) {
				_onNavbarTap();
			},
			function(div) {
				_onNavbarUntap(div);
				_app.navbarMenu.hide();
				_removeFolder();
				_startButtonPressAnimation(div);
			},
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbarMenu.removeFolderButton.icon = _addDiv(self.navbarMenu.removeFolderButton, "NavbarMenuButtonIcon glyphicon glyphicon-remove");

		// Add the button text
		self.navbarMenu.removeFolderButton.text = _addDiv(self.navbarMenu.removeFolderButton, "NavbarMenuButtonText");
		self.navbarMenu.removeFolderButton.text.div.innerHTML = "Remove folder";

		// Add the save button
		self.navbarMenu.resetButton = _addDiv(self.navbarMenu, "NavbarMenuButton",
			function(div) {
				_onNavbarTap();
			},
			function(div) {
				_onNavbarUntap(div);
				_app.navbarMenu.hide();
				_reset(true);
				_startButtonPressAnimation(div);
			},
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbarMenu.resetButton.icon = _addDiv(self.navbarMenu.resetButton, "NavbarMenuButtonIcon glyphicon glyphicon-repeat");

		// Add the button text
		self.navbarMenu.resetButton.text = _addDiv(self.navbarMenu.resetButton, "NavbarMenuButtonText");
		self.navbarMenu.resetButton.text.div.innerHTML = "Reset";

		// Add the info button
		self.navbarMenu.infoButton = _addDiv(self.navbarMenu, "NavbarMenuButton",
			function(div) {
				_onNavbarTap();
			},
			function(div) {
				_onNavbarUntap(div);
				_app.navbarMenu.hide();
				_showInfo();
				_startButtonPressAnimation(div);
			},
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbarMenu.infoButton.icon = _addDiv(self.navbarMenu.infoButton, "NavbarMenuButtonIcon glyphicon glyphicon-info-sign");

		// Add the button text
		self.navbarMenu.infoButton.text = _addDiv(self.navbarMenu.infoButton, "NavbarMenuButtonText");
		self.navbarMenu.infoButton.text.div.innerHTML = "About";

		// Add the menu button
		self.navbar.menuButton = _addDiv(self.navbar, "NavbarButton",
			function(div) {
				_navbarMenuButtonTapped();
				_startButtonPressAnimation(div);
			},
			null,
			function(div) {
				_onButtonHover(div);
			},
			function(div) {
				_onButtonUnhover(div);
			}
		);
		
		// Add the button icon
		self.navbar.menuButton.icon = _addDiv(self.navbar.menuButton, "NavbarButtonIcon glyphicon glyphicon-menu-hamburger");
		
		// Add shortcut edit area
		var shortcutEditArea = {};

		// Store the div
		shortcutEditArea.div = document.createElement("div");
		
		// Add the child div
		self.div.appendChild(shortcutEditArea.div)

		// Add default class
		shortcutEditArea.div.className = "NavbarShortcutEditArea";

		// Set the folder as not showing
		shortcutEditArea.showing = false;
		
		shortcutEditArea.show = function(editEnabled) {
			if (!editEnabled) {
				_app.shortcutEditArea.trashButton.div.style.width = "100%";
				_app.shortcutEditArea.editButton.div.style.width = "0%";
			} else {
				_app.shortcutEditArea.trashButton.div.style.width = "50%";
				_app.shortcutEditArea.editButton.div.style.width = "50%";
			}
			_app.shortcutEditArea.div.style.top = "90%";
			_app.shortcutEditArea.showing = true;

			// Update the app size based on new positions and sizes
			setTimeout(_updateAppSize, _settings.editAreaTransitionTime);
		};

		shortcutEditArea.hide = function() {
			_app.shortcutEditArea.div.style.top = "100%";
			_app.shortcutEditArea.showing = false;
		};
		
		// Store the submenu
		self.shortcutEditArea = shortcutEditArea;

		// Add the trash button
		self.shortcutEditArea.trashButton = _addDiv(self.shortcutEditArea, "NavbarShortcutEditButton", null, function() {
			if (_heldShortcut.held) {
				_removeShortcut(_heldShortcut);
			}
		});
		
		// Add the button icon
		self.shortcutEditArea.trashButton.icon = _addDiv(self.shortcutEditArea.trashButton, "NavbarButtonIcon glyphicon glyphicon-trash");
		
		// Add the edit button
		self.shortcutEditArea.editButton = _addDiv(self.shortcutEditArea, "NavbarShortcutEditButton", null, function() {
			if (_heldShortcut.held) {
				_editShortcut(_heldShortcut);
			}
		});
		
		// Add the button icon
		self.shortcutEditArea.editButton.icon = _addDiv(self.shortcutEditArea.editButton, "NavbarButtonIcon glyphicon glyphicon-pencil");
				
		// Add the modal background
		self.modalBackground = _addDiv(self, "ModalBackground", null, _hideModal);
		_modalBackground = self.modalBackground;

		/***************************************
		************* Folder Map ***************
		***************************************/
		
		self.folderMapArea = _addDiv(self, "FolderMapArea");
		
		self.folderMapArea.folderMaps = [];
		
		var folderMapWidth = self.folderMapArea.div.getBoundingClientRect().width;

		self.folderMapArea.show = function() {
			self.folderMapArea.div.style.opacity = "1";
		};

		self.folderMapArea.hide = function() {
			self.folderMapArea.div.style.opacity = "0";
		};
		
		self.folderMapArea.addFolderMap = function(folder) {
			var folderMap = _addDiv(self.folderMapArea, "FolderMap");

			folderMap.folders = [];
			
			folderMap.addFolder = function(index, homeFlag, hideFlag, appFlag) {
				var folder = _addDiv(folderMap, "FolderMapFolder");

				// If it's the home folder, set the home icon
				if (homeFlag) {
					folder.icon = _addDiv(folder, "FolderMapFolderIcon glyphicon glyphicon-home");
				} else if (appFlag) {
					folder.icon = _addDiv(folder, "FolderMapFolderIcon glyphicon glyphicon-th");
				} else {
					folder.icon = _addDiv(folder, "FolderMapFolderIcon glyphicon glyphicon-unchecked");
				}

				// If we have an index, insert the folder in that position
				if (index != null && index != undefined) {
					folderMap.folders.splice(index, 0, folder);
					
				} else {
					// Otherwise just add it to the end
					folderMap.folders.push(folder);
				}

				if (hideFlag) {
					folderMap.div.style.top = "100%";
				} else {
					folderMap.div.style.top = "0%";
				}

				// Select the new folder
				folderMap.selectByIndex(folderMap.folders.indexOf(folder));

				// Move the icons to their new positions
				var space = 1 / _settings.maxSiblingFolders * 100;
				var width = space * (folderMap.folders.length - 1);
				var minX = 50 - width / 2;
				var maxX = 50 + width / 2;
				var lefts = [];
				for (var i in folderMap.folders) {
					lefts.push(null);
				}
				var newLefts = _spreadArray(lefts, minX, maxX);
				for (var i in folderMap.folders) {
					folderMap.folders[i].div.style.left = newLefts[i] + "%"
				}
			};

			folderMap.moveUp = function(hideFlag, instantFlag) {
				var top = Number(folderMap.div.style.top.substring(0, folderMap.div.style.top.length - 1));

				// If we're moving the element instantly
				if (instantFlag) {
					// Disable transitions
					folderMap.div.classList.add("NoTransition");

					// Move the folder
					folderMap.div.style.top = top - 100 + "%";

					// Flush CSS changes
					folderMap.div.offsetHeight;

					// Enable transitions
					folderMap.div.classList.remove("NoTransition");
				} else {
					// Move the folder
					folderMap.div.style.top = top - 100 + "%";
				}
				
				if (hideFlag) {
					folderMap.div.style.opacity = 0;
				} else {
					folderMap.div.style.opacity = 1;
				}
			};
			
			folderMap.moveDown = function(hideFlag, instantFlag) {
				var top = Number(folderMap.div.style.top.substring(0, folderMap.div.style.top.length - 1));

				// If we're moving the element instantly
				if (instantFlag) {
					// Disable transitions
					folderMap.div.classList.add("NoTransition");

					// Move the folder
					folderMap.div.style.top = top + 100 + "%";

					// Flush CSS changes
					folderMap.div.offsetHeight;

					// Enable transitions
					folderMap.div.classList.remove("NoTransition");
				} else {
					// Move the folder
					folderMap.div.style.top = top + 100 + "%";
				}

				if (hideFlag) {
					folderMap.div.style.opacity = 0;
				} else {
					folderMap.div.style.opacity = 1;
				}
			};

			folderMap.selectByIndex = function(index) {
				for (var i in folderMap.folders) {
					if (index == i) {
						folderMap.folders[i].div.classList.add("FolderMapFolderSelected")
					} else {
						folderMap.folders[i].div.classList.remove("FolderMapFolderSelected")
					}
				}
			};

			folderMap.show = function() {
				folderMap.div.style.opacity = 1;
			};

			folderMap.hide = function() {
				folderMap.div.style.opacity = 0;
			};

			folderMap.remove = function() {
				// Hide the folder  mapand remove it from the DOM
				folderMap.div.style.display = "none";
				self.folderMapArea.div.removeChild(folderMap.div);
			};

			folderMap.removeFolderByIndex = function(index) {
				// Get the folder size before we remove it
				var rect = folderMap.folders[index].div.getBoundingClientRect();
				var space = rect.width;

				// Hide the folder and remove it from the DOM
				folderMap.folders[index].div.style.display = "none";
				folderMap.div.removeChild(folderMap.folders[index].div);

				// Remove the folder from the array
				folderMap.folders.splice(index, 1);

				// Move the icons to their new positions
				var space = 1 / _settings.maxSiblingFolders * 100;
				var width = space * (folderMap.folders.length - 1);
				var minX = 50 - width / 2;
				var maxX = 50 + width / 2;
				var lefts = [];
				for (var i in folderMap.folders) {
					lefts.push(null);
				}
				var newLefts = _spreadArray(lefts, minX, maxX);
				for (var i in folderMap.folders) {
					folderMap.folders[i].div.style.left = newLefts[i] + "%"
				}
			};
			
			self.folderMapArea.folderMaps.push(folderMap);

			return folderMap;
		};

		/***************************************
		********* Background Scrolling *********
		***************************************/

		// Set the background size (for scrolling based on app size)
		//var horizontalSize = 100 + 100 * _settings.backgroundHorizontalScroll * (_settings.maxSiblingFolders - 1);
		//var verticalSize = 100 + 100 * _settings.backgroundVerticalScroll * (_settings.maxSubfolders - 1);
		//_app.background.div.style.backgroundSize = horizontalSize + "%" + " " + verticalSize + "%";
		
		// Set background position (so we can get it and change it later)
		//_app.background.div.style.backgroundPosition = "0px 0px";

		/***************************************
		*************** Config *****************
		***************************************/

		// Add no-touch class to app to fix sticky hover issue on mobile
		if (("ontouchstart" in document.documentElement)) {
			//document.documentElement.className += " no-touch";
			_app.div.classList.add("NoTouch");
		}

		// Listen for key presses
		document.body.addEventListener("keyup", _handleKeypress);

		// Add controls based on device type (desktop or mobile)
		if (_mobile) {
			// Check if input has left the app
			document.body.addEventListener("touchmove", _inputMove);

			// Check if input has been pressed
			self.div.addEventListener("touchstart", _inputDown);

			// Can't go fullscreen using touchstart event, so use mousedown event
			self.div.addEventListener("mousedown", function() {
				_goFullscreen(_app.div);
			});

			// Check if input has been released
			self.div.addEventListener("touchend", _inputUp);

			// Check if input has left the browser
			document.body.addEventListener("touchleave", _inputOut);

		} else {
			// Check if input has left the app
			document.body.addEventListener("mousemove", _inputMove);
			
			// Check if input has been pressed
			//self.div.addEventListener("mousedown", _inputDown);
			document.body.addEventListener("mousedown", _inputDown);
			
			// Check if input has been released
			//self.div.addEventListener("mouseup", _inputUp);
			document.body.addEventListener("mouseup", _inputUp);
			
			// Check if input has left the browser
			document.body.addEventListener("mouseout", _inputOut);

			// Set aspect ratio
			_updateAspectRatio();

			// Maintain aspect ratio on desktop
			window.addEventListener("resize", _updateAspectRatio);
		}

		// Update app element sizes
		_updateAppSize();

		window.addEventListener("resize", _updateAppSize);


		// Create the iframe wrapper
		_frameWrapper = {};
		_frameWrapper.div = document.createElement("div");
		self.div.appendChild(_frameWrapper.div);
		_frameWrapper.div.classList.add("FrameWrapper");

		_frameWrapper.frame = {};
		_frameWrapper.frame.div = document.createElement("iframe");
		_frameWrapper.div.appendChild(_frameWrapper.frame.div);
		_frameWrapper.frame.div.classList.add("Frame");
		
		// Hide frame scrollbars
		var rect = _frameWrapper.frame.div.getBoundingClientRect();
		_frameWrapper.frame.div.style.width = rect.width + 17 + "px";
		_frameWrapper.frame.div.style.height = rect.height + 17 + "px";
		
		/*
		// Changing orientation of a mobile device will cause the iframe to become distorted (the size won't adjust properly)
		window.addEventListener("orientationchange", function() {
			// Hide the frame (fixing the frame size seems troublesome)
			if (_frameShowing) {
				_hideLoadingScreen();
				_hideFrame();
			}
		}, false);
		*/

		// Create the modals
		_createModals();
		
		// Create the loading screen
		_createLoadingScreen();

		// Create the lockout screen
		_createLockoutScreen();

		// Create the app folder
		self.appFolder = new Folder(null, null, true, false, true);

		// Hide the app folder (so it doesn't flash while loading)
		self.appFolder.div.style.opacity = 0;

		// Set active app folder
		_activeAppFolder = self.appFolder;

		// Hide the folder map
		self.appFolder.folderMap.hide();

		// Override show function
		self.appFolder.show = function() {
			_activeAppFolder.div.style.opacity = 1;
			_appFolderShowing = true;

			// Hide the active folder map
			_activeFolder.folderMap.hide();

			// Set the current folder
			_currentFolder = _activeFolder;
			_activeFolder = _activeAppFolder;

			// Show the app folder map
			self.appFolder.folderMap.show();

			setTimeout(function() {
				_activeAppFolder.div.style.zIndex = 3;
			}, _settings.moveDuration * 2);
		};
		
		// Override hide function
		self.appFolder.hide = function() {
			_movingElementCount++;
			_activeAppFolder.div.style.opacity = 0;

			// Hide the folder map
			self.appFolder.folderMap.hide();

			_appFolderShowing = false;
			setTimeout(function() {
				_movingElementCount--;
				_activeAppFolder.div.style.zIndex = 0;
			}, _settings.moveDuration * 2);

			// Check if we have a current folder (if we went into the app folder or if we're adding shortcuts from another source)
			if (_currentFolder != null && _currentFolder != undefined) {
				_activeFolder = _currentFolder;
			}
			_activeFolder.div.style.opacity = "1";

			// Show the active folder map
			_activeFolder.folderMap.show();
		};

		_appFolderShowing = false;

		// Add the apps
		for (var i in _apps) {
			// Check if the app opens a URL
			var shortcut = self.appFolder.addShortcut(i);

			// Copy the shortcut to the active folder
			shortcut.holdCallback = function() {
				// Hide the app folder
				_app.appFolder.hide();

				// Show the folder map
				_app.folderMapArea.show();

				// Remove held class
				this.div.classList.remove("ShortcutHold");

				// Create a copy of the shortcut
				var shortcutCopy = _activeFolder.addShortcut(this.key);

				// If the shortcut wasn't created, then don't do anything else
				if (!shortcutCopy) {
					return;
				}

				// Set this shortcut as the one being held and tapped
				_tappedShortcut = shortcutCopy;
				_heldShortcut = shortcutCopy;

				// Set starting drag position
				//var folderRect = self.appFolder.div.getBoundingClientRect();
				var folderRect = this.parentFolder.div.getBoundingClientRect();
				shortcutCopy.dragInputX = _inputX - this.homeX * folderRect.width / 100 + shortcutCopy.homeX * folderRect.width / 100;
				shortcutCopy.dragInputY = _inputY - this.homeY * folderRect.height / 100 + shortcutCopy.homeY * folderRect.height / 100;

				// Set shortcut position to current input position
				shortcutCopy.setPosition((_inputX - shortcutCopy.dragInputX) / folderRect.width * 100, (_inputY - shortcutCopy.dragInputY) / folderRect.height * 100);

				// Indicate that the shortcut is being held and tapped
				shortcutCopy.tapped = true;
				shortcutCopy.held = true;
				
				// Add held class
				shortcutCopy.div.classList.add("ShortcutHold");

				// Show shortcut edit area
				if (_activeFolder != _app.appFolder) {
					_app.shortcutEditArea.show(shortcutCopy.type == "folder");

					// Hide the navbar
					_app.navbar.hide();
				}
			};
		}

		// Select the home app folder
		self.appFolder.selectByIndex(0, true);

		// Hide the active app folder
		_activeAppFolder.div.style.opacity = 0;
		_activeAppFolder.div.style.zIndex = 0;

		// Add the default folder
		self.homeFolder = new Folder();

		// Set it as the active folder
		_activeFolder = self.homeFolder;

		var load = function() {
			_loadStorage();

			loadFolders(_storageData.folders, _app.homeFolder);

			_goHome(true);
		};

		var loadFolders = function(folders, firstFolder) {
			// Set the current folder to the first folder
			var currentFolder = firstFolder;

			// Add each folder in the array
			for (var i in folders) {
				// Don't create the home folder
				if (i == 0) {
					// Add the shortcuts
					loadShortcuts(folders[i], firstFolder);
				} else {
					// Get the current folder
					var currentFolder = firstFolder.getByIndex(i - 1);

					// Add the folder
					currentFolder = _addFolder(true);

					// Delay to allow animation
					loadShortcuts(folders[i], currentFolder);
				}
			}
		};

		var loadShortcuts = function(folderData, folderObject) {
			// Add the shortcuts
			for (var i in folderData.shortcuts) {
				var shortcut = folderObject.addShortcut(folderData.shortcuts[i].key, folderData.shortcuts[i].text, folderData.shortcuts[i].row, folderData.shortcuts[i].column);

				// If we have a subfolder, add its sibling folders and shortcuts
				if (shortcut.key == null || shortcut.key == undefined) {
					// Select the subfolder
					shortcut.selectSubfolder(true);	

					// Add sibling folders
					loadFolders(folderData.shortcuts[i].folders, shortcut.subfolder);

					_activeFolder.selectByIndex(0, true);

					_activeFolder.selectParentFolder(true);
				}
			}
		};

		self.reset = function() {
			_storageData = {
				folders: [
					{
						shortcuts: [
							{
								key: "help",
								text: "Help",
								row: 0,
								column: 0
							}
						]
					}
				]
			};
		
			// Remove everything but the first (home) folder
			var removeFolders = function(firstFolder) {
				var folder = _app.homeFolder;

				// Remove shortcuts from the home folder
				for (var i in folder.shortcuts) {
	        		for (var j in folder.shortcuts[i]) {
	        			if (folder.shortcuts[i][j] != null && folder.shortcuts[i][j] != undefined) {
	        				folder.shortcuts[i][j].remove();
	        			}
	        		}
	        	}

				folder = folder.nextFolder;
	        	while (folder != null && folder != undefined) {
	        		_removeFolder(folder, true, true);
	        		folder = folder.nextFolder;
	        	}
			};

			// Hide the home folder (so we don't see any transition)
			_app.homeFolder.div.style.opacity = 0;

			// Show the home folder instantly
			_goHome(true);

			// Lock the screen
			_lockScreen();

			// Save the new (default) storage data
			_saveStorage(_storageData);

			setTimeout(function() {
				// All shortcuts and folders, except the home folder
				removeFolders(_app.homeFolder);

				// Load the folders based on the storage data (default folders)
				loadFolders(_storageData.folders, _app.homeFolder);
			}, _settings.lockoutTransitionTime);
		};

		// Lock the screen
		_lockScreen();

		// Reset the app
		load();

		// Start checking if the screen needs to be locked
		setInterval(_checkScreenLockoutTime, 1000);

		/***********************************
		***** Define Public Functions ******
		************************************/
		// Lock the screen
		var lock = function() {
			_lockScreen();

			_resetLastInputTime();
		};

		// Unlock the screen
		var unlock = function() {
			_unlockScreen();

			_resetLastInputTime();
		};

		// Add a subfolder
		var addSubfolder = function(folderName) {
			_createSubfolder({folderName: folderName});

			_resetLastInputTime();
		};

		// Add a sibling folder
		var addFolder = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			_addFolder();

			_resetLastInputTime();
		};

		var selectNextFolder = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}
			
			_activeFolder.selectNextFolder();

			_resetLastInputTime();
		};

		var selectPreviousFolder = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			_activeFolder.selectPreviousFolder();

			_resetLastInputTime();
		};

		// Delete the active folder
		var removeFolder = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			_removeFolder(null, null, null, true);

			_resetLastInputTime();
		};

		var runApp = function(key) {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			// Check if we have a valid app key
			if (key == null || key == undefined) {
				_printDebugText("ERROR: No app key provided!");
				return false;
			} else if (_apps[key] == null || _apps[key] == undefined) {
				_printDebugText("ERROR: Invalid app key!");
				return false;
			}

			// Check shortcut type
			if (_apps[key].type == "url") {
				_loadShortcutUrl(_apps[key].params);
			} else if (_apps[key].type == "script") {
				_apps[key].params.script(_apps[key].params.scriptParams);
			}

			_resetLastInputTime();
		};

		// Return the list of app keys
		var getAppKeys = function() {
			var keys = [];
			for (var i in _apps) {
				keys.push(i);
			}
			return keys;
		};

		// Add a shortcut
		var addShortcut = function(key, text, row, column) {
			// If we don't have an app key, don't create the shortcut
			if (key == null || key == undefined) {
				_printDebugText("ERROR: No app key provided!");
				return false;
			} else if (_apps[key] == null || _apps[key] == undefined) {
				_printDebugText("ERROR: Invalid app key!");
				return false;
			}

			// If we don't have a row or column, then set them both to null
			if (row == null || row == undefined || column == null || column == undefined) {
				row = undefined;
				column = undefined;
			}

			// Check if row and column are given
			if (row != null && row != undefined && column != null && column != undefined) {
				// Check if row or column is outside app limits
				if (row < 0 || row > _app.rowCount || column < 0 || column > _app.columnCount) {
					_printDebugText("ERROR: Shortcut position is outside app bounds!");
					return false;
				} 

				// Check if position is taken
				var shortcut;
				if (_appFolderShowing) {
					shortcut = _currentFolder.shortcuts[row][column];
				} else {
					shortcut = _activeFolder.shortcuts[row][column];
				}
				if (shortcut != null && shortcut != undefined) {
					_printDebugText("ERROR: Shortcut already exists in given position!");
					return; false
				}
			}

			// Check if app folder is showing
			if (_appFolderShowing) {
				// If it is, hide it and add the shortcut to the current folder
				_app.appFolder.hide();
				_currentFolder.addShortcut(key, text, row, column);
			} else {
				// Otherwise add it to the active folder
				_activeFolder.addShortcut(key, text, row, column);
			}

			_resetLastInputTime();
		};

		var moveShortcut = function(startingRow, startingColumn, endingRow, endingColumn) {
			// Check if we were given all input values
			if (startingRow == null || startingRow == undefined || startingColumn == null || startingColumn == undefined || endingRow == null || endingRow == undefined || endingColumn == null || endingColumn == undefined) {
				_printDebugText("ERROR: Starting and ending position required!");
				return false;
			}

			// Check if any of the positions are outside of the app limits
			if (startingRow < 0 || startingRow > _app.rowCount || startingColumn < 0 || startingColumn > _app.columnCount || endingRow < 0 || endingRow > _app.rowCount || endingColumn < 0 || endingColumn > _app.columnCount) {
				_printDebugText("ERROR: Shortcut position is outside app bounds!");
				return false;
			}

			// Check if there's a shortcut in the starting position
			var startingShortcut;
			if (_appFolderShowing) {
				startingShortcut = _currentFolder.shortcuts[startingRow][startingColumn];
			} else {
				startingShortcut = _activeFolder.shortcuts[startingRow][startingColumn];
			}
			if (startingShortcut == null && startingShortcut == undefined) {
				_printDebugText("ERROR: No shortcut exists in starting position!");
				return false;
			}

			// Check if there's a shortcut in the ending position
			var endingShortcut;
			if (_appFolderShowing) {
				endingShortcut = _currentFolder.shortcuts[endingRow][endingColumn];
			} else {
				endingShortcut = _activeFolder.shortcuts[endingRow][endingColumn];
			}
			if (endingShortcut != null && endingShortcut != undefined) {
				_printDebugText("ERROR: Shortcut already exists in ending position!");
				return false;
			}

			startingShortcut.moveByRowAndColumn(endingRow, endingColumn);

			_resetLastInputTime();
		};

		var activateShortcut = function(row, column) {
			// Check if row and column are given
			if (row == null || row == undefined || column == null || column == undefined) {
				_printDebugText("ERROR: Invalid shortcut position!");
				return false;
			}

			if (row != null && row != undefined && column != null && column != undefined) {
				// Check if row or column is outside app limits
				if (row < 0 || row > _app.rowCount || column < 0 || column > _app.columnCount) {
					_printDebugText("ERROR: Shortcut position is outside app bounds!");
					return false;
				}

				// Check if row or column is outside app limits
				var shortcut;
				if (_appFolderShowing) {
					shortcut = _currentFolder.shortcuts[row][column];
				} else {
					shortcut = _activeFolder.shortcuts[row][column];
				}
				if (shortcut == null || shortcut == undefined) {
					_printDebugText("ERROR: No shortcut in given position!");
					return; false
				}
				
				// Active the shortcut
				shortcut.tapCallback()

				_resetLastInputTime();
			}
		};

		// Remove a shortcut
		var removeShortcut = function(row, column) {
			// Check if row and column are given
			if (row == null || row == undefined || column == null || column == undefined) {
				_printDebugText("ERROR: Invalid shortcut position!");
				return false;
			}

			if (row != null && row != undefined && column != null && column != undefined) {
				// Check if row or column is outside app limits
				if (row < 0 || row > _app.rowCount || column < 0 || column > _app.columnCount) {
					_printDebugText("ERROR: Shortcut position is outside app bounds!");
					return false;
				}

				// Check if row or column is outside app limits
				var shortcut;
				if (_appFolderShowing) {
					shortcut = _currentFolder.shortcuts[row][column];
				} else {
					shortcut = _activeFolder.shortcuts[row][column];
				}
				if (shortcut == null || shortcut == undefined) {
					_printDebugText("ERROR: No shortcut in given position!");
					return; false
				}

				// Remove the shortcut
				shortcut.remove();

				_resetLastInputTime();
			}
		};

		var goBack = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			_goUp();

			_resetLastInputTime();
		};

		var goHome = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			_goHome();

			_resetLastInputTime();
		};

		var showAppFolder = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			// Hide the active folder (so background is visible)
			_activeFolder.div.style.opacity = "0";

			// Hide the navbar menu
			_app.navbarMenu.hide();
			
			// Hide the loading screen
			_hideLoadingScreen();

			// Hide the frame
			_hideFrame();

			_app.appFolder.show();

			_resetLastInputTime();
		};

		var hideAppFolder = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			// Hide the active folder (so background is visible)
			_activeFolder.div.style.opacity = "0";

			// Hide the navbar menu
			_app.navbarMenu.hide();
			
			// Hide the loading screen
			_hideLoadingScreen();

			// Hide the frame
			_hideFrame();

			_app.appFolder.hide();

			_resetLastInputTime();
		};

		var toggleAppFolder = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			_showAppFolder();

			_resetLastInputTime();
		};

		var showMenu = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			if (_appFolderShowing) {
				// Show the folder map
				_app.folderMapArea.show();

				// Hide the app folder
				_app.appFolder.hide();
			}
			
			// If we're showing a frame, exit the frame
			if (_frameShowing) {
				_hideLoadingScreen();
				_hideFrame(setTimeout(function() {
					_app.navbarMenu.show();
				}), _settings.frameTransitionTime);
			} else {
				_app.navbarMenu.show();
			}

			_resetLastInputTime();
		};

		var hideMenu = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			if (_appFolderShowing) {
				// Show the folder map
				_app.folderMapArea.show();

				// Hide the app folder
				_app.appFolder.hide();
			}
			
			// If we're showing a frame, exit the frame
			if (_frameShowing) {
				_hideLoadingScreen();
				_hideFrame(setTimeout(function() {
					_app.navbarMenu.hide();
				}), _settings.frameTransitionTime);
			} else {
				_app.navbarMenu.hide();
			}

			_resetLastInputTime();
		};

		var toggleMenu = function() {
			// Check if screen is locked
			if (_screenLocked) {
				_printDebugText("ERROR: Screen is locked!");
				return false;
			}

			if (_appFolderShowing) {
				// Show the folder map
				_app.folderMapArea.show();

				// Hide the app folder
				_app.appFolder.hide();
			}
			
			// If we're showing a frame, exit the frame
			if (_frameShowing) {
				_hideLoadingScreen();
				_hideFrame(setTimeout(function() {
					if (_app.navbarMenu.showing == false) {
						_app.navbarMenu.show();
					} else {
						_app.navbarMenu.hide();
					}
				}), _settings.frameTransitionTime);
			} else {
				if (_app.navbarMenu.showing == false) {
					_app.navbarMenu.show();
				} else {
					_app.navbarMenu.hide();
				}
			}

			_resetLastInputTime();
		};

		var reset = function() {
			self.reset();

			_resetLastInputTime();
		};

		var showInfo = function() {
			_showInfo();

			_resetLastInputTime();
		};
		
		// Expose public functions
		return {
			lock: lock,
			unlock: unlock,
			addFolder: addFolder,
			addSubfolder: addSubfolder,
			selectNextFolder: selectNextFolder,
			selectPreviousFolder: selectPreviousFolder,
			removeFolder: removeFolder,
			runApp: runApp,
			getAppKeys: getAppKeys,
			addShortcut: addShortcut,
			moveShortcut: moveShortcut,
			activateShortcut: activateShortcut,
			removeShortcut: removeShortcut,
			showAppFolder: showAppFolder,
			hideAppFolder: hideAppFolder,
			toggleAppFolder: toggleAppFolder,
			showMenu: showMenu,
			hideMenu: hideMenu,
			toggleMenu: toggleMenu,
			goBack: goBack,
			goHome: goHome,
			reset: reset,
			showInfo: showInfo
		};
	};
	
	var Folder = function(sibling, parent, autoAddSiblingFolderEnabled, folderMapDisabled, isAppFolder) {
		// Store reference to this object
		var self = this;

		// Set parent and folder map elements
		if (sibling != null && sibling != undefined) {
			self.parent = sibling.parent;
		} else if (parent != null && parent != undefined) {
			self.parent = parent;
		}

		// Store the div
		self.div = document.createElement("div");

		_app.div.appendChild(self.div);

		// Add default class
		self.div.classList.add("Folder");

		// Set app folder flag
		if (isAppFolder == true) {
			self.isAppFolder = true;

			// Add app folder class
			self.div.classList.add("AppFolder");
		} else {
			self.isAppFolder = false;
		}

		// Size the folder
		var appRect = _app.div.getBoundingClientRect();
		var height = window.getComputedStyle(self.div, null).getPropertyValue("height");
		var height = Number(height.substring(0, height.length - 2));
		var height = Math.round(height / appRect.height * 100);
		self.div.style.height = height + "%";
		
		// Set rows and columns
		self.rowCount = _app.rowCount;
		self.columnCount = _app.columnCount;

		// Set row height and column width
		self.rowHeight = (1 / self.rowCount * 100);
		self.columnWidth = (1 / self.columnCount * 100);
		
		// Set auto add sibling folder capability
		if (autoAddSiblingFolderEnabled == true) {
			self.autoAddSiblingFolderEnabled = true;
		} else {
			self.autoAddSiblingFolderEnabled = false;
		}

		// Set tap counter (for double-tapping)
		self.taps = 0;

		// Set flag for input down
		self.tapped = false;

		// Set flag for input held
		self.held = false;

		// Set last time tapped
		self.lastTimeTapped = null;
		
		// Add events for checking checking folder input (scrolling)
		if (_mobile) {
			self.div.addEventListener("touchstart", _onFolderTap);
			self.div.addEventListener("touchmove", _onFolderMove);
			self.div.addEventListener("touchend", _onFolderUntap);
		} else {
			self.div.addEventListener("mousedown", _onFolderTap);
			self.div.addEventListener("mousemove", _onFolderMove);
			self.div.addEventListener("mouseup", _onFolderUntap);
		}

		// Set folder links
		if (sibling != null && sibling != undefined) {
			self.previousFolder = sibling;
			self.firstFolder = sibling.firstFolder;
		} else {
			self.previousFolder = null;
			self.firstFolder = self;
		}
		
		self.nextFolder = null;

		// Set folder X position
		if (self.previousFolder != null && self.previousFolder != undefined) {
			self.div.style.left = "100%";
			self.homeX = 100;
		} else {
			var left = window.getComputedStyle(self.div, null).getPropertyValue("left");
			left = Number(left.substring(0, left.length - 2));
			self.homeX = Math.round(left / _app.width * 100);
		}

		// Get home Y position as a percent
		var top = window.getComputedStyle(self.div, null).getPropertyValue("top");
		top = Number(top.substring(0, top.length - 2));
		self.homeY = Math.round(top / _app.height * 100);

		// Add a sibling folder
		self.addFolder = function(instantFlag, autoAddSiblingFolderEnabled, folderMapDisabled, unselectFlag, isAppFolder) {
			// Check if we've reached the limit of sibling folders
			if (self.getListLength() >= _settings.maxSiblingFolders) {
				if (!instantFlag) {
					_textModal.show("Whoops!", "You've reached the folder limit.");
				}
				return false;
			}
			
			var newFolder;

			// Insert new folder into the list
			if (self.nextFolder != null && self.nextFolder != undefined) {
				// Create the new folder
				newFolder = new Folder(self, null, autoAddSiblingFolderEnabled, folderMapDisabled, isAppFolder);
				
				// Set the new folder position in the list
				newFolder.nextFolder = self.nextFolder;
				self.nextFolder.previousFolder = newFolder;
				self.nextFolder = newFolder;
				
				var nextFolder = newFolder.nextFolder;
				while (nextFolder) {
					nextFolder.homeX += 100;
					nextFolder = nextFolder.nextFolder;
				}
			} else {
				// Create the new folder
				newFolder = new Folder(self, null, autoAddSiblingFolderEnabled, folderMapDisabled, isAppFolder);

				self.nextFolder = newFolder;
			}

			if (self.parentShortcut != null && self.parentShortcut != undefined) {
				self.nextFolder.parentShortcut = self.parentShortcut;
			}

			if (self.isAppFolder) {
				// Add the icon to the folder map
				self.folderMap.addFolder(self.nextFolder.getIndex(), false, false, true);
			} else {
				// Add the icon to the folder map
				self.folderMap.addFolder(self.nextFolder.getIndex());
			}

			// Show the new folder (unless we don't want to)
			if (!unselectFlag) {
				self.selectNextFolder(null, instantFlag);	
			}

			return newFolder;
		};

		self.remove = function(instantFlag, hiddenFlag) {
			// Remove the shortcuts in the folder (and subfolders)
			for (var r = 0; r < self.rowCount; r++) {
				for (var c = 0; c < self.columnCount; c++) {
					if (self.shortcuts[r][c] != null && self.shortcuts[r][c] != undefined) {
						self.shortcuts[r][c].remove(instantFlag, hiddenFlag);
					}
				}
			}

			if (!instantFlag) {
				// Wait till after we show the parent folder
				setTimeout(function() {
					// Hide the folder and remove it from the DOM
					self.div.style.display = "none";
					_app.div.removeChild(self.div);
				}, _settings.moveDuration);	
			} else {
				// Hide the folder and remove it from the DOM
				self.div.style.display = "none";
				_app.div.removeChild(self.div);
			}
			
			// Remove folder icon
			self.folderMap.removeFolderByIndex(self.getIndex());

			if (self.previousFolder != null && self.previousFolder != undefined) {
				// If there's a next folder, move it and the other next folders left
				if (self.nextFolder != null && self.nextFolder != undefined) {
					self.nextFolder.previousFolder = self.previousFolder;

					// Move all the next folders left
					var folder = self.nextFolder;
					while (folder) {
						var x = Number(folder.div.style.left.substring(0, folder.div.style.left.length - 1));
						folder.setPosition(x - 100);
						folder.updateHomePosition();
						folder = folder.nextFolder;
					}
				}
				
				// Check if we're showing animations
				if (!hiddenFlag) {
					// Select the folder
					self.selectPreviousFolder(instantFlag);
				}
				
				// Adjust the list
				self.previousFolder.nextFolder = self.nextFolder;
			} else if (self.nextFolder != null && self.nextFolder != undefined) {
				// Set shortcut to point at next folder (so that next time we enter the menu, we go to the correct folder)
				self.parentShortcut.subfolder = self.nextFolder;

				// If this is the first folder, update the first folder for the rest of the list
				if (self.firstFolder == self) {
					var folder = self.nextFolder;
					while (folder) {
						folder.firstFolder = self.nextFolder;
						folder = folder.nextFolder;
					}
				}
				
				// Check if we're showing animations
				if (!hiddenFlag) {
					// Select the folder
					self.selectNextFolder(true, instantFlag);
				}

				// Adjust the list
				self.nextFolder.previousFolder = self.previousFolder;
			} else if (self.parentShortcut != null && self.parentShortcut != undefined) {
				// Check if we're showing animations
				if (!hiddenFlag) {
					// If the folder is a subfolder, show the parent
					self.selectParentFolder(instantFlag);
				}

				// Remove the parent shortcut
				self.parent.shortcuts[self.parentShortcut.row][self.parentShortcut.column] = null;

				// Hide the shortcut and remove it from the DOM
				self.parentShortcut.div.style.display = "none";
				self.parentShortcut.parentFolder.div.removeChild(self.parentShortcut.div);

				// If the subfolder has no siblings, delete the folder map
				if (self.previousFolder == null && self.nextFolder == null) {
					self.folderMap.remove();
				}
			}
		};

		self.moveLeft = function(instantFlag) {
			_moveElementCSS(self, (self.homeX - 100) + "%", null, instantFlag);
		};

		self.moveRight = function(instantFlag) {
			_moveElementCSS(self, (self.homeX + 100) + "%", null, instantFlag);
		};
		
		self.moveHome = function(instantFlag) {
			_moveElementCSS(self, self.homeX + "%", null, instantFlag);
		};
		
		self.moveListHome = function(instantFlag) {
			var folder = self.firstFolder;
			while (folder) {
				_moveElementCSS(folder, folder.homeX + "%", null, instantFlag);
				folder = folder.nextFolder;
			}
		};

		// Update the position of the folder and its siblings
		self.setPosition = function(left, top) {
			_moveElementCSS(self, left + "%", top + "%", true, true);
		};

		self.updateHomePosition = function() {
			self.homeX = Number(self.div.style.left.substring(0, self.div.style.left.length - 1));
			self.homeY = Number(self.div.style.top.substring(0, self.div.style.top.length - 1));
		};
		
		self.setListPosition = function(left) {
			var folder = self.firstFolder;
			while (folder) {
				_moveElementCSS(folder, folder.homeX + left + "%", null, true, true);
				folder = folder.nextFolder;
			}
		};

		self.moveUp = function(instantFlag) {
			var rect = self.div.getBoundingClientRect();

			if (instantFlag) {
				_moveElement(self, null, self.homeY - _app.height, 0);	
			} else {
				_moveElement(self, null, self.homeY - _app.height);
			}
			
		};

		self.moveDown = function(instantFlag) {
			var rect = self.div.getBoundingClientRect();

			if (instantFlag) {
				_moveElement(self, null, self.homeY + _app.height, 0);
			} else {
				_moveElement(self, null, self.homeY + _app.height);
			}
		};

		self.moveListUp = function(instantFlag) {
			var folder = self.firstFolder;
			while (folder) {
				_moveElementCSS(folder, null, folder.homeY - 100 + "%", instantFlag);
				folder = folder.nextFolder;
			}
		};

		self.moveListDown = function(instantFlag) {
			var folder = self.firstFolder;
			while (folder) {
				_moveElementCSS(folder, null, folder.homeY + 100 + "%", instantFlag);
				folder = folder.nextFolder;
			}
		};
		
		self.getIndex = function() {
			var index = 0;
			var folder = self.firstFolder;
			while (folder != self) {
				index++;
				folder = folder.nextFolder;
			}
			return index;
		};
		
		self.getListLength = function() {
			var index = 0;
			var folder = self.firstFolder;
			while (folder) {
				index++;
				folder = folder.nextFolder;
			}
			return index;
		};

		self.indexOf = function(targetFolder) {
			var index = 0;
			var folder = self.firstFolder;
			while (folder) {
				if (folder == targetFolder) {
					return index;
				}
				index++;
				folder = folder.nextFolder;
			}
			return -1;
		};
		
		self.getDepth = function() {
			var depth = 0;
			var folder = self;
			while (folder.parent != null && folder.parent != undefined && folder.parent != _app) {
				depth++;
				folder = folder.parent;
			}
			return depth;
		};

		self.getByIndex = function(index) {
			var folder = self.firstFolder;
			while (folder) {
				if (folder.getIndex() == index) {
					return folder;
				}
				folder = folder.nextFolder;
			}
			return null;
		};

		self.selectNextFolder = function(backgroundStatic, instantFlag) {
			// Make sure we have a next folder to select
			if (self.nextFolder == null || self.nextFolder == undefined) {
				return false;
			}

			// Move all folders left
			var folder = self.firstFolder;
			while (folder) {
				folder.moveLeft(instantFlag);
				folder = folder.nextFolder;
			}

			// Remember the last active folder
			_lastActiveFolder = _activeFolder;

			// Set the new active folder
			_activeFolder = self.nextFolder;

			// If this is an app folder
			if (self.isAppFolder) {
				// Set the new active app folder
				_activeAppFolder = _activeFolder;
			}
			
			// If we're in a subfolder, update the last active subfolder
			if (self.parentShortcut) {
				self.parentShortcut.lastActiveSubfolder = self.nextFolder;
			}

			// Select the next icon in folder map
			self.folderMap.selectByIndex(_activeFolder.getIndex());

			if (!backgroundStatic) {
				// Move the app background
				var rect = self.div.getBoundingClientRect();
				//var duration = _settings.moveDuration / _settings.backgroundMoveRatio;
				if (instantFlag) {
					_moveElement(_app.background, _app.background.homeX - (rect.width * _settings.backgroundMoveRatio), null, 0);
				} else {
					_moveElement(_app.background, _app.background.homeX - (rect.width * _settings.backgroundMoveRatio), null, _settings.backgroundMoveDuration);
				}
			}
		};

		self.selectPreviousFolder = function(instantFlag) {
			// Make sure we have a previous folder to select
			if (self.previousFolder == null || self.previousFolder == undefined) {
				return false;
			}

			// Move all folders right
			var folder = self.firstFolder;
			while (folder) {
				folder.moveRight();
				folder = folder.nextFolder;
			}

			// Remember the last active folder
			_lastActiveFolder = _activeFolder;

			// Set the new active folder
			_activeFolder = self.previousFolder;

			// If this is an app folder
			if (self.isAppFolder) {
				// Set the new active app folder
				_activeAppFolder = _activeFolder;
			}

			// If we're in a subfolder, update the last active subfolder
			if (self.parentShortcut) {
				self.parentShortcut.lastActiveSubfolder = self.previousFolder;
			}

			// Select the next icon in folder map
			self.folderMap.selectByIndex(_activeFolder.getIndex());

			// Move the app background
			var rect = self.div.getBoundingClientRect();

			if (instantFlag) {
				_moveElement(_app.background, _app.background.homeX + (rect.width * _settings.backgroundMoveRatio), null, 0);
			} else {
				_moveElement(_app.background, _app.background.homeX + (rect.width * _settings.backgroundMoveRatio), null, _settings.backgroundMoveDuration);
			}
		};

		self.selectParentFolder = function(instantFlag) {
			if (self.parent) {
				self.parent.moveListDown(instantFlag);

				self.moveListDown(instantFlag);

				// Hide the folder map
				self.folderMap.moveDown(true, instantFlag);

				// Show the parent folder map
				self.parent.folderMap.moveDown(null, instantFlag);

				// Remember the last active folder
				_lastActiveFolder = _activeFolder;

				// Set the new active folder
				_activeFolder = self.parent;

				// Move the app background
				var rect = _activeFolder.div.getBoundingClientRect();
				var x = (-_activeFolder.getIndex() * rect.width) * _settings.backgroundMoveRatio;
				//var duration = _settings.moveDuration / _settings.backgroundMoveRatio;
				if (instantFlag) {
					_moveElement(_app.background, x, _app.background.homeY + (_app.height * _settings.backgroundMoveRatio), 0);
				} else {
					_moveElement(_app.background, x, _app.background.homeY + (_app.height * _settings.backgroundMoveRatio), _settings.backgroundMoveDuration);	
				}
			}
		};

		self.selectByIndex = function(index, instantFlag) {
			// Check if we're selecting an existing folder
			var match = false;
			var folder = self.firstFolder;
			while (folder) {
				if (folder.getIndex() == index) {
					match = true;
				}
				folder = folder.nextFolder;
			}
			if (!match) {
				return false;
			}

			// Check if we're selecting the active folder
			if (_activeFolder.getIndex() == index) {
				return false;
			}

			// Count number of background moves
			var increments = _activeFolder.getIndex() - index;

			// Move all of the folders
			var folder = self.firstFolder;
			while (folder) {
				_moveElementCSS(folder, folder.homeX + 100 * increments + "%", null, instantFlag);
				//_moveElementCSS(folder, folder.homeX + 100 + "%");
				
				if (folder.getIndex() == index) {
					// Set the new active folder
					_activeFolder = folder;

					// If this is an app folder
					if (self.isAppFolder) {
						// Set the new active app folder
						_activeAppFolder = _activeFolder;
					}

					// Select the icon in folder map
					self.folderMap.selectByIndex(_activeFolder.getIndex());

					// If we're in a subfolder, update the last active subfolder
					if (self.parentShortcut) {
						self.parentShortcut.lastActiveSubfolder = folder;
					}
				}

				folder = folder.nextFolder;
			}

			// Forget the last active folder
			_lastActiveFolder = null;
		};

		self.selectHomeFolder = function(instantFlag) {
			// If the current folder is the home folder, then don't do anything
			if (self == _app.homeFolder) {
				return;
			}
			
			// Get depth of folder
			var depth = _activeFolder.getDepth();

			// If we're not on the top level, then go to it
			if (depth > 0) {
				// Move the current list down
				self.moveListDown(instantFlag);

				// Don't remember the last active folder
				_lastActiveFolder = null;

				// Set the new active folder
				_activeFolder = self.parent;

				// Hide the folder map
				self.folderMap.moveDown(true, instantFlag);

				// Move the other lists
				var folderLevel = self.parent;
				while (folderLevel) {
					// If the folder has a parent (isn't the home list), then move it down twice instantly
					if (folderLevel.parent != null && folderLevel.parent != undefined) {
						// Move each folder in the level
						var folder = folderLevel.firstFolder;
						while (folder) {
							_moveElementCSS(folder, null, folder.homeY + 200 + "%", true);
							folder = folder.nextFolder;
						}

						// Set the new active folder
						_activeFolder = folderLevel;

						// Move down the foldermap twice
						folderLevel.folderMap.moveDown(null, instantFlag);
						folderLevel.folderMap.moveDown(true, instantFlag);
					} else {
						// If there is no parent, then it's the home list, so move it down
						folderLevel.moveListDown(instantFlag);

						// Set the new active folder
						_activeFolder = folderLevel;

						// Show the parent folder map
						folderLevel.folderMap.moveDown(null, instantFlag);
					}
					
					folderLevel = folderLevel.parent;
				}
			}

			// Check if we're on the same level as the home folder
			if (_activeFolder.indexOf(_app.homeFolder) != -1) {
				// If we are, show it
				_activeFolder.selectByIndex(0, instantFlag);
			}

			// Move the app background
			var rect = _activeFolder.div.getBoundingClientRect();
			if (instantFlag) {
				_moveElement(_app.background, 0, 0, 0);
			} else {
				_moveElement(_app.background, 0, 0, _settings.backgroundMoveDuration);
			}
		};

		// Add folder map
		if (!folderMapDisabled) {
			if (sibling != null && sibling != undefined) {
				self.folderMap = sibling.folderMap;

				//self.folderMap.addFolder(self.getIndex());
			} else if (parent != null && parent != undefined) {
				
			} else {
				// Create the first folder map
				self.folderMap = _app.folderMapArea.addFolderMap(self);

				if (self.isAppFolder) {
					// Add the app icon
					self.folderMap.addFolder(self.getIndex(), false, false, true);
				} else {
					// Add the home icon
					self.folderMap.addFolder(self.getIndex(), true);
				}
			}
		}

		// Store the shortcuts
		self.shortcuts = [];
		
		// Fill the shortcut arrays with null values (so we can iterate through them and look for empty spots)
		for (var r = 0; r < self.rowCount; r++) {
			self.shortcuts[r] = [];
			for (var c = 0; c < self.columnCount; c++) {
				self.shortcuts[r][c] = null;
			}
		}
		
		self.addShortcut = function(key, text, row, column) {
			// Determine row and column of shortcut
			if (row != null && row != undefined && column != null && column != undefined) {
				// TODO: Check if a shortcut already exists in this position (to prevent overlapping shortcuts)
			} else {
				// Check if we have an available shortcut position
				var nextAvailablePosition = self.getNextAvailableShortcutPosition();
				if (nextAvailablePosition) {
					// Check if we were given a new/sibling folder
					if (nextAvailablePosition.folder != self) {
						// Add the shortcut to the new/sibling folder
						return nextAvailablePosition.folder.addShortcut(key, text, nextAvailablePosition.row, nextAvailablePosition.column);
					} else {
						// Otherwise set the position to the first available
						row = nextAvailablePosition.row;
						column = nextAvailablePosition.column;
					}
				} else {
					// Otherwise don't create the shortcut
					_textModal.show("ERROR!", "Can't create shortcut because the folder is full.");
					return false;
				}
			}

			// Check if we don't have a custom shortcut name
			if (text == null && text == undefined) {
				text = _apps[key].text;
			}

			// Check if we have an app key (it's not a subfolder shortcut) {
			if (key != null && key != undefined) {
				// Add the new shortcut
				var shortcut = new Shortcut(self, text, _apps[key].icon, _apps[key].type, _apps[key].params, row, column);
			} else {
				var shortcut = new Shortcut(self, text, "img/icons/folder.png", "folder", null, row, column);
			}

			// Store the app key
			shortcut.key = key;

			// Store the shortcut in the folder
			self.shortcuts[row][column] = shortcut;
			

			// TODO: Remove fixed heights and use percentages (still works without percentages for some reason)
			// If the shortcut is below the screen, move the folder to show it (unless we're creating the appFolder, because we will be adding shortcuts to a folder that is not linked to other folders)
			if (self != _app.appFolder) {
				var appRect = _app.div.getBoundingClientRect();
				var folderRect = self.div.getBoundingClientRect();
				var shortcutRect = shortcut.div.getBoundingClientRect();
				var folderTop = appRect.top + _app.statusbar.height;
				var folderBottom = appRect.bottom - _app.navbar.height;
				
				var shortcutCenter = (shortcutRect.top + shortcutRect.bottom) / 2;
				if (shortcutCenter < folderTop) {
					var shortcutTop = Number(shortcut.div.style.top.substring(0, shortcut.div.style.top.length - 2));
					var newTop = _app.statusbar.height - shortcutTop;
					_moveElement(self, null, newTop);
					//self.div.style.top = newTop + "px";
				} else if (shortcutCenter > folderBottom) {
					var shortcutTop = Number(shortcut.div.style.top.substring(0, shortcut.div.style.top.length - 2));
					var newTop = _app.statusbar.height + _app.usableHeight - shortcutTop - self.rowHeight;
					_moveElement(self, null, newTop);
					//self.div.style.top = newTop + "px";
				}	
			}

			// Save storage after the shortcut is added (delay is required because of transition time)
			setTimeout(_saveStorage, 1);
			
			return shortcut;
		};
		
		// Get the next available shortcut position
		self.getNextAvailableShortcutPosition = function(folder) {
			// Get the first available spot
			var row = 0;
			var column = 0;
			for (var r = 0; r < self.shortcuts.length; r++) {
				for (var c = 0; c < self.shortcuts[r].length; c++) {
					if (self.shortcuts[r][c] == null || self.shortcuts[r][c] == undefined) {
						return {
							folder: self,
							row: r,
							column: c
						};
					}
				}
			}

			// If we don't have a spot, check if we're automatically adding sibling folders
			if (self.autoAddSiblingFolderEnabled) {
				// Check if already have a sibling folder
				if (self.nextFolder != null && self.nextFolder != undefined) {
					// If we do, check that folder for an available position
					return self.nextFolder.getNextAvailableShortcutPosition();
				} else {
					// If we don't, create a sibling folder
					var folder = self.addFolder(true, true, false, false, true);

					return {
						folder: folder,
						row: 0,
						column: 0
					}
				}
			}
		};
		
		self.getInputPosition = function() {
			var rect = _activeFolder.div.getBoundingClientRect();
			for (var r = 0; r < _activeFolder.shortcuts.length; r++) {
				var top = rect.top + r * rect.height / _activeFolder.rowCount;
				var bottom = rect.top + r * rect.height / _activeFolder.rowCount + rect.height / _activeFolder.rowCount;
				for (var c = 0; c < _activeFolder.shortcuts[r].length; c++) {
					var left = rect.left + c * rect.width / _activeFolder.columnCount;
					var right = rect.left + c * rect.width / _activeFolder.columnCount + rect.width / _activeFolder.columnCount;
					if (_inputX >= left && _inputX <= right && _inputY >= top && _inputY <= bottom) {
						return {
							row: r,
							column: c
						}
					}
				}
			}
		
			return false;
		};

		// Remove a shortcut
		self.removeShortcut = function(row, column) {
			var shortcut = self.shortcuts[row][column];
			
			self.shortcuts[row][column] = null;
			
			// Hide the shortcut and remove it from the DOM
			shortcut.div.style.display = "none";
			shortcut.parentFolder.div.removeChild(shortcut.div);
		};

		// Enable input
		self.inputEnabled = true;
	};

	var Shortcut = function(parentFolder, text, icon, type, params, row, column) {
		// Store reference to this object
		var self = this;

		// Set parent folder
		self.parentFolder = parentFolder;

		// Store the div
		self.div = document.createElement("div");

		// Add the child div
		self.parentFolder.div.appendChild(self.div);
		
		// Add default class
		self.div.classList.add("Shortcut");
		
		// Set row and column
		self.row = row;
		self.column = column;

		// Set position
		self.div.style.left = self.column / parentFolder.columnCount * 100 + 1 / parentFolder.columnCount / 2 * 100 + "%";
		self.div.style.top = self.row / parentFolder.rowCount * 100 + 1 / parentFolder.rowCount / 2 * 100 + "%";
		
		// Set home position
		self.homeX = Number(self.div.style.left.substring(0, self.div.style.left.length - 1));
		self.homeY = Number(self.div.style.top.substring(0, self.div.style.top.length - 1));

		// Set width and height
		self.div.style.width = 1 / parentFolder.columnCount * 100 + "%";
		self.div.style.height = 1 / parentFolder.rowCount * 100 + "%";

		// Set text
		self.text = text;
		if (text != null && text != undefined) {
			self.textDiv = document.createElement("div");

			// Add the text div
			self.div.appendChild(self.textDiv);

			// Set class
			self.textDiv.classList.add("ShortcutText");
			
			self.textDiv.innerHTML = text;
		}
		
		// Set image
		self.icon = icon
		if (icon != null && icon != undefined) {
			self.div.style.backgroundImage = "url(" + icon + ")";

			// Get favicon of URL
			//self.div.style.backgroundImage = "url(https://plus.google.com/_/favicon?domain=" + params.url + ")";
		}

		self.selectSubfolder = function(instantFlag) {
			if (self.parentFolder) {
				self.parentFolder.moveListUp(instantFlag);
			}

			// Hide the folder map
			self.parentFolder.folderMap.moveUp(true, instantFlag);

			// Show the subfolder map
			self.subfolder.folderMap.moveUp(null, instantFlag);

			self.subfolder.moveListUp(instantFlag);

			// Remember the last active folder
			_lastActiveFolder = _activeFolder;

			// Set the new active folder
			_activeFolder = self.lastActiveSubfolder;
			
			// Move the app background
			var rect = _activeFolder.div.getBoundingClientRect();
			var x = (-_activeFolder.getIndex() * rect.width) * _settings.backgroundMoveRatio;

			if (instantFlag) {
				_moveElement(_app.background, x, _app.background.homeY - (_app.height * _settings.backgroundMoveRatio), 0);
			} else {
				_moveElement(_app.background, x, _app.background.homeY - (_app.height * _settings.backgroundMoveRatio), _settings.backgroundMoveDuration);
			}
		};

		// Set params
		self.params = params;
		self.type = type;

		// Set callback to open url or create a subfolder
		if (type == "url") {
			self.tapCallback = function() {
				_loadShortcutUrl(self.params)
			};
		} else if (type == "script") {
			self.tapCallback = function() {
				self.params.script(self.params.scriptParams);
			};
		} else if (type == "folder") {
			// Create a new folder with the current folder as the parent
			self.subfolder = new Folder(null, self.parentFolder);

			var rect = self.subfolder.div.getBoundingClientRect();
			var top = Number(self.parentFolder.div.style.top.substring(0, self.parentFolder.div.style.top.length - 2));
			self.subfolder.div.style.top = self.subfolder.homeY + 100 + "%";
			self.subfolder.updateHomePosition();

			// Set the parent shortcut
			self.subfolder.parentShortcut = self;

			// Set the defautl last active subfolder
			self.lastActiveSubfolder = self.subfolder;
			
			// Set the callback of the shortcut to show the new folder
			self.tapCallback = function() {
				self.selectSubfolder();
			};

			// Create the first folder map
			self.subfolder.folderMap = _app.folderMapArea.addFolderMap(self);

			// Add the home icon
			self.subfolder.folderMap.addFolder(self.subfolder.getIndex(), false, true);
		}

		// Set tap counter (for double-tapping)
		self.taps = 0;

		// Set flag for input down
		self.tapped = false;

		// Set flag for input held
		self.held = false;

		// Set last time tapped
		self.lastTimeTapped = null;
		
		// Enable input
		self.inputEnabled = true;
		
		self.enableInput = function() {
			self.inputEnabled = true;
		};
		
		self.disableInput = function() {
			self.inputEnabled = false;
		};
		
		self.toggleInput = function() {
			self.inputEnabled = !self.inputEnabled;
		};
		
		self.getInputEnabled = function() {
			return self.inputEnabled;
		};
		
		self.setPosition = function(left, top) {
			_moveElementCSS(self, self.homeX + left + "%", self.homeY + top + "%", true, true);
		};
		
		self.resetPosition = function() {
			self.div.style.left = self.homeX + "px";
			self.div.style.top = self.homeY + "px";
		};
		
		self.moveHome = function() {
			_moveElementCSS(self, self.homeX + "%", self.homeY + "%");
		};
		
		self.moveByRowAndColumn = function(row, column) {
			// Move the shortcut in the parent folder array
			self.parentFolder.shortcuts[self.row][self.column] = null;
			self.parentFolder.shortcuts[row][column] = self;
			
			// Update row and column
			self.row = row;
			self.column = column;
			
			_moveElementCSS(self, self.column * parentFolder.columnWidth + 1 / parentFolder.columnCount / 2 * 100 + "%", self.row * parentFolder.rowHeight + 1 / parentFolder.rowCount / 2 * 100 + "%");
		}
		
		self.setPositionByRowAndColumn = function(row, column) {
			// Move the shortcut in the parent folder array
			self.parentFolder.shortcuts[self.row][self.column] = null;
			self.parentFolder.shortcuts[row][column] = self;
			
			// Update row and column
			self.row = row;
			self.column = column;
			
			// Update position
			self.div.style.left = self.column * parentFolder.columnWidth + "px";
			self.div.style.top = self.row * parentFolder.rowHeight + "px";
			
			// Update home position
			self.homeX = Number(self.div.style.left.substring(0, self.div.style.left.length - 2));
			self.homeY = Number(self.div.style.top.substring(0, self.div.style.top.length - 2));
		};
		
		self.remove = function(instantFlag, hiddenFlag) {
			self.parentFolder.removeShortcut(self.row, self.column);

			// Remove reference to this folder in subfolder, so that it can be deleted properly
			if (self.subfolder != null && self.subfolder != undefined) {
				self.subfolder.parentShortcut = null;

				// Check if the shortcut has a subfolder
				if (self.subfolder) {
					self.subfolder.remove(null, instantFlag, hiddenFlag);
				}
			}
			
			// Check if the folder has additional rows of shortcuts
			if (self.parentFolder.shortcuts.length > _app.rowCount) {
				// Check if the bottom row of shortcuts is empty
				var rowEmpty = true;
				for (var c in self.parentFolder.shortcuts[self.parentFolder.shortcuts.length -1]) {
					if (self.parentFolder.shortcuts[self.parentFolder.shortcuts.length -1][c] != null) {
						rowEmpty = false;
					}
				}
				
				if (rowEmpty) {
					// Adjust the height of the folder
					var rect = self.parentFolder.div.getBoundingClientRect();
					self.parentFolder.div.style.height = rect.height - self.parentFolder.rowHeight + "px";

					// Remove the last row
					self.parentFolder.shortcuts.pop();
					
					// Move the folder to show the new bottom
					var top = Number(_activeFolder.div.style.top.substring(0, _activeFolder.div.style.top.length - 2));
					_moveElement(self.parentFolder, null, top + self.parentFolder.rowHeight);
				}
			}
		};
		
		// Add events for checking checking shortcut input
		if (_mobile) {
			self.div.addEventListener("touchstart", function() {_onShortcutTap(self)});
			self.div.addEventListener("touchend", _onShortcutUntap);
		} else { 
			self.div.addEventListener("mousedown", function() {_onShortcutTap(self)});
			self.div.addEventListener("mouseup", _onShortcutUntap);
		}

		// Show the shortcut
		self.div.style.opacity = 1;
	};

	var Modal = function(headerText, messageText) {
		// Store reference to this object
		var self = this;
		
		// Store the div
		self.div = document.createElement("div");

		_app.div.appendChild(self.div);

		// Add default class
		self.div.classList.add("Modal");

		// Set header
		self.header = _addDiv(self, "ModalHeader");
		if (headerText != null && headerText != undefined) {
			self.header.div.innerHTML = headerText;
		} else {
			self.header.div.innerHTML = "&nbsp";
		}

		// Set message
		self.message = _addDiv(self, "ModalMessage");
		if (messageText != null && messageText != undefined) {
			self.message.div.innerHTML = messageText;
		}

		// Add exit button
		self.exitButton = _addDiv(self, "ModalExitButton", function() {
			self.exit();
		});

		// Add the button icon
		self.exitButton.icon = _addDiv(self.exitButton, "ModalButtonIcon glyphicon glyphicon-remove");

		self.exit = function() {
			_hideModal();
		};

		// Create object to hold data
		self.data = {};

		self.reset = function(data) {
			if (data != null && data != undefined) {
				self.data = data;
			} else {
				self.data = {};	
			}
		};

		self.setHeader = function(text) {
			self.header.div.innerHTML = text;
		};

		self.setMessage = function(text) {
			self.message.div.innerHTML = text;
		};

		// Add callback when enter is pressed (only fires when modal has focus)
		self.setEnterCallback = function(callback) {
			self.div.addEventListener("keyup", function(e) {
				if (self.showing) {
					e.preventDefault();
					e.stopPropagation();
				    if (e.keyCode === 13) {
				        callback();
				    } else if (e.keyCode === 27) {
				    	_hideModal();
				    }
				}
			});
		};

		self.showing = false;

		self.show = function(headerText, messageText, data) {
			self.showing = true;

			// Set header
			if (headerText != null && headerText != undefined) {
				self.header.div.innerHTML = headerText;
			}

			// Set message
			if (messageText != null && messageText != undefined) {
				self.message.div.innerHTML = "<p>" + messageText + "</p>";
			}

			// Reset the modal
			self.reset(data);

			_showModal(self);
		};
		
		self.addButton = function(iconName, callback, fullLength) {
			// Create the button
			var button = {};

			// Create the div
			button.div = document.createElement("BUTTON");

			// Add the div to the parent
			self.div.appendChild(button.div);

			// Add the default class
			button.div.classList.add("ModalButton");

			if (fullLength) {
				button.div.classList.add("ModalButtonFull");
			}

			// Add callback on click
			button.div.addEventListener("mousedown", callback);

			// Add the button icon
			button.icon = _addDiv(button, "ModalButtonIcon glyphicon " + iconName);

			return button;
		};

		self.addTextInput = function(iconName, defaultText) {
			// Create the text input
			var text = {};

			// Create the div
			text.div = document.createElement("INPUT");
			text.div.setAttribute("type", text);
			
			// Add the div to the parent
			self.div.appendChild(text.div);

			// Add the default class
			text.div.classList.add("ModalTextInput");

			// Set text limi
			text.div.setAttribute("maxlength", _settings.modalTextLimit);

			// Set the default text
			if (defaultText != null && defaultText != undefined) {
				text.div.value = defaultText;
			}

			return text;
		};
	};

	// Enable debugging
	var enableDebugging = function() {
		_settings.debugEnabled = true;
	};
	
	// Disable debugging
	var disableDebugging = function() {
		_settings.debugEnabled = false;
	};
	
	// Create the app
	var createApp = function(parent, rows, columns) {
		// Check we have an existing app
		if (_app != null && _app != undefined) {
			_printDebugText("ERROR: App already created!");
			return false;
		}
			
		// Set parent element
		if (parent != null && parent != undefined) {
			if (parent.tagName == "DIV" || parent == document.body) {
				_parent = parent;
			} else {
				_printDebugText("ERROR: Parent is not a valid DIV element!");
				return false;
			}
		} else {
			_parent = document.body;
		};

		// Create the app object
		return new App(_parent, rows, columns);
	};

	// Destroy the app
	var destroyApp = function() {
		if (_app != null && _app != undefined) {

			_app.div.style.display = "none";
			_app.parent.removeChild(_app.div);
			_app = null;
		}
	};

return {
		enableDebugging: enableDebugging,
		disableDebugging: disableDebugging,
		createApp: createApp,
		destroyApp: destroyApp
    };
})();

// Create the app when the page loads
var init = function() {
	MobileUI.app = MobileUI.createApp();
};