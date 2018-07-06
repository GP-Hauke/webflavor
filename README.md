# "WebFlavor" Course Template
### Documentation – v. 3.0
Last modified: 07/05/2018

## Contents
1. Introduction
2. Prerequisite Skills
3. Setup & Configuration
4. Folder Structure
5. Settings
6. HTML Grid Layout

## 1. Introduction
WebFlavor is a development framework for creating responsive HTML5 courses. The framework uses the Grunt JavaScript task runner to build an optimized course output from a set of XML, CSS, and media source files.

## 2. Prerequisite Skills
In order to modify the content of the course, the user needs to have an intermediate understanding of XML, HTML, and the Bootstrap CSS framework. Specifically, the user needs to know how to modify an existing XML document - including addition, removal, and changes of nodes – and how to modify HTML documents that are built upon the “Bootstrap” grid framework. Details will be described in this document.

## 3. Setup & Configuration
Once you have a local clone of the project repository, you can move to setup and configuration.

###3.1 **Install Development Tools**
Open your editor command or terminal tool to the framework development location and enter the following.
*   **npm install**  (Set up the node packages required for development)
*   **npm install** –g grunt  (Install Grunt's command functions, only installed once)

###3.2 **Configure the Project**
*   In **app/dir/themes** add a new theme folder (naming convention: all lower case, underscores instead of spaces. E.g. gm_selling_skills)

*   In **app/settings.json** and set the following fields:
    *   **theme** (this needs to be identical to the name of the theme folder)
    *   **courseTitle** (the main title of the course)
    *   **courseSubTitle** (the sub title of the course. If the course doesn’t have a sub title, remove all characters between quotes)

*   At the project root run **grunt init** to configure the project. This will:
    *   Populate all required fields in the SCORM wrapper files **imsmanifest.xml** and sco01.xml
    *   Add fields to **settings.json** defining the local storage id, cookie name, and course version\
    **Note**: Only run grunt init once per project (unless the settings values change) and do not modify the auto-generated values in settings.json
*   Now the course is set up so you can run **grunt build** to publish and preview the project. This is not a required step for set up, and in practice, you could start working in the code in **app/** after running **grunt init**.


## 4. Folder Structure

```
app
+---dir
¦   +---content
¦   ¦   +---course_content
¦   ¦
¦   +---media
¦   ¦   +---audio
¦   ¦   +---fonts
¦   ¦   +---img
¦   ¦   +---video
¦   ¦
¦   +---themes
¦       +---maroon
¦
¦
+---src
    +---components
    ¦   +---assessments
    ¦   +---content
    ¦   +---navigation
    ¦
    +---css
    ¦   +---components
    ¦   +---interactives
    ¦   +---partials
    ¦
    +---js
    ¦   +---api
    ¦
    +---vendors
```

This section will go into a little more detail about the folder structure and explain which files to modify to make changes to an existing course or create a new course from the template. Development source file are located in the **app** folder.

### 4.1 Top-Level Files:

**index.html** Constitutes the UI shell of the course, holds the navigation menu markup, and initiates the course on the LMS and sets up several other things behind the scenes.

**settings.json** Contains the primary course settings to set the theme, menu,  course title, and other functionality and layout elements. The data is this file populates the imsmanifest.xml and sco01.xml files.

**dir/..** The top two src/.. and dir/.. directories are the two top level folders in the shell that split the course into "Core functionality and frame" and "course specific content." Everything in  dir/.. relates to content specific to the course that is being developed (the actual content, media, and styles used).

**src/..**  Everything in src/.. is related to how the course works on a fundamental level. It contains the home for the js files that deal with functionality on how a user navigates to the next and back, it contains the vendor css and js files, it also contains LMS and SCORM related files, and overall functionality on how different usable components work (such as navigation menu, glossary, or assessments). No material in src/.. pertains to any specific course in terms of content and eLearning.

---

### 4.2 dir/.. Contents:

**content** contains all the course content, including XML files with all information related to the course. Assessment questions and answers are in assessments.xml, glossary terms are in glossary.xml, and so on.
*  **content/course_content**  subfolder contains the XML files that have the HTML markup for course content pages. Since src/.. is responsible for non-specific course functionality, the markup specific to each course is stored here.

**media** contains folders for all course media (audio, fonts, images, videos).
*   **media/img** Contains buttons and interactive media in the interface that isn't specific to any course. They can be customized to fit different styles as needed.
    *   **media/img/assets** contains course-specific images.

**themes** contains a unique folder with CSS files for each of the different themes. The HTML shell has a default "maroon" styling accessed in **themes/maroon**. This folder can be used as a template to create a custom theme for the client or course. The new theme folder names is updated in settings.json

---

### 4.3 src/.. Contents:

**components** contains the remaining js files that are too specific to be in **src/js**. These files reference functionality for specific components rather than the general course, such as assessments, navigation, menu, glossary, modal, etc.

**css** contains CSS files for specific course-level elements, including course components like the footer, glossary, and help, as well as interactives and partials.

**js** contains the js for the core functionality for the backbone of the interface. It includes functions for how the LocalStorage is filled, how data is pulled in, how the user advances to the next page, and tracking.
 *  **js/api** contains the SCORM API wrappers.

**vendors** contains the vendor css and js files stored in their appropriate folders, including Bootstrap, JQuery, and others.

---

## 5.  Settings

The **settings.json** file is the heart of the template. It determines and controls a range of settings and features in the template. This section will explain the nodes in settings.xml in detail.

**theme**: This needs to be identical to the theme folder name in **dir/themes**. The course will read this node and automatically find the theme-specific files in the theme directory.

**courseTitle**: The official title of the course as it will be displayed in the header and other locations, including the generated SCORM files.

**courseSubTitle**: If the course has a subtitle, enter it here. It will be displayed underneath the header unless the header html is modified.

**completionMethod**: Set this to the desired completion method.

**menuPlacement**: Currently, the template allows the menu to be placed at the top or on the left. Alternatively, it can have no menu at all.

**menuStyle**: Sets the menu style; default is **tab**.

**hasMenuLogo**: Toggle the menu logo

**hasHeader**: Toggle the header on or off

**hasSplashPage**: Set to **true** if the course has an intro or splash page without the header or other visible interface elements. The course will display a full screen splash page at the beginning of the course. The markup for the splash page is defined in **modal_functions.js** in the components directory.

**hasResources**: Toggle the resources function

**hasGlossary**: Set to **true** if the course has a glossary. The markup for the glossary is defined in **modal_functions.js** in the components directory. Once the markup for the glossary is created, it can be opened by placing a button with the id **btnGlossary** in the menu.

**hasHelp**: Toggle the help function

**hasAssessments**: Set to **true** if the course has assessments

**hasDragDrops**: Set to **true** if the course has drag and drop interactivity

**hasHotspots**: Set to **true** for the hotspots feature

**bookmarking**: Set to **true** for local bookmarking to track user completion of pages; insert a StorageID for server bookmarking

**trackActions**: Toggle to track actions

**linkTracking**: Toggle to track link clicks

**pageCount**: Use these values to toggle page counting, the storage ID if necessary, and the total number of pages

**vendors**: Toggle vendor support corresponding to the files in **src/vendors**

**courseStorageID**: The unique identifier for course data in local storage. Set to a unique name without spaces or special characters. The identifier is not case-sensitive. A good practice would be the client and the course name – e.g. “GM_Work_Vehicle_Technical_Specifications”

 **version**: This refers to the version of the settings, not the course. Any time you make a change to the settings, you need to change the version number. It does not matter if it’s ascending or descending, just as long as the number changes. The course will read the version number on startup and if it has changed, the local storage on the user’s computer will be updated with the changes that were made to the settings. If the version number is not changed after a change was made to the settings, then the change will not be updated in the local storage and it will not be reflected in the course.

**cookieName**: If the course is not loaded from an LMS then the course progress (score tracking, last viewed page, etc.) is stored in a browser cookie. Enter a unique name that the course will use to create, read, and update the cookie.



## 6. HTML Grid Layout – Powered by Bootstrap

**Basics**

The layout of the entire course is built as a grid of content elements that automatically arrange themselves according to the screen size of the device the course is being viewed on. The CSS grid framework Bootstrap is used to accomplish this.

* **Note:** The pertinent parts of Bootstrap that are used in the course will be described here. For complete documentation of Bootstrap, see http://getbootstrap.com/. For complete and specific documentation of the grid system utilized in the course, see http://getbootstrap.com/css/#grid.

Bootstrap arranges content elements in rows and columns, where each row can have a varying number of content elements divisible by 12. The rows and columns are defined and created by using specific HTML tags and CSS classes in the HTML document.

Bootstrap divides every row up into twelve columns. Each content element can take up any number of these columns. For example, you can have one content item that spans all twelve columns – i.e. the entire width of the content area – or you can have four content items, each taking up three columns, or three content items where two take up five columns and one takes up two columns or any other combination that is divisible by 12. To illustrate this, let’s look at some code examples:

Firstly, rows are represented in the HTML by div elements with the class name row. Rows need to be surrounded by HTML div elements with the class name container. This results in markup of this basic structure:

```
<div class="container">
  <div class=”row”>
  		…
  </div>
  <div class=”row”>
  		…
  </div>
</div>
```

In the above example, we have two empty rows that are set up to contain Bootstrap column content elements that can occupy between 1 and 12 horizontal “spaces” as described above. These column content elements are represented by HTML div elements with specific class names. The class names will determine how the column content elements flow on the page based on the available width of the viewport (i.e. the area of the screen in which the site/course is visible).

To illustrate how these elements work, let’s first look at some of the class names:

**"col-md-1"**

**"col-md-8"**

**"col-xs-6"**

**"col-lg-4"**

 The class names consist of three parts. The first part – ”col” – simply makes this easily identifiable as a column element and all column elements start with it.
 The second part can be one of four infixes: "xs", "sm", "md", "lg". These define the screen width in which a certain element should occupy a certain number of column spaces (see below).
 The third part is any number from 1 to 12. This number defines how many column spaces a certain element should occupy.

 Let’s look at examples:

```
 <div class="container">
  <div class=”row”>
    <div class=”col-xs-12”> … </div>
  </div>
 </div>
```
In this example, the markup defines one column that will occupy all 12 column spaces – i.e. the entire available width of the container – in all screen widths. It will span the entire available container width on large computer screens down to narrow devices like cell phones. Note: The look of column content elements is not determined by these class names. Separate CSS is required for that. The class names only determine the layout. Disregarding additional CSS that would define the design of the elements, the above markup can be represented as the illustration below:

```
<div class="container">
 <div class=”row”>
  <div class=”col-lg-4”>
    …
  </div>
  <div class=”col-lg-5”>
    …
  </div>
  <div class=”col-lg-3”>
    …
  </div>
 </div>
</div>
```

  In this example, the markup defines one row with three column elements. The first element will occupy 4 column spaces, the second 5 column spaces, and the third 3 column spaces. Note that they add up to 12. The ”lg” part of the class name defines that the elements will occupy 4, 5, and 3 column spaces respectively on only large screens. As soon as the screen width falls below a certain value, each of the 3 elements will occupy the full width of the container.

Disregarding additional CSS that would define the design of the elements, the above markup can be represented as the illustration below:

* **Note:** Bootstrap will add gutters (horizontal and vertical spaces) between the elements. They are not displayed here for simplicity.

Keeping in mind the examples above, let’s look at the specific viewport width values that are defined by the "xs", "sm", "md", "lg" parts of the CSS class names.

**xs:** No specified width - the element will be displayed occupying the number of column spaces specified by the number part of the CSS class on all screens, from large computer screens to “extra small” device screens.

**sm:** 768px – the element will be displayed occupying the number of column spaces specified by the number part of the CSS class name as long as the viewport width is 768px and above. Typically, this includes tablets and larger devices in the landscape position but not smaller tablets and cell phones. On screens of 767px and below, the element will occupy the entire width of the container. At this screen width range, Bootstrap will set the width of the container element to 750px.

**md:** 992px – the element will be displayed occupying the number of column spaces specified by the number part of the CSS class name as long as the viewport width is 992px and above. Typically, that only includes computer screens and some oversized tablets. On screens of 991px and below, the element will occupy the entire width of the container. At this screen width range, Bootstrap will set the width of the container element to 970px.

**lg:** 1200px – the element will be displayed occupying the number of column spaces specified by the number part of the CSS class name as long as the viewport width is 1200px and above. That only includes large computer screens. On screens of 1199px and below, the element will occupy the entire width of the container. At this screen width range, Bootstrap will set the width of the container element to 1170px.

**Combining Class Names**

The class names described above can be combined to get even more control over how content elements flow on the page across different devices.

Example:

```
<div class="container">
 <div class=”row”>
  <div class=”col-lg-4 col-md-4 col-sm-3 col-xs-12”>
    …
  </div>
  <div class=”col-lg-5 col-md-4 col-sm-3 col-xs-12”>
    …
  </div>
  <div class=”col-lg-3 col-md-4 col-sm-3 col-xs-12”>
    …
  </div>
 </div>
</div>
```
