// MODIFY THE FOLLOWING LINES AS NEEDED

// The name of the group - this must already exist. Case sensitive!
var GROUPNAME = "fortestonly";

// Set the operation to ADD or REMOVE to either add the tag to the match list or
// remove the tag.
var OPERATION = "ADD";
//var OPERATION = "REMOVE";

// Other settings you can tune
var logTaggedMatches = true;
var logSkippedMatches = false;

// When the script has processed the last match line in the currently loaded set
// of matches it will try to scroll. Use this value (in milliseconds) to
// instruct the script how long to wait after attempting to scroll the list and
// load more matches.
var waitTimeScroll = 3000;

// NO CHANGES BELOW THIS LINE!!! =====================================
// ===================================================================

var hoverOn = new MouseEvent("mouseenter", {
  view: window,
  bubbles: true,
  cancelable: true,
});

var hoverOff = new MouseEvent("mouseleave", {
  view: window,
  bubbles: true,
  cancelable: true,
});

var matchesUpdated = 0;

async function ToggleGroup(toggleOn = true) {
  let wasToggled = false;

  while ($(".sidebarCloseBtn").is(":hidden")) {
    await new Promise((r) => setTimeout(r, 500));
  }
  let groups = $("group-panel .sidebarContent li");
  groups.each(function () {
    let groupName = $(this).find(".name").text();
    if (groupName.localeCompare(GROUPNAME) == 0) {
      $(this).find("[id*=groupPanel_cbxTag]").click();
      wasToggled = true;
      matchesUpdated++;
      return false;
    }
  });

  if (wasToggled) {
    $("group-panel .saveBtn").click();
  } else {
    $("group-panel .closeBtn").click();
  }
  while ($(".sidebarCloseBtn").is(":visible")) {
    await new Promise((r) => setTimeout(r, 500));
  }
}

async function ScrollIfNeeded(matchIdx, waitTime = 3000) {
  let matchList = $("match-entry-updated");
  if (matchIdx + 1 == matchList.length) {
    console.warn(
      "Scrolling to find more matches. Appended list length will be " +
        (matchList.length + 50)
    );
    window.scrollTo(0, window.document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, waitTime));
  }
}

(async () => {
  const ADDOP = "ADD";
  const REMOP = "REMOVE";
  var matchList = document.getElementsByTagName("match-entry-updated");
  if (!matchList.length) {
    console.error(
      "%cNo matches found on page. Exiting.",
      "background: #ff0000; color: #000000"
    );
    return;
  }

  if (
    OPERATION.localeCompare(ADDOP) !== 0 &&
    OPERATION.localeCompare(REMOP) !== 0
  ) {
    console.error(
      "%cInvalid script operation specified. Change to 'ADD' or 'REMOVE'",
      "background: #ff0000; color: #000000"
    );
    return;
  }

  mainloop: for (let matchIdx = 0; matchIdx < matchList.length; matchIdx++) {
    // Use non-jquery method to obtain matchGrid to provent event dispatch issue later
    let matchGrid = matchList[matchIdx].getElementsByClassName("matchGrid")[0]; // One whole match row
    let matchName = matchGrid.querySelector(
      ".mainCol .userCard .userCardContent .userCardTitle"
    ).innerText;
    let hasGroups = false;
    let groupIsPresent = false;

    let skipMatch = false;
    let groups = $(matchGrid).find(".groupAreaDesktopStuff .indicatorGroup");
    hasGroups = groups.length;
    $(groups).each(function () {
      let title = $(this).prop("title");
      if (!title) return;
      if (GROUPNAME.localeCompare(title.toString()) == 0) {
        if (OPERATION.localeCompare(ADDOP) == 0) {
          skipMatch = true;
          if (logSkippedMatches)
            console.warn(
              "Skipping match list entry #" +
                (matchIdx + 1) +
                " " +
                matchName +
                " which already has the group"
            );
        }
        groupIsPresent = true;
        return false;
      }
    });

    if (!hasGroups && OPERATION.localeCompare(REMOP) == 0) {
      skipMatch = true;
      if (logSkippedMatches)
        console.warn(
          "Skipping match list entry #" +
            (matchIdx + 1) +
            " " +
            matchName +
            " with no groups attatched"
        );
    }

    if (skipMatch) {
      await ScrollIfNeeded(i, waitTimeScroll);
      continue mainloop;
    }

    // ==========================================================================

    let matchWasModified = false;

    try {
      if (groupIsPresent && OPERATION.localeCompare(REMOP) == 0) {
        matchGrid
          .querySelector(".groupAreaDesktopStuff .iconEdit")
          .dispatchEvent(hoverOn);
        $("callout-component")
          .last()
          .find("[id*=groupAddEditCallout_removeTag]")[0]
          .click();
        await ToggleGroup(false);
        matchWasModified = true;
      } else if (OPERATION.localeCompare(ADDOP) == 0) {
        if (!hasGroups) {
          // Match has no groups. In this case it is possible to click the add icon to
          // open the side panel.
          matchGrid.querySelector(".sharedDnaStuff .iconAdd").click();
          await ToggleGroup(true);
        } else {
          // Match has groups. Edit button is accessed via hovering on the edit icon.
          matchGrid
            .querySelector(".groupAreaDesktopStuff .iconEdit")
            .dispatchEvent(hoverOn);
          $("callout-component")
            .last()
            .find("[id*=groupAddEditCallout_addTag]")[0]
            .click();
          await ToggleGroup(true);
        }
        matchWasModified = true;
      }

      if (matchWasModified) {
        if (logTaggedMatches)
          console.warn(
            "%cMatch list entry #" +
              (matchIdx + 1) +
              " " +
              matchName +
              " was updated",
            "background: #222; color: #bada55"
          );

        // Clean up messy hoved-based popup menus
        if (
          $("match-entry-updated")
            .eq(matchIdx)
            .find(".matchGrid .sharedDnaStuff .iconAdd").length
        ) {
          matchGrid
            .querySelector(".sharedDnaStuff .iconAdd")
            .dispatchEvent(hoverOn);
          matchGrid
            .querySelector(".sharedDnaStuff .iconAdd")
            .dispatchEvent(hoverOff);
        } else {
          matchGrid
            .querySelector(".groupAreaDesktopStuff .iconEdit")
            .dispatchEvent(hoverOn);
          matchGrid
            .querySelector(".groupAreaDesktopStuff .iconEdit")
            .dispatchEvent(hoverOff);
        }
      } else {
        if (logSkippedMatches)
          console.warn(
            "No changes for match list entry #" +
              (matchIdx + 1) +
              " " +
              matchName
          );
      }
    } finally {
      await ScrollIfNeeded(matchIdx);
    }
  } // end of loop

  console.warn(
    "(Un)tagging done - a total of " +
      matchList.length +
      " matches have been checked. Last script run updated " +
      matchesUpdated +
      " matches."
  );
})();
