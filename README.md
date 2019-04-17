# FR05I

- A simple timing client for the Fleetrace project.
- A small Angular SPA application written in typescript.

At application startup time it will try to retrieve the event-params.
The event-params will be used to init the UI with correct number of buttons.
- the number of races (raceCount)
- the number of time points in a race (itCount)
- the number of Bibs to be used (startlistCount)

### 1. Use the connection-control component
- You will also need to check the status of the connection and connect if not connected.
- Buttons **on** and **off** will make api calls.
- These will not work if you test with `ng serve -o`.
- The **clear** button will also make an api call and clear out all timing data. Use it for testing only.
- The **log** button will print status info to the console.

What exactly happens if you click the ***on* button may depend on the different situations, where the app is used,
if the app it is served by a Delphi app directly or a Node proxy.

### 2. Select Race and IT
- You will need to select a race and a time point.
- IT0 is the finish time point.
- IT1 would be the first time point.
- There is at least one race.
- There will be at least one time point, the finish time point.
- Then you can start to click buttons in order to generate at timing event.

### 3. Create timing events for a Bib in a Race at IT

- There will be a Bib button for every entry in the race/event.
- Click on a pink `fab` button representing a Bib.
- A message will be generated.
- The button will turn blue.
- Blue **Bib** buttons are buttons for used bibs.
- Bibs are Bows (bow numbers) in the sport of sailing.
- If you click on a blue Bib - the Bib will get selected.
- The trigger button works with the selected Bib.
- The radio buttons determine the **Mode**.
- What message will be generated depends on Mode.
- Default for Mode is time/finish.
- Note that it will jump back to the default mode when you generate a message.
- One or two messages will be generated at a time.
- One message if the selected time-point is an intermediate time point.
- Two messages if the finish time point is selected for the race.
- Clear button will make all Bib buttons pink again.

Note that the result server application for the sailing event has two main parts.
The sports specific Event-Part (series scoring) and the Race-Part.

- The event part is dealing with finish positions only.
- The race part is a pretty generic race-timing solution.
  It deals with times.

### 4. About SimpleText

SimpleText is not used here. It can be removed.
But you could add another button to download the current event data from the server and do something with it.
See jsonBtnClick() in app.module.ts.

## Build for Delphi or Node

For Delphi or for the node proxy server we need the `/frac/` base-href.
Run `npm run build-fr` to build the project.
This will build using the hardcoded base-href.
The build artifacts will be stored in the `dist/` directory.

- In the ini file of the Delphi application you need to specify the location of the dist folder.
- In the app.ts file of the node proxy server you need to update the path to the dist folder.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Status

Test version, works with FR69.

To do: morph the layout so that it can be used from a phone size device.

( Help is welcome. )