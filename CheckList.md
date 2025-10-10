# Coffee House Check List

## Layout Requirements

1. Checking validation of pages: **+16**

- [x] The layout of both pages is valid: to check the validity of the layout, use the service https://validator.w3.org/ . **+12** (6 points per page)  
       Valid markup of checked page corresponds to the message "Document checking completed. No errors or warnings to show." In this case, we assign the full points for the checked page (+6). If there are `warnings` but no `errors`, we assign half of the points (+3) for the checked page
- [x] Favicon is added to each page **+4**

2. The layout of the pages matches the design at a screen width of 1440px: **+14**

- [x] `<header>` block on each page **+2**
- [x] `Enjoy` block on `home` page **+2**
- [x] `Favourites Coffee` block on `home` page **+2**
- [x] `About` block on `home` page **+2**
- [x] `Mobile App` block on `home` page **+2**
- [x] `Menu` block on `menu` page **+2**
- [x] `<footer>` block on each page **+2**

3. The layout of the pages matches the design at a screen width of 768px: **+14**

- [x] `<header>` block on each page **+2**
- [x] `Enjoy` block on `home` page **+2**
- [x] `Favourites Coffee` block on `home` page **+2**
- [x] `About` block on `home` page **+2**
- [x] `Mobile App` block on `home` page **+2**
- [x] `Menu` block on `menu` page **+2**
- [x] `<footer>` block on each page **+2**

4. The layout of the pages matches the design at a screen width of 380px: **+14**

- [x] `<header>` block on each page **+2**
- [x] `Enjoy` block on `home` page **+2**
- [x] `Favourites Coffee` block on `home` page **+2**
- [x] `About` block on `home` page **+2**
- [x] `Mobile App` block on `home` page **+2**
- [x] `Menu` block on `menu` page **+2**
- [x] `<footer>` block on each page **+2**

5. There is no horizontal scroll bar at all screen width up to 380px inclusive. All page content remains as per the design: it is not cropped, removed, or shifted to the side: **+20**
   - [x] No horizontal scroll bar when the `home` page width is between 1440px and 768px: **+5**
   - [x] No horizontal scroll bar when the `home` page width is between 768рх and 380рх: **+5**
   - [x] No horizontal scroll bar when the `menu` page width is between 1440px and 768px: **+5**
   - [x] No horizontal scroll bar when the `menu` page width is between 768рх and 380рх: **+5**
6. During smooth resizing of the screen from 1440px to 380px, the layout takes up the full width of the window (including the margins specified in the layout), elements change their sizes and positions (but without full scaling), elements do not overlap, and images maintain their correct proportions: **+8**
   - [x] On `home` page: **+4**
   - [x] On `menu` page: **+4**

- [ ] 7. At screen widths of 768px and below on both pages, the menu and navigation buttons in the header are hidden, and a burger menu icon appears: **+4**
- [ ] 8. Hover effects are enable on desktop devices (`Desktop` device type in DevTools) and disabled for mobile devices on both pages (`Mobile` device type in DevTools): **+4**

9. CSS Requirements **+10**
   - [ ] For positioning images in `About` block on `home` page and products in `Menu` block on `menu` page used **Flexbox** or **Grid Layout** **+4**
   - [ ] When scaling the browser page (<100%) or increasing the page width (>1440px), the layout of both pages is centered rather than shifted to the side and not stretched across the entire width **+4**
   - [ ] The background color **Body** stretches across the entire width of the page **+2**
10. Interactivity **+32**
    - [ ] Navigation elements (except `Contacts`) lead to corresponding blocks on `home` page (anchor links) **+4**
    - [ ] `Contacts` in navigation panel links to the `<footer>` block on its own page (anchor link) **+2**
    - [ ] Smooth scrolling with anchor links **+2**
    - [ ] When clicking on the **Menu** buttons in `header` and `Enjoy` block on `home` page, it navigates to the `menu` page **+2**
    - [ ] The **Menu** button in `header` on `menu` page is non-interactive **+2**
    - [ ] When clicking on the **Logo** in `header`, it navigates to the `home` page **+2**
    - [ ] The active **Coffee** button in `Menu` block of `Menu` page is non-interactive **+2**
    - [ ] Each Coffee-card in the `Menu` section of the `Menu` page is interactive when hovering over any area of the card **+4**
    - [ ] In the `<footer>` block, clicking on the link with phone number (all area including icon) should initiate a phone call **+2**
    - [ ] In the `<footer>` block, clicking on the link with the address (all area including icon) should open a new browser tab with Google Maps displaying any location of your choice **+2**
    - [ ] Interactivity of links and buttons is implemented according to Figma layout. Interactivity includes not only changing cursor's appearance, for example, using the `cursor: pointer` property, but also the use of other visual effects, such as changing the background color or font color, following the **Styleguide** in Figma layout **+4**
    - [ ] Mandatory requirement for interactivity: smooth change in the appearance of an element on hover and click, without affecting adjacent elements **+4**

