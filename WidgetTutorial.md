# Widget challenge

## Scenario

The busioness stakeholders would like to provide an instant view of the previous
customer ratings for incidents (and other case types). They have an external
ratings database that they would like to use that will be accessed via data
pages provided by Pega Infinity. They would like this to be a utility widget
that appears in the Utilities panel next to the case in their back office
portal. The agents will also need to be able to create new ratings for existing
cases (if one does not already exist) or edit an existing one.

The Constellation Design System must be used and the new widget must provide all
of the functionality simalar to the out-of-the-box widgets.

Based on the Constellation Design Sytem guidelines your designers have provided
the following general guidance for all utiity widgets:

- Use of SummaryList
- Use of View All if list is > 3 items
  - Ability to search items (details to be provided)
  - Ability to perform actions from View All
- Use of actions to display Popover for editing or creating items
- Use of the icons provided by Constellation Design System
- Use of Utility panel count and icon display when collapsed
- Auto-update of count and widget display when new items are added or edited
  - By existing user
  - By another user
  - By some other server process

Specifically for Ratings

- Use of Constellation Design System Ratings component for displaying ratings

- Use of an interactive version of the same created by an in-house team

## Detailed Tasks

### Clone the challenge git repository

1. Clone the repository and update the dependencies

Open a terminal and in a new folder execute the following commands

#### linux/macos

```bash
git clone -b main --single-branch \
https://github.com/niallriddell/constellation-extensions-challenge.git \
sldxcomponents
cd sldxcomponents
npm update
```

#### windows

```cmd
git clone -b main --single-branch ^
https://github.com/niallriddell/constellation-extensions-challenge.git ^
sldxcomponents
cd sldxcomponents
npm update
```

> [!NOTE] If you use SSH with git you will need to adjust the above git clone
> statement accordingly.

You should now have a working dx component builder project that has been
bootstrapped with a component that we will use as the starting point for this
challenge.

1. Start Storybook The first thing we will do is start Storybook and review the
   existing stories provided. In your sldxcomponents folder execute the
   following command:

```bash
npm run startStorybook
```

Storybook will launch and you will see a component containing a single story.
This is a refactored version of the dx component builder case widget.

Leave Storybook runnning. You are now set-up to continue the challenge.

### Replace history data with mock ratings data

1. Open you IDE in your new sldxcomponents project and navigate to the
   **src/components/Sl_DXExtensions_StarRatingWidget** folder.

1. You will see mock data for both history and ratings as well as a
   historyData.tsx and a ratingData.tsx. Open **mock.historyData.ts** and
   **historyData.tsx**

1. Switch to the browser and view the Star Rating Widget story. You will see the
   data being history data being displayed that is sourced from
   **mock.hostoryData.ts**. The **historyData.tsx** fole defined the Table
   component's column schema as well as the history data type and data mapping
   function to map from the api data to the display columns.

1. Mock data, the Table component schema, rating data type and mapping function
   have been created for you in the **mock.ratingData.ts** and
   **ratingData.tsx** files. Open up **index.tsx** and comment out the
   following:

```javascript
  import {
    type HistoryDataItem as DataItem,
    createHistoryTableSchema as createTableSchema,
    HistoryTableRow as TableRow,
    mapHistoryDataItem as mapDataItem
  } from './historyData';
```

and uncomment the following:

```javascript
// import {
//   type RatingDataItem as DataItem,
//   createRatingTableSchema as createTableSchema,
//   RatingTableRow as TableRow,
//   mapRatingDataItem as mapDataItem
// } from './ratingData';
```

1. Save **index.tsx** and observe the changes in Storybook. The parameters being
   passed in to the Story will drive whether the story uses history or rating
   data. So to display the mock rating data and associated columns you can
   change the value in the **listDataPage** control value from 'D_pyWorkHistory'
   to anything else. You will see the ratings displayed. You can change the
   label control value also to "Rating history" to change the table heading
   text.

