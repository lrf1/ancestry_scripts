// MODIFY THE FOLLOWING LINES AS NEEDED
var groupTitle = "To be removed";
var groupRow = 2;
var logTaggedMatches = true;
var logSkippedMatches = false;
var waitTimeApplyGroup = 1000;
var waitTimeScroll = 3000;
// NO CHANGES BELOW THIS LINE!!!
(async() => {
    var matchesTagged = 0;
    var matchList = document.getElementsByTagName("match-entry");
    if (!matchList.length) {
        console.error("%cNo matches found on page. Exiting.", "background: #ff0000; color: #000000");
        return;
    }
    mainloop: for (let matchIdx = 0; matchIdx < matchList.length; matchIdx++) {
        let presentGroups = matchList[matchIdx].getElementsByClassName("indicatorGroupx");
        if (!presentGroups) {
            console.error("%cFailed to get existing group tags for match line " + (matchIdx+1) + ". Skipping.", "background: #ff0000; color: #000000");
            continue mainloop;
        }
        for (let groupIdx = 0; groupIdx < presentGroups.length; groupIdx++) {
            let title = presentGroups[groupIdx].title;
            if (!title) {
                console.error("%cFailed to get group name for match line " + (matchIdx+1) + ". Skipping.", "background: #ff0000; color: #000000");
                continue mainloop;
            }
            if (groupTitle.localeCompare(title.toString()) == 0) {
                if (logSkippedMatches)
                    console.warn("%cSkipping match list entry #" + (matchIdx+1) + " "
                        + document.getElementsByTagName("match-entry")[matchIdx].getElementsByClassName("userCardImg")[0].title, "color: #cccccc");
                if ((matchIdx+1) == matchList.length) {
                    console.warn("%cScrolling to find untagged matches. Appended list length will be " + (matchList.length + 50), "background: #ffff00");
                    window.scrollTo(0, window.document.body.scrollHeight);
                    await new Promise(r => setTimeout(r, waitTimeScroll));
                }
                continue mainloop;
            }
        }
        if (logTaggedMatches)
            console.warn("%cTagging match list entry #" + (matchIdx+1) + " "
                + document.getElementsByTagName("match-entry")[matchIdx].getElementsByClassName("userCardImg")[0].title, "background: #222; color: #bada55");
        let btn = matchList[matchIdx].getElementsByClassName("groupAddBtn");
        if (!btn.length || !btn[1]) {
            console.error("%cMatch line " + (matchIdx+1) + " is missing group selector button. Skipping.", "background: #ff0000; color: #000000");
            continue mainloop;
        }
        btn[1].click();
        while (document.getElementsByClassName("calloutContent").length == 0) {await new Promise(r => setTimeout(r, 500));}
        var popup = document.getElementsByClassName("calloutContent");
        if (!popup.length) {
            console.error("%cCould not find group selector for  match line " + matchIdx + ". Skipping.", "background: #ff0000; color: #000000");
            continue mainloop;            
        }
        var groupItems = popup.item(0).getElementsByTagName("li");
        if (!groupItems.length) {
            console.error("%cCould not read group rows for match line " + matchIdx + ". Skipping.", "background: #ff0000; color: #000000");
            continue mainloop;
        }
        var myGroup = groupItems[groupRow].getElementsByClassName("checkbox");
        if (!myGroup.length) {
            console.error("%cCould not find specified group line for match line " + matchIdx + ". Skipping. Check your settings!", "background: #ff0000; color: #000000");
            continue mainloop;
        }
        if (!myGroup[0].checked) {
            myGroup[0].click();
            await new Promise(r => setTimeout(r, waitTimeApplyGroup)); // Allow the request to finish
            matchesTagged++;
        }
        btn[1].click();
    }
    console.warn("Tagging done - a total of " + matchList.length + " matches have been checked. Last script run tagged " + matchesTagged + " matches.");
}) ()
