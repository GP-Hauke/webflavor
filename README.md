# "WebFlavor" Course Template
### Documentation – v. 2.0
Created: 06/09/2017
Last modified: 12/19/2017
By: Hauke Bahr

## Contents
1. Introduction
2. Prerequisite Skills
3. Folder Structure
4. Quick Reference
5. Settings
6. HTML Grid Layout

## Introduction
The purpose and goal of this template is to provide a way to quickly create custom HTML courses that are versatile and flexible. Developers with a good understanding of the prerequisite skills (see below) will be able to create custom HTML courses that can accommodate any design, interactions, media objects, size and whatever other features the requirements specify. All those features can be added, modified, replaced or removed easily

## Prerequisite Skills
In order to modify the content of the course, the user needs to have an intermediate understanding of XML, HTML, and the Bootstrap CSS framework. Specifically, the user needs to know how to modify an existing XML document - including addition, removal, and changes of nodes – and how to modify HTML documents that are built upon the “Bootstrap” grid framework. Details will be described in this document.

## Folder Structure

app
+---dir
¦   +---content
¦   ¦   +---course_content
¦   ¦
¦   +---css
¦   ¦   +---default
¦   ¦   +---themes
¦   ¦    
¦   +---media
¦       +---audio
¦       +---fonts
¦       +---img
¦       +---video
¦
¦
+---src
    +---components
    ¦   +---assessments
    ¦   +---content
    ¦   +---navigation
    ¦
    +---js
    ¦   +---api
    ¦
    +---lms
    +---vendors

---

## Quick Reference:
This section will go into a little more detail about the folder structure and explain which files to modify to make changes to an existing course or create a new course from the template.

### Top-Level Files:

**index.html** Foremost, index.html constitutes the UI shell of the course, it holds the navigation menu markup, and it initiates the course on the LMS and sets up several other things behind the scenes. Some changes to the html will need to be made to display the menu and navigation of the specific course you are creating. In future versions of the template, more of the menu and navigation will simply be set in the pertinent xml files but for now, html changes are required.

**dir/..** The top two src/.. and dir/.. directories are the two op level folders in the shell that split the course into "Core functionality and frame" and "course specific content." Everything in  dir/.. relates to content specific to the course that is being developed (the actual content, media, and styles used).

**src/..**  Everything in src/.. is related to how the course works on a fundamental level. It contains the home for the js files that deal with functionality on how a user navigates to the next back and back, it contains the vendor css and js files, it also contains lms and scorm related files, and overall functionality on how different usable components work (such as nagivation menu, glossary, or assessments). No material in src/.. pertains to any specific course in terms of content and eLearning.

**imsmanifest.xml:** this file is stored in src/lms, however is a general top priority file. In this file, the course title needs to be set in five different places. In the template, you can simply search for **“Official Course Title Goes Here”** (main title as it will appear to the learners on the LMS launch page) and **“official_course_title_goes_here”** (unique identifier necessary for tracking progress, setting bookmarking and other things happening behind the scenes on the LMS) and then enter the official title of your own course in those five places.

* **Note:** The main title cannot contain any special characters or else the LMS might not accept it or display it incorrectly. The unique identifier cannot have spaces or special characters. Instead, use underscores to separate words. Conventionally, unique identifiers are spelled in all lowercase characters. sco01.xml: Just like in imsmanifest.xml, search the document for “Official Course Title Goes Here” and “official_course_title_goes_here” and swap them for the actual course title, maintaining the specifications outlined above.

**sco01.xml:** Just like in **imsmanifest.xml**, search the document for **“Official Course Title Goes Here”** and **“official_course_title_goes_here”** and swap them for the actual course title, maintaining the specifications outlined above

---

### dir/.. Contents:

**content** is the folder that holds all the content pertaining to the course. It has one inner folder called **course_content** and then xml files in its own directory as well as the course_content directory. These XML files are the storage units for all the information related to the course. Assessment questions and answers are in assessments.xml, glossary terms are in glossary.xml, and so on. **course_content** specifically holds the xml files that have the HTML markup for each of the pages. Since src/.. is responsible for non-specific course functionality, the markup specific to each course is stored here.

**css** is the folder that contains all css styles. The HTML shell has a default styling which can be accessed in css/default however, this file isn't ever going to be edited by developers. It is simply the default styling the course shell has. To style the shell to a particular courses needs, the themes styles should be used in css/themes. Styles applied here will override the default styling and allow the course to be styled to the developer's choice.

