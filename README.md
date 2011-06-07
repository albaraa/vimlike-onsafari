# vimlike-onsafari

fork of vimlike-onsafari by ArcCosine, a Safari Extension that adds Vim keybindings to Safari.

## Overview

vimlike-onsafari provides vim keybindings for Safari including page navigation hyperlink selection. Vimlike can be disabled per page and is automatically disabled on websites that use vim keybindings like Gmail and Google Reader.

vim.safariextension by mutle provides a subset of the features of vimlike-onsafari (and is annoyingly not disabled on Gmail, etc.): https://github.com/mutle/vim.safariextension

## Install

* To DOWNLOAD, click "Downloads" or go here: https://github.com/msutherl/vimlike-onsafari/archives/master then download "vimlike.safariextz" under "Download Packages"
* To MAKE CHANGES, clone or download the source, make your edits in 'vimlike.js', and use the Safari Extension Builder (in the Develop menu) to compile. This is as easy as adding the project folder using the '+' in the lower left and clicking "build package...". You will need a free Safari Developer license, which can be obtained at http://developer.apple.com/ (actually a fairly annoying process, but there are guides to be found)

## Changes

* updated Key functions documentation
* made a new display style that's more spartan and vim-like (monospace font, no border, green background). "Safari-style" is left commented out in the .css file. 
* made the mode display more appealing by trying to match the look of the Safari status bar. Fade out time is sped up and the display is completely transparent except on change and on mouseover. Designed to look best with the status bar turned off for when using the Invisible Status Bar (popup status bar) extension with the Safari theme.

## Documentation

~~~
normal mode

Key function
h   ←
j   ↓
k   ↑
l   →
C-d PageDown
C-u PageUp
Esc Focus Page
C-[ Focus Page
gg  Go To Page Top
G   Go To Page End
gt  Focus next tab
K   Focus previous tab
gT  Focus previous tab
J   Focus next tab
t   Open new tab
u   Reopen tab
C-w Close tab
d   Close tab
r   Reload
H   History back
L   History forward
f   Hit a Hint (Use asdfgh change mode (useonline mode))
/   Hit a Hint
F   Deactivate Hit a Hint

useonline mode
"Shortcuts page in the online Shift + Esc shortcut you can use online by pressing (Google Reader, Gmail, ...)

Key function
S-Escape    change mode (normal mode)
~~~