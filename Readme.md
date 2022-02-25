# FloorPlan creator for ESPresenseIPS

This project has been created to make it easier to create floorplan for ESPresenseIPS by having a gui.
It offers snap to rooms for easy alignement, gives you mesures on each side of your cursor when on a wall.
This application is developped in HTML/JS/CSS, no libraries, Canvas power !

This project is a work in progress.

## Changes
26-02-2022
- Dark Theme
- Fix yaml floorplan coordinates (was in cm needs m)
- Icons and small UI tweaks
- Add ESP32 to Rooms
- Edit ESP32 Z value and see its yaml code
- yaml export now exports esp32 position as well

24-02-2022
- Scroll/Mouse Wheel to move floorplan in canvas

## What is planned.  
[X] Better UI/UX.  
[X] Scroll/Wheel on the canvas to move floorplan.   
[  ] Zoom on the canvas.    
[  ] Pan on the canvas.      
[X] Ability to add esp32 in rooms and position them with precision.  
[X] Export esp32 position from rooms to ESPresenseIPS yaml format.  
[  ] Have each esp32 bluetooth signal radius visible on plan to make sure you have at least 3 signals in each rooms. (will help determine where is the best place to put them ;)).  
[  ] Code refactoring, add comments.

## A little glimps

<img width="1920" alt="Screenshot 2022-02-24 at 00 34 28" src="https://user-images.githubusercontent.com/3304418/155430638-df661690-5c51-486e-a0ee-e4e9ed8bc932.png">

<img width="1920" alt="Screenshot 2022-02-24 at 00 34 41" src="https://user-images.githubusercontent.com/3304418/155430652-b13593b5-d1f6-4b9a-93b0-e56ed2609624.png">

<img width="1920" alt="Screenshot 2022-02-24 at 00 34 55" src="https://user-images.githubusercontent.com/3304418/155430675-b7056b2e-4739-4d39-a23f-58174098061a.png">

<img width="1920" alt="Screenshot 2022-02-24 at 00 36 03" src="https://user-images.githubusercontent.com/3304418/155430700-43e9019a-7151-4ab8-8102-de18ff417d02.png">

<img width="1920" alt="Screenshot 2022-02-24 at 00 55 27" src="https://user-images.githubusercontent.com/3304418/155430749-953525a6-748d-47bb-a2c6-8305e842ff1d.png">