**media** is the last folder in the dir/.. directory and it contains all media of the course (imgs, videos, audio, etc). Note that in media/img the imgs directly there are mostly related to the frame of the base course. These are all the imgs for buttons and interactive media that isn't specific to any course. They can be changed and updated to fit a different style if needed. within media/img/assets however will be the actual imgs used in the course as media. Photos relavent to the client's course are stored here.

---

### src/.. Contents:

**js** contains the js for the core functionality of the course. It is the methods used for the backbone of the shell in terms of interface. Functions for how the LocalStorage is filled, how data is pulled in, how the user advances to the next page, etc. are what this folder contains. In addition, it also has js/api which holds the scorm API wrappers.

**components** is for the remaining js files that are too specific to be in src/js. These files reference functionality but about specific components rather than the course on a general level. The functionality for how the navigation menu, glossary, modal, etc. work are stored here rather than the general js directory.

**lms** is home to the two core files used to integrate the course with the client's lms: **imsmanifest.xml** and **sco01.xml**

**vendors** has all the vendors css and js files stored in their appropriate folders. It is the location where Bootstrap, JQuery, and others are located

---

## Settings

**settings.xml** is the heart of the template. As mentioned it is contained in dir/content. It determines and controls a range of settings and features in the template and should be the first file to be modified (after the top level files **sco01.xml and imsmanifest.xml** as described above). This section will explain the nodes in settings.xml in detail.

**courseStorageID**: The settings and a range of other data of the template is stored in the local storage of the user’s computer (similar to but not the same as cookies).

**courseStorageID** is the unique identifier for the part of the local storage that holds the course data. Give this a unique name without spaces or special characters. The identifier is not case-sensitive. A good practice would be the client and the course name – e.g. “GM_Work_Vehicle_Technical_Specifications” – but it doesn’t have to be.

**courseTitle**: The official title of the course as it will be displayed in the header (unless the header html is modified.

**courseSubTitle**: If the course has a subtitle, enter it here. It will be displayed underneath the header unless the header html is modified.

 **version**: This refers to the version of the settings, not the course. Any time you make a change to the settings, you need to change the version number. It does not matter if it’s ascending or descending, just as long as the number changes. The course will read the version number on startup and if it has changed, the local storage on the user’s computer will be updated with the changes that were made to the settings. If the version number is not changed after a change was made to the settings, then the change will not be updated in the local storage and it will not be reflected in the course.

**theme**: This needs to be identical to the theme folder name that holds all the theme-specific css and other files. The course will read this node and automatically find the theme-specific files in the theme directory.

**cookieName**: If the course is not loaded from an LMS then the course progress (score tracking, last viewed page, etc.) is stored in a browser cookie. Enter a unique name that the course will use to create, read and update the cookie.

**completionMethod**: Set this to the desired completion method. The possible and valid values are stated and explained in **settings.xml** itself.

**menuPlacement**: Currently, the template allows the menu to be placed at the top or on the left. Alternatively, it can have no menu at all. Possible, valid values are stated and explained in **settings.xml** itself.

**hasSplashPage**: If the course has an intro or splash page that is not supposed to include the header or other elements that are visible on all other pages, this can be set to “true”. The course will then display a full screen splash page at the beginning of the course. The markup for the splash page is defined in modal_functions.js in the components directory.

**hasGlossary**: If the course has a glossary, this node should be set to true. The markup for the glossary is defined in **modal_functions.js** in the components directory. Once the markup for the glossary is created, it can be opened by placing a button with the id **btnGlossary** in the menu.

**hasResources**: Currently not implemented but will open a page or popup with links to external resources in future iterations of the template.

**hasCards**: Several courses that were built with this template had the specific requirement to display “cards” or “content boxes” that included curated external links. The capability to display cards/content boxes was left in the template and can be activated by entering “true”. Once the course reads that this setting is activated, it will look for and load **card_content.xml**. For details on how to set up pages with cards/content boxes in a course, see the section **card_content.xml** below.

**hasStrings**: Some courses have repetitive text in places such as navigation or instructions. Repetitive text strings can be defined in **strings.xml** and then loaded by setting this node to “true”. For details on how to display strings in the course, see the section **strings.xml** below.

**bookmarking**: This was used in a course that had a launch page that branched off into different courses. The launch page kept track of which pages in which of the branched courses had been visited. Can be disregarded unless a similar setup is required.
