# FR05I

- A simple timing client for the Fleetrace project.
- A small Angular SPA application written in typescript.

At application startup time it will try to retrieve the event-params.
These event-params will be used to init the UI with correct number of buttons:
- the number of races (raceCount)
- the number of time points in a race (itCount)
- the number of bibs to be used (startlistCount)

### 1. Use the connection-control component
- You should check the status of the connection and manually connect if not connected.
- Buttons **on** and **off** will make api calls.
- These will of course not work if you test with `ng serve -o`.
- The **clear** button will also make an api call and clear out all timing data. Use it for testing only.
- The **log** button will print status info to the console.

What should happen if you click the **on** button may depend on the environment, e.g. where the app is used. You can change that to suit your needs.
You may also prefer to use hard coded parameters and not ask the server.

### 2. Select Race and IT
- You will need to select a race and a time point.
- IT0 is the finish time point.
- IT1 would be the first time point.
- There is at least one race.
- There will be at least one time point, the finish time point.

### 3. Create timing events for a Bib in a Race at IT

- You click on bib buttons in order to generate timing events (messages).
- If connected these messages will go out to the server.
- There will be a bib button for every entry in the race/event.
- The color of these bib buttons can be pink or blue.
- Click on a pink bib to generate a message.
- A message will be generated and the button will turn blue.
- Blue buttons are buttons for used bibs.
- Bibs are bows (bow numbers) in the sport of sailing.
- If you click on a blue bib - the bib will get selected, no message will be generated.
- You can see on the UI what race, time point, and bib is current (selected).
- The trigger button works with the selected bib.
- The radio buttons determine the **Mode**.
- What message will be generated depends on mode.
- Default for mode is time/finish.
- Note that it will jump back to the default mode when you generate a message.
- One or two messages will be generated in response to a button click.
- One message if the selected time-point is an intermediate time point.
- Two messages if the finish time point is selected for the race.
- The clear button will make all bib buttons pink again.

The result server application for the sailing event has two major parts.
It is a two in one application.

- There is the sports specific event part (series scoring).
- And there is the race timing part.
- The race part is dealing with times.
- The event part is dealing with finish positions.
- FR05I can only send standard race timing status values.
- Standard status values are dns, dnf, and dsq.
- Status values are for both, race part and event part.

So that is why sometimes two messages will be generated and sent.

- You could build a client app which will only deal with the race or event part.
- There are race only and event only server applications too.
- The event part does not need to be updated live.
- It could be that the event part will be updated after the race has completed.
- Lots of variations are possible.

### 4. About SimpleText

SimpleText is not used here. It can be removed.
But you could add another button to download and process current event data from the server. See jsonBtnClick() in app.component.ts.

## Build for Delphi or Node

For Delphi or Node we use the `/frac/` base-href.
Run `npm run build-fr` to build the project.
This will build using the hard-coded base-href.
The build artifacts will be stored in the `dist/` directory.

- In the ini file of the Delphi application you need to specify the location of the dist folder.
- In the app.ts file of the node proxy server you need to update the path to the dist folder.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Status

Test version, works with FR69.

To do: morph the layout so that it can be used from a phone size device.