- [ ] 11. At screen widths of 768px and below on both pages, the menu and navigation buttons in the header are hidden, and a burger menu icon appears: **+4**

##Functional requirements

1. Implementation of the burger menu on both pages: **+22**
   - [ ] At a page width of 768px or less, the navigation panel hides, and the burger icon appears: **+2**
   - [ ] When clicking the burger icon, the burger menu slides out from the right, and the burger icon smoothly transforms into a cross: **+4**
   - [ ] The burger menu occupies the entire available screen area below the `<header>` block: **+2**
   - [ ] When clicking the cross, the burger menu smoothly hides, moving to the right of the screen, and the cross smoothly transforms into a burger icon: **+4**
   - [ ] The burger icon is created using HTML and CSS without the use of images: **+2**
   - [ ] Links in the burger menu work, providing smooth scrolling to anchor points: **+2**
   - [ ] When clicking on any link (interactive or non-interactive) in the menu, the burger menu smoothly hides to the right, and the cross smoothly transforms into a burger icon: **+2**
   - [ ] The placement and dimensions of elements in the burger menu match the layout (horizontal centering of menu items): **+2**
   - [ ] When the page width increases to 769px or higher, the burger icon and the open burger menu hide, and the navigation panel appears: **+2**
2. Implementation of the carousel on the `home` page: **+24**
   - [ ] Carousel elements are automatically scroll to the left with a specified time interval by default. The time interval duration is at the student's choose, but the recommended value is 5-7 seconds: **+4**
   - [ ] The current state until the next automatic switch is shown in the progress bar of the corresponding slide by filling it with color: **+4**
   - [ ] Only the progress bar of the current slide can be filled; the rest remain in their default state: **+2**
   - [ ] When hovering the mouse or touch-and-hold on the displayed carousel element, the time to the element switch is paused. When the mouse cursor moves out, or the hold ends, the time continues from where it stopped: **+2**
   - [ ] The switch slides is accompanied by like the carousel animation (the method of animation execution is not verified): **+4**
   - [ ] Manual switching in the corresponding direction is implemented by pressing left arrow button or right arrow button: **+2**
   - [ ] For mobile devices, manual switching in the corresponding direction is additionally implemented by swiping left or right: **+2**
   - [ ] When manually switching, the progress bar state of the switched slide resets, and the progress bar of the displayed slide starts to fill: **+2**
   - [ ] When switching to the right after the third element, it returns to the first. When switching to the left after the first element, it returns to the third: **+2**
3. Categories of products on the `menu` page: **+16**
   - [ ] The **Coffee** category is active and the corresponding products are displayed when opening or reloading the `menu` page: **+2**
   - [ ] When switching categories, the products of the selected category are displayed: **+2**
   - [ ] For screens with a width of 768px or less, when opening/reloading the page or switching categories, only 4 products are displayed. If there are more than 4 products in the displayed category, a **Load More** button is displayed below: **+4**
   - [ ] When clicking the **Load More** button below the displayed products, the missing products are added, and the **Load More** button is hidden: **+4**
   - [ ] When changing the screen width, the product display mode (8 products per page or 4 products with a **Load More** button) changes without page reloading: **+4**
4. The Modal on the `menu` page: **+20**
   - [ ] The Modal with the description of a specific product opens when clicking on any part of a card of product: **+2**
   - [ ] The part of the page outside the Modal is darkened: **+2**
   - [ ] When the Modal is open, the vertical scroll of the page becomes inactive; when closed, it becomes active again: **+2**
   - [ ] Clicking on the area around the Modal and **Close** button closes it: **+2**
   - [ ] The Modal is centered on both axes, sizes of modal elements and their layout match the design: **+2**
   - [ ] After the Modal is opened, the 'Size' option 'S' is selected, and no option in the 'Additives' section is selected. The product's final price is the same as in the card: **+2**
   - [ ] Only one 'Size' option can be selected. Changing this option also changes the final price of the product based on the choice (+$0.00 for **S**, +$0.50 for **M**, +$1.00 for **L**): **+4**
   - [ ] Multiple 'Additives' options can be selected, and each selected option increases the final price of the product by $0.50: **+4**
5. Video on the `home` page: **+8**
   - [ ] In the `Enjoy` block of the `home` page, a video is played in the background instead of an image, without sound and control elements, and without the ability to interact with it: **+4**
   - [ ] After the video is finished, it automatically starts over: **+4**
