// MODIFY THE FOLLOWING LINES AS NEEDED
var groupTitle = "To be removed";
var groupRow = 2;
var doMatchLogging = true;
var waitTimeApplyGroup = 1000;
var waitTimeScroll = 3000;
// NO CHANGES BELOW THIS LINE!!!
(async() => {
    var matchesTagged = 0;
    var matchList = document.getElementsByTagName("match-entry");
    mainloop: for (let matchIdx = 0; matchIdx < matchList.length; matchIdx++) {
        let presentGroups = matchList[matchIdx].getElementsByClassName("indicatorGroup");
        for (let groupIdx = 0; groupIdx < presentGroups.length; groupIdx++) {
            let title = presentGroups[groupIdx].title;
            if (groupTitle.localeCompare(title.toString()) == 0) {
            if (doMatchLogging)
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
        if (doMatchLogging)
            console.warn("%cTagging match list entry #" + (matchIdx+1) + " "
                + document.getElementsByTagName("match-entry")[matchIdx].getElementsByClassName("userCardImg")[0].title, "background: #222; color: #bada55");
        let btn = matchList[matchIdx].getElementsByClassName("groupAddBtn");
        btn[1].click();
        while (document.getElementsByClassName("calloutContent").length == 0) {await new Promise(r => setTimeout(r, 500));}
        var popup = document.getElementsByClassName("calloutContent");  
        var groupItems = popup.item(0).getElementsByTagName("li");
        var myGroup = groupItems[groupRow].getElementsByClassName("checkbox");
        if (!myGroup[0].checked) {
            myGroup[0].click();
            await new Promise(r => setTimeout(r, waitTimeApplyGroup)); // Allow the request to finish
            matchesTagged++;
        }
        btn[1].click();
    }
    console.warn("Tagging done - a total of " + matchList.length + " matches have been tagged. Last script run tagged " + matchesTagged + " matches.");
}) ()