1. You will see a the mock rating data formatted in the Table. We will be using
   the [Rating component](https://design.pega.com/develop/rating/#Overview) from
   the Constellation Design System to display each rating as a set of stars.
   This component is going to be used for our final component to display any
   non-interactive ratings. [TODO: add screenshot of ratings]

### Replacing Table with SummaryList

1. The Constellation Design System prescribes the usge of
   [SummaryList](https://design.pega.com/develop/summary-list) for displaying
   data. Therefore our first step is to understand what type the data items need
   to be transformed to as currently they are being transformed to the type that
   a Table component expects.

1. Navigate to the
   [SummaryList Properties](https://design.pega.com/develop/summary-list/#Properties)
   component and inspect the component api. We can see that the component takes
   an array of SummaryListItems and this is the only required property.

1. In your project directory in a terminal window type the following:

```bash
git stash
git remote set-branches --add origin tabletosummarylist
git fetch origin tabletosummarylist
git switch tabletosummarylist
```

1. Navigate back to your code directory and open up your IDE in the
   sldxcomponents folder. Open **index.tsx** located in your component's source
   code folder.

> [!NOTE] Storybook story will be broken during editing. This is expected and
> our goal is to get the story working again with the SummaryList component

Comment out the block of code :

```javascript
import { Table, withConfiguration } from "@pega/cosmos-react-core";
```

Comment out the block of code :

```javascript
import type { TableProps } from '@pega/cosmos-react-core/lib/components/Table/Table';
```

Uncomment the following code above the code you've commented out:

```javascript
import {
  SummaryList,
  SummaryListItem,
  withConfiguration,
} from "@pega/cosmos-react-core";
```

Comment out the block of code:

```javascript
import {
  type RatingDataItem as DataItem,
  createRatingTableSchema as createTableSchema,
  RatingTableRow as TableRow,
  mapRatingDataItem as mapDataItem
} from './ratingData';
```

Uncomment the code above:

```javascript
// import {
//   type RatingDataItem as DataItem,
//   mapRatingDataItem as mapDataItem
// } from './ratingData';
```

Comment out the line

```javascript
  const [data, setData] = useState<TableProps<TableRow>['data']>();
```

And uncomment the line above:

```javascript
// const [data, setData] = useState<SummaryListItem[]>();
```

Comment out the line:

```javascript
const columns = createTableSchema(getPConnect);
```

Comment out the block of code :

```javascript
return (
  <Table
    title={pConn.getLocalizedValue(label, "", "")}
    columns={columns}
    data={data}
    loading={isLoading}
    loadingMessage={pConn.getLocalizedValue("Loading data ...")}
  />
);
```

and finally uncomment the following code above the code you've commented out and
save your file:

```javascript
return <SummaryList name={label} items={data ?? []} loading={isLoading} />;
```

1. You will have a Typescript error in your **index.tsx** file, but the
   Storybook story should still compile. It will display the title and a number
   of blank lines. To fix this you need to open the **ratingData.tsx** file and
   do the following:

As we will be using the **SummaryListItem** instead of the **TableProps** and
**DefaultRowData** we can delete the first 4 lines that import **TableProps**
and **DefaultRowData** as these are no longer needed.

Also comment out the following line:

```javascript
import { Rating } from "@pega/cosmos-react-core";
```

and uncomment the blosk above to add the **SummaryListItem** import:

```javascript
// import { Rating, SummaryListItem } from '@pega/cosmos-react-core';
```

Comment out the following block in the file **ratingData.tsx**

```javascript
export const mapRatingDataItem = (
  entry: RatingDataItem,
  index: number
): RatingTableRow => ({
  updated: entry.pxUpdateDateTime
    ? new Date(entry.pxUpdateDateTime).toLocaleString()
    : 'No data',
  rating: (
    <Rating
      value={entry.CustomerRating}
      metaInfo={`${entry.CustomerRating} of ${entry.NumberOfStars}`}
    />
  ),
  caseId: entry.CaseID,
  customerId: entry.CustomerID,
  id: index
});
```

And uncomment the block above:

```javascript
// export const mapRatingDataItem = (
//   entry: RatingDataItem,
//   index: number
// ): SummaryListItem => ({
//   primary: (
//     <Rating
//       value={entry.CustomerRating}
//       metaInfo={`${entry.CustomerRating} of ${entry.NumberOfStars}`}
//     />
//   ),
//   id: `ratingDataItem-${index}`
// });
```

You can now comment out the function **createRatingTableSchema** and save your
file.

You should now see a list of ratings appear in the **SummaryList** in Storybook.

### Updating the SummaryList display with MetaList

1. Execute the following command in your project folder (it should be called
   **sldxcomponents**):

```bash
git stash
git remote set-branches --add origin updatesummarylist
git fetch origin updatesummarylist
git switch updatesummarylist
```

1. Uncomment the following:

```javascript
// registerIcon,
```

```javascript
// import * as star from '@pega/cosmos-react-core/lib/components/Icon/icons/star.icon';
```

```javascript
// registerIcon(star);
```

```javascript
// icon='star'
```

and save your file.

1. Run the following command in a terminal window from your project folder (it
   will be called **sldxcomponents**)

```bash
npm run startStorybook
```

You will now see a **star** icon to the left of **SummaryList** heading

1. Navigate to the **ratingData.tsx** file and uncomment the first multine
   import statement. Comment out the import statement directly below it.

1. In the same file comment out the function called export const
   mapRatingDataItem and uncomment the function with the same name diretly above
   it. Save your file.

You should now see additional rating data displayed in a
[MetaList](https://design.pega.com/develop/meta-list/). The **MetaList**
contains an array of items (components) that will all be displayed on the same
line delimited by a period. This **MetaList** is used frequently in combination
with the **SummaryList**.

### Adding add and edit actions to **SummaryList**

1. Execute the following command in your project folder (it should be called
   **sldxcomponents**):

```bash
git stash
git remote set-branches --add origin fulldatasummarylist
git fetch origin fulldatasummarylist
git switch fulldatasummarylist
```

1. The original code has been cleaned up and refactored. We have also added some
   new files to accelerate the learning process. If you have stopped Storybook
   then restart it using the folllowing command in a terminal in your project
   root folder (**sldcomponents**):

```bash
npm run startStorybook
```

Navigate to [Storybook localhost](http://localhost:6040/) and it will
automatically open the only Story.

1. We will now add the **Action** array used by
   [SummaryListItem](https://design.pega.com/develop/summary-list/#Properties).
   "actions: A set of Actions to render alongside the item. If more than one
   action is passed a consolidated ActionMenu will be generated.". Open
   **index.tsx** and perform the following:

Delete the first line:

```javascript
/* eslint-disable @typescript-eslint/no-unused-vars */
```

Uncomment the following:

```javascript
// useElement,
```

```javascript
// const [dataItem, setDataItem] = useState<DataItem>();
// const [actionTarget, setActionTarget] = useElement<HTMLElement>(null
```

```javascript
// setActionTarget(menuButton ?? e.currentTarget);
// setDataItem(actionDataItem);
```

```javascript
// setActionTarget(menuButton ?? e.currentTarget);
```

Comment out the following

```javascript
actionId && (
  <Text
    variant="h1"
    onClick={() => setActionId(undefined)}
  >{`Click me to dismiss: ${actionId}`}</Text>
);
```

Uncomment out the following

```javascript
// {
//   actionTarget && (
//   <Text
//     variant='h1'
//     onClick={() => setActionTarget(null)}
//   >{`Click me to dismiss: ${actionId}${dataItem ? ':'+dataItem.CaseID : '' }:`}</Text>
// )
```

Save the file.

1. Look at the Storybook story and you will now see the Edit action with the
   **pencil** icon. This action is displayed only against the current case (this
   is provided from the mock api response in **demo.stories.tsx**). Click on the
   pencil icon and observe that a **Text** component displays the **action id**
   below the **SummaryList**. You can click on the text to dismiss the message.
   If you want to try the **Add** action you can change the customerId to
   **Q1234** in the Storybook controls section of the Story.

1. Our next job is to start implementing the action **onClick** handler to
   launch a component to perform the action.

### Adding Popover and update behaviour for actions to **SummaryList**

1. Execute the following command in your project folder (it should be called
   **sldxcomponents**):

```bash
git stash
git remote set-branches --add origin summarylist
git fetch origin summarylist
git switch summarylist
npm update
```

1. We've already provided an implementation of the
   [Popover](https://design.pega.com/design/popover/) component that are "used
   to provide contextual snippets of rich information, menu options, and
   lightweight editing." It is display when the user selects an Action
   associated with a **SummaryListItem** or an action on the **SummaryList**
   itself. Some boilerplate code has been added to demonstrate how to dismiss a
   **Popover** in response to certain events. If Storybook is not already
   running then execute the following command in your project root (this is
   called **sldxcomponents**).

```bash
npm run startStorybook
```

You will see the updated Story that now has the **Popover** component added. To
see the Popover click on the **plus** icon that represents the **Add** action.
The Popover will now display a
[Slider](https://design.pega.com/develop/slider/#Overview) displayed
horizontally. Our ratings have a minimum value of 0 and max value of 5 and the
**Slider** is configured accordingly. The slider component does not yet respond
properly to user input.

1. To allow the slider to update an existing or create a new **CurrentRating**
   data item associated with the **customerId** and we need to configure the
   **onChange** handler for the **Slider**:

Comment out the following

```javascript
() => {};
```

Uncomment the following

```javascript
// (changeValue: number) => setValue(changeValue)
```

Save you file. The **Slider** will now function correctly.

1. The **Slider** works but nothing happens when the **Popover** submit button
   is clicked. We need to add in some code to the
   [Button](https://design.pega.com/develop/button/#Overview) component that's
   configured as the primary 'submit' button for the Popover. To enable in
   memory (we will be adding update and create support for data type instances
   in an upcoming task) updates to the **data** array that will then be used to
   rebuild the **items** for display you need to do the following in
   **index.tsx**:

Delete the following comment on the first line.

```javascript
/* eslint-disable @typescript-eslint/no-unused-vars */
```

Uncomment the following:

```javascript
// setValue(actionDataItem?.CustomerRating ?? 0);
```

also uncomment:

```javascript
// // TODO: Only in memory and not persisted for now so that Storybook story
// // works
// const upsertDataItem = (selectedDataItem: DataItem, changedValue: number) => {
//   if (selectedDataItem.pyGUID) {
//     setData(
//       data.map(dataItemToCheck =>
//         dataItemToCheck.pyGUID === selectedDataItem.pyGUID
//           ? {
//               ...dataItemToCheck,
//               CustomerRating: changedValue,
//               pxUpdateDateTime: new Date().toISOString()
//             }
//           : dataItemToCheck
//       )
//     );
//     return;
//   }
//
//   const newDataItem = {
//     ...selectedDataItem,
//     CustomerRating: changedValue,
//     pyGUID: 'NEW',
//     pxUpdateDateTime: new Date().toISOString()
//   };
//
//   setData([...data, newDataItem]);
// };
```

also uncomment:

```javascript
// if (dataItem) upsertDataItem(dataItem, value);
```

Save your file.

1. Click on the '+' icon and select a rating value then click the submit button.
   You will see that a new item has been appended to the **SummaryList** and
   because the **mock.ratingData.ts** returns a case key (**SL-TELLUSMORE-WORK
   Z-12345**) when the following funciton is called:

```javascript
const caseKey = getPConnect().getCaseInfo().getKey();
```

and a new data item has been added to the **data** array that is used to
rebiuild the **items** array that contains the **SummaryListItems** that are
displayed in the **SummaryList**.

The **createItems** utility function is used to the render the array of type
**SummaryListItem** that are derived from the updated **data** array of
**RatingDataItem**.

```javascript
const items = createItems(data, getPConnect, mapDataItem, onActionItemClick);
```

In this branch we've also added [dayjs](https://www.npmjs.com/package/dayjs)
package to demonstrate displaying ISO 8601 date/times using timezone retrieved
from
[PCore.getEnvironmentInfo().getTimeZone()](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/gettimezone.html).
You can review the implemmentation details in the **ratingItems.tsx** file. You
can change the timezone in **demo.stories.tsx**. Search for 'Europe/London'.

> [!NOTE] This **createItems** function has been created for this challenge.
> It's designed to be as reusable as possible. We will not explain it here, but
> feel free to look at the implementation. If you choose to use any utility
> functions provided here you can, but you will need to thoroughly test them and
> also maintain them in your own code base.

### Replacing Slider with the StarRating Component

1. In this task we will be adding in two a new component. We will replace the
   slider with an interactive version of the
   [Rating](https://design.pega.com/develop/rating/#Overview) component that has
   been built as a DX component specifically for this challenge. This
   interactive component is called **Sl_DXExtensions_StarRating** and has
   already been added to this project branch for you.

First let's get the branch:

```bash
git stash
git remote set-branches --add origin slider_to_starrating
git fetch origin slider_to_starrating
git switch slider_to_starrating
```

1. Open up **index.tsx** and perform the following:

Comment out:

```javascript
  Slider,
```

and uncomment:

```javascript
// import StarRating from '../Sl_DXExtensions_StarRating';,
```

Finally navigate to where the **Slider** component is used and replace the word
Slider with StarRating:

```javascript
<Slider min={0} max={5} value={value} onChange={setValue} />
```

becomes

```javascript
<StarRating min={0} max={5} value={value} onChange={setValue} />
```

Save your file.

In a terminal start Storybook if it's not already running on
<http://localhost:6040>:

```bash
npm run startStorybook
```

1. You will see a new Star Rating Component with two new stories. You can review
   the stories and see how the new component is an interactive version of the
   **Rating** component provided with the Constellation Design System. Now
   navigat to tge Star Rating Widget story and click on the "+" action to create
   a new rating. Observe the Star Rating component has now replaced the
   **Slider**.

### Adding in View All support

1. In this task we will be adding in
   [View all](https://design.pega.com/develop/summary-list/#View-all) support to
   the **SummaryList**.

> [!NOTE] "... a View all Button will render at the bottom of the list. This is
> handy for delaying API requests to retrieve entire lists of data until an
> explicit request is made. It is recommended to use the view all component in
> these situations. This component accepts the same list as the SummaryList, and
> similarly can take actions and loading as well as props related to the
> SearchInput component."

First let's get the branch:

```bash
git stash
git remote set-branches --add origin view_all_implementation
git fetch origin view_all_implementation
git switch view_all_implementation
```

1. First thing you might notice if you examine the code that the **Popover** has
   now been moved out of **index.tsx** and is now it's own component
   **StarRatingPopover.tsx**. This better encapsulates the **Popover** logic and
   set's us up for resuing the component when we launch the **View all** modal
   dialog.

Perform the following actions:

Comment out the following line:

```javascript
items;
```

located in the following code block

```javascript
items = {
  items,
  // items.slice(0, 3)
};
```

Uncomment the following:

```javascript
// items.slice(0, 3)
```

Save your file.

1. In Storybook you will now see a **View all** link displayed under the
   **SummaryList** items. Only the first three items are displayed. The **View
   all** link displays but does not do anything yet.

1. The **View all** link will launch a modal dialog that will display a larger
   number of items and also optionally a search box and any top level actions.
   Perform the following actions to enable View all. In **index.tsx**:

Uncomment all of the following:

```javascript
// useRef,
```

```javascript
// ModalMethods,
```

```javascript
// useModalManager,
```

```javascript
// import { searchByRating, searchByCustomer } from './searchFunctions';
```

```javascript
// import SummaryListViewAllModal, {
//   type SummaryListViewAllProps
// } from './SummaryListViewAllModal';
```

```javascript
// const modalRef = useRef<ModalMethods<SummaryListViewAllProps>>();
```

```javascript
// const { create: createModal } = useModalManager();
```

```javascript
// useEffect(() => {
//   modalRef.current?.update({
//     items: createItems(data, getPConnect, mapDataItem, onActionItemClick)
//   });
// });
```

```javascript
// const openViewAll = () => {
//   // We use a ref here so that we can refresh the modal with any data updates.
//   modalRef.current = createModal<SummaryListViewAllProps>(
//     SummaryListViewAllModal,
//     {
//       name: label,
//       loading: isLoading,
//       items,
//       actions,
//       searchFunction: customerId ? searchByRating : searchByCustomer,
//       currentRating: dataItem,
//       onUpdateRating
//     },
//     {
//       onDismiss: () => {
//         modalRef.current = undefined; // tidy up if modal is dismissed.
//       }
//     }
//   );
// };
```

Comment out the following:

```javascript
() => {};
```

and uncomment the line below:

```javascript
// openViewAll
```

Save your file.

1. Navigate to Storybook and review the **View all** implementation. There is a
   simple number search (this can be any search filter) that will display rating
   less than or equal to the value in the search box. Try it out. You will also
   see that the actions still work and the **Popver** is now displayed reltive
   to the **Modal**.

> [!NOTE] When adopting this pattern for Utility widgets if you have a large
> number of items to display then a different data loading strategy must be
> adopted to avoid performance issues. Consider using paging whn fetching data
> and fetch only the first page when the widget loads and for display in the
> **View all** modal. After the modal loads you can provide the ability to load
> further pages or to reduce the number of items via using a Filter. See
> [getDataAsync](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/getdataasync-datapagename-context-parameters-paging-query-options.html)
> api for how to use Paging and Filtering options.

### Building the UI Authoring experience (component definition)

1. The net task is to build the component definition (also known as the
   **config.json**) that will drive the UI Authoring eperience for our component
   in App Studio. Our requirements are that the we should allow the App Studio
   authors to select the property from the case that uniquely identifes the
   customer in the customer class. Also the ability to select the data class
   that has been configured with the data model for our ratings as well as the
   associated list, lookup and savable data pages.

Navigate to the **config.json** file in your
**Sl_DXExtensions_StarRatingWidget** folder. You will see that this version is
very limited and has a single property configured for "label". This will be the
only property that can be configured by App Studio authors when using our
component. This would make our component very specific to this single
implementation with all of the other data needed by the component having to be
hard-coded into the component itself.

We will be using the
[Component definition](https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/configjson.html)
reference guide to implement a more configurable authoring experience for our
App Authors.

1. Perform the following to get the branch associated with this task:

```bash
git stash
git remote set-branches --add origin configjson
git fetch origin configjson
git switch configjson
```

1. Also start up your academy labs instance so that it's ready. We will be
   publishing this version of our component to view the App Authoring
   experience. No need to log in to the instance as we will do this via DX
   Component Builder prior to publishing our component.

1. Navigate to the **config.json** file in your
   **Sl_DXExtensions_StarRatingWidget** folder. Your IDE may have already loaded
   the updated version if your IDE is still open and the **config.json** file is
   also open.

> [!NOTE] In order to support our authoring experience a number of challenge
> specific rules have created. One of these is a new data page
> (D_GetDataPagesForClassList) that wraps an existing out-of-the-box data page.
> It returns the data pages configured for a specific data class that is passed
> in as a parameter. Currently sourcing a CONTENTPICKER dynamically from a page
> based data page is not supported, so this data page creates a list based data
> page based on the out-of-the-box page based data page.

1. The first addition to our **config.json** is allowing the ability to select a
   PROPERTY that will provide the value stored in that property to our component
   at runtime. We will use the **customerId** value to only show ratings related
   to the current customer that the current case is related to.

```json
    {
      "name": "customerId",
      "label": "Customer unique id property on case",
      "format": "PROPERTY"
    },
```

> [!NOTE] All properties configured in the "properties" array will be resolved
> at runtime and the values selected during UI Authoriing configured will be
> passed into our component at runtime as **props**.

1. Now things get a little bit more involved. We create
   [GROUP](https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/formats.html#d6290e274)
   format that will organise any properties nested within this property together
   in the UI Authoring experience. This GROUP will allow for the selection of
   the data class dynamically sourced using the out-of-the-box data page
   **D_pzDataTypesForApplicationNoWork** as the source for a
   [SELECT](https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/formats.html#d6290e608)
   format. The parameter uses a runtime annotation called **@ENV
   APPLICATION_NAME** that resolves to the curent applicaiton name when the
   authoring epxerience loads for this widget. We also apply a **filter** to
   remove data classes that are not relevant.

```json
          "format": "SELECT",
          "label": "Select the rating class",
          "name": "ratingDataClass",
          "placeholder": " ",
          "defaultValue": " ",
          "source": {
            "name": "D_pzDataTypesForApplicationNoWork",
            "displayProp": "pyLabel",
            "valueProp": "pyMetadataKey",
            "parameters": {
              "AppName": "@ENV APPLICATION_NAME"
            },
            "filter": "$this.pyMetadataKey NOT_STARTS_WITH 'Data-Admin'"
          }
```

1. We then use three dynamic CONTENTPICKERS that will be made visible
   ("$this.ratingDataClass !=' '") and dynamically call the
   **D_GetDataPagesForClassList** data page based on the value selected in the
   SELECT formatted property.

```json

          "format": "CONTENTPICKER",
          "label": "Lookup datapage for rating class",
          "name": "ratingLookupDatapage",
          "visibility": "$this.ratingDataClass !=' '",
          "source": {
            "name": "D_GetDataPagesForClassList",
            "displayProp": "pyLookUpDataPage",
            "valueProp": "pyLookUpDataPage",
            "parameters": {
              "ContextClass": "$this.ratingDataClass",
              "ExcludeLookUp": false,
              "ExcludeList": true,
              "ExcludeSavable": true
            }
          }
```

The parameters drive the data page result. Each result is an array of size one -
so we will need to handle this in our component **props**. There are three
properties of format CONTENTPICKER configured to return the three data pages
configured for the selected data class.

1. The **iconName** property has been hidden as its not intended to be
   configured at UI authoring time in App Studio, but it is needed to disply our
   **star** icon in the Utilities panel in the
   [CaseView](https://design.pega.com/fullPageDemo/?demo=CaseViewDemo). Select
   the link and open up the mock **CaseView** in design.pega.com and collapse
   the utility panel on the right hand side. The icons and counts displayed here
   are not directly delivered by the utility widgets. The icon is specified in
   the **iconName** property and the count of items displayed is initially
   retrieved dynamically at runtime via a data transform extension called
   **pyGetCustomWidgetItemCount**.

Start your academy instance for this challenge (if you have not done soe
already).

Open up your instance in the browser and copy the url up to an including prweb.

In your IDE open **tasks.config.json** and replace the **server** property with
the URL and save your file.

In a terminal window run the following:

```bash
npm run authenticate
```

In the browser window that should appear log in to your academy system with the
following credentials:

---

user: author@sl pass: pega123!

---

1. We will now publish and configure our component:

In a terminal window run the following:

```bash
npn run publish
```

Select the **Sl_DXExtensions_StarRatingWidget** (likely the 2nd option). Accept
the defaults for "Enter ruleset name" and "Enter ruleset version". Select 'y'
for "Generate development build ?".

1. Open App Studio and navigate to the Incident Case Type (Case
   types->Incident). Then open the **UX** tab. After the **Full Page View** tab
   has loaded, navigate down to the section called **Utilities**. Click the **+
   Add** button and enter **Rating** in the filter. Select the **Star Rating
   Widget** and click the **Add** button.

1. Now click on the **Ratings** cog icon to configure the **Ratings Widget**.
   Perform the following configuration.

In the **Customer unique id property on case** navigate to the **Customer** page
in the drop-down and select **Globally unique id**

In the **Data pages for rating class** group, select the **Customer Rating**
frin the **Select the rating class** dropdown.

For the lookup, list and savable data page CONTENTPICKERS select the only item
avalable for each.

Once you've fully configured the Widget click the **Save** button.

1. Click the **Preview** button in App Studio (located in the top right menu
   bar). Create an Incident case by following the **Create** modal dialog
   prompts. The values added are irrelevant as long as you complete the
   **Create** process and the modal dialog is submitted.

1. After completing the **Create** flow you will see the Case View screen. Right
   click in the Case View and click the **Inspect** option at the bottom of the
   pop-up menu. This will open Developer Tools (instructions are for Chrome - if
   you're using a different browser please follow the instructions to open
   Developer Tools for that browser). Please make sure the **Console** is
   visible and that you will be able to see errors in the **Console**.

1. Now, with the console open, click on the **star** icon in the **Case View
   Utilities** panel on the right hand side. You should see an error when the
   **Star Rating Widget** is displayed in bothe the widget and also in an
   **Error boundary** component at the top of the **Case View**. Also there will
   be an error logged to the console.

1. You will see an error **oi {message: 'Request failed with status code 404',
   name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request:
   XMLHttpRequest, …}** with a clickable reference on the right hand-side to the
   source file and line number **index.tsx:165**. Click on this and the source
   code **index.tsx** will be loaded into the **Sources** tab in **Developer
   Tools** at line 165.

1. In the **Sources** tab in **Developer Tools** in the **index.tsx** tab
   navigate to line 62 and add a breakpoint by selecting the line number 62 on
   the left. Select the **Star** icon again in the **Case View** and your
   breakpoint will be activated. If you hover over the **props** variable on
   line 60 you will see the properties you configured in the **config.json**
   populated with the values you configured in App Studio (or withn the default
   values provided in the **config.json**).

```javascript
Object:
"label": "Ratings",
"ratingDataClass": "SL-TellUsMore-Data-CustomerRating",
"iconName": "star",
"customerId": "f926ce4f-8656-41a9-a5ed-fe5d3e6d20b4",
"ratingLookupDatapage": ["D_CustomerRating"],
"ratingListDatapage": ["D_CustomerRatingList"],
"ratingSavableDatapage": ["D_CustomerRatingSavable"],
...
```

As you can see a subset if these align directly with the **config.json** file.
These **props** are not yet mapped to variables in our component so when you try
to load the component an error happens. This is because the list data page is
not yet mapped in our component. This will be our next task.

1. You can now close the App Studio tab and any open **Developer Tools**
   instance related to this challenge.

### Linking the component definition to the code

1. In this task we will take the data provided in the **props** object and map
   it to the appropriate variables in our code.

The important **props** for us to map are:

- **customerId**: This data provides a string that will uniquely idenntify the
  currently selected customer in the case.
- **ratingLookupDatapage**: a string array (of size one) that contains the name
  of the selected lookup data page for the data class
- **ratingListDatapage**: a string array (of size one) that contains the name of
  the selected list data page for the data class
- **ratingSavableDatapage**: a string array (of size one) that contains the name
  of the selected savable data page for the data class

We will use the value in **customerId** as a filter for our list data page so
that we only return ratings for the customer selected in the current case.

We will map the data page arrays to a scalar properties.

1. Perform the following to get the branch associated with this task:

```bash
git stash
git remote set-branches --add origin configjson_toprops
git fetch origin configjson_toprops
git switch configjson_toprops
```

1. First thing to do is to add the properties that we would like to use to our
   interface definitions for our props. Navigate to and open **index.tsx** in
   your **src/components/Sl_DXExtensions_StarRatingWidget** directory.

In **index.tsx** find the code below and uncomment the commented out lines in
the code block

```javascript
export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  customerId?: string;
  // ratingDataClass: string;
  // ratingLookupDatapage: string[];
  // ratingListDatapage: string[];
  // ratingSavableDatapage: string[];
}
```

In **index.tsx** find the code below and uncomment the commented out lines in
the code block

```javascript
const SlDxExtensionsStarRatingWidget = ({
  // ratingDataClass,
  // ratingLookupDatapage,
  // ratingListDatapage,
  // ratingSavableDatapage,
  getPConnect,
  label,
  customerId
}: SlDxExtensionsStarRatingWidgetProps) => {
```

In **index.tsx** find the code below and **comment out the two lines**

```javascript
const list = "D_List";
const savable = "D_Savable";
```

Finally uncomment the following:

```javascript
// const lookup = ratingLookupDatapage[0];
// const list = ratingListDatapage[0];
// const savable = ratingSavableDatapage[0];

// // eslint-disable-next-line no-console
// console.log(ratingDataClass, lookup, list, savable);
```

Save your file.

1. We will now publish our component: Start your academy instance for this
   challenge (if you have not done soe already).

Open up your instance in the browser and copy the url up to an including prweb.

In your IDE open **tasks.config.json** and replace the **server** property with
the URL and save your file.

In a terminal window run the following:

```bash
npm run authenticate
```

In the browser window that should appear log in to your academy system with the
following credentials:

---

user: author@sl pass: pega123!

---

In a terminal window run the following:

```bash
npn run publish
```

Select the **Sl_DXExtensions_StarRatingWidget** (likely the 2nd option). Accept
the defaults for "Enter ruleset name" and "Enter ruleset version". Select 'y'
for "Generate development build ?".

1. Click the **Preview** button in App Studio (located in the top right menu
   bar) and open the case you created in the previous task. You can do this by
   selecting the **clock** icon on the left hand side navigation menu in the
   **Case View**.

1. Expand the Utilities panel (if it's not already expanded). Observe that terhe
   are now no errors from the **Star Rating Widget**. In the console in
   Developer Tools we log out the data class and associated data pages that you
   selected in the previous task.

1. Click on the **+** button on the **Star Rating Widget** to add a new rating
   for this case and customer. Observe that that new rating appears and can also
   be edited. However, the rating does not persist as we've not yet implemented
   updating the underlying data class. We will do this now by implementing the
   **upsert** (update and insert) functionality so that our widget can create
   and update data instances.

### Implementing upsert functionality

1. Perform the following to get the branch associated with this task:

```bash
git stash
git remote set-branches --add origin dataoperations_upsert
git fetch origin dataoperations_upsert
git switch dataoperations_upsert
```

1. We will be updating the **ratingData.ts** file in your widget source folder
   for this task. Open the **ratingData.ts** file in your IDE.

Navigate to the **createRating** function towards the bottom of the file.

Comment out the following block:

```javascript
  rating.guid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
  rating.updateDateTime = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log('createRating:', dataView, rating, context, classId);
  // Tempoary guid purely for mock implementation.
  return rating as Rating;
```

And uncomment the block above:

```javascript
// const optionsObject = {
//   body: {
//     data: {
//       CustomerRating: rating.rating,
//       NumberOfStars: rating.stars,
//       CaseID: rating.caseId,
//       CustomerID: rating.customerId,
//       CaseClassName: rating.caseClass
//     }
//   },
//   queryPayload: {
//     data_view_ID: dataView
//   }
// };
//
// const response = await PCore.getRestClient().invokeRestApi(
//   'createDataObject',
//   optionsObject,
//   context
// );
//
// if (response?.status === 200) {
//   if (classId) {
//     PCore.getPubSubUtils().publish(
//       PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_CREATED,
//       {
//         classId
//       }
//     );
//   }
//   const {
//     CustomerRating,
//     NumberOfStars,
//     CaseID,
//     CustomerID,
//     CaseClassName,
//     pyGUID,
//     pxUpdateDateTime
//   }: RatingData = response.data.responseData;
//
//   return {
//     rating: CustomerRating,
//     stars: NumberOfStars,
//     caseId: CaseID,
//     customerId: CustomerID,
//     caseClass: CaseClassName,
//     guid: pyGUID,
//     udpateDataTime: pxUpdateDateTime
//   } as Rating;
// }
```

1. Save youf file and publish your widget, authenticating again if necessary.

1. Exit **Preview** mode in App Studio and then enter **Preview** again (this
   forces a reload of Constellation and updates your DX Component in App
   Studio). Navigate to an existing cas via **Recents** and add a new rating for
   that case. You will now see the new rating in the **SummaryList**

1. Click on **Data** in the navigation bar on the left had side. Seleect
   **Customer Rating** data type and then select the **Records** tab. Observe
   that a new rating record has been created for the case.

1. Now we need to enable updating an existing rating. Currently it will update
   the rating in memory, but changes will not be persisted to the data class.
   Open up **ratingData.ts** in your IDE.

Navigate to the **updateRating** function above the **createRating** function.

Comment out the following block:

```javascript
  // eslint-disable-next-line no-console
  console.log('createRating:', dataView, rating, context, classId);
  rating.updateDateTime = new Date().toISOString();
  // Tempoary guid purely for mock implementation.
  return rating as Rating;
```

And uncomment the block above:

```javascript
// const optionsObject = {
//   body: {
//     data: {
//       CustomerRating: rating.rating,
//       NumberOfStars: rating.stars,
//       CaseID: rating.caseId,
//       CustomerID: rating.customerId,
//       CaseClassName: rating.caseClass,
//       pyGUID: rating.guid
//     }
//   },
//   queryPayload: {
//     data_view_ID: dataView
//   }
// };
//
// const response = await PCore.getRestClient().invokeRestApi(
//   'updateDataObject',
//   optionsObject,
//   context
// );
//
// if (response?.status === 200) {
//   if (classId) {
//     PCore.getPubSubUtils().publish(
//       PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_UPDATED,
//       {
//         classId
//       }
//     );
//   }
//   const {
//     CustomerRating,
//     NumberOfStars,
//     CaseID,
//     CustomerID,
//     CaseClassName,
//     pyGUID,
//     pxUpdateDateTime
//   }: RatingData = response.data.responseData;
//
//   return {
//     rating: CustomerRating,
//     stars: NumberOfStars,
//     caseId: CaseID,
//     customerId: CustomerID,
//     caseClass: CaseClassName,
//     guid: pyGUID,
//     udpateDataTime: pxUpdateDateTime
//   } as Rating;
// }
```

1. Save your file and publish your widget, authenticating again if necessary.

1. Do the same process as you did for **createRting**, but this time select the
   case that you created a rating for in the previous task. Edit the rating
   using the widget and observe the rating value changing in the **SummaryList**
   as well as in the Customer Rating class.

### Improving the display of the MetaList data

1. Perform the following to get the branch associated with this task:

```bash
git stash
git remote set-branches --add origin improve_secondary_display
git fetch origin improve_secondary_display
git switch improve_secondary_display
```

1. Navigate to and open the file **ratingItems.tsx** located in your widget
   source folder using your IDE.

At the top of this file uncomment the **Link** and comment out the **Text** in
the following block:

```javascript
import {
  // Link,
  Text,
```

Uncomment the following block:

```javascript
// const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
//   PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
//   { caseClassName: dataItem.caseClass },
//   {
//     workID:
//       dataItem.caseId.split(' ').length > 1
//         ? dataItem.caseId.split(' ')[1]
//         : dataItem.caseId
//   }
// );
```

And also uncomment the following:

```javascript
// <Link
//   href={linkURL}
//   variant='link'
//   previewable
//   onPreview={() =>
//     getPConnect().getActionsApi().showCasePreview(dataItem.caseId, {
//       caseClassName: dataItem.caseClass
//     })
//   }
// >
//   {dataItem.caseId.split(' ')[1]}
// </Link>,
```

Finally comment out the following:

```javascript
// prettier-ignore
<Text>{dataItem.caseClass}</Text>, 
<Text>{dataItem.caseId}</Text>
// prettier-ignore-end
```

1. Save your file and publish your widget, authenticating again if necessary.
   Open **Preview** in App Studio to view the updated display for the
   [MetaList](https://design.pega.com/develop/meta-list/#Overview) that is
   displayed below the rating.

When the utilities panel is expanded you can click on the case link to open the
case in preview or in a new tab.

### Adding localization support

1. Perform the following to get the branch associated with this task:

```bash
git stash
git remote set-branches --add origin localization
git fetch origin localization
git switch localization
```

1. Navigate to and open the **localizations.json** file in the widget source
   folder.

In here you will see the strings that we are providing localization keys for
when our component is included in a view:

```json
{
  "fields": {
    "No items": "No items",
    "of": "of",
    "Current case": "Current case",
    "Add": "Add",
    "Edit": "Edit",
    "Remove": "Remove"
  }
}
```

The left part is the key and the right part is the default locale string that
will be used. In our code we refer to the key and if no additional localization
is done then the value of the key will be resolved at runtime by the
Constellation JS engine. Localization is done per view, not per component. We
know in what **View** context our component will be used as it's a constellation
DX CASE widget component and it can only be added to the **pyDetails**
(displayed as Full Page View\*\* in App Studio) View for a specific case type.

1. Start your academy instance and log in using

---

user: author@sl pass: pega123!

---

1. Navigate to the Incident case type and open the UX tab. On the left hand side
   towards the top of the App Studio authoring window you will see a drop-down
   menu called "Preview as". Select DX API from the drop-down menu. You will see
   the view metadata that is resolved at runtime by Constellation. The important
   bit for localization is the localeReference:

```json
{
    "pyDetails": [
        {
            "name": "pyDetails",
            "type": "View",
            "config": {
                "type": "page",
                "template": "CaseView",
                "icon": "polaris-solid",
                "subheader": "@P .pyPreviewTextSingleLine",
                "header": "@P .pyPreviewTextSingleLine",
                "caseClass": "@P .pxObjClass",
                "showIconInHeader": true,
                "showCaseLifecycle": true,
                "ruleClass": "SL-TellUsMore-Work-Incident",
                "localeReference": "@LR SL-TELLUSMORE-WORK-INCIDENT!PAGE!PYDETAILS",
...
```

It's this **localeReference** that we use in our component as the **localeKey**
(excluding the @LR annotation). Our component can be added to multiple case
types, so we need to keep the static part and vary the case type to accomodate
for our widget being added to multiple case types.

```javascript
const className = getPConnect().getCaseInfo().getClasseName();
const localeKey = `${className.toUpperCase()}!PAGE!PYDETAILS`;
```

We then use the **localeKey** in the third parameter of the
[getPConnect().getLocalizedValue()](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/getlocalizedvalue-rawstring-localepath-localerulekey.html)
api call

> [!NOTE] If the widget context was no longer the **pyDetails** PAGE then the
> **localeKey** would have to be dynamically constructed to reflect the View
> context that the component was being use in.

TODO: need to validate how all of this works ....

- Why do I need to pass localeKey for my widget
- Under what circumstances will the View reference be correct.

### Implementing PubSub for Widget count and Data Object events

1. Start your academy instance as we will be using this to demonstrate the
   pubsub capabilities
2. [PubSub Utils](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/apis-pubsubutils-class.html)
   provides an api to publish and subscribe to events. It's used extensively
   across DX components and the
   [CaseView](https://design.pega.com/fullPageDemo/?demo=CaseViewDemo) utilites
   panel subscribes to **WidgetUpdated** event. The payload for this event is
   the following:

```javascript
{
  widget: <Widget Name>,
  count: <number of items>,
  caseID: <pzInskey of case>,
}
```

Open **index.tsx** and uncomment the following block:

```javascript
// PCore.getPubSubUtils().publish('WidgetUpdated', {
//   widget: 'SL_DXEXTENSIONS_STARRATINGWIDGET',
//   count: data.length + 1,
//   caseID: caseKey
// });
```

3. This widget has also been configured to use data events when a data object is
   created or updated. You can use these events for any purpose, but a common
   use case is to display a
   [Toast](https://design.pega.com/design/toast/#Overview). Navigate to
   **ratingData.ts** in your widget source folder and navigate to the
   **updateRating** function.

   You will see that in order to trigger the publication of a data event we need
   to pass in the data class id. We shall do this now.

Uncomment the following code:

```javascript
// upsert(savable, updatedRating, undefined, ratingDataClass).then(rating => {
```

Comment out the line below:

```javascript
upsert(savable, updatedRating).then(rating => {
```

4. To see the events in action we will uncomment our PuSub event subscribers. In
   **index.tsx** uncomment the following:

```javascript
// useEffect(() => {
//   const subCreateId = 'rating-data-create';
//   const subUpdateId = 'rating-data-update';
//   PCore.getPubSubUtils().subscribe(
//     PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_CREATED,
//     // eslint-disable-next-line no-console
//     (payload: any) => console.log(payload),
//     subCreateId
//   );
//   PCore.getPubSubUtils().subscribe(
//     PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_UPDATED,
//     // eslint-disable-next-line no-console
//     (payload: any) => console.log(payload),
//     subUpdateId
//   );
//
//   return () => {
//     PCore.getPubSubUtils().unsubscribe(
//       PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_CREATED,
//       subCreateId
//     );
//     PCore.getPubSubUtils().unsubscribe(
//       PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_UPDATED,
//       subUpdateId
//     );
//   };
// }, []);
```

Save your file.

5. Authenticate and publish your component.

6. Login in to your academy instance via the browser using the credentials

```
// prettier-ignore
user: author@sl
pass: pega123!
// prettier-ignore-end
```

7. Select Preview in the top right hand corner and then navigate to any case via
   the Recents link on the left hand side navigation bar in the CaseView portal.

8. Expand the Utilities panel and update or add a rating for this case.

9. Open the console using DevTools (right click->Inspect) on Chrome and observe
   the message received when the data instance is updated.

### Implementing Websockets support

1. Perform the following to get the branch associated with this task:

```bash
git stash
git remote set-branches --add origin websockets
git fetch origin websockets
git switch websockets
```

1. Navigate to and open the **index.tsx** file in the widget source folder.

Uncomment the following:

```javascript
// debounce,
```

```javascript
// const ratingSubObject = {
//   matcher: 'SL_DXEXTENSIONS_STARRATINGWIDGET',
//   criteria: {
//     ID: customerId ?? ''
//   }
// };
//
// const ratingSubId = PCore.getMessagingServiceManager().subscribe(
//   ratingSubObject,
//   debounce(() => {
//     fetchRatings();
//   }, 10),
//   getPConnect().getContextName()
// );
```

Save your file.

2. Start your academy instance (if you've not already) and once started publish
   the **widget** component (authenticate first):

```bash
npm run authenticate
npm run publish
```

3. Log-in to App Studio using

```
// prettier-ignore
user: author@sl
pass: pega123!
// prettier-ignore-end
```

2. Switch to Dev Studio and launch
