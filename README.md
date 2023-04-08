# tiamblia-original

This is the original experiment, precursor to [Tiamblia](https://github.com/1j01/tiamblia-game)

You can play around with it [here](https://1j01.github.io/tiamblia-original/).
There's no default world, so press <kbd>E</kbd> to enter editing mode and draw polygons to create some terrain.
Right click to delete a terrain polygon. To place trees, select Tree from the Entities bar and click on the ground where you want the base of a tree to be.

## Controls

Use the arrow keys or <kbd>WASD</kbd> to move, <kbd>down</kbd> to mount/unmount a steed.
Press <kbd>F</kbd> to fly.

Press <kbd>M</kbd> to toggle a simple music track.  
Press <kbd>K</kbd> to enable generative music.  
Press <kbd>L</kbd> to toggle a panel with controls for the generative music.  

Note that there's no way to turn off the generative music once you've turned it on.

## Development

All development has moved to [tiamblia-game](https://github.com/1j01/tiamblia-game), which has a new engine and editor, bow and arrow mechanics, and a lot more.

Use any web server to serve the files.

If you have Node.js, `npx live-server` will install and run a web server which will automatically reload the page when you make changes,
and it will by open the page in your default browser.

There is also an express+socket.io server in `server.js` intended for multiplayer, which was not very developed.
It kind of syncs player positions, but nothing else, and it doesn't even sync that very well.

## Music

The simple music is an old guitar song I wrote, which is fun to play. See [guitar tablature](music.tab).

The generative music is based on [a web audio example](https://web.archive.org/web/20130406040338/http://chromium.googlecode.com:80/svn/trunk/samples/audio/wavetable-synth2.html),
modified to randomize the note sequence and parameters over time.
