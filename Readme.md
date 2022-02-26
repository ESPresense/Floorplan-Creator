# FloorPlan creator for ESPresenseIPS

This project has been created to make it easier to create floorplan for ESPresenseIPS by having a gui.
It offers snap to rooms for easy alignement, gives you mesures on each side of your cursor when on a wall.
This application is developped in HTML/JS/CSS, no libraries (but fontawesome on a cdn), Canvas power !

This project is a work in progress.

## How to use
- Download the project
- open "index.html" with a browser
- start drawing each rooms
- add esp32 devices inside each room
- click the "export to yaml" button
- copy generated code over to ESPresenseIPS app.js file

## Changes
26-02-2022
- Show ESP32 device coverage button
- ESP32 coverage shown as a circle around the device
- Coverage distance is ajustable
- Circle color is adjustable
- Coverage circle can be visible when placing device to help positioning it right
- Now you can even make art with the app.

25-02-2022
- Dark Theme
- Fix yaml floorplan coordinates (was in cm needs m)
- Icons and small UI tweaks
- Add ESP32 to Rooms
- Edit ESP32 Z value and see its yaml code
- yaml export now exports esp32 position as well

24-02-2022
- Scroll/Mouse Wheel to move floorplan in canvas

## What is planned.  
[✓] Better UI/UX.  
[✓] Scroll/Wheel on the canvas to move floorplan.   
[  ] Zoom on the canvas.    
[  ] Pan on the canvas.      
[✓] Ability to add esp32 in rooms and position them with precision.  
[✓] Export esp32 position from rooms to ESPresenseIPS yaml format.  
[✓] Have each esp32 bluetooth signal radius visible on plan to make sure you have at least 3 signals in each rooms. (will help determine where is the best place to put them ;)).  
[  ] Code refactoring, add comments.

## Technical

Positions are calculated as followed : 
- find the room with the smallest x value (left side of screen)
- find the room with the smallest y value (top of screen)
- generate an offset with those 2 values (which means "smallestX, smallestY" is now the "0,0" position
- every position saved from drawn rooms are then recalculated with this offset

Scroll :
- The scroll moves the floorplan on the canvas
- the scroll position are updated directly in the storage (rather than offsetting everywhere in the code)
- the initial coordinates of each room WILL change if you scroll
- This is of no effect on the final exported values thanks to the way they are calculated before exporting.

ESP32 Devices :
- Devices export only x, y, z values
- Device has its room's name when exported to yaml
- z value is set to 0 by default and can be changed when opening the device modal (green square under room name in right menu)
- coverage and color value are only for display purposes (they are not exported)

## A little glimps

<img width="1918" alt="Screenshot 2022-02-26 at 00 01 42" src="https://user-images.githubusercontent.com/3304418/155815186-3fe68408-f55f-4bed-b310-8d8b059f4660.png">

<img width="1920" alt="Screenshot 2022-02-26 at 00 02 04" src="https://user-images.githubusercontent.com/3304418/155815196-1a08bef6-4824-4a6b-a175-0e3ad8fa14c4.png">

<img width="1920" alt="Screenshot 2022-02-26 at 00 02 17" src="https://user-images.githubusercontent.com/3304418/155815203-79cc8971-2a16-441a-8a07-0785d31a6b72.png">

<img width="1920" alt="Screenshot 2022-02-26 at 00 02 40" src="https://user-images.githubusercontent.com/3304418/155815206-9bebe308-3fd3-4868-9984-bd1ce0aabe06.png">

<img width="1920" alt="Screenshot 2022-02-26 at 00 02 57" src="https://user-images.githubusercontent.com/3304418/155815210-9b43120a-ac5a-45a5-9bdc-06835045ba35.png">

<img width="1920" alt="Screenshot 2022-02-26 at 00 58 53" src="https://user-images.githubusercontent.com/3304418/155819156-1cbcd5cd-0398-4d0b-9bf2-86c5503221d3.png">

<img width="1920" alt="Screenshot 2022-02-26 at 00 59 07" src="https://user-images.githubusercontent.com/3304418/155819162-809ad234-b525-481e-b9cf-479d37a42360.png">

<img width="1920" alt="Screenshot 2022-02-26 at 00 59 29" src="https://user-images.githubusercontent.com/3304418/155819171-a63a55f4-196e-4850-898f-15ab5a6188b5.png">


